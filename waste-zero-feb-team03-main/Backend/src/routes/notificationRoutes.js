import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// GET    /notifications            — list 
router.get('/', protect, getNotifications);

// PATCH  /notifications/read-all   — mark all as read 
router.patch('/read-all', protect, markAllRead);

// PATCH  /notifications/:id/read   — mark one as read
router.patch('/:id/read', protect, markOneRead);

// DELETE /notifications/:id        — delete one
router.delete('/:id', protect, deleteNotification);

export default router;