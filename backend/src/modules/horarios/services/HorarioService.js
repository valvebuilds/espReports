import { HorarioRepository } from '../repositories/HorarioRepository.js';
import { TurnoRepository } from '../repositories/TurnoRepository.js';
import { ValidationError, NotFoundError } from '../../../core/errors/AppError.js';

/**
 * Service for Horario business logic
 * Encarga de validaciones, cálculos y orquestación de datos
 */
export class HorarioService {
  constructor() {
    this.horarioRepository = new HorarioRepository();
    this.turnoRepository = new TurnoRepository();
  }

  /**
   * Obtiene todos los horarios con filtros opcionales
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async obtenerTodos(filters = {}) {
    return await this.horarioRepository.findAll(filters);
  }

  /**
   * Obtiene un horario por ID
   * @param {number} id
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el ID no es válido
   * @throws {NotFoundError} Si no existe
   */
  async obtenerPorId(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de horario válido');
    }

    const horario = await this.horarioRepository.findById(id);
    if (!horario) {
      throw new NotFoundError(`Horario con ID ${id} no encontrado`);
    }

    return horario;
  }

  /**
   * Obtiene horarios por día de la semana
   * @param {string} diaSemana
   * @returns {Promise<Array>}
   * @throws {ValidationError} Si el día no es válido
   */
  async obtenerPorDiaSemana(diaSemana) {
    const diasValidos = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    
    if (!diaSemana || typeof diaSemana !== 'string' || !diasValidos.includes(diaSemana.toUpperCase())) {
      throw new ValidationError(`El día debe ser uno de: ${diasValidos.join(', ')}`);
    }

    return await this.horarioRepository.findByDiaSemana(diaSemana.toUpperCase());
  }

  /**
   * Obtiene horarios de un turno
   * @param {number} turnoId
   * @returns {Promise<Array>}
   * @throws {ValidationError} Si el turno no es válido
   * @throws {NotFoundError} Si el turno no existe
   */
  async obtenerPorTurno(turnoId) {
    if (!turnoId || typeof turnoId !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    // Verificar que el turno existe
    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${turnoId} no encontrado`);
    }

    return await this.horarioRepository.findByTurnoId(turnoId);
  }

  /**
   * Obtiene horarios de un turno incluyendo inactivos
   * @param {number} turnoId
   * @returns {Promise<Array>}
   */
  async obtenerPorTurnoConInactivos(turnoId) {
    if (!turnoId || typeof turnoId !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${turnoId} no encontrado`);
    }

    return await this.horarioRepository.findByTurnoIdWithInactive(turnoId);
  }

  /**
   * Crea un nuevo horario con validaciones completas
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {NotFoundError} Si el turno no existe
   */
  async crear(data) {
    const { turnoId, diaSemana, horaInicio, horaFin, descansoInicio, descansoFin } = data;
    const diasValidos = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

    // Validar turnoId
    if (!turnoId || typeof turnoId !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    // Validar que el turno existe
    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${turnoId} no encontrado`);
    }

    // Validar diaSemana
    if (!diaSemana || typeof diaSemana !== 'string' || !diasValidos.includes(diaSemana.toUpperCase())) {
      throw new ValidationError(`El día debe ser uno de: ${diasValidos.join(', ')}`);
    }

    // Validar horas
    if (!horaInicio || !horaFin) {
      throw new ValidationError('Las horas de inicio y fin son obligatorias');
    }

    // Parsear y validar horas
    const horaInicioDate = this._parseTime(horaInicio);
    const horaFinDate = this._parseTime(horaFin);

    if (horaInicioDate >= horaFinDate) {
      throw new ValidationError('La hora de fin debe ser posterior a la hora de inicio');
    }

    // Validar descanso si se proporciona
    let descansoInicioDate = null;
    let descansoFinDate = null;
    let minutosDescanso = 0;

    if (descansoInicio && descansoFin) {
      descansoInicioDate = this._parseTime(descansoInicio);
      descansoFinDate = this._parseTime(descansoFin);

      if (descansoInicioDate >= descansoFinDate) {
        throw new ValidationError('La hora fin del descanso debe ser posterior a la hora inicio');
      }

      if (descansoInicioDate < horaInicioDate || descansoFinDate > horaFinDate) {
        throw new ValidationError('El descanso debe estar dentro del horario de trabajo');
      }

      minutosDescanso = Math.round((descansoFinDate - descansoInicioDate) / (1000 * 60));
    }

    // Calcular minutos laborales
    const minutosLaborales = Math.round(
      ((horaFinDate - horaInicioDate) / (1000 * 60)) - minutosDescanso
    );

    // Verificar duplicado
    const horarioExistente = await this.horarioRepository.findByTurnoAndDay(turnoId, diaSemana.toUpperCase());
    if (horarioExistente) {
      throw new ValidationError(`Ya existe un horario para este turno el día ${diaSemana}`);
    }

    // Crear horario
    return await this.horarioRepository.create({
      turnoId,
      diaSemana: diaSemana.toUpperCase(),
      horaInicio: horaInicioDate,
      horaFin: horaFinDate,
      descansoInicio: descansoInicioDate,
      descansoFin: descansoFinDate,
      minutosDescanso,
      minutosLaborales,
      activo: true
    });
  }

  /**
   * Actualiza un horario con validaciones
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {NotFoundError} Si no existe el horario
   */
  async actualizar(id, data) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de horario válido');
    }

    // Verificar que existe
    const horarioExistente = await this.horarioRepository.findById(id);
    if (!horarioExistente) {
      throw new NotFoundError(`Horario con ID ${id} no encontrado`);
    }

    const dataToUpdate = {};
    const diasValidos = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

    // Validar y actualizar diaSemana
    if (data.diaSemana !== undefined) {
      if (typeof data.diaSemana !== 'string' || !diasValidos.includes(data.diaSemana.toUpperCase())) {
        throw new ValidationError(`El día debe ser uno de: ${diasValidos.join(', ')}`);
      }
      dataToUpdate.diaSemana = data.diaSemana.toUpperCase();
    }

    // Validar y actualizar horas
    if (data.horaInicio !== undefined) {
      dataToUpdate.horaInicio = this._parseTime(data.horaInicio);
    }

    if (data.horaFin !== undefined) {
      dataToUpdate.horaFin = this._parseTime(data.horaFin);
    }

    // Validar coherencia de horas si se modifican
    if (dataToUpdate.horaInicio || dataToUpdate.horaFin) {
      const horaInicio = dataToUpdate.horaInicio || horarioExistente.horaInicio;
      const horaFin = dataToUpdate.horaFin || horarioExistente.horaFin;

      if (horaInicio >= horaFin) {
        throw new ValidationError('La hora de fin debe ser posterior a la hora de inicio');
      }
    }

    // Validar y actualizar descanso
    if (data.descansoInicio !== undefined) {
      dataToUpdate.descansoInicio = data.descansoInicio ? this._parseTime(data.descansoInicio) : null;
    }

    if (data.descansoFin !== undefined) {
      dataToUpdate.descansoFin = data.descansoFin ? this._parseTime(data.descansoFin) : null;
    }

    // Recalcular minutos si cambió algo relacionado
    if (dataToUpdate.horaInicio || dataToUpdate.horaFin || dataToUpdate.descansoInicio || dataToUpdate.descansoFin) {
      const horaInicio = dataToUpdate.horaInicio || horarioExistente.horaInicio;
      const horaFin = dataToUpdate.horaFin || horarioExistente.horaFin;
      const descansoInicio = dataToUpdate.descansoInicio !== undefined ? dataToUpdate.descansoInicio : horarioExistente.descansoInicio;
      const descansoFin = dataToUpdate.descansoFin !== undefined ? dataToUpdate.descansoFin : horarioExistente.descansoFin;

      // Validar coherencia
      if (horaInicio >= horaFin) {
        throw new ValidationError('La hora de fin debe ser posterior a la hora de inicio');
      }

      if (descansoInicio && descansoFin) {
        if (descansoInicio >= descansoFin) {
          throw new ValidationError('La hora fin del descanso debe ser posterior a la hora inicio');
        }
        if (descansoInicio < horaInicio || descansoFin > horaFin) {
          throw new ValidationError('El descanso debe estar dentro del horario de trabajo');
        }

        dataToUpdate.minutosDescanso = Math.round((descansoFin - descansoInicio) / (1000 * 60));
      } else {
        dataToUpdate.minutosDescanso = 0;
      }

      dataToUpdate.minutosLaborales = Math.round(
        ((horaFin - horaInicio) / (1000 * 60)) - (dataToUpdate.minutosDescanso || 0)
      );
    }

    // Validar estado
    if (data.activo !== undefined && typeof data.activo !== 'boolean') {
      throw new ValidationError('El estado activo debe ser booleano');
    }

    if (data.activo !== undefined) {
      dataToUpdate.activo = data.activo;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new ValidationError('No hay datos para actualizar');
    }

    return await this.horarioRepository.update(id, dataToUpdate);
  }

  /**
   * Desactiva un horario
   * @param {number} id
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el ID no es válido
   * @throws {NotFoundError} Si no existe
   */
  async desactivar(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de horario válido');
    }

    const horario = await this.horarioRepository.findById(id);
    if (!horario) {
      throw new NotFoundError(`Horario con ID ${id} no encontrado`);
    }

    return await this.horarioRepository.deactivate(id);
  }

  /**
   * Elimina un horario
   * @param {number} id
   * @returns {Promise<Object>}
   * @throws {ValidationError} Si el ID no es válido
   * @throws {NotFoundError} Si no existe
   */
  async eliminar(id) {
    if (!id || typeof id !== 'number') {
      throw new ValidationError('Se requiere un ID de horario válido');
    }

    const horario = await this.horarioRepository.findById(id);
    if (!horario) {
      throw new NotFoundError(`Horario con ID ${id} no encontrado`);
    }

    await this.horarioRepository.delete(id);
    
    return {
      mensaje: 'Horario eliminado correctamente',
      id
    };
  }

  /**
   * Obtiene horarios de la semana completa para un turno
   * @param {number} turnoId
   * @returns {Promise<Array>}
   */
  async obtenerHorarioSemanal(turnoId) {
    if (!turnoId || typeof turnoId !== 'number') {
      throw new ValidationError('Se requiere un ID de turno válido');
    }

    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError(`Turno con ID ${turnoId} no encontrado`);
    }

    return await this.horarioRepository.findHorarioSemanaPorTurno(turnoId);
  }

  /**
   * Valida si un empleado está dentro de su horario esperado
   * @param {Date} fecha
   * @param {string} horaRegistro - En formato HH:mm
   * @param {Object} horario
   * @returns {Object}
   */
  async validarTiempoTrabajo(fecha, horaRegistro, horario) {
    if (!fecha || !horaRegistro || !horario) {
      throw new ValidationError('Fecha, hora de registro y horario son requeridos');
    }

    if (!(fecha instanceof Date)) {
      throw new ValidationError('La fecha debe ser un objeto Date válido');
    }

    try {
      const horaRegistroDate = this._parseTime(horaRegistro);
      
      return {
        valido: true,
        horarioAsignado: horario,
        horaRegistro: horaRegistroDate
      };
    } catch (error) {
      throw new ValidationError(`Hora de registro inválida: ${error.message}`);
    }
  }

  /**
   * Utilidad privada para parsear tiempo
   * @private
   */
  _parseTime(time) {
    if (time instanceof Date) {
      return time;
    }

    if (typeof time === 'string') {
      // Formato HH:mm
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        throw new ValidationError('Formato de hora inválido. Use HH:mm');
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    throw new ValidationError('La hora debe ser un string en formato HH:mm o Date');
  }
}