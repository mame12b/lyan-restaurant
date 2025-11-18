import asyncHandler from 'express-async-handler';
import Package from '../models/Package.js';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getPackages = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET PACKAGES] Endpoint reached');
  console.log('📝 Query params:', JSON.stringify(req.query, null, 2));
  
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
    console.log('🔍 Filtering by category:', category);
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = Number(minPrice);
      console.log('🔍 Min price filter:', minPrice);
    }
    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
      console.log('🔍 Max price filter:', maxPrice);
    }
  }

  if (eventType) {
    filter.eventTypes = eventType;
    console.log('🔍 Filtering by eventType:', eventType);
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  console.log('📄 Pagination:', { page: parsedPage, limit: parsedLimit, skip });

  try {
    console.log('💾 Fetching packages from database');
    const [packages, total] = await Promise.all([
      Package.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Package.countDocuments(filter)
    ]);

    console.log('✅ Packages fetched:', packages.length, 'of', total, 'total');

    // Cache public package listing briefly to reduce DB load
    res.set('Cache-Control', 'public, max-age=30');

    const response = {
      success: true,
      count: packages.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: packages
    };
    
    console.log('✅ Sending response:', JSON.stringify({ ...response, data: `${packages.length} packages` }));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [GET PACKAGES] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
export const getPackageById = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET PACKAGE BY ID] Endpoint reached');
  console.log('📝 Package ID:', req.params.id);
  
  try {
    console.log('💾 Fetching package from database');
    const package_ = await Package.findById(req.params.id);
    
    if (!package_) {
      console.error('❌ Package not found:', req.params.id);
      res.status(404);
      throw new Error('Package not found');
    }
    
    console.log('✅ Package found:', package_.name);
    
    const response = {
      success: true,
      data: package_
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [GET PACKAGE BY ID] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [CREATE PACKAGE] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
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
  
  try {
    console.log('💾 Creating package');
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
    
    console.log('✅ Package created successfully:', package_._id);
    
    const response = {
      success: true,
      message: 'Package created successfully',
      data: package_
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ [CREATE PACKAGE] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [UPDATE PACKAGE] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('📝 Package ID:', req.params.id);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    console.log('🔍 Finding package:', req.params.id);
    let package_ = await Package.findById(req.params.id);
    
    if (!package_) {
      console.error('❌ Package not found:', req.params.id);
      res.status(404);
      throw new Error('Package not found');
    }
    
    console.log('✅ Package found:', package_.name);
    console.log('💾 Updating package');
    
    package_ = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    console.log('✅ Package updated successfully');
    
    const response = {
      success: true,
      message: 'Package updated successfully',
      data: package_
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [UPDATE PACKAGE] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = asyncHandler(async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [DELETE PACKAGE] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('📝 Package ID:', req.params.id);
  
  try {
    console.log('🔍 Finding package:', req.params.id);
    const package_ = await Package.findById(req.params.id);
    
    if (!package_) {
      console.error('❌ Package not found:', req.params.id);
      res.status(404);
      throw new Error('Package not found');
    }
    
    console.log('✅ Package found:', package_.name);
    console.log('🗑️ Deleting package');
    
    await package_.deleteOne();
    
    console.log('✅ Package deleted successfully');
    
    const response = {
      success: true,
      message: 'Package deleted successfully'
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.json(response);
  } catch (error) {
    console.error('❌ [DELETE PACKAGE] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error;
  }
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

  // Brief cache for featured lists
  res.set('Cache-Control', 'public, max-age=30');

  res.json({
    success: true,
    count: packages.length,
    data: packages
  });
});
