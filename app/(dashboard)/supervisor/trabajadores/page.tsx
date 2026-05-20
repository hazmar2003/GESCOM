"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getTrabajadores, createTrabajador, updateTrabajador, deleteTrabajador } from "@/lib/services/trabajador.service";
import type { Trabajador } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function SupervisorTrabajadores() {
  const { empresa, ueb } = useAuth();
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<Trabajador | null>(null);
  const [eliminando, setEliminando] = useState<Trabajador | null>(null);

  const [ci, setCi] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cargo, setCargo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa || !ueb) return;
    setLoading(true);
    const data = await getTrabajadores();
    setTrabajadores(data);
    setLoading(false);
  }, [empresa, ueb]);

  useEffect(() => { cargar(); }, [cargar]);

  const resetForm = () => { setCi(""); setNombre(""); setApellidos(""); setCargo(""); setError(""); };

  const abrirCrear = () => { setEditando(null); resetForm(); onOpen(); };

  const abrirEditar = (t: Trabajador) => {
    if (t.ueb_id !== ueb?.id) return; // seguridad: solo de su UEB
    setEditando(t);
    setCi(t.ci ?? ""); setNombre(t.nombre); setApellidos(t.apellidos); setCargo(t.cargo ?? "");
    setError(""); onOpen();
  };

  const abrirEliminar = (t: Trabajador) => {
    if (t.ueb_id !== ueb?.id) return; // seguridad: solo de su UEB
    setEliminando(t); onDeleteOpen();
  };

  const handleActivar = async (t: Trabajador) => {
    if (t.ueb_id !== ueb?.id) return;
    try { await updateTrabajador(t.id, { activo: true }); cargar(); }
    catch { /* ignore */ }
  };

  const handleGuardar = async () => {
    if (!empresa || !ueb) return;
    if (!ci.trim() || !nombre.trim() || !apellidos.trim()) {
      setError("CI, nombre y apellidos son obligatorios."); return;
    }
    setError(""); setSaving(true);
    try {
      const dto = {
        ci,
        nombre,
        apellidos,
        cargo: cargo || undefined,
        ueb_id: ueb.id,
        empresa_id: empresa.id,
        activo: true,
      };
      if (editando) { await updateTrabajador(editando.id, dto); }
      else { await createTrabajador(dto); }
      onClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleEliminar = async () => {
    if (!eliminando) return;
    setSaving(true);
    try { await deleteTrabajador(eliminando.id); onDeleteClose(); cargar(); }
    finally { setSaving(false); }
  };

  if (!ueb) {
    return <p className="text-sm text-danger">Tu usuario no tiene una UEB asignada. Contacta al administrador.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Trabajadores</h1>
          <p className="text-sm text-default-500">Personal de {ueb.nombre}</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nuevo trabajador</Button>
      </div>

      <Table aria-label="Trabajadores" removeWrapper>
        <TableHeader>
          <TableColumn>CI</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Cargo</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay trabajadores registrados en tu UEB.">
          {loading
            ? <TableSkeleton columns={5} />
            : trabajadores.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-sm">{t.ci ?? "—"}</TableCell>
                <TableCell className="font-medium">{t.nombre} {t.apellidos}</TableCell>
                <TableCell className="text-sm text-default-500">{t.cargo ?? "—"}</TableCell>
                <TableCell>
                  <Chip color={t.activo ? "success" : "default"} variant="flat" size="sm">
                    {t.activo ? "Activo" : "Inactivo"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(t)}>Editar</Button>
                    {t.activo
                      ? <Button size="sm" variant="flat" color="danger" onPress={() => abrirEliminar(t)}>Desactivar</Button>
                      : <Button size="sm" variant="flat" color="success" onPress={() => handleActivar(t)}>Activar</Button>
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
          <ModalHeader>{editando ? "Editar trabajador" : "Nuevo trabajador"}</ModalHeader>
          <ModalBody className="space-y-3">
            <Input label="Carnet de identidad" isRequired value={ci} onValueChange={setCi} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre" isRequired value={nombre} onValueChange={setNombre} />
              <Input label="Apellidos" isRequired value={apellidos} onValueChange={setApellidos} />
            </div>
            <Input label="Cargo" value={cargo} onValueChange={setCargo} />
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
          <ModalHeader>Desactivar trabajador</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              ¿Desactivar a <strong>{eliminando?.nombre} {eliminando?.apellidos}</strong>?
            </p>
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
