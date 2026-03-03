import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  // Try to get 'token' first, then try to get it from the 'user' object
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (userData) {
    const parsed = JSON.parse(userData);
    const userToken = parsed.token || parsed; 
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;