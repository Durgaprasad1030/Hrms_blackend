HRMS Backend API

This is the backend server for the Human Resource Management System (HRMS). It provides a RESTful API for managing organisations, employees, teams, and audit logs.

🛠️ Tech Stack

Runtime: Node.js

Framework: Express.js

Database: MongoDB (using Mongoose ODM)

Authentication: JWT (JSON Web Tokens)

Security: bcryptjs (Password hashing), cors (Cross-Origin Resource Sharing)

🚀 Getting Started

1. Prerequisites

Node.js (v14 or higher) installed.

A MongoDB Atlas account (or local MongoDB installed).

2. Installation

Navigate to the backend directory and install dependencies:

cd backend
npm install


3. Environment Configuration

Create a .env file in the backend root folder:

PORT=5000
# Replace <password> with your actual database password
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hrms_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_123


4. Database Seeding (First Time Setup)

To populate the database with an Admin user and sample data:

node src/seed.js


This will create an Organisation, an Admin user (admin@tech.com / password123), dummy employees, and teams.

5. Running the Server

Development Mode (Auto-restart):

npm run dev


Production Mode:

npm start


Server will start at: http://localhost:5000

📡 API Endpoints

Authentication

POST /api/auth/register - Register a new Organisation & Admin

POST /api/auth/login - Login and receive JWT

Employees (Protected)

GET /api/employees - List all employees

POST /api/employees - Create a new employee

DELETE /api/employees/:id - Delete an employee

Teams (Protected)

GET /api/teams - List all teams

POST /api/teams - Create a new team

POST /api/teams/:id/members - Add employee to team

DELETE /api/teams/:id/members/:employeeId - Remove employee from team

Logs (Protected)

GET /api/logs - View system audit logs

📂 Project Structure

src/
├── config/         # Database connection
├── controllers/    # Business logic
├── middleware/     # JWT authentication check
├── models/         # MongoDB schemas
├── routes/         # Route definitions
├── seed.js         # Sample data seeder
└── server.js       # Entry point

"# Hrms_blackend" 
