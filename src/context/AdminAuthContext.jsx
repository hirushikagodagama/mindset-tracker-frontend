import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { adminLogin as apiAdminLogin } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAdminAuthenticated = !!adminToken;

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('admin_token', adminToken);
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  }, [adminToken]);

  const login = useCallback(async (email, password) => {
    const data = await apiAdminLogin(email, password);
    const { token, admin } = data;
    setAdminToken(token);
    setAdminUser(admin);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
    return data;
  }, []);

  const logout = useCallback(() => {
    setAdminToken(null);
    setAdminUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ adminToken, adminUser, isAdminAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

export default AdminAuthContext;
