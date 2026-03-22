import api from './api';

export const getHabits = () => api.get('/habits');
export const addHabit = (data) => api.post('/habits', data);
export const toggleHabit = (habitId, date, completed) => api.post(`/habits/${habitId}/check`, { date, completed });
export const updateHabit = (habitId, data) => api.put(`/habits/${habitId}`, data);
export const deleteHabit = (habitId) => api.delete(`/habits/${habitId}`);
