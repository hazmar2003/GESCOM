import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const url = new URL(req.url);
    const preview = url.searchParams.get("preview");
    const anioParam = url.searchParams.get("anio");
    const mesParam = url.searchParams.get("mes");

    // ── Modo preview: calcula el reporte sin cerrar el mes ─────────
    if (preview === "1" && anioParam && mesParam) {
      const anio = Number(anioParam);
      const mes = Number(mesParam);
      const fechaDesde = new Date(anio, mes - 1, 1, 0, 0, 0);
      const fechaHasta = new Date(anio, mes, 0, 23, 59, 59);

      const planificaciones = await prisma.planificacionExpediente.findMany({
        where: {
          activo: true,
          expediente: { empresa_id: auth.empresa_id, activo: true },
        },
        include: {
          actividad: true,
          expediente: { include: { ueb: true } },
        },
      });

      const planIds = planificaciones.map((p) => p.id);
      const ordenesAgrupadas = await prisma.ordenTrabajo.groupBy({
        by: ["planificacion_expediente_id"],
        where: {
          planificacion_expediente_id: { in: planIds },
          estado: "validada",
          fecha_ejecucion: { gte: fechaDesde, lte: fechaHasta },
        },
        _sum: { cantidad_realizada: true },
      });

      const ejecutadoMap = new Map(
        ordenesAgrupadas.map((o) => [o.planificacion_expediente_id, o._sum.cantidad_realizada ?? 0])
      );

      const resultado = planificaciones.map((plan) => {
        const cantidad_ejecutada_mes = ejecutadoMap.get(plan.id) ?? 0;
        const cantidad_planificada_mes = plan.medida_planificada * plan.frecuencia_veces_mes;
        const tasa_salarial_aplicada = plan.actividad.tasa_salarial;
        const salario_devengado = cantidad_ejecutada_mes * tasa_salarial_aplicada;
        const porcentaje_cumplimiento =
          cantidad_planificada_mes > 0 ? (cantidad_ejecutada_mes / cantidad_planificada_mes) * 100 : 0;
        const norma_aplicada =
          plan.tipo_norma === "rendimiento"
            ? plan.actividad.norma_rendimiento
            : plan.actividad.norma_tiempo;

        return {
          id: 0,
          cierre_mensual_id: 0,
          planificacion_expediente_id: plan.id,
          anio,
          mes,
          cantidad_planificada_mes,
          cantidad_ejecutada_mes,
          porcentaje_cumplimiento,
          tasa_salarial_aplicada,
          salario_devengado,
          norma_aplicada,
          tipo_norma: plan.tipo_norma,
          actividad_nombre: plan.actividad.nombre,
          actividad_unidad_medida: plan.actividad.unidad_medida,
          expediente_nombre: plan.expediente.nombre,
          expediente_numero: plan.expediente.numero_expediente,
          ueb_nombre: plan.expediente.ueb.nombre,
          ueb_id: plan.expediente.ueb_id,
          expediente_id: plan.expediente_id,
        };
      });

      return NextResponse.json(resultado);
    }

    // ── Modo normal: lista de cierres ─────────────────────────────
    const cierres = await prisma.cierreMensual.findMany({
      where: { empresa_id: auth.empresa_id },
      include: {
        usuario: { select: { id: true, username: true, nombre: true } },
        reportes: true,
      },
      orderBy: [{ anio: "desc" }, { mes: "desc" }],
    });
    return NextResponse.json(cierres);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const anio: number = body.anio;
    const mes: number = body.mes;

    const fechaDesde = new Date(anio, mes - 1, 1, 0, 0, 0);
    const fechaHasta = new Date(anio, mes, 0, 23, 59, 59);

    // Obtener planificaciones activas de la empresa
    const planificaciones = await prisma.planificacionExpediente.findMany({
      where: {
        activo: true,
        expediente: { empresa_id: auth.empresa_id, activo: true },
      },
      include: { actividad: true },
    });

    // Sumar órdenes validadas del mes agrupadas por planificación
    const planIds = planificaciones.map((p) => p.id);
    const ordenesAgrupadas = await prisma.ordenTrabajo.groupBy({
      by: ["planificacion_expediente_id"],
      where: {
        planificacion_expediente_id: { in: planIds },
        estado: "validada",
        fecha_ejecucion: { gte: fechaDesde, lte: fechaHasta },
      },
      _sum: { cantidad_realizada: true },
    });
    const ejecutadoMap = new Map(
      ordenesAgrupadas.map((o) => [o.planificacion_expediente_id, o._sum.cantidad_realizada ?? 0])
    );

    const cierre = await prisma.$transaction(async (tx) => {
      // 1. Crear el cierre
      const nuevoCierre = await tx.cierreMensual.create({
        data: {
          anio,
          mes,
          empresa_id: auth.empresa_id,
          cerrado_por: auth.sub,
        },
      });

      // 2. Generar reportes por planificación
      const reportesData = planificaciones.map((plan) => {
        const cantidad_ejecutada_mes = ejecutadoMap.get(plan.id) ?? 0;
        const cantidad_planificada_mes = plan.medida_planificada * plan.frecuencia_veces_mes;
        const tasa_salarial_aplicada = plan.actividad.tasa_salarial;
        const salario_devengado = cantidad_ejecutada_mes * tasa_salarial_aplicada;
        const porcentaje_cumplimiento =
          cantidad_planificada_mes > 0 ? (cantidad_ejecutada_mes / cantidad_planificada_mes) * 100 : 0;
        const norma_aplicada =
          plan.tipo_norma === "rendimiento"
            ? plan.actividad.norma_rendimiento
            : plan.actividad.norma_tiempo;
        return {
          cierre_mensual_id: nuevoCierre.id,
          planificacion_expediente_id: plan.id,
          cantidad_planificada_mes,
          cantidad_ejecutada_mes,
          porcentaje_cumplimiento,
          tasa_salarial_aplicada,
          salario_devengado,
          norma_aplicada,
          tipo_norma: plan.tipo_norma,
        };
      });

      if (reportesData.length > 0) {
        await tx.reporteMensualDetalle.createMany({ data: reportesData });
      }

      // 3. Rechazar órdenes pendientes del mes
      await tx.ordenTrabajo.updateMany({
        where: {
          planificacion_expediente_id: { in: planIds },
          estado: "pendiente",
          fecha_ejecucion: { gte: fechaDesde, lte: fechaHasta },
        },
        data: {
          estado: "rechazada",
          motivo_modificacion: "Rechazada automáticamente por cierre mensual",
          updated_by: auth.sub,
        },
      });

      return nuevoCierre;
    });

    return NextResponse.json(cierre, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
