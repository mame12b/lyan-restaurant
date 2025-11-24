import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Auto-delete inquiries after 7 days to keep DB clean
  }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;