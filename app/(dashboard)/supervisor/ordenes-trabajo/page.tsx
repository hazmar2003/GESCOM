"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Input, Spinner, Select, SelectItem,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getOrdenesTrabajo } from "@/lib/services/orden-trabajo.service";
import { getMesActualEstado } from "@/lib/services/cierre.service";
import type { OrdenTrabajoDetalle, EstadoOrdenTrabajo } from "@/types/models";
import Link from "next/link";

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

export default function SupervisorOrdenesTrabajo() {
  const { usuario, empresa, ueb } = useAuth();
  const [ordenes, setOrdenes] = useState<OrdenTrabajoDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesCerrado, setMesCerrado] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroDesde, setFiltroDesde] = useState<string>("");
  const [filtroHasta, setFiltroHasta] = useState<string>("");

  const cargar = useCallback(async () => {
    if (!empresa || !usuario?.ueb_id) return;
    setLoading(true);
    try {
      const data = await getOrdenesTrabajo({
        estado: (filtroEstado as EstadoOrdenTrabajo) || undefined,
        fecha_desde: filtroDesde || undefined,
        fecha_hasta: filtroHasta || undefined,
      });
      setOrdenes(data.sort((a, b) => b.fecha_ejecucion.localeCompare(a.fecha_ejecucion)));
    } finally {
      setLoading(false);
    }
  }, [empresa, usuario, filtroEstado, filtroDesde, filtroHasta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (!empresa) return;
    getMesActualEstado().then((e) => setMesCerrado(e.cerrado));
  }, [empresa]);

  const formatFecha = (f: string) => new Date(f).toLocaleDateString("es-CU");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Órdenes de Trabajo</h1>
          <p className="text-sm text-default-500">UEB: {ueb?.nombre}</p>
        </div>
        <Button as={Link} href="/supervisor/ordenes-trabajo/nueva" color="primary" isDisabled={mesCerrado}>
          + Nueva orden
        </Button>
      </div>

      {mesCerrado && (
        <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
          ⚠️ El mes actual está <strong>cerrado</strong>. No se pueden registrar nuevas órdenes de trabajo.
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select
          label="Estado"
          placeholder="Todos"
          selectedKeys={filtroEstado ? [filtroEstado] : []}
          onSelectionChange={(keys) => setFiltroEstado([...keys][0] as string ?? "")}
        >
          <SelectItem key="pendiente">Pendiente</SelectItem>
          <SelectItem key="validada">Validada</SelectItem>
          <SelectItem key="rechazada">Rechazada</SelectItem>
        </Select>
        <Input label="Desde" type="date" value={filtroDesde} onValueChange={setFiltroDesde} />
        <Input label="Hasta" type="date" value={filtroHasta} onValueChange={setFiltroHasta} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>
      ) : (
        <Table aria-label="Mis órdenes de trabajo" removeWrapper>
          <TableHeader>
            <TableColumn>Fecha</TableColumn>
            <TableColumn>Expediente</TableColumn>
            <TableColumn>Actividad</TableColumn>
            <TableColumn>Cantidad</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay órdenes de trabajo registradas.">
            {ordenes.map((ot) => (
              <TableRow key={ot.id}>
                <TableCell className="whitespace-nowrap">{formatFecha(ot.fecha_ejecucion)}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{ot.expediente_numero}</p>
                    <p className="text-xs text-default-400">{ot.expediente_nombre}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{ot.actividad_nombre}</TableCell>
                <TableCell className="text-sm font-mono">
                  {ot.cantidad_realizada.toLocaleString("es-CU")} {ot.actividad_unidad_medida}
                </TableCell>
                <TableCell>
                  <Chip color={ESTADO_COLOR[ot.estado]} variant="flat" size="sm">
                    {ESTADO_LABEL[ot.estado]}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button as={Link} href={`/supervisor/ordenes-trabajo/${ot.id}`} size="sm" variant="flat">
                      Ver
                    </Button>
                    {ot.estado === "pendiente" && (
                      <Button as={Link} href={`/supervisor/ordenes-trabajo/${ot.id}/editar`} size="sm" color="primary" variant="flat">
                        Editar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
