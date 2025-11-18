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
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 [API REQUEST]', config.method?.toUpperCase(), config.url);
    console.log('📦 Request config:', {
      baseURL: config.baseURL,
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data
    });
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Auth token attached');
    } else {
      console.log('ℹ️ No auth token found');
    }
    
    return config;
  },
  error => {
    console.error('❌ [API REQUEST ERROR]:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: normalize error shape and handle auth
api.interceptors.response.use(
  response => {
    console.log('✅ [API RESPONSE]', response.config?.method?.toUpperCase(), response.config?.url);
    console.log('📊 Response data:', response.data);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return response.data;
  }, // unwrap data for successful responses
  error => {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ [API RESPONSE ERROR]');
    
    // If there's no response, it's a network/error connecting to server
    if (!error.response) {
      console.error('🌐 Network Error - No response received');
      console.error('Error details:', error.message);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
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

    console.error('📊 Status:', status);
    console.error('💬 Message:', serverMessage);
    console.error('📦 Response data:', error.response.data);

    // On 401 we consider the token invalid/expired. Clear local auth and redirect to login.
    if (status === 401) {
      console.log('🔐 Unauthorized - Clearing auth and redirecting to login');
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Avoid infinite redirect loops: only redirect if not already on the login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      } catch (e) {
        console.error('Error during auth cleanup:', e);
        // ignore if running in a non-browser environment (shouldn't be the case)
      }
    }

    // Build a normalized error object
    const normalized = {
      status,
      message: serverMessage,
      data: error.response.data || null
    };

    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

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
    const query = params.toString();
    return api.get(query ? `/packages?${query}` : '/packages');
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
  getAllBookings: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/bookings?${params.toString()}`);
  },

  // Admin: Get booking statistics
  getStats: () => api.get('/bookings/stats/overview'),

  // Admin: Update booking status
  updateStatus: (id, statusData) => api.put(`/bookings/${id}/status`, statusData),

  // Admin: Create manual booking (from WhatsApp/Phone)
  createManual: (bookingData) => api.post('/bookings/manual', bookingData)
};

// User/Admin API Endpoints
// ===============================
export const userAPI = {
  // Admin: Get all users
  getAllUsers: () => api.get('/admin/users'),

  // Admin: Get dashboard stats
  getDashboard: () => api.get('/admin/dashboard'),

  // Admin: Delete user
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

export default api;
export { normalizedBase as apiBaseUrl, backendBaseUrl };