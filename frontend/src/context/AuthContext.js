import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Controls whether auth is initializing

  // Validate token and load user from backend
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return null;
    }
  
    try {
      const data = await api.get("/auth/me");
      // Ensure backend returns role in response
      setUser({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      });
      return data.user;
    } catch (error) {
      console.error('Token validation failed', error);
      localStorage.removeItem("authToken");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await api.post('/auth/register', { name, email, password });
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      return data?.user ?? null;
    } catch (error) {
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });

      if (data?.token) {
        localStorage.setItem('authToken', data.token);
      }

      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // Ensure full reset
  }, []);

  // On initial load, validate auth status
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    register,
    login,
    logout,
    validateToken,
    loading,
  }), [user, register, login, logout, validateToken, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);