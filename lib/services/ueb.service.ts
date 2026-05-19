import type { UEB } from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getUEBsByEmpresa(): Promise<UEB[]> {
  return api("/api/ueb");
}

export async function getUEBById(id: number): Promise<UEB | null> {
  return api(`/api/ueb/${id}`);
}

export async function createUEB(data: Omit<UEB, "id" | "created_at" | "updated_at">): Promise<UEB> {
  return api("/api/ueb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUEB(id: number, data: Partial<Omit<UEB, "id" | "created_at">>): Promise<UEB> {
  return api(`/api/ueb/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteUEB(id: number): Promise<void> {
  await api(`/api/ueb/${id}`, { method: "DELETE" });
}
