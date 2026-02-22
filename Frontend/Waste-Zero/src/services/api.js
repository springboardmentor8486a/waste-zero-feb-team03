import axios from "axios";

// baseURL should match the backend routing. Currently the server registers
// routes at `/auth` and `/users` (no `/api` prefix). Adjust here to avoid
// `404` errors when the frontend calls the API.
const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
