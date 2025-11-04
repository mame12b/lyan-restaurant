import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Imported from external file
import { config } from "./config/db.js";
import { errorHandler } from './utils/error.js';

import adminRoutes from './routes/adminRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import bodyParser from "body-parser";
import { notFound } from './middlewares/errorMiddleware.js';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middlewares
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);

console.log(config.PORT);

// Error handling (MUST be after routes)
app.use(notFound);
app.use(errorHandler);

// Database connection (using imported function)
connectDB();

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));