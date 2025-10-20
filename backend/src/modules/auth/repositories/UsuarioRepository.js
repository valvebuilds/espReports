import prisma from '../../../shared/prisma/prismaClient.js';
import { Usuario } from '../models/Usuario.js';
import { NotFoundError, ValidationError } from '../../../core/errors/AppError.js';

/**
 * repositorio para el acceso a datos de usuarios
 * maneja las operaciones CRUD y consultas específicas relacionadas con los usuarios
 */
export class UsuarioRepository {
  
  async findAll() {
    const users = await prisma.usuario.findMany({
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });
    
    return users.map(user => new Usuario(user));
  }

  async findByUsername(username) {
    if (!username) {
      throw new ValidationError('Username is required');
    }
    const user = await prisma.usuario.findUnique({ 
      where: { usuario: username },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return user ? new Usuario(user) : null;
  }

  async findById(id) {
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    const user = await prisma.usuario.findUnique({ 
      where: { id: parseInt(id) },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return user ? new Usuario(user) : null;
  }

  async findByAreaIds(areaIds) {
    if (!areaIds || !Array.isArray(areaIds)) {
      throw new ValidationError('Area IDs array is required');
    }

    const users = await prisma.usuario.findMany({
      where: { 
        areaId: { in: areaIds } 
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });
    
    return users.map(user => new Usuario(user));
  }

  async findByIdAndAreaIds(userId, areaIds) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }
    if (!areaIds || !Array.isArray(areaIds)) {
      throw new ValidationError('Area IDs array is required');
    }

    const user = await prisma.usuario.findUnique({
      where: {
        id: parseInt(userId),
        areaId: { in: areaIds } 
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return user ? new Usuario(user) : null;
  }

  async create(userData) {
    const { username, passwordHash, name, role } = userData;
    
    if (!username || !passwordHash || !name || !role) {
      throw new ValidationError('Username, password, name, and role are required');
    }

    const user = await prisma.usuario.create({
      data: {
        usuario: username,
        contrasena: passwordHash,
        nombre: name,
        rol: role
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return new Usuario(user);
  }

  /**
   * Update user information
   */
  async update(id, updateData) {
    if (!id) {
      throw new ValidationError('User ID is required');
    }
    const user = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return new Usuario(user);
  }

  /**
   * Update user password
   */
  async updatePassword(id, newPasswordHash) {
    if (!id || !newPasswordHash) {
      throw new ValidationError('User ID and new password hash are required');
    }

    const user = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { contrasena: newPasswordHash },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return new Usuario(user);
  }

  /**
   * Assign area to user (make user coordinator of area)
   */
  async assignAreaToUser(userId, areaId) {
    if (!userId || !areaId) {
      throw new ValidationError('User ID and Area ID are required');
    }

    const area = await prisma.area.update({
      where: { id: parseInt(areaId) },
      data: { coordinadorId: parseInt(userId) },
      include: {
        coordinador: {
          select: {
            id: true,
            nombre: true,
            usuario: true
          }
        }
      }
    });
    
    return area;
  }

  /**
   * Find area by coordinator ID
   */
  async findAreaByCoordinatorId(coordinatorId) {
    if (!coordinatorId) {
      throw new ValidationError('Coordinator ID is required');
    }

    const area = await prisma.area.findFirst({
      where: { coordinadorId: parseInt(coordinatorId) },
      select: { 
        id: true,
        nombre: true 
      }
    });
    
    return area;
  }

  /**
   * Soft delete user (deactivate)
   */
  async delete(id) {
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    const user = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { activo: false },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return new Usuario(user);
  }

  /**
   * Hard delete user (permanent removal)
   */
  async hardDelete(id) {
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    const user = await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });
    
    return new Usuario(user);
  }
}
