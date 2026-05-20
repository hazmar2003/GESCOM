"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getCatalogos, getTiposActividad, createTipoActividad,
  updateTipoActividad, deleteTipoActividad,
} from "@/lib/services/catalogo.service";
import type { Catalogo, TipoActividad } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AdminTipoActividades() {
  const { empresa } = useAuth();
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [tipos, setTipos] = useState<TipoActividad[]>([]);
  const [filtroCatalogo, setFiltroCatalogo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<TipoActividad | null>(null);
  const [eliminando, setEliminando] = useState<TipoActividad | null>(null);
  const [nombre, setNombre] = useState("");
  const [catalogoId, setCatalogoId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empresa) return;
    getCatalogos().then(setCatalogos);
  }, [empresa]);

  const cargar = useCallback(async () => {
    if (!filtroCatalogo) { setTipos([]); return; }
    setLoading(true);
    const data = await getTiposActividad(Number(filtroCatalogo));
    setTipos(data);
    setLoading(false);
  }, [filtroCatalogo]);

  useEffect(() => { cargar(); }, [cargar]);

  const abrirCrear = () => { setEditando(null); setNombre(""); setCatalogoId(filtroCatalogo); setError(""); onOpen(); };
  const abrirEditar = (t: TipoActividad) => { setEditando(t); setNombre(t.nombre); setCatalogoId(String(t.catalogo_id)); setError(""); onOpen(); };
  const abrirEliminar = (t: TipoActividad) => { setEliminando(t); onDeleteOpen(); };

  const handleGuardar = async () => {
    if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
    if (!catalogoId) { setError("Selecciona un catálogo."); return; }
    setError(""); setSaving(true);
    try {
      if (editando) {
        await updateTipoActividad(editando.id, { nombre, catalogo_id: Number(catalogoId) });
      } else {
        await createTipoActividad({ nombre, catalogo_id: Number(catalogoId), activo: true });
      }
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
        await deleteTipoActividad(eliminando.id);
      } else {
        await updateTipoActividad(eliminando.id, { activo: true });
      }
      onDeleteClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const catalogoNombre = (id: number) => catalogos.find((c) => c.id === id)?.nombre ?? "—";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Tipos de Actividad</h1>
          <p className="text-sm text-default-500">Subcategorías dentro de un catálogo</p>
        </div>
        <Button color="primary" onPress={abrirCrear} isDisabled={!filtroCatalogo}>+ Nuevo tipo</Button>
      </div>

      <div className="max-w-sm">
        <Select
          label="Filtrar por catálogo"
          placeholder="Selecciona un catálogo"
          selectedKeys={filtroCatalogo ? [filtroCatalogo] : []}
          onSelectionChange={(k) => setFiltroCatalogo([...k][0] as string ?? "")}
        >
          {catalogos.filter((c) => c.activo).map((c) => <SelectItem key={String(c.id)}>{c.nombre}</SelectItem>)}
        </Select>
      </div>

      {!filtroCatalogo ? (
        <p className="text-sm text-default-400">Selecciona un catálogo para ver sus tipos de actividad.</p>
      ) : (
        <Table aria-label="Tipos de actividad" removeWrapper>
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Catálogo</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay tipos de actividad.">
            {loading
              ? <TableSkeleton columns={4} />
              : tipos.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.nombre}</TableCell>
                <TableCell className="text-sm text-default-500">{catalogoNombre(t.catalogo_id)}</TableCell>
                <TableCell><Chip color={t.activo ? "success" : "default"} variant="flat" size="sm">{t.activo ? "Activo" : "Inactivo"}</Chip></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(t)}>Editar</Button>
                    <Button size="sm" variant="flat" color={t.activo ? "danger" : "success"} onPress={() => { setEliminando(t); onDeleteOpen(); }}>
                      {t.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              ))
            }
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editando ? "Editar tipo de actividad" : "Nuevo tipo de actividad"}</ModalHeader>
          <ModalBody className="space-y-3">
            <Select label="Catálogo" isRequired selectedKeys={catalogoId ? [catalogoId] : []} onSelectionChange={(k) => setCatalogoId([...k][0] as string ?? "")}>
              {catalogos.filter((c) => c.activo).map((c) => <SelectItem key={String(c.id)}>{c.nombre}</SelectItem>)}
            </Select>
            <Input label="Nombre" isRequired value={nombre} onValueChange={setNombre} />
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
          <ModalHeader>{eliminando?.activo ? "Desactivar tipo de actividad" : "Activar tipo de actividad"}</ModalHeader>
          <ModalBody><p className="text-sm">¿{eliminando?.activo ? "Desactivar" : "Activar"} <strong>{eliminando?.nombre}</strong>?</p>
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
