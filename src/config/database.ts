import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT || '5432'),
database: process.env.DB_NAME,
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
export const testConnection = async (): Promise<void> => {
try {
const client = await pool.connect();
console.log('Database connected successfully');
client.release();
} catch (error) {
console.error('Database connection error:', error);
process.exit(1);
}
};