import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/server/auth";

/**
 * Extrae y verifica el JWT de la cookie gescom_token.
 * Devuelve el payload si es válido, o null si no lo es.
 */
export function getAuthPayload(req: NextRequest) {
  const token = req.cookies.get("gescom_token")?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export function unauthorized() {
  return NextResponse.json({ error: "No autenticado" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
}

export function notFound(entity = "Recurso") {
  return NextResponse.json({ error: `${entity} no encontrado` }, { status: 404 });
}

export function serverError(e: unknown) {
  console.error(e);
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
}
