import express from 'express';
import { UsuarioController } from '../../modules/auth/controllers/UsuarioController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { requireArea } from '../middleware/areas.js';

const router = express.Router();
const usuarioController = new UsuarioController();

// Admin routes
router.get('/', requireAuth, requireRole('ADMIN'), usuarioController.getAllUsers);
router.post('/', requireAuth, requireRole('ADMIN'), usuarioController.createUser);
router.put('/:id', requireAuth, requireRole('ADMIN'), usuarioController.updateUser);
router.delete('/:id', requireAuth, requireRole('ADMIN'), usuarioController.deactivateUser);
router.put('/:id/asignar-area', requireAuth, requireRole('ADMIN'), usuarioController.assignAreaToUser);

// Coordinator routes
router.get('/area', requireAuth, requireRole('COORDINADOR', requireArea), usuarioController.getUsersByAreaIds);
router.get('/area/:id', requireAuth, requireRole('COORDINADOR', requireArea), usuarioController.getUserByIdWithAreaRestriction);
router.get('/managed-areas', requireAuth, requireRole('COORDINADOR', requireArea), usuarioController.getUserManagedAreas);

export default router;