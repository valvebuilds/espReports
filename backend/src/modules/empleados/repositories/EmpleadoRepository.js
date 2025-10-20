import prisma from '../../../shared/prisma/prismaClient.js';
import { ValidationError, NotFoundError } from '../../../core/errors/AppError.js';

/**
 * Repository for Empleado data access
 */
export class EmpleadoRepository {
  
  async findAll() {
    const empleados = await prisma.empleado.findMany({
      where: { activo: true },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            coordinador: {
              select: {
                id: true,
                nombre: true,
                usuario: true
              }
            }
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });
    
    return empleados;
  }

  async findById(id) {
    if (!id) {
      throw new ValidationError('Employee ID is required');
    }

    const empleado = await prisma.empleado.findUnique({
      where: { id: parseInt(id) },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            coordinador: {
              select: {
                id: true,
                nombre: true,
                usuario: true
              }
            }
          }
        },
        horario: {
          select: {
            id: true,
            nombre: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true
          }
        }
      }
    });
    
    return empleado;
  }

  async findByAreaIds(areaIds) {
    if (!areaIds || !Array.isArray(areaIds)) {
      throw new ValidationError('Area IDs array is required');
    }

    const empleados = await prisma.empleado.findMany({
      where: { 
        areaId: { in: areaIds },
        activo: true
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            coordinador: {
              select: {
                id: true,
                nombre: true,
                usuario: true
              }
            }
          }
        },
        horario: {
          select: {
            id: true,
            nombre: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });
    return empleados;
  }

  async findByIdAndAreaIds(empleadoId, areaIds) {
    if (!empleadoId) {
      throw new ValidationError('Employee ID is required');
    }
    if (!areaIds || !Array.isArray(areaIds)) {
      throw new ValidationError('Area IDs array is required');
    }

    const empleado = await prisma.empleado.findUnique({
      where: {
        id: parseInt(empleadoId),
        areaId: { in: areaIds },
        activo: true
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            coordinador: {
              select: {
                id: true,
                nombre: true,
                usuario: true
              }
            }
          }
        },
        horario: {
          select: {
            id: true,
            nombre: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true
          }
        }
      }
    });
    
    return empleado;
  }

  async create(empleadoData) {
    const { nombre, cedula, areaId  } = empleadoData;
    
    if (!nombre || !cedula || !areaId ) {
      throw new ValidationError('Nombre, cedula, area ID, y turno ID se requieren');
    }

    const empleado = await prisma.empleado.create({
      data: {
        nombre,
        cedula,
        areaId: parseInt(areaId)
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            coordinador: {
              select: {
                id: true,
                nombre: true,
                usuario: true
              }
            }
          }
        }
      }
    });
    
    return empleado;
  }

  async update(id, updateData) {
    if (!id) {
      throw new ValidationError('Employee ID is required');
    }

    const empleado = await prisma.empleado.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            coordinador: {
              select: {
                id: true,
                nombre: true,
                usuario: true
              }
            }
          }
        },
        horario: {
          select: {
            id: true,
            nombre: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true
          }
        }
      }
    });
    
    return empleado;
  }

  async deactivate(id) {
    if (!id) {
      throw new ValidationError('Employee ID is required');
    }

    const empleado = await prisma.empleado.update({
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
    
    return empleado;
  }

  async findByCedula(cedula) {
    if (!cedula) {
      throw new ValidationError('Cedula requerida');
    }

    const empleado = await prisma.empleado.findUnique({
      where: { cedula },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    return empleado;
  }
}
