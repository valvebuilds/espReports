import { AsignacionService } from '../services/AsignacionService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';

/**
 * Controller for Asignacion endpoints
 * Maneja las solicitudes HTTP y delega lógica al service
 */
export class AsignacionController {
  constructor() {
    this.asignacionService = new AsignacionService();
  }

  /**
   * GET /asignaciones
   * Obtiene todas las asignaciones con filtros opcionales
   */
  obtenerTodas = asyncHandler(async (req, res) => {
    const { empleadoId, turnoId, estado, limit = 50, offset = 0 } = req.query;

    const filters = {
      empleadoId: empleadoId ? parseInt(empleadoId) : undefined,
      turnoId: turnoId ? parseInt(turnoId) : undefined,
      estado,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const asignaciones = await this.asignacionService.obtenerTodas(filters);
    sendSuccess(res, asignaciones, 'Asignaciones obtenidas exitosamente');
  });

  /**
   * GET /asignaciones/:id
   * Obtiene una asignación por ID
   */
  obtenerPorId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const asignacion = await this.asignacionService.obtenerPorId(parseInt(id));
    sendSuccess(res, asignacion, 'Asignación obtenida exitosamente');
  });

  /**
   * GET /asignaciones/empleado/:empleadoId
   * Obtiene todas las asignaciones de un empleado
   */
  obtenerPorEmpleado = asyncHandler(async (req, res) => {
    const { empleadoId } = req.params;
    const asignaciones = await this.asignacionService.obtenerPorEmpleado(parseInt(empleadoId));
    sendSuccess(res, asignaciones, 'Asignaciones obtenidas exitosamente');
  });

  /**
   * GET /asignaciones/empleado/:empleadoId/activa
   * Obtiene la asignación activa de un empleado
   */
  obtenerAsignacionActiva = asyncHandler(async (req, res) => {
    const { empleadoId } = req.params;
    const asignacion = await this.asignacionService.obtenerAsignacionActiva(parseInt(empleadoId));
    sendSuccess(res, asignacion, 'Asignación activa obtenida exitosamente');
  });

  /**
   * GET /asignaciones/empleado/:empleadoId/turno-fecha
   * Obtiene el turno asignado a un empleado en una fecha específica
   * Query: ?fecha=2024-10-20
   */
  obtenerTurnoPorFecha = asyncHandler(async (req, res) => {
    const { empleadoId } = req.params;
    const { fecha } = req.query;

    const asignacion = await this.asignacionService.obtenerTurnoPorFecha(
      parseInt(empleadoId),
      new Date(fecha)
    );

    sendSuccess(res, asignacion, 'Turno obtenido para la fecha especificada');
  });

  /**
   * POST /asignaciones
   * Crea una nueva asignación
   * Body: { empleadoId, turnoId, fechaInicio, fechaFin? }
   */
  crear = asyncHandler(async (req, res) => {
    const { empleadoId, turnoId, fechaInicio, fechaFin } = req.body;

    const nuevaAsignacion = await this.asignacionService.crear({
      empleadoId,
      turnoId,
      fechaInicio: new Date(fechaInicio),
      fechaFin: fechaFin ? new Date(fechaFin) : null
    });

    sendSuccess(res, nuevaAsignacion, 'Asignación creada exitosamente', 201);
  });

  /**
   * PUT /asignaciones/:id
   * Actualiza una asignación
   * Body: { turnoId?, fechaInicio?, fechaFin? }
   */
  actualizar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Convertir fechas si existen
    if (data.fechaInicio) {
      data.fechaInicio = new Date(data.fechaInicio);
    }
    if (data.fechaFin !== undefined) {
      data.fechaFin = data.fechaFin ? new Date(data.fechaFin) : null;
    }

    const asignacionActualizada = await this.asignacionService.actualizar(parseInt(id), data);
    sendSuccess(res, asignacionActualizada, 'Asignación actualizada exitosamente');
  });

  /**
   * PATCH /asignaciones/:id/cerrar
   * Cierra una asignación activa
   * Body: { fechaFin? } - Si no se proporciona, usa la fecha actual
   */
  cerrarAsignacion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fechaFin } = req.body;

    const asignacionCerrada = await this.asignacionService.cerrarAsignacion(
      parseInt(id),
      fechaFin ? new Date(fechaFin) : null
    );

    sendSuccess(res, asignacionCerrada, 'Asignación cerrada exitosamente');
  });

  /**
   * DELETE /asignaciones/:id
   * Elimina una asignación
   */
  eliminar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resultado = await this.asignacionService.eliminar(parseInt(id));
    sendSuccess(res, resultado, 'Asignación eliminada exitosamente');
  });

  /**
   * GET /asignaciones/empleado/:empleadoId/historial
   * Obtiene el historial de asignaciones de un empleado
   * Query: ?limit=100
   */
  obtenerHistorial = asyncHandler(async (req, res) => {
    const { empleadoId } = req.params;
    const { limit = 100 } = req.query;

    const historial = await this.asignacionService.obtenerHistorial(
      parseInt(empleadoId),
      parseInt(limit)
    );

    sendSuccess(res, historial, 'Historial de asignaciones obtenido exitosamente');
  });

  /**
   * GET /asignaciones/turno/:turnoId/empleados
   * Cuenta cuántos empleados están asignados a un turno
   */
  contarEmpleadosPorTurno = asyncHandler(async (req, res) => {
    const { turnoId } = req.params;
    const count = await this.asignacionService.contarEmpleadosPorTurno(parseInt(turnoId));

    sendSuccess(res, { turnoId: parseInt(turnoId), empleadosAsignados: count }, 'Recuento obtenido exitosamente');
  });

  /**
   * GET /asignaciones/activas
   * Obtiene todas las asignaciones activas
   */
  obtenerAsignacionesActivas = asyncHandler(async (req, res) => {
    const asignaciones = await this.asignacionService.obtenerAsignacionesActivas();
    sendSuccess(res, asignaciones, 'Asignaciones activas obtenidas exitosamente');
  });

  /**
   * GET /asignaciones/area/:areaId
   * Obtiene asignaciones activas por área
   */
  obtenerPorArea = asyncHandler(async (req, res) => {
    const { areaId } = req.params;
    const asignaciones = await this.asignacionService.obtenerPorArea(parseInt(areaId));
    sendSuccess(res, asignaciones, 'Asignaciones del área obtenidas exitosamente');
  });

  /**
   * GET /asignaciones/empleado/:empleadoId/tiene-activa
   * Verifica si un empleado tiene asignación activa
   */
  tieneAsignacionActiva = asyncHandler(async (req, res) => {
    const { empleadoId } = req.params;
    const tieneActiva = await this.asignacionService.tieneAsignacionActiva(parseInt(empleadoId));

    sendSuccess(res, {
      empleadoId: parseInt(empleadoId),
      tieneAsignacionActiva: tieneActiva
    }, 'Estado de asignación verificado exitosamente');
  });

  /**
   * GET /asignaciones/rango-fechas
   * Obtiene asignaciones en un rango de fechas
   * Query: ?fechaInicio=2024-10-01&fechaFin=2024-10-31
   */
  obtenerPorRangoFechas = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    const asignaciones = await this.asignacionService.obtenerPorRangoFechas(
      new Date(fechaInicio),
      new Date(fechaFin)
    );

    sendSuccess(res, asignaciones, 'Asignaciones obtenidas para el rango especificado');
  });
}