import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.planificacionExpediente.findFirst({
      where: {
        id: Number(id),
        expediente: { empresa_id: auth.empresa_id },
      },
    });
    if (!existing) return notFound("Planificacion");
    const planificacion = await prisma.planificacionExpediente.update({
      where: { id: Number(id) },
      data: {
        medida_planificada: body.medida_planificada,
        frecuencia_veces_mes: body.frecuencia_veces_mes,
        tipo_norma: body.tipo_norma,
        actividad_id: body.actividad_id,
      },
      include: {
        actividad: true,
        expediente: { include: { ueb: true } },
      },
    });
    return NextResponse.json(planificacion);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.planificacionExpediente.findFirst({
      where: {
        id: Number(id),
        expediente: { empresa_id: auth.empresa_id },
      },
    });
    if (!existing) return notFound("Planificacion");
    await prisma.planificacionExpediente.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
