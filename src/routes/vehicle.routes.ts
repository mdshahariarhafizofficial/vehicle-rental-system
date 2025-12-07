import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', VehicleController.getAllVehicles);
router.get('/:vehicleId', VehicleController.getVehicleById);

// Protected routes - Admin only
router.post('/', authenticate, authorize(['admin']), VehicleController.createVehicle);
router.put('/:vehicleId', authenticate, authorize(['admin']), VehicleController.updateVehicle);
router.delete('/:vehicleId', authenticate, authorize(['admin']), VehicleController.deleteVehicle);

export default router;