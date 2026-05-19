import type { UsuarioPublico, CreateUsuarioDto } from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getUsuarios(): Promise<UsuarioPublico[]> {
  return api("/api/usuarios");
}

export async function createUsuario(dto: CreateUsuarioDto): Promise<UsuarioPublico> {
  return api("/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function updateUsuario(id: number, data: Partial<CreateUsuarioDto>): Promise<UsuarioPublico> {
  return api(`/api/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function toggleUsuarioActivo(id: number, activo: boolean): Promise<UsuarioPublico> {
  return api(`/api/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activo }),
  });
}
