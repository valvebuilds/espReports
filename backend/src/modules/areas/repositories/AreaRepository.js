import prisma from '../../../shared/prisma/prismaClient.js';
import { ValidationError, NotFoundError } from '../../../core/errors/AppError.js';

/**
 * Repository for Area data access
 */
export class AreaRepository {
  
  async findAll() {
    const areas = await prisma.area.findMany({
      include: {
        coordinador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
            rol: true
          }
        },
        empleados: {
          where: { activo: true },
          select: {
            id: true,
            nombre: true,
            cedula: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });
    
    return areas;
  }

  async findById(id) {
    if (!id) {
      throw new ValidationError('Area ID is required');
    }
    console.log("area repositori finding: " , id);
    const area = await prisma.area.findUnique({
      where: { id: parseInt(id) },
      include: {
        coordinador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
            rol: true
          }
        },
        empleados: {
          where: { activo: true },
          select: {
            id: true,
            nombre: true,
            cedula: true
          }
        }
      }
    });
    
    return area;
  }

  async create(areaData) {
    const { nombre, coordinadorId } = areaData;
    
    if (!nombre || !coordinadorId) {
      throw new ValidationError('Area name and coordinator ID are required');
    }

    const area = await prisma.area.create({
      data: {
        nombre,
        coordinadorId: parseInt(coordinadorId)
      },
      include: {
        coordinador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
            rol: true
          }
        }
      }
    });
    
    return area;
  }

  async update(id, updateData) {
    if (!id) {
      throw new ValidationError('Area ID is required');
    }

    const area = await prisma.area.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        coordinador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
            rol: true
          }
        }
      }
    });
    
    return area;
  }

  async delete(id) {
    if (!id) {
      throw new ValidationError('Area ID is required');
    }

    const area = await prisma.area.delete({
      where: { id: parseInt(id) }
    });
    
    return area;
  }

  async findByCoordinatorId(coordinatorId) {
    if (!coordinatorId) {
      throw new ValidationError('Coordinator ID is required');
    }

    const area = await prisma.area.findFirst({
      where: { coordinadorId: parseInt(coordinatorId) },
      include: {
        coordinador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
            rol: true
          }
        }
      }
    });
    
    return area;
  }
}
