import api from './api';

export const getMentalState = () => api.get('/mindset');
export const logMentalState = (data) => api.post('/mindset', data);
