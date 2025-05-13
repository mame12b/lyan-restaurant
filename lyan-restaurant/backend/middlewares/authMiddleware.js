import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/error.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) return next(createError(401, 'Not authenticated'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) return next(createError(401, 'User no longer exists'));
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(createError(401, error.message));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(createError(403, 
        `Access denied. Required roles: ${roles.join(', ')}`
      ));
    }
    next();
  };
};
// Ensure admin middleware is properly checking roles
export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Admin privileges required" });
  }
};