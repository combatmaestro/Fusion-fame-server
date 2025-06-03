const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  clientName: String,
  clientPhone: String,
  service: String,
  slot: String,
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

module.exports = mongoose.model('Booking', bookingSchema);
