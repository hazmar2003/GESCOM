"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getEquipamiento, createEquipamiento, updateEquipamiento, deleteEquipamiento } from "@/lib/services/equipamiento.service";
import type { Equipamiento } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function SupervisorEquipamiento() {
  const { empresa, ueb } = useAuth();
  const [equipamientos, setEquipamientos] = useState<Equipamiento[]>([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<Equipamiento | null>(null);
  const [eliminando, setEliminando] = useState<Equipamiento | null>(null);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa || !ueb) return;
    setLoading(true);
    const data = await getEquipamiento();
    setEquipamientos(data);
    setLoading(false);
  }, [empresa, ueb]);

  useEffect(() => { cargar(); }, [cargar]);

  const resetForm = () => { setCodigo(""); setNombre(""); setTipo(""); setError(""); };

  const abrirCrear = () => { setEditando(null); resetForm(); onOpen(); };

  const abrirEditar = (e: Equipamiento) => {
    if (e.ueb_id !== ueb?.id) return; // seguridad: solo de su UEB
    setEditando(e);
    setCodigo(e.codigo_inventario); setNombre(e.nombre); setTipo(e.tipo ?? "");
    setError(""); onOpen();
  };

  const abrirEliminar = (e: Equipamiento) => {
    if (e.ueb_id !== ueb?.id) return; // seguridad: solo de su UEB
    setEliminando(e); onDeleteOpen();
  };

  const handleActivar = async (e: Equipamiento) => {
    if (e.ueb_id !== ueb?.id) return;
    try { await updateEquipamiento(e.id, { activo: true }); cargar(); }
    catch { /* ignore */ }
  };

  const handleGuardar = async () => {
    if (!empresa || !ueb) return;
    if (!codigo.trim() || !nombre.trim()) {
      setError("Código y nombre son obligatorios."); return;
    }
    setError(""); setSaving(true);
    try {
      const dto = {
        codigo_inventario: codigo,
        nombre,
        tipo: tipo || undefined,
        ueb_id: ueb.id,
        empresa_id: empresa.id,
        activo: true,
      };
      if (editando) { await updateEquipamiento(editando.id, dto); }
      else { await createEquipamiento(dto); }
      onClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleEliminar = async () => {
    if (!eliminando) return;
    setSaving(true);
    try { await deleteEquipamiento(eliminando.id); onDeleteClose(); cargar(); }
    finally { setSaving(false); }
  };

  if (!ueb) {
    return <p className="text-sm text-danger">Tu usuario no tiene una UEB asignada. Contacta al administrador.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Equipamiento</h1>
          <p className="text-sm text-default-500">Vehículos y maquinaria de {ueb.nombre}</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nuevo equipo</Button>
      </div>

      <Table aria-label="Equipamiento" removeWrapper>
        <TableHeader>
          <TableColumn>Código</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay equipamiento registrado en tu UEB.">
          {loading
            ? <TableSkeleton columns={5} />
            : equipamientos.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-sm">{e.codigo_inventario}</TableCell>
                <TableCell className="font-medium">{e.nombre}</TableCell>
                <TableCell className="text-sm text-default-500">{e.tipo ?? "—"}</TableCell>
                <TableCell>
                  <Chip color={e.activo ? "success" : "default"} variant="flat" size="sm">
                    {e.activo ? "Activo" : "Inactivo"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(e)}>Editar</Button>
                    {e.activo
                      ? <Button size="sm" variant="flat" color="danger" onPress={() => abrirEliminar(e)}>Desactivar</Button>
                      : <Button size="sm" variant="flat" color="success" onPress={() => handleActivar(e)}>Activar</Button>
                    }
                  </div>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      {/* Modal crear / editar */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editando ? "Editar equipamiento" : "Nuevo equipamiento"}</ModalHeader>
          <ModalBody className="space-y-3">
            <Input label="Código de inventario" isRequired value={codigo} onValueChange={setCodigo} />
            <Input label="Nombre" isRequired value={nombre} onValueChange={setNombre} />
            <Input label="Tipo (ej: camión, tractor)" value={tipo} onValueChange={setTipo} />
            {error && <p className="text-sm text-danger">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleGuardar}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal confirmar desactivación */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent>
          <ModalHeader>Desactivar equipamiento</ModalHeader>
          <ModalBody>
            <p className="text-sm">¿Desactivar <strong>{eliminando?.nombre}</strong>?</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>Cancelar</Button>
            <Button color="danger" isLoading={saving} onPress={handleEliminar}>Desactivar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
