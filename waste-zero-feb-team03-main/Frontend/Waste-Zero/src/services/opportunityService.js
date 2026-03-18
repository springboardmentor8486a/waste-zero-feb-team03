import axios from "axios";

// Create the Axios instance with your backend URL
const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Automatically attach the JWT token to every request for Protected Routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- BASIC OPPORTUNITY MANAGEMENT ---

export const getAllOpportunities = (params = {}) =>
  API.get("/opportunities", { params });

export const getMyOpportunities = (params = {}) =>
  API.get("/opportunities/my", { params });

export const getOpportunityById = (id) =>
  API.get(`/opportunities/${id}`);

export const createOpportunity = (data) =>
  API.post("/opportunities", data);

export const updateOpportunity = (id, data) =>
  API.put(`/opportunities/${id}`, data);

export const deleteOpportunity = (id) =>
  API.delete(`/opportunities/${id}`);

// --- MILESTONE 2: VOLUNTEER & NGO INTERACTION ---

/**
 * Sends a request for the logged-in volunteer to apply for a task
 * @param {string} id - The Opportunity ID (_id)
 */
export const applyToOpportunity = (id) =>
  API.post(`/opportunities/${id}/apply`);

/**
 * Fetches the list of volunteers who applied for a specific task
 * Accessible only by the NGO who created the task
 * @param {string} id - The Opportunity ID (_id)
 */
export const getOpportunityApplicants = (id) =>
  API.get(`/opportunities/${id}/applicants`);

export default API;