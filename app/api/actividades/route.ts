import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const actividades = await prisma.actividad.findMany({
      where: { empresa_id: auth.empresa_id },
      include: {
        tipo_actividad: { include: { catalogo: true } },
      },
      orderBy: { codigo: "asc" },
    });
    return NextResponse.json(actividades);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const actividad = await prisma.actividad.create({
      data: {
        codigo: body.codigo,
        nombre: body.nombre,
        unidad_medida: body.unidad_medida,
        norma_tiempo: body.norma_tiempo,
        norma_rendimiento: body.norma_rendimiento,
        tasa_salarial: body.tasa_salarial,
        tipo_actividad_id: body.tipo_actividad_id,
        empresa_id: auth.empresa_id,
      },
      include: { tipo_actividad: { include: { catalogo: true } } },
    });
    return NextResponse.json(actividad, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
