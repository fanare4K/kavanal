import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔐 LOGIN
  const login = async (credentials) => {
    const res = await API.post("/auth/login/", credentials);

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const me = await API.get("/auth/me/");
    setUser(me.data);

    return res;
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await API.post("/auth/logout/");
    } catch (err) {
      console.warn(err.message);
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  // 👤 AUTO LOAD USER
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access");

      if (token) {
        try {
          const res = await API.get("/auth/me/");
          setUser(res.data);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
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