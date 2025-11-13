import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ACCESS_TOKEN_SECRET } from './tokenService.js';
import logger from '../utils/logger.js';

const buildSocketServer = (httpServer, { allowedOrigins }) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.has(origin)) return callback(null, true);
        try {
          const { hostname } = new URL(origin);
          if (hostname.includes('lyan-restaurant') && hostname.endsWith('.vercel.app')) {
            return callback(null, true);
          }
        } catch (error) {
          // ignore URL parse error, fall through to rejection
        }
        logger.warn({ origin }, 'Socket.IO CORS blocked origin');
        return callback(new Error('Origin not allowed'), false);
      },
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
        || socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id).select('_id role name');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = {
        id: user._id.toString(),
        role: user.role,
        name: user.name
      };

      socket.join(socket.data.user.id);
      if (socket.data.user.role === 'admin') {
        socket.join('admins');
      }

      next();
    } catch (error) {
      logger.warn({ err: error.message }, 'Socket authentication failed');
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    logger.info({ userId: socket.data.user?.id }, 'Socket connected');

    socket.on('disconnect', (reason) => {
      logger.info({ userId: socket.data.user?.id, reason }, 'Socket disconnected');
    });
  });

  return io;
};

export default buildSocketServer;
