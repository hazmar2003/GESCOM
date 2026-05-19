import type { Equipamiento } from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getEquipamiento(): Promise<Equipamiento[]> {
  return api("/api/equipamiento");
}

export async function getEquipamientoById(id: number): Promise<Equipamiento | null> {
  return api(`/api/equipamiento/${id}`);
}

export async function createEquipamiento(data: Omit<Equipamiento, "id" | "created_at" | "updated_at">): Promise<Equipamiento> {
  return api("/api/equipamiento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateEquipamiento(id: number, data: Partial<Omit<Equipamiento, "id" | "created_at">>): Promise<Equipamiento> {
  return api(`/api/equipamiento/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteEquipamiento(id: number): Promise<void> {
  await api(`/api/equipamiento/${id}`, { method: "DELETE" });
}
