import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Database connection configuration
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/lyan-restaurant";
        console.log("Attempting to connect to MongoDB...");
        console.log("URI:", uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
};

// Environment variables
const config = {
    PORT: process.env.PORT || 5001,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT || 465,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FRONTEND_URL: process.env.FRONTEND_URL,
    NODE_ENV: process.env.NODE_ENV || 'development'
};

export { config };
export default connectDB;