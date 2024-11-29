import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || '';
    } catch (error) {
      console.error('Access to localStorage is restricted:', error);
      return '';
    }
  });

  const login = (token) => {
    setToken(token);
    try {
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Could not save token to localStorage:', error);
    }
  };

  const logout = () => {
    setToken('');
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Could not remove token from localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
