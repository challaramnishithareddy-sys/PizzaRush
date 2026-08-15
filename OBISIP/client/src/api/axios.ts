import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * - In production: uses VITE_API_URL pointing to deployed backend.
 * - In dev: uses /api which Vite proxies to localhost:5000.
 * - Attaches JWT token from localStorage to every request.
 * - Handles 401 responses by clearing auth and redirecting to login.
 */
const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pizzahub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear and redirect
      localStorage.removeItem('pizzahub_token');
      localStorage.removeItem('pizzahub_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
