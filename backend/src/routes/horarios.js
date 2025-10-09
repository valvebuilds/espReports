import express from 'express';
import horarioController from '../controllers/horarioController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'), horarioController.getAllHorarios);
router.post('/', requireAuth, requireRole('ADMIN'), horarioController.createHorario);
router.put('/:id', requireAuth, requireRole('ADMIN'), horarioController.updateHorario);
router.get('/:turnoId', requireAuth, horarioController.getHorarioByTurno);

export default router