import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, forbidden, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

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

const fullInclude = {
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
} as const;

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id: Number(id) },
      include: fullInclude,
    });
    if (!orden) return notFound("Orden de trabajo");
    return NextResponse.json(mapOrdenTrabajo(orden));
  } catch (e) {
    return serverError(e);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.ordenTrabajo.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound("Orden de trabajo");

    // Solo admin puede validar/rechazar; supervisor puede editar solo sus órdenes pendientes
    if (auth.rol === "supervisor" && (body.estado === "validada" || body.estado === "rechazada")) {
      return forbidden();
    }

    const orden = await prisma.ordenTrabajo.update({
      where: { id: Number(id) },
      data: {
        fecha_ejecucion: body.fecha_ejecucion ? new Date(body.fecha_ejecucion) : undefined,
        cantidad_realizada: body.cantidad_realizada,
        estado: body.estado,
        observaciones: body.observaciones ?? null,
        updated_by: auth.sub,
        motivo_modificacion: body.motivo_modificacion ?? null,
        // Reemplazar trabajadores si se envían
        ...(body.trabajador_ids !== undefined && {
          trabajadores: {
            deleteMany: {},
            create: body.trabajador_ids.map((tid: number) => ({ trabajador_id: tid })),
          },
        }),
        // Reemplazar equipamiento si se envía
        ...(body.equipamiento_ids !== undefined && {
          equipamiento: {
            deleteMany: {},
            create: body.equipamiento_ids.map((eid: number) => ({ equipamiento_id: eid })),
          },
        }),
      },
      include: fullInclude,
    });
    return NextResponse.json(mapOrdenTrabajo(orden));
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.ordenTrabajo.findUnique({ where: { id: Number(id) } });
    if (!existing) return notFound("Orden de trabajo");

    // Supervisors can only delete their own pending orders
    if (auth.rol === "supervisor") {
      if (existing.created_by !== auth.sub || existing.estado !== "pendiente") {
        return forbidden();
      }
    }

    await prisma.ordenTrabajo.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
