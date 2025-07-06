import mongoose from 'mongoose';
import { User } from './models/User';
import { Employee } from './models/Employee';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const superAdmin = new User({
      email: 'superadmin@parlour.com',
      password: 'password123',
      name: 'Super Administrator',
      role: 'super_admin'
    });

    const admin = new User({
      email: 'admin@parlour.com',
      password: 'password123',
      name: 'Administrator',
      role: 'admin'
    });

    await superAdmin.save();
    await admin.save();
    console.log('Created users');

    // Create sample employees
    const employees = [
      {
        name: 'Alice Johnson',
        email: 'alice@parlour.com',
        phone: '+1234567890',
        position: 'Hair Stylist',
        department: 'Hair Care',
        joinDate: new Date('2023-01-15')
      },
      {
        name: 'Bob Smith',
        email: 'bob@parlour.com',
        phone: '+1234567891',
        position: 'Nail Technician',
        department: 'Nail Care',
        joinDate: new Date('2023-02-20')
      },
      {
        name: 'Carol Williams',
        email: 'carol@parlour.com',
        phone: '+1234567892',
        position: 'Esthetician',
        department: 'Skin Care',
        joinDate: new Date('2023-03-10')
      },
      {
        name: 'David Brown',
        email: 'david@parlour.com',
        phone: '+1234567893',
        position: 'Massage Therapist',
        department: 'Wellness',
        joinDate: new Date('2023-04-05')
      }
    ];

    await Employee.insertMany(employees);
    console.log('Created sample employees');

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('Super Admin Login:');
    console.log('Email: superadmin@parlour.com');
    console.log('Password: password123');
    console.log('\nAdmin Login:');
    console.log('Email: admin@parlour.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
