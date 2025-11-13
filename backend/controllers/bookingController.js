import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import User from '../models/User.js';

const PAYMENT_METHOD_LABELS = {
  'pay-later': 'Pay later with concierge',
  telebirr: 'Telebirr deposit',
  'bank-transfer': 'Bank transfer'
};

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  if (Number.isNaN(numeric)) {
    return '0';
  }
  return numeric.toLocaleString('en-ET');
};

// Helper function to generate WhatsApp message
const generateWhatsAppMessage = (booking, package_) => {
  const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const paymentMethodLabel = PAYMENT_METHOD_LABELS[booking.paymentMethod] || 'Pay later with concierge';
  const advancePaid = Number(booking.advancePayment || 0);
  const paymentLines = [
    `Total Amount: ${formatCurrency(booking.totalAmount)} ETB`,
    `Method: ${paymentMethodLabel}`
  ];

  if (advancePaid > 0) {
    paymentLines.push(`Advance Paid: ${formatCurrency(advancePaid)} ETB`);
  } else {
    paymentLines.push('Advance Paid: Pending');
  }

  if (booking.paymentReference) {
    paymentLines.push(`Reference: ${booking.paymentReference}`);
  } else if (booking.paymentReceipt) {
    paymentLines.push(`Receipt: ${booking.paymentReceipt}`);
  }
  
  const message = `🎉 *New Booking from LYAN Web App* 🎉

👤 *Customer Details*
Name: ${booking.customerName}
Email: ${booking.customerEmail}
Phone: ${booking.customerPhone}

📅 *Event Details*
Type: ${booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1)}
Date: ${eventDate}
Time: ${booking.eventTime}
Location: ${booking.locationType.charAt(0).toUpperCase() + booking.locationType.slice(1)}
${booking.locationAddress ? `Address: ${booking.locationAddress}` : ''}
${booking.numberOfGuests ? `Guests: ${booking.numberOfGuests}` : ''}

📦 *Package Selected*
${package_.name}
Price: ${formatCurrency(package_.discountedPrice)} ETB

💰 *Payment*
${paymentLines.join('\n')}

${booking.specialRequests ? `📝 *Special Requests*\n${booking.specialRequests}` : ''}

Booking ID: ${booking._id}
Status: ${booking.status.toUpperCase()}`;

  return encodeURIComponent(message);
};

// Helper function to generate WhatsApp link
const generateWhatsAppLink = (booking, package_) => {
  const whatsappNumber = process.env.WHATSAPP_NUMBER || '+971563561803'; // Default Ethiopian number format
  const message = generateWhatsAppMessage(booking, package_);
  return `https://wa.me/${whatsappNumber}?text=${message}`;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const {
    eventType,
    eventDate,
    eventTime,
    locationType,
    locationAddress,
    packageId,
    numberOfGuests,
    advancePayment,
    paymentMethod = 'pay-later',
    paymentReceipt,
    paymentReference,
    specialRequests,
    customerName,
    customerPhone
  } = req.body;
  
  // Verify package exists
  const package_ = await Package.findById(packageId);
  if (!package_) {
    res.status(404);
    throw new Error('Package not found');
  }
  
  if (!package_.isActive) {
    res.status(400);
    throw new Error('This package is currently not available');
  }
  
  // Get user details
  const user = await User.findById(req.user._id);
  
  // Calculate total amount (can be package price or custom)
  const totalAmount = package_.discountedPrice;
  const advancePaid = Number(advancePayment || 0);
  
  // Create booking
  const booking = await Booking.create({
    userId: req.user._id,
    customerName: customerName || user.name,
    customerEmail: user.email,
    customerPhone,
    eventType,
    eventDate,
    eventTime,
    locationType,
    locationAddress,
    packageId,
    numberOfGuests,
    advancePayment: advancePaid,
    paymentMethod,
    paymentReceipt: paymentReceipt || null,
    paymentReference,
    totalAmount,
    specialRequests,
    status: 'pending'
  });
  
  // Populate package details
  await booking.populate('packageId');
  
  // Generate WhatsApp link
  const whatsappLink = generateWhatsAppLink(booking, package_);
  
  res.status(201).json({
    success: true,
    message: 'Booking created successfully! Redirecting to WhatsApp...',
    data: {
      booking,
      whatsappLink
    }
  });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const {
    status,
    eventType,
    startDate,
    endDate,
    page = 1,
    limit = 20
  } = req.query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (eventType) {
    filter.eventType = eventType;
  }

  if (startDate || endDate) {
    filter.eventDate = {};
    if (startDate) filter.eventDate.$gte = new Date(startDate);
    if (endDate) filter.eventDate.$lte = new Date(endDate);
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('userId', 'name email')
      .populate('packageId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Booking.countDocuments(filter)
  ]);

  res.json({
    success: true,
    count: bookings.length,
    total,
    page: parsedPage,
    pages: Math.ceil(total / parsedLimit),
    data: bookings
  });
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [bookings, total] = await Promise.all([
    Booking.find({ userId: req.user._id })
      .populate('packageId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Booking.countDocuments({ userId: req.user._id })
  ]);

  res.json({
    success: true,
    count: bookings.length,
    total,
    page: parsedPage,
    pages: Math.ceil(total / parsedLimit),
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('packageId');
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  // Check if user owns this booking or is admin
  if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }
  
  res.json({
    success: true,
    data: booking
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  booking.status = status || booking.status;
  if (adminNotes) {
    booking.adminNotes = adminNotes;
  }
  
  await booking.save();
  await booking.populate('packageId');
  
  res.json({
    success: true,
    message: 'Booking status updated successfully',
    data: booking
  });
});

// @desc    Upload payment receipt
// @route   PUT /api/bookings/:id/payment-receipt
// @access  Private
export const uploadPaymentReceipt = asyncHandler(async (req, res) => {
  const { paymentReceipt, advancePayment, paymentMethod, paymentReference } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  // Check if user owns this booking
  if (booking.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }
  
  if (typeof paymentReceipt === 'string') {
    booking.paymentReceipt = paymentReceipt;
  }

  if (typeof paymentReference === 'string') {
    booking.paymentReference = paymentReference;
  }

  if (paymentMethod) {
    booking.paymentMethod = paymentMethod;
  }

  if (advancePayment !== undefined) {
    booking.advancePayment = Number(advancePayment) || 0;
  }
  
  await booking.save();
  
  res.json({
    success: true,
    message: 'Payment receipt uploaded successfully',
    data: booking
  });
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  // Check if user owns this booking or is admin
  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }
  
  if (booking.status === 'completed') {
    res.status(400);
    throw new Error('Cannot cancel completed booking');
  }
  
  booking.status = 'cancelled';
  await booking.save();
  
  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/stats
// @access  Private/Admin
export const getBookingStats = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
  const completedBookings = await Booking.countDocuments({ status: 'completed' });
  const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
  
  const recentBookings = await Booking.find()
    .populate('userId', 'name email')
    .populate('packageId', 'name price')
    .sort({ createdAt: -1 })
    .limit(5);
  
  res.json({
    success: true,
    data: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      recentBookings
    }
  });
});
