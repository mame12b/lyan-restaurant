import express from "express";
import { createCateringOrder, getCateringOrders } from "../controllers/cateringController.js";
import {  protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Catering Order
router.post("/", protect, createCateringOrder);

// Get Catering Orders (for admin/owner)
router.get("/",  getCateringOrders);

export default router;
