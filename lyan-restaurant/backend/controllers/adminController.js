import User from "../models/User.js";

export const getUsers = async (req, res) =>{
    try {
        const users = await User.find({});
        if (!users || users.length === 0) {
            return res.status(404).json({message: "no users found"});

        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "error fetching users", error: error.message});
    }
}