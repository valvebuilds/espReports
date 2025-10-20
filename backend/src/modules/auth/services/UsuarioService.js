import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { AreaRepository } from '../../areas/repositories/AreaRepository.js';
import { 
  UserNotFoundError, 
  ValidationError,
  ForbiddenError 
} from '../../../core/errors/AppError.js';
import { serviceWrapper } from '../../../core/utils/asyncHandler.js';

/**
 * Usuario Service - Handles user management business logic
 */
export class UsuarioService {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
    this.areaRepository = new AreaRepository();
  }

  /**
   * Get all users (Admin only)
   */
  getAllUsers = serviceWrapper(async () => {
    const users = await this.usuarioRepository.findAll();
    return users.map(user => user.toSafeObject());
  });

  /**
   * Get users by area IDs (for coordinators)
   */
  getUsersByAreaIds = serviceWrapper(async (areaIds) => {
    if (!areaIds || !Array.isArray(areaIds) || areaIds.length === 0) {
      throw new ValidationError('Area IDs array is required');
    }

    const users = await this.usuarioRepository.findByAreaIds(areaIds);
    return users.map(user => user.toSafeObject());
  });

  /**
   * Get user by ID (Admin access)
   */
  getUserById = serviceWrapper(async (userId) => {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    return user.toSafeObject();
  });

  /**
   * Get user by ID with area restriction (Coordinator access)
   */
  getUserByIdWithAreaRestriction = serviceWrapper(async (userId, coordinatorAreaIds) => {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }
    if (!coordinatorAreaIds || !Array.isArray(coordinatorAreaIds)) {
      throw new ValidationError('Coordinator area IDs are required');
    }

    const user = await this.usuarioRepository.findByIdAndAreaIds(userId, coordinatorAreaIds);
    if (!user) {
      throw new UserNotFoundError('User not found in your areas');
    }

    return user.toSafeObject();
  });

  /**
   * Crear nuevo usuario (Admin only)
   */
  createUser = serviceWrapper(async (userData) => {
    const { username, password, name, role, areaId } = userData;

    // Validate required fields
    if (!username || !password || !name || !role) {
      throw new ValidationError('Username, password, name, and role are required');
    }

    // Validate role
    const validRoles = ['ADMIN', 'COORDINADOR', 'USER'];
    if (!validRoles.includes(role)) {
      throw new ValidationError('Invalid role. Must be ADMIN, COORDINADOR, or USER');
    }

    // If areaId is provided, validate it exists
    if (areaId) {
      const area = await this.areaRepository.findById(areaId);
      if (!area) {
        throw new ValidationError('Area not found');
      }
    }

    const user = await this.usuarioRepository.create({
      username,
      password,
      name,
      role,
      areaId
    });

    return user.toSafeObject();
  });

  /**
   * Update user (Admin only)
   */
  updateUser = serviceWrapper(async (userId, updateData) => {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // Check if user exists
    const existingUser = await this.usuarioRepository.findById(userId);
    if (!existingUser) {
      throw new UserNotFoundError('User not found');
    }

    // Validate role if provided
    if (updateData.role) {
      const validRoles = ['ADMIN', 'COORDINADOR', 'USER'];
      if (!validRoles.includes(updateData.role)) {
        throw new ValidationError('Invalid role. Must be ADMIN, COORDINADOR, or USER');
      }
    }

    // If areaId is provided, validate it exists
    if (updateData.areaId) {
      const area = await this.areaRepository.findById(updateData.areaId);
      if (!area) {
        throw new ValidationError('Area not found');
      }
    }
    const updatedUser = await this.usuarioRepository.update(userId, updateData);
    return updatedUser.toSafeObject();
  });

  assignAreaToUser = serviceWrapper(async (userId, areaId) => {
    if (!userId || !areaId) {
      throw new ValidationError('User ID and Area ID are required');
    }

    // Check if user exists
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    // Check if area exists
    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new ValidationError('Area not found');
    }

    // Check if user has coordinator role
    if (!user.isCoordinator()) {
      throw new ValidationError('User must have COORDINADOR role to be assigned to an area');
    }

    // Assign area to user
    const updatedArea = await this.usuarioRepository.assignAreaToUser(userId, areaId);
    return updatedArea;
  });

  /**
   * Deactivate user (Admin only)
   */
  deactivateUser = serviceWrapper(async (userId) => {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // Check if user exists
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    const deactivatedUser = await this.usuarioRepository.delete(userId);
    return deactivatedUser.toSafeObject();
  });

  /**
   * Get user's managed areas (for coordinators)
   */
  getUserManagedAreas = serviceWrapper(async (userId) => {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const area = await this.usuarioRepository.findAreaByCoordinatorId(userId);
    return area ? [area] : [];
  });
}
