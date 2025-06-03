const express = require('express');
const router = express.Router();
const {
  addBooking,
  getAllBookings
} = require('../controllers/bookingController');

router.post('/addBooking', addBooking);
router.get('/getAllBookings', getAllBookings);

module.exports = router;
