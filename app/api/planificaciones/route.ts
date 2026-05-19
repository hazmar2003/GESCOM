import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const expedienteId = new URL(req.url).searchParams.get("expediente_id");

    const where: Record<string, unknown> =
      auth.rol === "supervisor" && auth.ueb_id
        ? { expediente: { ueb_id: auth.ueb_id, empresa_id: auth.empresa_id } }
        : { expediente: { empresa_id: auth.empresa_id } };

    if (expedienteId) {
      where.expediente_id = Number(expedienteId);
    }

    const planificaciones = await prisma.planificacionExpediente.findMany({
      where,
      include: {
        actividad: { include: { tipo_actividad: { include: { catalogo: true } } } },
        expediente: { include: { ueb: true } },
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(planificaciones);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const planificacion = await prisma.planificacionExpediente.create({
      data: {
        expediente_id: body.expediente_id,
        actividad_id: body.actividad_id,
        medida_planificada: body.medida_planificada,
        frecuencia_veces_mes: body.frecuencia_veces_mes,
        tipo_norma: body.tipo_norma ?? "rendimiento",
      },
      include: {
        actividad: true,
        expediente: { include: { ueb: true } },
      },
    });
    return NextResponse.json(planificacion, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
