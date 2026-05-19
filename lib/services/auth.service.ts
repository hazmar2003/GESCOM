import { delay } from "@/lib/mock/delay";
import { mockUsuarios } from "@/lib/mock/data/usuarios.mock";
import { mockEmpresas } from "@/lib/mock/data/empresas.mock";
import { mockUEBs } from "@/lib/mock/data/ueb.mock";
import type { LoginDto, LoginResponse } from "@/types/models";

export async function login(dto: LoginDto): Promise<LoginResponse> {
  await delay();
  const usuario = mockUsuarios.find(
    (u) => u.username === dto.username && u.password_hash === dto.password && u.activo,
  );
  if (!usuario) throw new Error("Credenciales incorrectas o usuario inactivo.");

  const empresa = mockEmpresas.find((e) => e.id === usuario.empresa_id);
  if (!empresa) throw new Error("Empresa no encontrada.");

  const ueb = usuario.ueb_id
    ? mockUEBs.find((u) => u.id === usuario.ueb_id)
    : undefined;

  // No devolvemos password_hash al cliente
  const { password_hash: _, ...usuarioPublico } = usuario;

  return { usuario: usuarioPublico, empresa, ueb };
}
