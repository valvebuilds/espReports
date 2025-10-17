import express from 'express';
import usuarioController from '../../modules/auth/users/usuarioController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'), usuarioController.getAllUsuarios);
router.post('/', requireAuth, requireRole('ADMIN'), usuarioController.createUsuario);
router.put('/:id', requireAuth, requireRole('ADMIN'), usuarioController.updateUsuario);
router.delete('/:id', requireAuth, requireRole('ADMIN'), usuarioController.deleteUsuario);

router.put('/:id/asignar-area', requireAuth, requireRole('ADMIN'), usuarioController.asignarAreaAUsuario);

export default router