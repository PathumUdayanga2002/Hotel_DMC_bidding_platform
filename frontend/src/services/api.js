import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

const url=import.meta.env.VITE_API_BASE_URL;
console.log('API Base URL:', url);

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || 'unknown';
    const requestMethod = error.config?.method?.toUpperCase() || 'unknown';
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;
    const errorPath = error.response?.data?.path || '';
    
    console.error(`[API Error] ${requestMethod} ${requestUrl} - Status: ${status}`);
    console.error(`[API Error Details] Message: ${errorMessage}, Path: ${errorPath}`);
    
    if (error.response?.data) {
      console.error('[API Error Response]', error.response.data);
    }

    if (status === 401) {
      // Don't redirect to login for /auth/check endpoint or /auth/login
      const isAuthEndpoint = error.config?.url?.includes('/auth/check') || 
                            error.config?.url?.includes('/auth/login');
      
      if (!isAuthEndpoint && !window.location.pathname.includes('/login')) {
        // Only redirect to login if we're not already there
        console.log('[Auth] Unauthorized access detected, redirecting to login...');
        console.log('[Auth] Current path:', window.location.pathname);
        console.log('[Auth] Error on endpoint:', requestUrl);
        window.location.href = '/login';
      }
    } else if (status === 403) {
      console.error('[Auth] Access forbidden - check user role permissions');
      console.error('[Auth] Requested resource:', requestUrl);
    }
    return Promise.reject(error);
  }
);

export default api;
