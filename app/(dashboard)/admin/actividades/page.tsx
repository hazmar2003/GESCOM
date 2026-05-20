"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getCatalogos, getTiposActividad, getActividades, getAllTiposActividad,
  createActividad, updateActividad, deleteActividad,
} from "@/lib/services/catalogo.service";
import type { Catalogo, TipoActividad, Actividad } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AdminActividades() {
  const { empresa } = useAuth();
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [tiposAll, setTiposAll] = useState<TipoActividad[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [filtroCatalogo, setFiltroCatalogo] = useState("");
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<Actividad | null>(null);
  const [eliminando, setEliminando] = useState<Actividad | null>(null);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [unidad, setUnidad] = useState("");
  const [normaT, setNormaT] = useState("");
  const [normaR, setNormaR] = useState("");
  const [tasa, setTasa] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empresa) return;
    getCatalogos().then(setCatalogos);
    getAllTiposActividad().then(setTiposAll);
  }, [empresa]);

  const cargar = useCallback(async () => {
    if (!empresa) return;
    setLoading(true);
    const data = await getActividades();
    setActividades(data);
    setLoading(false);
  }, [empresa, filtroCatalogo]);

  useEffect(() => { cargar(); }, [cargar]);

  const resetForm = () => {
    setCodigo(""); setNombre(""); setTipoId(""); setUnidad(""); setNormaT(""); setNormaR(""); setTasa(""); setError("");
  };

  const abrirCrear = () => { setEditando(null); resetForm(); onOpen(); };
  const abrirEditar = (a: Actividad) => {
    setEditando(a);
    setCodigo(a.codigo); setNombre(a.nombre); setTipoId(String(a.tipo_actividad_id));
    setUnidad(a.unidad_medida); setNormaT(String(a.norma_tiempo)); setNormaR(String(a.norma_rendimiento));
    setTasa(String(a.tasa_salarial)); setError(""); onOpen();
  };
  const abrirEliminar = (a: Actividad) => { setEliminando(a); onDeleteOpen(); };

  const handleGuardar = async () => {
    if (!empresa) return;
    if (!codigo.trim() || !nombre.trim() || !tipoId || !unidad.trim()) { setError("Completa todos los campos obligatorios."); return; }
    if (isNaN(Number(normaT)) || isNaN(Number(normaR)) || isNaN(Number(tasa))) { setError("Norma tiempo, rendimiento y tasa deben ser números."); return; }
    setError(""); setSaving(true);
    try {
      const dto = {
        codigo, nombre, tipo_actividad_id: Number(tipoId), unidad_medida: unidad,
        norma_tiempo: Number(normaT), norma_rendimiento: Number(normaR),
        tasa_salarial: Number(tasa), empresa_id: empresa.id, activo: true,
      };
      if (editando) { await updateActividad(editando.id, dto); }
      else { await createActividad(dto); }
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
        await deleteActividad(eliminando.id);
      } else {
        await updateActividad(eliminando.id, { activo: true });
      }
      onDeleteClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const tipoNombre = (id: number) =>
    tiposAll.find((t) => t.id === id)?.nombre ?? "—";

  const catalogoActivoParaActividad = (a: Actividad) => {
    const tipo = tiposAll.find((t) => t.id === a.tipo_actividad_id);
    return catalogos.find((c) => c.id === tipo?.catalogo_id)?.activo ?? false;
  };
  const actividadesFiltradas = filtroCatalogo
    ? actividades.filter((a) => {
        const tipo = tiposAll.find((t) => t.id === a.tipo_actividad_id);
        return tipo?.catalogo_id === Number(filtroCatalogo);
      })
    : actividades;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Actividades</h1>
          <p className="text-sm text-default-500">Actividades productivas con normas técnicas y salario</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nueva actividad</Button>
      </div>

      <div className="max-w-sm">
        <Select label="Filtrar por catálogo" placeholder="Todos los catálogos"
          selectedKeys={filtroCatalogo ? [filtroCatalogo] : []}
          onSelectionChange={(k) => setFiltroCatalogo([...k][0] as string ?? "")}>
          {catalogos.filter((c) => c.activo).map((c) => <SelectItem key={String(c.id)}>{c.nombre}</SelectItem>)}
        </Select>
      </div>

      <Table aria-label="Actividades" removeWrapper>
        <TableHeader>
          <TableColumn>Código</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Unidad</TableColumn>
          <TableColumn>Norma tiempo</TableColumn>
          <TableColumn>Tasa salarial</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay actividades registradas.">
          {loading
            ? <TableSkeleton columns={8} />
            : actividadesFiltradas.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono text-sm">{a.codigo}</TableCell>
                <TableCell className="font-medium">{a.nombre}</TableCell>
                <TableCell className="text-sm text-default-500">{tipoNombre(a.tipo_actividad_id)}</TableCell>
                <TableCell className="text-sm">{a.unidad_medida}</TableCell>
                <TableCell className="text-sm font-mono">{a.norma_tiempo} h</TableCell>
                <TableCell className="text-sm font-mono">${a.tasa_salarial.toFixed(2)}</TableCell>
                <TableCell><Chip color={a.activo ? "success" : "default"} variant="flat" size="sm">{a.activo ? "Activa" : "Inactiva"}</Chip></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(a)}>Editar</Button>
                    <Button
                      size="sm" variant="flat"
                      color={a.activo ? "danger" : "success"}
                      isDisabled={!a.activo && !catalogoActivoParaActividad(a)}
                      onPress={() => { setEliminando(a); onDeleteOpen(); }}
                    >
                      {a.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>{editando ? "Editar actividad" : "Nueva actividad"}</ModalHeader>
          <ModalBody className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Código" isRequired value={codigo} onValueChange={setCodigo} />
              <Input label="Nombre" isRequired value={nombre} onValueChange={setNombre} />
            </div>
            <Select label="Tipo de actividad" isRequired selectedKeys={tipoId ? [tipoId] : []}
              onSelectionChange={(k) => setTipoId([...k][0] as string ?? "")}>
              {tiposAll.map((t) => <SelectItem key={String(t.id)}>{t.nombre}</SelectItem>)}
            </Select>
            {tiposAll.length === 0 && <p className="text-xs text-default-400">Primero selecciona un catálogo en el filtro para ver sus tipos de actividad.</p>}
            <div className="grid grid-cols-3 gap-3">
              <Input label="Unidad medida" isRequired value={unidad} onValueChange={setUnidad} />
              <Input label="Norma tiempo (h)" type="number" min="0" step="0.01" value={normaT} onValueChange={setNormaT} />
              <Input label="Norma rendimiento" type="number" min="0" step="0.01" value={normaR} onValueChange={setNormaR} />
            </div>
            <Input label="Tasa salarial (CUP/h)" type="number" min="0" step="0.01" value={tasa} onValueChange={setTasa} />
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
          <ModalHeader>{eliminando?.activo ? "Desactivar actividad" : "Activar actividad"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              {eliminando?.activo
                ? <>¿Desactivar la actividad <strong>{eliminando?.nombre}</strong>?</>
                : <>¿Activar la actividad <strong>{eliminando?.nombre}</strong>?</>
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
