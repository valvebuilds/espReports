import prisma from '../prisma/prismaClient.js';

//Obtener todas las Areas activas
const getAllAreas = async () => {
  return await prisma.area.findMany({ where: {activo: true }});
};

//Crear Area
const createArea = async (areaData) => {
  // 1. Opcional: Validar si el coordinadorId existe si es que fue proporcionado
  if (areaData.coordinadorId) {
    const coordinador = await prisma.usuario.findUnique({
      where: { id: areaData.coordinadorId },
      select: { id: true }
    });
    if (!coordinador) {
      // Lanzar un error que el controlador pueda capturar
      throw new Error("El ID de coordinador proporcionado no existe.");
    }
  }
  // 2. Crear el área
  return await prisma.area.create({ data: areaData });
};

//Obtener Area por id
const getAreaById = async (id) => {
  return await prisma.area.findUnique({ where: { id: parseInt(id) } });
};
//Actualizar Area
const updateArea = async (id, data) => {
  return await prisma.area.update({ where: { id: parseInt(id) }, data });
};
// Desactivar Area (en vez de eliminarlo)
const deleteArea = async (id) => {
  return await prisma.area.update({
    where: { id: parseInt(id) },
    data: { activo: false },
  });
};

export default {
  getAllAreas,
  createArea,
  getAreaById,
  updateArea,
  deleteArea
};