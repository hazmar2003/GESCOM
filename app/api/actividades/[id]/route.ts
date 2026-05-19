import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { id } = await params;
    const actividad = await prisma.actividad.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
      include: { tipo_actividad: { include: { catalogo: true } } },
    });
    if (!actividad) return notFound("Actividad");
    return NextResponse.json(actividad);
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
    const existing = await prisma.actividad.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Actividad");

    // Validar que si se activa, el catálogo también esté activo
    if (body.activo === true) {
      const withRelations = await prisma.actividad.findFirst({
        where: { id: Number(id) },
        include: { tipo_actividad: { include: { catalogo: true } } },
      });
      if (!withRelations?.tipo_actividad?.catalogo?.activo) {
        return NextResponse.json(
          { error: "No se puede activar una actividad cuyo cat\u00e1logo est\u00e1 desactivado." },
          { status: 400 },
        );
      }
    }

    const actividad = await prisma.actividad.update({
      where: { id: Number(id) },
      data: {
        codigo: body.codigo,
        nombre: body.nombre,
        unidad_medida: body.unidad_medida,
        norma_tiempo: body.norma_tiempo,
        norma_rendimiento: body.norma_rendimiento,
        tasa_salarial: body.tasa_salarial,
        tipo_actividad_id: body.tipo_actividad_id,
        ...(body.activo !== undefined && { activo: body.activo }),
      },
      include: { tipo_actividad: { include: { catalogo: true } } },
    });
    return NextResponse.json(actividad);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const { id } = await params;
    const existing = await prisma.actividad.findFirst({
      where: { id: Number(id), empresa_id: auth.empresa_id },
    });
    if (!existing) return notFound("Actividad");
    await prisma.actividad.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
