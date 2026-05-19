"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Divider, Spinner, Chip } from "@/components/ui/compat";
import { getOrdenesTrabajo } from "@/lib/services/orden-trabajo.service";
import { getMesActualEstado } from "@/lib/services/cierre.service";
import { getTrabajadores } from "@/lib/services/trabajador.service";
import { useAuth } from "@/lib/auth/AuthContext";

interface KPIs {
  ordenesPendientes: number;
  ordenesValidadas: number;
  ordenesRechazadas: number;
  totalTrabajadores: number;
  mesCerrado: boolean;
  anio: number;
  mes: number;
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function SupervisorDashboard() {
  const { empresa, ueb } = useAuth();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresa) return;
    const eid = empresa.id;
    const uid = ueb?.id;
    Promise.all([
      getOrdenesTrabajo(),
      getMesActualEstado(),
      getTrabajadores(),
    ]).then(([ordenes, mesEstado, trabajadores]) => {
      setKpis({
        ordenesPendientes: ordenes.filter((o) => o.estado === "pendiente").length,
        ordenesValidadas: ordenes.filter((o) => o.estado === "validada").length,
        ordenesRechazadas: ordenes.filter((o) => o.estado === "rechazada").length,
        totalTrabajadores: trabajadores.length,
        mesCerrado: mesEstado.cerrado,
        anio: mesEstado.anio,
        mes: mesEstado.mes,
      });
    }).finally(() => setLoading(false));
  }, [empresa, ueb]);

  if (loading) return <div className="flex justify-center py-20"><Spinner label="Cargando panel..." /></div>;
  if (!kpis) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel del Supervisor</h1>
        <p className="text-default-500 text-sm mt-1">
          {ueb ? `UEB: ${ueb.nombre}` : empresa?.nombre}
        </p>
      </div>

      {/* Estado del mes */}
      <Card className={kpis.mesCerrado ? "border border-danger-200" : "border border-success-200"}>
        <CardBody className="flex flex-row items-center gap-4 py-3">
          <div className="flex-1">
            <p className="text-sm text-default-500">Mes actual</p>
            <p className="font-semibold text-lg">{MESES[kpis.mes - 1]} {kpis.anio}</p>
          </div>
          <Chip color={kpis.mesCerrado ? "danger" : "success"} variant="flat" size="lg">
            {kpis.mesCerrado ? "Cerrado — sin nuevas órdenes" : "Abierto"}
          </Chip>
        </CardBody>
      </Card>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Órdenes pendientes" value={kpis.ordenesPendientes} color="warning" />
        <StatCard label="Órdenes validadas" value={kpis.ordenesValidadas} color="success" />
        <StatCard label="Órdenes rechazadas" value={kpis.ordenesRechazadas} color="danger" />
        <StatCard label="Trabajadores activos" value={kpis.totalTrabajadores} color="primary" />
      </div>

      {/* Accesos rápidos */}
      <Card>
        <CardHeader><h2 className="font-semibold">Accesos rápidos</h2></CardHeader>
        <Divider />
        <CardBody className="space-y-1 text-sm">
          <a href="/supervisor/ordenes-trabajo" className="block text-primary hover:underline">→ Mis órdenes de trabajo</a>
          <a href="/supervisor/ordenes-trabajo/nueva" className="block text-primary hover:underline">
            {kpis.mesCerrado ? "→ Nueva orden (mes cerrado)" : "→ Registrar nueva orden de trabajo"}
          </a>
        </CardBody>
      </Card>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "warning" | "success" | "danger" | "primary" }) {
  const colorClass: Record<string, string> = {
    warning: "text-warning",
    success: "text-success",
    danger: "text-danger",
    primary: "text-primary",
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
