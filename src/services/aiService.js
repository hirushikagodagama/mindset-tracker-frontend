import api from './api';

export const getAiAnalysis = (params = {}) => api.get('/ai/analysis', { params });

export const getAiRecommendations = (params = {}) => api.get('/ai/recommendations', { params });

export const getAiCoach = (params = {}) => api.get('/ai/coach', { params });
