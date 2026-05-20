import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, forbidden, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const where = auth.rol === "supervisor" && auth.ueb_id
      ? { empresa_id: auth.empresa_id, ueb_id: auth.ueb_id }
      : { empresa_id: auth.empresa_id };

    const trabajadores = await prisma.trabajador.findMany({
      where,
      include: { ueb: true },
      orderBy: [{ apellidos: "asc" }, { nombre: "asc" }],
    });
    return NextResponse.json(trabajadores);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const body = await req.json();
    // Supervisor can only create workers for their own UEB
    if (auth.rol === "supervisor") {
      if (!auth.ueb_id || body.ueb_id !== auth.ueb_id) return forbidden();
    }
    const trabajador = await prisma.trabajador.create({
      data: {
        ci: body.ci ?? null,
        nombre: body.nombre,
        apellidos: body.apellidos,
        cargo: body.cargo ?? null,
        fecha_nacimiento: body.fecha_nacimiento ? new Date(body.fecha_nacimiento) : null,
        ueb_id: body.ueb_id,
        empresa_id: auth.empresa_id,
      },
      include: { ueb: true },
    });
    return NextResponse.json(trabajador, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
