import express from 'express';
import turnoController from '../controllers/turnoController.js';

const router = express.Router();

// Define routes
router.get('/', turnoController.getAllTurnos);
router.post('/', turnoController.createTurno);
router.put('/:id', turnoController.updateTurno);

export default router