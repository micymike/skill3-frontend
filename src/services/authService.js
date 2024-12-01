import api from './api';

export const registerUser = async (userData) => {
  try {
    console.log('Registering user:', userData);
    console.log('API Base URL:', api.defaults.baseURL);
    
    const response = await api.post('/register', userData);
    
    console.log('Registration Response:', response);
    return response.data;
  } catch (error) {
    console.error('Registration Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Provide more context about the error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(
        error.response.data?.message || 
        error.response.data?.error || 
        'Registration failed'
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up registration request');
    }
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log('Logging in user:', credentials);
    console.log('API Base URL:', api.defaults.baseURL);
    
    const response = await api.post('/login', credentials);
    
    console.log('Login Response:', response);
    return response.data;
  } catch (error) {
    console.error('Login Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Provide more context about the error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(
        error.response.data?.message || 
        error.response.data?.error || 
        'Login failed'
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up login request');
    }
  }
};

// Add more authentication-related services as needed
