import axios from 'axios';

// In production (Vercel), we want to use the Render backend URL.
// Locally, it will fallback to '/api' and use the vite.config.ts proxy.
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smriti-auth')
      ? JSON.parse(localStorage.getItem('smriti-auth')!).state?.token
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smriti-auth');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Let\'s try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
