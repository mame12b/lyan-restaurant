
import { isValidObjectId } from 'mongoose';
import Menu from '../models/Menu.js';
import { createError } from '../utils/error.js';

// Get Menu Items with Filtering, Sorting, and Pagination
export const getMenuItems = async (req, res, next) => {
  try {
    const { branchId } = req.params;
    
    
    // Validate branchId
    if (!branchId || !isValidObjectId(branchId)) {
      return next(createError(400, 'Valid branch ID required'));
    }

    const query = { branch: branchId };
    const { 
      search, 
      category, 
      minRating = 0, 
      tags, 
      sort = '-createdAt', 
      page = 1, 
      limit = 10 
    } = req.query;

    // Parse numerical values
    const minRatingValue = parseFloat(minRating);
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const options = {
      sort: sort.replace(/,/g, ' '),
      skip: (pageNumber - 1) * limitNumber,
      limit: limitNumber
    };

    // Build query filters
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (tags) query.tags = { $all: Array.isArray(tags) ? tags : [tags] };
    query.rating = { $gte: minRatingValue };

    const [items, total] = await Promise.all([
      Menu.find(query)
        .populate('branch', 'name location')
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit)
        .lean(),
      Menu.countDocuments(query)
    ]);

    // Transform items
    const transformedItems = items.map(item => ({
      ...item,
      id: item._id,
      _id: undefined
    }));

    res.status(200).json({
      success: true,
      count: transformedItems.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      data: transformedItems
    });

  } catch (error) {
    console.error("Controller Error:", error);
    next(createError(500, 'Failed to fetch menu items'));
  }
};

// Add Menu Item
export const addMenuItem = async (req, res, next) => {
  try {
    const { branchId } = req.params;
    const menuItem = new Menu({
      ...req.body,
      branch: branchId
    });

    const savedItem = await menuItem.save();
    res.status(201).json({
      success: true,
      data: {
        ...savedItem.toObject(),
        id: savedItem._id,
        _id: undefined
      }
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Update Menu Item
export const updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!menuItem) return next(createError(404, 'Menu item not found'));
    
    res.json({ 
      success: true, 
      data: {
        ...menuItem,
        id: menuItem._id,
        _id: undefined
      }
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Delete Menu Item
export const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!menuItem) return next(createError(404, 'Menu item not found'));
    
    res.status(200).json({ 
      success: true, 
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};