# LYAN Catering & Events - Admin & User Guide

## 📋 Table of Contents
1. [How to Register as Admin](#how-to-register-as-admin)
2. [How to Create Packages](#how-to-create-packages)
3. [User Dashboard Overview](#user-dashboard-overview)

---

## 🔐 How to Register as Admin

### Method 1: Using the Admin Creation Script (Recommended)

1. **Open Terminal** and navigate to the backend directory:
   ```bash
   cd /home/mame/lyan-restaurant/backend
   ```

2. **Run the Admin Creation Script**:
   ```bash
   node scripts/createAdmin.js
   ```

3. **Default Admin Credentials** (if not set in .env):
   - Email: `admin@lyan.com`
   - Password: `Admin@123456`

4. **Custom Admin Credentials**: Add to your `.env` file:
   ```env
   ADMIN_EMAIL=youradmin@email.com
   ADMIN_PASSWORD=YourSecurePassword123!
   ```

5. **Login**: Go to `http://localhost:3000/login` and use the admin credentials

### Method 2: Manually via MongoDB

1. **Register a normal user** first through the registration page

2. **Connect to MongoDB**:
   ```bash
   mongosh "your_mongodb_connection_string"
   ```

3. **Update the user role to admin**:
   ```javascript
   use lyan-restaurant
   db.users.updateOne(
     { email: "youremail@example.com" },
     { $set: { role: "admin", isVerified: true } }
   )
   ```

4. **Verify the change**:
   ```javascript
   db.users.findOne({ email: "youremail@example.com" })
   ```

---

## 📦 How to Create Packages

### Step 1: Access Admin Dashboard

1. **Login** with admin credentials
2. Navigate to **Admin Dashboard** (you'll be automatically redirected after login)
3. Click on **"Menu"** or **"Package Management"** in the admin sidebar

### Step 2: Create a New Package

1. **Click** the **"Create Package"** button (top right)

2. **Fill in Package Details**:

   **Basic Information:**
   - **Package Name**: e.g., "Premium Wedding Package"
   - **Category**: Choose from:
     - Catering
     - Decoration
     - Full Package (includes multiple services)
     - Venue
     - Photography
   - **Max Guests**: Maximum number of guests (e.g., 500)
   - **Price**: Price in Birr (e.g., 150000)
   - **Discount**: Optional discount percentage (e.g., 10 for 10% off)

   **Media:**
   - **Image URL**: Link to package image (e.g., `https://yoursite.com/images/wedding.jpg`)
     - Tip: Use free image hosting like Imgur, Cloudinary, or your own server

   **Description:**
   - **Description**: Detailed description of what's included (max 1000 characters)

   **Event Types:**
   - Select applicable event types by clicking chips:
     - Wedding
     - Birthday
     - Engagement
     - Meeting
     - Bridal Shower

   **Features:**
   - Add multiple features (what's included in the package)
   - Click **"Add Feature"** for more items
   - Examples:
     - "Traditional Ethiopian cuisine for 500 guests"
     - "Full venue decoration with flowers"
     - "Professional photography (8 hours)"
     - "DJ and sound system"

   **Status:**
   - Toggle **"Active"** switch to make package visible to customers

3. **Save Package**: Click **"Create"** button

### Step 3: Manage Existing Packages

**Edit Package:**
- Click **"Edit"** button on any package card
- Update fields as needed
- Click **"Update"**

**Activate/Deactivate:**
- Click **"Activate"** or **"Deactivate"** button
- Inactive packages won't show to customers

**Delete Package:**
- Click the **trash icon** (🗑️)
- Confirm deletion

### Example Package

```
Name: Premium Wedding Package
Category: full-package
Max Guests: 500
Price: 150000 ብር
Discount: 10%
Image: https://example.com/wedding.jpg

Description:
Complete wedding catering and decoration service with traditional Ethiopian cuisine,
full venue setup, professional photography, and entertainment.

Event Types: wedding, engagement

Features:
✓ Traditional Ethiopian cuisine for 500 guests
✓ Full venue decoration with flowers and lighting
✓ Professional photography service (8 hours)
✓ DJ and sound system
✓ Wedding cake (3-tier)
✓ Table settings and linens

Status: Active
```

---

## 👤 User Dashboard Overview

The new User Dashboard provides a modern, comprehensive overview of user activities.

### Features

#### 1. **Welcome Banner**
- Personalized greeting with user's name
- Quick logout button
- Ethiopian-themed gradient design

#### 2. **Profile Information Card**
- **Name**: Display name
- **Email**: Email address
- **Member Since**: Registration date
- **Edit Profile**: Button to update profile (coming soon)

#### 3. **Statistics Cards**
- **Total Bookings**: Total number of bookings made
- **Completed**: Successfully completed events
- **Pending**: Bookings awaiting confirmation
- **Cancelled**: Cancelled bookings

#### 4. **Quick Actions**
Four convenient buttons to navigate:
- **Browse Packages**: View all available event packages
- **My Bookings**: View all your bookings and their status
- **View Gallery**: Explore event gallery for inspiration
- **Contact Us**: Get in touch with the LYAN team

#### 5. **Recent Bookings Section**
- Shows latest bookings
- View booking details
- Track booking status
- Empty state with call-to-action if no bookings

### Dashboard Navigation

**Access Dashboard:**
1. Login to your account
2. Click **"Dashboard"** in navigation menu
3. Or: Automatically redirected after login (for regular users)

**Dashboard Routes:**
- User Dashboard: `/user/dashboard`
- Admin Dashboard: `/admin/dashboard`

---

## 🎨 Design Highlights

### Ethiopian Color Scheme
- **Gold (#D4AF37)**: Primary accent, represents Ethiopian heritage
- **Green (#078930)**: Ethiopian flag color, main actions
- **Red (#DA121A)**: Alerts and cancellations
- **Yellow (#FCDD09)**: Warning and pending states

### Responsive Design
- **Desktop**: Full layout with cards and statistics
- **Tablet**: Adjusted grid layout
- **Mobile**: Stacked layout for easy navigation

### Animations
- Smooth entrance animations using Framer Motion
- Hover effects on cards and buttons
- Gradient transitions

---

## 🔧 Troubleshooting

### Admin Creation Issues

**Problem**: Script says "Admin already exists"
- **Solution**: Either use existing admin or manually delete from MongoDB and rerun

**Problem**: Cannot connect to MongoDB
- **Solution**: Check `MONGODB_URI` in `.env` file

### Package Creation Issues

**Problem**: "Not authorized" error
- **Solution**: Make sure you're logged in as admin (check role in database)

**Problem**: Image not displaying
- **Solution**: Use absolute URLs (https://...) for images

### Dashboard Issues

**Problem**: Dashboard shows "Please log in"
- **Solution**: Clear browser cache and login again

**Problem**: Stats showing 0
- **Solution**: Normal if no bookings yet; stats will update after bookings are made

---

## 📞 Support

For issues or questions:
- **Email**: admin@lyan.com
- **Phone**: +251 912 345 678
- **GitHub Issues**: Report bugs in the repository

---

## 🚀 Next Steps

1. ✅ Create admin account
2. ✅ Create your first package
3. ✅ Test user dashboard
4. Add actual images for packages
5. Create more packages for different event types
6. Test WhatsApp booking flow
7. Monitor bookings through admin dashboard

---

**Happy Event Planning! 🎉**
