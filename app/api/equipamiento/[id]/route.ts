import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const eq = await prisma.equipamiento.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
      include: { ueb: true },
    });
    if (!eq) return notFound("Equipamiento");
    return NextResponse.json(eq);
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
    const existing = await prisma.equipamiento.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Equipamiento");
    const eq = await prisma.equipamiento.update({
      where: { id: Number(id) },
      data: {
        nombre: body.nombre ?? existing.nombre,
        codigo_inventario: body.codigo_inventario ?? existing.codigo_inventario,
        tipo: body.tipo !== undefined ? (body.tipo ?? null) : existing.tipo,
        ueb_id: body.ueb_id ?? existing.ueb_id,
        ...(body.activo !== undefined && { activo: body.activo }),
      },
      include: { ueb: true },
    });
    return NextResponse.json(eq);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.equipamiento.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Equipamiento");
    await prisma.equipamiento.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
