import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  googleAuth as apiGoogleAuth,
  getMe as apiGetMe,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('mindset_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(() => !!localStorage.getItem('token'));

  const isAuthenticated = !!token;

  // Keep localStorage in sync
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('mindset_user');
    }
  }, [token]);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return null;
    }

    setAuthLoading(true);

    try {
      const response = await apiGetMe();
      const userData = response.data.data;

      setUser(userData);
      localStorage.setItem('mindset_user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }

    refreshUser().catch(() => {});
  }, [token, refreshUser]);

  /**
   * login() – calls the backend, stores token + user, returns the response data.
   * Throws on error so LoginPage can handle 403 / other errors.
   */
  const login = useCallback(async (email, password) => {
    const response = await apiLogin(email, password);
    const { token: jwt, user: userData } = response.data.data;
    setToken(jwt);
    setUser(userData);
    setAuthLoading(false);
    localStorage.setItem('token', jwt);
    localStorage.setItem('mindset_user', JSON.stringify(userData));
    return response.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await apiRegister(name, email, password);
    const { token: jwt, user: userData } = response.data.data;
    setToken(jwt);
    setUser(userData);
    setAuthLoading(false);
    localStorage.setItem('token', jwt);
    localStorage.setItem('mindset_user', JSON.stringify(userData));
    return response.data;
  }, []);

  const googleSignIn = useCallback(async (credential) => {
    const response = await apiGoogleAuth(credential);
    const { token: jwt, user: userData } = response.data.data;
    setToken(jwt);
    setUser(userData);
    setAuthLoading(false);
    localStorage.setItem('token', jwt);
    localStorage.setItem('mindset_user', JSON.stringify(userData));
    return response.data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        authLoading,
        login,
        register,
        googleSignIn,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
