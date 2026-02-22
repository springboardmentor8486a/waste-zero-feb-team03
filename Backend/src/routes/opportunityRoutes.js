import express from 'express';
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// public
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunityById);

// NGO-only actions
router.post('/', protect, authorizeRoles('NGO'), createOpportunity);
router.get('/my', protect, authorizeRoles('NGO'), getMyOpportunities);
router.put('/:id', protect, authorizeRoles('NGO'), updateOpportunity);
router.delete('/:id', protect, authorizeRoles('NGO'), deleteOpportunity);

export default router;
