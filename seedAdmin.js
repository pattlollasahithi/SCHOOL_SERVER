import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ schoolId: 'ADMIN123' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new User({
      name: 'School Admin',
      schoolId: 'ADMIN123',
      password: 'admin789',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('ID: ADMIN123');
    console.log('Password: admin789');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
