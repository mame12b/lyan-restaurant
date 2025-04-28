import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true 
    },
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "Branch", 
        required: true 
    },
    date: { 
        type: String, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    numberOfGuests: { 
        type: Number, 
        required: true 
    },
    specialRequest: { 
        type: String 
    },
    status: {
         type: String, 
         enum: ["pending", "confirmed", "cancelled"], 
         default: "pending" 
        }
}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);

