import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  getMatchesForVolunteer,
  getMatchesForOpportunity,
} from '../controllers/matchController.js';

const router = express.Router();

// GET /matches  — volunteer sees their ranked opportunities
router.get('/', protect, authorizeRoles('volunteer'), getMatchesForVolunteer);

// GET /matches/:opportunityId  — NGO sees ranked volunteers for their opportunity
router.get('/:opportunityId', protect, authorizeRoles('NGO'), getMatchesForOpportunity);

export default router;