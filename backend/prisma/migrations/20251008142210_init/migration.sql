-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "TipoTurno" AS ENUM ('ACUEDUCTO', 'ASEO', 'ALCANTARILLADO', 'PTAR_DIURNO', 'PTAR_NOCTURNO', 'PTAR_FIN_DE_SEMANA');

-- CreateEnum
CREATE TYPE "TipoRecargo" AS ENUM ('EXTRA_DIURNO', 'NOCTURNO', 'DOMINICAL', 'FESTIVO');

-- CreateEnum
CREATE TYPE "EstadoRegistro" AS ENUM ('PENDIENTE', 'COMPENSADO');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'COORDINADOR');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" "Roles" NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "coordinadorId" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" SERIAL NOT NULL,
    "areaId" INTEGER,
    "empleadoId" INTEGER,
    "tipoTurno" "TipoTurno" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" SERIAL NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroRecargo" (
    "id" SERIAL NOT NULL,
    "tipoRecargo" "TipoRecargo" NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "diaSemana" "DiaSemana",
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParametroRecargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "horasTotales" DOUBLE PRECISION NOT NULL,
    "horasDiurnas" DOUBLE PRECISION NOT NULL,
    "horasNocturnas" DOUBLE PRECISION NOT NULL,
    "horasDomin" DOUBLE PRECISION NOT NULL,
    "motivo" TEXT,
    "nroSolicitud" TEXT,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'PENDIENTE',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "autorizadoPorId" INTEGER,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroRecargo" (
    "id" SERIAL NOT NULL,
    "registroId" INTEGER NOT NULL,
    "tipoRecargo" "TipoRecargo" NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "horasAplicadas" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RegistroRecargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compensatorio" (
    "id" SERIAL NOT NULL,
    "registroId" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "fechaCompensacion" TIMESTAMP(3),
    "horasCompensadas" DOUBLE PRECISION NOT NULL,
    "horasPendientes" DOUBLE PRECISION NOT NULL,
    "motivo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Compensatorio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_cedula_key" ON "Empleado"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Compensatorio_registroId_key" ON "Compensatorio"("registroId");

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_coordinadorId_fkey" FOREIGN KEY ("coordinadorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_autorizadoPorId_fkey" FOREIGN KEY ("autorizadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroRecargo" ADD CONSTRAINT "RegistroRecargo_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "Registro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compensatorio" ADD CONSTRAINT "Compensatorio_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "Registro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compensatorio" ADD CONSTRAINT "Compensatorio_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
