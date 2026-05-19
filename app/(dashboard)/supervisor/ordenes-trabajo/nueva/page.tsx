"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardBody, CardHeader, Divider,
  Button, Input, Select, SelectItem, Textarea,
  CheckboxGroup, Checkbox, Spinner,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { createOrdenTrabajo } from "@/lib/services/orden-trabajo.service";
import { getExpedientes, getPlanificaciones } from "@/lib/services/expediente.service";
import { getTrabajadores } from "@/lib/services/trabajador.service";
import { getEquipamiento } from "@/lib/services/equipamiento.service";
import { getActividadById } from "@/lib/services/catalogo.service";
import type {
  Expediente, PlanificacionExpediente, Trabajador,
  Equipamiento, Actividad,
} from "@/types/models";

export default function NuevaOrdenTrabajo() {
  const { usuario, empresa } = useAuth();
  const router = useRouter();

  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [planificaciones, setPlanificaciones] = useState<PlanificacionExpediente[]>([]);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [equipamientos, setEquipamientos] = useState<Equipamiento[]>([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);

  const [expId, setExpId] = useState<string>("");
  const [planifId, setPlanifId] = useState<string>("");
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);
  const [cantidad, setCantidad] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState<string[]>([]);
  const [equipamientosSeleccionados, setEquipamientosSeleccionados] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empresa || !usuario?.ueb_id) return;
    Promise.all([
      getExpedientes(),
      getTrabajadores(),
      getEquipamiento(),
    ]).then(([exps, trabs, equips]) => {
      setExpedientes(exps);
      setTrabajadores(trabs);
      setEquipamientos(equips);
      setLoading(false);
    });
  }, [empresa, usuario]);

  const onExpChange = async (id: string) => {
    setExpId(id);
    setPlanifId("");
    setActividadSeleccionada(null);
    if (!id) { setPlanificaciones([]); return; }
    const planifs = await getPlanificaciones(Number(id));
    setPlanificaciones(planifs);
  };

  const onPlanifChange = async (id: string) => {
    setPlanifId(id);
    if (!id) { setActividadSeleccionada(null); return; }
    const planif = planificaciones.find((p) => p.id === Number(id));
    if (planif) {
      const act = await getActividadById(planif.actividad_id);
      setActividadSeleccionada(act);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !empresa) return;
    if (!planifId) { setError("Selecciona una planificación."); return; }
    if (!cantidad || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      setError("Ingresa una cantidad válida mayor a 0.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await createOrdenTrabajo(
        {
          planificacion_expediente_id: Number(planifId),
          fecha_ejecucion: fecha,
          cantidad_realizada: Number(cantidad),
          observaciones: observaciones || undefined,
          trabajador_ids: trabajadoresSeleccionados.map(Number),
          equipamiento_ids: equipamientosSeleccionados.map(Number),
        },
      );
      router.push("/supervisor/ordenes-trabajo");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="flat" size="sm" onPress={() => router.back()}>← Volver</Button>
        <h1 className="text-xl font-bold">Nueva Orden de Trabajo</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><h2 className="font-semibold">Datos de la orden</h2></CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <Select
              label="Expediente"
              placeholder="Selecciona un expediente"
              isRequired
              selectedKeys={expId ? [expId] : []}
              onSelectionChange={(k) => onExpChange([...k][0] as string ?? "")}
            >
              {expedientes.map((e) => (
                <SelectItem key={String(e.id)}>
                  {e.numero_expediente} — {e.nombre}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Actividad (planificación)"
              placeholder="Selecciona primero un expediente"
              isRequired
              isDisabled={!expId}
              selectedKeys={planifId ? [planifId] : []}
              onSelectionChange={(k) => onPlanifChange([...k][0] as string ?? "")}
            >
              {planificaciones.map((p) => (
                <SelectItem key={String(p.id)}>
                  Planif. #{p.id} — {p.medida_planificada} {actividadSeleccionada?.unidad_medida ?? ""} × {p.frecuencia_veces_mes}x/mes
                </SelectItem>
              ))}
            </Select>

            {actividadSeleccionada && (
              <div className="bg-default-50 rounded-lg p-3 text-sm space-y-1">
                <p className="font-medium">{actividadSeleccionada.nombre}</p>
                <p className="text-default-500">Unidad: <strong>{actividadSeleccionada.unidad_medida}</strong> | Tasa: <strong>{actividadSeleccionada.tasa_salarial} CUP/{actividadSeleccionada.unidad_medida}</strong></p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Fecha de ejecución"
                type="date"
                isRequired
                value={fecha}
                onValueChange={setFecha}
              />
              <Input
                label={`Cantidad realizada${actividadSeleccionada ? ` (${actividadSeleccionada.unidad_medida})` : ""}`}
                type="number"
                min="0"
                step="0.01"
                isRequired
                value={cantidad}
                onValueChange={setCantidad}
              />
            </div>

            <Textarea
              label="Observaciones"
              placeholder="Opcional..."
              value={observaciones}
              onValueChange={setObservaciones}
              minRows={2}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Trabajadores</h2></CardHeader>
          <Divider />
          <CardBody>
            {trabajadores.length === 0 ? (
              <p className="text-sm text-default-400">No hay trabajadores activos en esta UEB.</p>
            ) : (
              <CheckboxGroup
                value={trabajadoresSeleccionados}
                onValueChange={setTrabajadoresSeleccionados}
              >
                {trabajadores.map((t) => (
                  <Checkbox key={String(t.id)} value={String(t.id)}>
                    {t.nombre} {t.apellidos}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Equipamiento</h2></CardHeader>
          <Divider />
          <CardBody>
            {equipamientos.length === 0 ? (
              <p className="text-sm text-default-400">No hay equipamiento activo en esta UEB.</p>
            ) : (
              <CheckboxGroup
                value={equipamientosSeleccionados}
                onValueChange={setEquipamientosSeleccionados}
              >
                {equipamientos.map((e) => (
                  <Checkbox key={String(e.id)} value={String(e.id)}>
                    {e.nombre} <span className="text-default-400 text-xs">({e.codigo_inventario})</span>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}
          </CardBody>
        </Card>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" color="primary" isLoading={saving}>
            Guardar orden
          </Button>
          <Button variant="flat" onPress={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
