const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdminUser = require('../models/adminUser');

dotenv.config(); // Load .env if present

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const existing = await AdminUser.findOne({ email: 'admin@fusionfame.com' });

    if (existing) {
      console.log('Admin already exists.');
    } else {
      const admin = new AdminUser({
        email: 'admin@ffhairstudio.com',
        password: 'FusionFame@1998', // Will be hashed automatically
      });
      await admin.save();
      console.log('✅ Admin created: admin@fusionfame.com / admin123');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeder error:', error);
    mongoose.disconnect();
  }
};

createAdmin();
