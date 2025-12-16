import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
    lowercase: true,
    trim: true,
  
      // ... existing config
     // collation: { locale: 'en', strength: 2 } // Add this line
    
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    // validate: {
    //   validator: function(v) {
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
    //   },
    //   message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    // },
    // select: false
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  // isVerified: {
  //   type: Boolean,
  //   default: false
  // }
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  registrationSource: {
    type: String,
    enum: ['website', 'whatsapp', 'telegram', 'admin'],
    default: 'website'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes (email unique index is already defined in schema)

const User = mongoose.model('User', userSchema);

export default User;