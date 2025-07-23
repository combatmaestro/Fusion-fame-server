// server.js or app.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import enquiryRoutes from './routes/enquiryRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: ["https://fusion-frontend-pink.vercel.app", "https://fusion-fame-admin.vercel.app"],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/bookings', bookingRoutes);
app.get('/api/sendReminders', sendReminders); // 🆕 for cron
// MongoDB connection (cached for Vercel)
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;

  try {
    const conn = await mongoose.connect('mongodb+srv://theadarshsahu:UC8kISxJHngcB5a9@cluster0.ksus6tq.mongodb.net/', {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    });
    cachedDb = conn;
    console.log('✅ MongoDB connected');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Ensure DB connection before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

export default app;
