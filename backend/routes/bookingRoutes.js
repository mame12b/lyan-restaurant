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
import {
  validateCreateBooking,
  validateUpdateBookingStatus,
  validateUploadPaymentReceipt,
  validateMongoId,
  validatePagination,
  validate
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Protected user routes
router.post('/', protect, ...validateCreateBooking, validate, createBooking);
router.get(
  '/my-bookings',
  protect,
  ...validatePagination(),
  validate,
  getMyBookings
);
router.get('/:id', protect, validateMongoId(), validate, getBookingById);
router.put(
  '/:id/payment-receipt',
  protect,
  validateMongoId(),
  ...validateUploadPaymentReceipt,
  validate,
  uploadPaymentReceipt
);
router.delete('/:id', protect, validateMongoId(), validate, cancelBooking);

// Admin routes
router.get(
  '/',
  protect,
  admin,
  ...validatePagination(),
  validate,
  getAllBookings
);
router.get('/stats/overview', protect, admin, getBookingStats);
router.put(
  '/:id/status',
  protect,
  admin,
  validateMongoId(),
  ...validateUpdateBookingStatus,
  validate,
  updateBookingStatus
);

export default router;
