import { TurnoRepository } from '../repositories/TurnoRepository.js';
import { AreaRepository } from '../repositories/AreaRepository.js';
import { ValidationError, NotFoundError } from '../../../core/errors/AppError.js';

/**
 * Service for Turno business logic
 * Encargada de validaciones, cálculos y orquestación de datos
 */
export class TurnoService {
  constructor() {
    this.turnoRepository = new TurnoRepository();
    this.areaRepository = new AreaRepository();
  }

  /**
   * Obtiene todos los turnos con filtros opcionales
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async obtenerTodos(filters = {}) {
    return await this.turnoRepository.findAll(filters);
  }

  /**
   * Obtiene un turno por ID
   * @param {number} id
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el ID no es válido
   * @throws {NotFoundError} Si no existe
   */
  async obtenerPorId(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${id} no encontrado`);
    }

    return turno;
  }

  /**
   * Obtiene turnos por área
   * @param {number} areaId
   * @returns {Promise<Array>}
   * @throws {ValidationError} Si el areaId no es válido
   * @throws {NotFoundError} Si el área no existe
   */
  async obtenerPorArea(areaId) {
    if (!areaId || typeof areaId !== 'number') {
      throw new ValidationError('Se requiere un ID de área válido');
    }

    // Verificar que el área existe
    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new NotFoundError(`Área con ID ${areaId} no encontrada`);
    }

    return await this.turnoRepository.findByAreaId(areaId);
  }

  /**
   * Obtiene turnos por área incluyendo inactivos
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async obtenerPorAreaConInactivos(areaId) {
    if (!areaId || typeof areaId !== 'number') {
      throw new ValidationError('Se requiere un ID de área válido');
    }

    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new NotFoundError(`Área con ID ${areaId} no encontrada`);
    }

    return await this.turnoRepository.findByAreaIdWithInactive(areaId);
  }

  /**
   * Crea un nuevo turno
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {NotFoundError} Si el área no existe
   */
  async crear(data) {
    const { nombre, areaId } = data;

    // Validar nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      throw new ValidationError('El nombre del turno es obligatorio y debe ser un texto válido');
    }

    // Validar areaId
    if (!areaId || typeof areaId !== 'number') {
      throw new ValidationError('El ID del área es obligatorio');
    }

    // Verificar que el área existe
    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new NotFoundError(`Área con ID ${areaId} no encontrada`);
    }

    // Verificar que no existe un turno con el mismo nombre en la misma área
    const turnoExistente = await this.turnoRepository.findByNombreAndArea(nombre.trim(), areaId);
    if (turnoExistente) {
      throw new ValidationError(`Ya existe un turno con el nombre "${nombre}" en esta área`);
    }

    return await this.turnoRepository.create({
      nombre: nombre.trim(),
      areaId,
      activo: true
    });
  }

  /**
   * Actualiza un turno
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {NotFoundError} Si no existe
   */
  async actualizar(id, data) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    // Verificar que el turno existe
    const turnoExistente = await this.turnoRepository.findById(id);
    if (!turnoExistente) {
      throw new NotFoundError(`Turno con ID ${id} no encontrado`);
    }

    const dataToUpdate = {};

    // Validar nombre si se proporciona
    if (data.nombre !== undefined) {
      if (typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
        throw new ValidationError('El nombre debe ser un texto válido');
      }

      // Verificar unicidad con el nuevo nombre
      const turnoConNombre = await this.turnoRepository.findByNombreAndArea(
        data.nombre.trim(),
        data.areaId || turnoExistente.areaId,
        id
      );

      if (turnoConNombre) {
        throw new ValidationError(`Ya existe un turno con el nombre "${data.nombre}"`);
      }

      dataToUpdate.nombre = data.nombre.trim();
    }

    // Validar areaId si se proporciona
    if (data.areaId !== undefined) {
      if (typeof data.areaId !== 'number') {
        throw new ValidationError('El ID del área debe ser un número válido');
      }

      // Verificar que el área existe
      const area = await this.areaRepository.findById(data.areaId);
      if (!area) {
        throw new NotFoundError(`Área con ID ${data.areaId} no encontrada`);
      }

      dataToUpdate.areaId = data.areaId;
    }

    // Validar activo si se proporciona
    if (data.activo !== undefined) {
      if (typeof data.activo !== 'boolean') {
        throw new ValidationError('El estado debe ser un booleano');
      }

      // Si se intenta inactivar, verificar que no hay asignaciones activas
      if (!data.activo) {
        const countAsignaciones = await this.turnoRepository.countAsignaciones(id);
        if (countAsignaciones > 0) {
          throw new ValidationError(
            `No se puede inactivar el turno. Hay ${countAsignaciones} empleado(s) asignado(s) activamente`
          );
        }
      }

      dataToUpdate.activo = data.activo;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new ValidationError('No hay datos para actualizar');
    }

    return await this.turnoRepository.update(id, dataToUpdate);
  }

  /**
   * Elimina un turno
   * @param {number} id
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el ID no es válido
   * @throws {NotFoundError} Si no existe
   * @throws {ValidationError} Si hay asignaciones activas
   */
  async eliminar(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    // Verificar que existe
    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${id} no encontrado`);
    }

    // No permitir eliminar si hay asignaciones activas
    const asignacionesActivas = await this.turnoRepository.countAsignaciones(id);
    if (asignacionesActivas > 0) {
      throw new ValidationError(
        `No se puede eliminar el turno. Hay ${asignacionesActivas} empleado(s) asignado(s)`
      );
    }

    await this.turnoRepository.delete(id);

    return {
      mensaje: 'Turno eliminado correctamente',
      id
    };
  }

  /**
   * Obtiene turnos con sus empleados asignados
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async obtenerTurnosConEmpleados(areaId) {
    if (!areaId || typeof areaId !== 'number') {
      throw new ValidationError('Se requiere un ID de área válido');
    }

    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new NotFoundError(`Área con ID ${areaId} no encontrada`);
    }

    return await this.turnoRepository.findWithEmpleados(areaId);
  }

  /**
   * Obtiene todos los turnos activos
   * @returns {Promise<Array>}
   */
  async obtenerActivos() {
    return await this.turnoRepository.findAllActive();
  }

  /**
   * Obtiene turnos activos por área para selectores/dropdowns
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async obtenerOpcionesParaArea(areaId) {
    if (!areaId || typeof areaId !== 'number') {
      throw new ValidationError('Se requiere un ID de área válido');
    }

    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new NotFoundError(`Área con ID ${areaId} no encontrada`);
    }

    const turnos = await this.turnoRepository.findByAreaId(areaId);
    
    return turnos.map(turno => ({
      id: turno.id,
      nombre: turno.nombre,
      empleadosAsignados: turno._count.asignaciones,
      horarios: turno.horarios.length
    }));
  }

  /**
   * Verifica si un turno tiene horarios configurados
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async tieneHorarios(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${id} no encontrado`);
    }

    return turno.horarios.length > 0;
  }

  /**
   * Verifica si un turno tiene empleados asignados
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async tieneEmpleadosAsignados(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    const countAsignaciones = await this.turnoRepository.countAsignaciones(id);
    return countAsignaciones > 0;
  }

  /**
   * Obtiene resumen de un turno
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async obtenerResumen(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${id} no encontrado`);
    }

    return {
      id: turno.id,
      nombre: turno.nombre,
      area: turno.area.nombre,
      estado: turno.activo ? 'Activo' : 'Inactivo',
      horariosConfigurados: turno._count.horarios,
      empleadosAsignados: turno._count.asignaciones,
      diasConHorario: turno.horarios.map(h => h.diaSemana)
    };
  }
}