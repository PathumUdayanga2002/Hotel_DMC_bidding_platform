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
      // Don't redirect to login for /auth/check endpoint or /auth/login
      const isAuthEndpoint = error.config?.url?.includes('/auth/check') || 
                            error.config?.url?.includes('/auth/login');
      
      if (!isAuthEndpoint && !window.location.pathname.includes('/login')) {
        // Only redirect to login if we're not already there
        console.log('Unauthorized access, redirecting to login...');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
