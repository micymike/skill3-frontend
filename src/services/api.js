import axios from 'axios';

// Get the base URL from environment or default
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1/auth';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,  // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': window.location.origin,
    'Access-Control-Allow-Credentials': 'true',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add a custom method to handle OPTIONS preflight
api.options = (url, config = {}) => {
  return api.request({
    ...config,
    method: 'OPTIONS',
    url: url
  });
};

// Request interceptor for logging and potential token injection
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    
    // Optional: Inject token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    
    // Global error handling
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('Unauthorized access');
          break;
        case 403:
          console.log('Access forbidden');
          break;
        case 404:
          console.log('Resource not found');
          break;
        case 500:
          console.log('Server error');
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      console.error('Request details:', {
        method: error.request.method,
        url: error.request.url,
        headers: error.request.headers
      });
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
