# 🚀 LYAN Catering & Events - Quick Start Guide

## ⚡ Fast Setup (5 Minutes)

### 1️⃣ Prerequisites Check
```bash
node --version   # Should be v14+
npm --version    # Should be 6+
mongod --version # MongoDB should be installed
```

### 2️⃣ Quick Install

```bash
# Clone and navigate
cd lyan-restaurant

# Backend setup
cd backend
npm install
cp ../.env.example .env
# IMPORTANT: Edit .env with your MongoDB URI and WhatsApp number!

# Frontend setup (in new terminal)
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start MongoDB (if local)
mongod
```

### 3️⃣ Run the App

**Option A: Run Separately**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

**Option B: Run Together (Recommended)**
```bash
# From root lyan-restaurant directory
npm install
npm run dev
```

### 4️⃣ Access the App
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

---

## 🎯 What You Built

### ✅ Backend Features
- ✅ **Package Model** - Event packages with pricing, categories, discounts
- ✅ **Booking Model** - Complete booking system with event details
- ✅ **Package Controller** - CRUD operations for packages
- ✅ **Booking Controller** - Booking creation with WhatsApp integration
- ✅ **WhatsApp Integration** - Auto-generated messages with booking details
- ✅ **Authentication** - Secure JWT-based auth system
- ✅ **Admin Controls** - Package and booking management

### ✅ Frontend Features
- ✅ **Packages Page** - Browse and filter event packages
- ✅ **Booking Page** - 3-step booking form (Event → Package → Payment)
- ✅ **Gallery Page** - Image carousel with event photos
- ✅ **Contact Page** - Contact info with WhatsApp integration
- ✅ **WhatsApp Button** - Floating instant chat button
- ✅ **Responsive Design** - Mobile-friendly Ethiopian UI
- ✅ **Smooth Animations** - Framer Motion effects
- ✅ **User Dashboard** - View personal bookings
- ✅ **Admin Dashboard** - Manage all bookings and packages

---

## 🧪 Quick Test Flow

### User Journey
1. **Register**: http://localhost:3000/register
   ```
   Name: Abebe Kebede
   Email: abebe@test.com
   Password: Test@123
   ```

2. **Login** with credentials

3. **Browse Packages**: http://localhost:3000/packages

4. **Book Event**: 
   - Click "Book Now" on any package
   - Fill 3-step form
   - See WhatsApp redirect with booking details!

5. **View Bookings**: http://localhost:3000/user/dashboard

### Admin Journey
1. **Make user admin**:
   ```bash
   mongo
   use lyan-catering-events
   db.users.updateOne({email:"abebe@test.com"}, {$set:{role:"admin"}})
   ```

2. **Login** and go to: http://localhost:3000/admin/dashboard

3. **Manage**:
   - Add/Edit packages
   - View all bookings
   - Update booking status

---

## 📱 WhatsApp Setup

1. **Update `.env` in backend**:
   ```env
   WHATSAPP_NUMBER=251912345678  # Your Ethiopian WhatsApp number
   ```

2. **Test**: Create a booking → Should redirect to WhatsApp with prefilled message

---

## 💰 TeleBirr Setup

1. **Update `.env` in backend**:
   ```env
   TELEBIRR_ACCOUNT_NUMBER=0912345678
   TELEBIRR_ACCOUNT_NAME=LYAN Catering & Events
   ```

2. **Display**: Shows on booking payment step

---

## 🎨 Customization Tips

### Change Theme Colors
**File**: `frontend/src/pages/Packages.js` (and other pages)
```javascript
const categoryColors = {
  catering: '#FF6B6B',      // Change to your color
  decoration: '#4ECDC4',
  'full-package': '#FFD93D',
  // ...
};
```

### Update Business Info
**File**: `frontend/src/pages/Contact.js`
```javascript
const contactInfo = {
  phone: '+251 91 234 5678',
  email: 'info@lyancatering.com',
  // ... update your details
};
```

### Add Ethiopian Fonts
**File**: `frontend/src/styles/global.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic&display=swap');

body {
  font-family: 'Noto Sans Ethiopic', sans-serif;
}
```

---

## 🐛 Common Issues & Fixes

