"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card, CardBody, CardHeader, Divider, Button, Input, Textarea,
  CheckboxGroup, Checkbox, Spinner,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getOrdenTrabajoById, updateOrdenTrabajo } from "@/lib/services/orden-trabajo.service";
import { getTrabajadores } from "@/lib/services/trabajador.service";
import { getEquipamiento } from "@/lib/services/equipamiento.service";
import type { OrdenTrabajoDetalle, Trabajador, Equipamiento } from "@/types/models";

export default function EditarOrdenTrabajo() {
  const { id } = useParams();
  const { usuario, empresa } = useAuth();
  const router = useRouter();

  const [orden, setOrden] = useState<OrdenTrabajoDetalle | null>(null);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [equipamientos, setEquipamientos] = useState<Equipamiento[]>([]);

  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [motivo, setMotivo] = useState("");
  const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState<string[]>([]);
  const [equipamientosSeleccionados, setEquipamientosSeleccionados] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empresa || !usuario?.ueb_id) return;
    Promise.all([
      getOrdenTrabajoById(Number(id)),
      getTrabajadores(),
      getEquipamiento(),
    ]).then(([ot, trabs, equips]) => {
      if (ot) {
        setOrden(ot);
        setFecha(ot.fecha_ejecucion);
        setCantidad(String(ot.cantidad_realizada));
        setObservaciones(ot.observaciones ?? "");
        setTrabajadoresSeleccionados(ot.trabajadores.map((t) => String(t.id)));
        setEquipamientosSeleccionados(ot.equipamiento.map((e) => String(e.id)));
      }
      setTrabajadores(trabs.filter((t) => t.activo));
      setEquipamientos(equips.filter((e) => e.activo));
      setLoading(false);
    });
  }, [id, empresa, usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !empresa || !orden) return;
    if (!motivo.trim()) { setError("El motivo de modificación es obligatorio."); return; }
    if (!cantidad || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      setError("Ingresa una cantidad válida mayor a 0.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await updateOrdenTrabajo(
        orden.id,
        {
          fecha_ejecucion: fecha,
          cantidad_realizada: Number(cantidad),
          observaciones: observaciones || undefined,
          motivo_modificacion: motivo,
          trabajador_ids: trabajadoresSeleccionados.map(Number),
          equipamiento_ids: equipamientosSeleccionados.map(Number),
        },
      );
      router.push(`/supervisor/ordenes-trabajo/${orden.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>;
  if (!orden) return <p className="text-danger">Orden de trabajo no encontrada.</p>;
  if (orden.estado !== "pendiente") return <p className="text-danger">Solo se pueden editar órdenes en estado pendiente.</p>;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="flat" size="sm" onPress={() => router.back()}>← Volver</Button>
        <h1 className="text-xl font-bold">Editar Orden de Trabajo #{orden.id}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <div>
              <h2 className="font-semibold">{orden.expediente_nombre}</h2>
              <p className="text-sm text-default-500">{orden.actividad_nombre} — {orden.actividad_unidad_medida}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Fecha de ejecución" type="date" isRequired value={fecha} onValueChange={setFecha} />
              <Input
                label={`Cantidad (${orden.actividad_unidad_medida})`}
                type="number" min="0" step="0.01" isRequired
                value={cantidad} onValueChange={setCantidad}
              />
            </div>
            <Textarea label="Observaciones" placeholder="Opcional..." value={observaciones} onValueChange={setObservaciones} minRows={2} />
            <Textarea
              label="Motivo de modificación *"
              placeholder="Explica por qué se modifica esta orden..."
              isRequired
              value={motivo}
              onValueChange={setMotivo}
              minRows={2}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Trabajadores</h2></CardHeader>
          <Divider />
          <CardBody>
            <CheckboxGroup value={trabajadoresSeleccionados} onValueChange={setTrabajadoresSeleccionados}>
              {trabajadores.map((t) => (
                <Checkbox key={String(t.id)} value={String(t.id)}>
                  {t.nombre} {t.apellidos}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Equipamiento</h2></CardHeader>
          <Divider />
          <CardBody>
            <CheckboxGroup value={equipamientosSeleccionados} onValueChange={setEquipamientosSeleccionados}>
              {equipamientos.map((e) => (
                <Checkbox key={String(e.id)} value={String(e.id)}>
                  {e.nombre} <span className="text-default-400 text-xs">({e.codigo_inventario})</span>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </CardBody>
        </Card>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" color="primary" isLoading={saving}>Guardar cambios</Button>
          <Button variant="flat" onPress={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
