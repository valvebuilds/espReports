import express from 'express';
import registroController from '../controllers/registroController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'),registroController.getAllRegistros);
router.post('/', requireAuth, requireRole('ADMIN', 'COORDINADOR'),registroController.createRegistro);
router.get('/:id', registroController.getRegistroById);
router.put('/:id', registroController.updateRegistro);
router.delete('/:id', registroController.deleteRegistro);

export default router