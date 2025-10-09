import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Registrar usuario (puedes usarlo una sola vez para crear cuentas internas)
router.post('/register', requireAuth, requireRole('ADMIN'), authController.register);

// Login
router.post('/login', authController.login);

export default router