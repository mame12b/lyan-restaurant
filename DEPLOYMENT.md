# Deployment Guide - LYAN Catering & Events

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Domain & SSL Configuration](#domain--ssl-configuration)
8. [Post-Deployment](#post-deployment)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying LYAN Catering & Events to production using:
- **Database**: MongoDB Atlas (free tier available)
- **Backend**: Railway / Heroku / Render
- **Frontend**: Vercel / Netlify
- **File Storage**: Cloud storage for uploaded receipts

### Architecture Overview
```
[Users] → [Vercel/Netlify (Frontend)] → [Railway/Heroku (Backend)] → [MongoDB Atlas]
                                                ↓
                                         [Cloud Storage]
```

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Git repository with your code
- [ ] GitHub/GitLab account
- [ ] MongoDB Atlas account (free)
- [ ] Railway/Heroku/Render account (free tier available)
- [ ] Vercel/Netlify account (free)
- [ ] Domain name (optional but recommended)
- [ ] Email service account (SendGrid, Mailgun, etc.)

---

## Environment Setup

### 1. Production Environment Variables

Create production versions of your `.env` files:

**Backend Production `.env`**
```env
# Server
NODE_ENV=production
PORT=5001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lyan-restaurant?retryWrites=true&w=majority

# JWT Secrets (Generate strong secrets!)
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters_long_production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_super_secure_refresh_secret_different_from_jwt_production
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://your-domain.com

# Email Service (e.g., SendGrid)
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@your-domain.com
SENDGRID_API_KEY=your_sendgrid_api_key

# Messaging Platforms
WHATSAPP_NUMBER=251911234567
TELEGRAM_USERNAME=lyanrestaurant

# File Upload (Cloud storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials (for first admin account)
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=your_secure_admin_password
```

**Frontend Production `.env`**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_WHATSAPP_NUMBER=251911234567
REACT_APP_TELEGRAM_USERNAME=lyanrestaurant
```

### 2. Generate Secure Secrets

Generate strong JWT secrets using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice to generate different secrets for JWT_SECRET and REFRESH_TOKEN_SECRET.

---

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (Free M0 tier)

### 2. Configure Database

**Create Database:**
1. Click "Collections" → "Create Database"
2. Database name: `lyan-restaurant`
3. Collection name: `users` (others will be created automatically)

**Create Database User:**
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `lyan-admin`
4. Password: Generate secure password
5. Database User Privileges: "Atlas admin"

**Whitelist IP Addresses:**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for production
   - Or whitelist specific IPs of your hosting service

### 3. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://lyan-admin:<password>@cluster0.xxxxx.mongodb.net/lyan-restaurant?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your database user password

### 4. Test Connection Locally

```bash
cd backend
# Update .env with Atlas connection string
npm run dev
```

Check console for "MongoDB Connected" message.

---

## Backend Deployment

### Option 1: Railway (Recommended)

**Step 1: Setup Railway**
1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub
3. Create new project → "Deploy from GitHub repo"
4. Select your repository

**Step 2: Configure Build Settings**
1. Root Directory: `/backend`
2. Build Command: `npm install`
3. Start Command: `npm start`

**Step 3: Add Environment Variables**
1. Go to project → Variables tab
2. Add all backend environment variables from production `.env`
3. Click "Add Variable" for each one

**Step 4: Deploy**
1. Railway will auto-deploy on git push
2. Get your backend URL: `https://your-app.railway.app`

**Step 5: Configure Domain (Optional)**
1. Settings → Domains
2. Add custom domain or use Railway subdomain

---

### Option 2: Heroku

**Step 1: Install Heroku CLI**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku login
```

**Step 2: Create Heroku App**
```bash
cd backend
heroku create lyan-catering-backend
```

**Step 3: Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your_secret"
heroku config:set REFRESH_TOKEN_SECRET="your_refresh_secret"
heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"
# ... add all other variables
```

**Step 4: Create Procfile**
```bash
echo "web: npm start" > Procfile
```

**Step 5: Deploy**
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

**Step 6: Scale Dynos**
```bash
heroku ps:scale web=1
```

**Step 7: View Logs**
```bash
heroku logs --tail
```

---

### Option 3: Render

**Step 1: Setup Render**
1. Go to [Render](https://render.com/)
2. Sign up with GitHub
3. New → Web Service
4. Connect your repository

**Step 2: Configure Service**
- Name: `lyan-backend`
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Plan: Free

**Step 3: Add Environment Variables**
1. Advanced → Add Environment Variable
2. Add all variables from production `.env`

**Step 4: Deploy**
- Render will auto-deploy
- Get your URL: `https://lyan-backend.onrender.com`

---

## Frontend Deployment

### Option 1: Vercel (Recommended for React)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Prepare Frontend**
```bash
cd frontend
# Update .env with production backend URL
echo "REACT_APP_API_URL=https://your-backend-url.com/api" > .env.production
```

**Step 3: Deploy**
```bash
vercel
```

**Step 4: Configure Project**
- Framework Preset: Create React App
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`

**Step 5: Add Environment Variables**
```bash
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-url.com/api
```

**Step 6: Deploy to Production**
```bash
vercel --prod
```

---

### Option 2: Netlify

**Step 1: Prepare Build**
```bash
cd frontend
npm run build
```

**Step 2: Install Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
```

**Step 3: Deploy**
```bash
netlify deploy --prod --dir=build
```

**Or use Netlify UI:**
1. Go to [Netlify](https://www.netlify.com/)
2. New site from Git
3. Connect GitHub repository
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

**Step 4: Environment Variables**
1. Site settings → Build & deploy → Environment
2. Add `REACT_APP_API_URL` with your backend URL

---

## Domain & SSL Configuration

### Custom Domain Setup

**For Backend (Railway/Heroku/Render):**
1. Add custom domain in platform settings
2. Create CNAME record in your DNS:
   ```
   api.your-domain.com → your-app.railway.app
   ```
3. SSL certificate is auto-generated

**For Frontend (Vercel/Netlify):**
1. Add custom domain in platform settings
2. Update DNS records:
   ```
   A     @    76.76.21.21 (Vercel IP)
   CNAME www  cname.vercel-dns.com
   ```
3. SSL certificate is auto-generated

### Update CORS Configuration

After domain setup, update backend CORS:

```javascript
// backend/index.js
const corsOptions = {
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Redeploy backend.

---

## Post-Deployment

### 1. Create Admin Account

**Option A: Via API**
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@your-domain.com",
    "password": "SecureAdminPassword123!"
  }'
```

Then manually update the user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@your-domain.com" },
  { $set: { role: "admin", isVerified: true } }
)
```

**Option B: Create Seed Script**
```javascript
// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (adminExists) {
    console.log('Admin already exists');
    return;
  }

  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
    isVerified: true
  });

  console.log('Admin created successfully');
  process.exit(0);
}

