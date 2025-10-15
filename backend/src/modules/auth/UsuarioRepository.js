import prisma from '../../shared/prisma/prismaClient.js';
import { Usuario } from './Usuario.js';

export class UsuarioRepository {

  async findByUsername(username) { 
    const user = await prisma.usuario.findUnique({ where: { usuario: username } });
    return user ? new Usuario(user) : null;
  }

  async findById(id) {
    const user = await prisma.usuario.findUnique({ where: { id } });
    return user ? new Usuario(user) : null;
  }

  async create({ username, passwordHash, name, role }) {
    const user = await prisma.usuario.create({
      data: {
        usuario: username,
        contrasena: passwordHash,
        nombre: name,
        rol: role,
      },
    });
    return new Usuario(user);
  }

  async updatePassword(id, newHash) {
    const user = await prisma.usuario.update({
      where: { id },
      data: { passwordHash: newHash },
    });
    return new Usuario(user);
  }
}
