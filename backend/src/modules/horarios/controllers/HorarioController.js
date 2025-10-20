import { HorarioService } from '../services/HorarioService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';

/**
 * Controller for Horario endpoints
 * Maneja las solicitudes HTTP y delega lógica al service
 */
export class HorarioController {
  constructor() {
    this.horarioService = new HorarioService();
  }

  /**
   * GET /horarios
   * Obtiene todos los horarios con filtros opcionales
   */
  obtenerTodos = asyncHandler(async (req, res) => {
    const { soloActivos = true, turnoId, limit = 50, offset = 0 } = req.query;

    const filters = {
      soloActivos: soloActivos === 'true',
      turnoId: turnoId ? parseInt(turnoId) : undefined,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const horarios = await this.horarioService.obtenerTodos(filters);
    sendSuccess(res, horarios, 'Horarios obtenidos exitosamente');
  });

  /**
   * GET /horarios/:id
   * Obtiene un horario por ID
   */
  obtenerPorId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const horario = await this.horarioService.obtenerPorId(parseInt(id));
    sendSuccess(res, horario, 'Horario obtenido exitosamente');
  });

  /**
   * GET /horarios/dia/:diaSemana
   * Obtiene horarios por día de la semana
   */
  obtenerPorDiaSemana = asyncHandler(async (req, res) => {
    const { diaSemana } = req.params;
    const horarios = await this.horarioService.obtenerPorDiaSemana(diaSemana);
    sendSuccess(res, horarios, 'Horarios obtenidos exitosamente');
  });

  /**
   * GET /horarios/turno/:turnoId
   * Obtiene horarios de un turno
   */
  obtenerPorTurno = asyncHandler(async (req, res) => {
    const { turnoId } = req.params;
    const horarios = await this.horarioService.obtenerPorTurno(parseInt(turnoId));
    sendSuccess(res, horarios, 'Horarios obtenidos exitosamente');
  });

  /**
   * GET /horarios/turno/:turnoId/con-inactivos
   * Obtiene horarios de un turno incluyendo inactivos
   */
  obtenerPorTurnoConInactivos = asyncHandler(async (req, res) => {
    const { turnoId } = req.params;
    const horarios = await this.horarioService.obtenerPorTurnoConInactivos(parseInt(turnoId));
    sendSuccess(res, horarios, 'Horarios obtenidos exitosamente');
  });

  /**
   * POST /horarios
   * Crea un nuevo horario
   * Body: { turnoId, diaSemana, horaInicio, horaFin, descansoInicio?, descansoFin? }
   */
  crear = asyncHandler(async (req, res) => {
    const { turnoId, diaSemana, horaInicio, horaFin, descansoInicio, descansoFin } = req.body;

    const nuevoHorario = await this.horarioService.crear({
      turnoId,
      diaSemana,
      horaInicio,
      horaFin,
      descansoInicio,
      descansoFin
    });

    sendSuccess(res, nuevoHorario, 'Horario creado exitosamente', 201);
  });

  /**
   * PUT /horarios/:id
   * Actualiza un horario
   * Body: { diaSemana?, horaInicio?, horaFin?, descansoInicio?, descansoFin?, activo? }
   */
  actualizar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const horarioActualizado = await this.horarioService.actualizar(parseInt(id), data);
    sendSuccess(res, horarioActualizado, 'Horario actualizado exitosamente');
  });

  /**
   * PATCH /horarios/:id/desactivar
   * Desactiva un horario
   */
  desactivar = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const horarioDesactivado = await this.horarioService.desactivar(parseInt(id));
    sendSuccess(res, horarioDesactivado, 'Horario desactivado exitosamente');
  });

  /**
   * DELETE /horarios/:id
   * Elimina un horario
   */
  eliminar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resultado = await this.horarioService.eliminar(parseInt(id));
    sendSuccess(res, resultado, 'Horario eliminado exitosamente');
  });

  /**
   * GET /horarios/turno/:turnoId/semanal
   * Obtiene horarios de la semana completa para un turno
   */
  obtenerHorarioSemanal = asyncHandler(async (req, res) => {
    const { turnoId } = req.params;
    const horarios = await this.horarioService.obtenerHorarioSemanal(parseInt(turnoId));
    sendSuccess(res, horarios, 'Horarios semanales obtenidos exitosamente');
  });

  /**
   * POST /horarios/validar-tiempo
   * Valida si un empleado está dentro de su horario esperado
   * Body: { fecha, horaRegistro, horario }
   */
  validarTiempoTrabajo = asyncHandler(async (req, res) => {
    const { fecha, horaRegistro, horario } = req.body;

    const resultado = await this.horarioService.validarTiempoTrabajo(
      new Date(fecha),
      horaRegistro,
      horario
    );

    sendSuccess(res, resultado, 'Tiempo de trabajo validado exitosamente');
  });
}