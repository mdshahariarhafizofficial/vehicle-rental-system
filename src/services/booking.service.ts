import { BookingModel, VehicleModel, UserModel } from '../models';
import { Booking, Vehicle } from '../types';
import { logger } from '../utils/logger';

export class BookingService {
static async calculatePrice(dailyRentPrice: number, startDate: Date, endDate: Date): Promise<number> {
const start = new Date(startDate);
const end = new Date(endDate);
const timeDiff = end.getTime() - start.getTime();
const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

if (numberOfDays <= 0) {
throw new Error('End date must be after start date');
}

return dailyRentPrice * numberOfDays;
}

static async createBooking(bookingData: {
customer_id: number;
vehicle_id: number;
rent_start_date: Date;
rent_end_date: Date;
}): Promise<Booking & { vehicle: Partial<Vehicle> }> {
try {
const vehicle = await VehicleModel.findById(bookingData.vehicle_id);
if (!vehicle) {
throw new Error('Vehicle not found');
}

if (vehicle.availability_status !== 'available') {
throw new Error('Vehicle is not available for booking');
}

const customer = await UserModel.findById(bookingData.customer_id);
if (!customer) {
throw new Error('Customer not found');
}

const isAvailable = await BookingModel.checkVehicleAvailability(
bookingData.vehicle_id,
bookingData.rent_start_date,
bookingData.rent_end_date
);

if (!isAvailable) {
throw new Error('Vehicle is already booked for the selected dates');
}

const totalPrice = await this.calculatePrice(
vehicle.daily_rent_price,
bookingData.rent_start_date,
bookingData.rent_end_date
);

const booking = await BookingModel.create({
...bookingData,
total_price: totalPrice
});

await VehicleModel.updateAvailability(bookingData.vehicle_id, 'booked');

const bookingWithVehicle = {
...booking,
vehicle: {
vehicle_name: vehicle.vehicle_name,
daily_rent_price: vehicle.daily_rent_price
}
};

return bookingWithVehicle;
} catch (error: any) {
logger.error('Error creating booking:', error);
throw error;
}
}

static async getAllBookings(userRole: string, userId?: number): Promise<Booking[]> {
if (userRole === 'admin') {
return await BookingModel.findAll();
} else {
if (!userId) throw new Error('User ID required for customer bookings');
return await BookingModel.findByCustomerId(userId);
}
}

static async updateBooking(
id: number,
updateData: { status: 'cancelled' | 'returned' },
userRole: string,
userId?: number
): Promise<Booking | null> {
const booking = await BookingModel.findById(id);
if (!booking) {
throw new Error('Booking not found');
}

if (updateData.status === 'cancelled') {
if (userRole !== 'admin' && booking.customer_id !== userId) {
throw new Error('You can only cancel your own bookings');
}

const startDate = new Date(booking.rent_start_date);
const today = new Date();
if (today >= startDate) {
throw new Error('Cannot cancel booking that has already started');
}
} else if (updateData.status === 'returned') {
if (userRole !== 'admin') {
throw new Error('Only admin can mark bookings as returned');
}
}

const updatedBooking = await BookingModel.update(id, updateData);

if (updateData.status === 'cancelled' || updateData.status === 'returned') {
await VehicleModel.updateAvailability(booking.vehicle_id, 'available');
}

return updatedBooking;
}
}