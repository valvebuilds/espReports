import prisma from '../prisma/prismaClient.js';

//Obtener todos los Compensatorios activos
const getAllCompensatorios = async () => {
  return await prisma.compensatorio.findMany();
};

const getCompensatorioByArea = async (areas) => {
    const compensatorios = await prisma.compensatorio.findMany({
      where: { empleado: { areaId: { in: areas } } },
      include: {
        empleado: { select: { id: true, nombre: true, area: { 
                select: { id: true, nombre: true }
            }
          }
        },
        registro: true
      }
    });
    return compensatorios;
}
//Crear Compensatorio
const createCompensatorio = async (data) => {
  return await prisma.compensatorio.create({ data });
};
//Obtener Compensatorio por id
const getCompensatorioById = async (id) => {
  return await prisma.compensatorio.findUnique({ where: { id: id } });
};
//Actualizar Compensatorio
const updateCompensatorio = async (id, data) => {
  return await prisma.compensatorio.update({ where: { id: id }, data });
};
// Desactivar Compensatorio (en vez de eliminarlo)
const deleteCompensatorio = async (id) => {
  return await prisma.compensatorio.delete({
    where: { id: id },
  });
};

export default {
  getAllCompensatorios,
  createCompensatorio,
  getCompensatorioById,
  updateCompensatorio,
  deleteCompensatorio
};