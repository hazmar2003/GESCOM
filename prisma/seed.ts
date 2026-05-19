import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Limpiando base de datos...");

  // Borrar en orden inverso de dependencias
  await prisma.reporteMensualDetalle.deleteMany();
  await prisma.cierreMensual.deleteMany();
  await prisma.ordenTrabajoEquipamiento.deleteMany();
  await prisma.ordenTrabajoTrabajador.deleteMany();
  await prisma.ordenTrabajo.deleteMany();
  await prisma.planificacionExpediente.deleteMany();
  await prisma.expediente.deleteMany();
  await prisma.actividad.deleteMany();
  await prisma.tipoActividad.deleteMany();
  await prisma.catalogo.deleteMany();
  await prisma.equipamiento.deleteMany();
  await prisma.trabajador.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.uEB.deleteMany();
  await prisma.empresa.deleteMany();

  console.log("✅ Tablas limpias");

  // ── Empresas ────────────────────────────────────────────────
  await prisma.empresa.createMany({
    data: [
      { id: 1, nombre: "Empresa Municipal de Servicios Comunales - Matanzas", nombre_corto: "EMSC Matanzas", codigo_empresa: "EMSC-MTZ", ubicacion: "Calle 83 No. 298 e/ Jovellanos y Contreras, Matanzas", telefono: "45253441", email: "emsc@matanzas.cu", activo: true },
      { id: 2, nombre: "Empresa Municipal de Servicios Comunales - Cárdenas",  nombre_corto: "EMSC Cárdenas",  codigo_empresa: "EMSC-CAR", ubicacion: "Calle Coronel Verdugo No. 56, Cárdenas",                      telefono: "45522001", email: "emsc@cardenas.cu",  activo: true },
    ],
  });
  console.log("✅ Empresas");

  // ── UEBs ─────────────────────────────────────────────────────
  await prisma.uEB.createMany({
    data: [
      { id: 1, nombre: "Matanzas Centro", ubicacion: "Reparto Versalles, Matanzas",      empresa_id: 1, activo: true },
      { id: 2, nombre: "Matanzas Norte",  ubicacion: "Reparto Pueblo Nuevo, Matanzas",   empresa_id: 1, activo: true },
      { id: 3, nombre: "Matanzas Sur",    ubicacion: "Reparto La Playa, Matanzas",        empresa_id: 1, activo: true },
      { id: 4, nombre: "Cárdenas Centro", ubicacion: "Casco histórico, Cárdenas",         empresa_id: 2, activo: true },
    ],
  });
  console.log("✅ UEBs");

  // ── Usuarios ─────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 10);
  const superHash = await bcrypt.hash("super123", 10);

  await prisma.usuario.createMany({
    data: [
      { id: 1, username: "admin@matanzas.cu",    password_hash: adminHash, rol: "admin",      empresa_id: 1, ueb_id: null, trabajador_id: null, activo: true, ultimo_login: new Date("2026-05-06T09:15:00Z") },
      { id: 2, username: "supervisor1@matanzas.cu", password_hash: superHash, rol: "supervisor", empresa_id: 1, ueb_id: 1,    trabajador_id: 1,    activo: true, ultimo_login: new Date("2026-05-07T07:30:00Z") },
      { id: 3, username: "supervisor2@matanzas.cu", password_hash: superHash, rol: "supervisor", empresa_id: 1, ueb_id: 2,    trabajador_id: 5,    activo: true, ultimo_login: new Date("2026-05-07T08:00:00Z") },
      { id: 4, username: "admin@cardenas.cu",    password_hash: adminHash, rol: "admin",      empresa_id: 2, ueb_id: null, trabajador_id: null, activo: true, ultimo_login: null },
    ],
  });
  console.log("✅ Usuarios");

  // ── Catálogos ─────────────────────────────────────────────────
  await prisma.catalogo.createMany({
    data: [
      { id: 1, nombre: "Barrido de Calles",           empresa_id: 1, activo: true },
      { id: 2, nombre: "Áreas Verdes",                empresa_id: 1, activo: true },
      { id: 3, nombre: "Recogida de Desechos Sólidos", empresa_id: 1, activo: true },
      { id: 4, nombre: "Mantenimiento Vial",           empresa_id: 1, activo: true },
    ],
  });
  console.log("✅ Catálogos");

  // ── Tipos de Actividad ────────────────────────────────────────
  await prisma.tipoActividad.createMany({
    data: [
      { id: 1, nombre: "Barrido Manual",        catalogo_id: 1, activo: true },
      { id: 2, nombre: "Barrido Mecánico",       catalogo_id: 1, activo: true },
      { id: 3, nombre: "Poda y Corte",           catalogo_id: 2, activo: true },
      { id: 4, nombre: "Limpieza de Parques",    catalogo_id: 2, activo: true },
      { id: 5, nombre: "Recogida Domiciliaria",  catalogo_id: 3, activo: true },
      { id: 6, nombre: "Recogida de Escombros",  catalogo_id: 3, activo: true },
      { id: 7, nombre: "Reparación de Hoyos",   catalogo_id: 4, activo: true },
      { id: 8, nombre: "Bacheo",                 catalogo_id: 4, activo: true },
    ],
  });
  console.log("✅ Tipos de Actividad");

  // ── Actividades ───────────────────────────────────────────────
  await prisma.actividad.createMany({
    data: [
      { id: 1, codigo: "BM-001", nombre: "Barrido de aceras",                  unidad_medida: "m²",    norma_tiempo: 0.5,    norma_rendimiento: 2.0,  tasa_salarial: 1.20,  tipo_actividad_id: 1, empresa_id: 1, activo: true },
      { id: 2, codigo: "BM-002", nombre: "Barrido de contenes y cunetas",       unidad_medida: "ml",    norma_tiempo: 0.25,   norma_rendimiento: 4.0,  tasa_salarial: 0.80,  tipo_actividad_id: 1, empresa_id: 1, activo: true },
      { id: 3, codigo: "BM-003", nombre: "Barrido mecánico de calzadas",        unidad_medida: "km",    norma_tiempo: 0.1667, norma_rendimiento: 6.0,  tasa_salarial: 15.00, tipo_actividad_id: 2, empresa_id: 1, activo: true },
      { id: 4, codigo: "AV-001", nombre: "Poda de césped",                      unidad_medida: "m²",    norma_tiempo: 0.0333, norma_rendimiento: 30.0, tasa_salarial: 0.50,  tipo_actividad_id: 3, empresa_id: 1, activo: true },
      { id: 5, codigo: "AV-002", nombre: "Poda de arbustos",                    unidad_medida: "unidad",norma_tiempo: 0.5,    norma_rendimiento: 2.0,  tasa_salarial: 5.00,  tipo_actividad_id: 3, empresa_id: 1, activo: true },
      { id: 6, codigo: "LP-001", nombre: "Limpieza general de parque",          unidad_medida: "m²",    norma_tiempo: 0.1,    norma_rendimiento: 10.0, tasa_salarial: 0.30,  tipo_actividad_id: 4, empresa_id: 1, activo: true },
      { id: 7, codigo: "RD-001", nombre: "Recogida domiciliaria de residuos",   unidad_medida: "t",     norma_tiempo: 2.0,    norma_rendimiento: 0.5,  tasa_salarial: 25.00, tipo_actividad_id: 5, empresa_id: 1, activo: true },
      { id: 8, codigo: "RE-001", nombre: "Recogida y traslado de escombros",    unidad_medida: "m³",    norma_tiempo: 1.0,    norma_rendimiento: 1.0,  tasa_salarial: 18.00, tipo_actividad_id: 6, empresa_id: 1, activo: true },
      { id: 9, codigo: "BA-001", nombre: "Bacheo asfáltico",                    unidad_medida: "m²",    norma_tiempo: 2.0,    norma_rendimiento: 0.5,  tasa_salarial: 35.00, tipo_actividad_id: 8, empresa_id: 1, activo: true },
    ],
  });
  console.log("✅ Actividades");

  // ── Trabajadores ──────────────────────────────────────────────
  await prisma.trabajador.createMany({
    data: [
      { id: 1, ci: "85031201234", nombre: "Carlos",  apellidos: "Rodríguez Peña",       cargo: "Operario",   fecha_nacimiento: new Date("1985-03-12"), ueb_id: 1, empresa_id: 1, activo: true },
      { id: 2, ci: "90072501234", nombre: "María",   apellidos: "González López",        cargo: "Inspectora", fecha_nacimiento: new Date("1990-07-25"), ueb_id: 1, empresa_id: 1, activo: true },
      { id: 3, ci: "78110501234", nombre: "José",    apellidos: "Martínez Hernández",    cargo: "Chofer",     fecha_nacimiento: new Date("1978-11-05"), ueb_id: 1, empresa_id: 1, activo: true },
      { id: 4, ci: "95011801234", nombre: "Ana",     apellidos: "Díaz Fuentes",          cargo: "Auxiliar",   fecha_nacimiento: new Date("1995-01-18"), ueb_id: 1, empresa_id: 1, activo: true },
      { id: 5, ci: "82093001234", nombre: "Luis",    apellidos: "Pérez Castillo",        cargo: "Operario",   fecha_nacimiento: new Date("1982-09-30"), ueb_id: 2, empresa_id: 1, activo: true },
      { id: 6, ci: "88041401234", nombre: "Rosa",    apellidos: "Vargas Núñez",          cargo: "Supervisora",fecha_nacimiento: new Date("1988-04-14"), ueb_id: 2, empresa_id: 1, activo: true },
      { id: 7, ci: "75120201234", nombre: "Miguel",  apellidos: "Torres Ramos",          cargo: "Chofer",     fecha_nacimiento: new Date("1975-12-02"), ueb_id: 2, empresa_id: 1, activo: true },
      { id: 8, ci: "93062001234", nombre: "Elena",   apellidos: "Cruz Medina",           cargo: "Auxiliar",   fecha_nacimiento: new Date("1993-06-20"), ueb_id: 3, empresa_id: 1, activo: true },
      { id: 9, ci: "80020801234", nombre: "Pedro",   apellidos: "Morales Gutiérrez",     cargo: "Operario",   fecha_nacimiento: new Date("1980-02-08"), ueb_id: 3, empresa_id: 1, activo: false },
    ],
  });
  console.log("✅ Trabajadores");

  // ── Equipamiento ──────────────────────────────────────────────
  await prisma.equipamiento.createMany({
    data: [
      { id: 1, nombre: "Camión Recolector Hino",     codigo_inventario: "CAM-001", ueb_id: 1, empresa_id: 1, activo: true },
      { id: 2, nombre: "Barredora Mecánica Bucher",  codigo_inventario: "BAR-001", ueb_id: 1, empresa_id: 1, activo: true },
      { id: 3, nombre: "Tractor Agrícola Belarus",   codigo_inventario: "TRA-001", ueb_id: 1, empresa_id: 1, activo: true },
      { id: 4, nombre: "Cortadora de Césped Honda",  codigo_inventario: "COR-001", ueb_id: 1, empresa_id: 1, activo: true },
      { id: 5, nombre: "Camión Volquete ZIL",        codigo_inventario: "CAM-002", ueb_id: 2, empresa_id: 1, activo: true },
      { id: 6, nombre: "Retroexcavadora JCB",        codigo_inventario: "RET-001", ueb_id: 2, empresa_id: 1, activo: false },
      { id: 7, nombre: "Camión Recolector Mazda",    codigo_inventario: "CAM-003", ueb_id: 3, empresa_id: 1, activo: true },
    ],
  });
  console.log("✅ Equipamiento");

  // ── Expedientes ───────────────────────────────────────────────
  await prisma.expediente.createMany({
    data: [
      { id: 1, numero_expediente: "EXP-2024-001", nombre: "Mantenimiento Parque Central",     zona: "Parque Central, Matanzas",          ueb_id: 1, empresa_id: 1, fecha_inicio: new Date("2024-01-01"), fecha_fin: null,                   activo: true },
      { id: 2, numero_expediente: "EXP-2024-002", nombre: "Barrido Zona Centro",              zona: "Calle 83 a Calle 79, Matanzas",     ueb_id: 1, empresa_id: 1, fecha_inicio: new Date("2024-01-01"), fecha_fin: null,                   activo: true },
      { id: 3, numero_expediente: "EXP-2024-003", nombre: "Recogida Reparto Versalles",       zona: "Reparto Versalles",                 ueb_id: 1, empresa_id: 1, fecha_inicio: new Date("2024-01-01"), fecha_fin: null,                   activo: true },
      { id: 4, numero_expediente: "EXP-2024-004", nombre: "Mantenimiento Parque Río Yumurí", zona: "Ribera Río Yumurí, Matanzas Norte", ueb_id: 2, empresa_id: 1, fecha_inicio: new Date("2024-02-01"), fecha_fin: null,                   activo: true },
      { id: 5, numero_expediente: "EXP-2024-005", nombre: "Barrido Reparto Pueblo Nuevo",    zona: "Reparto Pueblo Nuevo",              ueb_id: 2, empresa_id: 1, fecha_inicio: new Date("2024-02-01"), fecha_fin: null,                   activo: true },
      { id: 6, numero_expediente: "EXP-2024-006", nombre: "Recogida La Playa",               zona: "Reparto La Playa",                  ueb_id: 3, empresa_id: 1, fecha_inicio: new Date("2024-03-01"), fecha_fin: new Date("2026-12-31"), activo: true },
    ],
  });
  console.log("✅ Expedientes");

  // ── Planificaciones ───────────────────────────────────────────
  await prisma.planificacionExpediente.createMany({
    data: [
      { id: 1,  expediente_id: 1, actividad_id: 4, medida_planificada: 2000,  frecuencia_veces_mes: 4,  tipo_norma: "rendimiento", activo: true },
      { id: 2,  expediente_id: 1, actividad_id: 6, medida_planificada: 2000,  frecuencia_veces_mes: 8,  tipo_norma: "rendimiento", activo: true },
      { id: 3,  expediente_id: 1, actividad_id: 5, medida_planificada: 15,    frecuencia_veces_mes: 2,  tipo_norma: "rendimiento", activo: true },
      { id: 4,  expediente_id: 2, actividad_id: 1, medida_planificada: 5000,  frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true },
      { id: 5,  expediente_id: 2, actividad_id: 2, medida_planificada: 2000,  frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true },
      { id: 6,  expediente_id: 3, actividad_id: 7, medida_planificada: 8,     frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true },
      { id: 7,  expediente_id: 4, actividad_id: 4, medida_planificada: 3500,  frecuencia_veces_mes: 4,  tipo_norma: "rendimiento", activo: true },
      { id: 8,  expediente_id: 4, actividad_id: 6, medida_planificada: 3500,  frecuencia_veces_mes: 4,  tipo_norma: "rendimiento", activo: true },
      { id: 9,  expediente_id: 5, actividad_id: 1, medida_planificada: 4000,  frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true },
      { id: 10, expediente_id: 6, actividad_id: 7, medida_planificada: 6,     frecuencia_veces_mes: 30, tipo_norma: "rendimiento", activo: true },
    ],
  });
  console.log("✅ Planificaciones");

  // ── Órdenes de Trabajo ────────────────────────────────────────
  await prisma.ordenTrabajo.createMany({
    data: [
      // Mayo 2026 — todas pendiente
      { id: 1,  planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-05-01"), cantidad_realizada: 5000,  estado: "pendiente", observaciones: "Barrido completo sin novedades.",              created_by: 2, updated_by: 2 },
      { id: 2,  planificacion_expediente_id: 5,  fecha_ejecucion: new Date("2026-05-01"), cantidad_realizada: 1800,  estado: "pendiente", observaciones: null,                                            created_by: 2, updated_by: null },
      { id: 3,  planificacion_expediente_id: 6,  fecha_ejecucion: new Date("2026-05-01"), cantidad_realizada: 7.5,   estado: "pendiente", observaciones: "Se recogieron 7.5t en Versalles.",              created_by: 2, updated_by: null },
      { id: 4,  planificacion_expediente_id: 1,  fecha_ejecucion: new Date("2026-05-03"), cantidad_realizada: 1800,  estado: "pendiente", observaciones: "Zona sureste pendiente.",                       created_by: 2, updated_by: null },
      { id: 5,  planificacion_expediente_id: 2,  fecha_ejecucion: new Date("2026-05-03"), cantidad_realizada: 2000,  estado: "pendiente", observaciones: null,                                            created_by: 2, updated_by: null },
      { id: 6,  planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-05-02"), cantidad_realizada: 4500,  estado: "pendiente", observaciones: "Cantidad incorrecta, se corrigió.",             created_by: 2, updated_by: 3,  motivo_modificacion: "Error en medición, cantidad real 4500 m²." },
      { id: 7,  planificacion_expediente_id: 9,  fecha_ejecucion: new Date("2026-05-02"), cantidad_realizada: 4000,  estado: "pendiente", observaciones: null,                                            created_by: 3, updated_by: null },
      { id: 8,  planificacion_expediente_id: 7,  fecha_ejecucion: new Date("2026-05-03"), cantidad_realizada: 3200,  estado: "pendiente", observaciones: null,                                            created_by: 3, updated_by: null },
      { id: 9,  planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-05-04"), cantidad_realizada: 5000,  estado: "pendiente", observaciones: null,                                            created_by: 2, updated_by: null },
      { id: 10, planificacion_expediente_id: 6,  fecha_ejecucion: new Date("2026-05-04"), cantidad_realizada: 8.0,   estado: "pendiente", observaciones: null,                                            created_by: 2, updated_by: null },
      { id: 11, planificacion_expediente_id: 5,  fecha_ejecucion: new Date("2026-05-05"), cantidad_realizada: 2000,  estado: "pendiente", observaciones: null,                                            created_by: 2, updated_by: null },
      { id: 12, planificacion_expediente_id: 3,  fecha_ejecucion: new Date("2026-05-05"), cantidad_realizada: 14,    estado: "pendiente", observaciones: "Faltó podar 1 arbusto.",                        created_by: 2, updated_by: null },
      { id: 13, planificacion_expediente_id: 10, fecha_ejecucion: new Date("2026-05-05"), cantidad_realizada: 6.0,   estado: "pendiente", observaciones: null,                                            created_by: 1, updated_by: null },
      { id: 14, planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-05-06"), cantidad_realizada: 5000,  estado: "pendiente", observaciones: null,                                            created_by: 2, updated_by: null },
      { id: 15, planificacion_expediente_id: 8,  fecha_ejecucion: new Date("2026-05-06"), cantidad_realizada: 3500,  estado: "pendiente", observaciones: null,                                            created_by: 3, updated_by: null },
      // Abril 2026 — validadas/rechazadas
      { id: 16, planificacion_expediente_id: 1,  fecha_ejecucion: new Date("2026-04-04"), cantidad_realizada: 7600,  estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 17, planificacion_expediente_id: 2,  fecha_ejecucion: new Date("2026-04-05"), cantidad_realizada: 16000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 18, planificacion_expediente_id: 3,  fecha_ejecucion: new Date("2026-04-08"), cantidad_realizada: 14,    estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 19, planificacion_expediente_id: 3,  fecha_ejecucion: new Date("2026-04-15"), cantidad_realizada: 14,    estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 20, planificacion_expediente_id: 3,  fecha_ejecucion: new Date("2026-04-10"), cantidad_realizada: 5,     estado: "rechazada", observaciones: "Cantidad no coincide con parte de trabajo.",    created_by: 2, updated_by: 3,  motivo_modificacion: "Error de conteo." },
      { id: 21, planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-04-01"), cantidad_realizada: 50000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 22, planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-04-08"), cantidad_realizada: 50000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 23, planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-04-15"), cantidad_realizada: 45000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 24, planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-04-22"), cantidad_realizada: 6000,  estado: "rechazada", observaciones: "Zona no fue barrida completamente.",             created_by: 2, updated_by: 3,  motivo_modificacion: "Parte incompleto." },
      { id: 25, planificacion_expediente_id: 5,  fecha_ejecucion: new Date("2026-04-02"), cantidad_realizada: 30000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 26, planificacion_expediente_id: 5,  fecha_ejecucion: new Date("2026-04-16"), cantidad_realizada: 28000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 27, planificacion_expediente_id: 6,  fecha_ejecucion: new Date("2026-04-05"), cantidad_realizada: 120,   estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 28, planificacion_expediente_id: 6,  fecha_ejecucion: new Date("2026-04-19"), cantidad_realizada: 110,   estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 29, planificacion_expediente_id: 7,  fecha_ejecucion: new Date("2026-04-04"), cantidad_realizada: 12000, estado: "validada",  observaciones: null,                                            created_by: 3, updated_by: 3 },
      { id: 30, planificacion_expediente_id: 8,  fecha_ejecucion: new Date("2026-04-05"), cantidad_realizada: 13500, estado: "validada",  observaciones: null,                                            created_by: 3, updated_by: 3 },
      { id: 31, planificacion_expediente_id: 9,  fecha_ejecucion: new Date("2026-04-01"), cantidad_realizada: 60000, estado: "validada",  observaciones: null,                                            created_by: 3, updated_by: 3 },
      { id: 32, planificacion_expediente_id: 9,  fecha_ejecucion: new Date("2026-04-15"), cantidad_realizada: 58000, estado: "validada",  observaciones: null,                                            created_by: 3, updated_by: 3 },
      { id: 33, planificacion_expediente_id: 10, fecha_ejecucion: new Date("2026-04-07"), cantidad_realizada: 175,   estado: "validada",  observaciones: null,                                            created_by: 1, updated_by: 1 },
      // Marzo 2026 — validadas
      { id: 34, planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-03-01"), cantidad_realizada: 70000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 35, planificacion_expediente_id: 4,  fecha_ejecucion: new Date("2026-03-15"), cantidad_realizada: 70000, estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 36, planificacion_expediente_id: 6,  fecha_ejecucion: new Date("2026-03-07"), cantidad_realizada: 220,   estado: "validada",  observaciones: null,                                            created_by: 2, updated_by: 2 },
      { id: 37, planificacion_expediente_id: 9,  fecha_ejecucion: new Date("2026-03-02"), cantidad_realizada: 55000, estado: "validada",  observaciones: null,                                            created_by: 3, updated_by: 3 },
      { id: 38, planificacion_expediente_id: 9,  fecha_ejecucion: new Date("2026-03-16"), cantidad_realizada: 55000, estado: "validada",  observaciones: null,                                            created_by: 3, updated_by: 3 },
    ],
  });
  console.log("✅ Órdenes de Trabajo");

  // ── OT ↔ Trabajadores ─────────────────────────────────────────
  await prisma.ordenTrabajoTrabajador.createMany({
    data: [
      { orden_trabajo_id: 1,  trabajador_id: 1 }, { orden_trabajo_id: 1,  trabajador_id: 2 },
      { orden_trabajo_id: 2,  trabajador_id: 1 }, { orden_trabajo_id: 2,  trabajador_id: 3 },
      { orden_trabajo_id: 3,  trabajador_id: 2 }, { orden_trabajo_id: 3,  trabajador_id: 4 },
      { orden_trabajo_id: 4,  trabajador_id: 1 }, { orden_trabajo_id: 4,  trabajador_id: 2 },
      { orden_trabajo_id: 5,  trabajador_id: 3 },
      { orden_trabajo_id: 6,  trabajador_id: 1 },
      { orden_trabajo_id: 7,  trabajador_id: 5 }, { orden_trabajo_id: 7,  trabajador_id: 6 },
      { orden_trabajo_id: 8,  trabajador_id: 5 }, { orden_trabajo_id: 8,  trabajador_id: 7 },
      { orden_trabajo_id: 9,  trabajador_id: 1 }, { orden_trabajo_id: 9,  trabajador_id: 4 },
      { orden_trabajo_id: 10, trabajador_id: 2 }, { orden_trabajo_id: 10, trabajador_id: 3 },
      { orden_trabajo_id: 11, trabajador_id: 1 },
      { orden_trabajo_id: 12, trabajador_id: 2 }, { orden_trabajo_id: 12, trabajador_id: 4 },
      { orden_trabajo_id: 13, trabajador_id: 8 },
      { orden_trabajo_id: 14, trabajador_id: 1 },
      { orden_trabajo_id: 15, trabajador_id: 5 }, { orden_trabajo_id: 15, trabajador_id: 6 },
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
      { orden_trabajo_id: 34, trabajador_id: 1 }, { orden_trabajo_id: 34, trabajador_id: 2 },
      { orden_trabajo_id: 35, trabajador_id: 1 }, { orden_trabajo_id: 35, trabajador_id: 2 },
      { orden_trabajo_id: 36, trabajador_id: 2 },
      { orden_trabajo_id: 37, trabajador_id: 5 }, { orden_trabajo_id: 37, trabajador_id: 6 },
      { orden_trabajo_id: 38, trabajador_id: 5 }, { orden_trabajo_id: 38, trabajador_id: 6 },
    ],
  });
  console.log("✅ OT ↔ Trabajadores");

  // ── OT ↔ Equipamiento ─────────────────────────────────────────
  await prisma.ordenTrabajoEquipamiento.createMany({
    data: [
      { orden_trabajo_id: 1,  equipamiento_id: 2 },
      { orden_trabajo_id: 2,  equipamiento_id: 2 },
      { orden_trabajo_id: 3,  equipamiento_id: 1 },
      { orden_trabajo_id: 4,  equipamiento_id: 4 },
      { orden_trabajo_id: 5,  equipamiento_id: 2 },
      { orden_trabajo_id: 6,  equipamiento_id: 2 },
      { orden_trabajo_id: 7,  equipamiento_id: 5 },
      { orden_trabajo_id: 8,  equipamiento_id: 4 },
      { orden_trabajo_id: 9,  equipamiento_id: 2 },
      { orden_trabajo_id: 10, equipamiento_id: 1 },
      { orden_trabajo_id: 11, equipamiento_id: 2 },
      { orden_trabajo_id: 13, equipamiento_id: 7 },
      { orden_trabajo_id: 14, equipamiento_id: 2 },
      { orden_trabajo_id: 15, equipamiento_id: 4 },
      { orden_trabajo_id: 16, equipamiento_id: 4 },
      { orden_trabajo_id: 17, equipamiento_id: 2 },
      { orden_trabajo_id: 18, equipamiento_id: 4 },
      { orden_trabajo_id: 19, equipamiento_id: 4 },
      { orden_trabajo_id: 20, equipamiento_id: 4 },
      { orden_trabajo_id: 21, equipamiento_id: 2 },
      { orden_trabajo_id: 22, equipamiento_id: 2 },
      { orden_trabajo_id: 23, equipamiento_id: 2 },
      { orden_trabajo_id: 24, equipamiento_id: 2 },
      { orden_trabajo_id: 25, equipamiento_id: 2 },
      { orden_trabajo_id: 26, equipamiento_id: 2 },
      { orden_trabajo_id: 27, equipamiento_id: 1 },
      { orden_trabajo_id: 28, equipamiento_id: 1 },
      { orden_trabajo_id: 29, equipamiento_id: 4 },
      { orden_trabajo_id: 30, equipamiento_id: 5 },
      { orden_trabajo_id: 31, equipamiento_id: 5 },
      { orden_trabajo_id: 32, equipamiento_id: 5 },
      { orden_trabajo_id: 33, equipamiento_id: 7 },
      { orden_trabajo_id: 34, equipamiento_id: 2 },
      { orden_trabajo_id: 35, equipamiento_id: 2 },
      { orden_trabajo_id: 36, equipamiento_id: 1 },
      { orden_trabajo_id: 37, equipamiento_id: 5 },
      { orden_trabajo_id: 38, equipamiento_id: 5 },
    ],
  });
  console.log("✅ OT ↔ Equipamiento");

  // ── Cierres Mensuales ─────────────────────────────────────────
  await prisma.cierreMensual.createMany({
    data: [
      { id: 1, anio: 2026, mes: 1, empresa_id: 1, fecha_cierre: new Date("2026-02-03T10:30:00Z"), cerrado_por: 1 },
      { id: 2, anio: 2026, mes: 2, empresa_id: 1, fecha_cierre: new Date("2026-03-04T09:15:00Z"), cerrado_por: 1 },
      { id: 3, anio: 2026, mes: 3, empresa_id: 1, fecha_cierre: new Date("2026-04-02T11:00:00Z"), cerrado_por: 1 },
      { id: 4, anio: 2026, mes: 4, empresa_id: 1, fecha_cierre: new Date("2026-05-02T09:45:00Z"), cerrado_por: 1 },
    ],
  });
  console.log("✅ Cierres Mensuales");

  // ── Reportes Mensuales ────────────────────────────────────────
  await prisma.reporteMensualDetalle.createMany({
    data: [
      // Abril 2026
      { id: 1,  cierre_mensual_id: 4, planificacion_expediente_id: 1,  cantidad_planificada_mes: 8000,   cantidad_ejecutada_mes: 7600,   porcentaje_cumplimiento: 95.00,  tasa_salarial_aplicada: 0.50,  salario_devengado: 3800.00,   norma_aplicada: 30.0, tipo_norma: "rendimiento" },
      { id: 2,  cierre_mensual_id: 4, planificacion_expediente_id: 2,  cantidad_planificada_mes: 16000,  cantidad_ejecutada_mes: 16000,  porcentaje_cumplimiento: 100.00, tasa_salarial_aplicada: 0.30,  salario_devengado: 4800.00,   norma_aplicada: 10.0, tipo_norma: "rendimiento" },
      { id: 3,  cierre_mensual_id: 4, planificacion_expediente_id: 3,  cantidad_planificada_mes: 30,     cantidad_ejecutada_mes: 28,     porcentaje_cumplimiento: 93.33,  tasa_salarial_aplicada: 5.00,  salario_devengado: 140.00,    norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
      { id: 4,  cierre_mensual_id: 4, planificacion_expediente_id: 4,  cantidad_planificada_mes: 150000, cantidad_ejecutada_mes: 145000, porcentaje_cumplimiento: 96.67,  tasa_salarial_aplicada: 1.20,  salario_devengado: 174000.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
      { id: 5,  cierre_mensual_id: 4, planificacion_expediente_id: 5,  cantidad_planificada_mes: 60000,  cantidad_ejecutada_mes: 58000,  porcentaje_cumplimiento: 96.67,  tasa_salarial_aplicada: 0.80,  salario_devengado: 46400.00,  norma_aplicada: 4.0,  tipo_norma: "rendimiento" },
      { id: 6,  cierre_mensual_id: 4, planificacion_expediente_id: 6,  cantidad_planificada_mes: 240,    cantidad_ejecutada_mes: 230,    porcentaje_cumplimiento: 95.83,  tasa_salarial_aplicada: 25.00, salario_devengado: 5750.00,   norma_aplicada: 0.5,  tipo_norma: "rendimiento" },
      { id: 7,  cierre_mensual_id: 4, planificacion_expediente_id: 7,  cantidad_planificada_mes: 14000,  cantidad_ejecutada_mes: 12000,  porcentaje_cumplimiento: 85.71,  tasa_salarial_aplicada: 0.50,  salario_devengado: 6000.00,   norma_aplicada: 30.0, tipo_norma: "rendimiento" },
      { id: 8,  cierre_mensual_id: 4, planificacion_expediente_id: 8,  cantidad_planificada_mes: 14000,  cantidad_ejecutada_mes: 13500,  porcentaje_cumplimiento: 96.43,  tasa_salarial_aplicada: 0.30,  salario_devengado: 4050.00,   norma_aplicada: 10.0, tipo_norma: "rendimiento" },
      { id: 9,  cierre_mensual_id: 4, planificacion_expediente_id: 9,  cantidad_planificada_mes: 120000, cantidad_ejecutada_mes: 118000, porcentaje_cumplimiento: 98.33,  tasa_salarial_aplicada: 1.20,  salario_devengado: 141600.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
      { id: 10, cierre_mensual_id: 4, planificacion_expediente_id: 10, cantidad_planificada_mes: 180,    cantidad_ejecutada_mes: 175,    porcentaje_cumplimiento: 97.22,  tasa_salarial_aplicada: 25.00, salario_devengado: 4375.00,   norma_aplicada: 0.5,  tipo_norma: "rendimiento" },
      // Marzo 2026
      { id: 11, cierre_mensual_id: 3, planificacion_expediente_id: 4,  cantidad_planificada_mes: 155000, cantidad_ejecutada_mes: 140000, porcentaje_cumplimiento: 90.32,  tasa_salarial_aplicada: 1.20,  salario_devengado: 168000.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
      { id: 12, cierre_mensual_id: 3, planificacion_expediente_id: 6,  cantidad_planificada_mes: 248,    cantidad_ejecutada_mes: 220,    porcentaje_cumplimiento: 88.71,  tasa_salarial_aplicada: 25.00, salario_devengado: 5500.00,   norma_aplicada: 0.5,  tipo_norma: "rendimiento" },
      { id: 13, cierre_mensual_id: 3, planificacion_expediente_id: 9,  cantidad_planificada_mes: 124000, cantidad_ejecutada_mes: 110000, porcentaje_cumplimiento: 88.71,  tasa_salarial_aplicada: 1.20,  salario_devengado: 132000.00, norma_aplicada: 2.0,  tipo_norma: "rendimiento" },
    ],
  });
  console.log("✅ Reportes Mensuales");

  console.log("\n🎉 Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
