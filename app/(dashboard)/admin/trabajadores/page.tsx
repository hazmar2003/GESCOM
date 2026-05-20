"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getTrabajadores, createTrabajador, updateTrabajador, deleteTrabajador } from "@/lib/services/trabajador.service";
import { getUEBsByEmpresa } from "@/lib/services/ueb.service";
import type { Trabajador, UEB } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AdminTrabajadores() {
  const { empresa } = useAuth();
  const [uebs, setUebs] = useState<UEB[]>([]);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [filtroUEB, setFiltroUEB] = useState("");
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<Trabajador | null>(null);
  const [eliminando, setEliminando] = useState<Trabajador | null>(null);

  const [ci, setCi] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cargo, setCargo] = useState("");
  const [uebId, setUebId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa) return;
    const data = await getTrabajadores();
    setTrabajadores(data);
  }, [empresa]);

  useEffect(() => {
    if (!empresa) return;
    setLoading(true);
    Promise.all([getTrabajadores(), getUEBsByEmpresa()])
      .then(([trab, ubs]) => { setTrabajadores(trab); setUebs(ubs); })
      .finally(() => setLoading(false));
  }, [empresa]);

  const resetForm = () => { setCi(""); setNombre(""); setApellidos(""); setCargo(""); setUebId(""); setError(""); };
  const abrirCrear = () => { setEditando(null); resetForm(); onOpen(); };
  const abrirEditar = (t: Trabajador) => {
    setEditando(t);
    setCi(t.ci ?? ""); setNombre(t.nombre); setApellidos(t.apellidos); setCargo(t.cargo ?? ""); setUebId(String(t.ueb_id));
    setError(""); onOpen();
  };
  const abrirEliminar = (t: Trabajador) => { setEliminando(t); onDeleteOpen(); };

  const handleGuardar = async () => {
    if (!empresa) return;
    if (!ci.trim() || !nombre.trim() || !apellidos.trim() || !uebId) { setError("CI, nombre, apellidos y UEB son obligatorios."); return; }
    setError(""); setSaving(true);
    try {
      const dto = { ci, nombre, apellidos, cargo: cargo || undefined, ueb_id: Number(uebId), empresa_id: empresa.id, activo: true };
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
    try {
      if (eliminando.activo) {
        await deleteTrabajador(eliminando.id);
      } else {
        await updateTrabajador(eliminando.id, { activo: true });
      }
      onDeleteClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const uebNombre = (id: number) => uebs.find((u) => u.id === id)?.nombre ?? "—";

  const trabajadoresFiltrados = filtroUEB
    ? trabajadores.filter((t) => String(t.ueb_id) === filtroUEB)
    : trabajadores;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Trabajadores</h1>
          <p className="text-sm text-default-500">Personal activo de la empresa</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nuevo trabajador</Button>
      </div>

      <div className="max-w-sm">
        <Select label="Filtrar por UEB"
          selectedKeys={[filtroUEB || ""]}
          onSelectionChange={(k) => { const v = [...k][0] as string; setFiltroUEB(v === "" ? "" : v ?? ""); }}>
          <SelectItem key="">Todas las UEBs</SelectItem>
          {uebs.map((u) => <SelectItem key={String(u.id)}>{u.nombre}</SelectItem>)}
        </Select>
      </div>

      <Table aria-label="Trabajadores" removeWrapper>
        <TableHeader>
          <TableColumn>CI</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Cargo</TableColumn>
          <TableColumn>UEB</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay trabajadores registrados.">
          {loading
            ? <TableSkeleton columns={6} />
            : trabajadoresFiltrados.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-sm">{t.ci}</TableCell>
                <TableCell className="font-medium">{t.nombre} {t.apellidos}</TableCell>
                <TableCell className="text-sm text-default-500">{t.cargo ?? "—"}</TableCell>
                <TableCell className="text-sm">{uebNombre(t.ueb_id)}</TableCell>
                <TableCell><Chip color={t.activo ? "success" : "default"} variant="flat" size="sm">{t.activo ? "Activo" : "Inactivo"}</Chip></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(t)}>Editar</Button>
                    <Button size="sm" variant="flat" color={t.activo ? "danger" : "success"} onPress={() => abrirEliminar(t)}>
                      {t.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

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
            <Select label="UEB" isRequired selectedKeys={uebId ? [uebId] : []} onSelectionChange={(k) => setUebId([...k][0] as string ?? "")}>
              {uebs.map((u) => <SelectItem key={String(u.id)}>{u.nombre}</SelectItem>)}
            </Select>
            {error && <p className="text-sm text-danger">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleGuardar}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>{eliminando?.activo ? "Desactivar trabajador" : "Activar trabajador"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">¿{eliminando?.activo ? "Desactivar" : "Activar"} a <strong>{eliminando?.nombre} {eliminando?.apellidos}</strong>?</p>
            {error && <p className="text-sm text-danger mt-2">{error}</p>}
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
