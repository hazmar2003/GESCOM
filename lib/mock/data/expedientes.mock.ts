import type { Expediente } from "@/types/models";

export const mockExpedientes: Expediente[] = [
  // UEB 1: Matanzas Centro
  { id: 1, numero_expediente: "EXP-2024-001", nombre: "Mantenimiento Parque Central", zona: "Parque Central, Matanzas", ueb_id: 1, empresa_id: 1, fecha_inicio: "2024-01-01", fecha_fin: undefined, activo: true, created_at: "2024-01-30T08:00:00Z", updated_at: "2024-01-30T08:00:00Z" },
  { id: 2, numero_expediente: "EXP-2024-002", nombre: "Barrido Zona Centro", zona: "Calle 83 a Calle 79, Matanzas", ueb_id: 1, empresa_id: 1, fecha_inicio: "2024-01-01", fecha_fin: undefined, activo: true, created_at: "2024-01-30T08:00:00Z", updated_at: "2024-01-30T08:00:00Z" },
  { id: 3, numero_expediente: "EXP-2024-003", nombre: "Recogida Reparto Versalles", zona: "Reparto Versalles", ueb_id: 1, empresa_id: 1, fecha_inicio: "2024-01-01", fecha_fin: undefined, activo: true, created_at: "2024-01-30T08:00:00Z", updated_at: "2024-01-30T08:00:00Z" },
  // UEB 2: Matanzas Norte
  { id: 4, numero_expediente: "EXP-2024-004", nombre: "Mantenimiento Parque Río Yumurí", zona: "Ribera Río Yumurí, Matanzas Norte", ueb_id: 2, empresa_id: 1, fecha_inicio: "2024-02-01", fecha_fin: undefined, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  { id: 5, numero_expediente: "EXP-2024-005", nombre: "Barrido Reparto Pueblo Nuevo", zona: "Reparto Pueblo Nuevo", ueb_id: 2, empresa_id: 1, fecha_inicio: "2024-02-01", fecha_fin: undefined, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  // UEB 3: Matanzas Sur
  { id: 6, numero_expediente: "EXP-2024-006", nombre: "Recogida La Playa", zona: "Reparto La Playa", ueb_id: 3, empresa_id: 1, fecha_inicio: "2024-03-01", fecha_fin: "2026-12-31", activo: true, created_at: "2024-03-01T08:00:00Z", updated_at: "2024-03-01T08:00:00Z" },
];
