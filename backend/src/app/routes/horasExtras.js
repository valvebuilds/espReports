import express from 'express';
import { HoraExtraController } from '../../modules/horas-extra/controllers/HoraExtraController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();
const horaExtraController = new HoraExtraController();

// Define routes
router.get('/', requireAuth, requireRole('ADMIN'), horaExtraController.getAllOvertimeRecords);
router.post('/', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.createOvertimeRecord);
router.get('/employee/:employeeId', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.getOvertimeRecordsByEmployeeId);
router.get('/coordinator/:coordinatorId', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.getOvertimeRecordsByCoordinatorId);
router.get('/status/:status', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.getOvertimeRecordsByStatus);
router.get('/:id', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.getOvertimeRecordById);
router.put('/:id', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.updateOvertimeRecord);
router.put('/:id/status', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.updateOvertimeRecordStatus);
router.delete('/:id', requireAuth, requireRole('ADMIN'), horaExtraController.deleteOvertimeRecord);
router.post('/calculate', requireAuth, requireRole('ADMIN', 'COORDINADOR'), horaExtraController.calculateOvertimeHours);

export default router;