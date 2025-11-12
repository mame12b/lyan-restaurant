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
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

// ---------- Dynamic CORS configuration (safe for credentials) ----------
// Configure allowed origins via environment:
// - ALLOWED_ORIGINS (comma separated) preferred, fallback to FRONTEND_URL, fallback to http://localhost:3000
const allowedRaw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'https://lyan-restaurant-git-main-mame-beletes-projects.vercel.app/';
const allowedOrigins = allowedRaw.split(',').map(o => o.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // If no origin (e.g. server-to-server, curl, Postman), allow it.
    if (!origin) return callback(null, true);

    // If the origin is in the allowed list, allow it
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Otherwise reject
    const msg = `CORS policy: origin ${origin} is not allowed`;
    return callback(new Error(msg), false);
  },
  credentials: true, // allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204
};

// Apply CORS middleware (including preflight)
app.options('*', cors(corsOptions)); // enable preflight for all routes
app.use(cors(corsOptions));

// ----------------- Body parsers and cookie parser -----------------
app.use(express.json());
app.use(bodyParser.json()); // optional - express.json() already covers JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply rate limiter to API routes
app.use('/api', apiLimiter);

// Serve static files from backend/public (put favicon.ico there if you want)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Serve favicon (prefer real file if present; otherwise return 204)
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(publicDir, 'favicon.ico');
  res.sendFile(faviconPath, (err) => {
    if (err) res.sendStatus(204);
  });
});

// ----------------- Health & readiness -----------------
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

// ----------------- API routes -----------------
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 and error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;