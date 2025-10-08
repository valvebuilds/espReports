import prisma from '../prisma/prismaClient.js';

//Obtener todos los Parametros activos
const getAllParametros = async () => {
  return await prisma.parametroRecargo.findMany({ where: {activo: true }});
};
//Crear Parametro
const createParametro = async (data) => {
  return await prisma.parametroRecargo.create({ data });
};
//Obtener Parametro por id
const getParametroById = async (id) => {
  return await prisma.parametroRecargo.findUnique({ where: { id: id } });
};
//Actualizar Parametro
const updateParametro = async (id, data) => {
  return await prisma.parametroRecargo.update({ where: { id: id }, data });
};
// Desactivar Parametro (en vez de eliminarlo)
const deleteParametro = async (id) => {
  return await prisma.parametroRecargo.update({
    where: { id: id },
    data: { activo: false },
  });
};

export default {
  getAllParametros,
  createParametro,
  getParametroById,
  updateParametro,
  deleteParametro
};