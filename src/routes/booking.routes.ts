import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', BookingController.createBooking);
router.get('/', BookingController.getAllBookings);
router.put('/:bookingId', BookingController.updateBooking);

export default router;