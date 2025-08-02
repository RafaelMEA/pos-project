// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['x-api-key'] = API_KEY;

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/refresh`, {});
      
      if (response.data?.accessToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        setIsAuthenticated(true);
        return true;
      }
      
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setIsAuthenticated(false);
      delete axios.defaults.headers.common['Authorization'];
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data?.accessToken && response.data?.user) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`);
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    refreshToken();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (isAuthenticated) {
      // Refresh token every 14 minutes (access token expires in 15 minutes)
      const interval = setInterval(() => {
        refreshToken();
      }, 14 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};