import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ cierre_id: string }> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReporte(r: any, anio: number, mes: number) {
  return {
    id: r.id,
    cierre_mensual_id: r.cierre_mensual_id,
    planificacion_expediente_id: r.planificacion_expediente_id,
    cantidad_planificada_mes: r.cantidad_planificada_mes,
    cantidad_ejecutada_mes: r.cantidad_ejecutada_mes,
    porcentaje_cumplimiento: r.porcentaje_cumplimiento,
    tasa_salarial_aplicada: r.tasa_salarial_aplicada,
    salario_devengado: r.salario_devengado,
    norma_aplicada: r.norma_aplicada,
    tipo_norma: r.tipo_norma,
    anio,
    mes,
    actividad_nombre: r.planificacion?.actividad?.nombre ?? "",
    actividad_unidad_medida: r.planificacion?.actividad?.unidad_medida ?? "",
    expediente_nombre: r.planificacion?.expediente?.nombre ?? "",
    expediente_numero: r.planificacion?.expediente?.numero_expediente ?? "",
    ueb_nombre: r.planificacion?.expediente?.ueb?.nombre ?? "",
    ueb_id: r.planificacion?.expediente?.ueb_id ?? 0,
    expediente_id: r.planificacion?.expediente_id ?? 0,
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { cierre_id } = await params;
    const cierre = await prisma.cierreMensual.findFirst({
      where: { id: Number(cierre_id), empresa_id: auth.empresa_id },
      include: {
        usuario: { select: { id: true, username: true, nombre: true } },
        reportes: {
          include: {
            planificacion: {
              include: {
                actividad: true,
                expediente: { include: { ueb: true } },
              },
            },
          },
        },
      },
    });
    if (!cierre) return notFound("Cierre mensual");
    const mapped = {
      ...cierre,
      reportes: cierre.reportes.map((r) => mapReporte(r, cierre.anio, cierre.mes)),
    };
    return NextResponse.json(mapped);
  } catch (e) {
    return serverError(e);
  }
}
