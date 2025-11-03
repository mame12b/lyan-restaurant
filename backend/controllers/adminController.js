import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .lean();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const dashboardData = {
      totalUsers: await User.countDocuments(),
      // Add more metrics
    };

    res.status(200).json({
      status: 'success',
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to load dashboard'
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      success: true,
      message: 'User deleted successfully' 
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};