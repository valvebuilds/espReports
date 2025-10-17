import prisma from '../../shared/prisma/prismaClient.js';

//Obtener todos los Horarios activos
const getAllHorarios = async () => {
    return await prisma.horario.findMany();
};
//Crear Horario
const createHorario = async (data) => {
  return await prisma.horario.create({ data });
};
//Obtener Horario por id
const getHorarioById = async (id) => {
  return await prisma.horario.findUnique({ where: { id: parseInt(id) } });
};
//Actualizar Horario
const updateHorario = async (id, data) => {
  return await prisma.horario.update({ where: { id: parseInt(id) }, data });
};
// Eliminar Horario
const deleteHorario = async (id) => {
  return await prisma.horario.delete({
    where: { id: id }
  });
};

const getHorarioByTurno = async ( turnoId ) => {
    // Since there's no turno relationship in the schema, return all horarios for now
    const horarios = await prisma.horario.findMany();
    return horarios;
};

export default {
  getAllHorarios,
  createHorario,
  getHorarioById,
  updateHorario,
  deleteHorario,
  getHorarioByTurno,
};