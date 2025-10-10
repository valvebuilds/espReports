/*
  Warnings:

  - You are about to drop the column `duracionDescanso` on the `Horario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Horario" DROP COLUMN "duracionDescanso",
ADD COLUMN     "duracionDescansoHH" INTEGER,
ADD COLUMN     "duracionDescansoMM" INTEGER;
