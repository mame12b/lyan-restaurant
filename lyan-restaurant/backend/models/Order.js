import mongoose from "mongoose";
import  Mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    customerName : {
        type: String, 
        required: true
    },
    customerContact: {
        type : String, 
        required: true
    },
    items : [
        {
            name: String,
            price : Number,
            quantity : Number,
        },
    ],
    totalAmount: {
        type: String,
        enum:["Pending", "Paid", "Failed"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Delivered", "Canceled"],
        default: "Pending",
    },
}, {timestamps: true});

const Order= mongoose.model("Order", orderSchema);
export default Order;