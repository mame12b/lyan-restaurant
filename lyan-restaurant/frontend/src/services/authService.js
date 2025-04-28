import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Register user
export const registerUser = async (name, email, password) => {
  const response = await axios.post('http://localhost:5000/api/auth/register', {
    name,
    email,
    password
  });
  return response.data;
};

// Login user
export const login = async (email, password) => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
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