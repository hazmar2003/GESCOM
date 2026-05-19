import type { Equipamiento } from "@/types/models";

export const mockEquipamiento: Equipamiento[] = [
  // UEB 1: Matanzas Centro
  { id: 1, nombre: "Camión Recolector Hino", codigo_inventario: "CAM-001", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-05T08:00:00Z", updated_at: "2024-02-05T08:00:00Z" },
  { id: 2, nombre: "Barredora Mecánica Bucher", codigo_inventario: "BAR-001", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-05T08:00:00Z", updated_at: "2024-02-05T08:00:00Z" },
  { id: 3, nombre: "Tractor Agrícola Belarus", codigo_inventario: "TRA-001", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-05T08:00:00Z", updated_at: "2024-02-05T08:00:00Z" },
  { id: 4, nombre: "Cortadora de Césped Honda", codigo_inventario: "COR-001", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-05T08:00:00Z", updated_at: "2024-02-05T08:00:00Z" },
  // UEB 2: Matanzas Norte
  { id: 5, nombre: "Camión Volquete ZIL", codigo_inventario: "CAM-002", ueb_id: 2, empresa_id: 1, activo: true, created_at: "2024-02-05T08:00:00Z", updated_at: "2024-02-05T08:00:00Z" },
  { id: 6, nombre: "Retroexcavadora JCB", codigo_inventario: "RET-001", ueb_id: 2, empresa_id: 1, activo: false, created_at: "2024-02-05T08:00:00Z", updated_at: "2025-03-01T08:00:00Z" },
  // UEB 3: Matanzas Sur
  { id: 7, nombre: "Camión Recolector Mazda", codigo_inventario: "CAM-003", ueb_id: 3, empresa_id: 1, activo: true, created_at: "2024-02-05T08:00:00Z", updated_at: "2024-02-05T08:00:00Z" },
];
