import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxlength: [100, 'Package name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Package price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Package category is required'],
    enum: {
      values: [
        'wedding',
        'corporate',
        'birthday',
        'cultural',
        'private-dining',
        'other',
        'catering',
        'decoration',
        'full-package',
        'venue',
        'photography'
      ],
      message: 'Invalid package category'
    }
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=LYAN+Package'
  },
  features: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  eventTypes: [{
    type: String,
    enum: [
      'wedding',
      'engagement',
      'corporate',
      'conference',
      'product-launch',
      'birthday',
      'anniversary',
      'cultural',
      'private-dining',
      'meeting',
      'bridal-shower',
      'other'
    ]
  }],
  maxGuests: {
    type: Number,
    min: [0, 'Max guests cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for discounted price
packageSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Index for faster queries
packageSchema.index({ category: 1, isActive: 1 });
packageSchema.index({ price: 1 });

const Package = mongoose.model('Package', packageSchema);

export default Package;
