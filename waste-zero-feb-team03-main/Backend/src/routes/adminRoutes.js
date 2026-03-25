import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
    getOverviewStats,
    getUsers,
    updateUserStatus,
    getOpportunities,
    deleteOpportunity,
    getReports,
    getLogs
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth and admin role protection to ALL routes in this file
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/overview', getOverviewStats);

router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

router.get('/opportunities', getOpportunities);
router.delete('/opportunities/:id', deleteOpportunity);

router.get('/reports', getReports);
router.get('/logs', getLogs);

export default router;
