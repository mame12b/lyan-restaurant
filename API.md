# LYAN Catering & Events - API Documentation

## Table of Contents
1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Auth Endpoints](#auth-endpoints)
6. [Package Endpoints](#package-endpoints)
7. [Booking Endpoints](#booking-endpoints)
8. [Admin Endpoints](#admin-endpoints)
9. [Response Codes](#response-codes)
10. [Example Workflows](#example-workflows)

## Base URL

**Development**: `http://localhost:5001/api`  
**Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens).

### Including Token in Requests

```http
GET /api/bookings/my-bookings HTTP/1.1
Host: localhost:5001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Token Lifecycle

- **Access Token**: 15 minutes expiration (sent in response body)
- **Refresh Token**: 7 days expiration (sent in httpOnly cookie)

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## Auth Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Authentication**: None

**Request Body**:
```json
{
  "name": "Abebe Kebede",
  "email": "abebe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Abebe Kebede",
      "email": "abebe@example.com",
      "role": "user",
      "isVerified": false,
      "createdAt": "2025-11-03T10:30:00.000Z"
    }
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Error Responses**:
- `400`: Validation error (e.g., weak password, invalid email)
- `409`: Email already registered

---

### Login

Authenticate user and receive tokens.

**Endpoint**: `POST /api/auth/login`

**Authentication**: None

**Request Body**:
```json
{
  "email": "abebe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Abebe Kebede",
      "email": "abebe@example.com",
      "role": "user",
      "isVerified": true
    }
  },
  "message": "Login successful"
}
```

**Set-Cookie Header**:
```
refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Error Responses**:
- `401`: Invalid email or password
- `403`: Account not verified

---

### Logout

Invalidate refresh token and logout user.

**Endpoint**: `POST /api/auth/logout`

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint**: `POST /api/auth/refresh`

**Authentication**: Refresh token in cookie

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- `401`: Invalid or expired refresh token

---

### Forgot Password

Request password reset email.

**Endpoint**: `POST /api/auth/forgot-password`

**Authentication**: None

**Request Body**:
```json
{
  "email": "abebe@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password

Reset password using token from email.

**Endpoint**: `POST /api/auth/reset-password/:token`

**Authentication**: None

**URL Parameters**:
- `token`: Reset token from email

**Request Body**:
```json
{
  "password": "NewSecurePass123!"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Responses**:
- `400`: Invalid or expired token
- `400`: Weak password

---

### Verify Email

Verify email address using token.

**Endpoint**: `GET /api/auth/verify-email/:token`

**Authentication**: None

**URL Parameters**:
- `token`: Verification token from email

**Success Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## Package Endpoints

### Get All Packages

Retrieve all packages with optional filtering.

**Endpoint**: `GET /api/packages`

**Authentication**: None

**Query Parameters**:
- `category` (optional): Filter by category (catering, decoration, full-package, venue, photography)
- `eventType` (optional): Filter by event type (wedding, birthday, engagement, meeting, bridal-shower)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `isActive` (optional): Filter active/inactive packages (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example Request**:
```http
GET /api/packages?category=full-package&eventType=wedding&page=1&limit=10
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Premium Wedding Package",
        "description": "Complete wedding catering and decoration",
        "category": "full-package",
        "price": 150000,
        "discount": 10,
        "finalPrice": 135000,
        "image": "https://example.com/images/wedding-package.jpg",
        "features": [
          "Traditional Ethiopian cuisine for 500 guests",
          "Full venue decoration",
          "Photography service (8 hours)",
          "DJ and sound system"
        ],
        "eventTypes": ["wedding", "engagement"],
        "maxGuests": 500,
        "isActive": true,
        "createdAt": "2025-10-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalPackages": 25,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Featured Packages

Retrieve featured packages for homepage.

**Endpoint**: `GET /api/packages/featured`

**Authentication**: None

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "packages": [
      // Array of 4-6 featured packages
    ]
  }
}
```

---

### Get Package by ID

Retrieve detailed information about a specific package.

**Endpoint**: `GET /api/packages/:id`

**Authentication**: None

**URL Parameters**:
- `id`: Package ID

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "package": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Premium Wedding Package",
      "description": "Complete wedding catering and decoration with traditional Ethiopian cuisine",
      "category": "full-package",
      "price": 150000,
      "discount": 10,
      "finalPrice": 135000,
      "image": "https://example.com/images/wedding-package.jpg",
      "features": [
        "Traditional Ethiopian cuisine for 500 guests",
        "Full venue decoration with Ethiopian colors",
        "Professional photography service (8 hours)",
        "DJ and premium sound system",
        "Bridal room decoration",
        "Welcome drinks and appetizers"
      ],
      "eventTypes": ["wedding", "engagement"],
      "maxGuests": 500,
      "isActive": true,
      "createdAt": "2025-10-01T00:00:00.000Z",
      "updatedAt": "2025-10-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses**:
- `404`: Package not found

---

### Create Package (Admin)

Create a new event package.

**Endpoint**: `POST /api/packages`

**Authentication**: Required (Admin only)

**Request Body**:
```json
{
  "name": "Birthday Celebration Package",
  "description": "Fun birthday party setup with catering",
  "category": "full-package",
  "price": 50000,
  "discount": 5,
  "image": "https://example.com/images/birthday.jpg",
  "features": [
    "Catering for 100 guests",
    "Birthday cake",
    "Balloon decorations",
    "Entertainment"
  ],
  "eventTypes": ["birthday"],
  "maxGuests": 100,
  "isActive": true
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "package": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Birthday Celebration Package",
      // ... rest of package data
    }
  },
  "message": "Package created successfully"
}
```

**Error Responses**:
- `400`: Validation error
- `403`: Not authorized (non-admin user)

---

### Update Package (Admin)

Update an existing package.

**Endpoint**: `PUT /api/packages/:id`

**Authentication**: Required (Admin only)

**URL Parameters**:
- `id`: Package ID

**Request Body**: (All fields optional)
```json
{
  "name": "Updated Package Name",
  "price": 160000,
  "discount": 15,
  "isActive": false
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "package": {
      // Updated package data
    }
  },
  "message": "Package updated successfully"
}
```

---

### Delete Package (Admin)

Delete a package (soft delete - sets isActive to false).

**Endpoint**: `DELETE /api/packages/:id`

**Authentication**: Required (Admin only)

**URL Parameters**:
- `id`: Package ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "Package deleted successfully"
}
```

---

## Booking Endpoints

### Create Booking

Create a new event booking.

**Endpoint**: `POST /api/bookings`

**Authentication**: Required

**Request Body**:
```json
{
  "packageId": "507f1f77bcf86cd799439011",
  "customerName": "Abebe Kebede",
  "customerEmail": "abebe@example.com",
  "customerPhone": "+251911234567",
  "eventType": "wedding",
  "eventDate": "2026-02-14",
  "eventTime": "14:00",
  "locationType": "our-venue",
  "locationAddress": "LYAN Events Hall, Addis Ababa",
  "numberOfGuests": 300,
  "specialRequests": "Need vegetarian options for 50 guests"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "packageId": "507f1f77bcf86cd799439011",
      "customerName": "Abebe Kebede",
      "customerEmail": "abebe@example.com",
      "customerPhone": "+251911234567",
      "eventType": "wedding",
      "eventDate": "2026-02-14T00:00:00.000Z",
      "eventTime": "14:00",
      "locationType": "our-venue",
      "locationAddress": "LYAN Events Hall, Addis Ababa",
      "numberOfGuests": 300,
      "specialRequests": "Need vegetarian options for 50 guests",
      "totalAmount": 135000,
      "status": "pending",
      "whatsappSent": false,
      "createdAt": "2025-11-03T10:30:00.000Z"
    }
  },
  "message": "Booking created successfully. Please upload payment receipt."
}
```

**Error Responses**:
- `400`: Validation error
- `404`: Package not found

---

### Get My Bookings

Retrieve all bookings for authenticated user.

**Endpoint**: `GET /api/bookings/my-bookings`

**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by status (pending, confirmed, cancelled, completed)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "packageId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Premium Wedding Package",
          "image": "https://..."
        },
        "eventType": "wedding",
        "eventDate": "2026-02-14T00:00:00.000Z",
        "numberOfGuests": 300,
        "totalAmount": 135000,
        "status": "confirmed",
        "createdAt": "2025-11-03T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalBookings": 15
    }
  }
}
```

---

### Get Booking by ID

Retrieve detailed information about a specific booking.

**Endpoint**: `GET /api/bookings/:id`

**Authentication**: Required (Owner or Admin)

**URL Parameters**:
- `id`: Booking ID

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439020",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Abebe Kebede",
        "email": "abebe@example.com"
      },
      "packageId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Premium Wedding Package",
        "category": "full-package",
        "image": "https://..."
      },
      "customerName": "Abebe Kebede",
      "customerPhone": "+251911234567",
      "eventType": "wedding",
      "eventDate": "2026-02-14T00:00:00.000Z",
      "eventTime": "14:00",
      "locationType": "our-venue",
      "locationAddress": "LYAN Events Hall, Addis Ababa",
      "numberOfGuests": 300,
      "specialRequests": "Need vegetarian options",
      "paymentReceipt": "https://example.com/receipts/receipt123.jpg",
      "totalAmount": 135000,
      "status": "confirmed",
      "whatsappSent": true,
      "createdAt": "2025-11-03T10:30:00.000Z",
      "updatedAt": "2025-11-03T14:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `403`: Not authorized to view this booking
- `404`: Booking not found

---

### Upload Payment Receipt

Upload payment receipt image for a booking.

**Endpoint**: `PATCH /api/bookings/:id/upload-receipt`

**Authentication**: Required (Owner only)

**URL Parameters**:
- `id`: Booking ID

**Request**: Multipart form data
```
Content-Type: multipart/form-data

