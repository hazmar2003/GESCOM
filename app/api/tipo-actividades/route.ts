import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const tipos = await prisma.tipoActividad.findMany({
      where: { catalogo: { empresa_id: auth.empresa_id } },
      include: { catalogo: true },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(tipos);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const tipo = await prisma.tipoActividad.create({
      data: {
        nombre: body.nombre,
        catalogo_id: body.catalogo_id,
      },
      include: { catalogo: true },
    });
    return NextResponse.json(tipo, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
