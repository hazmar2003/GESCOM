import type { Expediente, PlanificacionExpediente } from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

// --- Expedientes ---
export async function getExpedientes(): Promise<Expediente[]> {
  return api("/api/expedientes");
}

export async function getExpedienteById(id: number): Promise<Expediente | null> {
  return api(`/api/expedientes/${id}`);
}

export async function createExpediente(data: Omit<Expediente, "id" | "created_at" | "updated_at">): Promise<Expediente> {
  return api("/api/expedientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateExpediente(id: number, data: Partial<Omit<Expediente, "id" | "created_at">>): Promise<Expediente> {
  return api(`/api/expedientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteExpediente(id: number): Promise<void> {
  await api(`/api/expedientes/${id}`, { method: "DELETE" });
}

// --- Planificaciones ---
export async function getPlanificaciones(expediente_id?: number): Promise<PlanificacionExpediente[]> {
  const qs = expediente_id !== undefined ? `?expediente_id=${expediente_id}` : "";
  return api(`/api/planificaciones${qs}`);
}

export async function createPlanificacion(data: Omit<PlanificacionExpediente, "id" | "created_at" | "updated_at">): Promise<PlanificacionExpediente> {
  return api("/api/planificaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updatePlanificacion(id: number, data: Partial<Omit<PlanificacionExpediente, "id" | "created_at">>): Promise<PlanificacionExpediente> {
  return api(`/api/planificaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deletePlanificacion(id: number): Promise<void> {
  await api(`/api/planificaciones/${id}`, { method: "DELETE" });
}
