import express from 'express';
import empleadoController from '../controllers/empleadoController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';


const router = express.Router();

// Define routes
router.get('/', requireAuth, empleadoController.getAllEmpleados);
router.post('/', requireAuth, requireRole('ADMIN', 'COORDINADOR'), empleadoController.createEmpleado);
router.get('/:id', requireAuth, empleadoController.getEmpleadoById);
router.put('/:id', requireAuth, requireRole('ADMIN', 'COORDINADOR'), empleadoController.updateEmpleado);
router.put('/:id', requireAuth, requireRole('ADMIN', 'COORDINADOR'), empleadoController.deleteEmpleado);

export default router