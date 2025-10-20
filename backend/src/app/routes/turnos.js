import express from 'express';
import { TurnoController } from '../controllers/TurnoController.js';
import { AsignacionController } from '../controllers/AsignacionController.js';
import { requireAuth, requireRole } from '../../../middlewares/auth.js';

const turnosRouter = express.Router();
const asignacionesRouter = express.Router();

const turnoController = new TurnoController();
const asignacionController = new AsignacionController();

// ============================================
// TURNOS ROUTES
// ============================================

turnosRouter.get(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.obtenerTodos(req, res, next)
);

turnosRouter.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.crear(req, res, next)
);

turnosRouter.get(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.obtenerPorId(req, res, next)
);

turnosRouter.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.actualizar(req, res, next)
);

turnosRouter.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.eliminar(req, res, next)
);

turnosRouter.get(
  '/area/:areaId',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.obtenerPorArea(req, res, next)
);

turnosRouter.get(
  '/area/:areaId/con-inactivos',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.obtenerPorAreaConInactivos(req, res, next)
);

turnosRouter.get(
  '/area/:areaId/con-empleados',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.obtenerTurnosConEmpleados(req, res, next)
);

turnosRouter.get(
  '/area/:areaId/opciones',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => turnoController.obtenerOpcionesParaArea(req, res, next)
);

turnosRouter.get(
  '/activos',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => turnoController.obtenerActivos(req, res, next)
);

turnosRouter.get(
  '/:id/tiene-horarios',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.tieneHorarios(req, res, next)
);

turnosRouter.get(
  '/:id/tiene-empleados',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => turnoController.tieneEmpleadosAsignados(req, res, next)
);

turnosRouter.get(
  '/:id/resumen',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => turnoController.obtenerResumen(req, res, next)
);

// ============================================
// ASIGNACIONES ROUTES
// ============================================

asignacionesRouter.get(
  '/',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.obtenerTodas(req, res, next)
);

asignacionesRouter.post(
  '/',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.crear(req, res, next)
);

asignacionesRouter.get(
  '/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.obtenerPorId(req, res, next)
);

asignacionesRouter.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.actualizar(req, res, next)
);

asignacionesRouter.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => asignacionController.eliminar(req, res, next)
);

asignacionesRouter.get(
  '/empleado/:empleadoId',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.obtenerPorEmpleado(req, res, next)
);

asignacionesRouter.get(
  '/empleado/:empleadoId/activa',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR', 'EMPLEADO'),
  (req, res, next) => asignacionController.obtenerAsignacionActiva(req, res, next)
);

asignacionesRouter.get(
  '/empleado/:empleadoId/turno-fecha',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR', 'EMPLEADO'),
  (req, res, next) => asignacionController.obtenerTurnoPorFecha(req, res, next)
);

asignacionesRouter.get(
  '/empleado/:empleadoId/historial',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.obtenerHistorial(req, res, next)
);

asignacionesRouter.get(
  '/empleado/:empleadoId/tiene-activa',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.tieneAsignacionActiva(req, res, next)
);

asignacionesRouter.patch(
  '/:id/cerrar',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.cerrarAsignacion(req, res, next)
);

asignacionesRouter.get(
  '/activas',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.obtenerAsignacionesActivas(req, res, next)
);

asignacionesRouter.get(
  '/area/:areaId',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.obtenerPorArea(req, res, next)
);

asignacionesRouter.get(
  '/turno/:turnoId/empleados',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.contarEmpleadosPorTurno(req, res, next)
);

asignacionesRouter.get(
  '/rango-fechas',
  requireAuth,
  requireRole('ADMIN', 'SUPERVISOR'),
  (req, res, next) => asignacionController.obtenerPorRangoFechas(req, res, next)
);

export { turnosRouter, asignacionesRouter };