receipt: [File] (image file)
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439020",
      "paymentReceipt": "https://example.com/receipts/receipt_1699000000.jpg",
      "status": "pending",
      "updatedAt": "2025-11-03T14:00:00.000Z"
    }
  },
  "message": "Payment receipt uploaded successfully"
}
```

**Error Responses**:
- `400`: No file uploaded or invalid file type
- `403`: Not authorized
- `404`: Booking not found

---

### Cancel Booking

Cancel a booking (customer can only cancel pending bookings).

**Endpoint**: `PATCH /api/bookings/:id/cancel`

**Authentication**: Required (Owner only)

**URL Parameters**:
- `id`: Booking ID

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439020",
      "status": "cancelled",
      "updatedAt": "2025-11-03T15:00:00.000Z"
    }
  },
  "message": "Booking cancelled successfully"
}
```

**Error Responses**:
- `400`: Cannot cancel confirmed bookings
- `403`: Not authorized
- `404`: Booking not found

---

### Get All Bookings (Admin)

Retrieve all bookings with filters (admin only).

**Endpoint**: `GET /api/bookings`

**Authentication**: Required (Admin only)

**Query Parameters**:
- `status` (optional): Filter by status
- `eventType` (optional): Filter by event type
- `startDate` (optional): Filter bookings from this date
- `endDate` (optional): Filter bookings until this date
- `page` (optional): Page number
- `limit` (optional): Results per page

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "bookings": [
      // Array of all bookings with populated user and package data
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalBookings": 250
    }
  }
}
```

---

### Get Booking Statistics (Admin)

Get statistics about bookings.

**Endpoint**: `GET /api/bookings/stats`

**Authentication**: Required (Admin only)

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalBookings": 250,
      "pendingBookings": 15,
      "confirmedBookings": 180,
      "completedBookings": 45,
      "cancelledBookings": 10,
      "totalRevenue": 33750000,
      "averageBookingValue": 135000,
      "popularEventType": "wedding",
      "bookingsByMonth": [
        { "month": "2025-10", "count": 25 },
        { "month": "2025-11", "count": 30 }
      ]
    }
  }
}
```

