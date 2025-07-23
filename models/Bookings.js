// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  clientName: String,
  clientPhone: {
    type: String,
    required: true,
  },
  service: String,
  slot: String,
  appointmentTime: {
    type: Date,
    required: true,
  },
  smsReminderSent: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
