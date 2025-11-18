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
  const balance = booking.totalAmount - advancePaid;
  
  // Create a beautiful, well-formatted WhatsApp message
  const message = `╔═══════════════════════════╗
   🎉 *LYAN RESTAURANT* 🎉
   ✨ New Booking Confirmation ✨
╚═══════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Name: *${booking.customerName}*
📧 Email: ${booking.customerEmail}
📱 Phone: *${booking.customerPhone}*

━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *EVENT DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎊 Event Type: *${booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1)}*
📆 Date: *${eventDate}*
🕐 Time: *${booking.eventTime}*
📍 Location: *${booking.locationType.charAt(0).toUpperCase() + booking.locationType.slice(1)}*
${booking.locationAddress ? `🗺️ Address: ${booking.locationAddress}` : ''}
👥 Number of Guests: *${booking.numberOfGuests || 'TBD'}*

━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *PACKAGE SELECTED*
━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *${package_.name}*
💵 Package Price: *${formatCurrency(package_.discountedPrice)} ETB*

━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Total Amount: *${formatCurrency(booking.totalAmount)} ETB*
${advancePaid > 0 ? `✅ Advance Paid: *${formatCurrency(advancePaid)} ETB*` : '⏳ Advance Paid: *Pending*'}
${advancePaid > 0 ? `📊 Balance Due: *${formatCurrency(balance)} ETB*` : ''}
🔖 Payment Method: *${paymentMethodLabel}*
${booking.paymentReference ? `🔢 Reference: *${booking.paymentReference}*` : ''}
${booking.paymentReceipt ? `🧾 Receipt: ${booking.paymentReceipt}` : ''}

${booking.specialRequests ? `━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *SPECIAL REQUESTS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
${booking.specialRequests}

` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *BOOKING DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 Booking ID: \`${booking._id}\`
⚡ Status: *${booking.status.toUpperCase()}*
📅 Booking Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

╔═══════════════════════════╗
  ✅ *Booking Confirmed!*
  We'll contact you shortly
╚═══════════════════════════╝

📞 Contact: ${process.env.BUSINESS_PHONE || '+971563561803'}
🌐 www.lyanrestaurant.com

_Thank you for choosing LYAN Restaurant!_ ❤️`;

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
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [CREATE BOOKING] Endpoint reached');
  console.log('👤 User ID:', req.user?._id);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
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
  
  try {
    console.log('🔍 Verifying package:', packageId);
    // Verify package exists
    const package_ = await Package.findById(packageId);
    if (!package_) {
      console.error('❌ Package not found:', packageId);
      res.status(404);
      throw new Error('Package not found');
    }
    console.log('✅ Package found:', package_.name);
    
    if (!package_.isActive) {
      console.error('❌ Package not active:', packageId);
      res.status(400);
      throw new Error('This package is currently not available');
    }
    
    console.log('🔍 Fetching user details');
    // Get user details
    const user = await User.findById(req.user._id);
    console.log('✅ User found:', user.name);
    
    // Calculate total amount (can be package price or custom)
    const totalAmount = package_.discountedPrice;
    const advancePaid = Number(advancePayment || 0);
    
    console.log('💰 Payment details:', { totalAmount, advancePaid });
    
    // Create booking
    const bookingData = {
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
    };
    
    console.log('💾 Creating booking with data:', JSON.stringify(bookingData, null, 2));
    const booking = await Booking.create(bookingData);
    console.log('✅ Booking created successfully:', booking._id);
    
    // Populate package details
    await booking.populate('packageId');
    
    // Generate WhatsApp link
    console.log('📱 Generating WhatsApp link');
    const whatsappLink = generateWhatsAppLink(booking, package_);
    console.log('✅ WhatsApp link generated');
    
    const response = {
      success: true,
      message: 'Booking created successfully! Redirecting to WhatsApp...',
      data: {
        booking,
        whatsappLink
      }
    };
    
    console.log('✅ Sending response:', JSON.stringify({ ...response, data: { bookingId: booking._id } }));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ [CREATE BOOKING] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET ALL BOOKINGS] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('📝 Query params:', JSON.stringify(req.query, null, 2));
  
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
    console.log('🔍 Filtering by status:', status);
  }

  if (eventType) {
    filter.eventType = eventType;
    console.log('🔍 Filtering by eventType:', eventType);
  }

  if (startDate || endDate) {
    filter.eventDate = {};
    if (startDate) {
      filter.eventDate.$gte = new Date(startDate);
      console.log('🔍 Start date filter:', startDate);
    }
    if (endDate) {
      filter.eventDate.$lte = new Date(endDate);
      console.log('🔍 End date filter:', endDate);
    }
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;
  
  console.log('📄 Pagination:', { page: parsedPage, limit: parsedLimit, skip });

  try {
    console.log('💾 Fetching bookings from database');
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('userId', 'name email')
        .populate('packageId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Booking.countDocuments(filter)
    ]);

    console.log('✅ Bookings fetched:', bookings.length, 'of', total, 'total');
    
    const response = {
      success: true,
      count: bookings.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: bookings
    };
    
    console.log('✅ Sending response:', JSON.stringify({ ...response, data: `${bookings.length} bookings` }));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [GET ALL BOOKINGS] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET MY BOOKINGS] Endpoint reached');
  console.log('👤 User ID:', req.user?._id);
  console.log('📝 Query params:', JSON.stringify(req.query, null, 2));
  
  const { page = 1, limit = 10 } = req.query;
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;
  
  console.log('📄 Pagination:', { page: parsedPage, limit: parsedLimit, skip });

  try {
    console.log('💾 Fetching user bookings from database');
    const [bookings, total] = await Promise.all([
      Booking.find({ userId: req.user._id })
        .populate('packageId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Booking.countDocuments({ userId: req.user._id })
    ]);

    console.log('✅ User bookings fetched:', bookings.length, 'of', total, 'total');
    
    const response = {
      success: true,
      count: bookings.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: bookings
    };
    
    console.log('✅ Sending response:', JSON.stringify({ ...response, data: `${bookings.length} bookings` }));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [GET MY BOOKINGS] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET BOOKING BY ID] Endpoint reached');
  console.log('👤 User ID:', req.user?._id);
  console.log('📝 Booking ID:', req.params.id);
  
  try {
    console.log('💾 Fetching booking from database');
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('packageId');
    
    if (!booking) {
      console.error('❌ Booking not found:', req.params.id);
      res.status(404);
      throw new Error('Booking not found');
    }
    
    console.log('✅ Booking found:', booking._id);
    
    // Check if user owns this booking or is admin
    const isOwner = booking.userId?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    console.log('🔍 Authorization check:', { isOwner, isAdmin });
    
    if (!isOwner && !isAdmin) {
      console.error('❌ Not authorized to view booking');
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }
    
    const response = {
      success: true,
      data: booking
    };
    
    console.log('✅ Sending response:', JSON.stringify({ success: true, bookingId: booking._id }));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [GET BOOKING BY ID] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [UPDATE BOOKING STATUS] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('🆔 Booking ID:', req.params.id);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  const { status, adminNotes } = req.body;
  
  try {
    console.log('🔍 Finding booking:', req.params.id);
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      console.error('❌ Booking not found:', req.params.id);
      res.status(404);
      throw new Error('Booking not found');
    }
    
    console.log('✅ Booking found:', booking._id);
    console.log('📊 Current status:', booking.status);
    
    if (status) {
      booking.status = status;
      console.log('🔄 Updating status to:', status);
    }
    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes;
      console.log('📝 Adding admin notes');
    }
    
    console.log('💾 Saving booking changes');
    // Save with validateModifiedOnly to skip validation on unchanged fields
    await booking.save({ validateModifiedOnly: true });
    await booking.populate('packageId');
    
    console.log('✅ Booking updated successfully');
    
    const response = {
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [UPDATE BOOKING STATUS] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Upload payment receipt
// @route   PUT /api/bookings/:id/payment-receipt
// @access  Private
export const uploadPaymentReceipt = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [UPLOAD PAYMENT RECEIPT] Endpoint reached');
  console.log('👤 User ID:', req.user?._id);
  console.log('📝 Booking ID:', req.params.id);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  const { paymentReceipt, advancePayment, paymentMethod, paymentReference } = req.body;
  
  try {
    console.log('🔍 Finding booking:', req.params.id);
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      console.error('❌ Booking not found:', req.params.id);
      res.status(404);
      throw new Error('Booking not found');
    }
    
    console.log('✅ Booking found:', booking._id);
    
    // Check if user owns this booking
    const isOwner = booking.userId?.toString() === req.user._id.toString();
    console.log('🔍 Authorization check - isOwner:', isOwner);
    
    if (!isOwner) {
      console.error('❌ Not authorized to update this booking');
      res.status(403);
      throw new Error('Not authorized to update this booking');
    }
    
    if (typeof paymentReceipt === 'string') {
      booking.paymentReceipt = paymentReceipt;
      console.log('📄 Payment receipt updated');
    }

    if (typeof paymentReference === 'string') {
      booking.paymentReference = paymentReference;
      console.log('🔖 Payment reference updated:', paymentReference);
    }

    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
      console.log('💳 Payment method updated:', paymentMethod);
    }

    if (advancePayment !== undefined) {
      booking.advancePayment = Number(advancePayment) || 0;
      console.log('💰 Advance payment updated:', booking.advancePayment);
    }
    
    console.log('💾 Saving booking changes');
    await booking.save();
    
    console.log('✅ Payment receipt updated successfully');
    
    const response = {
      success: true,
      message: 'Payment receipt uploaded successfully',
      data: booking
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [UPLOAD PAYMENT RECEIPT] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [CANCEL BOOKING] Endpoint reached');
  console.log('👤 User ID:', req.user?._id);
  console.log('📝 Booking ID:', req.params.id);
  
  try {
    console.log('🔍 Finding booking:', req.params.id);
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      console.error('❌ Booking not found:', req.params.id);
      res.status(404);
      throw new Error('Booking not found');
    }
    
    console.log('✅ Booking found:', booking._id);
    console.log('📊 Current status:', booking.status);
    
    // Check if user owns this booking or is admin
    const isOwner = booking.userId?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    console.log('🔍 Authorization check:', { isOwner, isAdmin });
    
    if (!isOwner && !isAdmin) {
      console.error('❌ Not authorized to cancel this booking');
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }
    
    if (booking.status === 'completed') {
      console.error('❌ Cannot cancel completed booking');
      res.status(400);
      throw new Error('Cannot cancel completed booking');
    }
    
    console.log('🔄 Updating status to cancelled');
    booking.status = 'cancelled';
    
    console.log('💾 Saving booking changes');
    await booking.save();
    
    console.log('✅ Booking cancelled successfully');
    
    const response = {
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [CANCEL BOOKING] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/stats
// @access  Private/Admin
export const getBookingStats = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET BOOKING STATS] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  
  try {
    console.log('💾 Fetching booking statistics');
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    console.log('📊 Stats:', { 
      total: totalBookings, 
      pending: pendingBookings, 
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings
    });
    
    console.log('💾 Fetching recent bookings');
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('packageId', 'name price')
      .sort({ createdAt: -1 })
      .limit(5);

    console.log('✅ Recent bookings fetched:', recentBookings.length);

    // Small cache for admin dashboard stats to avoid repeated heavy aggregation
    res.set('Cache-Control', 'private, max-age=15');

    const response = {
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        recentBookings
      }
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [GET BOOKING STATS] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Create booking manually (Admin - for WhatsApp orders)
// @route   POST /api/bookings/manual
// @access  Private/Admin
export const createManualBooking = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [CREATE MANUAL BOOKING] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  const {
    customerName,
    customerEmail,
    customerPhone,
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
    status = 'pending',
    totalAmount,
    source = 'whatsapp'
  } = req.body;
  
  try {
    // Verify package exists if packageId provided
    let package_ = null;
    let calculatedTotalAmount = totalAmount;
    
    if (packageId) {
      console.log('🔍 Verifying package:', packageId);
      package_ = await Package.findById(packageId);
      if (!package_) {
        console.error('❌ Package not found:', packageId);
        res.status(404);
        throw new Error('Package not found');
      }
      console.log('✅ Package found:', package_.name);
      calculatedTotalAmount = totalAmount || package_.discountedPrice;
    } else {
      console.log('ℹ️ No package selected, using custom amount');
    }
    
    const bookingData = {
      userId: null, // WhatsApp bookings don't have userId
      customerName,
      customerEmail: customerEmail || `whatsapp+${Date.now()}@placeholder.com`,
      customerPhone,
      eventType,
      eventDate,
      eventTime,
      locationType,
      locationAddress,
      packageId: packageId || null,
      numberOfGuests,
      advancePayment: Number(advancePayment || 0),
      paymentMethod,
      paymentReceipt: paymentReceipt || null,
      paymentReference,
      totalAmount: calculatedTotalAmount,
      specialRequests,
      status,
      source
    };
    
    console.log('💾 Creating manual booking:', JSON.stringify(bookingData, null, 2));
    // Create booking without userId (WhatsApp customer might not have account)
    const booking = await Booking.create(bookingData);
    console.log('✅ Manual booking created successfully:', booking._id);
    
    // Populate package details if exists
    if (packageId) {
      await booking.populate('packageId');
      console.log('✅ Package details populated');
    }
    
    const response = {
      success: true,
      message: 'WhatsApp booking added successfully',
      data: booking
    };
    
    console.log('✅ Sending response:', JSON.stringify({ ...response, data: { bookingId: booking._id } }));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ [CREATE MANUAL BOOKING] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});
