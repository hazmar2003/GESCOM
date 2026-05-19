"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Divider, Spinner, Chip } from "@/components/ui/compat";
import { getOrdenesTrabajo } from "@/lib/services/orden-trabajo.service";
import { getMesActualEstado, getCierres } from "@/lib/services/cierre.service";
import { getTrabajadores } from "@/lib/services/trabajador.service";
import { getExpedientes } from "@/lib/services/expediente.service";
import { useAuth } from "@/lib/auth/AuthContext";

interface KPIs {
  ordenesPendientes: number;
  ordenesValidadas: number;
  totalTrabajadores: number;
  totalExpedientes: number;
  mesCerrado: boolean;
  anio: number;
  mes: number;
  totalCierres: number;
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function AdminDashboard() {
  const { empresa } = useAuth();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresa) return;
    const eid = empresa.id;
    Promise.all([
      getOrdenesTrabajo(),
      getMesActualEstado(),
      getTrabajadores(),
      getExpedientes(),
      getCierres(),
    ]).then(([ordenes, mesEstado, trabajadores, expedientes, cierres]) => {
      setKpis({
        ordenesPendientes: ordenes.filter((o) => o.estado === "pendiente").length,
        ordenesValidadas: ordenes.filter((o) => o.estado === "validada").length,
        totalTrabajadores: trabajadores.length,
        totalExpedientes: expedientes.length,
        mesCerrado: mesEstado.cerrado,
        anio: mesEstado.anio,
        mes: mesEstado.mes,
        totalCierres: cierres.length,
      });
    }).finally(() => setLoading(false));
  }, [empresa]);

  if (loading) return <div className="flex justify-center py-20"><Spinner label="Cargando panel..." /></div>;
  if (!kpis) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-default-500 text-sm mt-1">Resumen general del sistema — {empresa?.nombre}</p>
      </div>

      {/* Estado del mes */}
      <Card className={kpis.mesCerrado ? "border border-danger-200" : "border border-success-200"}>
        <CardBody className="flex flex-row items-center gap-4 py-3">
          <div className="flex-1">
            <p className="text-sm text-default-500">Mes actual</p>
            <p className="font-semibold text-lg">{MESES[kpis.mes - 1]} {kpis.anio}</p>
          </div>
          <Chip color={kpis.mesCerrado ? "danger" : "success"} variant="flat" size="lg">
            {kpis.mesCerrado ? "Cerrado" : "Abierto"}
          </Chip>
        </CardBody>
      </Card>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Órdenes pendientes" value={kpis.ordenesPendientes} color="warning" />
        <StatCard label="Órdenes validadas" value={kpis.ordenesValidadas} color="success" />
        <StatCard label="Trabajadores activos" value={kpis.totalTrabajadores} color="primary" />
        <StatCard label="Expedientes activos" value={kpis.totalExpedientes} color="secondary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="font-semibold">Cierres mensuales</h2></CardHeader>
          <Divider />
          <CardBody>
            <p className="text-3xl font-bold">{kpis.totalCierres}</p>
            <p className="text-sm text-default-500 mt-1">períodos cerrados en total</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><h2 className="font-semibold">Accesos rápidos</h2></CardHeader>
          <Divider />
          <CardBody className="space-y-1 text-sm">
            <a href="/admin/ordenes-trabajo" className="block text-primary hover:underline">→ Gestionar órdenes de trabajo</a>
            <a href="/admin/expedientes" className="block text-primary hover:underline">→ Ver expedientes</a>
            <a href="/admin/planificaciones" className="block text-primary hover:underline">→ Planificaciones</a>
            <a href="/admin/cierres" className="block text-primary hover:underline">→ Cierres mensuales</a>
            <a href="/admin/reportes" className="block text-primary hover:underline">→ Reportes</a>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "warning" | "success" | "primary" | "secondary" }) {
  const colorClass: Record<string, string> = {
    warning: "text-warning",
    success: "text-success",
    primary: "text-primary",
    secondary: "text-secondary",
  };
  return (
    <Card>
      <CardBody className="py-4">
        <p className={`text-3xl font-bold ${colorClass[color]}`}>{value}</p>
        <p className="text-xs text-default-500 mt-1">{label}</p>
      </CardBody>
    </Card>
  );
}
