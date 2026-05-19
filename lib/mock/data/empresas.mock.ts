import type { Empresa } from "@/types/models";

export const mockEmpresas: Empresa[] = [
  {
    id: 1,
    nombre: "Empresa Municipal de Servicios Comunales de Matanzas",
    nombre_corto: "EMSC Matanzas",
    codigo_empresa: "EMSC-MTZ-001",
    ubicacion: "Calle 85 No. 29008, Matanzas, Cuba",
    telefono: "45-244100",
    email: "emsc.matanzas@gmail.com",
    activo: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 2,
    nombre: "Empresa Municipal de Servicios Comunales de Cárdenas",
    nombre_corto: "EMSC Cárdenas",
    codigo_empresa: "EMSC-CAR-001",
    ubicacion: "Av. Céspedes No. 120, Cárdenas, Matanzas, Cuba",
    telefono: "45-521200",
    email: "emsc.cardenas@gmail.com",
    activo: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
];
