import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// Intercept requests to add the Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * GET /api/v1/pricing – public pricing settings (new endpoint)
 */
export const getPublicPricing = async () => {
  const response = await api.get('/pricing');
  return response.data.data.pricing;
};

/**
 * GET /api/v1/admin/marketing/public – legacy endpoint (kept for backward compat)
 */
export const getPublicMarketingSettings = async () => {
  const response = await api.get('/admin/marketing/public');
  return response.data.data.settings;
};

export default api;
