import prisma from '../prisma/prismaClient.js';

//Obtener todos los Turnos activos
const getAllTurnos = async () => {
  return await prisma.turno.findMany({ where: {activo: true }});
};
//Crear Turno
const createTurno = async (data) => {
  return await prisma.turno.create({ data });
};
//Obtener Turno por id
const getTurnoById = async (id) => {
  return await prisma.turno.findUnique({ where: { id: id } });
};
//Actualizar Turno
const updateTurno = async (id, data) => {
  return await prisma.turno.update({ where: { id: id }, data });
};
// Desactivar Turno (en vez de eliminarlo)
const deleteTurno = async (id) => {
  return await prisma.turno.update({
    where: { id: id },
    data: { activo: false },
  });
};

export default {
  getAllTurnos,
  createTurno,
  getTurnoById,
  updateTurno,
  deleteTurno
};