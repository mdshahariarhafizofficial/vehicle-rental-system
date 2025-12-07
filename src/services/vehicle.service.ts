import { VehicleModel } from '../models/vehicle.model';
import { Vehicle } from '../types';

export class VehicleService {
static async createVehicle(vehicleData: {
vehicle_name: string;
type: 'car' | 'bike' | 'van' | 'SUV';
registration_number: string;
daily_rent_price: number;
availability_status?: 'available' | 'booked';
}): Promise<Vehicle> {
const existingVehicle = await VehicleModel.findByRegistration(vehicleData.registration_number);
if (existingVehicle) {
throw new Error('Vehicle with this registration number already exists');
}

return await VehicleModel.create(vehicleData);
}

static async getAllVehicles(): Promise<Vehicle[]> {
return await VehicleModel.findAll();
}

static async getVehicleById(id: number): Promise<Vehicle | null> {
return await VehicleModel.findById(id);
}

static async updateVehicle(id: number, updateData: Partial<Vehicle>): Promise<Vehicle | null> {
if (updateData.registration_number) {
const existingVehicle = await VehicleModel.findByRegistration(updateData.registration_number);
if (existingVehicle && existingVehicle.id !== id) {
throw new Error('Vehicle with this registration number already exists');
}
}

return await VehicleModel.update(id, updateData);
}

static async deleteVehicle(id: number): Promise<boolean> {
return await VehicleModel.delete(id);
}
}