import Payment from "../models/Payment.js";
import Reservation from "../models/Reservation.js";
import CateringOrder from "../models/CateringOrder.js";

// ✅ Process a Payment
export const processPayment = async (req, res) => {
    try {

        console.log("User making payment:", req.user); // ✅ Debugging

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        const { orderId, orderType, provider, transactionId } = req.body;

        if (!orderId || !orderType || !provider || !transactionId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if order exists
        let order;
        if (orderType === "Reservation") {
            order = await Reservation.findById(orderId);
        } else if (orderType === "CateringOrder") {
            order = await CateringOrder.findById(orderId);
        }

        if (!order) {
            return res.status(404).json({ message: `${orderType} not found` });
        }

        // ✅ Create payment record
        const payment = await Payment.create({
            userId: req.user._id,
            orderId,
            orderType,
            provider,
            transactionId,
            status: "pending"
        });

        res.status(201).json({ message: "Payment processed successfully", payment });
    } catch (error) {
        console.error("Payment Error:", error.message);
        res.status(500).json({ message: "Payment processing failed", error: error.message });
    }
};


// Get all payments for catering orders
export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order'); // Populate for order details
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
};

// Update a payment by ID
export const updatePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};

// Delete a payment by ID
export const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
};