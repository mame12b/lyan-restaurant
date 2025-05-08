import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/error.js';

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check both Authorization header and cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(createError(401, 'Not authorized, no token'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(createError(401, 'User belonging to this token no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Handle specific JWT errors
    let message = 'Not authorized, token failed';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }

    next(createError(401, message));
  }
};

 const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      return next(createError(403, 'Unauthorized: No user found in request'));
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return next(createError(403, 
        `Access denied for role: ${req.user.role}. Required roles: ${roles.join(', ')}`
      ));
    }

    next();
  };
};
export {protect, restrictTo}; 