import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { testConnection } from '../src/config/database';
import { errorHandler } from '../src/middleware/error.middleware';

import authRoutes from '../src/routes/auth.routes';
import userRoutes from '../src/routes/user.routes';
import vehicleRoutes from '../src/routes/vehicle.routes';
import bookingRoutes from '../src/routes/booking.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Vehicle Rental System Server is running')
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

export default app;
