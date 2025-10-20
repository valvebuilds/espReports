/*
  Warnings:

  - You are about to drop the column `horarioId` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Horario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Empleado" DROP CONSTRAINT "Empleado_horarioId_fkey";

-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "turnoIds" INTEGER[];

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "horarioId",
ADD COLUMN     "asignadosId" INTEGER[],
ALTER COLUMN "actualizadoEn" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Horario" DROP COLUMN "nombre",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "minutosDescanso" INTEGER NOT NULL DEFAULT 105,
ADD COLUMN     "minutosLaborales" INTEGER NOT NULL DEFAULT 465,
ADD COLUMN     "turnoId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Turno" (
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horarioIds" INTEGER[],

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