---

### Update Booking Status (Admin)

Update the status of a booking.

**Endpoint**: `PATCH /api/bookings/:id/status`

**Authentication**: Required (Admin only)

**URL Parameters**:
- `id`: Booking ID

**Request Body**:
```json
{
  "status": "confirmed"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439020",
      "status": "confirmed",
      "updatedAt": "2025-11-03T16:00:00.000Z"
    }
  },
  "message": "Booking status updated successfully"
}
```

---

## Admin Endpoints

### Get All Users

Retrieve all registered users.

**Endpoint**: `GET /api/admin/users`

**Authentication**: Required (Admin only)

**Query Parameters**:
- `role` (optional): Filter by role (user, admin)
- `isVerified` (optional): Filter by verification status
- `page` (optional): Page number
- `limit` (optional): Results per page

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Abebe Kebede",
        "email": "abebe@example.com",
        "role": "user",
        "isVerified": true,
        "createdAt": "2025-10-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 100
    }
  }
}
```

---

### Delete User

Delete a user account (admin only).

**Endpoint**: `DELETE /api/admin/users/:id`

**Authentication**: Required (Admin only)

**URL Parameters**:
- `id`: User ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses**:
- `403`: Cannot delete admin users
- `404`: User not found

---

## Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Authentication required or token invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Example Workflows

### Complete Booking Flow

**1. Browse packages**
```http
GET /api/packages?category=full-package&eventType=wedding
```

**2. Register account**
```http
POST /api/auth/register
{
  "name": "Abebe Kebede",
  "email": "abebe@example.com",
  "password": "SecurePass123!"
}
```

**3. Login**
```http
POST /api/auth/login
{
  "email": "abebe@example.com",
  "password": "SecurePass123!"
}
```

**4. Create booking**
```http
POST /api/bookings
Authorization: Bearer <token>
{
  "packageId": "507f1f77bcf86cd799439011",
  "eventType": "wedding",
  "eventDate": "2026-02-14",
  // ... other fields
}
```

**5. Upload payment receipt**
```http
PATCH /api/bookings/507f1f77bcf86cd799439020/upload-receipt
Authorization: Bearer <token>
Content-Type: multipart/form-data

receipt: [image file]
```

**6. Check booking status**
```http
GET /api/bookings/my-bookings
Authorization: Bearer <token>
```

---

**API Version**: 1.0  
**Last Updated**: November 3, 2025  
**Base URL**: http://localhost:5001/api
