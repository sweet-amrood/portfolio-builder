import { Server } from 'socket.io';
import User from './models/User.js';
import Conversation from './models/Conversation.js';
import { verifyToken } from './utils/jwt.js';
import { verifyVisitorToken } from './utils/visitorToken.js';

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const authToken = socket.handshake.auth?.token;
      const visitorToken = socket.handshake.auth?.visitorToken;

      if (authToken) {
        const decoded = verifyToken(authToken);
        const user = await User.findById(decoded.id);
        if (!user) return next(new Error('Unauthorized'));
        socket.userId = String(user._id);
        socket.role = 'owner';
        return next();
      }

      if (visitorToken) {
        const decoded = verifyVisitorToken(visitorToken);
        const conversation = await Conversation.findById(decoded.conversationId);
        if (!conversation) return next(new Error('Conversation not found'));
        socket.conversationId = String(conversation._id);
        socket.role = 'visitor';
        return next();
      }

      return next(new Error('Unauthorized'));
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    if (socket.role === 'owner' && socket.userId) {
      socket.join(`owner:${socket.userId}`);
    }

    if (socket.role === 'visitor' && socket.conversationId) {
      socket.join(`conversation:${socket.conversationId}`);
    }

    socket.on('conversation:join', ({ conversationId }) => {
      if (socket.role !== 'owner' || !conversationId) return;
      socket.join(`conversation:${conversationId}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function emitToOwner(ownerId, event, payload) {
  if (!io) return;
  io.to(`owner:${ownerId}`).emit(event, payload);
}

export function emitToConversation(conversationId, event, payload) {
  if (!io) return;
  io.to(`conversation:${conversationId}`).emit(event, payload);
}
