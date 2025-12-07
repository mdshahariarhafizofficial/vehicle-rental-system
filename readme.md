🚗 Vehicle Rental System API
<div align="center">

Live API: https://vehicle-rental-system-nine.vercel.app/

A modern, scalable backend API for vehicle rental management

</div>
📖 Table of Contents
✨ Features

🛠 Tech Stack

🚀 Quick Start

⚙️ Configuration

📚 API Reference

🗄️ Database Schema

🔐 Authentication

☁️ Deployment

📁 Project Structure

🧪 Testing

🤝 Contributing

✨ Features
Feature	Description
🔐 Secure Authentication	JWT-based auth with refresh tokens
👥 Role-Based Access	Admin & Customer roles with permissions
🚗 Vehicle Management	Full CRUD operations for vehicles
📅 Smart Booking System	Date validation and availability checks
💰 Dynamic Pricing	Flexible pricing based on vehicle and duration
📊 Admin Dashboard	Comprehensive analytics and reporting
🔒 Security	Password hashing, CORS, input validation
📦 Type Safety	Full TypeScript support
☁️ Cloud Ready	Optimized for Vercel deployment
🛠 Tech Stack
Backend Framework
Node.js - JavaScript runtime

Express.js - Web framework

TypeScript - Type safety

Database
PostgreSQL - Relational database

pg-pool - Connection pooling

Security
JWT - Authentication tokens

bcrypt - Password hashing

CORS - Cross-origin resource sharing

dotenv - Environment management

Development
Nodemon - Hot reloading

ts-node - TypeScript execution

🚀 Quick Start
Prerequisites
Node.js ≥ 16.0.0

PostgreSQL ≥ 12.0

npm or yarn

Installation Steps
bash
# 1. Clone repository
git clone <repository-url>
cd vehicle-rental-system

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Build project
npm run build

# 5. Start server
npm start

# For development (auto-reload)
npm run dev
⚙️ Configuration
Environment Variables
Create .env file:

env
# ========================
# SERVER CONFIGURATION
# ========================
PORT=5000
NODE_ENV=development
API_VERSION=v1

# ========================
# DATABASE CONFIGURATION
# ========================
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental
DB_MAX_CONNECTIONS=20

# ========================
# JWT CONFIGURATION
# ========================
JWT_SECRET=your_super_secure_jwt_secret_key_change_this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ========================
# SECURITY CONFIGURATION
# ========================
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=http://localhost:3000,https://yourfrontend.com

# ========================
# RATE LIMITING
# ========================
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
📚 API Reference
Base URL
text
https://vehicle-rental-system-nine.vercel.app/
Health Check
GET / - Service status

http
GET /
Response:

