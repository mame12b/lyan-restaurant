import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  uploadPaymentReceipt,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected user routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/payment-receipt', protect, uploadPaymentReceipt);
router.delete('/:id', protect, cancelBooking);

// Admin routes
router.get('/', protect, admin, getAllBookings);
router.get('/stats/overview', protect, admin, getBookingStats);
router.put('/:id/status', protect, admin, updateBookingStatus);

export default router;
