"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card, CardBody, CardHeader, Chip, Button, Spinner, Divider,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Textarea, useDisclosure,
} from "@/components/ui/compat";
import { getOrdenTrabajoById, deleteOrdenTrabajo } from "@/lib/services/orden-trabajo.service";
import { useAuth } from "@/lib/auth/AuthContext";
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

export default function DetalleOrdenSupervisor() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario, empresa } = useAuth();
  const [orden, setOrden] = useState<OrdenTrabajoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [motivo, setMotivo] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    getOrdenTrabajoById(Number(id)).then((data) => {
      setOrden(data);
      setLoading(false);
    });
  }, [id]);

  const formatFecha = (f: string) =>
    new Date(f).toLocaleDateString("es-CU", { year: "numeric", month: "long", day: "numeric" });
  const formatDateTime = (f: string) => new Date(f).toLocaleString("es-CU");

  const handleEliminar = async () => {
    if (!orden || !usuario || !empresa) return;
    if (!motivo.trim()) { setDeleteError("El motivo es obligatorio."); return; }
    setDeleting(true);
    try {
      await deleteOrdenTrabajo(orden.id, motivo);
      router.replace("/supervisor/ordenes-trabajo");
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Error al eliminar.");
    } finally { setDeleting(false); }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>;
  if (!orden) return <p className="text-danger">Orden de trabajo no encontrada.</p>;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="flat" size="sm" onPress={() => router.back()}>← Volver</Button>
        <div>
          <h1 className="text-xl font-bold">Orden de Trabajo #{orden.id}</h1>
          <p className="text-sm text-default-500">{formatFecha(orden.fecha_ejecucion)}</p>
        </div>
        <Chip color={ESTADO_COLOR[orden.estado]} variant="flat">{ESTADO_LABEL[orden.estado]}</Chip>
        {orden.estado === "pendiente" && (
          <Button as={Link} href={`/supervisor/ordenes-trabajo/${orden.id}/editar`} color="primary" size="sm">
            Editar
          </Button>
        )}
        {orden.estado === "pendiente" && (
          <Button color="danger" variant="flat" size="sm" onPress={() => { setMotivo(""); setDeleteError(""); onDeleteOpen(); }}>
            Eliminar
          </Button>
        )}
      </div>

      <Card>
        <CardHeader><h2 className="font-semibold">Información General</h2></CardHeader>
        <Divider />
        <CardBody className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-default-400 text-xs">Expediente</p><p className="font-medium">{orden.expediente_numero} — {orden.expediente_nombre}</p></div>
          <div><p className="text-default-400 text-xs">Actividad</p><p className="font-medium">{orden.actividad_nombre}</p></div>
          <div><p className="text-default-400 text-xs">Cantidad realizada</p><p className="font-medium font-mono">{orden.cantidad_realizada.toLocaleString("es-CU")} {orden.actividad_unidad_medida}</p></div>
          <div><p className="text-default-400 text-xs">Creado el</p><p className="font-medium">{formatDateTime(orden.created_at)}</p></div>
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
                  <li key={e.id} className="text-sm">{e.nombre} <span className="text-default-400 text-xs">({e.codigo_inventario})</span></li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent>
          <ModalHeader>Eliminar orden de trabajo</ModalHeader>
          <ModalBody className="space-y-3">
            <p className="text-sm">¿Estás seguro de eliminar la <strong>Orden #{orden.id}</strong>? Esta acción no se puede deshacer.</p>
            <Textarea label="Motivo de eliminación" isRequired value={motivo} onValueChange={setMotivo} minRows={2} />
            {deleteError && <p className="text-sm text-danger">{deleteError}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>Cancelar</Button>
            <Button color="danger" isLoading={deleting} onPress={handleEliminar}>Eliminar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
