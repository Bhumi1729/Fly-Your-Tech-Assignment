# Parlour Admin Dashboard - Backend API

This is the backend API for the Parlour Admin Dashboard built with Node.js, TypeScript, Express, and MongoDB.

## Features

- JWT-based authentication with role-based access control
- RESTful APIs for employees, tasks, and attendance management
- Real-time WebSocket connections for live attendance updates
- MongoDB integration with Mongoose ODM
- TypeScript for type safety
- MVC architecture pattern

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend folder:
```bash
cd backend-parlour-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/parlour_db
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
CLIENT_URL=http://localhost:3000
```

5. Seed the database with initial data:
```bash
npm run seed
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on http://localhost:5001

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)
- `GET /api/auth/profile` - Get user profile

### Employees
- `GET /api/employees` - Get all employees (Admin+)
- `GET /api/employees/:id` - Get employee by ID (Admin+)
- `POST /api/employees` - Create employee (Super Admin only)
- `PUT /api/employees/:id` - Update employee (Super Admin only)
- `DELETE /api/employees/:id` - Delete employee (Super Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks (Admin+)
- `GET /api/tasks/:id` - Get task by ID (Admin+)
- `POST /api/tasks` - Create task (Super Admin only)
- `PUT /api/tasks/:id` - Update task (Super Admin only)
- `DELETE /api/tasks/:id` - Delete task (Super Admin only)

### Attendance
- `GET /api/attendance` - Get attendance records (Admin+)
- `GET /api/attendance/today` - Get today's attendance (Admin+)
- `GET /api/attendance/employee-status` - Get employee status (Public)
- `POST /api/attendance/punch` - Punch in/out (Public)

## User Roles

### Super Admin
- Full access to all features
- Can create, read, update, and delete all data
- Can manage users, employees, tasks, and view attendance

### Admin
- Read-only access to employees and tasks
- Can view attendance logs
- Cannot create, update, or delete any data

## Default Users

After running the seed script, use these credentials:

**Super Admin:**
- Email: superadmin@parlour.com
- Password: password123

**Admin:**
- Email: admin@parlour.com
- Password: password123

## WebSocket Events

- `join_admin` - Join admin room for real-time updates
- `leave_admin` - Leave admin room
- `attendance_update` - Receive attendance updates

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # MongoDB schemas
├── routes/         # API routes
├── seed.ts         # Database seeding
└── server.ts       # Main server file
```
