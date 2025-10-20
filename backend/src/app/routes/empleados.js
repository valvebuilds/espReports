import express from 'express';
import { EmpleadoController } from '../../modules/empleados/controllers/EmpleadoController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { requireArea } from '../middleware/areas.js';

const router = express.Router();
const empleadoController = new EmpleadoController();

// Admin routes
router.get('/', requireAuth, requireRole('ADMIN'), empleadoController.getAllEmployees);
router.post('/', requireAuth, requireRole('ADMIN'), empleadoController.createEmployee);
router.put('/:id', requireAuth, requireRole('ADMIN'), empleadoController.updateEmployee);
router.delete('/:id', requireAuth, requireRole('ADMIN'), empleadoController.deactivateEmployee);
router.get('/cedula/:cedula', requireAuth, requireRole('ADMIN'), empleadoController.getEmployeeByCedula);

// Coordinator routes
router.get('/area', requireAuth, requireRole('COORDINADOR'), requireArea, empleadoController.getEmployeesByAreaIds);
router.get('/area/:id', requireAuth, requireRole('COORDINADOR'), requireArea, empleadoController.getEmployeeByIdWithAreaRestriction);

export default router;