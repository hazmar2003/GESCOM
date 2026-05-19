import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("gescom_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.sub },
    include: { empresa: true, ueb: true },
  });

  if (!usuario || !usuario.activo) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
  }

  return NextResponse.json({
    usuario: {
      id: usuario.id,
      username: usuario.username,
      nombre: usuario.nombre,
      rol: usuario.rol,
      empresa: {
        id: usuario.empresa.id,
        nombre: usuario.empresa.nombre,
        nombre_corto: usuario.empresa.nombre_corto,
        codigo_empresa: usuario.empresa.codigo_empresa,
      },
      ueb: usuario.ueb
        ? { id: usuario.ueb.id, nombre: usuario.ueb.nombre }
        : null,
    },
  });
}
