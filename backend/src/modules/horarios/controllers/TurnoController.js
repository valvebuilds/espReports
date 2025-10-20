import { TurnoService } from '../services/TurnoService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';


export class TurnoController {
  constructor() {
    this.turnoService = new TurnoService();
  }

  obtenerTodos = asyncHandler(async (req, res) => {
    const { activo = true, limit = 50, offset = 0 } = req.query;

    const filters = {
      activo: activo === 'true',
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const turnos = await this.turnoService.obtenerTodos(filters);
    sendSuccess(res, turnos, 'Turnos obtenidos exitosamente');
  });

  obtenerPorId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const turno = await this.turnoService.obtenerPorId(parseInt(id));
    sendSuccess(res, turno, 'Turno obtenido exitosamente');
  });

  obtenerPorArea = asyncHandler(async (req, res) => {
    const { areaId } = req.params;
    const turnos = await this.turnoService.obtenerPorArea(parseInt(areaId));
    sendSuccess(res, turnos, 'Turnos obtenidos exitosamente');
  });

  obtenerPorAreaConInactivos = asyncHandler(async (req, res) => {
    const { areaId } = req.params;
    const turnos = await this.turnoService.obtenerPorAreaConInactivos(parseInt(areaId));
    sendSuccess(res, turnos, 'Turnos obtenidos exitosamente');
  });

  crear = asyncHandler(async (req, res) => {
    const { nombre, areaId } = req.body;

    const nuevoTurno = await this.turnoService.crear({
      nombre,
      areaId
    });

    sendSuccess(res, nuevoTurno, 'Turno creado exitosamente', 201);
  });

  actualizar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const turnoActualizado = await this.turnoService.actualizar(parseInt(id), data);
    sendSuccess(res, turnoActualizado, 'Turno actualizado exitosamente');
  });

  eliminar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resultado = await this.turnoService.eliminar(parseInt(id));
    sendSuccess(res, resultado, 'Turno eliminado exitosamente');
  });

  obtenerTurnosConEmpleados = asyncHandler(async (req, res) => {
    const { areaId } = req.params;
    const turnos = await this.turnoService.obtenerTurnosConEmpleados(parseInt(areaId));
    sendSuccess(res, turnos, 'Turnos con empleados obtenidos exitosamente');
  });

  obtenerActivos = asyncHandler(async (req, res) => {
    const turnos = await this.turnoService.obtenerActivos();
    sendSuccess(res, turnos, 'Turnos activos obtenidos exitosamente');
  });

  obtenerOpcionesParaArea = asyncHandler(async (req, res) => {
    const { areaId } = req.params;
    const opciones = await this.turnoService.obtenerOpcionesParaArea(parseInt(areaId));
    sendSuccess(res, opciones, 'Opciones de turnos obtenidas exitosamente');
  });


  tieneHorarios = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tiene = await this.turnoService.tieneHorarios(parseInt(id));

    sendSuccess(res, {
      turnoId: parseInt(id),
      tieneHorarios: tiene
    }, 'Verificación completada exitosamente');
  });

  tieneEmpleadosAsignados = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tiene = await this.turnoService.tieneEmpleadosAsignados(parseInt(id));

    sendSuccess(res, {
      turnoId: parseInt(id),
      tieneEmpleadosAsignados: tiene
    }, 'Verificación completada exitosamente');
  });

  obtenerResumen = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resumen = await this.turnoService.obtenerResumen(parseInt(id));
    sendSuccess(res, resumen, 'Resumen del turno obtenido exitosamente');
  });
}