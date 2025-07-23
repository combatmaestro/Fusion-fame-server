// controllers/bookingController.js

import Booking from '../models/Bookings.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import twilio from 'twilio';
import dbConnect  from "../lib/dbConnect.js";
const TWILIO_ACCOUNT_SID =  'ACc21171bb38a7949c943a466dd385442a';
const TWILIO_AUTH_TOKEN =  '4813f15866cea931c7cb2cca223cac56';
const TWILIO_FROM =  '+19063598066'; // fallback

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// @desc    Create a new booking
// @route   POST /api/bookings/addBooking
export const addBooking = async (req, res) => {
  try {
    const { clientName, clientPhone, service, slot } = req.body;

    if (!clientName || !clientPhone || !slot) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const [startStr] = slot.split('-');
let startHour = Number(startStr);

// Convert to 24-hour format assuming all slots are in PM (1–12 PM)
if (startHour >= 1 && startHour <= 7) {
  startHour += 12; // e.g., 1 becomes 13, 2 becomes 14 (i.e., 1 PM, 2 PM, etc.)
}

    // ✅ Convert IST to UTC before saving
    const todayIST = dayjs().tz('Asia/Kolkata').hour(startHour).minute(0).second(0).millisecond(0);
    const appointmentTime = todayIST.utc().toDate(); // save as UTC

    const booking = new Booking({
      clientName,
      clientPhone,
      service,
      slot,
      appointmentTime,
    });

    await booking.save();

    const now = dayjs().tz('Asia/Kolkata');
    const diffMinutes = todayIST.diff(now, 'minute'); // use IST diff

    if (diffMinutes < 60) {
      await client.messages.create({
        body: `Hello ${clientName}, this is a reminder for your appointment at ${todayIST.format('hh:mm A')}.`,
        from: TWILIO_FROM,
        to: clientPhone.startsWith('+') ? clientPhone : '+91' + clientPhone,
      });

      booking.smsReminderSent = true;
      await booking.save();
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
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
  await dbConnect(); // Ensure DB connection
  try {
    const nowIST = dayjs().tz('Asia/Kolkata'); // Local time in IST
    const start = nowIST.toDate(); // current IST time
    const end = nowIST.add(60, 'minute').toDate(); // next 60 mins

    // Booking.appointmentTime is stored in UTC
    // So compare against UTC equivalents of the IST range
    const startUTC = dayjs(start).utc().toDate();
    const endUTC = dayjs(end).utc().toDate();

    const bookings = await Booking.find({
      smsReminderSent: false,
      appointmentTime: { $gte: startUTC, $lte: endUTC },
    });

    console.log(`[DEBUG] Time now IST: ${nowIST.format()}`);
    console.log(`[DEBUG] Found ${bookings.length} upcoming bookings for reminder`);

    const results = [];

    for (const booking of bookings) {
      try {
        const appointmentTimeIST = dayjs(booking.appointmentTime).tz('Asia/Kolkata').format('hh:mm A');

        const message = await client.messages.create({
          body: `Hello ${booking.clientName}, this is a reminder for your appointment at ${appointmentTimeIST}.`,
          from: TWILIO_FROM,
          to: booking.clientPhone.startsWith('+') ? booking.clientPhone : '+91' + booking.clientPhone,
        });

        booking.smsReminderSent = true;
        await booking.save();

        results.push({ to: booking.clientPhone, status: 'sent', sid: message.sid });
      } catch (smsErr) {
        console.error(`[ERROR] Failed to send SMS to ${booking.clientPhone}:`, smsErr.message);
        results.push({ to: booking.clientPhone, status: 'failed', error: smsErr.message });
      }
    }

    res.status(200).json({ message: `✅ Sent ${results.length} reminders`, results });
  } catch (err) {
    console.error('Reminder error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

