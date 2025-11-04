// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  response => {
    // Directly return data for 2xx responses
    return response.data;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });

    // Handle network errors (no response received)
    if (!error.response) {
      const networkError = {
        status: 0,
        message: error.request 
          ? 'Cannot connect to server. Please check if the backend is running on http://localhost:5001'
          : 'Request setup error: ' + error.message,
        data: null
      };
      return Promise.reject(networkError);
    }

    // Handle HTTP errors (response received with error status)
    const errorResponse = {
      status: error.response.status,
      message: error.response.data?.message || error.message || 'Server Error',
      data: error.response.data
    };

    // Auto-logout on 401 Unauthorized (including expired tokens)
    if (error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(errorResponse);
  }
);

// ===============================
// Package API Endpoints
// ===============================

export const packageAPI = {
  // Get all packages with optional filters
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/packages?${params.toString()}`);
  },
  
  // Get featured/discount packages
  getFeatured: () => api.get('/packages/featured'),
  
  // Get single package by ID
  getById: (id) => api.get(`/packages/${id}`),
  
  // Admin: Create new package
  create: (packageData) => api.post('/packages', packageData),
  
  // Admin: Update package
  update: (id, packageData) => api.put(`/packages/${id}`, packageData),
  
  // Admin: Delete package
  delete: (id) => api.delete(`/packages/${id}`),
  
  // Admin: Toggle package active status
  toggleActive: (id) => api.patch(`/packages/${id}/toggle-active`)
};

// ===============================
// Booking API Endpoints
// ===============================

export const bookingAPI = {
  // Create new booking
  create: (bookingData) => api.post('/bookings', bookingData),
  
  // Get user's own bookings
  getMyBookings: () => api.get('/bookings/my-bookings'),
  
  // Get single booking by ID
  getById: (id) => api.get(`/bookings/${id}`),
  
  // Upload payment receipt
  uploadReceipt: (id, receiptData) => 
    api.put(`/bookings/${id}/payment-receipt`, receiptData),
  
  // Cancel booking
  cancel: (id) => api.delete(`/bookings/${id}`),
  
  // Admin: Get all bookings with filters
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/bookings?${params.toString()}`);
  },
  
  // Admin: Get booking statistics
  getStats: () => api.get('/bookings/stats/overview'),
  
  // Admin: Update booking status
  updateStatus: (id, statusData) => 
    api.put(`/bookings/${id}/status`, statusData)
};

export default api;