<<<<<<< HEAD
![CI/CD Status](https://github.com/mame12b/lyan-restaurant/workflows/CI/CD%20Pipeline/badge.svg)
=======
# 🎉 LYAN Catering & Events Booking Web App

A modern, responsive web application for **LYAN Catering & Events** built with the MERN Stack (MongoDB, Express.js, React.js, Node.js). This app allows users to browse event packages, book events online, and automatically connect with admins via WhatsApp with prefilled booking details.

![Ethiopian Flag](https://img.shields.io/badge/Made%20in-Ethiopia-green?style=for-the-badge&logo=ethiopia)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 🌟 Features

### 👤 User Features
- **Authentication System**: Secure registration, login, and logout with JWT tokens
- **Browse Packages**: View all available event packages with filtering by category and event type
- **Booking System**: 
  - Multi-step booking form (Event Details → Package Selection → Payment)
  - TeleBirr payment instructions with optional receipt upload
  - Automatic WhatsApp redirect with prefilled booking details
- **Gallery**: Beautiful image carousel showcasing previous events
- **Contact**: Multiple contact options including instant WhatsApp chat
- **User Dashboard**: View and manage personal bookings

### 🔐 Admin Features
- **Admin Dashboard**: Overview of all bookings and statistics
- **Package Management**: Create, edit, delete, and toggle package availability
- **Booking Management**: View all bookings, update status (pending/confirmed/cancelled/completed)
- **User Management**: View registered users

### 🎨 Design Features
- Modern, clean UI with Material-UI components
- Smooth animations with Framer Motion
- Fully responsive (mobile-friendly for Ethiopian users)
- Ethiopian Amharic/English bilingual support
- Dark mode ready (optional toggle)
- Floating WhatsApp button for instant chat

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server and API
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **dotenv** - Environment variables

### Frontend
- **React.js** - UI Framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Slick** - Image carousel
- **React Toastify** - Notifications

---

## 📁 Project Structure

```
lyan-restaurant/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── packageController.js  # NEW: Package CRUD
│   │   ├── bookingController.js  # NEW: Booking + WhatsApp
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── Package.js            # NEW: Package model
│   │   ├── Booking.js            # NEW: Booking model
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── packageRoutes.js      # NEW: Package routes
│   │   ├── bookingRoutes.js      # NEW: Booking routes
│   │   └── ...
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── index.js                  # Main server file
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── WhatsAppButton.js  # NEW: Floating chat button
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Packages.js        # NEW: Browse packages
│   │   │   ├── Booking.js         # NEW: Multi-step booking form
│   │   │   ├── Gallery.js         # NEW: Event photos carousel
│   │   │   ├── Contact.js         # NEW: Contact info & social
│   │   │   └── admin/
│   │   │       └── AdminDashboard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js             # UPDATED: Package & Booking APIs
│   │   ├── App.js                 # UPDATED: New routes
│   │   └── index.js
│   ├── package.json
│   └── .env                       # Frontend env variables
│
├── package.json                   # Root package for concurrently
├── .env.example                   # NEW: Example environment file
└── README.md                      # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Step 1: Clone the Repository
```bash
git clone https://github.com/mame12b/lyan-restaurant.git
cd lyan-restaurant/lyan-restaurant
```

### Step 2: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp ../.env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/lyan-catering-events
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=30d
   
   # WhatsApp (Ethiopian format: 251 + 9XXXXXXXX)
   WHATSAPP_NUMBER=251912345678
   
   # TeleBirr
   TELEBIRR_ACCOUNT_NUMBER=0912345678
   TELEBIRR_ACCOUNT_NAME=LYAN Catering & Events
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB** (if local):
   ```bash
   mongod
   ```

6. **Run backend server**:
   ```bash
   npm run dev
   ```
   Backend should be running at `http://localhost:5000`

### Step 3: Frontend Setup

1. **Open new terminal and navigate to frontend**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** in frontend:
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

4. **Start React development server**:
   ```bash
   npm start
   ```
   Frontend should open at `http://localhost:3000`

### Step 4: Run Both Concurrently (Optional)

From the root `lyan-restaurant` directory:

1. **Install concurrently** (if not already):
   ```bash
   npm install
   ```

2. **Start both servers**:
   ```bash
   npm run dev
   ```

---

## 🔑 Creating Admin User

To access admin features, you need to create an admin user in MongoDB:

### Method 1: MongoDB Compass (GUI)
1. Open MongoDB Compass and connect
2. Navigate to `lyan-catering-events` database → `users` collection
3. Find your user document
4. Edit the document and set `role: "admin"`

### Method 2: MongoDB Shell (CLI)
```bash
mongo
use lyan-catering-events
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Register via API
```bash
# Register normally, then update via API or database
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@lyancatering.com",
    "password": "Admin@123"
  }'
```

---

## 📱 WhatsApp Integration

### How It Works
1. User fills booking form
2. Form data is saved to database
3. Backend generates WhatsApp message with booking details
4. User is redirected to WhatsApp chat with pre-filled message
5. Admin receives formatted booking information

### Message Format Example
```
🎉 *New Booking from LYAN Web App* 🎉

👤 *Customer Details*
Name: Abebe Kebede
Email: abebe@example.com
Phone: 0912345678

📅 *Event Details*
Type: Wedding
Date: Saturday, December 15, 2025
Time: 2:00 PM
Location: Hotel
Guests: 200

📦 *Package Selected*
Premium Wedding Package
Price: 150,000 ETB

💰 *Payment*
Total Amount: 150,000 ETB
Advance Paid: 45,000 ETB

Booking ID: 674a1b2c3d4e5f6g7h8i9j0k
Status: PENDING
```

### Customization
Update WhatsApp number in `.env`:
```env
WHATSAPP_NUMBER=251912345678  # Format: Country code + number
```

---

## 💳 TeleBirr Payment Integration

### Current Implementation (Simplified)
- Display TeleBirr account information
- User sends payment manually
- User uploads payment screenshot (optional)
- Admin confirms payment and updates booking status

### Account Setup
Update in `.env`:
```env
TELEBIRR_ACCOUNT_NUMBER=0912345678
TELEBIRR_ACCOUNT_NAME=LYAN Catering & Events
```

### Future Enhancement Ideas
- Integrate TeleBirr API (if available)
- Automated payment verification
- SMS notifications

---

## 🎨 Customization Guide

### Changing Colors
Edit `frontend/src/App.js` or create a theme in `frontend/src/styles/theme.js`:
```javascript
const theme = {
  primary: '#2C3E50',
  secondary: '#FFD93D',
  success: '#25D366', // WhatsApp green
  error: '#FF6B6B',
  // ... add more
};
```

### Adding New Packages (Admin)
1. Login as admin
2. Navigate to `/admin/dashboard`
3. Go to "Packages" section
4. Click "Add New Package"
5. Fill in details and save

### Updating Contact Information
Edit `frontend/src/pages/Contact.js`:
```javascript
const contactInfo = {
  phone: '+251 91 234 5678',
  email: 'info@lyancatering.com',
  address: 'Addis Ababa, Ethiopia',
  whatsapp: '251912345678',
  // ... update social media links
};
```

---

## 🧪 Testing

### Test User Flow
1. **Register**: `http://localhost:3000/register`
2. **Login**: Use registered credentials
3. **Browse Packages**: `http://localhost:3000/packages`
4. **Create Booking**: `http://localhost:3000/booking`
5. **View Dashboard**: `http://localhost:3000/user/dashboard`

### Test Admin Flow
1. **Set user as admin** (see "Creating Admin User")
2. **Login**: `http://localhost:3000/login`
3. **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
4. **Manage Packages**: Add/Edit/Delete packages
5. **View Bookings**: See all customer bookings

---

## 🌐 Deployment

### Backend Deployment (Render.com)

1. **Create account** on [Render.com](https://render.com)
2. **Create Web Service**:
   - Connect GitHub repository
   - Root directory: `lyan-restaurant/backend`
   - Build command: `npm install`
   - Start command: `npm start`
3. **Set Environment Variables** (from `.env.example`)
4. **Deploy**

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Configure**:
   - Framework preset: Create React App
   - Root directory: `frontend`

4. **Set environment variable**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

### Database (MongoDB Atlas)

1. **Create cluster** on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Get connection string**
3. **Update** `MONGODB_URI` in backend environment variables

---

## 📖 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/forgot-password - Request password reset
```

### Packages
```
GET    /api/packages             - Get all packages (with filters)
GET    /api/packages/featured    - Get featured/discount packages
GET    /api/packages/:id         - Get single package
POST   /api/packages             - Create package (Admin)
PUT    /api/packages/:id         - Update package (Admin)
DELETE /api/packages/:id         - Delete package (Admin)
```

### Bookings
```
POST   /api/bookings             - Create new booking
GET    /api/bookings/my-bookings - Get user's bookings
GET    /api/bookings/:id         - Get single booking
GET    /api/bookings             - Get all bookings (Admin)
GET    /api/bookings/stats/overview - Get booking statistics (Admin)
PUT    /api/bookings/:id/status  - Update booking status (Admin)
PUT    /api/bookings/:id/payment-receipt - Upload payment receipt
DELETE /api/bookings/:id         - Cancel booking
```

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
```
Error: MongoDB connection failed
```
**Solution**: 
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check network connectivity

**Port Already in Use**:
```
Error: Port 5000 is already in use
```
**Solution**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or change PORT in .env
```

### Frontend Issues

**CORS Error**:
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
- Ensure backend CORS is configured for `http://localhost:3000`
- Check `backend/index.js` CORS settings

**Cannot Connect to API**:
**Solution**:
- Verify backend is running
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure no firewall blocking

---

## 🤝 Contributing

This is a learning project. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📞 Support

For questions or support:
- **Email**: info@lyancatering.com
- **WhatsApp**: +251 91 234 5678
- **GitHub Issues**: [Create an issue](https://github.com/mame12b/lyan-restaurant/issues)

---

## 🎓 Learning Resources

- [MERN Stack Tutorial](https://www.mongodb.com/mern-stack)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Material-UI Documentation](https://mui.com/)

---

## ✨ Features Roadmap

- [ ] SMS notifications via Ethiopian SMS gateway
- [ ] Email booking confirmations
- [ ] Real-time chat with Socket.io
- [ ] Online payment with Ethiopian banks
- [ ] Multi-language support (Amharic/English/Oromo)
- [ ] Mobile app (React Native)
- [ ] Admin mobile dashboard
- [ ] Calendar view for bookings
- [ ] Customer reviews and ratings
- [ ] Photo upload for events

---

## 🙏 Acknowledgments

- Ethiopian developer community
- MERN Stack tutorials and guides
- Material-UI components
- All contributors and testers

---

**Made with ❤️ in Ethiopia** 🇪🇹

**ኢትዮጵያ ታበጽሕ!**
>>>>>>> backup-before-merge
