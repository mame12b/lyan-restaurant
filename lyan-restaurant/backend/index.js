import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from './routes/restaurantRoutes.js';
import reservationRoutes from "./routes/reservationRoutes.js";
import cateringRoutes from "./routes/cateringRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js'; 
import menuRoutes from './routes/menuRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import  orderRoutes  from "./routes/orderRoutes.js";
import bodyParser from "body-parser";
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import cookieParser from "cookie-parser";

dotenv.config();
dotenv.config({ path: './.env' });
connectDB();

const app = express();
app.use(
    cors({
        origin : "http://localhost:3000", // allow frontend URL 
        credentials : true // allow cookie & authentication headers
    }));
app.use(express.json());
app.use(bodyParser.json()); // parser json requests 
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.use(cookieParser()); 


app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/menus:branchId', menuRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/orders', orderRoutes);


app.use(notFound);
app.use(errorHandler);
//conect mongo db
mongoose.connect("mongodb://localhost:27017/lyan-restaurant")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));


// test route
app.get('/', (req, res) => {
    res.send('backend is running');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });


const PORT= process.env.PORT || 5000;
app.listen (PORT, ()=> console.log(`Server running on port ${PORT}`));