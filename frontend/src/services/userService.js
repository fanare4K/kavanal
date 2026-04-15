import API from "./api";

// GET all users
export const getUsers = () => API.get("/users/");

// GET one user
export const getUser = (id) => API.get(`/users/${id}/`);

// CREATE user
export const createUser = (data) => API.post("/users/", data);

// UPDATE user
export const updateUser = (id, data) =>
  API.put(`/users/${id}/`, data);

// DELETE user
export const deleteUser = (id) =>
  API.delete(`/users/${id}/`);