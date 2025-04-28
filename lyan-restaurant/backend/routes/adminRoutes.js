import express from "express";
import { getUsers } from "../controllers/adminController.js";
import {  authorizeAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/user", protect, authorizeAdmin, getUsers)