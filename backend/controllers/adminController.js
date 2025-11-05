import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 25, search } = req.query;
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
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