export class HoraExtra {
  constructor( horaExtra ) {
    this.id = horaExtra.id;
    this.empleadoId = horaExtra.empleadoId;
    this.coordinadorId = horaExtra.coordinadorId;
    this.inicio = horaExtra.inicio;
    this.fin = horaExtra.fin;
    this.diurnas = horaExtra.diurnas || 0;
    this.nocturnas = horaExtra.nocturnas || 0;
    this.dominicales = horaExtra.dominicales || 0;
  }

  hasRole(role) {
    return this.role.includes(role);
  }

  changePassword(newHash) {
    this.passwordHash = newHash;
    this.updatedAt = new Date();
  }
}

