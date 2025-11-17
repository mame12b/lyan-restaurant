import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  uploadPaymentReceipt,
  cancelBooking,
  getBookingStats,
  createManualBooking
} from '../controllers/bookingController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  validateCreateBooking,
  validateUpdateBookingStatus,
  validateUploadPaymentReceipt,
  validateMongoId,
  validatePagination,
  validate
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Specific routes MUST come before parameterized routes
// Admin routes - specific paths first
router.get('/stats/overview', protect, admin, getBookingStats);
router.post('/manual', protect, admin, createManualBooking); // Admin can add WhatsApp bookings manually
router.get(
  '/',
  protect,
  admin,
  ...validatePagination(),
  validate,
  getAllBookings
);

// Protected user routes - specific paths first
router.get(
  '/my-bookings',
  protect,
  ...validatePagination(),
  validate,
  getMyBookings
);

router.post('/', protect, ...validateCreateBooking, validate, createBooking);

// Parameterized routes come LAST
router.get('/:id', protect, validateMongoId(), validate, getBookingById);
router.put(
  '/:id/status',
  protect,
  admin,
  validateMongoId(),
  ...validateUpdateBookingStatus,
  validate,
  updateBookingStatus
);
router.put(
  '/:id/payment-receipt',
  protect,
  validateMongoId(),
  ...validateUploadPaymentReceipt,
  validate,
  uploadPaymentReceipt
);
router.delete('/:id', protect, validateMongoId(), validate, cancelBooking);

export default router;
