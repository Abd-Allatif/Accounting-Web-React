import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_data')));

  const refreshAuth = () => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
    setUser(JSON.parse(localStorage.getItem('user_data')));
  };

  useEffect(() => {
    window.addEventListener('storage', refreshAuth);
    return () => window.removeEventListener('storage', refreshAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
