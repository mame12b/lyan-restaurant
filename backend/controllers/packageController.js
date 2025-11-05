import asyncHandler from 'express-async-handler';
import Package from '../models/Package.js';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getPackages = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    eventType,
    page = 1,
    limit = 12
  } = req.query;

  const filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (eventType) {
    filter.eventTypes = eventType;
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [packages, total] = await Promise.all([
    Package.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Package.countDocuments(filter)
  ]);

  res.json({
    success: true,
    count: packages.length,
    total,
    page: parsedPage,
    pages: Math.ceil(total / parsedLimit),
    data: packages
  });
});

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
export const getPackageById = asyncHandler(async (req, res) => {
  const package_ = await Package.findById(req.params.id);
  
  if (!package_) {
    res.status(404);
    throw new Error('Package not found');
  }
  
  res.json({
    success: true,
    data: package_
  });
});

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    discount,
    image,
    features,
    eventTypes,
    maxGuests
  } = req.body;
  
  const package_ = await Package.create({
    name,
    price,
    description,
    category,
    discount,
    image,
    features,
    eventTypes,
    maxGuests
  });
  
  res.status(201).json({
    success: true,
    message: 'Package created successfully',
    data: package_
  });
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = asyncHandler(async (req, res) => {
  let package_ = await Package.findById(req.params.id);
  
  if (!package_) {
    res.status(404);
    throw new Error('Package not found');
  }
  
  package_ = await Package.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  res.json({
    success: true,
    message: 'Package updated successfully',
    data: package_
  });
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = asyncHandler(async (req, res) => {
  const package_ = await Package.findById(req.params.id);
  
  if (!package_) {
    res.status(404);
    throw new Error('Package not found');
  }
  
  await package_.deleteOne();
  
  res.json({
    success: true,
    message: 'Package deleted successfully'
  });
});

// @desc    Toggle package active status
// @route   PATCH /api/packages/:id/toggle-active
// @access  Private/Admin
export const togglePackageActive = asyncHandler(async (req, res) => {
  const package_ = await Package.findById(req.params.id);
  
  if (!package_) {
    res.status(404);
    throw new Error('Package not found');
  }
  
  package_.isActive = !package_.isActive;
  await package_.save();
  
  res.json({
    success: true,
    message: `Package ${package_.isActive ? 'activated' : 'deactivated'} successfully`,
    data: package_
  });
});

// @desc    Get featured/discount packages
// @route   GET /api/packages/featured
// @access  Public
export const getFeaturedPackages = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 6, 1), 24);

  const packages = await Package.find({
    isActive: true,
    discount: { $gt: 0 }
  })
    .sort({ discount: -1, createdAt: -1 })
    .limit(parsedLimit);

  res.json({
    success: true,
    count: packages.length,
    data: packages
  });
});
