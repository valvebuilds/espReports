import { HoraExtraService } from '../services/HoraExtraService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';

/**
 * HoraExtra Controller - Maneja las solicitudes http relacionadas con las horas extra 
 */
export class HoraExtraController {
  constructor() {
    this.horaExtraService = new HoraExtraService();
  }

  /**
   * Obtener todos los registros de horas extra
   */
  getAllOvertimeRecords = asyncHandler(async (req, res) => {
    const records = await this.horaExtraService.getAllOvertimeRecords();
    sendSuccess(res, records, 'Registros de horas extra obtenidos con éxito');
  });

  /**
   * Obtener registros de horas extra por ID de empleado
   */
  getOvertimeRecordsByEmployeeId = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;

    const records = await this.horaExtraService.getOvertimeRecordsByEmployeeId(employeeId);
    sendSuccess(res, records, 'Registros de horas extra obtenidos con éxito');
  });

  /**
   * Obtener registros de horas extra por ID de coordinador
   */
  getOvertimeRecordsByCoordinatorId = asyncHandler(async (req, res) => {
    const { coordinatorId } = req.params;

    const records = await this.horaExtraService.getOvertimeRecordsByCoordinatorId(coordinatorId);
    sendSuccess(res, records, 'Registros de horas extra obtenidos con éxito');
  });

  /**
   * obtener registros de horas extra por estado
   */
  getOvertimeRecordsByStatus = asyncHandler(async (req, res) => {
    const { status } = req.params;

    const records = await this.horaExtraService.getOvertimeRecordsByStatus(status);
    sendSuccess(res, records, 'Registros de horas extra obtenidos con éxito');
  });

  /**
   * Obtener registro de horas extra por ID
   */
  getOvertimeRecordById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const record = await this.horaExtraService.getOvertimeRecordById(id);
    sendSuccess(res, record, 'Registro de horas extra obtenido con éxito');
  });

  /**
   * Crear nuevo registro de horas extra
   */
  createOvertimeRecord = asyncHandler(async (req, res) => {
    const recordData = {
      ...req.body,
      coordinadorId: req.user.id // asignar el ID del coordinador desde el usuario autenticado
    };
    console.log(recordData);

    const record = await this.horaExtraService.createOvertimeRecord(recordData);
    sendSuccess(res, record, 'Overtime record created successfully', 201);
  });

  /**
   * Update overtime record status (Coordinator/Admin only)
   */
  updateOvertimeRecordStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const record = await this.horaExtraService.updateOvertimeRecordStatus(id, status, req.user.id);
    sendSuccess(res, record, 'Overtime record status updated successfully');
  });

  /**
   * Update overtime record (Coordinator/Admin only)
   */
  updateOvertimeRecord = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const record = await this.horaExtraService.updateOvertimeRecord(id, updateData, req.user.id);
    sendSuccess(res, record, 'Overtime record updated successfully');
  });

  /**
   * Delete overtime record (Admin only)
   */
  deleteOvertimeRecord = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const record = await this.horaExtraService.deleteOvertimeRecord(id);
    sendSuccess(res, record, 'Overtime record deleted successfully');
  });

  /**
   * Calculate overtime hours for a time period
   */
  calculateOvertimeHours = asyncHandler(async (req, res) => {
    const { startTime, endTime, employeeId } = req.body;

    const calculation = await this.horaExtraService.calculateOvertimeHours(startTime, endTime, employeeId);
    sendSuccess(res, calculation, 'Overtime hours calculated successfully');
  });
}
