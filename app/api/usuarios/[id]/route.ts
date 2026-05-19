import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const usuario = await prisma.usuario.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
      include: { ueb: true },
    });
    if (!usuario) return notFound("Usuario");
    const { password_hash: _, ...safe } = usuario;
    return NextResponse.json(safe);
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
    const data: Record<string, unknown> = {
      nombre: body.nombre,
      rol: body.rol,
      ueb_id: body.ueb_id ?? null,
      trabajador_id: body.trabajador_id ?? null,
      activo: body.activo,
    };
    if (body.password) {
      const bcrypt = await import("bcryptjs");
      data.password_hash = await bcrypt.hash(body.password, 10);
    }
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data,
      include: { ueb: true },
    });
    const { password_hash: _, ...safe } = usuario;
    return NextResponse.json(safe);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    await prisma.usuario.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
