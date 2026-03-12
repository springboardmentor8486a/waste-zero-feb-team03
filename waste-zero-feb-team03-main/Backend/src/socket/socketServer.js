import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

/** @type {Server} */
let io = null;

/**
 * userId (string) → socketId (string)
 * Used to target a specific user for real-time events.
 */
const onlineUsers = new Map();

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT auth on every socket connection 
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) return next(new Error('No token provided'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role, ... }
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  //  Connection 
  io.on('connection', (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);
    console.log(`[Socket] connected: ${userId}`);

    // Typing indicators 
    socket.on('typing', ({ receiverId }) => {
      const sid = onlineUsers.get(String(receiverId));
      if (sid) io.to(sid).emit('typing', { senderId: userId });
    });

    socket.on('stopTyping', ({ receiverId }) => {
      const sid = onlineUsers.get(String(receiverId));
      if (sid) io.to(sid).emit('stopTyping', { senderId: userId });
    });

    // Read receipt 
    socket.on('markRead', ({ senderId }) => {
      const sid = onlineUsers.get(String(senderId));
      if (sid) io.to(sid).emit('messagesRead', { readBy: userId });
    });

    // Disconnect 
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      console.log(`[Socket] disconnected: ${userId}`);
    });
  });

  console.log('[Socket] Socket.io initialised');
}

export const getIO = () => {
  if (!io) throw new Error('Socket not initialised — call initSocket() first');
  return io;
};

export const getOnlineUsers = () => onlineUsers;

export function emitToUser(userId, event, data) {
  const sid = onlineUsers.get(String(userId));
  if (sid && io) {
    io.to(sid).emit(event, data);
    return true;
  }
  return false;
}