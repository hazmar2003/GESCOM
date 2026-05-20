"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Spinner, useDisclosure, Divider, Select, SelectItem,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getCierres, cerrarMes } from "@/lib/services/cierre.service";
import { contarOrdenesPendientesMes } from "@/lib/services/orden-trabajo.service";
import type { CierreMensualDetalle } from "@/types/models";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function AdminCierres() {
  const { empresa, usuario } = useAuth();
  const router = useRouter();
  const [cierres, setCierres] = useState<CierreMensualDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendientes, setPendientes] = useState(0);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  const mesActual = hoy.getMonth() + 1;

  const [anioSel, setAnioSel] = useState(anioActual);
  const [mesSel, setMesSel] = useState(mesActual);

  const cargar = useCallback(async () => {
    if (!empresa) return;
    setLoading(true);
    setCierres(await getCierres());
    setLoading(false);
  }, [empresa]);

  useEffect(() => { cargar(); }, [cargar]);

  // Derivados del período seleccionado
  const cierreSel = cierres.find((c) => c.anio === anioSel && c.mes === mesSel);
  const selCerrado = !!cierreSel;
  const esFuturo =
    anioSel > anioActual || (anioSel === anioActual && mesSel > mesActual);

  const handleAbrirModal = async () => {
    if (!empresa) return;
    setLoadingCheck(true);
    try {
      const count = await contarOrdenesPendientesMes(anioSel, mesSel);
      setPendientes(count);
    } finally {
      setLoadingCheck(false);
    }
    onOpen();
  };

  const handleCerrar = async () => {
    if (!empresa || !usuario) return;
    setSaving(true);
    try {
      await cerrarMes(anioSel, mesSel);
      onClose();
      cargar();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Años disponibles: 2024 hasta el año actual
  const anios = Array.from(
    { length: anioActual - 2023 },
    (_, i) => 2024 + i,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Cierre Mensual</h1>
          <p className="text-sm text-default-500">Historial de cierres y generación de reportes</p>
        </div>
      </div>

      {/* Selector de período */}
      <Card>
        <CardBody className="space-y-4">
          <p className="text-sm font-medium text-default-600">Seleccionar período</p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-36">
              <Select
                label="Año"
                selectedKeys={[String(anioSel)]}
                onSelectionChange={(k) => setAnioSel(Number([...k][0]))}
              >
                {anios.map((a) => (
                  <SelectItem key={String(a)}>{String(a)}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-44">
              <Select
                label="Mes"
                selectedKeys={[String(mesSel)]}
                onSelectionChange={(k) => setMesSel(Number([...k][0]))}
              >
                {MESES.map((nombre, i) => {
                  const m = i + 1;
                  const cerrado = cierres.some((c) => c.anio === anioSel && c.mes === m);
                  return (
                    <SelectItem key={String(m)}>
                      {nombre}{cerrado ? " ✓" : ""}
                    </SelectItem>
                  );
                })}
              </Select>
            </div>

            {/* Estado del período seleccionado */}
            <Chip
              color={selCerrado ? "default" : esFuturo ? "default" : "warning"}
              variant="flat"
            >
              {selCerrado ? "Cerrado" : esFuturo ? "Futuro" : "Abierto"}
            </Chip>

            {/* Acciones */}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="flat"
                size="sm"
                onPress={() =>
                  selCerrado && cierreSel
                    ? router.push(`/admin/reportes/${cierreSel.id}`)
                    : router.push(`/admin/reportes/preview?anio=${anioSel}&mes=${mesSel}`)
                }
              >
                {selCerrado ? "Ver reporte" : "Vista previa"}
              </Button>
              {!selCerrado && !esFuturo && (
                <Button color="danger" size="sm" isLoading={loadingCheck} onPress={handleAbrirModal}>
                  Cerrar mes
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Divider />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner label="Cargando..." /></div>
      ) : (
        <Table aria-label="Cierres mensuales" removeWrapper>
          <TableHeader>
            <TableColumn>Período</TableColumn>
            <TableColumn>Cerrado el</TableColumn>
            <TableColumn>Cerrado por</TableColumn>
            <TableColumn>Reporte</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay cierres registrados.">
            {cierres.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{MESES[c.mes - 1]} {c.anio}</TableCell>
                <TableCell className="text-sm">{new Date(c.fecha_cierre).toLocaleString("es-CU")}</TableCell>
                <TableCell className="text-sm text-default-500">{c.cerrado_por_username}</TableCell>
                <TableCell>
                  <Button as={Link} href={`/admin/reportes/${c.id}`} size="sm" variant="flat" color="primary">
                    Ver reporte
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal confirmar cierre */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirmar cierre de mes</ModalHeader>
          <ModalBody className="space-y-3">
            <p className="text-sm">
              ¿Estás seguro de cerrar el mes de{" "}
              <strong>{MESES[mesSel - 1]} {anioSel}</strong>?
            </p>
            {pendientes > 0 && (
              <div className="rounded-lg border border-warning-300 bg-warning-50 p-3 space-y-1">
                <p className="text-sm font-semibold text-warning-800">
                  ⚠️ Hay {pendientes} orden{pendientes !== 1 ? "es" : ""} de trabajo pendiente{pendientes !== 1 ? "s" : ""} de aprobar en {MESES[mesSel - 1]} {anioSel}.
                </p>
                <p className="text-sm text-warning-700">
                  Al cerrar el mes, {pendientes !== 1 ? "todas serán marcadas" : "será marcada"} automáticamente como <strong>rechazada{pendientes !== 1 ? "s" : ""}</strong> y no contarán en el reporte.
                </p>
              </div>
            )}
            <p className="text-sm text-danger">
              Esta acción es irreversible. Se generará automáticamente el reporte mensual
              con las órdenes de trabajo validadas del período.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button color="danger" isLoading={saving} onPress={handleCerrar}>Cerrar mes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
