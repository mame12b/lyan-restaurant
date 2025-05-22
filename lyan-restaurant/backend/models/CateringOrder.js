import mongoose from "mongoose";

const CateringOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    specialRequests: { type: String },
}, { timestamps: true });

export default mongoose.model("CateringOrder", CateringOrderSchema);
