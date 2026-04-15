import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginAPI } from "../services/authService";
import { getUser } from "../services/userService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔐 LOGIN
  const login = async (credentials) => {
    const data = await loginAPI(credentials);

    const userId = localStorage.getItem("user_id");

    const res = await getUser(userId);
    setUser(res.data);

    return data;
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // 👤 AUTO LOAD USER
  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) return;

      try {
        const res = await getUser(userId);
        setUser(res.data);
      } catch (err) {
        logout();
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