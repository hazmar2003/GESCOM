import type { Usuario } from "@/types/models";

// Contraseñas en texto plano para mocks (en producción sería bcrypt hash)
// admin@matanzas.cu → admin123
// supervisor1@matanzas.cu → super123
// supervisor2@matanzas.cu → super123

export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    username: "admin@matanzas.cu",
    password_hash: "admin123",
    rol: "admin",
    empresa_id: 1,
    ueb_id: null,
    trabajador_id: null,
    activo: true,
    ultimo_login: "2026-05-06T09:15:00Z",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2026-05-06T09:15:00Z",
  },
  {
    id: 2,
    username: "supervisor1@matanzas.cu",
    password_hash: "super123",
    rol: "supervisor",
    empresa_id: 1,
    ueb_id: 1,
    trabajador_id: 1,
    activo: true,
    ultimo_login: "2026-05-07T07:30:00Z",
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2026-05-07T07:30:00Z",
  },
  {
    id: 3,
    username: "supervisor2@matanzas.cu",
    password_hash: "super123",
    rol: "supervisor",
    empresa_id: 1,
    ueb_id: 2,
    trabajador_id: 5,
    activo: true,
    ultimo_login: "2026-05-07T08:00:00Z",
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2026-05-07T08:00:00Z",
  },
  {
    id: 4,
    username: "admin@cardenas.cu",
    password_hash: "admin123",
    rol: "admin",
    empresa_id: 2,
    ueb_id: null,
    trabajador_id: null,
    activo: true,
    ultimo_login: null,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
];
