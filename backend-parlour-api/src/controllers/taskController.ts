import { Response } from 'express';
import { Task } from '../models/Task';
import { Employee } from '../models/Employee';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email position')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate('assignedTo', 'name email position')
      .populate('assignedBy', 'name email');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const assignedBy = req.user?._id;

    // Validate required fields
    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({ error: 'Title, description, assignedTo, and dueDate are required' });
    }

    // Validate employee exists
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(400).json({ error: 'Assigned employee not found' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy,
      priority: priority || 'medium',
      dueDate: new Date(dueDate)
    });

    await task.save();
    
    // Populate the task with employee and user details
    await task.populate('assignedTo', 'name email position');
    await task.populate('assignedBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, assignedTo, status, priority, dueDate },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email position')
      .populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
