import { EmpleadoService } from '../services/EmpleadoService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';

/**
 * Empleado Controller - maneja requests http relacionadas con empleados
 */
export class EmpleadoController {
  constructor() {
    this.empleadoService = new EmpleadoService();
  }

  /**
   * obtener todos los empleados (solo para ADMIN)
   */
  getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await this.empleadoService.getAllEmployees();
    sendSuccess(res, employees, 'Employees retrieved successfully');
  });

  /**
   * OBTENER EMPLEADOS POR IDS DE AREA (ACCESO COORDINADOR)
   */
  getEmployeesByAreaIds = asyncHandler(async (req, res) => {
    const areaIds = req.user.areas || [];
    const employees = await this.empleadoService.getEmployeesByAreaIds(areaIds);
    sendSuccess(res, employees, 'Employees retrieved successfully');
  });

  /**
   * Get employee by ID (Admin access)
   */
  getEmployeeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const employee = await this.empleadoService.getEmployeeById(id);
    sendSuccess(res, employee, 'Employee retrieved successfully');
  });

  /**
   * obtener empleado por id con restricción de área (acceso coordinador)
   */
  getEmployeeByIdWithAreaRestriction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coordinatorAreaIds = req.user.areas || [];

    const employee = await this.empleadoService.getEmployeeByIdWithAreaRestriction(id, coordinatorAreaIds);
    sendSuccess(res, employee, 'Employee retrieved successfully');
  });

  /**
   * Crear nuevo empleado (solo ADMIN)
   */
  createEmployee = asyncHandler(async (req, res) => {
    const employeeData = req.body;
    const employee = await this.empleadoService.createEmployee(employeeData);
    sendSuccess(res, employee, 'empleado creado exitosamente', 201);
  });

  /**
   * editar employee (Admin only)
   */
  updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await this.empleadoService.updateEmployee(id, updateData);
    sendSuccess(res, employee, 'Empleado actualizado exitosamente');
  });

  /**
   * eliminar empleado (Admin only)
   */
  deactivateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const employee = await this.empleadoService.deactivateEmployee(id);
    sendSuccess(res, employee, 'Empleado desactivado exitosamente');
  });

  /**
   * Get employee by cedula
   */
  getEmployeeByCedula = asyncHandler(async (req, res) => {
    const { cedula } = req.params;

    const employee = await this.empleadoService.getEmployeeByCedula(cedula);
    sendSuccess(res, employee, 'Employee retrieved successfully');
  });
}
