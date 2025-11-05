import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lyan.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminEmail);
      console.log('Admin Details:');
      console.log('  Name:', existingAdmin.name);
      console.log('  Email:', existingAdmin.email);
      console.log('  Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name: 'LYAN Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
    console.log('\n🔐 Login URL: http://localhost:3000/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
