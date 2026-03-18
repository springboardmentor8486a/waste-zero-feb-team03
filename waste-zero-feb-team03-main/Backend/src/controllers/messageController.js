import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import { emitToUser } from '../socket/socketServer.js';
import { calculateMatchScore } from '../utils/matchingAlgorithm.js';
/* =====================================
   POST /messages
===================================== */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user._id;

    if (!receiver_id || !content?.trim()) {
      return res.status(400).json({ message: 'receiver_id and content are required' });
    }

    if (receiver_id.toString() === sender_id.toString()) {
      return res.status(400).json({ message: 'Cannot send a message to yourself' });
    }

    const receiver = await User.findById(receiver_id).select('_id name role skills location');
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    if (req.user.role === receiver.role) {
      return res.status(403).json({ message: 'Forbidden: Cannot chat with users of the same role' });
    }

    const conversation_id = Message.buildConversationId(sender_id, receiver_id);

    // Verify if conversation exists or users are matched
    const existingMessage = await Message.findOne({ conversation_id }).lean();
    if (!existingMessage) {
      const isSenderVolunteer = req.user.role === 'volunteer';
      const volunteer = isSenderVolunteer ? req.user : receiver;
      const ngoId = isSenderVolunteer ? receiver._id : req.user._id;

      const ngoOpportunities = await Opportunity.find({ ngo_id: ngoId, status: 'open' }).lean();

      let isMatched = false;
      for (const opp of ngoOpportunities) {
        const { isEligible } = calculateMatchScore(volunteer, opp);
        if (isEligible) {
          isMatched = true;
          break;
        }
      }

      if (!isMatched) {
        return res.status(403).json({ message: 'Forbidden: You are not matched with this user yet' });
      }
    }

    const message = await Message.create({
      sender_id,
      receiver_id,
      content: content.trim(),
      conversation_id,
    });

    const populated = await message.populate([
      { path: 'sender_id',   select: 'name email' },
      { path: 'receiver_id', select: 'name email' },
    ]);

    emitToUser(receiver_id, 'newMessage', { message: populated, conversationId: conversation_id });

    const notification = await Notification.create({
      user_id: receiver_id,
      type:    'newMessage',
      message: `New message from ${req.user.name}`,
      ref_id:  message._id,
      ref_type:'Message',
    });

    emitToUser(receiver_id, 'notification', notification);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET /messages/:userId  — paginated history
===================================== */
export const getConversation = async (req, res, next) => {
  try {
    const myId     = req.user._id;
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const conversation_id = Message.buildConversationId(myId, userId);

    const [messages, total] = await Promise.all([
      Message.find({ conversation_id })
        .sort({ timestamp: 1 })
        .skip(skip)
        .limit(limit)
        .populate('sender_id',   'name')
        .populate('receiver_id', 'name')
        .lean(),
      Message.countDocuments({ conversation_id }),
    ]);

    res.json({ total, page, pages: Math.ceil(total / limit), messages });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   GET /messages  — inbox
===================================== */
export const getConversationList = async (req, res, next) => {
  try {
    const myId    = req.user._id;           // Mongoose ObjectId
    const myIdStr = myId.toString();

    const allMessages = await Message.find({
      $or: [{ sender_id: myId }, { receiver_id: myId }],
    })
      .sort({ timestamp: -1 })
      .lean();

    if (!allMessages.length) {
      return res.json({ conversations: [] });
    }

    // Group by conversation_id, keep latest + count unreads
    const seen = new Map();

    for (const msg of allMessages) {
      const cid = msg.conversation_id;
      if (!seen.has(cid)) {
        seen.set(cid, { lastMessage: msg, unreadCount: 0 });
      }
      if (msg.receiver_id.toString() === myIdStr && msg.read === false) {
        seen.get(cid).unreadCount += 1;
      }
    }

    // Populate the other user's info
    const conversations = await Promise.all(
      [...seen.entries()].map(async ([conversationId, { lastMessage, unreadCount }]) => {
        const otherId =
          lastMessage.sender_id.toString() === myIdStr
            ? lastMessage.receiver_id
            : lastMessage.sender_id;

        const otherUser = await User.findById(otherId).select('name email').lean();
        return { conversationId, otherUser, lastMessage, unreadCount };
      })
    );

    conversations.sort(
      (a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   PATCH /messages/:userId/read
===================================== */
export const markAsRead = async (req, res, next) => {
  try {
    const conversation_id = Message.buildConversationId(req.user._id, req.params.userId);

    await Message.updateMany(
      { conversation_id, receiver_id: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
};