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

    const expedientes = await prisma.expediente.findMany({
      where,
      include: {
        ueb: true,
        planificaciones: {
          include: { actividad: true },
        },
      },
      orderBy: { numero_expediente: "asc" },
    });
    return NextResponse.json(expedientes);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const expediente = await prisma.expediente.create({
      data: {
        numero_expediente: body.numero_expediente,
        nombre: body.nombre,
        zona: body.zona ?? null,
        ueb_id: body.ueb_id,
        empresa_id: auth.empresa_id,
        fecha_inicio: new Date(body.fecha_inicio),
        fecha_fin: body.fecha_fin ? new Date(body.fecha_fin) : null,
      },
      include: { ueb: true },
    });
    return NextResponse.json(expediente, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
