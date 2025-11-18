import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Controls whether auth is initializing

  // Validate token and load user from backend
  const validateToken = useCallback(async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 [AUTH CONTEXT] Validating token');
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log('ℹ️ No auth token found');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      setLoading(false);
      return null;
    }
  
    console.log('🔑 Token found, validating with backend');
    
    try {
      const data = await api.get("/auth/me");
      // Ensure backend returns role in response
      const userData = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };
      
      console.log('✅ Token validated successfully');
      console.log('👤 User:', userData);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      setUser(userData);
      return data.user;
    } catch (error) {
      // Expected 401 if token is invalid/expired - don't log as error
      if (error.response?.status === 401) {
        console.log('ℹ️ [AUTH CONTEXT] Token invalid/expired - clearing session');
      } else {
        console.error('❌ [AUTH CONTEXT] Token validation failed');
        console.error('Error:', error);
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      localStorage.removeItem("authToken");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 [AUTH CONTEXT] Registering user');
    console.log('📦 Data:', { name, email, password: '***' });
    
    try {
      const data = await api.post('/auth/register', { name, email, password });
      
      if (data?.token) {
        console.log('💾 Storing auth token');
        localStorage.setItem('authToken', data.token);
      }
      if (data?.user) {
        console.log('💾 Storing user data');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      
      console.log('✅ Registration successful');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return data?.user ?? null;
    } catch (error) {
      console.error('❌ [AUTH CONTEXT] Registration failed');
      console.error('Error:', error);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 [AUTH CONTEXT] Logging in user');
    console.log('📦 Data:', { email, password: '***' });
    
    try {
      const data = await api.post('/auth/login', { email, password });

      if (data?.token) {
        console.log('💾 Storing auth token');
        localStorage.setItem('authToken', data.token);
      }

      if (data?.user) {
        console.log('💾 Storing user data');
        console.log('👤 User:', data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        
        console.log('✅ Login successful');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        return data.user;
      }

      console.log('⚠️ Login response missing user data');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return null;
    } catch (error) {
      console.error('❌ [AUTH CONTEXT] Login failed');
      console.error('Error:', error);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 [AUTH CONTEXT] Logging out user');
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    
    console.log('✅ User logged out, redirecting to login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
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