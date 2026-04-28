import API from "./api";
import { getUser } from "./userService";

// 🔐 LOGIN FIXED
export const login = async (data) => {
  const res = await API.post("/auth/login/", data);

  const { access, refresh } = res.data;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  // 🔥 decode token to get user_id
  const payload = JSON.parse(atob(access.split(".")[1]));
  const userId = payload.user_id;

  localStorage.setItem("user_id", userId);

  // 🔥 fetch full user from backend
  const userRes = await getUser(userId);

  localStorage.setItem("user", JSON.stringify(userRes.data));

  return userRes.data;
};

// 🚪 LOGOUT
export const logout = async () => {
  const refresh = localStorage.getItem("refresh");

  await API.post("/auth/logout/", { refresh });

  localStorage.clear();
};