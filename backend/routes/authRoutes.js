// import express from 'express';
// import {
//   register,
//   login,
//   logout,
//   refreshToken,
//   verifyEmail,
//   forgotPassword,
//   resetPassword,
//   getMe
// } from '../controllers/authController.js';
// import { protect, restrictTo } from '../middlewares/authMiddleware.js';
// import {
//   validateRegister,
//   validateLogin,
//   validateForgotPassword,
//   validateResetPassword,
  
//   //validate
// } from '../middlewares/validationMiddleware.js';
// import { getUsers, getAdminDashboard } from "../controllers/adminController.js"



// const router = express.Router();


// router.get('/admin/dashboard', protect, restrictTo('admin'), getAdminDashboard);
// router.get('/user/dashboard', protect, restrictTo('user', 'admin'), (req, res) => {
//   res.json({ success: true, message: 'Welcome to user dashboard' });
// });
// // Public routes

// router.post('/register', validateRegister, register)
// router.post('/login', validateLogin, login);
// router.get('/verify-email/:token', verifyEmail);
// router.post('/forgot-password', validateForgotPassword, forgotPassword);
// router.post('/reset-password/:token', validateResetPassword, resetPassword);

// // Protected routes
// router.post('/logout', logout);
// router.post('/refresh', refreshToken);
// router.get('/me', protect, getMe);

// export default router;

import express from 'express';
import { 
  register,
  login,
  logout,
  getMe
} from '../controllers/authController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin routes moved to separate adminRoutes.js
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;