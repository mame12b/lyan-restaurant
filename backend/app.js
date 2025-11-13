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

// ----------------- Security middleware -----------------
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

// ---------- ✅ Dynamic CORS configuration (FIXED) ----------
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

const allowedOrigins = [
  'http://localhost:3000',
  'https://lyan-restaurant.vercel.app',
  'https://lyan-restaurant-10e01qkw6-mame-beletes-projects.vercel.app',
  ...envOrigins
];

const allowedOriginSet = new Set(allowedOrigins);

const isAllowedVercelOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return hostname.includes('lyan-restaurant') && hostname.endsWith('.vercel.app');
  } catch (error) {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman/curl
    if (allowedOriginSet.has(origin) || isAllowedVercelOrigin(origin)) {
      return callback(null, true);
    }
    console.error(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error(`CORS policy: origin ${origin} is not allowed`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204
};

// ✅ Apply CORS middleware (including preflight)
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// ----------------- Body parsers and cookie parser -----------------
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply rate limiter to API routes
app.use('/api', apiLimiter);

// ----------------- Static files -----------------
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(publicDir, 'favicon.ico');
  res.sendFile(faviconPath, err => {
    if (err) res.sendStatus(204);
  });
});

// ----------------- Health checks -----------------
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
  res.send('Backend is running ✅');
});

// ----------------- API routes -----------------
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);

// ----------------- Error handlers -----------------
app.use(notFound);
app.use(errorHandler);

export default app;
