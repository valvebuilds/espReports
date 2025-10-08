import prisma from '../prisma/prismaClient.js';

//Obtener todas las Areas activas
const getAllAreas = async () => {
  return await prisma.area.findMany({ where: {activo: true }});
};
//Crear Area
const createArea = async (data) => {
  return await prisma.area.create({ data });
};
//Obtener Area por id
const getAreaById = async (id) => {
  return await prisma.area.findUnique({ where: { id: id } });
};
//Actualizar Area
const updateArea = async (id, data) => {
  return await prisma.area.update({ where: { id: id }, data });
};
// Desactivar Area (en vez de eliminarlo)
const deleteArea = async (id) => {
  return await prisma.area.update({
    where: { id: id },
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