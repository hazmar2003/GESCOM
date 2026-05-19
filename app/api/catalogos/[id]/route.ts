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
    const existing = await prisma.catalogo.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Catalogo");

    const numId = Number(id);

    // Si cambia el estado activo, propaga en cascada a tipos y actividades
    if (body.activo !== undefined && body.activo !== existing.activo) {
      await prisma.$transaction([
        prisma.catalogo.update({ where: { id: numId }, data: { nombre: body.nombre ?? existing.nombre, activo: body.activo } }),
        prisma.tipoActividad.updateMany({ where: { catalogo_id: numId }, data: { activo: body.activo } }),
        prisma.actividad.updateMany({ where: { tipo_actividad: { catalogo_id: numId } }, data: { activo: body.activo } }),
      ]);
      const updated = await prisma.catalogo.findUnique({ where: { id: numId }, include: { tipos_actividad: true } });
      return NextResponse.json(updated);
    }

    const catalogo = await prisma.catalogo.update({
      where: { id: numId },
      data: { nombre: body.nombre },
      include: { tipos_actividad: true },
    });
    return NextResponse.json(catalogo);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.catalogo.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Catalogo");
    const numId = Number(id);
    await prisma.$transaction([
      prisma.catalogo.update({ where: { id: numId }, data: { activo: false } }),
      prisma.tipoActividad.updateMany({ where: { catalogo_id: numId }, data: { activo: false } }),
      prisma.actividad.updateMany({ where: { tipo_actividad: { catalogo_id: numId } }, data: { activo: false } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
