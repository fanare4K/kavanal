import API from "./api";

export const login = (data) => {
  return API.post("/api/auth/login/", data);
};