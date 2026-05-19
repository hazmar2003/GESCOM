import type {
  OrdenTrabajoDetalle,
  CreateOrdenTrabajoDto,
  UpdateOrdenTrabajoDto,
  ValidarOrdenTrabajoDto,
  EstadoOrdenTrabajo,
} from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getOrdenesTrabajo(
  filtros?: { estado?: EstadoOrdenTrabajo; fecha_desde?: string; fecha_hasta?: string; planificacion_id?: number },
): Promise<OrdenTrabajoDetalle[]> {
  const params = new URLSearchParams();
  if (filtros?.estado) params.set("estado", filtros.estado);
  if (filtros?.fecha_desde) params.set("fecha_desde", filtros.fecha_desde);
  if (filtros?.fecha_hasta) params.set("fecha_hasta", filtros.fecha_hasta);
  if (filtros?.planificacion_id) params.set("planificacion_id", String(filtros.planificacion_id));
  const qs = params.toString();
  return api(`/api/ordenes-trabajo${qs ? `?${qs}` : ""}`);
}

export async function getOrdenTrabajoById(id: number): Promise<OrdenTrabajoDetalle | null> {
  return api(`/api/ordenes-trabajo/${id}`);
}

export async function contarOrdenesPendientesMes(anio: number, mes: number): Promise<number> {
  const params = new URLSearchParams({ anio: String(anio), mes: String(mes) });
  const data = await api(`/api/ordenes-trabajo/pendientes-mes?${params}`);
  return data.count ?? 0;
}

export async function createOrdenTrabajo(dto: CreateOrdenTrabajoDto): Promise<OrdenTrabajoDetalle> {
  return api("/api/ordenes-trabajo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function updateOrdenTrabajo(id: number, dto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajoDetalle> {
  return api(`/api/ordenes-trabajo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function validarOrdenTrabajo(id: number, dto: ValidarOrdenTrabajoDto): Promise<OrdenTrabajoDetalle> {
  return api(`/api/ordenes-trabajo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: dto.estado, motivo_modificacion: dto.motivo_modificacion }),
  });
}

export async function deleteOrdenTrabajo(id: number, motivo: string): Promise<void> {
  await api(`/api/ordenes-trabajo/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ motivo }),
  });
}
