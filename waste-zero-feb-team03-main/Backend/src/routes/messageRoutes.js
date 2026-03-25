import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getConversation,
  getConversationList,
  markAsRead,
} from '../controllers/messageController.js';

const router = express.Router();

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?._id?.toString() || 'anonymous',
  message: { message: 'Too many messages. Please slow down.' },
});

// POST /messages
router.post('/', protect, messageLimiter, sendMessage);

// GET  /messages           — inbox
router.get('/', protect, getConversationList);

// GET  /messages/:userId   — history 
router.get('/:userId', protect, getConversation);

// PATCH /messages/:userId/read
router.patch('/:userId/read', protect, markAsRead);

export default router;