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
    const existing = await prisma.tipoActividad.findFirst({
      where: {
        id: Number(id),
        catalogo: { empresa_id: auth.empresa_id },
      },
    });
    if (!existing) return notFound("Tipo de actividad");
    const tipo = await prisma.tipoActividad.update({
      where: { id: Number(id) },
      data: {
        nombre: body.nombre ?? existing.nombre,
        catalogo_id: body.catalogo_id ?? existing.catalogo_id,
        ...(body.activo !== undefined && { activo: body.activo }),
      },
      include: { catalogo: true },
    });
    return NextResponse.json(tipo);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.tipoActividad.findFirst({
      where: {
        id: Number(id),
        catalogo: { empresa_id: auth.empresa_id },
      },
    });
    if (!existing) return notFound("Tipo de actividad");
    await prisma.tipoActividad.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
