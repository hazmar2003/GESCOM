"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Textarea, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getExpedientes, createExpediente, updateExpediente, deleteExpediente } from "@/lib/services/expediente.service";
import { getUEBsByEmpresa } from "@/lib/services/ueb.service";
import type { Expediente, UEB } from "@/types/models";

export default function AdminExpedientes() {
  const { empresa } = useAuth();
  const [uebs, setUebs] = useState<UEB[]>([]);
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [filtroUEB, setFiltroUEB] = useState("");
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<Expediente | null>(null);
  const [eliminando, setEliminando] = useState<Expediente | null>(null);

  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [uebId, setUebId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empresa) return;
    getUEBsByEmpresa().then(setUebs);
  }, [empresa]);

  const cargar = useCallback(async () => {
    if (!empresa) return;
    setLoading(true);
    const data = await getExpedientes();
    setExpedientes(data);
    setLoading(false);
  }, [empresa, filtroUEB]);

  useEffect(() => { cargar(); }, [cargar]);

  const resetForm = () => { setNumero(""); setNombre(""); setZona(""); setFechaInicio(""); setUebId(""); setError(""); };
  const abrirCrear = () => { setEditando(null); resetForm(); onOpen(); };
  const abrirEditar = (e: Expediente) => {
    setEditando(e);
    setNumero(e.numero_expediente); setNombre(e.nombre); setZona(e.zona ?? ""); setFechaInicio(e.fecha_inicio); setUebId(String(e.ueb_id));
    setError(""); onOpen();
  };
  const abrirEliminar = (e: Expediente) => { setEliminando(e); onDeleteOpen(); };

  const handleGuardar = async () => {
    if (!empresa) return;
    if (!numero.trim() || !nombre.trim() || !uebId) { setError("Número, nombre y UEB son obligatorios."); return; }
    setError(""); setSaving(true);
    try {
      const dto = { numero_expediente: numero, nombre, zona: zona || undefined, fecha_inicio: fechaInicio || new Date().toISOString().slice(0, 10), ueb_id: Number(uebId), empresa_id: empresa.id, activo: true };
      if (editando) { await updateExpediente(editando.id, dto); }
      else { await createExpediente(dto); }
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
        await deleteExpediente(eliminando.id);
      } else {
        await updateExpediente(eliminando.id, { activo: true });
      }
      onDeleteClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const uebNombre = (id: number) => uebs.find((u) => u.id === id)?.nombre ?? "—";

  const expedientesFiltrados = filtroUEB
    ? expedientes.filter((e) => String(e.ueb_id) === filtroUEB)
    : expedientes;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Expedientes</h1>
          <p className="text-sm text-default-500">Contratos o zonas de trabajo asignadas a cada UEB</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nuevo expediente</Button>
      </div>

      <div className="max-w-sm">
        <Select label="Filtrar por UEB" placeholder="Todas las UEBs"
          selectedKeys={filtroUEB ? [filtroUEB] : []}
          onSelectionChange={(k) => setFiltroUEB([...k][0] as string ?? "")}>
          {uebs.map((u) => <SelectItem key={String(u.id)}>{u.nombre}</SelectItem>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>
      ) : (
        <Table aria-label="Expedientes" removeWrapper>
          <TableHeader>
            <TableColumn>Número</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>UEB</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay expedientes registrados.">
            {expedientesFiltrados.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-sm">{e.numero_expediente}</TableCell>
                <TableCell className="font-medium">{e.nombre}</TableCell>
                <TableCell className="text-sm">{uebNombre(e.ueb_id)}</TableCell>
                <TableCell><Chip color={e.activo ? "success" : "default"} variant="flat" size="sm">{e.activo ? "Activo" : "Inactivo"}</Chip></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(e)}>Editar</Button>
                    <Button size="sm" variant="flat" color={e.activo ? "danger" : "success"} onPress={() => abrirEliminar(e)}>
                      {e.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editando ? "Editar expediente" : "Nuevo expediente"}</ModalHeader>
          <ModalBody className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Número" isRequired value={numero} onValueChange={setNumero} />
              <Input label="Nombre" isRequired value={nombre} onValueChange={setNombre} />
            </div>
            <Select label="UEB" isRequired selectedKeys={uebId ? [uebId] : []} onSelectionChange={(k) => setUebId([...k][0] as string ?? "")}>
              {uebs.map((u) => <SelectItem key={String(u.id)}>{u.nombre}</SelectItem>)}
            </Select>
            <Input label="Fecha inicio" type="date" value={fechaInicio} onValueChange={setFechaInicio} />
            <Textarea label="Zona / Descripción" value={zona} onValueChange={setZona} minRows={2} />
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
          <ModalHeader>{eliminando?.activo ? "Desactivar expediente" : "Activar expediente"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">¿{eliminando?.activo ? "Desactivar" : "Activar"} el expediente <strong>{eliminando?.nombre}</strong>?</p>
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
