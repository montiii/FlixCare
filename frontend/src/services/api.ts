import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add Basic Auth credentials
api.interceptors.request.use(
  (config) => {
    const credentials = localStorage.getItem('flixcare_credentials');
    if (credentials) {
      config.headers.Authorization = `Basic ${credentials}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If 401, clear credentials and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('flixcare_authenticated');
      localStorage.removeItem('flixcare_auth_time');
      localStorage.removeItem('flixcare_credentials');
      window.location.reload();
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
