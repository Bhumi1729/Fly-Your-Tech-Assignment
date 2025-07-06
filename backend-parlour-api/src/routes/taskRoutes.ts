import { Router } from 'express';
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController';
import { authenticateToken, requireSuperAdmin, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all tasks - both admin and super admin can access
router.get('/', requireAdmin, getTasks);

// Get single task - both admin and super admin can access
router.get('/:id', requireAdmin, getTask);

// Create task - only super admin can access
router.post('/', requireSuperAdmin, createTask);

// Update task - only super admin can access
router.put('/:id', requireSuperAdmin, updateTask);

// Delete task - only super admin can access
router.delete('/:id', requireSuperAdmin, deleteTask);

export default router;
