import type {
  OrdenTrabajo,
  OrdenTrabajoTrabajador,
  OrdenTrabajoEquipamiento,
} from "@/types/models";

export const mockOrdenesTrabajo: OrdenTrabajo[] = [
  // --- Mayo 2026 (mes actual, abierto) ---
  { id: 1, planificacion_expediente_id: 4, fecha_ejecucion: "2026-05-01", cantidad_realizada: 5000, estado: "pendiente", observaciones: "Barrido completo sin novedades.", created_by: 2, updated_by: 2, motivo_modificacion: undefined, created_at: "2026-05-01T09:00:00Z", updated_at: "2026-05-01T10:00:00Z" },
  { id: 2, planificacion_expediente_id: 5, fecha_ejecucion: "2026-05-01", cantidad_realizada: 1800, estado: "pendiente", observaciones: undefined, created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-01T09:30:00Z", updated_at: "2026-05-01T09:30:00Z" },
  { id: 3, planificacion_expediente_id: 6, fecha_ejecucion: "2026-05-01", cantidad_realizada: 7.5, estado: "pendiente", observaciones: "Se recogieron 7.5t en Versalles.", created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-01T14:00:00Z", updated_at: "2026-05-01T14:00:00Z" },
  { id: 4, planificacion_expediente_id: 1, fecha_ejecucion: "2026-05-03", cantidad_realizada: 1800, estado: "pendiente", observaciones: "Zona sureste pendiente.", created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-03T10:00:00Z", updated_at: "2026-05-03T10:00:00Z" },
  { id: 5, planificacion_expediente_id: 2, fecha_ejecucion: "2026-05-03", cantidad_realizada: 2000, estado: "pendiente", observaciones: undefined, created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-03T11:00:00Z", updated_at: "2026-05-03T11:00:00Z" },
  { id: 6, planificacion_expediente_id: 4, fecha_ejecucion: "2026-05-02", cantidad_realizada: 4500, estado: "pendiente", observaciones: "Cantidad incorrecta, se corrigió.", created_by: 2, updated_by: 3, motivo_modificacion: "Error en medición, cantidad real 4500 m².", created_at: "2026-05-02T09:00:00Z", updated_at: "2026-05-02T16:00:00Z" },
  { id: 7, planificacion_expediente_id: 9, fecha_ejecucion: "2026-05-02", cantidad_realizada: 4000, estado: "pendiente", observaciones: undefined, created_by: 3, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-02T09:00:00Z", updated_at: "2026-05-02T09:00:00Z" },
  { id: 8, planificacion_expediente_id: 7, fecha_ejecucion: "2026-05-03", cantidad_realizada: 3200, estado: "pendiente", observaciones: undefined, created_by: 3, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-03T08:30:00Z", updated_at: "2026-05-03T08:30:00Z" },
  { id: 9, planificacion_expediente_id: 4, fecha_ejecucion: "2026-05-04", cantidad_realizada: 5000, estado: "pendiente", observaciones: undefined, created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-04T09:00:00Z", updated_at: "2026-05-04T09:00:00Z" },
  { id: 10, planificacion_expediente_id: 6, fecha_ejecucion: "2026-05-04", cantidad_realizada: 8.0, estado: "pendiente", observaciones: undefined, created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-04T14:00:00Z", updated_at: "2026-05-04T14:00:00Z" },
  { id: 11, planificacion_expediente_id: 5, fecha_ejecucion: "2026-05-05", cantidad_realizada: 2000, estado: "pendiente", observaciones: undefined, created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-05T09:30:00Z", updated_at: "2026-05-05T09:30:00Z" },
  { id: 12, planificacion_expediente_id: 3, fecha_ejecucion: "2026-05-05", cantidad_realizada: 14, estado: "pendiente", observaciones: "Faltó podar 1 arbusto.", created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-05T11:00:00Z", updated_at: "2026-05-05T11:00:00Z" },
  { id: 13, planificacion_expediente_id: 10, fecha_ejecucion: "2026-05-05", cantidad_realizada: 6.0, estado: "pendiente", observaciones: undefined, created_by: 1, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-05T15:00:00Z", updated_at: "2026-05-05T15:00:00Z" },
  { id: 14, planificacion_expediente_id: 4, fecha_ejecucion: "2026-05-06", cantidad_realizada: 5000, estado: "pendiente", observaciones: undefined, created_by: 2, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-06T09:00:00Z", updated_at: "2026-05-06T09:00:00Z" },
  { id: 15, planificacion_expediente_id: 8, fecha_ejecucion: "2026-05-06", cantidad_realizada: 3500, estado: "pendiente", observaciones: undefined, created_by: 3, updated_by: null, motivo_modificacion: undefined, created_at: "2026-05-06T10:00:00Z", updated_at: "2026-05-06T10:00:00Z" },

  // --- Abril 2026 (cerrado, cierre id: 4) ---
  // planif 1: Poda césped exp1/UEB1 → ejecutado 7600
  { id: 16, planificacion_expediente_id: 1,  fecha_ejecucion: "2026-04-04", cantidad_realizada: 7600,  estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-04T09:00:00Z", updated_at: "2026-04-04T10:00:00Z" },
  // planif 2: Limpieza general exp1/UEB1 → ejecutado 16000
  { id: 17, planificacion_expediente_id: 2,  fecha_ejecucion: "2026-04-05", cantidad_realizada: 16000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-05T09:00:00Z", updated_at: "2026-04-05T10:00:00Z" },
  // planif 3: Poda arbustos exp1/UEB1 → ejecutado 28 (+ 1 rechazada)
  { id: 18, planificacion_expediente_id: 3,  fecha_ejecucion: "2026-04-08", cantidad_realizada: 14,    estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-08T11:00:00Z", updated_at: "2026-04-08T11:30:00Z" },
  { id: 19, planificacion_expediente_id: 3,  fecha_ejecucion: "2026-04-15", cantidad_realizada: 14,    estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-15T11:00:00Z", updated_at: "2026-04-15T11:30:00Z" },
  { id: 20, planificacion_expediente_id: 3,  fecha_ejecucion: "2026-04-10", cantidad_realizada: 5,     estado: "rechazada", observaciones: "Cantidad no coincide con parte de trabajo.", created_by: 2, updated_by: 3, motivo_modificacion: "Error de conteo.", created_at: "2026-04-10T14:00:00Z", updated_at: "2026-04-10T16:00:00Z" },
  // planif 4: Barrido aceras exp2/UEB1 → ejecutado 145000 (+ 1 rechazada)
  { id: 21, planificacion_expediente_id: 4,  fecha_ejecucion: "2026-04-01", cantidad_realizada: 50000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-01T09:00:00Z", updated_at: "2026-04-01T10:00:00Z" },
  { id: 22, planificacion_expediente_id: 4,  fecha_ejecucion: "2026-04-08", cantidad_realizada: 50000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-08T09:00:00Z", updated_at: "2026-04-08T10:00:00Z" },
  { id: 23, planificacion_expediente_id: 4,  fecha_ejecucion: "2026-04-15", cantidad_realizada: 45000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-15T09:00:00Z", updated_at: "2026-04-15T10:00:00Z" },
  { id: 24, planificacion_expediente_id: 4,  fecha_ejecucion: "2026-04-22", cantidad_realizada: 6000,  estado: "rechazada", observaciones: "Zona no fue barrida completamente.", created_by: 2, updated_by: 3, motivo_modificacion: "Parte incompleto.", created_at: "2026-04-22T09:00:00Z", updated_at: "2026-04-22T15:00:00Z" },
  // planif 5: Barrido cunetas exp2/UEB1 → ejecutado 58000
  { id: 25, planificacion_expediente_id: 5,  fecha_ejecucion: "2026-04-02", cantidad_realizada: 30000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-02T09:00:00Z", updated_at: "2026-04-02T10:00:00Z" },
  { id: 26, planificacion_expediente_id: 5,  fecha_ejecucion: "2026-04-16", cantidad_realizada: 28000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-16T09:00:00Z", updated_at: "2026-04-16T10:00:00Z" },
  // planif 6: Recogida RSU exp3/UEB1 → ejecutado 230 t
  { id: 27, planificacion_expediente_id: 6,  fecha_ejecucion: "2026-04-05", cantidad_realizada: 120,   estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-05T14:00:00Z", updated_at: "2026-04-05T15:00:00Z" },
  { id: 28, planificacion_expediente_id: 6,  fecha_ejecucion: "2026-04-19", cantidad_realizada: 110,   estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-04-19T14:00:00Z", updated_at: "2026-04-19T15:00:00Z" },
  // planif 7: Poda césped exp4/UEB2 → ejecutado 12000
  { id: 29, planificacion_expediente_id: 7,  fecha_ejecucion: "2026-04-04", cantidad_realizada: 12000, estado: "validada",  observaciones: undefined, created_by: 3, updated_by: 3,    motivo_modificacion: undefined, created_at: "2026-04-04T09:00:00Z", updated_at: "2026-04-04T10:00:00Z" },
  // planif 8: Limpieza general exp4/UEB2 → ejecutado 13500
  { id: 30, planificacion_expediente_id: 8,  fecha_ejecucion: "2026-04-05", cantidad_realizada: 13500, estado: "validada",  observaciones: undefined, created_by: 3, updated_by: 3,    motivo_modificacion: undefined, created_at: "2026-04-05T09:00:00Z", updated_at: "2026-04-05T10:00:00Z" },
  // planif 9: Barrido aceras exp5/UEB2 → ejecutado 118000
  { id: 31, planificacion_expediente_id: 9,  fecha_ejecucion: "2026-04-01", cantidad_realizada: 60000, estado: "validada",  observaciones: undefined, created_by: 3, updated_by: 3,    motivo_modificacion: undefined, created_at: "2026-04-01T09:00:00Z", updated_at: "2026-04-01T10:00:00Z" },
  { id: 32, planificacion_expediente_id: 9,  fecha_ejecucion: "2026-04-15", cantidad_realizada: 58000, estado: "validada",  observaciones: undefined, created_by: 3, updated_by: 3,    motivo_modificacion: undefined, created_at: "2026-04-15T09:00:00Z", updated_at: "2026-04-15T10:00:00Z" },
  // planif 10: Recogida RSU exp6/UEB3 → ejecutado 175 t
  { id: 33, planificacion_expediente_id: 10, fecha_ejecucion: "2026-04-07", cantidad_realizada: 175,   estado: "validada",  observaciones: undefined, created_by: 1, updated_by: 1,    motivo_modificacion: undefined, created_at: "2026-04-07T14:00:00Z", updated_at: "2026-04-07T15:00:00Z" },

  // --- Marzo 2026 (cerrado, cierre id: 3) ---
  // planif 4: Barrido aceras exp2/UEB1 → ejecutado 140000
  { id: 34, planificacion_expediente_id: 4,  fecha_ejecucion: "2026-03-01", cantidad_realizada: 70000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-03-01T09:00:00Z", updated_at: "2026-03-01T10:00:00Z" },
  { id: 35, planificacion_expediente_id: 4,  fecha_ejecucion: "2026-03-15", cantidad_realizada: 70000, estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-03-15T09:00:00Z", updated_at: "2026-03-15T10:00:00Z" },
  // planif 6: Recogida RSU exp3/UEB1 → ejecutado 220 t
  { id: 36, planificacion_expediente_id: 6,  fecha_ejecucion: "2026-03-07", cantidad_realizada: 220,   estado: "validada",  observaciones: undefined, created_by: 2, updated_by: 2,    motivo_modificacion: undefined, created_at: "2026-03-07T14:00:00Z", updated_at: "2026-03-07T15:00:00Z" },
  // planif 9: Barrido aceras exp5/UEB2 → ejecutado 110000
  { id: 37, planificacion_expediente_id: 9,  fecha_ejecucion: "2026-03-02", cantidad_realizada: 55000, estado: "validada",  observaciones: undefined, created_by: 3, updated_by: 3,    motivo_modificacion: undefined, created_at: "2026-03-02T09:00:00Z", updated_at: "2026-03-02T10:00:00Z" },
  { id: 38, planificacion_expediente_id: 9,  fecha_ejecucion: "2026-03-16", cantidad_realizada: 55000, estado: "validada",  observaciones: undefined, created_by: 3, updated_by: 3,    motivo_modificacion: undefined, created_at: "2026-03-16T09:00:00Z", updated_at: "2026-03-16T10:00:00Z" },
];

export const mockOrdenTrabajoTrabajador: OrdenTrabajoTrabajador[] = [
  { orden_trabajo_id: 1, trabajador_id: 1 },
  { orden_trabajo_id: 1, trabajador_id: 2 },
  { orden_trabajo_id: 2, trabajador_id: 1 },
  { orden_trabajo_id: 2, trabajador_id: 3 },
  { orden_trabajo_id: 3, trabajador_id: 2 },
  { orden_trabajo_id: 3, trabajador_id: 4 },
  { orden_trabajo_id: 4, trabajador_id: 1 },
  { orden_trabajo_id: 4, trabajador_id: 2 },
  { orden_trabajo_id: 5, trabajador_id: 3 },
  { orden_trabajo_id: 6, trabajador_id: 1 },
  { orden_trabajo_id: 7, trabajador_id: 5 },
  { orden_trabajo_id: 7, trabajador_id: 6 },
  { orden_trabajo_id: 8, trabajador_id: 5 },
  { orden_trabajo_id: 8, trabajador_id: 7 },
  { orden_trabajo_id: 9, trabajador_id: 1 },
  { orden_trabajo_id: 9, trabajador_id: 4 },
  { orden_trabajo_id: 10, trabajador_id: 2 },
  { orden_trabajo_id: 10, trabajador_id: 3 },
  { orden_trabajo_id: 11, trabajador_id: 1 },
  { orden_trabajo_id: 12, trabajador_id: 2 },
  { orden_trabajo_id: 12, trabajador_id: 4 },
  { orden_trabajo_id: 13, trabajador_id: 8 },
  { orden_trabajo_id: 14, trabajador_id: 1 },
  { orden_trabajo_id: 15, trabajador_id: 5 },
  { orden_trabajo_id: 15, trabajador_id: 6 },
  // Abril 2026
  { orden_trabajo_id: 16, trabajador_id: 2 }, { orden_trabajo_id: 16, trabajador_id: 4 },
  { orden_trabajo_id: 17, trabajador_id: 1 }, { orden_trabajo_id: 17, trabajador_id: 3 },
  { orden_trabajo_id: 18, trabajador_id: 2 }, { orden_trabajo_id: 18, trabajador_id: 4 },
  { orden_trabajo_id: 19, trabajador_id: 2 }, { orden_trabajo_id: 19, trabajador_id: 4 },
  { orden_trabajo_id: 20, trabajador_id: 2 },
  { orden_trabajo_id: 21, trabajador_id: 1 }, { orden_trabajo_id: 21, trabajador_id: 2 },
  { orden_trabajo_id: 22, trabajador_id: 1 }, { orden_trabajo_id: 22, trabajador_id: 2 },
  { orden_trabajo_id: 23, trabajador_id: 1 }, { orden_trabajo_id: 23, trabajador_id: 2 },
  { orden_trabajo_id: 24, trabajador_id: 1 },
  { orden_trabajo_id: 25, trabajador_id: 3 }, { orden_trabajo_id: 25, trabajador_id: 4 },
  { orden_trabajo_id: 26, trabajador_id: 3 }, { orden_trabajo_id: 26, trabajador_id: 4 },
  { orden_trabajo_id: 27, trabajador_id: 2 },
  { orden_trabajo_id: 28, trabajador_id: 2 },
  { orden_trabajo_id: 29, trabajador_id: 5 }, { orden_trabajo_id: 29, trabajador_id: 6 },
  { orden_trabajo_id: 30, trabajador_id: 5 }, { orden_trabajo_id: 30, trabajador_id: 7 },
  { orden_trabajo_id: 31, trabajador_id: 5 }, { orden_trabajo_id: 31, trabajador_id: 6 },
  { orden_trabajo_id: 32, trabajador_id: 5 }, { orden_trabajo_id: 32, trabajador_id: 6 },
  { orden_trabajo_id: 33, trabajador_id: 8 },
  // Marzo 2026
  { orden_trabajo_id: 34, trabajador_id: 1 }, { orden_trabajo_id: 34, trabajador_id: 2 },
  { orden_trabajo_id: 35, trabajador_id: 1 }, { orden_trabajo_id: 35, trabajador_id: 2 },
  { orden_trabajo_id: 36, trabajador_id: 2 },
  { orden_trabajo_id: 37, trabajador_id: 5 }, { orden_trabajo_id: 37, trabajador_id: 6 },
  { orden_trabajo_id: 38, trabajador_id: 5 }, { orden_trabajo_id: 38, trabajador_id: 6 },
];

export const mockOrdenTrabajoEquipamiento: OrdenTrabajoEquipamiento[] = [
  { orden_trabajo_id: 1, equipamiento_id: 2 },  // Barredora
  { orden_trabajo_id: 2, equipamiento_id: 2 },
  { orden_trabajo_id: 3, equipamiento_id: 1 },  // Camión
  { orden_trabajo_id: 4, equipamiento_id: 4 },  // Cortadora
  { orden_trabajo_id: 5, equipamiento_id: 2 },
  { orden_trabajo_id: 6, equipamiento_id: 2 },
  { orden_trabajo_id: 7, equipamiento_id: 5 },  // Camión UEB2
  { orden_trabajo_id: 8, equipamiento_id: 4 },
  { orden_trabajo_id: 9, equipamiento_id: 2 },
  { orden_trabajo_id: 10, equipamiento_id: 1 },
  { orden_trabajo_id: 11, equipamiento_id: 2 },
  { orden_trabajo_id: 13, equipamiento_id: 7 },  // Camión UEB3
  { orden_trabajo_id: 14, equipamiento_id: 2 },
  { orden_trabajo_id: 15, equipamiento_id: 4 },
  // Abril 2026
  { orden_trabajo_id: 16, equipamiento_id: 4 },  // Cortadora
  { orden_trabajo_id: 17, equipamiento_id: 2 },  // Barredora
  { orden_trabajo_id: 18, equipamiento_id: 4 },
  { orden_trabajo_id: 19, equipamiento_id: 4 },
  { orden_trabajo_id: 20, equipamiento_id: 4 },
  { orden_trabajo_id: 21, equipamiento_id: 2 },
  { orden_trabajo_id: 22, equipamiento_id: 2 },
  { orden_trabajo_id: 23, equipamiento_id: 2 },
  { orden_trabajo_id: 24, equipamiento_id: 2 },
  { orden_trabajo_id: 25, equipamiento_id: 2 },
  { orden_trabajo_id: 26, equipamiento_id: 2 },
  { orden_trabajo_id: 27, equipamiento_id: 1 },  // Camión
  { orden_trabajo_id: 28, equipamiento_id: 1 },
  { orden_trabajo_id: 29, equipamiento_id: 4 },
  { orden_trabajo_id: 30, equipamiento_id: 5 },  // Camión UEB2
  { orden_trabajo_id: 31, equipamiento_id: 5 },
  { orden_trabajo_id: 32, equipamiento_id: 5 },
  { orden_trabajo_id: 33, equipamiento_id: 7 },  // Camión UEB3
  // Marzo 2026
  { orden_trabajo_id: 34, equipamiento_id: 2 },
  { orden_trabajo_id: 35, equipamiento_id: 2 },
  { orden_trabajo_id: 36, equipamiento_id: 1 },
  { orden_trabajo_id: 37, equipamiento_id: 5 },
  { orden_trabajo_id: 38, equipamiento_id: 5 },
];
