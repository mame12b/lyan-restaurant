import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/lyan-restaurant", {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        console.log("mongoDB connected");

    } catch (error) {
        console.error("mongoDB connection failed", error.message);
        process.exit(1);
    }
};
export const {
    PORT = 5000,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN = '30d',
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN = '7d',
    SMTP_HOST,
    SMTP_PORT = 465,
    SMTP_USER,
    SMTP_PASS,
    FRONTEND_URL,
    NODE_ENV = 'development'
  } = process.env;
 export default connectDB;