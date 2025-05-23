import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail 
} from '../services/emailService.js';
import { generateToken, generateRefreshToken } from '../services/tokenService.js';


const {
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  NODE_ENV
} = process.env;

export const register = async (req, res, next) => {
  console.log("Register route hit:", req.body);
  try {
    const { name, email, password } = req.body;

        // Prevent self-assigning admin role
      const userRole = req.body.role && req.user?.role === 'admin' ? role : 'user';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

     user = await User.create({
      email,
      password,
      name,
      role: userRole,
      isVerified: true
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Removed verification email sending code
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      user: { // Explicit user object
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
  }
    });

  } catch (err) {
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ADD THE MISSING USER LOOKUP CODE
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Account not verified. Please check your email.' 
      });
    }

    // // Token generation
    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
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

    res.json({
      success: true,
      token,
      user: userResponse
    });

  } catch (err) {
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
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
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

    const decoded = jwt.verify(token, JWT_SECRET);
    
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
