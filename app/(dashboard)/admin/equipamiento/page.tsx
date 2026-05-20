"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getEquipamiento, createEquipamiento, updateEquipamiento, deleteEquipamiento } from "@/lib/services/equipamiento.service";
import { getUEBsByEmpresa } from "@/lib/services/ueb.service";
import type { Equipamiento, UEB } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AdminEquipamiento() {
  const { empresa } = useAuth();
  const [uebs, setUebs] = useState<UEB[]>([]);
  const [equipamientos, setEquipamientos] = useState<Equipamiento[]>([]);
  const [filtroUEB, setFiltroUEB] = useState("");
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<Equipamiento | null>(null);
  const [eliminando, setEliminando] = useState<Equipamiento | null>(null);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [uebId, setUebId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa) return;
    const data = await getEquipamiento();
    setEquipamientos(data);
  }, [empresa]);

  useEffect(() => {
    if (!empresa) return;
    setLoading(true);
    Promise.all([getEquipamiento(), getUEBsByEmpresa()])
      .then(([equip, ubs]) => { setEquipamientos(equip); setUebs(ubs); })
      .finally(() => setLoading(false));
  }, [empresa]);

  const resetForm = () => { setCodigo(""); setNombre(""); setTipo(""); setUebId(""); setError(""); };
  const abrirCrear = () => { setEditando(null); resetForm(); onOpen(); };
  const abrirEditar = (e: Equipamiento) => {
    setEditando(e);
    setCodigo(e.codigo_inventario); setNombre(e.nombre); setTipo(e.tipo ?? ""); setUebId(String(e.ueb_id));
    setError(""); onOpen();
  };
  const abrirEliminar = (e: Equipamiento) => { setEliminando(e); onDeleteOpen(); };

  const handleGuardar = async () => {
    if (!empresa) return;
    if (!codigo.trim() || !nombre.trim() || !uebId) { setError("Código, nombre y UEB son obligatorios."); return; }
    setError(""); setSaving(true);
    try {
      const dto = { codigo_inventario: codigo, nombre, tipo: tipo || undefined, ueb_id: Number(uebId), empresa_id: empresa.id, activo: true };
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
    try {
      if (eliminando.activo) {
        await deleteEquipamiento(eliminando.id);
      } else {
        await updateEquipamiento(eliminando.id, { activo: true });
      }
      onDeleteClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const uebNombre = (id: number) => uebs.find((u) => u.id === id)?.nombre ?? "—";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Equipamiento</h1>
          <p className="text-sm text-default-500">Vehículos y maquinaria de la empresa</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nuevo equipo</Button>
      </div>

      <div className="max-w-sm">
        <Select label="Filtrar por UEB" placeholder="Todas las UEBs"
          selectedKeys={filtroUEB ? [filtroUEB] : []}
          onSelectionChange={(k) => setFiltroUEB([...k][0] as string ?? "")}>
          {uebs.map((u) => <SelectItem key={String(u.id)}>{u.nombre}</SelectItem>)}
        </Select>
      </div>

      <Table aria-label="Equipamiento" removeWrapper>
        <TableHeader>
          <TableColumn>Código</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn>UEB</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay equipamiento registrado.">
          {loading
            ? <TableSkeleton columns={6} />
            : equipamientos.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-sm">{e.codigo_inventario}</TableCell>
                <TableCell className="font-medium">{e.nombre}</TableCell>
                <TableCell className="text-sm text-default-500">{e.tipo ?? "—"}</TableCell>
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
            ))
          }
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editando ? "Editar equipamiento" : "Nuevo equipamiento"}</ModalHeader>
          <ModalBody className="space-y-3">
            <Input label="Código de inventario" isRequired value={codigo} onValueChange={setCodigo} />
            <Input label="Nombre" isRequired value={nombre} onValueChange={setNombre} />
            <Input label="Tipo (ej: camión, tractor)" value={tipo} onValueChange={setTipo} />
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
          <ModalHeader>{eliminando?.activo ? "Desactivar equipamiento" : "Activar equipamiento"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">¿{eliminando?.activo ? "Desactivar" : "Activar"} <strong>{eliminando?.nombre}</strong>?</p>
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
