import prisma from '../prisma/prismaClient.js';

//Obtener todos los Registros activos
const getAllRegistros = async () => {
  return await prisma.registro.findMany();
};
//Crear Registro
const createRegistro = async (data) => {
  return await prisma.registro.create({ data });
};

//Obtener Registro por id
const getRegistroById = async (id) => {
  return await prisma.registro.findUnique({ where: { id: id } });
};
//Actualizar Registro
const updateRegistro = async (id, data) => {
  return await prisma.registro.update({ where: { id: id }, data });
};
// Desactivar Registro (en vez de eliminarlo)
const deleteRegistro = async (id) => {
  return await prisma.registro.delete({ where: { id: id },});
};

export default {
  getAllRegistros,
  createRegistro,
  getRegistroById,
  updateRegistro,
  deleteRegistro
};