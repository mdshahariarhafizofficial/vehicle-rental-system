-- Create Users table
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
phone VARCHAR(20) NOT NULL,
role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
id SERIAL PRIMARY KEY,
vehicle_name VARCHAR(100) NOT NULL,
type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
registration_number VARCHAR(50) UNIQUE NOT NULL,
daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS bookings (
id SERIAL PRIMARY KEY,
customer_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE RESTRICT,
rent_start_date DATE NOT NULL,
rent_end_date DATE NOT NULL,
total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CHECK (rent_end_date > rent_start_date)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_vehicles_status ON vehicles(availability_status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);