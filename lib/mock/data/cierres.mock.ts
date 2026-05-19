import type { CierreMensual, ReporteMensualDetalle } from "@/types/models";

export const mockCierresMensuales: CierreMensual[] = [
  { id: 1, anio: 2026, mes: 1, empresa_id: 1, fecha_cierre: "2026-02-03T10:30:00Z", cerrado_por: 1 },
  { id: 2, anio: 2026, mes: 2, empresa_id: 1, fecha_cierre: "2026-03-04T09:15:00Z", cerrado_por: 1 },
  { id: 3, anio: 2026, mes: 3, empresa_id: 1, fecha_cierre: "2026-04-02T11:00:00Z", cerrado_por: 1 },
  { id: 4, anio: 2026, mes: 4, empresa_id: 1, fecha_cierre: "2026-05-02T09:45:00Z", cerrado_por: 1 },
];

export const mockReportesMensuales: ReporteMensualDetalle[] = [
  // Cierre Abril 2026 (id: 4)
  // planif 1: exp1/UEB1, act4 (Poda césped) norma_rendimiento=30
  { id: 1,  cierre_mensual_id: 4, planificacion_expediente_id: 1,  cantidad_planificada_mes: 8000,   cantidad_ejecutada_mes: 7600,   porcentaje_cumplimiento: 95.00,  tasa_salarial_aplicada: 0.50,  salario_devengado: 3800.00,  norma_aplicada: 30.0, tipo_norma: "rendimiento" },
  // planif 2: exp1/UEB1, act6 (Limpieza general) norma_rendimiento=10
  { id: 2,  cierre_mensual_id: 4, planificacion_expediente_id: 2,  cantidad_planificada_mes: 16000,  cantidad_ejecutada_mes: 16000,  porcentaje_cumplimiento: 100.00, tasa_salarial_aplicada: 0.30,  salario_devengado: 4800.00,  norma_aplicada: 10.0, tipo_norma: "rendimiento" },
  // planif 3: exp1/UEB1, act5 (Poda arbustos) norma_rendimiento=2
  { id: 3,  cierre_mensual_id: 4, planificacion_expediente_id: 3,  cantidad_planificada_mes: 30,     cantidad_ejecutada_mes: 28,     porcentaje_cumplimiento: 93.33,  tasa_salarial_aplicada: 5.00,  salario_devengado: 140.00,   norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
  // planif 4: exp2/UEB1, act1 (Barrido aceras) norma_rendimiento=2
  { id: 4,  cierre_mensual_id: 4, planificacion_expediente_id: 4,  cantidad_planificada_mes: 150000, cantidad_ejecutada_mes: 145000, porcentaje_cumplimiento: 96.67,  tasa_salarial_aplicada: 1.20,  salario_devengado: 174000.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
  // planif 5: exp2/UEB1, act2 (Barrido cunetas) norma_rendimiento=4
  { id: 5,  cierre_mensual_id: 4, planificacion_expediente_id: 5,  cantidad_planificada_mes: 60000,  cantidad_ejecutada_mes: 58000,  porcentaje_cumplimiento: 96.67,  tasa_salarial_aplicada: 0.80,  salario_devengado: 46400.00,  norma_aplicada: 4.0,  tipo_norma: "rendimiento" },
  // planif 6: exp3/UEB1, act7 (Recogida) norma_rendimiento=0.5
  { id: 6,  cierre_mensual_id: 4, planificacion_expediente_id: 6,  cantidad_planificada_mes: 240,    cantidad_ejecutada_mes: 230,    porcentaje_cumplimiento: 95.83,  tasa_salarial_aplicada: 25.00, salario_devengado: 5750.00,  norma_aplicada: 0.5,  tipo_norma: "rendimiento" },
  // planif 7: exp4/UEB2, act4 (Poda césped) norma_rendimiento=30
  { id: 7,  cierre_mensual_id: 4, planificacion_expediente_id: 7,  cantidad_planificada_mes: 14000,  cantidad_ejecutada_mes: 12000,  porcentaje_cumplimiento: 85.71,  tasa_salarial_aplicada: 0.50,  salario_devengado: 6000.00,  norma_aplicada: 30.0, tipo_norma: "rendimiento" },
  // planif 8: exp4/UEB2, act6 (Limpieza general) norma_rendimiento=10
  { id: 8,  cierre_mensual_id: 4, planificacion_expediente_id: 8,  cantidad_planificada_mes: 14000,  cantidad_ejecutada_mes: 13500,  porcentaje_cumplimiento: 96.43,  tasa_salarial_aplicada: 0.30,  salario_devengado: 4050.00,  norma_aplicada: 10.0, tipo_norma: "rendimiento" },
  // planif 9: exp5/UEB2, act1 (Barrido aceras) norma_rendimiento=2
  { id: 9,  cierre_mensual_id: 4, planificacion_expediente_id: 9,  cantidad_planificada_mes: 120000, cantidad_ejecutada_mes: 118000, porcentaje_cumplimiento: 98.33,  tasa_salarial_aplicada: 1.20,  salario_devengado: 141600.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
  // planif 10: exp6/UEB3, act7 (Recogida) norma_rendimiento=0.5
  { id: 10, cierre_mensual_id: 4, planificacion_expediente_id: 10, cantidad_planificada_mes: 180,    cantidad_ejecutada_mes: 175,    porcentaje_cumplimiento: 97.22,  tasa_salarial_aplicada: 25.00, salario_devengado: 4375.00,  norma_aplicada: 0.5,  tipo_norma: "rendimiento" },
  // Cierre Marzo 2026 (id: 3)
  { id: 11, cierre_mensual_id: 3, planificacion_expediente_id: 4,  cantidad_planificada_mes: 155000, cantidad_ejecutada_mes: 140000, porcentaje_cumplimiento: 90.32,  tasa_salarial_aplicada: 1.20,  salario_devengado: 168000.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
  { id: 12, cierre_mensual_id: 3, planificacion_expediente_id: 6,  cantidad_planificada_mes: 248,    cantidad_ejecutada_mes: 220,    porcentaje_cumplimiento: 88.71,  tasa_salarial_aplicada: 25.00, salario_devengado: 5500.00,  norma_aplicada: 0.5,  tipo_norma: "rendimiento" },
  { id: 13, cierre_mensual_id: 3, planificacion_expediente_id: 9,  cantidad_planificada_mes: 124000, cantidad_ejecutada_mes: 110000, porcentaje_cumplimiento: 88.71,  tasa_salarial_aplicada: 1.20,  salario_devengado: 132000.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
];
