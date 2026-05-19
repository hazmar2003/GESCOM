import type { PlanificacionExpediente } from "@/types/models";

export const mockPlanificaciones: PlanificacionExpediente[] = [
  // Expediente 1: Parque Central
  { id: 1, expediente_id: 1, actividad_id: 4, medida_planificada: 2000, frecuencia_veces_mes: 4, tipo_norma: "rendimiento", activo: true, created_at: "2024-01-31T08:00:00Z", updated_at: "2024-01-31T08:00:00Z" },   // Poda de césped
  { id: 2, expediente_id: 1, actividad_id: 6, medida_planificada: 2000, frecuencia_veces_mes: 8, tipo_norma: "rendimiento", activo: true, created_at: "2024-01-31T08:00:00Z", updated_at: "2024-01-31T08:00:00Z" },   // Limpieza general
  { id: 3, expediente_id: 1, actividad_id: 5, medida_planificada: 15, frecuencia_veces_mes: 2, tipo_norma: "rendimiento", activo: true, created_at: "2024-01-31T08:00:00Z", updated_at: "2024-01-31T08:00:00Z" },    // Poda de arbustos
  // Expediente 2: Barrido Zona Centro
  { id: 4, expediente_id: 2, actividad_id: 1, medida_planificada: 5000, frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true, created_at: "2024-01-31T08:00:00Z", updated_at: "2024-01-31T08:00:00Z" },  // Barrido de aceras
  { id: 5, expediente_id: 2, actividad_id: 2, medida_planificada: 2000, frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true, created_at: "2024-01-31T08:00:00Z", updated_at: "2024-01-31T08:00:00Z" },  // Barrido cunetas
  // Expediente 3: Recogida Versalles
  { id: 6, expediente_id: 3, actividad_id: 7, medida_planificada: 8, frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true, created_at: "2024-01-31T08:00:00Z", updated_at: "2024-01-31T08:00:00Z" },    // Recogida domiciliaria
  // Expediente 4: Parque Río Yumurí
  { id: 7, expediente_id: 4, actividad_id: 4, medida_planificada: 3500, frecuencia_veces_mes: 4, tipo_norma: "rendimiento", activo: true, created_at: "2024-02-02T08:00:00Z", updated_at: "2024-02-02T08:00:00Z" },  // Poda de césped
  { id: 8, expediente_id: 4, actividad_id: 6, medida_planificada: 3500, frecuencia_veces_mes: 4, tipo_norma: "rendimiento", activo: true, created_at: "2024-02-02T08:00:00Z", updated_at: "2024-02-02T08:00:00Z" },  // Limpieza general
  // Expediente 5: Barrido Pueblo Nuevo
  { id: 9, expediente_id: 5, actividad_id: 1, medida_planificada: 4000, frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true, created_at: "2024-02-02T08:00:00Z", updated_at: "2024-02-02T08:00:00Z" },  // Barrido aceras
  // Expediente 6: Recogida La Playa
  { id: 10, expediente_id: 6, actividad_id: 7, medida_planificada: 6, frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true, created_at: "2024-03-02T08:00:00Z", updated_at: "2024-03-02T08:00:00Z" },   // Recogida domiciliaria
];
