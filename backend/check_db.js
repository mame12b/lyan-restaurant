
import mongoose from 'mongoose';
import Inquiry from './models/Inquiry.js';
import Booking from './models/Booking.js';
import 'dotenv/config';

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);
    console.log('Recent Inquiries:', inquiries);

    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
    console.log('Recent Bookings:', bookings);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDB();
