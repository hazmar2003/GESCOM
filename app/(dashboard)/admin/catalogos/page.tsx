"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getCatalogos, createCatalogo, updateCatalogo, deleteCatalogo } from "@/lib/services/catalogo.service";
import type { Catalogo } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AdminCatalogos() {
  const { empresa } = useAuth();
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<Catalogo | null>(null);
  const [eliminando, setEliminando] = useState<Catalogo | null>(null);
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa) return;
    setLoading(true);
    const data = await getCatalogos();
    setCatalogos(data);
    setLoading(false);
  }, [empresa]);

  useEffect(() => { cargar(); }, [cargar]);

  const abrirCrear = () => { setEditando(null); setNombre(""); setError(""); onOpen(); };
  const abrirEditar = (c: Catalogo) => { setEditando(c); setNombre(c.nombre); setError(""); onOpen(); };
  const abrirEliminar = (c: Catalogo) => { setEliminando(c); onDeleteOpen(); };

  const handleGuardar = async () => {
    if (!empresa) return;
    if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setError(""); setSaving(true);
    try {
      if (editando) {
        await updateCatalogo(editando.id, { nombre });
      } else {
        await createCatalogo({ nombre, empresa_id: empresa.id, activo: true });
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
        await deleteCatalogo(eliminando.id);
      } else {
        await updateCatalogo(eliminando.id, { activo: true });
      }
      onDeleteClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Catálogos de Servicios</h1>
          <p className="text-sm text-default-500">Grupos grandes de actividades (ej: Barrido de calles, Áreas verdes)</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nuevo catálogo</Button>
      </div>

      <Table aria-label="Catálogos" removeWrapper>
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay catálogos registrados.">
          {loading
            ? <TableSkeleton columns={3} />
            : catalogos.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nombre}</TableCell>
                <TableCell><Chip color={c.activo ? "success" : "default"} variant="flat" size="sm">{c.activo ? "Activo" : "Inactivo"}</Chip></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(c)}>Editar</Button>
                    <Button size="sm" variant="flat" color={c.activo ? "danger" : "success"} onPress={() => { setEliminando(c); onDeleteOpen(); }}>
                      {c.activo ? "Desactivar" : "Activar"}
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
          <ModalHeader>{editando ? "Editar catálogo" : "Nuevo catálogo"}</ModalHeader>
          <ModalBody>
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
          <ModalHeader>{eliminando?.activo ? "Desactivar catálogo" : "Activar catálogo"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              {eliminando?.activo
                ? <>¿Desactivar el catálogo <strong>{eliminando?.nombre}</strong>? Todos sus tipos de actividad y actividades asociadas también se desactivarán.</>
                : <>¿Activar el catálogo <strong>{eliminando?.nombre}</strong>? Todos sus tipos de actividad y actividades asociadas también se reactivarán.</>
              }
            </p>
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
