import { AreaRepository } from '../repositories/AreaRepository.js';
import { UsuarioRepository } from '../../auth/repositories/UsuarioRepository.js';
import { 
  NotFoundError, 
  ValidationError 
} from '../../../core/errors/AppError.js';
import { serviceWrapper } from '../../../core/utils/asyncHandler.js';

/**
 * Area Service - Handles area management business logic
 */
export class AreaService {
  constructor() {
    this.areaRepository = new AreaRepository();
    this.usuarioRepository = new UsuarioRepository();
  }

  /**
   * Get all areas
   */
  getAllAreas = serviceWrapper(async () => {
    const areas = await this.areaRepository.findAll();
    return areas;
  });

  /**
   * Get area by ID
   */
  getAreaById = serviceWrapper(async (areaId) => {
    if (!areaId) {
      throw new ValidationError('Area ID is required');
    }

    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new NotFoundError('Area not found');
    }

    return area;
  });

  /**
   * Create new area (Admin only)
   */
  createArea = serviceWrapper(async (areaData) => {
    const { nombre, coordinadorId } = areaData;

    // Validate required fields
    if (!nombre || !coordinadorId) {
      throw new ValidationError('Area name and coordinator ID are required');
    }

    // Validate coordinator exists and has correct role
    const coordinador = await this.usuarioRepository.findById(coordinadorId);
    if (!coordinador) {
      throw new NotFoundError('Coordinator not found');
    }

    if (!coordinador.isCoordinator()) {
      throw new ValidationError('User must have COORDINADOR role to be assigned to an area');
    }

    // Check if coordinator is already assigned to another area
    const existingArea = await this.areaRepository.findByCoordinatorId(coordinadorId);
    if (existingArea) {
      throw new ValidationError('Coordinator is already assigned to another area');
    }

    const area = await this.areaRepository.create({
      nombre,
      coordinadorId
    });

    return area;
  });

  /**
   * Update area (Admin only)
   */
  updateArea = serviceWrapper(async (areaId, updateData) => {
    if (!areaId) {
      throw new ValidationError('Area ID is required');
    }

    // Check if area exists
    const existingArea = await this.areaRepository.findById(areaId);
    if (!existingArea) {
      throw new NotFoundError('Area not found');
    }

    // Validate coordinator if provided
    if (updateData.coordinadorId) {
      const coordinador = await this.usuarioRepository.findById(updateData.coordinadorId);
      if (!coordinador) {
        throw new NotFoundError('Coordinator not found');
      }

      if (!coordinador.isCoordinator()) {
        throw new ValidationError('User must have COORDINADOR role to be assigned to an area');
      }

      // Check if coordinator is already assigned to another area (excluding current area)
      const existingAreaWithCoordinator = await this.areaRepository.findByCoordinatorId(updateData.coordinadorId);
      if (existingAreaWithCoordinator && existingAreaWithCoordinator.id !== parseInt(areaId)) {
        throw new ValidationError('Coordinator is already assigned to another area');
      }
    }

    const updatedArea = await this.areaRepository.update(areaId, updateData);
    return updatedArea;
  });

  /**
   * Delete area (Admin only)
   */
  deleteArea = serviceWrapper(async (areaId) => {
    if (!areaId) {
      throw new ValidationError('Area ID is required');
    }

    // Check if area exists
    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Check if area has employees
    if (area.empleados && area.empleados.length > 0) {
      throw new ValidationError('Cannot delete area with assigned employees');
    }

    const deletedArea = await this.areaRepository.delete(areaId);
    return deletedArea;
  });

  /**
   * Get area by coordinator ID
   */
  getAreaByCoordinatorId = serviceWrapper(async (coordinatorId) => {
    if (!coordinatorId) {
      throw new ValidationError('Coordinator ID is required');
    }

    const area = await this.areaRepository.findByCoordinatorId(coordinatorId);
    if (!area) {
      throw new NotFoundError('Area not found for this coordinator');
    }

    return area;
  });
}
