import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import React from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is authenticated by calling backend
      const response = await authService.checkAuth();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // If check fails (e.g., 401 expired token), user is not authenticated
      setUser(null);
      setIsAuthenticated(false);
      
      // If the error is 401 and we're not already on the login page, redirect
      if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data, role) => {
    try {
      let response;
      switch (role) {
        case 'hotel':
          response = await authService.registerHotel(data);
          break;
        case 'dmc':
          response = await authService.registerDMC(data);
          break;
        case 'admin':
          response = await authService.registerAdmin(data);
          break;
        default:
          throw new Error('Invalid role');
      }
      
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
