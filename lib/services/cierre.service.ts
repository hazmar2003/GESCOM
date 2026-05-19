import type { CierreMensual, CierreMensualDetalle, ReporteMensualDetalleVista } from "@/types/models";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getCierres(): Promise<CierreMensualDetalle[]> {
  return api("/api/cierres");
}

export async function getCierreById(cierre_id: number): Promise<CierreMensualDetalle | null> {
  return api(`/api/cierres/${cierre_id}`);
}

export async function getMesActualEstado(): Promise<{ anio: number; mes: number; cerrado: boolean }> {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;
  const cierres: CierreMensual[] = await api("/api/cierres");
  const cerrado = cierres.some((c) => c.anio === anio && c.mes === mes);
  return { anio, mes, cerrado };
}

export async function cerrarMes(anio: number, mes: number): Promise<CierreMensual> {
  return api("/api/cierres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ anio, mes }),
  });
}

export async function getReporteCierre(cierre_id: number): Promise<ReporteMensualDetalleVista[]> {
  const cierre = await api(`/api/cierres/${cierre_id}`);
  return cierre.reportes ?? [];
}

export async function getPreviewReporte(
  anio: number,
  mes: number,
): Promise<ReporteMensualDetalleVista[]> {
  const params = new URLSearchParams({ anio: String(anio), mes: String(mes), preview: "1" });
  return api(`/api/cierres?${params}`);
}

export async function contarOrdenesPendientesMes(anio: number, mes: number): Promise<number> {
  const params = new URLSearchParams({ anio: String(anio), mes: String(mes) });
  const data = await api(`/api/ordenes-trabajo/pendientes-mes?${params}`);
  return data.count ?? 0;
}
