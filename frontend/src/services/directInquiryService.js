import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const directInquiryService = {
  // Create a new direct inquiry
  createDirectInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/dmc/direct-inquiry', inquiryData);
      return response;
    } catch (error) {
      console.error('Error creating direct inquiry:', error);
      throw error;
    }
  },

  // Get all direct inquiries for the logged-in DMC
  getMyDirectInquiries: async () => {
    try {
      const response = await api.get('/dmc/direct-inquiries');
      return response;
    } catch (error) {
      console.error('Error fetching direct inquiries:', error);
      throw error;
    }
  },

  // Get direct inquiry by ID
  getDirectInquiryById: async (inquiryId) => {
    try {
      const response = await api.get(`/dmc/direct-inquiry/${inquiryId}`);
      return response;
    } catch (error) {
      console.error('Error fetching direct inquiry:', error);
      throw error;
    }
  },

  // Delete direct inquiry
  deleteDirectInquiry: async (inquiryId) => {
    try {
      const response = await api.delete(`/dmc/direct-inquiry/${inquiryId}`);
      return response;
    } catch (error) {
      console.error('Error deleting direct inquiry:', error);
      throw error;
    }
  },
};

export default directInquiryService;
