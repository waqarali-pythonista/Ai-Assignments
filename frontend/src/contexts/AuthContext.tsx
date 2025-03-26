import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  const checkAdminStatus = useCallback(async () => {
    try {
      const user = await apiService.getCurrentUser();
      setIsAdmin(user.is_staff);
    } catch (error) {
      console.error('Error checking admin status:', error);
      logout();
    }
  }, [logout]);

  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    checkAdminStatus();
  }, [checkAdminStatus]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      checkAdminStatus();
    }
  }, [checkAdminStatus]);

  const value = {
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 