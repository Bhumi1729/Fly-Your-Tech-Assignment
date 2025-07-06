import { Router } from 'express';
import { 
  getEmployees, 
  getEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employeeController';
import { authenticateToken, requireSuperAdmin, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all employees - both admin and super admin can access
router.get('/', requireAdmin, getEmployees);

// Get single employee - both admin and super admin can access
router.get('/:id', requireAdmin, getEmployee);

// Create employee - only super admin can access
router.post('/', requireSuperAdmin, createEmployee);

// Update employee - only super admin can access
router.put('/:id', requireSuperAdmin, updateEmployee);

// Delete employee - only super admin can access
router.delete('/:id', requireSuperAdmin, deleteEmployee);

export default router;
