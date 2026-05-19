import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAuthPayload, unauthorized, serverError } from "@/lib/server/apiHelpers";

// GET /api/usuarios
export async function GET(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth) return unauthorized();
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { empresa_id: auth.empresa_id },
      include: { ueb: true },
      orderBy: { username: "asc" },
    });
    // No devolver password_hash
    const safe = usuarios.map(({ password_hash: _, ...u }) => u);
    return NextResponse.json(safe);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/usuarios
export async function POST(req: NextRequest) {
  const auth = getAuthPayload(req);
  if (!auth || auth.rol !== "admin") return unauthorized();
  try {
    const body = await req.json();
    const bcrypt = await import("bcryptjs");
    const password_hash = await bcrypt.hash(body.password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        username: body.username,
        password_hash,
        nombre: body.nombre,
        rol: body.rol,
        empresa_id: auth.empresa_id,
        ueb_id: body.ueb_id ?? null,
        trabajador_id: body.trabajador_id ?? null,
      },
      include: { ueb: true },
    });
    const { password_hash: _, ...safe } = usuario;
    return NextResponse.json(safe, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
