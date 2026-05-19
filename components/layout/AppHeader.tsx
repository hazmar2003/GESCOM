"use client";

import { Button } from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";

export function AppHeader() {
  const { usuario, empresa, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-14 bg-content1 border-b border-divider flex items-center justify-between px-6">
      <div>
        <p className="text-sm font-semibold text-foreground">{empresa?.nombre}</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeSwitch />
        <div className="text-right">
          <p className="text-sm font-medium text-foreground leading-tight">{usuario?.username}</p>
          <p className="text-xs text-default-400 capitalize">{usuario?.rol}</p>
        </div>
        <Button size="sm" variant="flat" color="danger" onPress={handleLogout}>
          Salir
        </Button>
      </div>
    </header>
  );
}
