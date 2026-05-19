"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getUEBsByEmpresa, createUEB, updateUEB, deleteUEB,
} from "@/lib/services/ueb.service";
import type { UEB } from "@/types/models";

export default function AdminUEB() {
  const { empresa } = useAuth();
  const [uebs, setUebs] = useState<UEB[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<UEB | null>(null);
  const [eliminando, setEliminando] = useState<UEB | null>(null);
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa) return;
    setLoading(true);
    const data = await getUEBsByEmpresa();
    setUebs(data);
    setLoading(false);
  }, [empresa]);

  useEffect(() => { cargar(); }, [cargar]);

  const abrirCrear = () => {
    setEditando(null);
    setNombre("");
    setUbicacion("");
    setError("");
    onOpen();
  };

  const abrirEditar = (u: UEB) => {
    setEditando(u);
    setNombre(u.nombre);
    setUbicacion(u.ubicacion ?? "");
    setError("");
    onOpen();
  };

  const abrirEliminar = (u: UEB) => {
    setEliminando(u);
    onDeleteOpen();
  };

  const handleGuardar = async () => {
    if (!empresa) return;
    if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setError("");
    setSaving(true);
    try {
      if (editando) {
        await updateUEB(editando.id, { nombre, ubicacion });
      } else {
        await createUEB({ nombre, ubicacion, empresa_id: empresa.id, activo: true });
      }
      onClose();
      cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async () => {
    if (!eliminando) return;
    setSaving(true);
    try {
      if (eliminando.activo) {
        await deleteUEB(eliminando.id);
      } else {
        await updateUEB(eliminando.id, { activo: true });
      }
      onDeleteClose();
      cargar();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Unidades Empresariales de Base</h1>
          <p className="text-sm text-default-500">Divisiones territoriales de la empresa</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nueva UEB</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>
      ) : (
        <Table aria-label="UEBs" removeWrapper>
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Ubicación</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay UEBs registradas.">
            {uebs.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.nombre}</TableCell>
                <TableCell className="text-sm text-default-500">{u.ubicacion ?? "—"}</TableCell>
                <TableCell>
                  <Chip color={u.activo ? "success" : "default"} variant="flat" size="sm">
                    {u.activo ? "Activa" : "Inactiva"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(u)}>Editar</Button>
                    <Button size="sm" variant="flat" color={u.activo ? "danger" : "success"} onPress={() => abrirEliminar(u)}>
                      {u.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal crear/editar */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editando ? "Editar UEB" : "Nueva UEB"}</ModalHeader>
          <ModalBody className="space-y-3">
            <Input label="Nombre" isRequired value={nombre} onValueChange={setNombre} />
            <Input label="Ubicación" value={ubicacion} onValueChange={setUbicacion} />
            {error && <p className="text-sm text-danger">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleGuardar}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>{eliminando?.activo ? "Desactivar UEB" : "Activar UEB"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              {eliminando?.activo
                ? <>¿Desactivar la UEB <strong>{eliminando?.nombre}</strong>? Los expedientes y trabajadores asociados no se eliminarán.</>
                : <>¿Activar la UEB <strong>{eliminando?.nombre}</strong>?</>
              }
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>Cancelar</Button>
            <Button color={eliminando?.activo ? "danger" : "success"} isLoading={saving} onPress={handleEliminar}>
              {eliminando?.activo ? "Desactivar" : "Activar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