createAdmin();
```

Run on production:
```bash
node scripts/createAdmin.js
```

### 2. Test Production Deployment

**Backend Health Check:**
```bash
curl https://your-backend-url.com/api/health
```

**Test Registration:**
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Frontend:**
1. Visit https://your-domain.com
2. Test registration and login
3. Test package browsing
4. Test booking creation

### 3. Configure Monitoring

**Backend Monitoring (Railway):**
- Metrics tab shows CPU, memory, requests
- Deployments tab shows deployment history
- Logs tab shows real-time logs

**Error Tracking:**
Consider adding Sentry for error tracking:
```bash
npm install @sentry/node
```

```javascript
// backend/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

---

## Monitoring & Maintenance

### Regular Tasks

**Daily:**
- [ ] Check error logs
- [ ] Monitor uptime (use UptimeRobot)
- [ ] Check booking submissions

**Weekly:**
- [ ] Review database performance
- [ ] Check disk usage
- [ ] Backup database

**Monthly:**
- [ ] Update dependencies
- [ ] Review security updates
- [ ] Analyze usage statistics

### Database Backups

**MongoDB Atlas Automatic Backups:**
1. Cluster → Backup
2. Enable Cloud Provider Snapshots (available on paid tiers)

**Manual Backup:**
```bash
mongodump --uri="mongodb+srv://..." --out=./backup-$(date +%Y%m%d)
```

**Restore Backup:**
```bash
mongorestore --uri="mongodb+srv://..." ./backup-20251103
```

### Logging

**Structured Logging:**
```javascript
// backend/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

## Troubleshooting

### Backend Issues

**Issue: Backend won't start**
```bash
# Check logs
railway logs # or heroku logs --tail

# Common causes:
# 1. Missing environment variables
# 2. MongoDB connection string incorrect
# 3. Port binding issues
```

**Issue: 502 Bad Gateway**
- Backend crashed or not responding
- Check memory usage (may need to upgrade plan)
- Check for infinite loops or memory leaks

**Issue: CORS errors**
```javascript
// backend/index.js
// Ensure CORS is configured correctly
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### Database Issues

**Issue: MongoDB connection timeout**
- Check Network Access whitelist in Atlas
- Verify connection string is correct
- Check if database user has correct permissions

**Issue: Database authentication failed**
- Verify username/password in connection string
- Check special characters are URL-encoded
- Ensure user has correct privileges

### Frontend Issues

**Issue: API calls failing**
```bash
# Check environment variable
echo $REACT_APP_API_URL
# Should be: https://your-backend-url.com/api
```

**Issue: 404 on page refresh**
Add `_redirects` file in `public/` folder:
```
/*    /index.html   200
```

Or configure in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Issue: Build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Performance Issues

**Issue: Slow response times**
- Add database indexes
- Enable database profiling
- Use MongoDB Atlas Performance Advisor
- Consider implementing caching (Redis)

**Issue: High memory usage**
- Check for memory leaks
- Optimize database queries
- Limit result set sizes (pagination)
- Consider upgrading hosting plan

---

## Security Checklist

Before going live:

- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS enabled on all domains
- [ ] Environment variables secured (not in code)
- [ ] Database user has minimum required privileges
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS configured for specific origins
- [ ] Admin account secured with strong password
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies updated to latest secure versions
- [ ] File upload size limits configured
- [ ] SQL/NoSQL injection prevention implemented

---

## Useful Commands

### Backend
```bash
# View logs
railway logs                 # Railway
heroku logs --tail          # Heroku
# (Render: use dashboard)

# Run database migrations
railway run npm run migrate

# Access database
railway run mongosh $MONGODB_URI

# Restart service
railway up --detach         # Railway
heroku restart              # Heroku
```

### Frontend
```bash
# Deploy to production
vercel --prod              # Vercel
netlify deploy --prod      # Netlify

# View logs
vercel logs               # Vercel
netlify logs              # Netlify
```

### Database
```bash
# Connect to production database
mongosh "mongodb+srv://..."

# Show databases
show dbs

# Use database
use lyan-restaurant

# Show collections
show collections

# Query users
db.users.find({ role: "admin" })

# Create index
db.bookings.createIndex({ eventDate: 1, status: 1 })
```

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

**Last Updated**: November 3, 2025  
**Version**: 1.0
