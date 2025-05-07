import { body, param, validationResult } from 'express-validator';
import User from '../models/User.js';

// // Error formatter
// const errorFormatter = ({ msg, param }) => {
//   return {
//     field: param,
//     message: msg
//   };
// };

// export const validateRegister = [
//   body('name').notEmpty().withMessage('Name is required'),
//   body('email').isEmail().withMessage('Invalid email'),
//   body('password')
//     .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
//     .matches(/\d/).withMessage('Password must contain a number'),
// ];

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


// Forgot password validation
export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  
  validate
];

// Reset password validation
export const validateResetPassword = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  
  param('token')
    .notEmpty().withMessage('Token is required'),
  
  validate
];
// validationMiddleware.js
export const validateRegister = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  validate
];