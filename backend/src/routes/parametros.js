import express from 'express';
import parametroController from '../controllers/parametroController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'), parametroController.getAllParametros);
router.post('/', requireAuth, requireRole('ADMIN'), parametroController.createParametro);

export default router