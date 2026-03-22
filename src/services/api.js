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
  try {
    const response = await api.get('/pricing');
    const pricing = response.data?.data?.pricing;
    if (!pricing) {
      console.warn('Pricing data missing in API response:', response.data);
    }
    return pricing;
  } catch (error) {
    console.error('Error fetching public pricing:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * GET /api/v1/admin/marketing/public – legacy endpoint (kept for backward compat)
 */
export const getPublicMarketingSettings = async () => {
  const response = await api.get('/admin/marketing/public');
  return response.data.data.settings;
};

export default api;
