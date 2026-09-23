import axios from 'axios';

// In production (Vercel), forcefully use the Render backend URL to avoid 404s.
// Locally (npm run dev), fallback to '/api' to use the vite proxy.
const baseURL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'https://cognitivegames-5az6.onrender.com/api') 
  : '/api';

export const api = axios.create({
  baseURL,
  timeout: 60000, // Increased to 60s to allow Render free tier to wake up from sleep
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Neuro Mind-auth')
      ? JSON.parse(localStorage.getItem('Neuro Mind-auth')!).state?.token
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
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/patient-pin');
      if (!isAuthEndpoint) {
        localStorage.removeItem('Neuro Mind-auth');
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Let\'s try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;


