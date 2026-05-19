import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const expediente = await prisma.expediente.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
      include: {
        ueb: true,
        planificaciones: { include: { actividad: true } },
      },
    });
    if (!expediente) return notFound("Expediente");
    return NextResponse.json(expediente);
  } catch (e) {
    return serverError(e);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.expediente.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Expediente");
    const expediente = await prisma.expediente.update({
      where: { id: Number(id) },
      data: {
        numero_expediente: body.numero_expediente ?? existing.numero_expediente,
        nombre: body.nombre ?? existing.nombre,
        zona: body.zona !== undefined ? (body.zona ?? null) : existing.zona,
        ueb_id: body.ueb_id ?? existing.ueb_id,
        fecha_inicio: body.fecha_inicio ? new Date(body.fecha_inicio) : existing.fecha_inicio,
        fecha_fin: body.fecha_fin !== undefined ? (body.fecha_fin ? new Date(body.fecha_fin) : null) : existing.fecha_fin,
        ...(body.activo !== undefined && { activo: body.activo }),
      },
      include: { ueb: true },
    });
    return NextResponse.json(expediente);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.expediente.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Expediente");
    await prisma.expediente.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
