import type { TipoActividad } from "@/types/models";

export const mockTipoActividades: TipoActividad[] = [
  // Catálogo 1: Barrido de Calles
  { id: 1, nombre: "Barrido Manual", catalogo_id: 1, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
  { id: 2, nombre: "Barrido Mecánico", catalogo_id: 1, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
  // Catálogo 2: Áreas Verdes
  { id: 3, nombre: "Poda y Corte", catalogo_id: 2, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
  { id: 4, nombre: "Limpieza de Parques", catalogo_id: 2, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
  // Catálogo 3: Recogida de Desechos
  { id: 5, nombre: "Recogida Domiciliaria", catalogo_id: 3, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
  { id: 6, nombre: "Recogida de Escombros", catalogo_id: 3, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
  // Catálogo 4: Mantenimiento Vial
  { id: 7, nombre: "Reparación de Hoyos", catalogo_id: 4, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
  { id: 8, nombre: "Bacheo", catalogo_id: 4, activo: true, created_at: "2024-01-26T08:00:00Z", updated_at: "2024-01-26T08:00:00Z" },
];
