import asyncHandler from 'express-async-handler';
import Inquiry from '../models/Inquiry.js';

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, eventDate, guests, location, notes, packageId } = req.body;

  const inquiry = await Inquiry.create({
    name,
    eventDate,
    guests,
    location,
    notes,
    packageId
  });

  res.status(201).json({
    success: true,
    data: inquiry
  });
});