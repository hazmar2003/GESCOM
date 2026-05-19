"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Building2, CircleCheck } from "lucide-react";
import { Button, Input, Chip } from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";

const USUARIOS_DEMO = [
  { username: "admin@matanzas.cu", password: "admin123", label: "Admin — EMSC Matanzas", rol: "admin" },
  { username: "supervisor1@matanzas.cu", password: "super123", label: "Supervisor — UEB Matanzas Centro", rol: "supervisor" },
  { username: "supervisor2@matanzas.cu", password: "super123", label: "Supervisor — UEB Matanzas Norte", rol: "supervisor" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password });
      const stored = localStorage.getItem("emsc_auth");
      if (stored) {
        const { usuario } = JSON.parse(stored);
        router.push(usuario.rol === "admin" ? "/admin/ordenes-trabajo" : "/supervisor/ordenes-trabajo");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (u: (typeof USUARIOS_DEMO)[0]) => {
    setUsername(u.username);
    setPassword(u.password);
    setError("");
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">

      {/* ── Panel izquierdo: marca ── */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col"
        style={{ background: "linear-gradient(160deg, #174f22 0%, #1e6b2e 55%, #22773a 100%)" }}
      >
        {/* Overlay oscuro en dark mode */}
        <div className="absolute inset-0 pointer-events-none dark:bg-black/40 z-[1]" />
        {/* Cuadrícula decorativa */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Círculos de luz */}
        <div
          className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,230,176,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,230,176,0.14) 0%, transparent 70%)" }}
        />

        {/* Contenido centrado */}
        <div className="relative z-[2] flex flex-col items-center justify-center flex-1 px-12 text-center space-y-8">
          <Image
            src="/assets/logo_gesotra.png"
            alt="GESCOM"
            width={300}
            height={90}
            className="object-contain brightness-0 invert drop-shadow-lg"
            priority
          />
{/* 
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">GESCOM</h1>
            <p className="text-white/70 text-base leading-relaxed">
              Sistema de Gestión de<br />Órdenes de Trabajo
            </p>
          </div> */}

          <div className="w-12 h-px bg-white/20" />

          <ul className="space-y-3 text-left">
            {[
              "Control de expedientes y trabajadores",
              "Seguimiento de órdenes de trabajo",
              "Planificación de actividades",
              "Reportes de cierre mensual",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-white/65 text-sm">
                <CircleCheck size={15} className="text-white/40 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Badge inferior */}
        <div className="relative z-[2] pb-6 flex items-center justify-center gap-2 text-white/35 text-xs">
          <Building2 size={12} />
          <span>EMSC · Empresa Municipal de Servicios Comunales · Matanzas</span>
        </div>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-6 py-6 overflow-y-auto">
        <div className="w-full max-w-[380px] space-y-6">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-2">
            <Image
              src="/assets/logo_gesotra.png"
              alt="GESOTRA"
              width={150}
              height={60}
              className="mx-auto object-contain"
              priority
            />
          </div>

          {/* Encabezado */}
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Iniciar sesión</h2>
            <p className="text-sm text-default-500 mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-default-100 shadow-sm p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Correo electrónico"
                placeholder="correo@empresa.cu"
                value={username}
                onValueChange={setUsername}
                isRequired
                autoComplete="username"
                startContent={<Mail size={15} className="text-default-400" />}
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onValueChange={setPassword}
                isRequired
                autoComplete="current-password"
                startContent={<Lock size={15} className="text-default-400" />}
              />

              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-danger-50 border border-danger-100">
                  <span className="text-danger text-sm mt-px">⚠</span>
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full font-semibold"
                isLoading={loading}
              >
                {loading ? "Entrando…" : "Entrar →"}
              </Button>
            </form>
          </div>

          {/* Acceso rápido demo */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-1">
              Acceso rápido — demo
            </p>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-default-100 shadow-sm overflow-hidden divide-y divide-default-50">
              {USUARIOS_DEMO.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => fillDemo(u)}
                  className="w-full text-left px-4 py-3 hover:bg-default-50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">{u.label}</p>
                    <p className="text-xs text-default-400 truncate mt-0.5">{u.username}</p>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={u.rol === "admin" ? "primary" : "default"}
                    className="shrink-0"
                  >
                    {u.rol === "admin" ? "Admin" : "Supervisor"}
                  </Chip>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
