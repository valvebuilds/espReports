-- AlterTable
ALTER TABLE "Empleado" ALTER COLUMN "actualizadoEn" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Horario" ALTER COLUMN "actualizadoEn" DROP DEFAULT,
ALTER COLUMN "turnoId" DROP DEFAULT;
