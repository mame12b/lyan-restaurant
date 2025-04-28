import Branch  from "../models/Branch.js";



export const createBranch = async (req, res) =>{

    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({message: "Access denied. only the owner can add branches"});     
        }

        const {branchName, location, phone} =req.body;
        const branch = await Branch.create({ownerId: req.user._id, branchName,location,phone});

        res.status(201).json({message: "Branch created successfully", branch});
    } catch (error) {
        console.error("error creating branch:", error.message);
        res.status(500).json({message: "error creating branch", error: error.message});
    }
};

// get all branches 
export const getBranches = async (req, res) =>{
    try {

        const branches = await Branch.find().populate("restaurant");
        res.status(200).json(branches.length > 0 ? branches : []);
    } catch (error) {
        console.error("error fetching branches:", error);
        res.status(500).json({message: "error fetching branches", error: error.message});

    }
};

// Get Branch by ID
export const getBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id).populate("restaurant");
        if (!branch) return res.status(404).json({ message: "Branch not found" });
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: "Error fetching branch", error: error.message });
    }
};
// update a branch (owner only)
 export const updateBranch = async(req, res)=>{

    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({message: "Access denied"});
   
        }
        const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!branch) return res.status(404).json({message: "Branch not found"});

        res.status(200).json({message: "Branch updated", branch});
    } catch (error) {
        res.status(500).json({message: "Error updating branch", error: error.message});
    }
 };

 // delete a branch (owner only)

 export const deleteBranch = async (req, res)=>{
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({message:"Access denied"});
            
        }
        const branch =await Branch.findByIdAndDelete(req.params.id);
        if(!branch) return res.status(404).json({message: "branch not found "});

        res.status(200).json({message: "Branch deleted"});
    } catch (error) {
        res.status(500).json({message:"error deleting branch", error: error.message});
    }
 };