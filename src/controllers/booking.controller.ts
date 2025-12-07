import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { RequestWithUser } from '../types';

export class BookingController {
static async createBooking(req: Request, res: Response): Promise<void> {
try {
const bookingData = req.body;
const requestWithUser = req as RequestWithUser;
const userId = requestWithUser.user?.id;

if (requestWithUser.user?.role === 'customer') {
bookingData.customer_id = userId;
}

if (!bookingData.customer_id || !bookingData.vehicle_id || !bookingData.rent_start_date || !bookingData.rent_end_date) {
res.status(400).json({
success: false,
message: 'All fields are required'
});
return;
}

const startDate = new Date(bookingData.rent_start_date);
const endDate = new Date(bookingData.rent_end_date);
const today = new Date();

if (startDate < today) {
res.status(400).json({
success: false,
message: 'Start date cannot be in the past'
});
return;
}

if (endDate <= startDate) {
res.status(400).json({
success: false,
message: 'End date must be after start date'
});
return;
}

const booking = await BookingService.createBooking({
...bookingData,
rent_start_date: startDate,
rent_end_date: endDate
});

res.status(201).json({
success: true,
message: 'Booking created successfully',
data: booking
});
} catch (error: any) {
if (error.message.includes('not found') ||
error.message.includes('not available') ||
error.message.includes('already booked')) {
res.status(400).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error creating booking'
});
}
}

static async getAllBookings(req: Request, res: Response): Promise<void> {
try {
const requestWithUser = req as RequestWithUser;
const userRole = requestWithUser.user?.role || '';
const userId = requestWithUser.user?.id;

const bookings = await BookingService.getAllBookings(userRole, userId);

res.status(200).json({
success: true,
message: 'Bookings retrieved successfully',
data: bookings
});
} catch (error: any) {
res.status(500).json({
success: false,
message: 'Error retrieving bookings'
});
}
}

static async updateBooking(req: Request, res: Response): Promise<void> {
try {
const bookingId = parseInt(req.params.bookingId);
const { status } = req.body;
const requestWithUser = req as RequestWithUser;
const userRole = requestWithUser.user?.role || '';
const userId = requestWithUser.user?.id;

if (!status || !['cancelled', 'returned'].includes(status)) {
res.status(400).json({
success: false,
message: 'Invalid status'
});
return;
}

const updatedBooking = await BookingService.updateBooking(
bookingId,
{ status },
userRole,
userId
);

if (!updatedBooking) {
res.status(404).json({
success: false,
message: 'Booking not found'
});
return;
}

const message = status === 'cancelled'
? 'Booking cancelled successfully'
: 'Booking marked as returned';

res.status(200).json({
success: true,
message,
data: updatedBooking
});
} catch (error: any) {
if (error.message.includes('You can only') ||
error.message.includes('Only admin') ||
error.message.includes('Cannot cancel')) {
res.status(400).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error updating booking'
});
}
}
}