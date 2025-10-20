import prisma from '../config/prisma.js';

/**
 * Repository for Turno data access
 * Solo responsable de operaciones CRUD en base de datos
 * Las validaciones y lógica de negocio están en TurnoService
 */
export class TurnoRepository {

  /**
   * Obtiene todos los turnos con filtros opcionales
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    const { activo = true, limit = 50, offset = 0 } = filters;

    return await prisma.turno.findMany({
      where: { activo },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        horarios: {
          where: { activo: true },
          orderBy: { diaSemana: 'asc' },
          select: {
            id: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true,
            horaInicioDescanso: true,
            horaFinDescanso: true,
            duracionDescansoMinutos: true,
            duracionLaboralMinutos: true
          }
        },
        _count: {
          select: { asignaciones: true }
        }
      },
      orderBy: { fechaCreacion: 'desc' },
      take: limit,
      skip: offset
    });
  }

  /**
   * Obtiene un turno por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return await prisma.turno.findUnique({
      where: { id },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        },
        horarios: {
          where: { activo: true },
          orderBy: { diaSemana: 'asc' },
          select: {
            id: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true,
            horaInicioDescanso: true,
            horaFinDescanso: true,
            duracionDescansoMinutos: true,
            duracionLaboralMinutos: true,
            activo: true
          }
        },
        asignaciones: {
          where: { fechaFin: null },
          select: {
            id: true,
            empleadoId: true,
            empleado: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                cedula: true
              }
            },
            fechaInicio: true
          }
        },
        _count: {
          select: {
            horarios: true,
            asignaciones: true
          }
        }
      }
    });
  }

  /**
   * Obtiene turnos por área
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async findByAreaId(areaId) {
    return await prisma.turno.findMany({
      where: { areaId, activo: true },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        horarios: {
          where: { activo: true },
          orderBy: { diaSemana: 'asc' },
          select: {
            id: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true,
            horaInicioDescanso: true,
            horaFinDescanso: true,
            duracionDescansoMinutos: true,
            duracionLaboralMinutos: true
          }
        },
        _count: {
          select: { asignaciones: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  /**
   * Obtiene turnos por área incluyendo inactivos
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async findByAreaIdWithInactive(areaId) {
    return await prisma.turno.findMany({
      where: { areaId },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        horarios: {
          orderBy: { diaSemana: 'asc' },
          select: {
            id: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true,
            horaInicioDescanso: true,
            horaFinDescanso: true,
            duracionDescansoMinutos: true,
            duracionLaboralMinutos: true,
            activo: true
          }
        }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  /**
   * Crea un nuevo turno
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    return await prisma.turno.create({
      data,
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
  }

  /**
   * Actualiza un turno
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    return await prisma.turno.update({
      where: { id },
      data,
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        horarios: {
          where: { activo: true },
          orderBy: { diaSemana: 'asc' }
        },
        _count: {
          select: { asignaciones: true }
        }
      }
    });
  }

  /**
   * Elimina un turno
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async delete(id) {
    // Primero eliminar horarios asociados
    await prisma.horario.deleteMany({
      where: { turnoId: id }
    });

    return await prisma.turno.delete({
      where: { id }
    });
  }

  /**
   * Verifica si existe un turno con nombre en una área
   * @param {string} nombre
   * @param {number} areaId
   * @param {number} excludeId - ID a excluir (para actualizaciones)
   * @returns {Promise<Object|null>}
   */
  async findByNombreAndArea(nombre, areaId, excludeId = null) {
    const where = {
      nombre,
      areaId
    };

    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    return await prisma.turno.findFirst({ where });
  }

  /**
   * Obtiene turnos con empleados asignados
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async findWithEmpleados(areaId) {
    return await prisma.turno.findMany({
      where: { areaId, activo: true },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        horarios: {
          where: { activo: true },
          orderBy: { diaSemana: 'asc' }
        },
        asignaciones: {
          where: { fechaFin: null },
          include: {
            empleado: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                cedula: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Cuenta empleados asignados a un turno
   * @param {number} turnoId
   * @returns {Promise<number>}
   */
  async countAsignaciones(turnoId) {
    return await prisma.asignacion.count({
      where: {
        turnoId,
        fechaFin: null
      }
    });
  }

  /**
   * Obtiene múltiples turnos por IDs
   * @param {number[]} ids
   * @returns {Promise<Array>}
   */
  async findByIds(ids) {
    return await prisma.turno.findMany({
      where: { id: { in: ids } }
    });
  }

  /**
   * Obtiene turnos activos
   * @returns {Promise<Array>}
   */
  async findAllActive() {
    return await prisma.turno.findMany({
      where: { activo: true },
      include: {
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        horarios: {
          where: { activo: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  /**
   * Cuenta turnos por área
   * @param {number} areaId
   * @returns {Promise<number>}
   */
  async countByAreaId(areaId) {
    return await prisma.turno.count({
      where: { areaId, activo: true }
    });
  }
}