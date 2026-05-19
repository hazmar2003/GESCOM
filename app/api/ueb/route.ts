import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const uebs = await prisma.uEB.findMany({
      where: { empresa_id: auth.empresa_id },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(uebs);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const ueb = await prisma.uEB.create({
      data: {
        nombre: body.nombre,
        ubicacion: body.ubicacion ?? null,
        empresa_id: auth.empresa_id,
      },
    });
    return NextResponse.json(ueb, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
