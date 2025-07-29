const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useEffect, useState } from "react";
import axios from "axios";

export function useAuthCheck() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
    useEffect(() => {
      axios.post(
        `${API_URL}/api/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data?.accessToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
    }, []);
  
    return isAuthenticated;
  }
