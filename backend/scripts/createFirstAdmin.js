import mongoose from 'mongoose';
import User from '../models/User.js';

// const MONGO_URI = 'mongodb://localhost:27017/certchain';
const JWT_SECRET = '04aec33f0b0d15fd7e71fbdd694342e342875d3898379eb37ddae75d35f74f98b2d9934c9747be0d5a9815b587228406546e6f0b34c72039b64a778ec7c722a5';

async function createFirstAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create first admin user
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@system.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin'
    });

    await adminUser.save();
    console.log('First admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createFirstAdmin(); 