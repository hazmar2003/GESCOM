import type { Actividad } from "@/types/models";

export const mockActividades: Actividad[] = [
  // Barrido Manual (tipo 1)
  {
    id: 1, codigo: "BM-001", nombre: "Barrido de aceras",
    unidad_medida: "m²", norma_tiempo: 0.5, norma_rendimiento: 2.0,
    tasa_salarial: 1.20, tipo_actividad_id: 1, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  {
    id: 2, codigo: "BM-002", nombre: "Barrido de contenes y cunetas",
    unidad_medida: "ml", norma_tiempo: 0.25, norma_rendimiento: 4.0,
    tasa_salarial: 0.80, tipo_actividad_id: 1, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  // Barrido Mecánico (tipo 2)
  {
    id: 3, codigo: "BM-003", nombre: "Barrido mecánico de calzadas",
    unidad_medida: "km", norma_tiempo: 0.1667, norma_rendimiento: 6.0,
    tasa_salarial: 15.00, tipo_actividad_id: 2, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  // Poda y Corte (tipo 3)
  {
    id: 4, codigo: "AV-001", nombre: "Poda de césped",
    unidad_medida: "m²", norma_tiempo: 0.0333, norma_rendimiento: 30.0,
    tasa_salarial: 0.50, tipo_actividad_id: 3, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  {
    id: 5, codigo: "AV-002", nombre: "Poda de arbustos",
    unidad_medida: "unidad", norma_tiempo: 0.5, norma_rendimiento: 2.0,
    tasa_salarial: 5.00, tipo_actividad_id: 3, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  // Limpieza de Parques (tipo 4)
  {
    id: 6, codigo: "LP-001", nombre: "Limpieza general de parque",
    unidad_medida: "m²", norma_tiempo: 0.1, norma_rendimiento: 10.0,
    tasa_salarial: 0.30, tipo_actividad_id: 4, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  // Recogida Domiciliaria (tipo 5)
  {
    id: 7, codigo: "RD-001", nombre: "Recogida domiciliaria de residuos",
    unidad_medida: "t", norma_tiempo: 2.0, norma_rendimiento: 0.5,
    tasa_salarial: 25.00, tipo_actividad_id: 5, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  // Recogida de Escombros (tipo 6)
  {
    id: 8, codigo: "RE-001", nombre: "Recogida y traslado de escombros",
    unidad_medida: "m³", norma_tiempo: 1.0, norma_rendimiento: 1.0,
    tasa_salarial: 18.00, tipo_actividad_id: 6, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
  // Bacheo (tipo 8)
  {
    id: 9, codigo: "BA-001", nombre: "Bacheo asfáltico",
    unidad_medida: "m²", norma_tiempo: 2.0, norma_rendimiento: 0.5,
    tasa_salarial: 35.00, tipo_actividad_id: 8, empresa_id: 1, activo: true,
    created_at: "2024-01-27T08:00:00Z", updated_at: "2024-01-27T08:00:00Z",
  },
];
