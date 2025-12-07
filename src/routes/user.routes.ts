import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all users - Admin only
router.get('/', authorize(['admin']), UserController.getAllUsers);

// Update user - Admin or own profile
router.put('/:userId', UserController.updateUser);

// Delete user - Admin only
router.delete('/:userId', authorize(['admin']), UserController.deleteUser);

export default router;