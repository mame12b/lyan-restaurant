import asyncHandler from 'express-async-handler';
import Menu from '../models/Menu.js';

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenu = asyncHandler(async (req, res) => {
  const { search, category, minRating = 0, tags, sort = '-createdAt', page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  
  // Text search
  if (search) query.$text = { $search: search };
  
  // Category filter
  if (category) query.category = category;
  
  // Tags filter
  if (tags) query.tags = { $all : Array.isArray(tags) ? tags : tags.split(',') };
  
  // Rating filter
  query.rating = { $gte: Number(minRating) };

  // Pagination
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // Execute query
  const [items, total] = await Promise.all([
    Menu.find(query)
      .sort(sort.replace(/,/g, ' '))
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Menu.countDocuments(query)
  ]);

  // Transform response
  const transformedItems = items.map(({ _id, __v, ...rest }) => ({
    id: _id,
    ...rest
  }));

  res.json({
    success: true,
    count: items.length,
    total,
    pages: Math.ceil(total / limitNumber),
    page: pageNumber,
    data: transformedItems
  });
});

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await Menu.create(req.body);
  
  res.status(201).json({
    success: true,
    data: {
      id: menuItem._id,
      ...menuItem.toObject()
    }
  });
});

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await Menu.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).lean();

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  res.json({
    success: true,
    data: {
      id: menuItem._id,
      ...menuItem
    }
  });
});

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await Menu.findByIdAndDelete(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  res.json({
    success: true,
    message: 'Menu item removed successfully'
  });
});