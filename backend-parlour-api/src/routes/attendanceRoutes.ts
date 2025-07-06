import { Router } from 'express';
import { 
  getAttendance, 
  getEmployeeStatus, 
  punchInOut, 
  getTodayAttendance 
} from '../controllers/attendanceController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (for attendance terminal)
router.get('/employee-status', getEmployeeStatus);
router.post('/punch', punchInOut);

// Protected routes (for admin dashboard)
router.get('/', authenticateToken, requireAdmin, getAttendance);
router.get('/today', authenticateToken, requireAdmin, getTodayAttendance);

export default router;
