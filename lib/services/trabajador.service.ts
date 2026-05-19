import type { Trabajador } from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getTrabajadores(): Promise<Trabajador[]> {
  return api("/api/trabajadores");
}

export async function getTrabajadorById(id: number): Promise<Trabajador | null> {
  return api(`/api/trabajadores/${id}`);
}

export async function createTrabajador(data: Omit<Trabajador, "id" | "created_at" | "updated_at">): Promise<Trabajador> {
  return api("/api/trabajadores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTrabajador(id: number, data: Partial<Omit<Trabajador, "id" | "created_at">>): Promise<Trabajador> {
  return api(`/api/trabajadores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTrabajador(id: number): Promise<void> {
  await api(`/api/trabajadores/${id}`, { method: "DELETE" });
}
