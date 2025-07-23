// routes/bookingRoutes.js
import express from 'express';
import {
  addBooking,
  getAllBookings,
  sendReminders
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/addBooking', addBooking);
router.get('/getAllBookings', getAllBookings);
router.get('/getAllBookings', sendReminders);

export default router;
