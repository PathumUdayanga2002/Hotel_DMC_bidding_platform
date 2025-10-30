import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

const url=import.meta.env.VITE_API_BASE_URL;
console.log(url);
// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect to login for /auth/check endpoint (used for initial auth verification)
      // This prevents infinite redirect loops
      const isAuthCheckEndpoint = error.config?.url?.includes('/auth/check');
      
      if (!isAuthCheckEndpoint) {
        // Unauthorized - redirect to login for all other endpoints
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
