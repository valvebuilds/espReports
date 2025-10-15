export class Usuario {
  constructor(user) {
    this.id = user.id;
    this.name = user.nombre;
    this.username = user.usuario;
    this.passwordHash = user.contrasena;
    this.role = user.rol;
    this.createdAt = user.createdAt || new Date();
    this.updatedAt = user.updatedAt || new Date();
  }

  hasRole(role) {
    return this.role.includes(role);
  }

  changePassword(newHash) {
    this.passwordHash = newHash;
    this.updatedAt = new Date();
  }
}

