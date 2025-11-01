import axios from "axios";

const API = axios.create({
  baseURL: "/api/profile",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProfile = () => API.get("/");
export const updateProfile = (data) => API.put("/", data);
export const uploadPhoto = (formData) =>
  API.post("/photo", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const getAddresses = () => API.get("/addresses");
export const addAddress = (data) => API.post("/addresses", data);
export const updateAddress = (id, data) => API.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => API.delete(`/addresses/${id}`);
export const changePassword = (data) => API.post("/change-password", data);
