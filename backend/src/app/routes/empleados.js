import express from 'express';
import empleadoController from '../../modules/empleados/empleadoController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { requireArea } from '../middleware/areas.js';


const router = express.Router();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN', 'COORDINADOR'), requireArea, empleadoController.getEmpleados);
router.post('/', requireAuth, requireRole('ADMIN', 'COORDINADOR'), empleadoController.createEmpleado);
router.get('/:id', requireAuth, requireRole ('ADMIN', 'COORDINADOR'), requireArea, empleadoController.getEmpleadoById);

export default router