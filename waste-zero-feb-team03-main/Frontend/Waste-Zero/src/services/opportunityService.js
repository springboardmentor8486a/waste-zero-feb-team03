import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllOpportunities = () =>
  API.get("/opportunities");

export const getOpportunityById = (id) =>
  API.get(`/opportunities/${id}`);

export const createOpportunity = (data) =>
  API.post("/opportunities", data);

export const updateOpportunity = (id, data) =>
  API.put(`/opportunities/${id}`, data);

export const deleteOpportunity = (id) =>
  API.delete(`/opportunities/${id}`);