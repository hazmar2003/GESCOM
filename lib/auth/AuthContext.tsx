"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { UsuarioPublico, Empresa, UEB, LoginDto } from "@/types/models";

interface AuthState {
  usuario: UsuarioPublico | null;
  empresa: Empresa | null;
  ueb: UEB | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (dto: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    empresa: null,
    ueb: null,
    isLoading: true,
  });

  // Verificar sesión activa al montar (cookie httpOnly validada en el servidor)
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.usuario) {
          setState({
            usuario: data.usuario,
            empresa: data.usuario.empresa,
            ueb: data.usuario.ueb ?? null,
            isLoading: false,
          });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      })
      .catch(() => setState((s) => ({ ...s, isLoading: false })));
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: dto.username, password: dto.password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? "Error de autenticación");
    }

    const data = await res.json();
    setState({
      usuario: data.usuario,
      empresa: data.usuario.empresa,
      ueb: data.usuario.ueb ?? null,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({ usuario: null, empresa: null, ueb: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isAuthenticated: !!state.usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

