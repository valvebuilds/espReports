/**
 * Usuario domain model
 * Represents a user in the system with business logic
 */
export class Usuario {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.usuario;
    this.name = userData.nombre;
    this.passwordHash = userData.contrasena;
    this.role = userData.rol;
    this.areaId = userData.areaId;
    this.area = userData.area;
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role) {
    return this.role === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.role === 'ADMIN';
  }

  /**
   * Check if user is coordinator
   */
  isCoordinator() {
    return this.role === 'COORDINADOR';
  }

  /**
   * Check if user is employee
   */
  isEmployee() {
    return this.role === 'EMPLEADO';
  }

  /**
   * Check if user is active
   */
  isActive() {
    return this.active;
  }

  /**
   * Get area name
   */
  getAreaName() {
    return this.area?.nombre || null;
  }

  /**
   * Get safe user data (without sensitive information)
   */
  toSafeObject() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      role: this.role,
      areaId: this.areaId,
      area: this.area,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Get user data for authentication
   */
  toAuthObject() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      role: this.role,
      areaId: this.areaId,
      area: this.area
    };
  }

  /**
   * Update password hash
   */
  updatePassword(newHash) {
    this.passwordHash = newHash;
    this.updatedAt = new Date();
  }

  /**
   * Deactivate user
   */
  deactivate() {
    this.active = false;
    this.updatedAt = new Date();
  }

  /**
   * Activate user
   */
  activate() {
    this.active = true;
    this.updatedAt = new Date();
  }
}
