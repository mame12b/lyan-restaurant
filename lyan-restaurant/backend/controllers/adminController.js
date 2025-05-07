import User from "../models/User.js";

// Get list of all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Admin dashboard endpoint
export const getAdminDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the admin dashboard",
    user: req.user, // Optional: include user info if needed
  });
};
