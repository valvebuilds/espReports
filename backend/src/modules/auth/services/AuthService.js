import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { PasswordProvider } from '../providers/PasswordProvider.js';
import { TokenProvider } from '../providers/TokenService.js';
import { 
  InvalidCredentialsError, 
  UserAlreadyExistsError, 
  UserNotFoundError, 
  AreaNotFoundError,
  ValidationError 
} from '../../../core/errors/AppError.js';
import { serviceWrapper } from '../../../core/utils/asyncHandler.js';

/**
 * Auth Service - Handles authentication business logic
 */
export class AuthService {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
    this.passwordProvider = new PasswordProvider();
    this.tokenProvider = new TokenProvider();
  }

  /**
   * Register a new user
   */
  register = serviceWrapper(async (userData) => {
    const { username, password, name, role } = userData;

    // Validate required fields
    if (!username || !password || !name || !role) {
      throw new ValidationError('Username, password, name, and role are required');
    }

    // Check if user already exists
    const existingUser = await this.usuarioRepository.findByUsername(username);
    if (existingUser) {
      throw new UserAlreadyExistsError('User with this username already exists');
    }

    // Hash password
    const passwordHash = await this.passwordProvider.hashPassword(password);

    // Create user
    const user = await this.usuarioRepository.create({
      username,
      passwordHash,
      name,
      role
    });

    // Generate token
    const token = this.tokenProvider.generateToken(user.toAuthObject());

    return {
      user: user.toSafeObject(),
      token
    };
  });

  /**
   * Login user
   */
  login = serviceWrapper(async (credentials) => {
    const { username, password } = credentials;

    // Validate required fields
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    // Find user
    const user = await this.usuarioRepository.findByUsername(username);
    if (!user) {
      throw new UserNotFoundError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.passwordProvider.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new InvalidCredentialsError('Invalid credentials');
    }

    // Generate token
    const token = this.tokenProvider.generateToken(user.toAuthObject());

    return {
      token,
      user: user.toSafeObject(),
    };
  });

  /**
   * Get user by ID
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
   * Get user's area name (for coordinators)
   */
  getUserArea = serviceWrapper(async (userId) => {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const area = await this.usuarioRepository.findAreaByCoordinatorId(userId);
    if (!area) {
      throw new AreaNotFoundError('No area found for this coordinator');
    }

    return area.nombre;
  });

  /**
   * Change user password
   */
  changePassword = serviceWrapper(async (userId, currentPassword, newPassword) => {
    if (!userId || !currentPassword || !newPassword) {
      throw new ValidationError('User ID, current password, and new password are required');
    }

    // Find user
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    // Verify current password
    const isValidPassword = await this.passwordProvider.comparePassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new InvalidCredentialsError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.passwordProvider.hashPassword(newPassword);

    // Update password
    const updatedUser = await this.usuarioRepository.updatePassword(userId, newPasswordHash);

    return updatedUser.toSafeObject();
  });

  /**
   * Verify token and get user
   */
  verifyToken = serviceWrapper(async (token) => {
    if (!token) {
      throw new ValidationError('Token is required');
    }

    const payload = this.tokenProvider.verifyToken(token);
    const user = await this.usuarioRepository.findById(payload.id);
    
    if (!user || !user.isActive()) {
      throw new UserNotFoundError('User not found or inactive');
    }

    return user.toSafeObject();
  });
}
