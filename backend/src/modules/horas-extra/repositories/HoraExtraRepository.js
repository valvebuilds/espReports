import prisma from '../../../shared/prisma/prismaClient.js';
import { ValidationError, NotFoundError } from '../../../core/errors/AppError.js';

/**
 * Repository for HoraExtra data access
 */
export class HoraExtraRepository {
  
  async findAll() {
    const horasExtra = await prisma.horaExtra.findMany({
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });
    
    return horasExtra;
  }

  async findById(id) {
    if (!id) {
      throw new ValidationError('Overtime record ID is required');
    }

    const horaExtra = await prisma.horaExtra.findUnique({
      where: { id: parseInt(id) },
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });
    
    return horaExtra;
  }

  async findByEmpleadoId(empleadoId) {
    if (!empleadoId) {
      throw new ValidationError('Employee ID is required');
    }

    const horasExtra = await prisma.horaExtra.findMany({
      where: { empleadoId: parseInt(empleadoId) },
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });
    
    return horasExtra;
  }

  async findByCoordinadorId(coordinadorId) {
    if (!coordinadorId) {
      throw new ValidationError('Coordinator ID is required');
    }

    const horasExtra = await prisma.horaExtra.findMany({
      where: { coordinadorId: parseInt(coordinadorId) },
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });
    
    return horasExtra;
  }

  async findByEstado(estado) {
    if (!estado) {
      throw new ValidationError('Status is required');
    }

    const horasExtra = await prisma.horaExtra.findMany({
      where: { estado },
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });
    
    return horasExtra;
  }

  async create(horaExtraData) {
    const { 
      empleadoId, 
      coordinadorId, 
      horaInicio, 
      horaFin, 
      horasDiurnas, 
      horasNocturnas, 
      horasDominicales, 
      totalHours, 
      observaciones, 
      nroSolicitud, 
      estado 
    } = horaExtraData;
    
    if (!empleadoId || !coordinadorId || !horaInicio || !horaFin || !totalHours || !estado) {
      throw new ValidationError('Employee ID, coordinator ID, start time, end time, total hours, and status are required');
    }

    const horaExtra = await prisma.horaExtra.create({
      data: {
        empleadoId: parseInt(empleadoId),
        coordinadorId: parseInt(coordinadorId),
        horaInicio: new Date(horaInicio),
        horaFin: new Date(horaFin),
        horasDiurnas: parseFloat(horasDiurnas) || 0,
        horasNocturnas: parseFloat(horasNocturnas) || 0,
        horasDominicales: parseFloat(horasDominicales) || 0,
        totalHours: parseFloat(totalHours),
        observaciones,
        nroSolicitud,
        estado
      },
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });
    
    return horaExtra;
  }

  async update(id, updateData) {
    if (!id) {
      throw new ValidationError('Overtime record ID is required');
    }

    const horaExtra = await prisma.horaExtra.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        horaInicio: updateData.horaInicio ? new Date(updateData.horaInicio) : undefined,
        horaFin: updateData.horaFin ? new Date(updateData.horaFin) : undefined,
        horasDiurnas: updateData.horasDiurnas ? parseFloat(updateData.horasDiurnas) : undefined,
        horasNocturnas: updateData.horasNocturnas ? parseFloat(updateData.horasNocturnas) : undefined,
        horasDominicales: updateData.horasDominicales ? parseFloat(updateData.horasDominicales) : undefined,
        totalHours: updateData.totalHours ? parseFloat(updateData.totalHours) : undefined
      },
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });
    
    return horaExtra;
  }

  async updateEstado(id, estado) {
    if (!id || !estado) {
      throw new ValidationError('Overtime record ID and status are required');
    }

    const horaExtra = await prisma.horaExtra.update({
      where: { id: parseInt(id) },
      data: { estado },
      include: {
        empleado: {
          select: {
            id: true,
            nombre: true,
            cedula: true,
            area: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });
    
    return horaExtra;
  }

  async delete(id) {
    if (!id) {
      throw new ValidationError('Overtime record ID is required');
    }

    const horaExtra = await prisma.horaExtra.delete({
      where: { id: parseInt(id) }
    });
    
    return horaExtra;
  }
}
