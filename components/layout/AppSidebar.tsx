"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  ClipboardList,
  FolderOpen,
  CalendarDays,
  Building2,
  BookOpen,
  Layers,
  Settings2,
  HardHat,
  Truck,
  Users,
  LockKeyhole,
  type LucideProps,
} from "lucide-react";

type IconComponent = React.FC<LucideProps>;

interface NavItem {
  label: string;
  href: string;
  icon: IconComponent;
}

const adminItems: NavItem[] = [
  { label: "Órdenes de Trabajo",  href: "/admin/ordenes-trabajo",   icon: ClipboardList },
  { label: "Expedientes",         href: "/admin/expedientes",        icon: FolderOpen    },
  { label: "Planificaciones",     href: "/admin/planificaciones",    icon: CalendarDays  },
  { label: "UEB",                 href: "/admin/ueb",                icon: Building2     },
  { label: "Catálogos",           href: "/admin/catalogos",          icon: BookOpen      },
  { label: "Tipo de Actividades", href: "/admin/tipo-actividades",   icon: Layers        },
  { label: "Actividades",         href: "/admin/actividades",        icon: Settings2     },
  { label: "Trabajadores",        href: "/admin/trabajadores",       icon: HardHat       },
  { label: "Equipamiento",        href: "/admin/equipamiento",       icon: Truck         },
  { label: "Usuarios",            href: "/admin/usuarios",           icon: Users         },
  { label: "Cierre Mensual",      href: "/admin/cierres",            icon: LockKeyhole   },
];

const supervisorItems: NavItem[] = [
  { label: "Órdenes de Trabajo", href: "/supervisor/ordenes-trabajo", icon: ClipboardList },
  { label: "Trabajadores",       href: "/supervisor/trabajadores",    icon: HardHat       },
  { label: "Equipamiento",       href: "/supervisor/equipamiento",    icon: Truck         },
];

export function AppSidebar() {
  const { usuario, empresa, ueb } = useAuth();
  const pathname = usePathname();

  const items = usuario?.rol === "admin" ? adminItems : supervisorItems;

  return (
    <aside className="w-64 sticky top-0 h-screen bg-content1 border-r border-divider flex flex-col">
      {/* Logo / Empresa */}
      <div className="px-4 py-4 border-b border-divider flex flex-col items-center text-center">
        <Image
          src="/assets/logo_imagen.png"
          alt="GESCOM"
          width={100}
          height={10}
          className="object-contain mb-2 dark:brightness-0 dark:invert"
          priority
        />
        <p className="text-sm font-bold text-foreground leading-tight">{empresa?.nombre_corto}</p>
        {ueb && (
          <p className="text-xs text-default-500 mt-0.5">{ueb.nombre}</p>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-default-600 hover:bg-default-100 hover:text-foreground",
                  )}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rol badge */}
      <div className="px-4 py-3 border-t border-divider">
        <span
          className={clsx(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
            usuario?.rol === "admin"
              ? "bg-secondary-100 text-secondary-700"
              : "bg-primary-100 text-primary-700",
          )}
        >
          {usuario?.rol === "admin" ? "Administrador" : "Supervisor"}
        </span>
      </div>
    </aside>
  );
}
