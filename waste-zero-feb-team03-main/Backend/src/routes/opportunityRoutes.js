import express from "express";
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  getMyOpportunities,
  applyToOpportunity, // Add this import
  getOpportunityApplicants // Add this import
} from "../controllers/opportunityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Existing NGO Routes
router.get("/my", protect, authorizeRoles("NGO"), getMyOpportunities);
router.post("/", protect, authorizeRoles("NGO"), createOpportunity);
router.put("/:id", protect, authorizeRoles("NGO"), updateOpportunity);
router.delete("/:id", protect, authorizeRoles("NGO"), deleteOpportunity);

// --- MILESTONE 2 NEW ROUTES ---
// 1. Volunteer applies to an opportunity
router.post("/:id/apply", protect, authorizeRoles("volunteer"), applyToOpportunity);

// 2. NGO views applicants for their specific opportunity
router.get("/:id/applicants", protect, authorizeRoles("NGO"), getOpportunityApplicants);

// Public Routes
router.get("/", getAllOpportunities);
router.get("/:id", getOpportunityById);

export default router;