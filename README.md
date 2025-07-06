# Parlour Admin Dashboard

A full-stack web application for managing a parlour business with role-based access control, employee management, task assignment, and real-time attendance tracking.

## 🏗️ Architecture

This is a monorepo containing two separate applications:

- **Backend API** (`backend-parlour-api/`) - Node.js + TypeScript + Express + MongoDB
- **Frontend Dashboard** (`frontend-parlour-dashboard/`) - Next.js 15 + TypeScript + TailwindCSS + ShadCN UI

## 🚀 Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router) with TypeScript |
| UI Framework | TailwindCSS + ShadCN UI |
| Backend | Node.js + TypeScript (MVC Architecture) |
| Database | MongoDB with Mongoose ODM |
| Real-time | WebSocket using Socket.IO |
| Authentication | JWT-based authentication |

## 👥 User Roles

### Super Admin
- ✅ Full access to dashboard
- ✅ Add, view, update, delete employees
- ✅ Add, view, update, delete tasks
- ✅ View attendance logs
- ✅ Delete any data

### Admin
- ✅ Access to dashboard
- ✅ View employees and tasks (read-only)
- ✅ View attendance logs
- ❌ Cannot edit, update, or delete anything

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control
- Automatic token refresh and validation

### 👨‍💼 Employee Management
- Complete CRUD operations for employees
- Employee profiles with contact information
- Department and position tracking
- Active/inactive status management

### 📝 Task Management
- Task creation and assignment to employees
- Priority levels and status tracking
- Due date management
- Task history and updates

### ⏰ Real-time Attendance System
- **Public Punch Terminal** (`/attendance`) - For employee check-in/out
- **Live Dashboard Updates** - Real-time attendance feeds
- **WebSocket Integration** - Instant updates across all admin dashboards
- **Attendance History** - Comprehensive logging and reporting

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (v5+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd parlour-project
```

### 2. Setup Backend
```bash
cd backend-parlour-api
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed  # Create initial data
npm run dev   # Start on port 5001
```

### 3. Setup Frontend
```bash
cd ../frontend-parlour-dashboard
npm install
cp .env.example .env.local
# Edit .env.local with API URLs
npm run dev   # Start on port 3000
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Login**: Use credentials from seed script

## 🔑 Default Login Credentials

After running the seed script:

**Super Admin:**
- Email: `superadmin@parlour.com`
- Password: `password123`

**Regular Admin:**
- Email: `admin@parlour.com`
- Password: `password123`

## 📱 Application Pages

### Authentication
- `/login` - Secure login with role-based redirection

### Dashboard (Protected)
- `/dashboard` - Main overview with statistics
- `/dashboard/employees` - Employee management
- `/dashboard/tasks` - Task management  
- `/dashboard/attendance` - Attendance logs and history

### Public Terminal
- `/attendance` - Employee punch in/out kiosk interface

## 🔄 Real-time Features

The application provides live updates through WebSocket connections:

1. **Employee Punch Actions** - When an employee punches in/out at `/attendance`
2. **Admin Dashboard Updates** - All admin dashboards receive instant updates
3. **Live Statistics** - Real-time attendance counts and status changes

## 🛠️ Development

### Backend Development
```bash
cd backend-parlour-api
npm run dev     # Development with hot reload
npm run build   # Build TypeScript
npm start       # Production mode
npm run seed    # Reset and seed database
```

### Frontend Development
```bash
cd frontend-parlour-dashboard
npm run dev     # Development server
npm run build   # Production build
npm start       # Production mode
npm run lint    # Code linting
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Employees (Role-based access)
- `GET /api/employees` - List employees (Admin+)
- `POST /api/employees` - Create employee (Super Admin only)
- `PUT /api/employees/:id` - Update employee (Super Admin only)
- `DELETE /api/employees/:id` - Delete employee (Super Admin only)

### Tasks (Role-based access)
- `GET /api/tasks` - List tasks (Admin+)
- `POST /api/tasks` - Create task (Super Admin only)
- `PUT /api/tasks/:id` - Update task (Super Admin only)
- `DELETE /api/tasks/:id` - Delete task (Super Admin only)

### Attendance
- `GET /api/attendance` - Attendance history (Admin+)
- `GET /api/attendance/today` - Today's records (Admin+)
- `GET /api/attendance/employee-status` - Employee status (Public)
- `POST /api/attendance/punch` - Punch in/out (Public)

## 🔐 Security Features

- JWT token authentication
- Role-based route protection
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Password hashing with bcrypt

## 🚀 Production Deployment

### Environment Setup
1. Set production MongoDB URI
2. Generate secure JWT secret
3. Configure CORS origins
4. Set NODE_ENV to 'production'

### Build Commands
```bash
# Backend
cd backend-parlour-api
npm run build
npm start

# Frontend
cd frontend-parlour-dashboard
npm run build
npm start
```

## 🧪 Testing

The application includes comprehensive role-based testing:

1. **Super Admin Access** - Full CRUD operations
2. **Admin Access** - Read-only verification
3. **Authentication Flow** - Login/logout functionality
4. **Real-time Updates** - WebSocket event handling
5. **Public Terminal** - Attendance punch functionality


