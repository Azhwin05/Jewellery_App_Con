import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject auth token on every request
api.interceptors.request.use(
  (config) => {
    // Token is read from Keychain in production.
    // In dev we read from the Zustand store via a getter.
    try {
      const { useAuthStore } = require('../store/authStore');
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // store not initialised yet
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — logout and redirect to login
      try {
        const { useAuthStore } = require('../store/authStore');
        useAuthStore.getState().logout();
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  },
);
