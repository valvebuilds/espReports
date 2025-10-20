import { AsignacionRepository } from '../repositories/AsignacionRepository.js';
import { EmpleadoRepository } from '../repositories/EmpleadoRepository.js';
import { TurnoRepository } from '../repositories/TurnoRepository.js';
import { ValidationError, NotFoundError } from '../../../core/errors/AppError.js';

/**
 * Service for Asignacion business logic
 * Encargada de validaciones, orquestación y lógica de negocio
 */
export class AsignacionService {
  constructor() {
    this.asignacionRepository = new AsignacionRepository();
    this.empleadoRepository = new EmpleadoRepository();
    this.turnoRepository = new TurnoRepository();
  }

  /**
   * Obtiene todas las asignaciones con filtros opcionales
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async obtenerTodas(filters = {}) {
    return await this.asignacionRepository.findAll(filters);
  }

  /**
   * Obtiene una asignación por ID
   * @param {number} id
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el ID no es válido
   * @throws {NotFoundError} Si no existe
   */
  async obtenerPorId(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de asignación válido');
    }

    const asignacion = await this.asignacionRepository.findById(id);
    if (!asignacion) {
      throw new NotFoundError(`Asignación con ID ${id} no encontrada`);
    }

    return asignacion;
  }

  /**
   * Obtiene todas las asignaciones de un empleado
   * @param {number} empleadoId
   * @returns {Promise<Array>}
   * @throws {ValidationError} Si el empleadoId no es válido
   * @throws {NotFoundError} Si el empleado no existe
   */
  async obtenerPorEmpleado(empleadoId) {
    if (!empleadoId || typeof empleadoId !== 'number') {
      throw new ValidationError('Se requiere un ID de empleado válido');
    }

    // Verificar que el empleado existe
    const empleado = await this.empleadoRepository.findById(empleadoId);
    if (!empleado) {
      throw new NotFoundError(`Empleado con ID ${empleadoId} no encontrado`);
    }

    return await this.asignacionRepository.findByEmpleadoId(empleadoId);
  }

  /**
   * Obtiene la asignación activa de un empleado
   * @param {number} empleadoId
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el empleadoId no es válido
   * @throws {NotFoundError} Si no hay asignación activa
   */
  async obtenerAsignacionActiva(empleadoId) {
    if (!empleadoId || typeof empleadoId !== 'number') {
      throw new ValidationError('Se requiere un ID de empleado válido');
    }

    const asignacion = await this.asignacionRepository.findActiveByEmpleadoId(empleadoId);
    if (!asignacion) {
      throw new NotFoundError(`No existe asignación activa para el empleado ${empleadoId}`);
    }

    return asignacion;
  }

  /**
   * Obtiene el turno asignado a un empleado en una fecha específica
   * @param {number} empleadoId
   * @param {Date} fecha
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los parámetros no son válidos
   * @throws {NotFoundError} Si no existe asignación
   */
  async obtenerTurnoPorFecha(empleadoId, fecha) {
    if (!empleadoId || typeof empleadoId !== 'number') {
      throw new ValidationError('Se requiere un ID de empleado válido');
    }

    if (!(fecha instanceof Date)) {
      throw new ValidationError('La fecha debe ser un objeto Date válido');
    }

    const asignacion = await this.asignacionRepository.findByEmpleadoAndDate(empleadoId, fecha);
    if (!asignacion) {
      throw new NotFoundError(
        `No existe asignación activa para el empleado ${empleadoId} en la fecha ${fecha.toISOString().split('T')[0]}`
      );
    }

    return asignacion;
  }

  /**
   * Crea una nueva asignación
   * Cierra automáticamente la asignación anterior si existe
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {NotFoundError} Si empleado o turno no existen
   */
  async crear(data) {
    const { empleadoId, turnoId, fechaInicio, fechaFin } = data;

    // Validar empleadoId
    if (!empleadoId || typeof empleadoId !== 'number') {
      throw new ValidationError('Se requiere un ID de empleado válido');
    }

    // Validar turnoId
    if (!turnoId || typeof turnoId !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    // Validar fechaInicio
    if (!fechaInicio || !(fechaInicio instanceof Date)) {
      throw new ValidationError('Se requiere una fecha de inicio válida');
    }

    // Validar que empleado existe
    const empleado = await this.empleadoRepository.findById(empleadoId);
    if (!empleado) {
      throw new NotFoundError(`Empleado con ID ${empleadoId} no encontrado`);
    }

    // Validar que turno existe
    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${turnoId} no encontrado`);
    }

    // Validar que el empleado no esté actualmente asignado al mismo turno
    const asignacionActiva = await this.asignacionRepository.findActiveByEmpleadoId(empleadoId);
    if (asignacionActiva && asignacionActiva.turnoId === turnoId) {
      throw new ValidationError(`El empleado ya está asignado a este turno`);
    }

    // Validar fechaFin si se proporciona
    if (fechaFin) {
      if (!(fechaFin instanceof Date)) {
        throw new ValidationError('La fecha de fin debe ser un objeto Date válido');
      }

      if (fechaFin <= fechaInicio) {
        throw new ValidationError('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    // Si hay asignación activa anterior, cerrarla
    if (asignacionActiva) {
      // Usar el día anterior a la nueva asignación
      const diaAnterior = new Date(fechaInicio);
      diaAnterior.setDate(diaAnterior.getDate() - 1);

      await this.asignacionRepository.update(asignacionActiva.id, {
        fechaFin: diaAnterior
      });
    }

    // Crear nueva asignación
    const nuevaAsignacion = await this.asignacionRepository.create({
      empleadoId,
      turnoId,
      fechaInicio,
      fechaFin: fechaFin || null
    });

    return nuevaAsignacion;
  }

  /**
   * Actualiza una asignación
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {NotFoundError} Si la asignación no existe
   */
  async actualizar(id, data) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de asignación válido');
    }

    // Verificar que existe
    const asignacionExistente = await this.asignacionRepository.findById(id);
    if (!asignacionExistente) {
      throw new NotFoundError(`Asignación con ID ${id} no encontrada`);
    }

    const dataToUpdate = {};

    // Validar turnoId si se proporciona
    if (data.turnoId !== undefined) {
      if (typeof data.turnoId !== 'number') {
        throw new ValidationError('El ID del turno debe ser un número válido');
      }

      const turno = await this.turnoRepository.findById(data.turnoId);
      if (!turno) {
        throw new NotFoundError(`Turno con ID ${data.turnoId} no encontrado`);
      }

      dataToUpdate.turnoId = data.turnoId;
    }

    // Validar fechaInicio si se proporciona
    if (data.fechaInicio !== undefined) {
      if (!(data.fechaInicio instanceof Date)) {
        throw new ValidationError('La fecha de inicio debe ser un objeto Date válido');
      }

      dataToUpdate.fechaInicio = data.fechaInicio;
    }

    // Validar fechaFin si se proporciona
    if (data.fechaFin !== undefined) {
      if (data.fechaFin !== null && !(data.fechaFin instanceof Date)) {
        throw new ValidationError('La fecha de fin debe ser un objeto Date válido o null');
      }

      if (data.fechaFin) {
        const fechaInicio = data.fechaInicio || asignacionExistente.fechaInicio;
        if (data.fechaFin <= fechaInicio) {
          throw new ValidationError('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }

      dataToUpdate.fechaFin = data.fechaFin;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new ValidationError('No hay datos para actualizar');
    }

    return await this.asignacionRepository.update(id, dataToUpdate);
  }

  /**
   * Cierra una asignación activa (establece fechaFin)
   * @param {number} id
   * @param {Date} fechaFin
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {NotFoundError} Si la asignación no existe
   */
  async cerrarAsignacion(id, fechaFin = null) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de asignación válido');
    }

    const asignacion = await this.asignacionRepository.findById(id);
    if (!asignacion) {
      throw new NotFoundError(`Asignación con ID ${id} no encontrada`);
    }

    if (!asignacion.fechaFin) {
      throw new ValidationError('La asignación ya está cerrada');
    }

    const fechaFinActual = fechaFin || new Date();

    if (fechaFinActual <= asignacion.fechaInicio) {
      throw new ValidationError('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    return await this.asignacionRepository.update(id, {
      fechaFin: fechaFinActual
    });
  }

  /**
   * Elimina una asignación
   * @param {number} id
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el ID no es válido
   * @throws {NotFoundError} Si no existe
   */
  async eliminar(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de asignación válido');
    }

    const asignacion = await this.asignacionRepository.findById(id);
    if (!asignacion) {
      throw new NotFoundError(`Asignación con ID ${id} no encontrada`);
    }

    await this.asignacionRepository.delete(id);

    return {
      mensaje: 'Asignación eliminada correctamente',
      id
    };
  }

  /**
   * Obtiene el historial de asignaciones de un empleado
   * @param {number} empleadoId
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async obtenerHistorial(empleadoId, limit = 100) {
    if (!empleadoId || typeof empleadoId !== 'number') {
      throw new ValidationError('Se requiere un ID de empleado válido');
    }

    const empleado = await this.empleadoRepository.findById(empleadoId);
    if (!empleado) {
      throw new NotFoundError(`Empleado con ID ${empleadoId} no encontrado`);
    }

    return await this.asignacionRepository.findHistorialByEmpleadoId(empleadoId, limit);
  }

  /**
   * Cuenta cuántos empleados están asignados a un turno
   * @param {number} turnoId
   * @returns {Promise<number>}
   */
  async contarEmpleadosPorTurno(turnoId) {
    if (!turnoId || typeof turnoId !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    return await this.asignacionRepository.countByTurnoId(turnoId);
  }

  /**
   * Obtiene todas las asignaciones activas
   * @returns {Promise<Array>}
   */
  async obtenerAsignacionesActivas() {
    return await this.asignacionRepository.findAllActive();
  }

  /**
   * Obtiene asignaciones activas por área
   * @param {number} areaId
   * @returns {Promise<Array>}
   */
  async obtenerPorArea(areaId) {
    if (!areaId || typeof areaId !== 'number') {
      throw new ValidationError('Se requiere un ID de área válido');
    }

    return await this.asignacionRepository.findActiveByAreaId(areaId);
  }

  /**
   * Verifica si un empleado tiene asignación activa
   * @param {number} empleadoId
   * @returns {Promise<boolean>}
   */
  async tieneAsignacionActiva(empleadoId) {
    if (!empleadoId || typeof empleadoId !== 'number') {
      throw new ValidationError('Se requiere un ID de empleado válido');
    }

    return await this.asignacionRepository.existsActiveAssignment(empleadoId);
  }

  /**
   * Obtiene asignaciones en un rango de fechas
   * @param {Date} fechaInicio
   * @param {Date} fechaFin
   * @returns {Promise<Array>}
   */
  async obtenerPorRangoFechas(fechaInicio, fechaFin) {
    if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
      throw new ValidationError('Las fechas deben ser objetos Date válidos');
    }

    if (fechaFin <= fechaInicio) {
      throw new ValidationError('La fecha fin debe ser posterior a la fecha inicio');
    }

    return await this.asignacionRepository.findByDateRange(fechaInicio, fechaFin);
  }
}