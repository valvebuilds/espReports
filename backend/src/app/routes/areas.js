import express from 'express';
import areaController from '../../modules/empleados/areaController.js'
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'), areaController.getAllAreas);
router.post('/', requireAuth, requireRole('ADMIN'), areaController.createArea);
router.put('/:id', requireAuth, requireRole('ADMIN'), areaController.updateArea);

export default router