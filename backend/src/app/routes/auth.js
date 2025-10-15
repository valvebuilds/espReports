import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import authController from '../../modules/auth/authController.js';

const router = express.Router();

router.post('/register', requireAuth, requireRole('ADMIN'), authController.register);
router.post('/login', authController.login);

export default router