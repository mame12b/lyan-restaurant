# LYAN Catering & Events - System Architecture

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Data Flow](#data-flow)
5. [Component Structure](#component-structure)
6. [Database Design](#database-design)
7. [API Architecture](#api-architecture)
8. [Authentication Flow](#authentication-flow)
9. [Security Considerations](#security-considerations)
10. [Scalability & Performance](#scalability--performance)

## Overview

LYAN Catering & Events is built using the MERN stack with a clear separation between frontend and backend services. The architecture follows RESTful API principles with JWT-based authentication and role-based access control.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │   Browser  │  │   Mobile   │  │   Desktop (Future)     │ │
│  └─────┬──────┘  └─────┬──────┘  └───────────┬────────────┘ │
│        │               │                     │               │
│        └───────────────┴─────────────────────┘               │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components Layer                                     │   │
│  │  ├─ Pages (Home, Packages, Booking, etc.)           │   │
│  │  ├─ Reusable Components (Navbar, Footer, etc.)      │   │
│  │  └─ Admin Components                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  State Management                                     │   │
│  │  ├─ AuthContext (User authentication state)         │   │
│  │  ├─ ThemeContext (UI theme preferences)             │   │
│  │  └─ AdminContext (Admin state)                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services Layer                                       │   │
│  │  ├─ API Service (HTTP requests)                      │   │
│  │  ├─ Auth Service (Login/Register/Logout)            │   │
│  │  └─ Package/Booking Services                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (HTTP/JSON)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes Layer (API Endpoints)                        │   │
│  │  ├─ /api/auth         (Authentication)              │   │
│  │  ├─ /api/packages     (Package management)          │   │
│  │  ├─ /api/bookings     (Booking operations)          │   │
│  │  └─ /api/admin        (Admin operations)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                     │   │
│  │  ├─ authMiddleware (JWT verification)               │   │
│  │  ├─ errorMiddleware (Error handling)                │   │
│  │  └─ validationMiddleware (Input validation)         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers Layer (Business Logic)                  │   │
│  │  ├─ authController (User authentication)            │   │
│  │  ├─ packageController (Package CRUD)                │   │
│  │  ├─ bookingController (Booking management)          │   │
│  │  └─ adminController (Admin operations)              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services Layer                                       │   │
│  │  ├─ emailService (Email notifications)              │   │
│  │  └─ tokenService (JWT token management)             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Models Layer (Data Schema)                          │   │
│  │  ├─ User Model                                       │   │
│  │  ├─ Package Model                                    │   │
│  │  └─ Booking Model                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ Mongoose ODM
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    users     │  │   packages   │  │   bookings   │      │
│  │  collection  │  │  collection  │  │  collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  WhatsApp    │  │   TeleBirr   │  │    Email     │      │
│  │   (wa.me)    │  │   Payment    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Stack
```
React 18.3.1
├── UI Framework: Material-UI 6.4.11
├── Routing: React Router DOM 6.30.0
├── State: React Context API
├── HTTP Client: Axios 1.9.0
├── Animations: Framer Motion 12.9.4
├── Carousel: React Slick 0.30.3
└── Build Tool: Create React App / Webpack
```

### Backend Stack
```
Node.js (ES6 Modules)
├── Framework: Express.js 4.21.2
├── Database: MongoDB + Mongoose 8.14.1
├── Authentication: JWT (jsonwebtoken)
├── Password Hashing: bcryptjs
├── Validation: express-validator
├── Security: cors, helmet, express-rate-limit
└── File Uploads: Multer (for payment receipts)
```

## Data Flow

### User Booking Flow
```
1. User browses packages
   ├─> GET /api/packages → Package list with filters
   └─> Response: Array of package objects

2. User selects package and fills booking form
   ├─> User enters event details (date, location, guests)
   └─> Frontend validates input

3. User submits booking
   ├─> POST /api/bookings
   ├─> Request includes: userId, packageId, event details
   ├─> Backend validates and creates booking
   ├─> Status: "pending" (awaiting payment)
   └─> Response: Booking object with ID

4. User uploads payment receipt
   ├─> PATCH /api/bookings/:id/upload-receipt
   ├─> Multer handles file upload
   ├─> Receipt URL saved to booking
   └─> WhatsApp notification sent to admin

5. Admin reviews and confirms
   ├─> GET /api/bookings (admin view)
   ├─> PATCH /api/bookings/:id/status
   ├─> Status updated: "pending" → "confirmed"
   └─> WhatsApp confirmation sent to customer
```

### Authentication Flow
```
1. Registration
   User → POST /api/auth/register
   ├─> Validate email uniqueness
   ├─> Hash password (bcrypt, 10 rounds)
   ├─> Create user document
   ├─> Generate verification token
   ├─> Send verification email
   └─> Response: User object (without password)

2. Login
   User → POST /api/auth/login
   ├─> Find user by email
   ├─> Compare password hash
   ├─> Generate JWT access token (15min)
   ├─> Generate refresh token (7 days)
   ├─> Store refresh token in httpOnly cookie
   └─> Response: { accessToken, user }

3. Protected Request
   User → GET /api/bookings/my-bookings
   ├─> Authorization header: "Bearer <token>"
   ├─> authMiddleware verifies JWT
   ├─> Extract userId from token
   ├─> Attach user to req.user
   ├─> Controller accesses req.user.id
   └─> Response: User's bookings

4. Token Refresh
   User → POST /api/auth/refresh
   ├─> Extract refresh token from cookie
   ├─> Verify refresh token
   ├─> Generate new access token
   └─> Response: { accessToken }
```

## Component Structure

### Frontend Component Hierarchy
```
App.js
├── AuthContext.Provider
│   ├── ThemeContext.Provider
│   │   ├── Navbar
│   │   ├── Router
│   │   │   ├── Public Routes
│   │   │   │   ├── Home
│   │   │   │   ├── Packages
│   │   │   │   ├── Gallery
│   │   │   │   ├── Contact
│   │   │   │   ├── Login
│   │   │   │   └── Register
│   │   │   ├── Protected Routes (User)
│   │   │   │   ├── UserDashboard
│   │   │   │   ├── Booking
│   │   │   │   └── MyBookings
│   │   │   └── Protected Routes (Admin)
│   │   │       ├── AdminDashboard
│   │   │       ├── Users
│   │   │       ├── PackageManagement
│   │   │       ├── BookingManagement
│   │   │       └── Settings
│   │   └── Footer
│   └── WhatsAppButton (Floating)
```

### Backend Module Structure
```
index.js (Server Entry)
├── Database Connection (config/db.js)
├── Middleware Setup
│   ├── CORS
│   ├── JSON Parser
│   ├── Error Handler
│   └── Rate Limiter
├── Routes
│   ├── /api/auth → authRoutes
│   │   └── authController
│   ├── /api/packages → packageRoutes
│   │   └── packageController
│   ├── /api/bookings → bookingRoutes
│   │   └── bookingController
│   └── /api/admin → adminRoutes
│       └── adminController
└── Error Handler Middleware
```

## Database Design

### Collections Overview
```
lyan-restaurant (Database)
├── users
│   ├── Indexes: email (unique), role
│   └── Documents: ~100-10,000 users
├── packages
│   ├── Indexes: category, eventTypes, isActive
│   └── Documents: ~20-100 packages
└── bookings
    ├── Indexes: userId, packageId, status, eventDate
    └── Documents: ~100-100,000+ bookings
```

### Entity Relationships
```
User (1) ────── (*) Booking
                      │
                      │ (1)
                      │
                     (*) 
                  Package

Legend:
(1) = One
(*) = Many
```

### User Document Structure
```json
{
  "_id": ObjectId,
  "name": "Abebe Kebede",
  "email": "abebe@example.com",
  "password": "$2a$10$...", // bcrypt hash
  "role": "user", // or "admin"
  "isVerified": false,
  "verificationToken": "...",
  "resetPasswordToken": null,
  "resetPasswordExpires": null,
  "createdAt": ISODate("2025-11-03T..."),
  "updatedAt": ISODate("2025-11-03T...")
}
```

### Package Document Structure
```json
{
  "_id": ObjectId,
  "name": "Premium Wedding Package",
  "description": "Complete wedding catering and decoration",
  "category": "full-package",
  "price": 150000, // Ethiopian Birr
  "discount": 10, // percentage
  "image": "https://...",
  "features": [
    "Traditional Ethiopian cuisine",
    "Full venue decoration",
    "Photography service",
    "DJ and sound system"
  ],
  "eventTypes": ["wedding", "engagement"],
  "maxGuests": 500,
  "isActive": true,
  "createdAt": ISODate("2025-11-03T..."),
  "updatedAt": ISODate("2025-11-03T...")
}
```

### Booking Document Structure
```json
{
  "_id": ObjectId,
  "userId": ObjectId("ref: User"),
  "packageId": ObjectId("ref: Package"),
  "customerName": "Abebe Kebede",
  "customerEmail": "abebe@example.com",
  "customerPhone": "+251911234567",
  "eventType": "wedding",
  "eventDate": ISODate("2026-02-14"),
  "eventTime": "14:00",
  "locationType": "our-venue",
  "locationAddress": "LYAN Events Hall, Addis Ababa",
  "numberOfGuests": 300,
  "specialRequests": "Vegetarian options needed",
  "paymentReceipt": "https://.../receipt.jpg",
  "totalAmount": 135000, // after discount
  "status": "confirmed",
  "whatsappSent": true,
  "createdAt": ISODate("2025-11-03T..."),
  "updatedAt": ISODate("2025-11-03T...")
}
```

## API Architecture

### RESTful API Design

**Resource-Based URLs**
```
/api/packages           → Package collection
/api/packages/:id       → Specific package
/api/bookings           → Booking collection
/api/bookings/:id       → Specific booking
```

**HTTP Methods**
```
GET     → Retrieve resources
POST    → Create new resource
PUT     → Full update of resource
PATCH   → Partial update of resource
DELETE  → Remove resource
```

### API Response Format

**Success Response**
```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": [] // validation errors if any
  }
}
```

### Middleware Pipeline
```
Request
  ↓
[1] CORS Middleware
  ↓
[2] Body Parser (JSON)
  ↓
[3] Rate Limiter (100 req/15min)
  ↓
[4] Route Handler
  ↓
[5] Auth Middleware (if protected)
  ↓
[6] Validation Middleware (if needed)
  ↓
[7] Controller
  ↓
[8] Response / Error Handler
  ↓
Response
```

## Authentication Flow

### JWT Token Structure

**Access Token (15 minutes)**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  role: "user",
  iat: 1699000000,
  exp: 1699000900
}
```

**Refresh Token (7 days)**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  type: "refresh",
  iat: 1699000000,
  exp: 1699604800
}
```

### Token Flow Diagram
```
┌─────────┐                           ┌─────────┐
│  Client │                           │ Server  │
└────┬────┘                           └────┬────┘
     │                                     │
     │ 1. POST /api/auth/login            │
     │ { email, password }                │
     ├────────────────────────────────────>
     │                                     │
     │                    2. Validate user │
     │                    3. Generate JWT  │
     │                                     │
     │ 4. { accessToken, user }           │
     │ Set-Cookie: refreshToken            │
     <────────────────────────────────────┤
     │                                     │
5. Store accessToken in localStorage      │
     │                                     │
     │ 6. GET /api/bookings/my-bookings   │
     │ Authorization: Bearer <token>       │
     ├────────────────────────────────────>
     │                                     │
     │                    7. Verify JWT    │
     │                    8. Process req   │
     │                                     │
     │ 9. { bookings: [...] }             │
     <────────────────────────────────────┤
     │                                     │
```

## Security Considerations

### 1. Authentication Security
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Secrets**: Strong, environment-specific secrets (32+ chars)
- **Token Expiration**: Short-lived access tokens (15min)
- **Refresh Tokens**: HttpOnly cookies, long-lived but revocable

### 2. Input Validation
- **express-validator**: Server-side validation for all inputs
- **Mongoose Schemas**: Type validation at database level
- **XSS Prevention**: Sanitize user inputs
- **SQL Injection**: Not applicable (NoSQL), but NoSQL injection prevention via Mongoose

### 3. API Security
- **CORS**: Configured for specific origins
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers (CSP, XSS Protection, etc.)
- **HTTPS**: Required in production

### 4. File Upload Security
- **File Type Validation**: Only images allowed for receipts
- **File Size Limit**: Max 5MB per upload
- **Unique Filenames**: Prevent overwrites
- **Storage**: Separate from code (uploads/ directory)

### 5. Role-Based Access Control (RBAC)
```javascript
// User roles
const roles = ['user', 'admin'];

// Middleware checks
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

## Scalability & Performance

### Current Architecture Limitations
- **Single Server**: No load balancing
- **File Storage**: Local filesystem (not distributed)
- **Database**: Single MongoDB instance

### Scaling Strategies

**Horizontal Scaling (Future)**
```
┌──────────┐
│   Load   │
│ Balancer │
└─────┬────┘
      │
      ├─────────┬─────────┬─────────┐
      ▼         ▼         ▼         ▼
  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
  │ App  │  │ App  │  │ App  │  │ App  │
  │Server│  │Server│  │Server│  │Server│
  └───┬──┘  └───┬──┘  └───┬──┘  └───┬──┘
      │         │         │         │
      └─────────┴─────────┴─────────┘
                   │
                   ▼
           ┌──────────────┐
           │   MongoDB    │
           │   Replica    │
           │     Set      │
           └──────────────┘
```

### Performance Optimizations

**1. Database Indexing**
```javascript
// User indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Package indexes
packageSchema.index({ category: 1, isActive: 1 });
packageSchema.index({ eventTypes: 1 });

// Booking indexes
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ eventDate: 1 });
bookingSchema.index({ createdAt: -1 });
```

**2. Caching Strategy (Future)**
```
Redis Cache
├─ Package list (TTL: 15min)
├─ Featured packages (TTL: 1 hour)
├─ User sessions
└─ Rate limiting counters
```

**3. Frontend Optimizations**
- **Code Splitting**: Lazy load routes
- **Image Optimization**: Compressed, lazy-loaded images
- **Bundle Size**: Minimize dependencies
- **Memoization**: React.memo for expensive components

**4. API Optimizations**
- **Pagination**: Limit results (default 20 per page)
- **Field Selection**: Only return needed fields
- **Query Optimization**: Populate only when necessary
- **Response Compression**: Gzip enabled

### Monitoring & Logging (Future)
```
Application Monitoring
├─ Request/Response times
├─ Error rates
├─ Database query performance
└─ Memory/CPU usage

Business Metrics
├─ Daily bookings count
├─ Revenue tracking
├─ Popular packages
└─ User registration trends
```

## Deployment Architecture

### Development Environment
```
localhost:3000 (React Dev Server)
       ↓
localhost:5001 (Express Server)
       ↓
localhost:27017 (MongoDB)
```

### Production Environment (Recommended)
```
┌─────────────────────────────────────────┐
│         CDN (CloudFlare/AWS)            │
│         Static Assets Cache              │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│      Frontend (Vercel/Netlify)          │
│      React Build (Static Files)         │
└──────────────┬──────────────────────────┘
               ↓ HTTPS/REST API
┌─────────────────────────────────────────┐
│      Backend (Railway/Heroku/AWS)       │
│      Node.js + Express                  │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│      Database (MongoDB Atlas)           │
│      Managed MongoDB Cluster            │
└─────────────────────────────────────────┘
```

---

**Document Version**: 1.0  
**Last Updated**: November 3, 2025  
**Maintained By**: LYAN Development Team
