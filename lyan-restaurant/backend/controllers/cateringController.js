import CateringOrder from "../models/CateringOrder.js";

// Create a catering order
export const createCateringOrder = async (req, res) => {
    try {
        const { branchId, eventType, date, time, guests, specialRequests } = req.body;
        const userId = req.user._id;

        if (!branchId || !eventType || !date || !time || !guests) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const cateringOrder = new CateringOrder({
            user: userId,
            branch: branchId,
            eventType,
            date,
            time,
            guests,
            specialRequests,
        });

        await cateringOrder.save();
        res.status(201).json({ message: "Catering order created successfully", cateringOrder });

    } catch (error) {
        res.status(500).json({ message: "Error creating catering order", error: error.message });
    }
};

// Get all catering orders (admin/owner only)
export const getCateringOrders = async (req, res) => {
    try {
        const orders = await CateringOrder.find().populate("user", "name email").populate("branch", "name");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching catering orders", error: error.message });
    }
};
