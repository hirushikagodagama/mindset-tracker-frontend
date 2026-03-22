import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const adminAxios = axios.create({
  baseURL: `${BASE_URL}/admin`,
});

// Attach admin token automatically
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const adminLogin = async (email, password) => {
  const res = await adminAxios.post('/login', { email, password });
  return res.data.data;
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboardMetrics = async () => {
  const res = await adminAxios.get('/dashboard');
  return res.data.data;
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = async (params = {}) => {
  const res = await adminAxios.get('/users', { params });
  return res.data.data;
};

export const getUserById = async (id) => {
  const res = await adminAxios.get(`/users/${id}`);
  return res.data.data;
};

export const toggleSuspendUser = async (id) => {
  const res = await adminAxios.patch(`/users/${id}/suspend`);
  return res.data.data;
};

export const deleteUser = async (id) => {
  const res = await adminAxios.delete(`/users/${id}`);
  return res.data.data;
};

export const resetUserTrial = async (id) => {
  const res = await adminAxios.patch(`/users/${id}/reset-trial`);
  return res.data.data;
};

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const getSubscriptions = async (params = {}) => {
  const res = await adminAxios.get('/subscriptions', { params });
  return res.data.data;
};

export const cancelSubscription = async (id) => {
  const res = await adminAxios.patch(`/subscriptions/${id}/cancel`);
  return res.data.data;
};

export const extendSubscription = async (id, days) => {
  const res = await adminAxios.patch(`/subscriptions/${id}/extend`, { days });
  return res.data.data;
};

// ── Marketing ─────────────────────────────────────────────────────────────────
export const getMarketingSettings = async () => {
  const res = await adminAxios.get('/marketing');
  return res.data.data;
};

export const updateMarketingSettings = async (payload) => {
  const res = await adminAxios.put('/marketing', payload);
  return res.data.data;
};

export const getPricingSettings = async () => {
  const res = await adminAxios.get('/pricing');
  return res.data.data;
};

export const updatePricingSettings = async (payload) => {
  const res = await adminAxios.put('/pricing', payload);
  return res.data.data;
};

// ── Promo Codes ───────────────────────────────────────────────────────────────
export const getPromoCodes = async () => {
  const res = await adminAxios.get('/promotions');
  return res.data.data;
};

export const createPromoCode = async (payload) => {
  const res = await adminAxios.post('/promotions', payload);
  return res.data.data;
};

export const deletePromoCode = async (id) => {
  const res = await adminAxios.delete(`/promotions/${id}`);
  return res.data.data;
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const getPayments = async (params = {}) => {
  const res = await adminAxios.get('/payments', { params });
  return res.data.data;
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const getUserGrowthChart = async () => {
  const res = await adminAxios.get('/analytics/growth');
  return res.data.data;
};

export const getRevenueChart = async () => {
  const res = await adminAxios.get('/analytics/revenue');
  return res.data.data;
};

export const getConversionChart = async () => {
  const res = await adminAxios.get('/analytics/conversions');
  return res.data.data;
};

export default adminAxios;
