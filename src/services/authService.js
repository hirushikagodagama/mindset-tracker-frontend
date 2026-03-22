import api from './api';

/** Sign in with email + password */
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

/** Create a new account */
export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

/** Verify Google ID token credential and sign in / register */
export const googleAuth = (credential) =>
  api.post('/auth/google', { credential });

/** Load the authenticated user */
export const getMe = () =>
  api.get('/auth/me');
