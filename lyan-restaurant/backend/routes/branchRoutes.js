import express from "express";
import {
    createBranch,
    getBranches,
    getBranch,
    updateBranch,
    deleteBranch
} from "../controllers/branchController.js";
import Branch from "../models/Branch.js";
import  Availability  from "../models/Availability.js";
import {  protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBranch);
router.get("/",async (req, res) =>{
try {
    const branches = await Branch.find();
    res.json(branches);
    
} catch (error) {
    console.error(error);
    res.status(500).json({message : "Server Error"});
}
})

//router.get("/:id", getBranch);
router.put("/:id", protect, updateBranch);
router.delete("/:id", protect, deleteBranch);

export default router;