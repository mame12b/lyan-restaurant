import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true
    },
    branchName: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    phone: { type: String, 
        required: true 
    },
}, { timestamps: true });

export default mongoose.model("Branch", branchSchema);
