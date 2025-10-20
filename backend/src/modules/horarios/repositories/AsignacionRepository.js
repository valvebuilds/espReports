import prisma from '../config/prisma.js';

/**
 * Repository for Asignacion data access
 * Solo responsable de operaciones CRUD en base de datos
 * Las validaciones y lógica de negocio están en AsignacionService
 */
export class AsignacionRepository {

  /**
   * Obtiene todas las asignaciones con filtros opcionales
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    const { empleadoId, turnoId, estado, limit = 50, offset = 0 } = filters;

    const where = {};
    
    if (empleadoId) {
      where.empleadoId = empleadoId;
    }
    
    if (turnoId) {
      where.turnoId = turnoId;
    }

    if (estado === 'activa') {
      where.fechaFin = null;
    } else if (estado === 'inactiva') {
      where.NOT = { fechaFin: null };
    }

    return await prisma.asignacion.findMany({
      where,
      include: {
        empleado: {
          select: {
            id: true,
            cedula: true,
            nombres: true,
            apellidos: true,
            email: true,
            estado: true
          }
        },
        turno: {
          select: {
            id: true,
            codigoTurno: true,
            nombre: true,
            horarios: {
              where: { activo: true },
              select: {
                id: true,
                diaSemana: true,
                horaInicio: true,
                horaFin: true,
                horaInicioDescanso: true,
                horaFinDescanso: true,
                duracionLaboralMinutos: true
              }
            }
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      },
      take: limit,
      skip: offset
    });
  }

  /**
   * Obtiene una asignación por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return await prisma.asignacion.findUnique({
      where: { id },
      include: {
        empleado: {
          select: {
            id: true,
            cedula: true,
            nombres: true,
            apellidos: true,
            email: true,
            estado: true,
            fechaIngreso: true
          }
        },
        turno: {
          select: {
            id: true,
            codigoTurno: true,
            nombre: true,
            descripcion: true,
            horarios: {
              where: { activo: true },
              select: {
                id: true,
                diaSemana: true,
                horaInicio: true,
                horaFin: true,
                horaInicioDescanso: true,
                horaFinDescanso: true,
                duracionLaboralMinutos: true,
                duracionDescansoMinutos: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Obtiene todas las asignaciones de un empleado
   * @param {number} empleadoId
   * @returns {Promise<Array>}
   */
  async findByEmpleadoId(empleadoId) {
    return await prisma.asignacion.findMany({
      where: { empleadoId },
      include: {
        turno: {
          select: {
            id: true,
            codigoTurno: true,
            nombre: true,
            horarios: {
              where: { activo: true },
              orderBy: { diaSemana: 'asc' }
            }
          }
        }
      },
      orderBy: {
        fechaInicio: 'desc'
      }
    });
  }

  /**
   * Obtiene la asignación activa de un empleado
   * @param {number} empleadoId
   * @returns {Promise<Object|null>}
   */
  async findActiveByEmpleadoId(empleadoId) {
    return await prisma.asignacion.findFirst({
      where: {
        empleadoId,
        fechaFin: null
      },
      include: {
        empleado: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true
          }
        },
        turno: {
          select: {
            id: true,
            nombre: true,
            codigoTurno: true,
            horarios: {
              where: { activo: true },
              orderBy: { diaSemana: 'asc' }
            }
          }
        }
      }
    });
  }

  /**
   * Obtiene la asignación de un empleado válida para una fecha específica
   * @param {number} empleadoId
   * @param {Date} fecha
   * @returns {Promise<Object|null>}
   */
  async findByEmpleadoAndDate(empleadoId, fecha) {
    return await prisma.asignacion.findFirst({
      where: {
        empleadoId,
        fechaInicio: { lte: fecha },
        OR: [
          { fechaFin: null },
          { fechaFin: { gte: fecha } }
        ]
      },
      include: {
        turno: {
          select: {
            id: true,
            nombre: true,
            codigoTurno: true,
            horarios: {
              where: { activo: true }
            }
          }
        }
      }
    });
  }

  /**
   * Crea una nueva asignación
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    return await prisma.asignacion.create({
      data,
      include: {
        empleado: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true
          }
        },
        turno: {
          select: {
            id: true,
            nombre: true,
            codigoTurno: true
          }
        }
      }
    });
  }

  /**
   * Actualiza una asignación
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    return await prisma.asignacion.update({
      where: { id },
      data,
      include: {
        empleado: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true
          }
        },
        turno: {
          select: {
            id: true,
            nombre: true,
            codigoTurno: true
          }
        }
      }
    });
  }

  /**
   * Elimina una asignación
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async delete(id) {
    return await prisma.asignacion.delete({
      where: { id }
    });
  }

  /**
   * Obtiene el historial de asignaciones de un empleado
   * @param {number} empleadoId
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async findHistorialByEmpleadoId(empleadoId, limit = 100) {
    return await prisma.asignacion.findMany({
      where: { empleadoId },
      include: {
        turno: {
          select: {
            id: true,
            nombre: true,
            codigoTurno: true,
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
        fechaInicio: 'desc'
      },
      take: limit
    });
  }

  /**
   * Cuenta asignaciones activas por turno
   * @param {number} turnoId
   * @returns {Promise<number>}
   */
  async countByTurnoId(turnoId) {
    return await prisma.asignacion.count({
      where: {
        turnoId,
        fechaFin: null
      }
    });
  }

  /**
   * Obtiene todas las asignaciones activas
   * @returns {Promise<Array>}
   */
  async findAllActive() {
    return await prisma.asignacion.findMany({
      where: { fechaFin: null },
      include: {
        empleado: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true
          }
        },
        turno: {
          select: {
            id: true,
            nombre: true,
            codigoTurno: true
          }
        }
      }
    });
  }

  /**
   * Obtiene asignaciones activas por área
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async findActiveByAreaId(areaId) {
    return await prisma.asignacion.findMany({
      where: {
        fechaFin: null,
        turno: {
          areaId
        }
      },
      include: {
        empleado: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true
          }
        },
        turno: {
          select: {
            id: true,
            nombre: true,
            codigoTurno: true
          }
        }
      }
    });
  }

  /**
   * Verifica si existe asignación activa para un empleado
   * @param {number} empleadoId
   * @returns {Promise<boolean>}
   */
  async existsActiveAssignment(empleadoId) {
    const count = await prisma.asignacion.count({
      where: {
        empleadoId,
        fechaFin: null
      }
    });

    return count > 0;
  }

  /**
   * Busca asignaciones por rango de fechas
   * @param {Date} fechaInicio
   * @param {Date} fechaFin
   * @returns {Promise<Array>}
   */
  async findByDateRange(fechaInicio, fechaFin) {
    return await prisma.asignacion.findMany({
      where: {
        OR: [
          {
            fechaInicio: {
              gte: fechaInicio,
              lte: fechaFin
            }
          },
          {
            AND: [
              { fechaInicio: { lte: fechaInicio } },
              {
                OR: [
                  { fechaFin: null },
                  { fechaFin: { gte: fechaFin } }
                ]
              }
            ]
          }
        ]
      }
    });
  }
}