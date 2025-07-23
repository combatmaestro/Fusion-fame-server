// controllers/bookingController.js

import Booking from '../models/Bookings.js';
import dayjs from 'dayjs';
import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_SID || 'ACc21171bb38a7949c943a466dd385442a';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_TOKEN || '9dd4dc77df2b7e07da426fd4d26564cb';
const TWILIO_FROM = process.env.TWILIO_FROM || '+19063598066'; // fallback

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// @desc    Create a new booking
// @route   POST /api/bookings/addBooking
export const addBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // Send SMS immediately if appointment is within 1 hour
    const now = dayjs();
    const appointment = dayjs(booking.appointmentTime);

    if (appointment.diff(now, 'minute') < 60) {
      await client.messages.create({
        body: `Hello ${booking.clientName}, this is a reminder for your appointment at ${appointment.format('hh:mm A')}.`,
        from: TWILIO_FROM,
        to: booking.clientPhone,
      });

      booking.smsReminderSent = true;
      await booking.save();
    }

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings/getAllBookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Send reminders for upcoming bookings
// @route   GET /api/bookings/sendReminders
export const sendReminders = async (req, res) => {
  try {
    const now = dayjs();
    const start = now.add(55, 'minute').toDate(); // 55 mins from now
    const end = now.add(65, 'minute').toDate();   // 65 mins from now

    const bookings = await Booking.find({
      smsReminderSent: false,
      appointmentTime: { $gte: start, $lte: end },
    });

    const results = [];

    for (const booking of bookings) {
      try {
        const message = await client.messages.create({
          body: `Hello ${booking.clientName}, this is a reminder for your appointment at ${dayjs(booking.appointmentTime).format('hh:mm A')}.`,
          from: TWILIO_FROM,
          to: booking.clientPhone,
        });

        booking.smsReminderSent = true;
        await booking.save();

        results.push({ to: booking.clientPhone, status: 'sent', sid: message.sid });
      } catch (smsErr) {
        console.error(`SMS failed for ${booking.clientPhone}:`, smsErr.message);
        results.push({ to: booking.clientPhone, status: 'failed', error: smsErr.message });
      }
    }

    res.status(200).json({ message: `✅ Processed ${results.length} reminders`, results });
  } catch (err) {
    console.error('Reminder error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
