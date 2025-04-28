// frontend/src/services/api.js
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // If using auth context

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // Add timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Request interceptor for auth tokens
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced response interceptor
api.interceptors.response.use(
  response => {
    // Directly return data for 2xx responses
    return response.data;
  },
  error => {
    const errorResponse = {
      status: error.response?.status || 0,
      message: error.response?.data?.message || 'Network Error',
      data: error.response?.data
    };

    // Auto-logout on 401 Unauthorized
    if (error.response?.status === 401) {
      const { logout } = useAuth(); // Only if using auth context
      logout();
    }

    return Promise.reject(errorResponse);
  }
);

export default api;