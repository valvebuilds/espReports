import prisma from '../../shared/prisma/prismaClient.js';

//Obtener todos los Horarios activos
const getAllHorarios = async () => {
    return await prisma.horario.findMany({ 
        where: { 
            activo: true 
        },
        include: { 
            turno: { 
                select: { 
                    tipoTurno: true 
                }
            } 
        } 
    });
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
// Desactivar Horario (en vez de eliminarlo)
const deleteHorario = async (id) => {
  return await prisma.horario.update({
    where: { id: id },
    data: { activo: false },
  });
};

const getHorarioByTurno = async ( turnoId ) => {
    const horarios = await prisma.horario.findMany({
      where: { 
            turnoId: parseInt(turnoId),
        }
    })
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