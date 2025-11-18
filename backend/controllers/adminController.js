import User from '../models/User.js';

export const getUsers = async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET USERS] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('📝 Query params:', JSON.stringify(req.query, null, 2));
  
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
      console.log('🔍 Search filter:', search);
    }

    console.log('📄 Pagination:', { page: parsedPage, limit: parsedLimit, skip });
    console.log('💾 Fetching users from database');

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      User.countDocuments(filter)
    ]);

    console.log('✅ Users fetched:', users.length, 'of', total, 'total');

    const response = {
      status: 'success',
      results: users.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: { users }
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ [GET USERS] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [GET ADMIN DASHBOARD] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  
  try {
    console.log('💾 Fetching dashboard metrics');
    const dashboardData = {
      totalUsers: await User.countDocuments(),
      // Add more metrics
    };

    console.log('✅ Dashboard data fetched:', dashboardData);
    
    const response = {
      status: 'success',
      data: dashboardData
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ [GET ADMIN DASHBOARD] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    res.status(500).json({
      status: 'error',
      message: 'Failed to load dashboard'
    });
  }
};
export const deleteUser = async (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [DELETE USER] Endpoint reached');
  console.log('👤 Admin ID:', req.user?._id);
  console.log('📝 User ID to delete:', req.params.id);
  
  try {
    console.log('🗑️ Deleting user:', req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      console.error('❌ User not found:', req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User deleted successfully:', user.email);
    
    const response = { 
      success: true,
      message: 'User deleted successfully'
    };
    
    console.log('✅ Sending response');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ [DELETE USER] Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete user' 
    });
  }
};