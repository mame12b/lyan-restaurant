import express from 'express';
import {
  register,
  login,
  logout,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRegister, validateLogin, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Admin routes moved to separate adminRoutes.js
router.post('/register', [...validateRegister, validate], register);
router.post('/login', [...validateLogin, validate], login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;