import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const url = new URL(req.url);
    const anio = Number(url.searchParams.get("anio"));
    const mes = Number(url.searchParams.get("mes"));

    const fechaDesde = new Date(anio, mes - 1, 1, 0, 0, 0);
    const fechaHasta = new Date(anio, mes, 0, 23, 59, 59);

    const count = await prisma.ordenTrabajo.count({
      where: {
        estado: "pendiente",
        fecha_ejecucion: { gte: fechaDesde, lte: fechaHasta },
        planificacion: {
          expediente: { empresa_id: auth.empresa_id },
        },
      },
    });

    return NextResponse.json({ count });
  } catch (e) {
    return serverError(e);
  }
}
