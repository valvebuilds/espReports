import express from 'express';
import turnoController from '../controllers/turnoController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Define routes
router.get('/', requireAuth,  requireRole('ADMIN'), turnoController.getAllTurnos);
router.post('/', requireAuth,  requireRole('ADMIN'), turnoController.createTurno);
router.put('/:id', requireAuth,  requireRole('ADMIN'), turnoController.updateTurno);

export default router