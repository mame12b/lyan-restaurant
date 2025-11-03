import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: {
      values: ['wedding', 'birthday', 'engagement', 'meeting', 'bridal-shower', 'other'],
      message: 'Event type must be: wedding, birthday, engagement, meeting, bridal-shower, or other'
    }
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  eventTime: {
    type: String,
    required: [true, 'Event time is required'],
    trim: true
  },
  locationType: {
    type: String,
    required: [true, 'Location type is required'],
    enum: {
      values: ['home', 'hotel', 'venue', 'other'],
      message: 'Location type must be: home, hotel, venue, or other'
    }
  },
  locationAddress: {
    type: String,
    trim: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: [true, 'Package selection is required']
  },
  numberOfGuests: {
    type: Number,
    min: [1, 'Number of guests must be at least 1']
  },
  paymentReceipt: {
    type: String, // URL to uploaded TeleBirr receipt image
    default: null
  },
  advancePayment: {
    type: Number,
    default: 0,
    min: [0, 'Advance payment cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: 'Status must be: pending, confirmed, cancelled, or completed'
    },
    default: 'pending'
  },
  whatsappSent: {
    type: Boolean,
    default: false
  },
  whatsappSentAt: {
    type: Date
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ eventDate: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to populate customer details from user
bookingSchema.pre('save', async function(next) {
  if (this.isNew && this.userId) {
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);
    if (user && !this.customerEmail) {
      this.customerEmail = user.email;
      this.customerName = this.customerName || user.name;
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
