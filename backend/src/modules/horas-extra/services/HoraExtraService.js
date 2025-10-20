import { HoraExtraRepository } from '../repositories/HoraExtraRepository.js';
import { EmpleadoRepository } from '../../empleados/repositories/EmpleadoRepository.js';
import { UsuarioRepository } from '../../auth/repositories/UsuarioRepository.js';
import { 
  NotFoundError, 
  ValidationError,
  ForbiddenError 
} from '../../../core/errors/AppError.js';
import { serviceWrapper } from '../../../core/utils/asyncHandler.js';

/**
 * HoraExtra Service - Handles overtime records business logic
 */
export class HoraExtraService {
  constructor() {
    this.horaExtraRepository = new HoraExtraRepository();
    this.empleadoRepository = new EmpleadoRepository();
    this.usuarioRepository = new UsuarioRepository();
  }

  /**
   * Get all overtime records (Admin only)
   */
  getAllOvertimeRecords = serviceWrapper(async () => {
    const horasExtra = await this.horaExtraRepository.findAll();
    return horasExtra;
  });

  /**
   * Get overtime records by employee ID
   */
  getOvertimeRecordsByEmployeeId = serviceWrapper(async (employeeId) => {
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }

    const horasExtra = await this.horaExtraRepository.findByEmpleadoId(employeeId);
    return horasExtra;
  });

  /**
   * Get overtime records by coordinator ID
   */
  getOvertimeRecordsByCoordinatorId = serviceWrapper(async (coordinatorId) => {
    if (!coordinatorId) {
      throw new ValidationError('Coordinator ID is required');
    }

    const horasExtra = await this.horaExtraRepository.findByCoordinadorId(coordinatorId);
    return horasExtra;
  });

  /**
   * Get overtime records by status
   */
  getOvertimeRecordsByStatus = serviceWrapper(async (status) => {
    if (!status) {
      throw new ValidationError('Status is required');
    }

    const validStatuses = ['PENDIENTE', 'APROBADO', 'RECHAZADO'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status. Must be PENDIENTE, APROBADO, or RECHAZADO');
    }

    const horasExtra = await this.horaExtraRepository.findByEstado(status);
    return horasExtra;
  });

  /**
   * Get overtime record by ID
   */
  getOvertimeRecordById = serviceWrapper(async (recordId) => {
    if (!recordId) {
      throw new ValidationError('Overtime record ID is required');
    }

    const horaExtra = await this.horaExtraRepository.findById(recordId);
    if (!horaExtra) {
      throw new NotFoundError('Overtime record not found');
    }

    return horaExtra;
  });

  /**
   * Crear registro de horas extra
   */
  createOvertimeRecord = serviceWrapper(async (recordData) => {
    const { 
      empleadoId, 
      coordinadorId, 
      horaInicio, 
      horaFin, 
      horasDiurnas, 
      horasNocturnas, 
      horasDominicales, 
      observaciones, 
      nroSolicitud 
    } = recordData;

    // Validate required fields
    if (!empleadoId || !coordinadorId || !horaInicio || !horaFin) {
      throw new ValidationError('Se requieren los campos empleadoId, coordinadorId, horaInicio y horaFin');
    }

    // Validate employee exists
    const empleado = await this.empleadoRepository.findById(empleadoId);
    if (!empleado) {
      throw new NotFoundError('Empleado no encontrado');
    }

    // Validate coordinator exists
    const coordinador = await this.usuarioRepository.findById(coordinadorId);
    console.log(coordinador);
    if (!coordinador) {
      throw new NotFoundError('Coordinador no encontrado');
    }

    // Validate coordinator has access to employee's area
    if (!coordinador.isAdmin() && empleado.areaId !== coordinador.areaId) {
      throw new ForbiddenError('Coordinator does not have access to this employee');
    }

    // Validate time logic
    const startTime = new Date(horaInicio);
    const endTime = new Date(horaFin);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new ValidationError('Invalid time format');
    }

    if (startTime >= endTime) {
      throw new ValidationError('Start time must be before end time');
    }

    // Calculate total hours
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);
    const calculatedTotalHours = (parseFloat(horasDiurnas) || 0) + 
                                (parseFloat(horasNocturnas) || 0) + 
                                (parseFloat(horasDominicales) || 0);

    if (Math.abs(totalHours - calculatedTotalHours) > 0.1) {
      throw new ValidationError('Total hours calculation does not match individual hour types');
    }

    const horaExtra = await this.horaExtraRepository.create({
      empleadoId,
      coordinadorId,
      horaInicio,
      horaFin,
      horasDiurnas: parseFloat(horasDiurnas) || 0,
      horasNocturnas: parseFloat(horasNocturnas) || 0,
      horasDominicales: parseFloat(horasDominicales) || 0,
      totalHours: calculatedTotalHours,
      observaciones,
      nroSolicitud,
      estado: 'PENDIENTE'
    });

    return horaExtra;
  });

  /**
   * Update overtime record status (Coordinator/Admin only)
   */
  updateOvertimeRecordStatus = serviceWrapper(async (recordId, status, userId) => {
    if (!recordId || !status) {
      throw new ValidationError('Record ID and status are required');
    }

    const validStatuses = ['PENDIENTE', 'APROBADO', 'RECHAZADO'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status. Must be PENDIENTE, APROBADO, or RECHAZADO');
    }

    // Get the overtime record
    const horaExtra = await this.horaExtraRepository.findById(recordId);
    if (!horaExtra) {
      throw new NotFoundError('Overtime record not found');
    }

    // Validate user permissions
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user has permission to update this record
    if (!user.isAdmin() && horaExtra.coordinadorId !== user.id) {
      throw new ForbiddenError('You do not have permission to update this record');
    }

    const updatedRecord = await this.horaExtraRepository.updateEstado(recordId, status);
    return updatedRecord;
  });

  /**
   * Update overtime record (Coordinator/Admin only)
   */
  updateOvertimeRecord = serviceWrapper(async (recordId, updateData, userId) => {
    if (!recordId) {
      throw new ValidationError('Record ID is required');
    }

    // Get the overtime record
    const horaExtra = await this.horaExtraRepository.findById(recordId);
    if (!horaExtra) {
      throw new NotFoundError('Overtime record not found');
    }

    // Validate user permissions
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user has permission to update this record
    if (!user.isAdmin() && horaExtra.coordinadorId !== user.id) {
      throw new ForbiddenError('You do not have permission to update this record');
    }

    // Validate time logic if times are provided
    if (updateData.horaInicio && updateData.horaFin) {
      const startTime = new Date(updateData.horaInicio);
      const endTime = new Date(updateData.horaFin);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new ValidationError('Invalid time format');
      }

      if (startTime >= endTime) {
        throw new ValidationError('Start time must be before end time');
      }
    }

    const updatedRecord = await this.horaExtraRepository.update(recordId, updateData);
    return updatedRecord;
  });

  /**
   * Delete overtime record (Admin only)
   */
  deleteOvertimeRecord = serviceWrapper(async (recordId) => {
    if (!recordId) {
      throw new ValidationError('Record ID is required');
    }

    // Check if record exists
    const horaExtra = await this.horaExtraRepository.findById(recordId);
    if (!horaExtra) {
      throw new NotFoundError('Overtime record not found');
    }

    const deletedRecord = await this.horaExtraRepository.delete(recordId);
    return deletedRecord;
  });

  /**
   * Calculate overtime hours for a time period
   */
  calculateOvertimeHours = serviceWrapper(async (startTime, endTime, employeeId) => {
    if (!startTime || !endTime || !employeeId) {
      throw new ValidationError('Start time, end time, and employee ID are required');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ValidationError('Invalid time format');
    }

    if (start >= end) {
      throw new ValidationError('Start time must be before end time');
    }

    // Get employee's schedule for the day
    const empleado = await this.empleadoRepository.findById(employeeId);
    if (!empleado) {
      throw new NotFoundError('Employee not found');
    }

    // This is a simplified calculation - in a real system, you'd need to consider
    // the employee's regular schedule, holidays, etc.
    const totalHours = (end - start) / (1000 * 60 * 60);
    
    // Basic calculation - would need more complex logic for different hour types
    const horasDiurnas = totalHours > 8 ? totalHours - 8 : 0;
    const horasNocturnas = 0; // Would need time-based calculation
    const horasDominicales = 0; // Would need day-based calculation

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      horasDiurnas: Math.round(horasDiurnas * 100) / 100,
      horasNocturnas: Math.round(horasNocturnas * 100) / 100,
      horasDominicales: Math.round(horasDominicales * 100) / 100
    };
  });
}
