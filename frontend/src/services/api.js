import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8001/api", // ✅ matches Docker
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;