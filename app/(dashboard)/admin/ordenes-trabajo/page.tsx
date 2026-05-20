"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Select, SelectItem, Input, Spinner,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Textarea,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getOrdenesTrabajo, validarOrdenTrabajo } from "@/lib/services/orden-trabajo.service";
import { getUEBsByEmpresa } from "@/lib/services/ueb.service";
import type { OrdenTrabajoDetalle, UEB, EstadoOrdenTrabajo, ValidarOrdenTrabajoDto } from "@/types/models";
import Link from "next/link";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

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

export default function AdminOrdenesTrabajo() {
  const { usuario, empresa } = useAuth();
  const [ordenes, setOrdenes] = useState<OrdenTrabajoDetalle[]>([]);
  const [uebs, setUebs] = useState<UEB[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroUeb, setFiltroUeb] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroDesde, setFiltroDesde] = useState<string>("");
  const [filtroHasta, setFiltroHasta] = useState<string>("");

  // Modal validación
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenTrabajoDetalle | null>(null);
  const [accionModal, setAccionModal] = useState<"validada" | "rechazada">("validada");
  const [motivoModal, setMotivoModal] = useState("");
  const [savingModal, setSavingModal] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa) return;
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
  }, [empresa, filtroEstado, filtroDesde, filtroHasta]);

  useEffect(() => {
    if (!empresa) return;
    getUEBsByEmpresa().then(setUebs);
  }, [empresa]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirModal = (orden: OrdenTrabajoDetalle, accion: "validada" | "rechazada") => {
    setOrdenSeleccionada(orden);
    setAccionModal(accion);
    setMotivoModal("");
    setErrorModal("");
    onOpen();
  };

  const confirmarAccion = async () => {
    if (!ordenSeleccionada || !usuario || !empresa) return;
    setErrorModal("");
    setSavingModal(true);
    try {
      const dto: ValidarOrdenTrabajoDto = {
        estado: accionModal,
        motivo_modificacion: motivoModal || undefined,
      };
      await validarOrdenTrabajo(ordenSeleccionada.id, dto);
      onClose();
      cargar();
    } catch (e: unknown) {
      setErrorModal(e instanceof Error ? e.message : "Error al procesar.");
    } finally {
      setSavingModal(false);
    }
  };

  const formatFecha = (f: string) => new Date(f).toLocaleDateString("es-CU");

  const ordenesFiltradas = filtroUeb
    ? ordenes.filter((o) => String(o.ueb_id) === filtroUeb)
    : ordenes;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Órdenes de Trabajo</h1>
          <p className="text-sm text-default-500">Todas las órdenes de la empresa</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select
          label="UEB"
          placeholder="Todas"
          selectedKeys={filtroUeb ? [filtroUeb] : []}
          onSelectionChange={(keys) => setFiltroUeb([...keys][0] as string ?? "")}
        >
          {uebs.map((u) => (
            <SelectItem key={String(u.id)}>{u.nombre}</SelectItem>
          ))}
        </Select>
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
        <Input label="Desde" type="date" value={filtroDesde} onValueChange={setFiltroDesde}/>
        <Input label="Hasta" type="date" value={filtroHasta} onValueChange={setFiltroHasta}/>
      </div>

      <Table aria-label="Órdenes de trabajo" removeWrapper>
        <TableHeader>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Expediente</TableColumn>
          <TableColumn>Actividad</TableColumn>
          <TableColumn>UEB</TableColumn>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Creado por</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay órdenes de trabajo.">
          {loading
            ? <TableSkeleton columns={8} />
            : ordenesFiltradas.map((ot) => (
              <TableRow key={ot.id}>
                <TableCell className="whitespace-nowrap">{formatFecha(ot.fecha_ejecucion)}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{ot.expediente_numero}</p>
                    <p className="text-xs text-default-400">{ot.expediente_nombre}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{ot.actividad_nombre}</p>
                    <p className="text-xs text-default-400">{ot.actividad_unidad_medida}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{ot.ueb_nombre}</TableCell>
                <TableCell className="text-sm font-mono">
                  {ot.cantidad_realizada.toLocaleString("es-CU")} {ot.actividad_unidad_medida}
                </TableCell>
                <TableCell>
                  <Chip color={ESTADO_COLOR[ot.estado]} variant="flat" size="sm">
                    {ESTADO_LABEL[ot.estado]}
                  </Chip>
                </TableCell>
                <TableCell className="text-xs text-default-500">{ot.creado_por_username}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button as={Link} href={`/admin/ordenes-trabajo/${ot.id}`} size="sm" variant="flat">
                      Ver
                    </Button>
                    {ot.estado === "pendiente" && (
                      <>
                        <Button size="sm" color="success" variant="flat" onPress={() => abrirModal(ot, "validada")}>
                          Validar
                        </Button>
                        <Button size="sm" color="danger" variant="flat" onPress={() => abrirModal(ot, "rechazada")}>
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      {/* Modal confirmar */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {accionModal === "validada" ? "Validar orden de trabajo" : "Rechazar orden de trabajo"}
          </ModalHeader>
          <ModalBody>
            {ordenSeleccionada && (
              <div className="space-y-3">
                <p className="text-sm text-default-600">
                  <strong>{ordenSeleccionada.expediente_nombre}</strong> —{" "}
                  {ordenSeleccionada.actividad_nombre}
                  <br />
                  Fecha: {formatFecha(ordenSeleccionada.fecha_ejecucion)} |{" "}
                  Cantidad: {ordenSeleccionada.cantidad_realizada.toLocaleString("es-CU")}{" "}
                  {ordenSeleccionada.actividad_unidad_medida}
                </p>
                <Textarea
                  label="Observación (opcional)"
                  placeholder="Motivo de la acción..."
                  value={motivoModal}
                  onValueChange={setMotivoModal}
                  minRows={2}
                />
                {errorModal && <p className="text-sm text-danger">{errorModal}</p>}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button
              color={accionModal === "validada" ? "success" : "danger"}
              isLoading={savingModal}
              onPress={confirmarAccion}
            >
              {accionModal === "validada" ? "Confirmar validación" : "Confirmar rechazo"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
