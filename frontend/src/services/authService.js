import API from "./api";

// LOGIN
export const login = (data) => {
  return API.post("/auth/login/", data);
};

// LOGOUT
export const logout = (refresh) => {
  return API.post("/auth/logout/", { refresh });
};