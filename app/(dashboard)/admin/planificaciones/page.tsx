"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getExpedientes, getPlanificaciones, createPlanificacion,
  updatePlanificacion, deletePlanificacion,
} from "@/lib/services/expediente.service";
import { getActividades } from "@/lib/services/catalogo.service";
import type { Expediente, PlanificacionExpediente, Actividad } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AdminPlanificaciones() {
  const { empresa } = useAuth();
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [planificaciones, setPlanificaciones] = useState<PlanificacionExpediente[]>([]);
  const [filtroExp, setFiltroExp] = useState("");
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [editando, setEditando] = useState<PlanificacionExpediente | null>(null);
  const [eliminando, setEliminando] = useState<PlanificacionExpediente | null>(null);
  const [actId, setActId] = useState("");
  const [medida, setMedida] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [tipoNorma, setTipoNorma] = useState<"rendimiento" | "tiempo">("rendimiento");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empresa) return;
    getExpedientes().then(setExpedientes);
    getActividades().then(setActividades);
  }, [empresa]);

  const cargar = useCallback(async () => {
    if (!filtroExp) { setPlanificaciones([]); return; }
    setLoading(true);
    const data = await getPlanificaciones(Number(filtroExp));
    setPlanificaciones(data);
    setLoading(false);
  }, [filtroExp]);

  useEffect(() => { cargar(); }, [cargar]);

  // Actividades aún no planificadas en este expediente (para el select de "nueva")
  const actividadesDisponibles = (excluirId?: number) =>
    actividades.filter(
      (a) => a.id === excluirId || !planificaciones.some((p) => p.actividad_id === a.id)
    );

  const abrirCrear = () => {
    setEditando(null);
    setActId("");
    setMedida("");
    setFrecuencia("1");
    setTipoNorma("rendimiento");
    setError("");
    onOpen();
  };

  const abrirEditar = (p: PlanificacionExpediente) => {
    setEditando(p);
    setActId(String(p.actividad_id));
    setMedida(String(p.medida_planificada));
    setFrecuencia(String(p.frecuencia_veces_mes));
    setTipoNorma(p.tipo_norma);
    setError("");
    onOpen();
  };

  const handleGuardar = async () => {
    if (!actId) { setError("Selecciona una actividad."); return; }
    if (!medida || isNaN(Number(medida)) || Number(medida) <= 0) {
      setError("La medida debe ser mayor a 0."); return;
    }
    setError(""); setSaving(true);
    try {
      const dto = {
        expediente_id: Number(filtroExp),
        actividad_id: Number(actId),
        medida_planificada: Number(medida),
        frecuencia_veces_mes: Number(frecuencia) || 1,
        tipo_norma: tipoNorma,
        activo: true,
      };
      if (editando) {
        await updatePlanificacion(editando.id, dto);
      } else {
        await createPlanificacion(dto);
      }
      onClose();
      cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const abrirEliminar = (p: PlanificacionExpediente) => { setEliminando(p); onDeleteOpen(); };
  const handleEliminar = async () => {
    if (!eliminando) return;
    setSaving(true);
    try { await deletePlanificacion(eliminando.id); onDeleteClose(); cargar(); }
    finally { setSaving(false); }
  };

  const getActividad = (id: number) => actividades.find((a) => a.id === id);
  const actNombre = (id: number) => getActividad(id)?.nombre ?? String(id);
  const actUnidad = (id: number) => getActividad(id)?.unidad_medida ?? "";
  const actNormaVal = (id: number, tipo: "rendimiento" | "tiempo") => {
    const a = getActividad(id);
    if (!a) return 0;
    return tipo === "rendimiento" ? a.norma_rendimiento : a.norma_tiempo;
  };
  const actTasa = (id: number) => getActividad(id)?.tasa_salarial ?? 0;
  const calcular = (p: PlanificacionExpediente) => {
    const norma = actNormaVal(p.actividad_id, p.tipo_norma);
    const tasa = actTasa(p.actividad_id);
    const trabajo = p.medida_planificada * p.frecuencia_veces_mes;
    const valorCreado = norma > 0 ? (p.medida_planificada / norma) * p.frecuencia_veces_mes * tasa : 0;
    const normaXTasa = norma * tasa;
    const formaSalario = norma > 0 ? (trabajo / norma) * tasa : 0;
    return { norma, tasa, trabajo, valorCreado, normaXTasa, formaSalario };
  };
  const fmt = (n: number, decimals = 2) =>
    n.toLocaleString("es-CU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Planificaciones</h1>
          <p className="text-sm text-default-500">Actividades planificadas por expediente</p>
        </div>
        <Button color="primary"  onPress={abrirCrear} isDisabled={!filtroExp}>
          + Nueva actividad
        </Button>
      </div>

      <div className="max-w-sm">
        <Select
          label="Seleccionar expediente"
          placeholder="Elige un expediente"
          selectedKeys={filtroExp ? [filtroExp] : []}
          onSelectionChange={(k) => setFiltroExp([...k][0] as string ?? "")}
        >
          {expedientes.map((e) => <SelectItem key={String(e.id)}>{e.numero_expediente} — {e.nombre}</SelectItem>)}
        </Select>
      </div>

      {!filtroExp ? (
        <p className="text-sm text-default-400">Selecciona un expediente para ver sus planificaciones.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table aria-label="Planificaciones" removeWrapper>
            <TableHeader>
              <TableColumn>Actividad</TableColumn>
              <TableColumn>U.M.</TableColumn>
              <TableColumn>Norma</TableColumn>
              <TableColumn>Medida</TableColumn>
              <TableColumn>Frec./mes</TableColumn>
              <TableColumn>Tasa salarial</TableColumn>
              <TableColumn>Trabajo</TableColumn>
              <TableColumn>Valor creado</TableColumn>
              <TableColumn>NormaXTasa</TableColumn>
              <TableColumn>Forma/Salario</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No hay actividades planificadas. Usa '+ Nueva actividad' para agregar.">
              {loading
                ? <TableSkeleton columns={11} rows={3} />
                : planificaciones.map((p) => {
                const { norma, tasa, trabajo, valorCreado, normaXTasa, formaSalario } = calcular(p);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium whitespace-nowrap">{actNombre(p.actividad_id)}</TableCell>
                    <TableCell className="text-sm text-default-500">{actUnidad(p.actividad_id)}</TableCell>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {norma.toLocaleString("es-CU", { maximumFractionDigits: 4 })}{" "}
                      <span className="text-xs text-default-400">({p.tipo_norma === "rendimiento" ? "rend." : "tiempo"})</span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{p.medida_planificada.toLocaleString("es-CU", { maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="font-mono text-sm">{p.frecuencia_veces_mes}×</TableCell>
                    <TableCell className="font-mono text-sm">{fmt(tasa)}</TableCell>
                    <TableCell className="font-mono text-sm">{trabajo.toLocaleString("es-CU", { maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold">{fmt(valorCreado)}</TableCell>
                    <TableCell className="font-mono text-sm">{fmt(normaXTasa)}</TableCell>
                    <TableCell className="font-mono text-sm">{fmt(formaSalario)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="flat" onPress={() => abrirEditar(p)}>Editar</Button>
                        <Button size="sm" variant="flat" color="danger" onPress={() => abrirEliminar(p)}>Eliminar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            }
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal crear / editar */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader>{editando ? "Editar actividad planificada" : "Nueva actividad planificada"}</ModalHeader>
          <ModalBody className="space-y-3">
            <Select
              label="Actividad"
              isRequired
              selectedKeys={actId ? [actId] : []}
              onSelectionChange={(k) => setActId([...k][0] as string ?? "")}
              isDisabled={!!editando}
            >
              {actividadesDisponibles(editando?.actividad_id).map((a) => (
                <SelectItem key={String(a.id)}>{a.nombre} ({a.unidad_medida})</SelectItem>
              ))}
            </Select>
            <Select
              label="Tipo de norma"
              isRequired
              selectedKeys={[tipoNorma]}
              onSelectionChange={(k) => setTipoNorma(([...k][0] as "rendimiento" | "tiempo") ?? "rendimiento")}
            >
              <SelectItem key="rendimiento">Rendimiento (unidades / hora)</SelectItem>
              <SelectItem key="tiempo">Tiempo (horas / unidad)</SelectItem>
            </Select>
            <Input
              label="Medida planificada"
              type="number"
              min="0"
              step="0.01"
              isRequired
              value={medida}
              onValueChange={setMedida}
            />
            <Input
              label="Frecuencia (veces / mes)"
              type="number"
              min="1"
              step="1"
              value={frecuencia}
              onValueChange={setFrecuencia}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleGuardar}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent>
          <ModalHeader>Eliminar actividad</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              ¿Eliminar la planificación de{" "}
              <strong>{actNombre(eliminando?.actividad_id ?? 0)}</strong> de este expediente?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>Cancelar</Button>
            <Button color="danger" isLoading={saving} onPress={handleEliminar}>Eliminar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
