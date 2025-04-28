import Menu from '../models/Menu.js';

// ✅ Add Menu Item to a Branch
export const addMenuItem = async (req, res) => {
    try {
        const { branchId, itemName, price, description, category } = req.body;
        const menuItem = await Menu.create({ branchId, itemName, price, description, category });

        res.status(201).json({ message: "Menu item added", menuItem });
    } catch (error) {
        res.status(500).json({ message: "Error adding menu item", error: error.message });
    }
};

// ✅ Get All Menu Items for a Branch
export const getMenuItems = async (req, res) => {
    try {
        const { branchId }= req.params; // get branchId from url
        const menuItems = await Menu.find({ branch: branchId });
        res.status(200).json(menuItems);

        if (!menuItems || menuItems.length === 0) {
            return res.status(404).json({message: "no menu items found for this branch"});
            
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error: error.message });
    }
};

// ✅ Update Menu Item
export const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

        res.status(200).json({ message: "Menu item updated", menuItem });
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error: error.message });
    }
};

// ✅ Delete Menu Item
export const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await Menu.findByIdAndDelete(req.params.id);
        if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

        res.status(200).json({ message: "Menu item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting menu item", error: error.message });
    }
};
