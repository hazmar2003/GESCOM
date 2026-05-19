import type { Catalogo, TipoActividad, Actividad } from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

// --- Catalogos ---
export async function getCatalogos(): Promise<Catalogo[]> {
  return api("/api/catalogos");
}

export async function createCatalogo(data: Omit<Catalogo, "id" | "created_at" | "updated_at">): Promise<Catalogo> {
  return api("/api/catalogos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCatalogo(id: number, data: Partial<Omit<Catalogo, "id" | "created_at">>): Promise<Catalogo> {
  return api(`/api/catalogos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCatalogo(id: number): Promise<void> {
  await api(`/api/catalogos/${id}`, { method: "DELETE" });
}

// --- Tipos de Actividad ---
export async function getTiposActividad(catalogo_id: number): Promise<TipoActividad[]> {
  const catalogos: (Catalogo & { tipos_actividad: TipoActividad[] })[] = await api("/api/catalogos");
  const cat = catalogos.find((c) => c.id === catalogo_id);
  return cat?.tipos_actividad ?? [];
}

export async function getAllTiposActividad(): Promise<TipoActividad[]> {
  const catalogos: (Catalogo & { tipos_actividad: TipoActividad[] })[] = await api("/api/catalogos");
  return catalogos.flatMap((c) => c.tipos_actividad ?? []);
}

export async function createTipoActividad(data: Omit<TipoActividad, "id" | "created_at" | "updated_at">): Promise<TipoActividad> {
  return api("/api/tipo-actividades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTipoActividad(id: number, data: Partial<Omit<TipoActividad, "id" | "created_at">>): Promise<TipoActividad> {
  return api(`/api/tipo-actividades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTipoActividad(id: number): Promise<void> {
  await api(`/api/tipo-actividades/${id}`, { method: "DELETE" });
}

// --- Actividades ---
export async function getActividades(): Promise<Actividad[]> {
  return api("/api/actividades");
}

export async function getActividadById(id: number): Promise<Actividad | null> {
  return api(`/api/actividades/${id}`);
}

export async function createActividad(data: Omit<Actividad, "id" | "created_at" | "updated_at">): Promise<Actividad> {
  return api("/api/actividades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateActividad(id: number, data: Partial<Omit<Actividad, "id" | "created_at">>): Promise<Actividad> {
  return api(`/api/actividades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteActividad(id: number): Promise<void> {
  await api(`/api/actividades/${id}`, { method: "DELETE" });
}
