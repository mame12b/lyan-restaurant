import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Imported from external file
import { config } from "./config/db.js";
import { errorHandler } from './utils/error.js';


import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from './routes/restaurantRoutes.js';
import reservationRoutes from "./routes/reservationRoutes.js";
import cateringRoutes from "./routes/cateringRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js'; 
import menuRoutes from './routes/menuRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import availabilityRoutes from './routes/branchRoutes.js';
import bodyParser from "body-parser";
import { notFound } from './middlewares/errorMiddleware.js';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middlewares
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);
// app.use((req, res, next) => {
//     res.status(404).json({
//       success: false,
//       message: 'Endpoint not found'
//     });
// });
app.use(errorHandler);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/menus', menuRoutes); // Fixed route parameter syntax
app.use('/api/branches', branchRoutes);
app.use('/api/orders', orderRoutes);

console.log(config.PORT);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection (using imported function)
connectDB();

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));