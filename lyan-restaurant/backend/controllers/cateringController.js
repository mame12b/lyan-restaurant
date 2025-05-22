import mongoose from "mongoose";
import CateringOrder from "../models/CateringOrder.js";

// Create a catering order
export const createCateringOrder = async (req, res) => {
    try {
        const { eventType, date, time, guests, specialRequests } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({message: 'unauthorized. please login '})
        }
            // Check required fields 
        if (!eventType || !date || !time || !guests) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        }

        // Ensure guests is a number
        if (isNaN(guests) || guests <= 0) {
        return res.status(400).json({ message: "Guests must be a positive number." });
        }
        
        // Create and save the order
        const cateringOrder = new CateringOrder({
            user: userId,
            eventType,
            date,
            time,
            guests,
            specialRequests,
        });

        await cateringOrder.save();
        res.status(201).json({ message: "Catering order created successfully", cateringOrder });

    } catch (error) {
        if(error.name === 'validationError') {
       return res.status(400).json({message: "validation Error", error: error.message});
    }
    res.status(500).json({ 
        message: "Error creating catering order",
         error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
}
};
// Get all catering orders (admin/owner only)
export const getCateringOrders = async (req, res) => {
    try {
        const orders = await CateringOrder.find().populate("user", "name email");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching catering orders", error: error.message });
    }
};
