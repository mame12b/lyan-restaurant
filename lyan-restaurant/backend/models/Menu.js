import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "Branch", 
        required: true 
    },
    itemName: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String 
    },
    category: { 
        type: String, 
        required: true
    },
}, { timestamps: true });

export default mongoose.model("Menu", menuSchema);
