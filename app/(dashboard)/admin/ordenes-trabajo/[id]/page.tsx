"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card, CardBody, CardHeader, Chip, Button, Spinner, Divider,
} from "@/components/ui/compat";
import { getOrdenTrabajoById } from "@/lib/services/orden-trabajo.service";
import type { OrdenTrabajoDetalle, EstadoOrdenTrabajo } from "@/types/models";

const ESTADO_COLOR: Record<EstadoOrdenTrabajo, "warning" | "success" | "danger"> = {
  pendiente: "warning",
  validada: "success",
  rechazada: "danger",
};

const ESTADO_LABEL: Record<EstadoOrdenTrabajo, string> = {
  pendiente: "Pendiente",
  validada: "Validada",
  rechazada: "Rechazada",
};

export default function DetalleOrdenTrabajo() {
  const { id } = useParams();
  const router = useRouter();
  const [orden, setOrden] = useState<OrdenTrabajoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdenTrabajoById(Number(id)).then((data) => {
      setOrden(data);
      setLoading(false);
    });
  }, [id]);

  const formatFecha = (f: string) => new Date(f).toLocaleDateString("es-CU", { year: "numeric", month: "long", day: "numeric" });
  const formatDateTime = (f: string) => new Date(f).toLocaleString("es-CU");

  if (loading) return <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>;
  if (!orden) return <p className="text-danger">Orden de trabajo no encontrada.</p>;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="flat" size="sm" onPress={() => router.back()}>← Volver</Button>
        <div>
          <h1 className="text-xl font-bold">Orden de Trabajo #{orden.id}</h1>
          <p className="text-sm text-default-500">{formatFecha(orden.fecha_ejecucion)}</p>
        </div>
        <Chip color={ESTADO_COLOR[orden.estado]} variant="flat">{ESTADO_LABEL[orden.estado]}</Chip>
      </div>

      <Card>
        <CardHeader><h2 className="font-semibold">Información General</h2></CardHeader>
        <Divider />
        <CardBody className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-default-400 text-xs">Expediente</p><p className="font-medium">{orden.expediente_numero} — {orden.expediente_nombre}</p></div>
          <div><p className="text-default-400 text-xs">UEB</p><p className="font-medium">{orden.ueb_nombre}</p></div>
          <div><p className="text-default-400 text-xs">Actividad</p><p className="font-medium">{orden.actividad_nombre}</p></div>
          <div><p className="text-default-400 text-xs">Cantidad realizada</p><p className="font-medium font-mono">{orden.cantidad_realizada.toLocaleString("es-CU")} {orden.actividad_unidad_medida}</p></div>
          <div><p className="text-default-400 text-xs">Fecha de ejecución</p><p className="font-medium">{formatFecha(orden.fecha_ejecucion)}</p></div>
          <div><p className="text-default-400 text-xs">Creado por</p><p className="font-medium">{orden.creado_por_username}</p></div>
          <div><p className="text-default-400 text-xs">Creado el</p><p className="font-medium">{formatDateTime(orden.created_at)}</p></div>
          {orden.updated_at !== orden.created_at && (
            <div><p className="text-default-400 text-xs">Última modificación</p><p className="font-medium">{formatDateTime(orden.updated_at)}</p></div>
          )}
          {orden.observaciones && (
            <div className="col-span-2"><p className="text-default-400 text-xs">Observaciones</p><p>{orden.observaciones}</p></div>
          )}
          {orden.motivo_modificacion && (
            <div className="col-span-2"><p className="text-default-400 text-xs">Motivo de modificación</p><p className="text-warning">{orden.motivo_modificacion}</p></div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="font-semibold">Trabajadores ({orden.trabajadores.length})</h2></CardHeader>
          <Divider />
          <CardBody>
            {orden.trabajadores.length === 0 ? (
              <p className="text-sm text-default-400">Sin trabajadores asignados.</p>
            ) : (
              <ul className="space-y-1">
                {orden.trabajadores.map((t) => (
                  <li key={t.id} className="text-sm">{t.nombre} {t.apellidos}</li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Equipamiento ({orden.equipamiento.length})</h2></CardHeader>
          <Divider />
          <CardBody>
            {orden.equipamiento.length === 0 ? (
              <p className="text-sm text-default-400">Sin equipamiento asignado.</p>
            ) : (
              <ul className="space-y-1">
                {orden.equipamiento.map((e) => (
                  <li key={e.id} className="text-sm">{e.nombre} <span className="text-default-400">({e.codigo_inventario})</span></li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
