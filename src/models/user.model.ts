import pool from '../config/database';
import { User } from '../types';
import { logger } from '../utils/logger';

export class UserModel {
static async create(userData: {
name: string;
email: string;
password: string;
phone: string;
role: 'admin' | 'customer';
}): Promise<User> {
const query = `
INSERT INTO users (name, email, password, phone, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING *
`;

const values = [
userData.name,
userData.email.toLowerCase(),
userData.password,
userData.phone,
userData.role
];

try {
const result = await pool.query(query, values);
return result.rows[0];
} catch (error) {
logger.error('Error creating user:', error);
throw error;
}
}

static async findByEmail(email: string): Promise<User | null> {
const query = 'SELECT * FROM users WHERE email = $1';
const result = await pool.query(query, [email.toLowerCase()]);
return result.rows[0] || null;
}

static async findById(id: number): Promise<User | null> {
const query = 'SELECT id, name, email, phone, role FROM users WHERE id = $1';
const result = await pool.query(query, [id]);
return result.rows[0] || null;
}

static async findAll(): Promise<User[]> {
const query = 'SELECT id, name, email, phone, role FROM users ORDER BY created_at DESC';
const result = await pool.query(query);
return result.rows;
}

static async update(id: number, updateData: Partial<User>): Promise<User | null> {
const fields: string[] = [];
const values: any[] = [];
let paramIndex = 1;

Object.keys(updateData).forEach(key => {
if (updateData[key as keyof User] !== undefined) {
fields.push(`${key} = $${paramIndex}`);
values.push(updateData[key as keyof User]);
paramIndex++;
}
});

if (fields.length === 0) {
return this.findById(id);
}

values.push(id);
const query = `
UPDATE users
SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
WHERE id = $${paramIndex}
RETURNING *
`;

try {
const result = await pool.query(query, values);
return result.rows[0] || null;
} catch (error) {
logger.error('Error updating user:', error);
throw error;
}
}

static async delete(id: number): Promise<boolean> {
try {
const checkQuery = `
SELECT COUNT(*) as booking_count FROM bookings
WHERE customer_id = $1 AND status = 'active'
`;
const checkResult = await pool.query(checkQuery, [id]);

const bookingCount = parseInt(checkResult.rows[0]?.booking_count || '0');
if (bookingCount > 0) {
throw new Error('Cannot delete user with active bookings');
}

const query = 'DELETE FROM users WHERE id = $1';
const result = await pool.query(query, [id]);
return result.rowCount ? result.rowCount > 0 : false;
} catch (error) {
logger.error('Error deleting user:', error);
throw error;
}
}
}