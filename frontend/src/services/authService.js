import api from './api';

export const authService = {
  // Register Hotel
  registerHotel: async (data) => {
    const response = await api.post('/auth/register/hotel', data);
    return response.data;
  },

  // Register DMC
  registerDMC: async (data) => {
    const response = await api.post('/auth/register/dmc', data);
    return response.data;
  },

  // Register Admin
  registerAdmin: async (data) => {
    const response = await api.post('/auth/register/admin', data);
    return response.data;
  },

  // Login
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  // Check authentication
  checkAuth: async () => {
    const response = await api.get('/auth/check');
    return response.data;
  },
};

export const dashboardService = {
  // Get Hotel Dashboard
  getHotelDashboard: async () => {
    const response = await api.get('/hotel/dashboard');
    return response.data;
  },

  // Get DMC Dashboard
  getDMCDashboard: async () => {
    const response = await api.get('/dmc/dashboard');
    return response.data;
  },

  // Get Admin Dashboard
  getAdminDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};
