import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import axios from "axios";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/refresh`, {
        withCredentials: true,
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error("Auth check failed:", error);
      }
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Remove the duplicate useEffect for checkAuth
  // Keep only one initial auth check
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (userData: any) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      const { accessToken, user } = response.data;
      setAccessToken(accessToken);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!user) return; // Don't refresh if no user

    const refreshToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/refresh`, {
          withCredentials: true,
          headers: {
            "x-api-key": API_KEY,
          },
        });

        if (response.data.success) {
          setAccessToken(response.data.accessToken);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        setUser(null);
        setAccessToken(null);
        navigate("/login");
      }
    };

    const interval = setInterval(refreshToken, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      setAccessToken(null);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, accessToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
