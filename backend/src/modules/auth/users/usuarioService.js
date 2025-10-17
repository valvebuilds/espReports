import prisma from '../../../shared/prisma/prismaClient.js';
import { UsuarioRepository } from '../UsuarioRepository.js';

const usuarioRepository = new UsuarioRepository();
//Obtener todos los usuarios activos
const getAllUsuarios = async () =>  {
    return usuarioRepository.findAll();
  }

const getUsuarioByArea = async (areas) => {
    const usuarios = await prisma.usuario.findMany({
        where: { 
            areaId: { in: areas } 
        },
        include: {
            area: true, // Incluye la información del área
        }
    });
    return usuarios;
};

//Obtener usuario por id sin distincion de área: solo para ADMIN
const getUsuarioById = async (id) => {
  return await prisma.usuario.findUnique({ 
    where: { id: id },
    include: { area: true }
  });
};
//Obtener usuario por id si es del área del coordinador
const getUsuarioByIdAndAreas = async (usuarioId, areasId) => {
    return await prisma.usuario.findUnique({
        where: {
            id: parseInt(usuarioId),
            areaId: { in: areasId } 
        },   include: { area: true },
    });
};
//Actualizar usuario
const updateUsuario = async (id, data) => {
  return await prisma.usuario.update({ where: { id: id }, data });
};

const deleteUsuario = async (id) => {
  return await usuarioRepository.delete(id);
};

const asignarAreaAUsuario = async (usuarioId, areaId) => {
    return await prisma.area.update({
        where: { id: areaId },
        data: { coordinadorId: usuarioId },
        include: { nombre: true } // Incluir la información del área en la respuesta
    });
}

export default {
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    getUsuarioByArea,
    getUsuarioByIdAndAreas,
    asignarAreaAUsuario
}