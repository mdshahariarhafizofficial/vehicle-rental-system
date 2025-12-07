import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
static async createVehicle(req: Request, res: Response): Promise<void> {
try {
const vehicleData = req.body;

if (!vehicleData.vehicle_name || !vehicleData.type || !vehicleData.registration_number || !vehicleData.daily_rent_price) {
res.status(400).json({
success: false,
message: 'All fields are required'
});
return;
}

if (vehicleData.daily_rent_price <= 0) {
res.status(400).json({
success: false,
message: 'Daily rent price must be positive'
});
return;
}

const validTypes = ['car', 'bike', 'van', 'SUV'];
if (!validTypes.includes(vehicleData.type)) {
res.status(400).json({
success: false,
message: 'Invalid vehicle type'
});
return;
}

const vehicle = await VehicleService.createVehicle(vehicleData);

res.status(201).json({
success: true,
message: 'Vehicle created successfully',
data: vehicle
});
} catch (error: any) {
if (error.message.includes('already exists')) {
res.status(409).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error creating vehicle'
});
}
}

static async getAllVehicles(req: Request, res: Response): Promise<void> {
try {
const vehicles = await VehicleService.getAllVehicles();

res.status(200).json({
success: true,
message: 'Vehicles retrieved successfully',
data: vehicles
});
} catch (error: any) {
res.status(500).json({
success: false,
message: 'Error retrieving vehicles'
});
}
}

static async getVehicleById(req: Request, res: Response): Promise<void> {
try {
const vehicleId = parseInt(req.params.vehicleId);
const vehicle = await VehicleService.getVehicleById(vehicleId);

if (!vehicle) {
res.status(404).json({
success: false,
message: 'Vehicle not found'
});
return;
}

res.status(200).json({
success: true,
message: 'Vehicle retrieved successfully',
data: vehicle
});
} catch (error: any) {
res.status(500).json({
success: false,
message: 'Error retrieving vehicle'
});
}
}

static async updateVehicle(req: Request, res: Response): Promise<void> {
try {
const vehicleId = parseInt(req.params.vehicleId);
const updateData = req.body;

if (updateData.daily_rent_price && updateData.daily_rent_price <= 0) {
res.status(400).json({
success: false,
message: 'Daily rent price must be positive'
});
return;
}

const updatedVehicle = await VehicleService.updateVehicle(vehicleId, updateData);

if (!updatedVehicle) {
res.status(404).json({
success: false,
message: 'Vehicle not found'
});
return;
}

res.status(200).json({
success: true,
message: 'Vehicle updated successfully',
data: updatedVehicle
});
} catch (error: any) {
if (error.message.includes('already exists')) {
res.status(409).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error updating vehicle'
});
}
}

static async deleteVehicle(req: Request, res: Response): Promise<void> {
try {
const vehicleId = parseInt(req.params.vehicleId);

const deleted = await VehicleService.deleteVehicle(vehicleId);

if (!deleted) {
res.status(404).json({
success: false,
message: 'Vehicle not found'
});
return;
}

res.status(200).json({
success: true,
message: 'Vehicle deleted successfully'
});
} catch (error: any) {
if (error.message.includes('Cannot delete vehicle with active bookings')) {
res.status(400).json({
success: false,
message: error.message
});
return;
}
res.status(500).json({
success: false,
message: 'Error deleting vehicle'
});
}
}
}