import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { AuthController } from '../../modules/auth/controllers/AuthController.js';

const router = express.Router();
const authController = new AuthController();

router.post('/register', requireAuth, requireRole('ADMIN'), authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verifyToken);
/*
router.get('/profile', requireAuth, authController.getProfile);
router.put('/change-password', requireAuth, authController.changePassword);
router.get('/area', requireAuth, authController.getUserArea);
*/

export default router;