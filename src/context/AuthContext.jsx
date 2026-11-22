import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user_data') || 'null');
    } catch {
      return null;
    }
  });

  const refreshAuth = useCallback(() => {
    const token = localStorage.getItem('access_token');
    const isGuest = localStorage.getItem('is_guest') === 'true';
    setIsAuthenticated(!!token || isGuest);
    try {
      setUser(JSON.parse(localStorage.getItem('user_data') || 'null'));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('storage', refreshAuth);
    return () => window.removeEventListener('storage', refreshAuth);
  }, [refreshAuth]);

  const setAuth = (token, refreshToken, userData, isGuest = false) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('is_guest', String(isGuest));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('is_guest');
    setIsAuthenticated(false);
    setUser(null);
  };

  const setGuest = (onSuccess) => {
    localStorage.setItem('access_token', 'guest_access_token');
    localStorage.setItem('refresh_token', 'guest_refresh_token');
    localStorage.setItem('user_data', JSON.stringify({ user_name: 'guest' }));
    localStorage.setItem('is_guest', 'true');
    setIsAuthenticated(true);
    setUser({ user_name: 'guest' });
    if (onSuccess) onSuccess('/main');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, refreshAuth, setAuth, clearAuth, setGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
