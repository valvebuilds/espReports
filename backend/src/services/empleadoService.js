import prisma from '../prisma/prismaClient.js';

//Obtener todos los empleados activos
const getAllEmpleados = async () => {
  return await prisma.empleado.findMany({ where: {activo: true }});
};

const getEmpleadoByArea = async (areas) => {
    const empleados = await prisma.empleado.findMany({
        where: { 
            areaId: { in: areas } 
        },
        include: {
            area: true, // Incluye la información del área
        }
    });
    return empleados;
};
//Crear empleado
const createEmpleado = async (data) => {
  return await prisma.empleado.create({ data });
};
//Obtener empleado por id sin distincion de área: solo para ADMIN
const getEmpleadoById = async (id) => {
  return await prisma.empleado.findUnique({ 
    where: { id: id },
    include: { area: true }
  });
};
//Obtener empleado por id si es del área del coordinador
const getEmpleadoByIdAndAreas = async (empleadoId, areasId) => {
    return await prisma.empleado.findUnique({
        where: {
            id: parseInt(empleadoId),
            areaId: { in: areasId } 
        },   include: { area: true },
    });
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
    deleteEmpleado,
    getEmpleadoByArea,
    getEmpleadoByIdAndAreas
}