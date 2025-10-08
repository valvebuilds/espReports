import prisma from '../prisma/prismaClient.js';

//Obtener todos los empleados activos
const getAllEmpleados = async () => {
  return await prisma.empleado.findMany({ where: {activo: true }});
};
//Crear empleado
const createEmpleado = async (data) => {
  return await prisma.empleado.create({ data });
};
//Obtener empleado por id
const getEmpleadoById = async (id) => {
  return await prisma.empleado.findUnique({ where: { id: id } });
};
//Actualizar empleado
const updateEmpleado = async (id, data) => {
  return await prisma.empleado.update({ where: { id: id }, data });
};
// Desactivar empleado (en vez de eliminarlo)
const deleteEmpleado = async (id) => {
  return await prisma.empleado.update({
    where: { id: id },
    data: { activo: false },
  });
};

export default {
    getAllEmpleados,
    createEmpleado,
    getEmpleadoById,
    updateEmpleado,
    deleteEmpleado
}