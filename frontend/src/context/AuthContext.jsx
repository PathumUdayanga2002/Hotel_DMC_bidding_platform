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
      // This is expected behavior when user is not logged in, so we silently handle it
      setUser(null);
      setIsAuthenticated(false);
      
      // Only log non-401 errors (401 is expected when not authenticated)
      if (error.response?.status !== 401) {
        console.error('Auth check error:', error);
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

  // Helper functions for RBAC
  const isSuperAdmin = () => {
    // Treat null/undefined accountType as SUPER_ADMIN for backward compatibility
    return user?.accountType === 'SUPER_ADMIN' || user?.accountType === null || user?.accountType === undefined;
  };

  const isStaff = () => {
    return user?.accountType === 'STAFF';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    isSuperAdmin,
    isStaff,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
