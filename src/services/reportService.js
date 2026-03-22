import api from './api';

export const generateReport = (period) => api.get(`/reports`, { params: { period } });
