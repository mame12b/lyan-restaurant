import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';


import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { notFound } from './middlewares/errorMiddleware.js';
import { errorHandler } from './utils/error.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});


// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);


// Body parsers and cookie parser
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', apiLimiter);


// server static files from the 'public' directory. place a favicon at backend/public/favicon.ico
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));


// prefer to server a real favicon if it exists, otherwise fall back  to 204 to silence browser requests
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(publicDir, 'favicon.ico');
  res.sendFile(faviconPath, (err) => {
    if (err) {
      res.sendStatus(204);
    }
  });
});


// app rate limiting to all /api routes
app.use('/api', apiLimiter);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/readiness', (req, res) => {
  const dbReady = Boolean(app.locals?.dbReady);
  const statusCode = dbReady ? 200 : 503;
  res.status(statusCode).json({ status: dbReady ? 'ready' : 'starting' });
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);


// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
