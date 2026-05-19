import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const where = auth.rol === "supervisor" && auth.ueb_id
      ? { empresa_id: auth.empresa_id, ueb_id: auth.ueb_id }
      : { empresa_id: auth.empresa_id };

    const equipamiento = await prisma.equipamiento.findMany({
      where,
      include: { ueb: true },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(equipamiento);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const eq = await prisma.equipamiento.create({
      data: {
        nombre: body.nombre,
        codigo_inventario: body.codigo_inventario,
        tipo: body.tipo ?? null,
        ueb_id: body.ueb_id,
        empresa_id: auth.empresa_id,
      },
      include: { ueb: true },
    });
    return NextResponse.json(eq, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
