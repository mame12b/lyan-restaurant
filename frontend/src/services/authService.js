import axios from 'axios';


const API_URL = 'https://lyan-backend.onrender.com/api/auth';

// Register user
export const registerUser = async (name, email, password) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [AUTH SERVICE] Register user');
  console.log('📦 Payload:', { name, email, password: '***' });
  
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password
    });
    
    console.log('✅ Registration successful');
    console.log('📊 Response:', { ...response.data, token: '***' });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return {
      token: response.data.token,
      user: response.data.user // Match backend response key
    };
  } catch (error) {
    console.error('❌ [AUTH SERVICE] Registration failed');
    console.error('Error:', error.response?.data || error.message);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error.response?.data || error;
  }
};

// Login user
export const login = async (email, password) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 [AUTH SERVICE] Login user');
  console.log('📦 Payload:', { email, password: '***' });
  
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      console.log('💾 Storing user data in localStorage');
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    console.log('✅ Login successful');
    console.log('📊 Response:', { ...response.data, token: '***' });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return response.data;
  } catch (error) {
    console.error('❌ [AUTH SERVICE] Login failed');
    console.error('Error:', error.response?.data || error.message);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    throw error.response?.data || error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await axios.post('/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, {
    password
  });
  return response.data;
};

// Verify email
export const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/verify-email/${token}`);
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};