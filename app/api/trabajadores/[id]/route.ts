import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const trabajador = await prisma.trabajador.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
      include: { ueb: true },
    });
    if (!trabajador) return notFound("Trabajador");
    return NextResponse.json(trabajador);
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
    const existing = await prisma.trabajador.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Trabajador");
    const trabajador = await prisma.trabajador.update({
      where: { id: Number(id) },
      data: {
        ci: body.ci !== undefined ? (body.ci ?? null) : existing.ci,
        nombre: body.nombre ?? existing.nombre,
        apellidos: body.apellidos ?? existing.apellidos,
        cargo: body.cargo !== undefined ? (body.cargo ?? null) : existing.cargo,
        fecha_nacimiento: body.fecha_nacimiento !== undefined
          ? (body.fecha_nacimiento ? new Date(body.fecha_nacimiento) : null)
          : existing.fecha_nacimiento,
        ueb_id: body.ueb_id ?? existing.ueb_id,
        ...(body.activo !== undefined && { activo: body.activo }),
      },
      include: { ueb: true },
    });
    return NextResponse.json(trabajador);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.trabajador.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Trabajador");
    await prisma.trabajador.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
