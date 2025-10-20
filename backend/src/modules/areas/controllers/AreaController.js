import { AreaService } from '../services/AreaService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';
import { asyncHandler } from '../../../core/utils/asyncHandler.js';

/**
 * Area Controller - Handles area management HTTP requests
 */
export class AreaController {
  constructor() {
    this.areaService = new AreaService();
  }

  /**
   * Get all areas
   */
  getAllAreas = asyncHandler(async (req, res) => {
    const areas = await this.areaService.getAllAreas();
    sendSuccess(res, areas, 'Areas retrieved successfully');
  });

  /**
   * Get area by ID
   */
  getAreaById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const area = await this.areaService.getAreaById(id);
    sendSuccess(res, area, 'Area retrieved successfully');
  });

  /**
   * Create new area (Admin only)
   */
  createArea = asyncHandler(async (req, res) => {
    const areaData = req.body;

    const area = await this.areaService.createArea(areaData);
    sendSuccess(res, area, 'Area created successfully', 201);
  });

  /**
   * Update area (Admin only)
   */
  updateArea = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const area = await this.areaService.updateArea(id, updateData);
    sendSuccess(res, area, 'Area updated successfully');
  });

  /**
   * Delete area (Admin only)
   */
  deleteArea = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const area = await this.areaService.deleteArea(id);
    sendSuccess(res, area, 'Area deleted successfully');
  });

  /**
   * Get area by coordinator ID
   */
  getAreaByCoordinatorId = asyncHandler(async (req, res) => {
    const { coordinatorId } = req.params;

    const area = await this.areaService.getAreaByCoordinatorId(coordinatorId);
    sendSuccess(res, area, 'Area retrieved successfully');
  });
}
