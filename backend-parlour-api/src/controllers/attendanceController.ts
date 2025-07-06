import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import { Employee } from '../models/Employee';
import { AuthRequest } from '../middleware/auth';

export const getAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    let filter: any = {};
    
    if (employeeId) {
      filter.employee = employeeId;
    }
    
    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const attendance = await Attendance.find(filter)
      .populate('employee', 'name email position')
      .sort({ timestamp: -1 });

    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEmployeeStatus = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find({ isActive: true }).select('name email position');
    
    const employeeStatuses = await Promise.all(
      employees.map(async (employee) => {
        const lastAttendance = await Attendance.findOne({ 
          employee: employee._id 
        }).sort({ timestamp: -1 });

        const isCheckedIn = lastAttendance?.action === 'punch_in';
        
        return {
          ...employee.toObject(),
          isCheckedIn,
          lastActivity: lastAttendance?.timestamp || null
        };
      })
    );

    res.json({ employees: employeeStatuses });
  } catch (error) {
    console.error('Get employee status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const punchInOut = async (req: Request, res: Response) => {
  try {
    const { employeeId, action, location, notes } = req.body;

    // Validate required fields
    if (!employeeId || !action) {
      return res.status(400).json({ error: 'Employee ID and action are required' });
    }

    if (!['punch_in', 'punch_out'].includes(action)) {
      return res.status(400).json({ error: 'Action must be punch_in or punch_out' });
    }

    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ error: 'Employee not found' });
    }

    // Get last attendance record for this employee
    const lastAttendance = await Attendance.findOne({ 
      employee: employeeId 
    }).sort({ timestamp: -1 });

    // Validate action sequence
    if (action === 'punch_in' && lastAttendance?.action === 'punch_in') {
      return res.status(400).json({ error: 'Employee is already checked in' });
    }

    if (action === 'punch_out' && (!lastAttendance || lastAttendance.action === 'punch_out')) {
      return res.status(400).json({ error: 'Employee must be checked in before checking out' });
    }

    const attendance = new Attendance({
      employee: employeeId,
      action,
      timestamp: new Date(),
      location,
      notes
    });

    await attendance.save();
    await attendance.populate('employee', 'name email position');

    // Emit socket event for real-time updates to admin room only
    const io = (req as any).app.get('io');
    io.to('admin_room').emit('attendance_update', {
      attendance,
      employee: {
        ...employee.toObject(),
        isCheckedIn: action === 'punch_in'
      }
    });

    res.status(201).json({
      message: `Successfully ${action.replace('_', ' ')}`,
      attendance
    });
  } catch (error) {
    console.error('Punch in/out error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTodayAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const attendance = await Attendance.find({
      timestamp: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
      .populate('employee', 'name email position')
      .sort({ timestamp: -1 });

    res.json({ attendance });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
