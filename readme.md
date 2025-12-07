🚗 Vehicle Rental System - Backend API
https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%2520web%2520tokens&logoColor=white

A comprehensive backend API for a vehicle rental management system built with Node.js, TypeScript, and PostgreSQL. This system handles vehicle inventory, customer management, booking operations, and role-based authentication.

✨ Features
🔐 Authentication & Authorization
JWT-based authentication with refresh tokens

Role-based access control (Admin/Customer)

Secure password hashing using bcrypt

Email verification and password reset functionality

🚗 Vehicle Management
CRUD operations for vehicles

Multiple vehicle types (Car, Bike, Van, SUV)

Real-time availability tracking

Daily rent price management

Unique registration number validation

👥 User Management
User registration and profile management

Admin and customer role management

Phone number and email validation

User activity tracking

📅 Booking System
Create, view, update, and cancel bookings

Automatic price calculation based on days

Vehicle availability validation

Booking status management (Active, Cancelled, Returned)

Date conflict prevention

🛡️ Security Features
Input validation and sanitization

SQL injection prevention

Cross-Origin Resource Sharing (CORS)

Rate limiting

Comprehensive error handling

🛠️ Technology Stack
Backend
Runtime: Node.js

Language: TypeScript

Framework: Express.js

Database: PostgreSQL (Neon.tech)

ORM: pg (PostgreSQL client for Node.js)

Authentication & Security
JWT: JSON Web Tokens for authentication

bcrypt: Password hashing

dotenv: Environment variable management

cors: Cross-Origin Resource Sharing

Development Tools
nodemon: Automatic server restart

ts-node: TypeScript execution

ESLint: Code linting

Prettier: Code formatting

📁 Project Structure
text
vehicle-rental-system/
├── src/
│   ├── config/          # Database and configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication and validation
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions and utilities
│   └── app.ts          # Main application file
├── .env                # Environment variables
├── .env.example        # Environment template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── database.sql        # Database schema
└── README.md           # Project documentation
🚀 Getting Started
Prerequisites
Node.js (v16 or higher)

PostgreSQL database (Local or Neon.tech)

npm or yarn package manager

Installation
Clone the repository

bash
git clone <repository-url>
cd vehicle-rental-system
Install dependencies

bash
npm install
Set up environment variables

bash
cp .env.example .env
Edit the .env file with your configuration:

env
PORT=5000
NODE_ENV=development

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10
Set up database

Create a Neon PostgreSQL database at neon.tech

Copy your connection string

Run the SQL script from database.sql in the Neon SQL Editor

Run the application

bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
📊 Database Schema
Users Table
sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Vehicles Table
sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Bookings Table
sql
CREATE TABLE bookings (
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
🌐 API Documentation
Base URL
text
http://localhost:5000
Authentication Endpoints
Register User
http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
Login User
http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
Vehicle Endpoints
Get All Vehicles (Public)
http
GET /api/v1/vehicles
Get Vehicle by ID (Public)
http
GET /api/v1/vehicles/:vehicleId
Create Vehicle (Admin Only)
http
POST /api/v1/vehicles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
Booking Endpoints
Create Booking (Authenticated)
http
POST /api/v1/bookings
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "vehicle_id": 1,
  "rent_start_date": "2024-12-15",
  "rent_end_date": "2024-12-20"
}
Get User Bookings
http
GET /api/v1/bookings
Authorization: Bearer <user_token>
User Endpoints
Get All Users (Admin Only)
http
GET /api/v1/users
Authorization: Bearer <admin_token>
Update User Profile
http
PUT /api/v1/users/:userId
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "01799999999"
}
🔐 Authentication
All protected endpoints require a JWT token in the Authorization header:

http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User Roles
Admin: Full system access to manage vehicles, users, and all bookings

Customer: Can register, view vehicles, create/manage own bookings

📦 Business Logic
Booking Price Calculation
text
total_price = daily_rent_price × number_of_days
number_of_days = rent_end_date - rent_start_date
Vehicle Availability Updates
When booking is created → Vehicle status changes to "booked"

When booking is cancelled → Vehicle status changes to "available"

When booking is returned → Vehicle status changes to "available"

Deletion Constraints
Users cannot be deleted if they have active bookings

Vehicles cannot be deleted if they have active bookings

Active bookings = bookings with status "active"

🧪 Testing the API
Using cURL
bash
# Health Check
curl http://localhost:5000/

# Register User
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"01712345678"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get All Vehicles
curl http://localhost:5000/api/v1/vehicles
Using VS Code REST Client
Create a test.http file:

http
### Health Check
GET http://localhost:5000/

### Register Admin
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "phone": "01712345678",
  "role": "admin"
}
🚢 Deployment
Deploying to Render.com
Create a new Web Service on Render

Connect your GitHub repository

Add environment variables

Set build command: npm run build

Set start command: npm start

Environment Variables for Production
env
NODE_ENV=production
PORT=10000
DATABASE_URL=your_production_database_url
JWT_SECRET=strong_production_secret
JWT_EXPIRE=1d
🐛 Troubleshooting
Common Issues
Database Connection Failed

Check DATABASE_URL in .env file

Verify database credentials

Ensure database is running

JWT Token Issues

Verify JWT_SECRET is set

Check token expiration

Ensure correct token format

CORS Errors

Check CORS configuration

Verify frontend origin

Validation Errors

Check request body format

Verify required fields

Development Commands
bash
# Run tests
npm test

# Check TypeScript compilation
npx tsc --noEmit

# Format code
npm run format

# Lint code
npm run lint
📝 API Response Format
Success Response
json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
Error Response
json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Error details
  ]
}
HTTP Status Codes
Code	Meaning	Usage
200	OK	Successful GET, PUT, DELETE
201	Created	Successful POST (resource created)
400	Bad Request	Validation errors, invalid input
401	Unauthorized	Missing or invalid authentication token
403	Forbidden	Valid token but insufficient permissions
404	Not Found	Resource doesn't exist
409	Conflict	Resource already exists
500	Internal Server Error	Unexpected server errors
🤝 Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Open a Pull Request

Code Style
Follow TypeScript best practices

Use meaningful variable names

Add comments for complex logic

Write tests for new features

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Authors
- **Name:** Md. Shahariar Hafiz  
- **Email:** shahariar.works@gmail.com  
- **GitHub:** [mdshahariarhafizofficial](https://github.com/mdshahariarhafizofficial)  
- **LinkedIn:** [devshahariarhafiz](https://www.linkedin.com/in/devshahariarhafiz)

🙏 Acknowledgments
Express.js team for the amazing framework

PostgreSQL community for the robust database

TypeScript team for type safety

All contributors and testers

📞 Support
For support, email your-email@example.com or create an issue in the repository.

🚀 Happy Coding! If you find this project useful, please give it a star! ⭐