json
{
  "success": true,
  "message": "Vehicle Rental System API is running",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoints": {
    "documentation": "/api-docs",
    "health": "/health",
    "auth": "/api/v1/auth",
    "users": "/api/v1/users",
    "vehicles": "/api/v1/vehicles",
    "bookings": "/api/v1/bookings"
  }
}
Authentication Endpoints
Method	Endpoint	Description	Auth Required
POST	/api/v1/auth/register	Register new user	❌ No
POST	/api/v1/auth/login	User login	❌ No
POST	/api/v1/auth/refresh	Refresh access token	✅ Yes
POST	/api/v1/auth/logout	User logout	✅ Yes
GET	/api/v1/auth/me	Get current user	✅ Yes
User Management
Method	Endpoint	Description	Role Required
GET	/api/v1/users	List all users	👑 Admin
GET	/api/v1/users/:id	Get user by ID	👑 Admin
PUT	/api/v1/users/:id	Update user	👑 Admin
DELETE	/api/v1/users/:id	Delete user	👑 Admin
GET	/api/v1/users/profile	Get own profile	👤 All
PUT	/api/v1/users/profile	Update own profile	👤 All
Vehicle Management
Method	Endpoint	Description	Auth Required
GET	/api/v1/vehicles	List all vehicles	❌ No
GET	/api/v1/vehicles/:id	Get vehicle details	❌ No
POST	/api/v1/vehicles	Add new vehicle	✅ Yes (Admin)
PUT	/api/v1/vehicles/:id	Update vehicle	✅ Yes (Admin)
DELETE	/api/v1/vehicles/:id	Delete vehicle	✅ Yes (Admin)
GET	/api/v1/vehicles/search	Search vehicles	❌ No
GET	/api/v1/vehicles/available	Available vehicles	❌ No
Booking Management
Method	Endpoint	Description	Role Required
POST	/api/v1/bookings	Create booking	👤 Customer
GET	/api/v1/bookings	Get user bookings	👤 Customer
GET	/api/v1/bookings/:id	Get booking details	👤 Owner/Admin
PUT	/api/v1/bookings/:id/cancel	Cancel booking	👤 Owner/Admin
GET	/api/v1/bookings/all	All bookings	👑 Admin
PUT	/api/v1/bookings/:id/status	Update status	👑 Admin
🗄️ Database Schema
Users Table
sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Role: 'admin', 'customer'
    role VARCHAR(20) DEFAULT 'customer',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    CONSTRAINT chk_role CHECK (role IN ('admin', 'customer'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
Vehicles Table
sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    
    -- Basic Information
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE,
    
    -- Specifications
    vehicle_type VARCHAR(50), -- 'sedan', 'suv', 'truck', 'van'
    transmission VARCHAR(20), -- 'manual', 'automatic'
    fuel_type VARCHAR(20), -- 'petrol', 'diesel', 'electric', 'hybrid'
    seats INTEGER DEFAULT 5,
    mileage INTEGER,
    
    -- Rental Details
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    current_location VARCHAR(255),
    
    -- Media
    image_url TEXT,
    images TEXT[],
    
    -- Features
    features TEXT[] DEFAULT '{}',
    
    -- Description
    description TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'maintenance', 'sold'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_year CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    CONSTRAINT chk_daily_rate CHECK (daily_rate > 0),
    CONSTRAINT chk_status CHECK (status IN ('active', 'maintenance', 'sold'))
);

CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicles_available ON vehicles(is_available) WHERE is_available = TRUE;
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
Bookings Table
sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    
    -- Relationships
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Booking Period
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
    
    -- Pricing
    daily_rate_at_booking DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - discount_amount) STORED,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'active', 'completed', 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded', 'failed'
    
    -- Payment Info
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Pickup/Dropoff
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_dropoff_time TIMESTAMP WITH TIME ZONE,
    
    -- Additional Info
    special_requests TEXT,
    driver_license_number VARCHAR(50),
    driver_license_image TEXT,
    
    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    refund_amount DECIMAL(10,2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_dates CHECK (start_date <= end_date),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_status ON bookings(status);
Reviews Table (Optional Enhancement)
sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER UNIQUE REFERENCES bookings(id),
    user_id INTEGER REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_vehicle ON reviews(vehicle_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
🔐 Authentication
Token Flow
text
1. User Login → Returns {accessToken, refreshToken}
2. Access Token → Short-lived (15 minutes)
3. Refresh Token → Long-lived (7 days)
4. Token Refresh → Exchange refreshToken for new accessToken
Request Headers
http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Example: User Registration
http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
Example: User Login
http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
Response:

json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
☁️ Deployment
Deploy to Vercel
Step 1: Prepare Repository
bash
# Commit all changes
git add .
git commit -m "🚀 Ready for deployment"

# Push to GitHub
git push origin main
Step 2: Vercel Setup
Go to Vercel Dashboard

Click "Add New Project"

Import your GitHub repository

Configure project settings:

Step 3: Environment Variables in Vercel
Add these in Vercel Project Settings → Environment Variables:

Variable	Value	Required
DATABASE_URL	postgresql://user:pass@host:port/db	✅ Yes
JWT_SECRET	Your secret key	✅ Yes
NODE_ENV	production	✅ Yes
PORT	(Leave empty)	❌ No
CORS_ORIGINS	Your frontend URLs	❌ No
Step 4: Deploy
Vercel automatically detects your project type

Builds using npm run build

Deploys to global CDN

Provides live URL instantly

Step 5: Post-Deployment
Test API Endpoints:

bash
curl https://vehicle-rental-system-nine.vercel.app/
Monitor Logs:

Vercel Dashboard → Project → Logs

Set Up Custom Domain (Optional):

Project Settings → Domains

Deployment Files
vercel.json

json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/app.js"
    }
  ]
}
package.json (Relevant sections)

