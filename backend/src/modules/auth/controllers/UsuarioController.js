import { UsuarioService } from '../services/UsuarioService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';

/**
 * Usuario Controller - maneja requests http relacionadas con la gestión de usuarios
 */
export class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  /**
   * (Admin only)
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await this.usuarioService.getAllUsers();
    sendSuccess(res, users, 'Usuarios obtenidos exitosamente');
  });

  /**
   * Get users by area IDs (for coordinators)
   */
  getUsersByAreaIds = asyncHandler(async (req, res) => {
    const areaIds = req.user.areas || [];
    
    const users = await this.usuarioService.getUsersByAreaIds(areaIds);
    sendSuccess(res, users, 'Users retrieved successfully');
  });

  /**
   * Get user by ID (Admin access)
   */
  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await this.usuarioService.getUserById(id);
    sendSuccess(res, user, 'User retrieved successfully');
  });

  /**
   * Get user by ID with area restriction (Coordinator access)
   */
  getUserByIdWithAreaRestriction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coordinatorAreaIds = req.user.areas || [];

    const user = await this.usuarioService.getUserByIdWithAreaRestriction(id, coordinatorAreaIds);
    sendSuccess(res, user, 'User retrieved successfully');
  });

  /**
   * Create new user (Admin only)
   */
  createUser = asyncHandler(async (req, res) => {
    const userData = req.body;

    const user = await this.usuarioService.createUser(userData);
    sendSuccess(res, user, 'User created successfully', 201);
  });

  /**
   * Update user (Admin only)
   */
  updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const user = await this.usuarioService.updateUser(id, updateData);
    sendSuccess(res, user, 'User updated successfully');
  });

  /**
   * Assign area to user (Admin only)
   */
  assignAreaToUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { areaId } = req.body;
    const area = await this.usuarioService.assignAreaToUser(id, areaId);
    sendSuccess(res, area, 'Area asignada a usuario con éxito');
  });

  /**
   * Deactivate user (Admin only)
   */
  deactivateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await this.usuarioService.deactivateUser(id);
    sendSuccess(res, user, 'User deactivated successfully');
  });

  /**
   * Get user's managed areas (for coordinators)
   */
  getUserManagedAreas = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const areas = await this.usuarioService.getUserManagedAreas(userId);
    sendSuccess(res, areas, 'Managed areas retrieved successfully');
  });
}
