import axios from 'axios';

/**
 * Build normalized API base URL:
 * - If REACT_APP_API_URL is provided by the environment, strip trailing slash and append "/api"
 * - Otherwise default to local dev API: http://localhost:5001/api
 *
 * This makes it safe for REACT_APP_API_URL to be either:
 *  - https://lyan-backend.onrender.com
 *  - https://lyan-backend.onrender.com/     (we normalize it)
 * and the library will always call the backend under the /api path.
 */
const rawBase = process.env.REACT_APP_API_URL || '';
const normalizedBase = (() => {
  const trimmed = rawBase.trim();
  if (!trimmed) {
    return 'https://lyan-backend.onrender.com/api';
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, '');
  if (withoutTrailingSlash.toLowerCase().endsWith('/api')) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api`;
})();

const backendBaseUrl = normalizedBase.endsWith('/api')
  ? normalizedBase.slice(0, -4)
  : normalizedBase;

const api = axios.create({
  baseURL: normalizedBase,
  timeout: 10000,
  // Keep withCredentials true if your backend relies on cookies (sessions / refresh token cookies).
  // If you only use Authorization headers (JWT) you can set this to false.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach auth token if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: normalize error shape and handle auth
api.interceptors.response.use(
  response => response.data, // unwrap data for successful responses
  error => {
    // If there's no response, it's a network/error connecting to server
    if (!error.response) {
      const networkError = {
        status: 0,
        message:
          error.request
            ? `Cannot connect to server. Please check the backend is running at ${normalizedBase}`
            : `Request setup error: ${error.message}`,
        data: null
      };
      return Promise.reject(networkError);
    }

    const status = error.response.status;
    const serverMessage =
      error.response.data?.message || error.response.statusText || 'Server Error';

    // On 401 we consider the token invalid/expired. Clear local auth and redirect to login.
    if (status === 401) {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Avoid infinite redirect loops: only redirect if not already on the login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      } catch (e) {
        // ignore if running in a non-browser environment (shouldn't be the case)
      }
    }

    // Build a normalized error object
    const normalized = {
      status,
      message: serverMessage,
      data: error.response.data || null
    };

    // Optionally log detailed error in development
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('API Error:', {
        message: error.message,
        status,
        url: error.config?.url,
        method: error.config?.method,
        responseData: error.response?.data
      });
    }

    return Promise.reject(normalized);
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
  uploadReceipt: (id, receiptData) => api.put(`/bookings/${id}/payment-receipt`, receiptData),

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
  updateStatus: (id, statusData) => api.put(`/bookings/${id}/status`, statusData)
};

export default api;
export { normalizedBase as apiBaseUrl, backendBaseUrl };