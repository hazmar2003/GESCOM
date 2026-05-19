import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const catalogos = await prisma.catalogo.findMany({
      where: { empresa_id: auth.empresa_id },
      include: { tipos_actividad: true },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(catalogos);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const catalogo = await prisma.catalogo.create({
      data: { nombre: body.nombre, empresa_id: auth.empresa_id },
    });
    return NextResponse.json(catalogo, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
