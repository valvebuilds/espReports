import { EmpleadoRepository } from '../repositories/EmpleadoRepository.js';
import { AreaRepository } from '../../areas/repositories/AreaRepository.js';
import { HorarioRepository } from '../../horarios/repositories/HorarioRepository.js';
import { 
  NotFoundError, 
  ValidationError,
  ForbiddenError 
} from '../../../core/errors/AppError.js';
import { serviceWrapper } from '../../../core/utils/asyncHandler.js';

/**
 * Empleado Service - maneja la lógica de negocio relacionada con empleados
 */
export class EmpleadoService {
  constructor() {
    this.empleadoRepository = new EmpleadoRepository();
    this.areaRepository = new AreaRepository();
    this.horarioRepository = new HorarioRepository();
  }

  getAllEmployees = serviceWrapper(async () => {
    const empleados = await this.empleadoRepository.findAll();
    return empleados;
  });

  getEmployeesByAreaIds = serviceWrapper(async (areaIds) => {
    if (!areaIds || !Array.isArray(areaIds) || areaIds.length === 0) {
      throw new ValidationError('Area IDs array is required');
    }

    const empleados = await this.empleadoRepository.findByAreaIds(areaIds);
    return empleados;
  });

  /**
   * Get employee by ID (Admin access)
   */
  getEmployeeById = serviceWrapper(async (employeeId) => {
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }

    const empleado = await this.empleadoRepository.findById(employeeId);
    if (!empleado) {
      throw new NotFoundError('Employee not found');
    }

    return empleado;
  });

  /**
   * Get employee by ID with area restriction (Coordinator access)
   */
  getEmployeeByIdWithAreaRestriction = serviceWrapper(async (employeeId, coordinatorAreaIds) => {
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }
    if (!coordinatorAreaIds || !Array.isArray(coordinatorAreaIds)) {
      throw new ValidationError('Coordinator area IDs are required');
    }

    const empleado = await this.empleadoRepository.findByIdAndAreaIds(employeeId, coordinatorAreaIds);
    if (!empleado) {
      throw new NotFoundError('Employee not found in your areas');
    }

    return empleado;
  });

  /**
   * Create new employee (Admin only)
   */
  createEmployee = serviceWrapper(async (employeeData) => {
    const { nombre, cedula, areaId } = employeeData;

    // Validate required fields
    if (!nombre || !cedula || !areaId ) {
      throw new ValidationError('Name, cedula, area ID, and schedule ID are required');
    }

    // Validate cedula format (basic validation)
    if (cedula.length < 7 || cedula.length > 10) {
      throw new ValidationError('Cedula must be between 7 and 10 characters');
    }

    // Check if cedula already exists
    const existingEmployee = await this.empleadoRepository.findByCedula(cedula);
    if (existingEmployee) {
      throw new ValidationError('Employee with this cedula already exists');
    }

    // Validate area exists
    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new ValidationError('Area not found');
    }

    const empleado = await this.empleadoRepository.create({
      nombre,
      cedula,
      areaId
    });

    return empleado;
  });

  /**
   * Update employee (Admin only)
   */
  updateEmployee = serviceWrapper(async (employeeId, updateData) => {
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }

    // Check if employee exists
    const existingEmployee = await this.empleadoRepository.findById(employeeId);
    if (!existingEmployee) {
      throw new NotFoundError('Employee not found');
    }

    // Validate cedula if provided
    if (updateData.cedula) {
      if (updateData.cedula.length < 7 || updateData.cedula.length > 10) {
        throw new ValidationError('Cedula must be between 7 and 10 characters');
      }

      // Check if cedula already exists (excluding current employee)
      const existingEmployeeWithCedula = await this.empleadoRepository.findByCedula(updateData.cedula);
      if (existingEmployeeWithCedula && existingEmployeeWithCedula.id !== parseInt(employeeId)) {
        throw new ValidationError('Employee with this cedula already exists');
      }
    }

    // Validate area if provided
    if (updateData.areaId) {
      const area = await this.areaRepository.findById(updateData.areaId);
      if (!area) {
        throw new ValidationError('Area not found');
      }
    }

    // Validate schedule if provided
    if (updateData.horarioId) {
      const horario = await this.horarioRepository.findById(updateData.horarioId);
      if (!horario) {
        throw new ValidationError('Schedule not found');
      }
    }

    const updatedEmployee = await this.empleadoRepository.update(employeeId, updateData);
    return updatedEmployee;
  });

  /**
   * Deactivate employee (Admin only)
   */
  deactivateEmployee = serviceWrapper(async (employeeId) => {
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }

    // Check if employee exists
    const employee = await this.empleadoRepository.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const deactivatedEmployee = await this.empleadoRepository.deactivate(employeeId);
    return deactivatedEmployee;
  });

  /**
   * Get employee by cedula
   */
  getEmployeeByCedula = serviceWrapper(async (cedula) => {
    if (!cedula) {
      throw new ValidationError('Cedula is required');
    }

    const empleado = await this.empleadoRepository.findByCedula(cedula);
    if (!empleado) {
      throw new NotFoundError('Employee not found');
    }

    return empleado;
  });
}
