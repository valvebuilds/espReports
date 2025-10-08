import express from 'express';
import compensatorioController from '../controllers/compensatorioController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN', 'COORDINADOR'), compensatorioController.getCompensatorioByArea);
router.post('/', requireAuth, requireRole('ADMIN', 'COORDINADOR'), compensatorioController.createCompensatorio);
router.get('/:id', requireAuth, compensatorioController.getCompensatorioById);
router.put('/:id', requireAuth, requireRole('ADMIN', 'COORDINADOR'), compensatorioController.updateCompensatorio);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'COORDINADOR'), compensatorioController.deleteCompensatorio);

export default router