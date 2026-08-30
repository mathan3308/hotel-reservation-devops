import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('hotel_jwt_token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('hotel_user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hotel_jwt_token');
      const storedUser = localStorage.getItem('hotel_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          // Refresh user profile in background
          const res = await authApi.getCurrentUser();
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('hotel_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    if (res && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('hotel_jwt_token', jwtToken);
      localStorage.setItem('hotel_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    if (res && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('hotel_jwt_token', jwtToken);
      localStorage.setItem('hotel_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hotel_jwt_token');
    localStorage.removeItem('hotel_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isStaff = user?.role === 'ROLE_STAFF';
  const isCustomer = user?.role === 'ROLE_CUSTOMER';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStaff,
        isCustomer,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
