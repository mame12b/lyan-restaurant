import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { sendPasswordResetEmail } from '../services/emailService.js';
import {
  generateToken,
  generateRefreshToken,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
} from '../services/tokenService.js';


const { NODE_ENV } = process.env;

export const register = async (req, res, next) => {
  console.log("Register route hit:", req.body);
  try {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prevent self-assigning admin role (default to 'user')
    const userRole = 'user';

    // Create user with hashed password
    user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: userRole,
      isVerified: true
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Prepare user response (remove password)
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: userResponse
    });

  } catch (err) {
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    console.log('Login attempt:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // ADD THE MISSING USER LOOKUP CODE
    const { email, password } = req.body;
    console.log('Looking for user with email:', email);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', user.email, 'Role:', user.role);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('Password matches');

    if (!user.isVerified) {
      console.log('User not verified');
      return res.status(403).json({ 
        message: 'Account not verified. Please check your email.' 
      });
    }

    console.log('Generating tokens...');
    // Token generation
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
  
    // Cookie setup
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // User response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Login successful, sending response');
    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });

  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

  const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const token = generateToken(user);
    

    res.json({
      success: true,
      token
    });

  } catch (err) {
    next(err);
  }
};



export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'If an account exists, a password reset email has been sent' 
      });
    }

    const resetToken = generateToken(user, '15m');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;
    const { password } = req.body;

  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    next(err);
  }
};
export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