### Issue: MongoDB Connection Failed
**Solution**:
```bash
# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac

# Or check if already running
ps aux | grep mongod
```

### Issue: Port 5000 Already in Use
**Solution**:
```bash
# Kill process
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env
PORT=5001
```

### Issue: Cannot Find Module 'express-async-handler'
**Solution**:
```bash
cd backend
npm install express-async-handler
```

### Issue: React Scripts Not Found
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Adding Sample Data

### Create Sample Packages (Manual via API)

**Using Postman/Thunder Client**:
```http
POST http://localhost:5000/api/packages
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Premium Wedding Package",
  "price": 150000,
  "description": "Complete wedding service with catering, decoration, and venue",
  "category": "full-package",
  "discount": 10,
  "features": [
    "Food for 200 guests",
    "Full venue decoration",
    "Professional photography",
    "Wedding cake",
    "DJ and sound system"
  ],
  "eventTypes": ["wedding"],
  "maxGuests": 200
}
```

### Or Create via MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Database: `lyan-catering-events`
4. Collection: `packages`
5. Click "Add Data" → Insert Document

---

## 🌐 Next Steps

### For Learning
- [ ] Add more package validation
- [ ] Implement file upload for receipts
- [ ] Create email notifications
- [ ] Add booking calendar view
- [ ] Build admin analytics dashboard

### For Production
- [ ] Set up SSL certificates
- [ ] Configure production MongoDB Atlas
- [ ] Set up CI/CD pipeline
- [ ] Add error logging (Sentry)
- [ ] Implement rate limiting
- [ ] Add payment gateway integration

---

## 📚 Key Files to Study

### Backend
1. `backend/models/Booking.js` - Booking schema with validation
2. `backend/controllers/bookingController.js` - WhatsApp message generation
3. `backend/routes/packageRoutes.js` - API endpoints structure

### Frontend
4. `frontend/src/pages/Booking.js` - Multi-step form with stepper
5. `frontend/src/pages/Packages.js` - Package filtering and display
6. `frontend/src/services/api.js` - API service layer
7. `frontend/src/App.js` - Routing structure

---

## 🎓 Learning Path

### Beginner Level ✅ (You're Here!)
- ✅ Understand MERN structure
- ✅ Basic CRUD operations
- ✅ JWT authentication
- ✅ Frontend-backend connection

### Intermediate Level 🎯 (Next Steps)
- [ ] File uploads with Multer/Cloudinary
- [ ] Real-time updates with Socket.io
- [ ] Advanced MongoDB queries
- [ ] Payment gateway integration

### Advanced Level 🚀 (Future)
- [ ] Microservices architecture
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Testing (Jest, Cypress)
- [ ] Performance optimization

---

## 💡 Pro Tips

1. **Always use environment variables** - Never hardcode sensitive data
2. **Validate user input** - Both frontend and backend
3. **Handle errors gracefully** - Show user-friendly messages
4. **Mobile-first design** - Most Ethiopian users are on mobile
5. **Test on real devices** - Especially for WhatsApp redirect
6. **Keep code organized** - Separate concerns, DRY principle
7. **Use Git properly** - Commit often with clear messages
8. **Document as you go** - Future you will thank present you!

---

## 🤝 Need Help?

### Resources
- **Full README**: See `README.md` for comprehensive documentation
- **MongoDB Docs**: https://docs.mongodb.com/
- **React Docs**: https://react.dev/
- **Express Docs**: https://expressjs.com/
- **MUI Components**: https://mui.com/

### Community
- Stack Overflow: Tag questions with `mern-stack`
- GitHub Issues: Create issues in the repo
- Ethiopian Dev Community: Join local tech groups

---

## ✨ You Did It! 🎉

You've successfully built a complete MERN stack event booking application with:
- 📦 Package management system
- 📅 Event booking flow
- 💬 WhatsApp integration
- 💳 TeleBirr payment instructions
- 🎨 Beautiful responsive UI
- 🔐 Secure authentication
- 👨‍💼 Admin dashboard

**Keep learning, keep building! 🚀**

---

**Made with ❤️ for Ethiopian Developers** 🇪🇹
