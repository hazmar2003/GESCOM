"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Spinner, Card, CardBody, Chip,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getPreviewReporte } from "@/lib/services/cierre.service";
import type { ReporteMensualDetalleVista } from "@/types/models";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

type Vista = "detalle" | "por-ueb" | "por-expediente";
const VISTAS: { key: Vista; label: string }[] = [
  { key: "detalle", label: "Detalle" },
  { key: "por-ueb", label: "Por UEB" },
  { key: "por-expediente", label: "Por Expediente" },
];

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { empresa } = useAuth();

  const anio = Number(searchParams.get("anio") ?? new Date().getFullYear());
  const mes  = Number(searchParams.get("mes")  ?? new Date().getMonth() + 1);

  const [reporte, setReporte] = useState<ReporteMensualDetalleVista[]>([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState<Vista>("detalle");

  useEffect(() => {
    if (!empresa) return;
    getPreviewReporte(anio, mes).then((data) => {
      setReporte(data);
      setLoading(false);
    });
  }, [empresa, anio, mes]);

  const calc = (r: ReporteMensualDetalleVista) => ({
    salarioPlanificado: r.cantidad_planificada_mes * r.tasa_salarial_aplicada,
    desviacion: r.cantidad_ejecutada_mes - r.cantidad_planificada_mes,
  });

  const totalPlan           = reporte.reduce((s, r) => s + r.cantidad_planificada_mes, 0);
  const totalEjec           = reporte.reduce((s, r) => s + r.cantidad_ejecutada_mes, 0);
  const totalSalarioPlan    = reporte.reduce((s, r) => s + calc(r).salarioPlanificado, 0);
  const totalSalarioDevenga = reporte.reduce((s, r) => s + r.salario_devengado, 0);
  const pctGlobal           = totalPlan > 0 ? (totalEjec / totalPlan) * 100 : 0;

  const fmt    = (n: number, dec = 2) => n.toLocaleString("es-CU", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fmtNum = (n: number) => n.toLocaleString("es-CU", { maximumFractionDigits: 2 });
  const chipColor = (pct: number) => pct >= 100 ? "success" : pct >= 75 ? "warning" : "danger";

  // ── Agrupado Por UEB ──────────────────────────────────────────────
  type UEBAgg = { ueb_nombre: string; plan: number; ejec: number; salario: number };
  const porUEB = Object.values(
    reporte.reduce((acc, r) => {
      if (!acc[r.ueb_id]) acc[r.ueb_id] = { ueb_nombre: r.ueb_nombre, plan: 0, ejec: 0, salario: 0 };
      acc[r.ueb_id].plan    += r.cantidad_planificada_mes;
      acc[r.ueb_id].ejec    += r.cantidad_ejecutada_mes;
      acc[r.ueb_id].salario += r.salario_devengado;
      return acc;
    }, {} as Record<number, UEBAgg>)
  ).map((u) => ({ ...u, desv: u.ejec - u.plan, pct: u.plan > 0 ? (u.ejec / u.plan) * 100 : 0 }));

  // ── Agrupado Por Expediente ───────────────────────────────────────
  type ExpAgg = { exp_nombre: string; exp_numero: string; ueb_nombre: string; acts: number; plan: number; ejec: number; salario: number };
  const porExpediente = Object.values(
    reporte.reduce((acc, r) => {
      if (!acc[r.expediente_id]) acc[r.expediente_id] = {
        exp_nombre: r.expediente_nombre, exp_numero: r.expediente_numero,
        ueb_nombre: r.ueb_nombre, acts: 0, plan: 0, ejec: 0, salario: 0,
      };
      acc[r.expediente_id].acts    += 1;
      acc[r.expediente_id].plan    += r.cantidad_planificada_mes;
      acc[r.expediente_id].ejec    += r.cantidad_ejecutada_mes;
      acc[r.expediente_id].salario += r.salario_devengado;
      return acc;
    }, {} as Record<number, ExpAgg>)
  ).map((e) => ({ ...e, desv: e.ejec - e.plan, pct: e.plan > 0 ? (e.ejec / e.plan) * 100 : 0 }));

  if (loading) return <div className="flex justify-center py-16"><Spinner label="Cargando vista previa..." /></div>;

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex items-start gap-3">
        <Button variant="flat" size="sm" onPress={() => router.back()} className="mt-1">← Volver</Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              {MESES[mes - 1]} {anio}
            </h1>
            <Chip color="warning" variant="flat" size="sm">Vista previa</Chip>
          </div>
          <p className="text-sm text-default-500">
            Datos en tiempo real — el mes aún no ha sido cerrado oficialmente
          </p>
        </div>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() => window.print()}
        >
          Exportar PDF
        </Button>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardBody>
            <p className="text-xs text-default-400">Total planificado</p>
            <p className="text-lg font-bold font-mono">{fmtNum(totalPlan)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-default-400">Total ejecutado</p>
            <p className="text-lg font-bold font-mono">{fmtNum(totalEjec)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-default-400">Cumplimiento global</p>
            <p className={`text-lg font-bold font-mono ${pctGlobal >= 100 ? "text-success" : pctGlobal >= 75 ? "text-warning" : "text-danger"}`}>
              {pctGlobal.toFixed(1)}%
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-default-400">Salario planificado</p>
            <p className="text-lg font-bold font-mono">${fmt(totalSalarioPlan)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-default-400">Salario devengado</p>
            <p className="text-lg font-bold font-mono text-success">${fmt(totalSalarioDevenga)}</p>
          </CardBody>
        </Card>
      </div>

      {/* Selector de vista */}
      <div className="flex gap-2">
        {VISTAS.map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            variant={vista === key ? "solid" : "flat"}
            color={vista === key ? "primary" : "default"}
            onPress={() => setVista(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {reporte.length === 0 ? (
        <p className="text-sm text-default-400">
          No hay órdenes de trabajo validadas para este período todavía.
        </p>

      ) : vista === "detalle" ? (
        /* ── Vista Detalle ─────────────────────────────────────────── */
        <div className="overflow-x-auto">
          <Table aria-label="Vista previa detalle" removeWrapper>
            <TableHeader>
              <TableColumn>UEB</TableColumn>
              <TableColumn>Expediente</TableColumn>
              <TableColumn>Actividad</TableColumn>
              <TableColumn>U.M.</TableColumn>
              <TableColumn>Planificado</TableColumn>
              <TableColumn>Ejecutado</TableColumn>
              <TableColumn>Desviación</TableColumn>
              <TableColumn>Cumpl.%</TableColumn>
              <TableColumn>Salario devengado</TableColumn>
            </TableHeader>
            <TableBody>
              {reporte.map((r, i) => {
                const { desviacion } = calc(r);
                return (
                  <TableRow key={i}>
                    <TableCell className="text-sm text-default-500 whitespace-nowrap">{r.ueb_nombre}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{r.expediente_numero} — {r.expediente_nombre}</TableCell>
                    <TableCell className="font-medium text-sm whitespace-nowrap">{r.actividad_nombre}</TableCell>
                    <TableCell className="text-sm text-default-400">{r.actividad_unidad_medida}</TableCell>
                    <TableCell className="font-mono text-sm">{fmtNum(r.cantidad_planificada_mes)}</TableCell>
                    <TableCell className="font-mono text-sm">{fmtNum(r.cantidad_ejecutada_mes)}</TableCell>
                    <TableCell className={`font-mono text-sm font-medium ${desviacion >= 0 ? "text-success" : "text-danger"}`}>
                      {desviacion >= 0 ? "+" : ""}{fmtNum(desviacion)}
                    </TableCell>
                    <TableCell>
                      <Chip color={chipColor(r.porcentaje_cumplimiento)} variant="flat" size="sm">
                        {r.porcentaje_cumplimiento.toFixed(1)}%
                      </Chip>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold">${fmt(r.salario_devengado)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

      ) : vista === "por-ueb" ? (
        /* ── Vista Por UEB ─────────────────────────────────────────── */
        <Table aria-label="Vista previa por UEB" removeWrapper>
          <TableHeader>
            <TableColumn>UEB</TableColumn>
            <TableColumn>Planificado</TableColumn>
            <TableColumn>Ejecutado</TableColumn>
            <TableColumn>Desviación</TableColumn>
            <TableColumn>Cumpl.%</TableColumn>
            <TableColumn>Salario devengado</TableColumn>
          </TableHeader>
          <TableBody>
            {porUEB.map((u, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold">{u.ueb_nombre}</TableCell>
                <TableCell className="font-mono text-sm">{fmtNum(u.plan)}</TableCell>
                <TableCell className="font-mono text-sm">{fmtNum(u.ejec)}</TableCell>
                <TableCell className={`font-mono text-sm font-medium ${u.desv >= 0 ? "text-success" : "text-danger"}`}>
                  {u.desv >= 0 ? "+" : ""}{fmtNum(u.desv)}
                </TableCell>
                <TableCell>
                  <Chip color={chipColor(u.pct)} variant="flat" size="sm">{u.pct.toFixed(1)}%</Chip>
                </TableCell>
                <TableCell className="font-mono text-sm font-semibold">${fmt(u.salario)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      ) : (
        /* ── Vista Por Expediente ──────────────────────────────────── */
        <Table aria-label="Vista previa por expediente" removeWrapper>
          <TableHeader>
            <TableColumn>UEB</TableColumn>
            <TableColumn>Expediente</TableColumn>
            <TableColumn># Act.</TableColumn>
            <TableColumn>Planificado</TableColumn>
            <TableColumn>Ejecutado</TableColumn>
            <TableColumn>Desviación</TableColumn>
            <TableColumn>Cumpl.%</TableColumn>
            <TableColumn>Salario devengado</TableColumn>
          </TableHeader>
          <TableBody>
            {porExpediente.map((e, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm text-default-500 whitespace-nowrap">{e.ueb_nombre}</TableCell>
                <TableCell className="font-medium text-sm whitespace-nowrap">{e.exp_numero} — {e.exp_nombre}</TableCell>
                <TableCell className="font-mono text-sm text-center">{e.acts}</TableCell>
                <TableCell className="font-mono text-sm">{fmtNum(e.plan)}</TableCell>
                <TableCell className="font-mono text-sm">{fmtNum(e.ejec)}</TableCell>
                <TableCell className={`font-mono text-sm font-medium ${e.desv >= 0 ? "text-success" : "text-danger"}`}>
                  {e.desv >= 0 ? "+" : ""}{fmtNum(e.desv)}
                </TableCell>
                <TableCell>
                  <Chip color={chipColor(e.pct)} variant="flat" size="sm">{e.pct.toFixed(1)}%</Chip>
                </TableCell>
                <TableCell className="font-mono text-sm font-semibold">${fmt(e.salario)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function ReportePreviewPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>}>
      <PreviewContent />
    </Suspense>
  );
}
