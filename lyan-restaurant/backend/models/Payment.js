import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true
     },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: "orderType" 
    },
    orderType: { 
        type: String,
        enum: ["CateringOrder", "Reservation"] 
    },
    provider: { 
        type: String, enum: ["Chapa", "Telebirr", "CBE"], 
        required: true 
    },
    transactionId: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, enum: ["success", "failed", "pending"], 
        default: "pending" 
    }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
