-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(200) NOT NULL,
    `nombre_corto` VARCHAR(50) NOT NULL,
    `codigo_empresa` VARCHAR(20) NOT NULL,
    `ubicacion` VARCHAR(200) NULL,
    `telefono` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Empresa_codigo_empresa_key`(`codigo_empresa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UEB` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `ubicacion` VARCHAR(200) NULL,
    `empresa_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `nombre` VARCHAR(150) NULL,
    `rol` ENUM('admin', 'supervisor') NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `ueb_id` INTEGER NULL,
    `trabajador_id` INTEGER NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `ultimo_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Catalogo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoActividad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `catalogo_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actividad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `unidad_medida` VARCHAR(50) NOT NULL,
    `norma_tiempo` DOUBLE NOT NULL,
    `norma_rendimiento` DOUBLE NOT NULL,
    `tasa_salarial` DOUBLE NOT NULL,
    `tipo_actividad_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trabajador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ci` VARCHAR(11) NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(150) NOT NULL,
    `cargo` VARCHAR(100) NULL,
    `fecha_nacimiento` DATE NULL,
    `ueb_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Trabajador_ci_key`(`ci`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipamiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `codigo_inventario` VARCHAR(50) NOT NULL,
    `tipo` VARCHAR(100) NULL,
    `ueb_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Equipamiento_codigo_inventario_key`(`codigo_inventario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_expediente` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `zona` VARCHAR(100) NULL,
    `ueb_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanificacionExpediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER NOT NULL,
    `actividad_id` INTEGER NOT NULL,
    `medida_planificada` DOUBLE NOT NULL,
    `frecuencia_veces_mes` INTEGER NOT NULL,
    `tipo_norma` ENUM('rendimiento', 'tiempo') NOT NULL DEFAULT 'rendimiento',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenTrabajo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planificacion_expediente_id` INTEGER NOT NULL,
    `fecha_ejecucion` DATE NOT NULL,
    `cantidad_realizada` DOUBLE NOT NULL,
    `estado` ENUM('pendiente', 'validada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    `observaciones` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `motivo_modificacion` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenTrabajoTrabajador` (
    `orden_trabajo_id` INTEGER NOT NULL,
    `trabajador_id` INTEGER NOT NULL,

    PRIMARY KEY (`orden_trabajo_id`, `trabajador_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenTrabajoEquipamiento` (
    `orden_trabajo_id` INTEGER NOT NULL,
    `equipamiento_id` INTEGER NOT NULL,

    PRIMARY KEY (`orden_trabajo_id`, `equipamiento_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CierreMensual` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anio` INTEGER NOT NULL,
    `mes` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `fecha_cierre` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cerrado_por` INTEGER NOT NULL,

    UNIQUE INDEX `CierreMensual_anio_mes_empresa_id_key`(`anio`, `mes`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReporteMensualDetalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cierre_mensual_id` INTEGER NOT NULL,
    `planificacion_expediente_id` INTEGER NOT NULL,
    `cantidad_planificada_mes` DOUBLE NOT NULL,
    `cantidad_ejecutada_mes` DOUBLE NOT NULL,
    `porcentaje_cumplimiento` DOUBLE NOT NULL,
    `tasa_salarial_aplicada` DOUBLE NOT NULL,
    `salario_devengado` DOUBLE NOT NULL,
    `norma_aplicada` DOUBLE NOT NULL,
    `tipo_norma` ENUM('rendimiento', 'tiempo') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UEB` ADD CONSTRAINT `UEB_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_ueb_id_fkey` FOREIGN KEY (`ueb_id`) REFERENCES `UEB`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Catalogo` ADD CONSTRAINT `Catalogo_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoActividad` ADD CONSTRAINT `TipoActividad_catalogo_id_fkey` FOREIGN KEY (`catalogo_id`) REFERENCES `Catalogo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actividad` ADD CONSTRAINT `Actividad_tipo_actividad_id_fkey` FOREIGN KEY (`tipo_actividad_id`) REFERENCES `TipoActividad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actividad` ADD CONSTRAINT `Actividad_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajador` ADD CONSTRAINT `Trabajador_ueb_id_fkey` FOREIGN KEY (`ueb_id`) REFERENCES `UEB`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajador` ADD CONSTRAINT `Trabajador_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipamiento` ADD CONSTRAINT `Equipamiento_ueb_id_fkey` FOREIGN KEY (`ueb_id`) REFERENCES `UEB`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipamiento` ADD CONSTRAINT `Equipamiento_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expediente` ADD CONSTRAINT `Expediente_ueb_id_fkey` FOREIGN KEY (`ueb_id`) REFERENCES `UEB`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expediente` ADD CONSTRAINT `Expediente_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanificacionExpediente` ADD CONSTRAINT `PlanificacionExpediente_expediente_id_fkey` FOREIGN KEY (`expediente_id`) REFERENCES `Expediente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanificacionExpediente` ADD CONSTRAINT `PlanificacionExpediente_actividad_id_fkey` FOREIGN KEY (`actividad_id`) REFERENCES `Actividad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajo` ADD CONSTRAINT `OrdenTrabajo_planificacion_expediente_id_fkey` FOREIGN KEY (`planificacion_expediente_id`) REFERENCES `PlanificacionExpediente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajo` ADD CONSTRAINT `OrdenTrabajo_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajo` ADD CONSTRAINT `OrdenTrabajo_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajoTrabajador` ADD CONSTRAINT `OrdenTrabajoTrabajador_orden_trabajo_id_fkey` FOREIGN KEY (`orden_trabajo_id`) REFERENCES `OrdenTrabajo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajoTrabajador` ADD CONSTRAINT `OrdenTrabajoTrabajador_trabajador_id_fkey` FOREIGN KEY (`trabajador_id`) REFERENCES `Trabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajoEquipamiento` ADD CONSTRAINT `OrdenTrabajoEquipamiento_orden_trabajo_id_fkey` FOREIGN KEY (`orden_trabajo_id`) REFERENCES `OrdenTrabajo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajoEquipamiento` ADD CONSTRAINT `OrdenTrabajoEquipamiento_equipamiento_id_fkey` FOREIGN KEY (`equipamiento_id`) REFERENCES `Equipamiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CierreMensual` ADD CONSTRAINT `CierreMensual_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CierreMensual` ADD CONSTRAINT `CierreMensual_cerrado_por_fkey` FOREIGN KEY (`cerrado_por`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReporteMensualDetalle` ADD CONSTRAINT `ReporteMensualDetalle_cierre_mensual_id_fkey` FOREIGN KEY (`cierre_mensual_id`) REFERENCES `CierreMensual`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReporteMensualDetalle` ADD CONSTRAINT `ReporteMensualDetalle_planificacion_expediente_id_fkey` FOREIGN KEY (`planificacion_expediente_id`) REFERENCES `PlanificacionExpediente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
