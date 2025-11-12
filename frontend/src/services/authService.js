import axios from 'axios';


const API_URL = 'https://lyan-backend.onrender.com/api/auth';

// Register user
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password
    });
       
    
        return {
          token: response.data.token,
          user: response.data.user // Match backend response key
        };
  } catch (error) {
    throw error.response?.data || error;
  }

  
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
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