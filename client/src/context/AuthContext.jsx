import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuth = useCallback((token, userData) => {
    if (token) localStorage.setItem('token', token);
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    setAuth(data.token, data.user);
    return data;
  };

  const signup = async (userData) => {
    const { data } = await authAPI.signup(userData);
    setAuth(data.token, data.user);
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await authAPI.google(credential);
    setAuth(data.token, data.user);
    return data;
  };

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
      return data.user;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth]);

  const updateUser = useCallback((patch) => {
    setUser((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, googleLogin, logout, setAuth, clearAuth, refreshUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
