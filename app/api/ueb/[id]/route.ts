import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const ueb = await prisma.uEB.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!ueb) return notFound("UEB");
    return NextResponse.json(ueb);
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
    const existing = await prisma.uEB.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("UEB");
    const ueb = await prisma.uEB.update({
      where: { id: Number(id) },
      data: {
        nombre: body.nombre ?? existing.nombre,
        ubicacion: body.ubicacion !== undefined ? (body.ubicacion ?? null) : existing.ubicacion,
        ...(body.activo !== undefined && { activo: body.activo }),
      },
    });
    return NextResponse.json(ueb);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.uEB.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("UEB");
    await prisma.uEB.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
