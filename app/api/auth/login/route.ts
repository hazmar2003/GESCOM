import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { comparePassword, signJwt } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { username },
      include: {
        empresa: true,
        ueb: true,
      },
    });

    if (!usuario || !usuario.activo) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, usuario.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Actualizar último login
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimo_login: new Date() },
    });

    const token = signJwt({
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      empresa_id: usuario.empresa_id,
      ueb_id: usuario.ueb_id,
    });

    const response = NextResponse.json({
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        rol: usuario.rol,
        ueb_id: usuario.ueb_id,
        empresa: {
          id: usuario.empresa.id,
          nombre: usuario.empresa.nombre,
          nombre_corto: usuario.empresa.nombre_corto,
          codigo_empresa: usuario.empresa.codigo_empresa,
        },
        ueb: usuario.ueb
          ? {
              id: usuario.ueb.id,
              nombre: usuario.ueb.nombre,
            }
          : null,
      },
    });

    response.cookies.set("gescom_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
