# Parlour Admin Dashboard - Frontend

This is the frontend application for the Parlour Admin Dashboard built with Next.js 15, TypeScript, TailwindCSS, and ShadCN UI.

## Features

- Next.js 15 with App Router
- TypeScript for type safety
- TailwindCSS for styling
- ShadCN UI components
- Real-time WebSocket integration
- Role-based access control
- Responsive design
- JWT authentication

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the frontend folder:
```bash
cd frontend-parlour-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
NEXT_PUBLIC_APP_NAME=Parlour Admin Dashboard
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

The application will start on http://localhost:3000

## Pages and Routes

### Authentication
- `/login` - User login page

### Dashboard (Protected Routes)
- `/dashboard` - Main dashboard with overview
- `/dashboard/employees` - Employee management
- `/dashboard/tasks` - Task management
- `/dashboard/attendance` - Attendance logs

### Public Routes
- `/attendance` - Employee punch in/out terminal

## User Roles & Permissions

### Super Admin
- Can access all dashboard sections
- Can create, edit, and delete employees
- Can create, edit, and delete tasks
- Can view all attendance records
- Full system access

### Admin
- Can access all dashboard sections
- Can only **view** employees (no editing/deletion)
- Can only **view** tasks (no editing/deletion)
- Can view all attendance records
- Read-only access

## Real-time Features

The application uses WebSocket connections to provide real-time updates:

- **Live Attendance Updates**: When employees punch in/out at the `/attendance` terminal, all admin dashboards receive instant updates
- **Automatic Refresh**: Dashboard attendance section updates automatically without page reload

## Components

The application uses ShadCN UI components for a consistent design:

- **Button** - Interactive buttons with variants
- **Card** - Content containers
- **Input** - Form input fields
- **Label** - Form labels

## API Integration

The frontend communicates with the backend via:

- **REST API** - For CRUD operations
- **WebSocket** - For real-time updates
- **JWT Authentication** - Secure token-based auth

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` - WebSocket server URL
- `NEXT_PUBLIC_APP_NAME` - Application name

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Default Login Credentials

**Super Admin:**
- Email: superadmin@parlour.com
- Password: password123

**Admin:**
- Email: admin@parlour.com
- Password: password123

## Project Structure

```
app/
├── dashboard/           # Dashboard pages
│   ├── attendance/      # Attendance management
│   ├── employees/       # Employee management
│   └── tasks/          # Task management
├── attendance/          # Public punch terminal
├── login/              # Authentication
├── globals.css         # Global styles
└── layout.tsx          # Root layout

components/
└── ui/                 # ShadCN UI components

lib/
├── api.ts              # API client
├── socket.ts           # WebSocket client
└── utils.ts            # Utility functions
```

## Features Overview

### Login Page (`/login`)
- Secure JWT authentication
- Role-based dashboard redirection
- Form validation and error handling

### Main Dashboard (`/dashboard`)
- Overview statistics
- Recent attendance activity
- Real-time updates via WebSocket
- Navigation to all sections

### Employee Management (`/dashboard/employees`)
- View all employees (Admin + Super Admin)
- Add/Edit/Delete employees (Super Admin only)
- Employee details and status

### Task Management (`/dashboard/tasks`)
- View all tasks (Admin + Super Admin)
- Create/Assign/Update tasks (Super Admin only)
- Task status and priority management

### Attendance Logs (`/dashboard/attendance`)
- View attendance history
- Filter by date ranges
- Real-time attendance updates

### Punch Terminal (`/attendance`)
- Public-facing employee check-in/out
- Visual employee cards
- Real-time status updates
- Touch-friendly interface for kiosks
