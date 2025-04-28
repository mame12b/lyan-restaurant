import express from "express";
import {
    createBranch,
    getBranches,
    getBranch,
    updateBranch,
    deleteBranch
} from "../controllers/branchController.js";
import {  protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBranch);
router.get("/", getBranches);
router.get("/:id", getBranch);
router.put("/:id", protect, updateBranch);
router.delete("/:id", protect, deleteBranch);

export default router;