json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "nodemon src/app.ts"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
📁 Project Structure
text
vehicle-rental-system/
├── 📂 src/
│   ├── 📂 config/          # Configuration files
│   │   ├── database.ts     # DB connection & pool
│   │   └── constants.ts    # App constants
│   │
│   ├── 📂 controllers/     # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── vehicle.controller.ts
│   │   └── booking.controller.ts
│   │
│   ├── 📂 middleware/      # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── 📂 models/          # Database models
│   │   ├── user.model.ts
│   │   ├── vehicle.model.ts
│   │   └── booking.model.ts
│   │
│   ├── 📂 routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── vehicle.routes.ts
│   │   └── booking.routes.ts
│   │
│   ├── 📂 services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── vehicle.service.ts
│   │   └── booking.service.ts
│   │
│   ├── 📂 types/           # TypeScript types
│   │   ├── express.d.ts    # Express type extensions
│   │   ├── user.types.ts
│   │   ├── vehicle.types.ts
│   │   └── booking.types.ts
│   │
│   ├── 📂 utils/           # Utility functions
│   │   ├── logger.ts       # Custom logger
│   │   ├── validators.ts   # Input validation
│   │   ├── helpers.ts      # Helper functions
│   │   └── apiResponse.ts  # Standardized responses
│   │
│   └── 🚀 app.ts          # Main application file
│
├── 📂 dist/               # Compiled JavaScript
├── 📂 docs/              # Documentation
├── 📜 .env.example       # Environment template
├── 📜 .gitignore        # Git ignore rules
├── 📜 package.json      # Dependencies
├── 📜 tsconfig.json     # TypeScript config
├── 📜 vercel.json       # Vercel deployment
└── 📜 README.md         # This file
🧪 Testing
API Testing with Postman
Import Collection:

Import docs/Vehicle-Rental-API.postman_collection.json

Set Environment Variables in Postman:

json
{
  "base_url": "https://vehicle-rental-system-nine.vercel.app",
  "access_token": "{{login_token}}",
  "admin_token": "{{admin_login_token}}"
}
Test Flow:

text
1. Register User
2. Login → Save token
3. Test Protected Endpoints
4. Test Admin Endpoints
Manual Testing
bash
# Health Check
curl https://vehicle-rental-system-nine.vercel.app/

# Register User
curl -X POST https://vehicle-rental-system-nine.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# List Vehicles
curl https://vehicle-rental-system-nine.vercel.app/api/v1/vehicles
🤝 Contributing
Development Workflow
Fork the repository

Create a feature branch:

bash
git checkout -b feature/amazing-feature
Make your changes

Commit with descriptive message:

bash
git commit -m "feat: add new vehicle search filters"
Push to branch:

bash
git push origin feature/amazing-feature
Open a Pull Request

Commit Convention
feat: New feature

fix: Bug fix

docs: Documentation

style: Code style

refactor: Code refactoring

test: Testing

chore: Maintenance

📄 License
This project is licensed under the ISC License.

👥 Authors
- **Name:** Md. Shahariar Hafiz  
- **Email:** shahariar.works@gmail.com  
- **GitHub:** [mdshahariarhafizofficial](https://github.com/mdshahariarhafizofficial)  
- **LinkedIn:** [devshahariarhafiz](https://www.linkedin.com/in/devshahariarhafiz)


🙏 Acknowledgments
Express.js Team - For the amazing framework

PostgreSQL Community - Robust database system

Vercel - Incredible hosting platform

Open Source Contributors - For inspiration and tools

📞 Support
Issues: GitHub Issues

Email: your.email@example.com

Documentation: API Docs

<div align="center">
🌟 Star this repository if you find it useful!
Happy Coding! 🚀

</div>