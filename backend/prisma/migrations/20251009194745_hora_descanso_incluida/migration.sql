/*
  Warnings:

  - Added the required column `duracionDescanso` to the `Horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaDescanso` to the `Horario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'EMPLEADO';

-- AlterTable
ALTER TABLE "Horario" ADD COLUMN     "duracionDescanso" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "horaDescanso" TIMESTAMP(3) NOT NULL;
