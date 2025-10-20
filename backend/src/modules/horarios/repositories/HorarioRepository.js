import prisma from '../../../shared/prisma/prismaClient.js';

export class HorarioRepository {

  /**
   * Obtiene todos los horarios
   * @param {Object} filters
   * @param {boolean} filters.soloActivos
   * @param {number} filters.turnoId
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    const { soloActivos = true, turnoId } = filters;

    const where = {};
    if (soloActivos) {
      where.activo = true;
    }
    if (turnoId) {
      where.turnoId = turnoId;
    }

    return await prisma.horario.findMany({
      where,
      include: {
        turno: {
          select: {
            id: true,
            nombre: true,
            areaId: true,
            area: {
              select: {
                nombre: true
              }
            }
          }
        }
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' }
      ]
    });
  }

  /**
   * Obtiene un horario por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return await prisma.horario.findUnique({
      where: { id },
      include: {
        turno: {
          select: {
            id: true,
            nombre: true,
            areaId: true,
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
  }

  /**
   * Obtiene horarios por día de la semana
   * @param {string} diaSemana
   * @param {boolean} soloActivos
   * @returns {Promise<Array>}
   */
  async findByDiaSemana(diaSemana, soloActivos = true) {
    const where = { diaSemana };
    if (soloActivos) {
      where.activo = true;
    }

    return await prisma.horario.findMany({
      where,
      include: {
        turno: {
          select: {
            id: true,
            nombre: true,
            area: {
              select: {
                nombre: true
              }
            }
          }
        }
      },
      orderBy: {
        horaInicio: 'asc'
      }
    });
  }

  /**
   * Obtiene horarios por turno
   * @param {number} turnoId
   * @returns {Promise<Array>}
   */
  async findByTurnoId(turnoId) {
    return await prisma.horario.findMany({
      where: { turnoId, activo: true },
      orderBy: { diaSemana: 'asc' }
    });
  }

  /**
   * Obtiene horarios por turno e incluye inactivos
   * @param {number} turnoId
   * @returns {Promise<Array>}
   */
  async findByTurnoIdWithInactive(turnoId) {
    return await prisma.horario.findMany({
      where: { turnoId },
      orderBy: { diaSemana: 'asc' }
    });
  }

  /**
   * Verifica si existe un horario para un turno en un día específico
   * @param {number} turnoId
   * @param {string} diaSemana
   * @returns {Promise<Object|null>}
   */
  async findByTurnoAndDay(turnoId, diaSemana) {
    return await prisma.horario.findFirst({
      where: {
        turnoId,
        diaSemana
      }
    });
  }

  /**
   * Crea un nuevo horario
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    return await prisma.horario.create({
      data,
      include: {
        turno: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
  }

  /**
   * Actualiza un horario
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    return await prisma.horario.update({
      where: { id },
      data,
      include: {
        turno: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
  }

  /**
   * Desactiva un horario
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async deactivate(id) {
    return await prisma.horario.update({
      where: { id },
      data: { activo: false }
    });
  }

  /**
   * Elimina un horario
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async delete(id) {
    return await prisma.horario.delete({
      where: { id }
    });
  }

  /**
   * Obtiene horarios de una semana completa para un turno
   * @param {number} turnoId
   * @returns {Promise<Array>}
   */
  async findHorarioSemanaPorTurno(turnoId) {
    return await prisma.horario.findMany({
      where: { turnoId, activo: true },
      orderBy: { diaSemana: 'asc' }
    });
  }

  /**
   * Obtiene múltiples horarios por IDs
   * @param {number[]} ids
   * @returns {Promise<Array>}
   */
  async findByIds(ids) {
    return await prisma.horario.findMany({
      where: { id: { in: ids } }
    });
  }

  /**
   * Cuenta horarios por turno
   * @param {number} turnoId
   * @returns {Promise<number>}
   */
  async countByTurnoId(turnoId) {
    return await prisma.horario.count({
      where: { turnoId, activo: true }
    });
  }

  /**
   * Obtiene horarios activos por área
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async findByAreaId(areaId) {
    return await prisma.horario.findMany({
      where: {
        turno: {
          areaId
        },
        activo: true
      },
      include: {
        turno: {
          select: {
            id: true,
            nombre: true,
            areaId: true
          }
        }
      }
    });
  }
}