import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, notFound, serverError } from "@/lib/server/apiHelpers";

type Params = { params: Promise<{ cierre_id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const { cierre_id } = await params;
    const cierre = await prisma.cierreMensual.findFirst({
      where: { id: Number(cierre_id), empresa_id: auth.empresa_id },
      include: {
        usuario: { select: { id: true, username: true, nombre: true } },
        reportes: {
          include: {
            planificacion: {
              include: {
                actividad: true,
                expediente: { include: { ueb: true } },
              },
            },
          },
        },
      },
    });
    if (!cierre) return notFound("Cierre mensual");
    return NextResponse.json(cierre);
  } catch (e) {
    return serverError(e);
  }
}
