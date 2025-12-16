import express from 'express';
import cors from 'cors';
import compression from 'compression';
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
import inquiryRoutes from './routes/inquiryRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import getAllowedOrigins from './config/origins.js';
import metricsMiddleware from './middlewares/metricsMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy - required when running behind a reverse proxy (Nginx)
app.set('trust proxy', true);

// ----------------- Security middleware -----------------
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.whatsapp.com'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"]
      }
    }
  })
);

// Add Permissions-Policy header to suppress browser warnings
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'bluetooth=(), geolocation=(), microphone=(), camera=(), interest-cohort=(), ' +
    'otp-credentials=(), private-state-token-issuance=(), private-state-token-redemption=(), ' +
    'shared-storage=(), shared-storage-select-url=()'
  );
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

// ---------- ✅ Dynamic CORS configuration (FIXED) ----------
const { allowedOrigins, isAllowedVercelOrigin } = getAllowedOrigins();
const allowedOriginSet = new Set(allowedOrigins);
app.set('allowedOrigins', allowedOriginSet);

// ----------------- Performance middleware -----------------
// Enable gzip/deflate compression for responses (static + API)
app.use(compression());

// Simple response timing and slow-request logging
app.use(metricsMiddleware);

const corsOptions = {
  origin: (origin, callback) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 [CORS] Request origin:', origin);
    
    if (!origin) {
      console.log('✅ [CORS] Allowed - No origin (Postman/curl/same-origin)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return callback(null, true); // allow Postman/curl
    }
    
    if (allowedOriginSet.has(origin)) {
      console.log('✅ [CORS] Allowed - Origin in allowed list');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return callback(null, true);
    }
    
    if (isAllowedVercelOrigin(origin)) {
      console.log('✅ [CORS] Allowed - Vercel preview origin');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return callback(null, true);
    }
    
    console.error('❌ [CORS] Blocked:', origin);
    console.error('Allowed origins:', Array.from(allowedOriginSet));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
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
app.use('/api/inquiries', inquiryRoutes);

// ----------------- Error handlers -----------------
app.use(notFound);
app.use(errorHandler);

export default app;
