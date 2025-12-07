import pool from '../config/database';
import { Vehicle } from '../types';
import { logger } from '../utils/logger';

export class VehicleModel {
static async create(vehicleData: {
vehicle_name: string;
type: 'car' | 'bike' | 'van' | 'SUV';
registration_number: string;
daily_rent_price: number;
availability_status?: 'available' | 'booked';
}): Promise<Vehicle> {
const query = `
INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
VALUES ($1, $2, $3, $4, $5)
RETURNING *
`;

const values = [
vehicleData.vehicle_name,
vehicleData.type,
vehicleData.registration_number,
vehicleData.daily_rent_price,
vehicleData.availability_status || 'available'
];

try {
const result = await pool.query(query, values);
return result.rows[0];
} catch (error) {
logger.error('Error creating vehicle:', error);
throw error;
}
}

static async findAll(): Promise<Vehicle[]> {
const query = 'SELECT * FROM vehicles ORDER BY created_at DESC';
const result = await pool.query(query);
return result.rows;
}

static async findById(id: number): Promise<Vehicle | null> {
const query = 'SELECT * FROM vehicles WHERE id = $1';
const result = await pool.query(query, [id]);
return result.rows[0] || null;
}

static async findByRegistration(registrationNumber: string): Promise<Vehicle | null> {
const query = 'SELECT * FROM vehicles WHERE registration_number = $1';
const result = await pool.query(query, [registrationNumber]);
return result.rows[0] || null;
}

static async update(id: number, updateData: Partial<Vehicle>): Promise<Vehicle | null> {
const fields: string[] = [];
const values: any[] = [];
let paramIndex = 1;

Object.keys(updateData).forEach(key => {
if (updateData[key as keyof Vehicle] !== undefined) {
fields.push(`${key} = $${paramIndex}`);
values.push(updateData[key as keyof Vehicle]);
paramIndex++;
}
});

if (fields.length === 0) {
return this.findById(id);
}

values.push(id);
const query = `
UPDATE vehicles
SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
WHERE id = $${paramIndex}
RETURNING *
`;

try {
const result = await pool.query(query, values);
return result.rows[0] || null;
} catch (error) {
logger.error('Error updating vehicle:', error);
throw error;
}
}

static async delete(id: number): Promise<boolean> {
try {
const checkQuery = `
SELECT COUNT(*) as booking_count FROM bookings
WHERE vehicle_id = $1 AND status = 'active'
`;
const checkResult = await pool.query(checkQuery, [id]);

const bookingCount = parseInt(checkResult.rows[0]?.booking_count || '0');
if (bookingCount > 0) {
throw new Error('Cannot delete vehicle with active bookings');
}

const query = 'DELETE FROM vehicles WHERE id = $1';
const result = await pool.query(query, [id]);
return result.rowCount ? result.rowCount > 0 : false;
} catch (error) {
logger.error('Error deleting vehicle:', error);
throw error;
}
}

static async updateAvailability(id: number, status: 'available' | 'booked'): Promise<Vehicle | null> {
const query = `
UPDATE vehicles
SET availability_status = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *
`;

const result = await pool.query(query, [status, id]);
return result.rows[0] || null;
}
}