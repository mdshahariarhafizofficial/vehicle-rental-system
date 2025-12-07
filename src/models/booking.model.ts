import pool from '../config/database';
import { Booking } from '../types';
import { logger } from '../utils/logger';

export class BookingModel {
static async create(bookingData: {
customer_id: number;
vehicle_id: number;
rent_start_date: Date;
rent_end_date: Date;
total_price: number;
}): Promise<Booking> {
const query = `
INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
VALUES ($1, $2, $3, $4, $5, 'active')
RETURNING *
`;

const values = [
bookingData.customer_id,
bookingData.vehicle_id,
bookingData.rent_start_date,
bookingData.rent_end_date,
bookingData.total_price
];

try {
const result = await pool.query(query, values);
return result.rows[0];
} catch (error) {
logger.error('Error creating booking:', error);
throw error;
}
}

static async findAll(): Promise<Booking[]> {
const query = `
SELECT b.*,
u.name as customer_name, u.email as customer_email,
v.vehicle_name, v.registration_number
FROM bookings b
LEFT JOIN users u ON b.customer_id = u.id
LEFT JOIN vehicles v ON b.vehicle_id = v.id
ORDER BY b.created_at DESC
`;
const result = await pool.query(query);
return result.rows;
}

static async findByCustomerId(customerId: number): Promise<Booking[]> {
const query = `
SELECT b.*,
v.vehicle_name, v.registration_number, v.type
FROM bookings b
LEFT JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.customer_id = $1
ORDER BY b.created_at DESC
`;
const result = await pool.query(query, [customerId]);
return result.rows;
}

static async findById(id: number): Promise<Booking | null> {
const query = `
SELECT b.*,
u.name as customer_name, u.email as customer_email,
v.vehicle_name, v.registration_number, v.daily_rent_price
FROM bookings b
LEFT JOIN users u ON b.customer_id = u.id
LEFT JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.id = $1
`;
const result = await pool.query(query, [id]);
return result.rows[0] || null;
}

static async update(id: number, updateData: Partial<Booking>): Promise<Booking | null> {
const fields: string[] = [];
const values: any[] = [];
let paramIndex = 1;

Object.keys(updateData).forEach(key => {
if (updateData[key as keyof Booking] !== undefined) {
fields.push(`${key} = $${paramIndex}`);
values.push(updateData[key as keyof Booking]);
paramIndex++;
}
});

if (fields.length === 0) {
return this.findById(id);
}

values.push(id);
const query = `
UPDATE bookings
SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
WHERE id = $${paramIndex}
RETURNING *
`;

try {
const result = await pool.query(query, values);
return result.rows[0] || null;
} catch (error) {
logger.error('Error updating booking:', error);
throw error;
}
}

static async checkVehicleAvailability(vehicleId: number, startDate: Date, endDate: Date): Promise<boolean> {
const query = `
SELECT COUNT(*) as conflict_count FROM bookings
WHERE vehicle_id = $1
AND status = 'active'
AND (
(rent_start_date <= $2 AND rent_end_date >= $2) OR
(rent_start_date <= $3 AND rent_end_date >= $3) OR
(rent_start_date >= $2 AND rent_end_date <= $3)
)
`;

const result = await pool.query(query, [vehicleId, startDate, endDate]);
const conflictCount = parseInt(result.rows[0]?.conflict_count || '0');
return conflictCount === 0;
}
}