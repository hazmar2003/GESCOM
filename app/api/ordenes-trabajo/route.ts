import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrdenTrabajo(o: any) {
  return {
    id: o.id,
    planificacion_expediente_id: o.planificacion_expediente_id,
    fecha_ejecucion: o.fecha_ejecucion instanceof Date
      ? o.fecha_ejecucion.toISOString().split("T")[0]
      : o.fecha_ejecucion,
    cantidad_realizada: o.cantidad_realizada,
    estado: o.estado,
    observaciones: o.observaciones ?? undefined,
    motivo_modificacion: o.motivo_modificacion ?? undefined,
    created_by: o.created_by,
    updated_by: o.updated_by,
    created_at: o.created_at,
    updated_at: o.updated_at,
    actividad_nombre: o.planificacion?.actividad?.nombre ?? "",
    actividad_unidad_medida: o.planificacion?.actividad?.unidad_medida ?? "",
    expediente_nombre: o.planificacion?.expediente?.nombre ?? "",
    expediente_numero: o.planificacion?.expediente?.numero_expediente ?? "",
    ueb_nombre: o.planificacion?.expediente?.ueb?.nombre ?? "",
    ueb_id: o.planificacion?.expediente?.ueb_id ?? 0,
    creado_por_username: o.creador?.username ?? "",
    trabajadores: (o.trabajadores ?? []).map((r: any) => r.trabajador),
    equipamiento: (o.equipamiento ?? []).map((r: any) => r.equipamiento),
  };
}

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const url = new URL(req.url);
    const estado = url.searchParams.get("estado");
    const planId = url.searchParams.get("planificacion_id");
    const fechaDesde = url.searchParams.get("fecha_desde");
    const fechaHasta = url.searchParams.get("fecha_hasta");

    const where: Record<string, unknown> = {};
    if (estado) where.estado = estado;
    if (planId) where.planificacion_expediente_id = Number(planId);
    if (fechaDesde || fechaHasta) {
      const rango: { gte?: Date; lte?: Date } = {};
      if (fechaDesde) rango.gte = new Date(fechaDesde);
      if (fechaHasta) rango.lte = new Date(fechaHasta + "T23:59:59");
      where.fecha_ejecucion = rango;
    }

    // Restringir al supervisor a su UEB
    if (auth.rol === "supervisor" && auth.ueb_id) {
      where.planificacion = {
        expediente: {
          ueb_id: auth.ueb_id,
          empresa_id: auth.empresa_id,
        },
      };
    } else {
      where.planificacion = {
        expediente: { empresa_id: auth.empresa_id },
      };
    }

    const ordenes = await prisma.ordenTrabajo.findMany({
      where,
      include: {
        planificacion: {
          include: {
            actividad: true,
            expediente: { include: { ueb: true } },
          },
        },
        creador: { select: { id: true, username: true, nombre: true } },
        actualizador: { select: { id: true, username: true, nombre: true } },
        trabajadores: { include: { trabajador: true } },
        equipamiento: { include: { equipamiento: true } },
      },
      orderBy: { fecha_ejecucion: "desc" },
    });
    return NextResponse.json(ordenes.map(mapOrdenTrabajo));
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const body = await req.json();
    const orden = await prisma.ordenTrabajo.create({
      data: {
        planificacion_expediente_id: body.planificacion_expediente_id,
        fecha_ejecucion: new Date(body.fecha_ejecucion),
        cantidad_realizada: body.cantidad_realizada,
        estado: "pendiente",
        observaciones: body.observaciones ?? null,
        created_by: auth.sub,
        updated_by: auth.sub,
        trabajadores: body.trabajador_ids?.length
          ? { create: body.trabajador_ids.map((id: number) => ({ trabajador_id: id })) }
          : undefined,
        equipamiento: body.equipamiento_ids?.length
          ? { create: body.equipamiento_ids.map((id: number) => ({ equipamiento_id: id })) }
          : undefined,
      },
      include: {
        planificacion: {
          include: { actividad: true, expediente: { include: { ueb: true } } },
        },
        trabajadores: { include: { trabajador: true } },
        equipamiento: { include: { equipamiento: true } },
      },
    });
    return NextResponse.json(mapOrdenTrabajo(orden), { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
