import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔐 LOGIN
  const login = async (credentials) => {
    try {
      const res = await API.post("/auth/login/", credentials);

      // Save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Save user
      setUser(res.data.user || res.data);

      return res;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await API.post("/auth/logout/");
    } catch (err) {
      // ✅ ESLint FIX (use err)
      console.warn("Logout API failed:", err.message);
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  // 👤 AUTO LOAD USER ON APP START
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access");

      if (token) {
        try {
          const res = await API.get("/auth/me/");
          setUser(res.data);
        } catch (error) {
          console.error("Auto login failed:", error);
          logout();
        }
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};