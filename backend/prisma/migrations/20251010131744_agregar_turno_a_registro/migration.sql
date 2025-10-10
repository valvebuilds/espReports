/*
  Warnings:

  - Added the required column `turnoId` to the `Registro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "turnoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
