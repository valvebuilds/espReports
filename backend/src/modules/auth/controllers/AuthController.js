import { AuthService } from '../services/AuthService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';

/**
 * Auth Controller - manejo de autenticación HTTP requests
 */
export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req, res) => {
    const { username, password, name, role} = req.body;

    const result = await this.authService.register({
      username,
      password,
      name,
      role
    });

    sendSuccess(res, result, 'Usuario registrado exitosamente', 201);
  });

 
  login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const result = await this.authService.login({
      username,
      password
    });
    sendSuccess(res, result, 'Login exitoso');
  });

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await this.authService.getUserById(userId);
    sendSuccess(res, user, 'Profile retrieved successfully');
  });

  /**
   * Change password
   */
  changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const updatedUser = await this.authService.changePassword(userId, currentPassword, newPassword);
    sendSuccess(res, updatedUser, 'Password changed successfully');
  });

  /**
   * Get user's area (for coordinators)
   */
  getUserArea = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const areaName = await this.authService.getUserArea(userId);
    sendSuccess(res, { areaName }, 'Area retrieved successfully');
  });

  /**
   * Verify token
   */
  verifyToken = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    const user = await this.authService.verifyToken(token);
    sendSuccess(res, user, 'Token verified successfully');
  });
}
