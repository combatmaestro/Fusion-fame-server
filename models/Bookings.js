// models/Booking.js
const mongoose = require('mongoose');

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

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
