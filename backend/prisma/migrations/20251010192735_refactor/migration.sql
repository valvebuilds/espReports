/*
  Warnings:

  - You are about to drop the column `fechaCompensacion` on the `Compensatorio` table. All the data in the column will be lost.
  - You are about to drop the column `horasCompensadas` on the `Compensatorio` table. All the data in the column will be lost.
  - You are about to drop the column `horasPendientes` on the `Compensatorio` table. All the data in the column will be lost.
  - You are about to drop the column `activo` on the `Horario` table. All the data in the column will be lost.
  - You are about to drop the column `duracionDescansoHH` on the `Horario` table. All the data in the column will be lost.
  - You are about to drop the column `duracionDescansoMM` on the `Horario` table. All the data in the column will be lost.
  - You are about to drop the column `horaDescanso` on the `Horario` table. All the data in the column will be lost.
  - You are about to drop the column `diaSemana` on the `ParametroRecargo` table. All the data in the column will be lost.
  - You are about to drop the column `horaFin` on the `ParametroRecargo` table. All the data in the column will be lost.
  - You are about to drop the column `horaInicio` on the `ParametroRecargo` table. All the data in the column will be lost.
  - You are about to drop the column `porcentaje` on the `ParametroRecargo` table. All the data in the column will be lost.
  - You are about to drop the column `tipoRecargo` on the `ParametroRecargo` table. All the data in the column will be lost.
  - You are about to drop the column `horasDiurnas` on the `Registro` table. All the data in the column will be lost.
  - You are about to drop the column `horasDomin` on the `Registro` table. All the data in the column will be lost.
  - You are about to drop the column `horasNocturnas` on the `Registro` table. All the data in the column will be lost.
  - You are about to drop the column `horasTotales` on the `Registro` table. All the data in the column will be lost.
  - You are about to drop the column `empleadoId` on the `Turno` table. All the data in the column will be lost.
  - You are about to drop the column `tipoTurno` on the `Turno` table. All the data in the column will be lost.
  - You are about to drop the `RegistroRecargo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clave]` on the table `ParametroRecargo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `horasGeneradas` to the `Compensatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoPendienteTiempo` to the `Compensatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clave` to the `ParametroRecargo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `ParametroRecargo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreTurno` to the `Turno` table without a default value. This is not possible if the table is not empty.
  - Made the column `areaId` on table `Turno` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EstadoLiquidacion" AS ENUM ('PENDIENTE_DE_CIERRE', 'CERRADO_COMPENSADO', 'CERRADO_LIQUIDADO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EstadoRegistro" ADD VALUE 'APROBADO';
ALTER TYPE "EstadoRegistro" ADD VALUE 'RECHAZADO';

-- DropForeignKey
ALTER TABLE "public"."RegistroRecargo" DROP CONSTRAINT "RegistroRecargo_registroId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Turno" DROP CONSTRAINT "Turno_areaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Turno" DROP CONSTRAINT "Turno_empleadoId_fkey";

-- AlterTable
ALTER TABLE "Compensatorio" DROP COLUMN "fechaCompensacion",
DROP COLUMN "horasCompensadas",
DROP COLUMN "horasPendientes",
ADD COLUMN     "estadoCierre" "EstadoLiquidacion" NOT NULL DEFAULT 'PENDIENTE_DE_CIERRE',
ADD COLUMN     "fechaCierre" TIMESTAMP(3),
ADD COLUMN     "horasGeneradas" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "horasLiquidadasEnDinero" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "saldoPendienteTiempo" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Horario" DROP COLUMN "activo",
DROP COLUMN "duracionDescansoHH",
DROP COLUMN "duracionDescansoMM",
DROP COLUMN "horaDescanso",
ALTER COLUMN "horaInicio" SET DATA TYPE TEXT,
ALTER COLUMN "horaFin" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ParametroRecargo" DROP COLUMN "diaSemana",
DROP COLUMN "horaFin",
DROP COLUMN "horaInicio",
DROP COLUMN "porcentaje",
DROP COLUMN "tipoRecargo",
ADD COLUMN     "clave" TEXT NOT NULL,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "valor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Registro" DROP COLUMN "horasDiurnas",
DROP COLUMN "horasDomin",
DROP COLUMN "horasNocturnas",
DROP COLUMN "horasTotales";

-- AlterTable
ALTER TABLE "Turno" DROP COLUMN "empleadoId",
DROP COLUMN "tipoTurno",
ADD COLUMN     "nombreTurno" TEXT NOT NULL,
ALTER COLUMN "areaId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."RegistroRecargo";

-- DropEnum
DROP TYPE "public"."TipoTurno";

-- CreateTable
CREATE TABLE "DiaFestivo" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "DiaFestivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleHoraExtra" (
    "id" SERIAL NOT NULL,
    "registroId" INTEGER NOT NULL,
    "fechaInicioHe" TIMESTAMP(3) NOT NULL,
    "fechaFinHe" TIMESTAMP(3) NOT NULL,
    "tipoRecargo" "TipoRecargo" NOT NULL,
    "minutosAplicados" INTEGER NOT NULL,
    "parametroId" INTEGER,

    CONSTRAINT "DetalleHoraExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsoCompensatorio" (
    "id" SERIAL NOT NULL,
    "compensatorioId" INTEGER NOT NULL,
    "fechaUso" DATE NOT NULL,
    "horasUtilizadasInstancia" DOUBLE PRECISION NOT NULL,
    "motivoUso" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsoCompensatorio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiaFestivo_fecha_key" ON "DiaFestivo"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroRecargo_clave_key" ON "ParametroRecargo"("clave");

-- CreateIndex
CREATE INDEX "Registro_empleadoId_horaInicio_idx" ON "Registro"("empleadoId", "horaInicio");

-- CreateIndex
CREATE INDEX "Registro_turnoId_idx" ON "Registro"("turnoId");

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleHoraExtra" ADD CONSTRAINT "DetalleHoraExtra_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "Registro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleHoraExtra" ADD CONSTRAINT "DetalleHoraExtra_parametroId_fkey" FOREIGN KEY ("parametroId") REFERENCES "ParametroRecargo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsoCompensatorio" ADD CONSTRAINT "UsoCompensatorio_compensatorioId_fkey" FOREIGN KEY ("compensatorioId") REFERENCES "Compensatorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
