import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const cierres = await prisma.cierreMensual.findMany({
      where: { empresa_id: auth.empresa_id },
      include: {
        usuario: { select: { id: true, username: true, nombre: true } },
        reportes: true,
      },
      orderBy: [{ anio: "desc" }, { mes: "desc" }],
    });
    return NextResponse.json(cierres);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const cierre = await prisma.cierreMensual.create({
      data: {
        anio: body.anio,
        mes: body.mes,
        empresa_id: auth.empresa_id,
        cerrado_por: auth.sub,
      },
    });
    return NextResponse.json(cierre, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
