import express from 'express';
import { HorarioController } from '../../modules/horarios/controllers/HorarioController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();
const horarioController = new HorarioController();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'), horarioController.getAllSchedules);
router.post('/', requireAuth, requireRole('ADMIN'), horarioController.createSchedule);
router.put('/:id', requireAuth, requireRole('ADMIN'), horarioController.updateSchedule);
router.delete('/:id', requireAuth, requireRole('ADMIN'), horarioController.deleteSchedule);
router.get('/day/:diaSemana', requireAuth, requireRole('ADMIN'), horarioController.getSchedulesByDay);
router.get('/:id/work-hours', requireAuth, requireRole('ADMIN'), horarioController.calculateWorkHours);



export default router;