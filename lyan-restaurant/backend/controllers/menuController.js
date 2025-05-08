// import Menu from '../models/Menu.js';

// // ✅ Add Menu Item to a Branch
// export const addMenuItem = async (req, res) => {
//     try {
//         const { branchId, itemName, price, description, category } = req.body;
//         const menuItem = await Menu.create({ branchId, itemName, price, description, category });

//         res.status(201).json({ message: "Menu item added", menuItem });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding menu item", error: error.message });
//     }
// };

// // ✅ Get All Menu Items for a Branch
// export const getMenuItems = async (req, res) => {
//     try {
//         const { branchId }= req.params; // get branchId from url
//         const menuItems = await Menu.find({ branch: branchId });
//         res.status(200).json(menuItems);

//         if (!menuItems || menuItems.length === 0) {
//             return res.status(404).json({message: "no menu items found for this branch"});
            
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching menu items", error: error.message });
//     }
// };

// // ✅ Update Menu Item
// export const updateMenuItem = async (req, res) => {
//     try {
//         const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

//         res.status(200).json({ message: "Menu item updated", menuItem });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating menu item", error: error.message });
//     }
// };

// // ✅ Delete Menu Item
// export const deleteMenuItem = async (req, res) => {
//     try {
//         const menuItem = await Menu.findByIdAndDelete(req.params.id);
//         if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

//         res.status(200).json({ message: "Menu item deleted" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting menu item", error: error.message });
//     }
// };


import Menu from '../models/Menu.js';
import { createError } from '../utils/error.js';

// Get Menu Items with Filtering, Sorting, and Pagination
export const getMenuItems = async (req, res, next) => {
  try {
    const { branch } = req.params;
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

    
    const options = {
      sort: sort.replace(/,/g, ' '),
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Rating filter
    query.rating = { $gte: minRating };

    // Tags filter
    if (tags) {
      query.tags = { $all: tags.split(',') };
    }

    const [items, total] = await Promise.all([
      Menu.find(query)
        .populate('branch', 'name location')
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit),
        
      Menu.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / options.limit),
      data: items
    });

  } catch (error) {
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
      data: savedItem
    });
  } catch (error) {
    console.log('Validation Errors:', error.errors);
    next(createError(400, 'Invalid menu item data'));
  }
};

// Update Menu Item
export const updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) return next(createError(404, 'Menu item not found'));
    
    res.json({ success: true, data: menuItem });
  } catch (error) {
    next(createError(400, 'Invalid update data'));
  }
};

// Delete Menu Item
export const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!menuItem) return next(createError(404, 'Menu item not found'));
    
    res.status(204).json({ 
      success: true, 
      data: null 
    });
  } catch (error) {
    next(createError(500, 'Failed to delete menu item'));
  }
};