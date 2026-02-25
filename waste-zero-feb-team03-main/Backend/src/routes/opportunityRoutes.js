import express from "express";
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  getMyOpportunities,
} from "../controllers/opportunityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/my", protect, authorizeRoles("NGO"), getMyOpportunities);
router.post("/", protect, authorizeRoles("NGO"), createOpportunity);
router.put("/:id", protect, authorizeRoles("NGO"), updateOpportunity);
router.delete("/:id", protect, authorizeRoles("NGO"), deleteOpportunity);


router.get("/", getAllOpportunities);
router.get("/:id", getOpportunityById);

export default router;