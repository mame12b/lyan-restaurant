import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validate
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister,validate, register);
router.post('/login', validateLogin,validate, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Protected routes
router.get('/logout', logout);
router.get('/refresh', refreshToken);
router.get('/me', protect, getMe);

export default router;