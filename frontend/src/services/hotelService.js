import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const hotelService = {
  // Get all approved hotels with their profiles
  getApprovedHotels: async () => {
    try {
      const response = await api.get('/hotel/approved-profiles');
      return response;
    } catch (error) {
      console.error('Error fetching approved hotels:', error);
      throw error;
    }
  },

  // Get hotel profile by ID
  getHotelProfile: async (hotelId) => {
    try {
      const response = await api.get(`/hotel/profile/${hotelId}`);
      return response;
    } catch (error) {
      console.error('Error fetching hotel profile:', error);
      throw error;
    }
  },

  // Search hotels by criteria
  searchHotels: async (searchParams) => {
    try {
      const response = await api.get('/hotel/search', { params: searchParams });
      return response;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  },

  // Get direct inquiries sent to this hotel by DMCs
  getDirectInquiries: async () => {
    try {
      const response = await api.get('/hotel/direct-inquiries');
      return response;
    } catch (error) {
      console.error('Error fetching direct inquiries:', error);
      throw error;
    }
  },

  // Confirm a direct inquiry
  confirmDirectInquiry: async (inquiryId) => {
    try {
      const response = await api.post(`/hotel/direct-inquiries/${inquiryId}/confirm`);
      return response;
    } catch (error) {
      console.error('Error confirming direct inquiry:', error);
      throw error;
    }
  },
};

export default hotelService;
