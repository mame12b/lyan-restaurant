import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Controls whether auth is initializing

  // Validate token and load user from backend
  const validateToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return null;
    }
  
    try {
      const response = await api.get("/auth/me");
      // Ensure backend returns role in response
      setUser({
        id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role
      });
      return response.data.user;
    } catch (error) {
      localStorage.removeItem("authToken");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('authToken', response.data.token);
      const newUser = await validateToken();
      return newUser;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });


      // Store both token and user data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update context state
      setUser(response.data.user);
      return response.data.user;
      
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    window.location.href = '/login'; // Ensure full reset
  };

  // On initial load, validate auth status
  useEffect(() => {
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      register,
      login,
      logout,
      validateToken,
      loading,
    }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);