import express from 'express';
import rateLimit from 'express-rate-limit';
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

// Rate limiter for admin mutation actions (not reads) 
// 60 write actions per 15 minutes per admin user
const adminMutationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60,
    keyGenerator: (req) => req.user?._id?.toString() || req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many admin actions. Please wait before retrying.'
    }
});

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
