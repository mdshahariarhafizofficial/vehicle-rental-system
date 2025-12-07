import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create pool with connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const testConnection = async (): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📊 Database time:', result.rows[0].current_time);
    
    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Available tables:', tables.rows.map((row: any) => row.table_name));
    
  } catch (error: any) {
    console.error('❌ Database connection error:', error.message);
    
    // Helpful error messages
    if (error.message.includes('password authentication failed')) {
      console.error('\n🔑 Password authentication failed. Possible solutions:');
      console.error('1. Check your .env file DATABASE_URL');
      console.error('2. Verify password in Neon dashboard');
      console.error('3. Reset password in Neon Settings → Reset Password');
    }
    
    if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('\n🌐 Host not found. Check DATABASE_URL hostname');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
  }
};

export default pool;