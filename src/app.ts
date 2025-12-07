import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { testConnection } from './config/database';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle.routes';
import bookingRoutes from './routes/booking.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vehicle Rental System API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;