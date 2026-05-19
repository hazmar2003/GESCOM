import type { Trabajador } from "@/types/models";

export const mockTrabajadores: Trabajador[] = [
  // UEB 1: Matanzas Centro
  { id: 1, ci: "85031201234", nombre: "Carlos", apellidos: "Rodríguez Peña", cargo: "Operario", fecha_nacimiento: "1985-03-12", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  { id: 2, ci: "90072501234", nombre: "María", apellidos: "González López", cargo: "Inspectora", fecha_nacimiento: "1990-07-25", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  { id: 3, ci: "78110501234", nombre: "José", apellidos: "Martínez Hernández", cargo: "Chofer", fecha_nacimiento: "1978-11-05", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  { id: 4, ci: "95011801234", nombre: "Ana", apellidos: "Díaz Fuentes", cargo: "Auxiliar", fecha_nacimiento: "1995-01-18", ueb_id: 1, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  // UEB 2: Matanzas Norte
  { id: 5, ci: "82093001234", nombre: "Luis", apellidos: "Pérez Castillo", cargo: "Operario", fecha_nacimiento: "1982-09-30", ueb_id: 2, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  { id: 6, ci: "88041401234", nombre: "Rosa", apellidos: "Vargas Núñez", cargo: "Supervisora", fecha_nacimiento: "1988-04-14", ueb_id: 2, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  { id: 7, ci: "75120201234", nombre: "Miguel", apellidos: "Torres Ramos", cargo: "Chofer", fecha_nacimiento: "1975-12-02", ueb_id: 2, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  // UEB 3: Matanzas Sur
  { id: 8, ci: "93062001234", nombre: "Elena", apellidos: "Cruz Medina", cargo: "Auxiliar", fecha_nacimiento: "1993-06-20", ueb_id: 3, empresa_id: 1, activo: true, created_at: "2024-02-01T08:00:00Z", updated_at: "2024-02-01T08:00:00Z" },
  { id: 9, ci: "80020801234", nombre: "Pedro", apellidos: "Morales Gutiérrez", cargo: "Operario", fecha_nacimiento: "1980-02-08", ueb_id: 3, empresa_id: 1, activo: false, created_at: "2024-02-01T08:00:00Z", updated_at: "2025-01-10T08:00:00Z" },
];
