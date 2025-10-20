import express from 'express';
import { AreaController } from '../../modules/areas/controllers/AreaController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();
const areaController = new AreaController();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'), areaController.getAllAreas);
router.post('/', requireAuth, requireRole('ADMIN'), areaController.createArea);
router.put('/:id', requireAuth, requireRole('ADMIN'), areaController.updateArea);
router.delete('/:id', requireAuth, requireRole('ADMIN'), areaController.deleteArea);
router.get('/coordinator/:coordinatorId', requireAuth, requireRole('ADMIN'), areaController.getAreaByCoordinatorId);

export default router;