// ============================================================
// MODELOS DEL SISTEMA DE ÓRDENES DE TRABAJO — EMSC
// ============================================================

// ------- EMPRESA -------
export interface Empresa {
  id: number;
  nombre: string;
  nombre_corto: string;
  codigo_empresa: string;
  ubicacion?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- UEB -------
export interface UEB {
  id: number;
  nombre: string;
  ubicacion?: string;
  empresa_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- USUARIO -------
export type RolUsuario = "admin" | "supervisor";

export interface Usuario {
  id: number;
  username: string;
  password_hash: string;
  nombre?: string;
  rol: RolUsuario;
  empresa_id: number;
  ueb_id: number | null; // null para admin
  trabajador_id: number | null;
  activo: boolean;
  ultimo_login: string | null;
  created_at: string;
  updated_at: string;
}

// Versión sin password para usar en el frontend
export type UsuarioPublico = Omit<Usuario, "password_hash">;

// ------- CATÁLOGO -------
export interface Catalogo {
  id: number;
  nombre: string;
  empresa_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- TIPO ACTIVIDAD -------
export interface TipoActividad {
  id: number;
  nombre: string;
  catalogo_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- ACTIVIDAD -------
export interface Actividad {
  id: number;
  codigo: string;
  nombre: string;
  unidad_medida: string;
  norma_tiempo: number;       // horas por unidad
  norma_rendimiento: number;  // unidades por hora
  tasa_salarial: number;      // CUP por unidad ejecutada
  tipo_actividad_id: number;
  empresa_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- TRABAJADOR -------
export interface Trabajador {
  id: number;
  ci?: string;
  nombre: string;
  apellidos: string;
  cargo?: string;
  fecha_nacimiento?: string;
  ueb_id: number;
  empresa_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- EQUIPAMIENTO -------
export interface Equipamiento {
  id: number;
  nombre: string;
  codigo_inventario: string;
  tipo?: string;
  ueb_id: number;
  empresa_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- EXPEDIENTE -------
export interface Expediente {
  id: number;
  numero_expediente: string;
  nombre: string;
  zona?: string;
  ueb_id: number;
  empresa_id: number;
  fecha_inicio: string;
  fecha_fin?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- PLANIFICACIÓN EXPEDIENTE -------
export type TipoNorma = "rendimiento" | "tiempo";

export interface PlanificacionExpediente {
  id: number;
  expediente_id: number;
  actividad_id: number;
  medida_planificada: number;
  frecuencia_veces_mes: number;
  tipo_norma: TipoNorma;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ------- ORDEN DE TRABAJO -------
export type EstadoOrdenTrabajo = "pendiente" | "validada" | "rechazada";

export interface OrdenTrabajo {
  id: number;
  planificacion_expediente_id: number;
  fecha_ejecucion: string;
  cantidad_realizada: number;
  estado: EstadoOrdenTrabajo;
  observaciones?: string;
  created_by: number;
  updated_by: number | null;
  motivo_modificacion?: string;
  created_at: string;
  updated_at: string;
}

// Tabla intermedia: OT ↔ Trabajador
export interface OrdenTrabajoTrabajador {
  orden_trabajo_id: number;
  trabajador_id: number;
}

// Tabla intermedia: OT ↔ Equipamiento
export interface OrdenTrabajoEquipamiento {
  orden_trabajo_id: number;
  equipamiento_id: number;
}

// Vista enriquecida para mostrar en tablas (con datos denormalizados)
export interface OrdenTrabajoDetalle extends OrdenTrabajo {
  actividad_nombre: string;
  actividad_unidad_medida: string;
  expediente_nombre: string;
  expediente_numero: string;
  ueb_nombre: string;
  ueb_id: number;
  creado_por_username: string;
  trabajadores: Trabajador[];
  equipamiento: Equipamiento[];
}

// ------- CIERRE MENSUAL -------
export interface CierreMensual {
  id: number;
  anio: number;
  mes: number;
  empresa_id: number;
  fecha_cierre: string;
  cerrado_por: number;
}

// Vista enriquecida del cierre
export interface CierreMensualDetalle extends CierreMensual {
  cerrado_por_username: string;
}

// ------- REPORTE MENSUAL DETALLE -------
export interface ReporteMensualDetalle {
  id: number;
  cierre_mensual_id: number;
  planificacion_expediente_id: number;
  cantidad_planificada_mes: number;
  cantidad_ejecutada_mes: number;
  porcentaje_cumplimiento: number;
  tasa_salarial_aplicada: number;
  salario_devengado: number;
  norma_aplicada: number;
  tipo_norma: TipoNorma;
}

// Vista enriquecida del reporte
export interface ReporteMensualDetalleVista extends ReporteMensualDetalle {
  anio: number;
  mes: number;
  actividad_nombre: string;
  actividad_unidad_medida: string;
  expediente_nombre: string;
  expediente_numero: string;
  ueb_nombre: string;
  ueb_id: number;
  expediente_id: number;
}

// ------- AUDIT LOG -------
export type AccionAudit = "INSERT" | "UPDATE" | "DELETE";

export interface AuditLog {
  id: number;
  empresa_id: number;
  tabla_afectada: string;
  registro_id: number;
  accion: AccionAudit;
  usuario_id: number;
  fecha_hora: string;
  valor_anterior?: Record<string, unknown>;
  valor_nuevo?: Record<string, unknown>;
}

// ------- DTOs para formularios -------

export type CreateOrdenTrabajoDto = {
  planificacion_expediente_id: number;
  fecha_ejecucion: string;
  cantidad_realizada: number;
  observaciones?: string;
  trabajador_ids: number[];
  equipamiento_ids: number[];
};

export type UpdateOrdenTrabajoDto = Partial<CreateOrdenTrabajoDto> & {
  motivo_modificacion: string;
};

export type ValidarOrdenTrabajoDto = {
  estado: "validada" | "rechazada";
  motivo_modificacion?: string;
};

export type CreateUsuarioDto = {
  username: string;
  password: string;
  nombre?: string;
  rol: RolUsuario;
  empresa_id: number;
  ueb_id?: number;
  trabajador_id?: number;
};

export type LoginDto = {
  username: string;
  password: string;
};

export type LoginResponse = {
  usuario: UsuarioPublico;
  empresa: Empresa;
  ueb?: UEB;
};
