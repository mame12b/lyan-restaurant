# LYAN Catering & Events - የላያን ካተሪንግ እና ኢቬንት# 🎉 LYAN Catering & Events Booking Web App



A full-stack MERN (MongoDB, Express, React, Node.js) web application for Ethiopian catering and event management services.A modern, responsive web application for **LYAN Catering & Events** built with the MERN Stack (MongoDB, Express.js, React.js, Node.js). This app allows users to browse event packages, book events online, and automatically connect with admins via WhatsApp with prefilled booking details.



## 🎯 Project Overview![Ethiopian Flag](https://img.shields.io/badge/Made%20in-Ethiopia-green?style=for-the-badge&logo=ethiopia)

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=mongodb&logoColor=white)

LYAN Catering & Events is a comprehensive platform that enables customers to:

- Browse event packages (Weddings, Birthdays, Engagements, Corporate Events)---

- Book catering services with customized packages

- View gallery of past events## 🌟 Features

- Contact business via WhatsApp integration

- Make payments through TeleBirr### 👤 User Features

- **Authentication System**: Secure registration, login, and logout with JWT tokens

## 🚀 Features- **Browse Packages**: View all available event packages with filtering by category and event type

- **Booking System**: 

### Customer Features  - Multi-step booking form (Event Details → Package Selection → Payment)

- **Package Browsing**: View and filter packages by category and event type  - TeleBirr payment instructions with optional receipt upload

- **Event Booking**: 3-step booking process (Event Details → Package Selection → Payment)  - Automatic WhatsApp redirect with prefilled booking details

- **Gallery**: View photos from previous events- **Gallery**: Beautiful image carousel showcasing previous events

- **WhatsApp Integration**: Direct messaging for inquiries and booking confirmations- **Contact**: Multiple contact options including instant WhatsApp chat

- **User Dashboard**: Track bookings and order history- **User Dashboard**: View and manage personal bookings

- **Multi-language**: Amharic (አማርኛ) and English support

### 🔐 Admin Features

### Admin Features- **Admin Dashboard**: Overview of all bookings and statistics

- **User Management**: View and manage user accounts- **Package Management**: Create, edit, delete, and toggle package availability

- **Package Management**: Create, update, delete event packages- **Booking Management**: View all bookings, update status (pending/confirmed/cancelled/completed)

- **Booking Management**: View and update booking status- **User Management**: View registered users

- **Dashboard Analytics**: Overview of orders, packages, and revenue

- **Settings**: Configure system preferences### 🎨 Design Features

- Modern, clean UI with Material-UI components

## 🛠️ Tech Stack- Smooth animations with Framer Motion

- Fully responsive (mobile-friendly for Ethiopian users)

### Frontend- Ethiopian Amharic/English bilingual support

- **React** 18.3.1 - UI library- Dark mode ready (optional toggle)

- **Material-UI** 6.4.11 - Component library- Floating WhatsApp button for instant chat

- **React Router** 6.30.0 - Navigation

- **Axios** 1.9.0 - HTTP client---

- **Framer Motion** 12.9.4 - Animations

- **React Slick** 0.30.3 - Carousel/slider## 🛠️ Tech Stack



### Backend### Backend

- **Node.js** - Runtime environment- **Node.js** & **Express.js** - Server and API

- **Express.js** 4.21.2 - Web framework- **MongoDB** & **Mongoose** - Database

- **MongoDB** with Mongoose 8.14.1 - Database- **JWT** - Authentication

- **JWT** - Authentication- **bcryptjs** - Password hashing

- **bcryptjs** - Password hashing- **express-validator** - Input validation

- **dotenv** - Environment variables

## 📁 Project Structure

### Frontend

```- **React.js** - UI Framework

lyan-restaurant/- **Material-UI (MUI)** - Component library

├── backend/- **React Router** - Navigation

│   ├── config/- **Axios** - HTTP client

│   │   └── db.js                 # Database configuration- **Framer Motion** - Animations

│   ├── controllers/- **React Slick** - Image carousel

│   │   ├── adminController.js    # Admin operations- **React Toastify** - Notifications

│   │   ├── authController.js     # Authentication

│   │   ├── packageController.js  # Package CRUD---

│   │   └── bookingController.js  # Booking management

│   ├── middlewares/## 📁 Project Structure

│   │   ├── authMiddleware.js     # JWT verification

│   │   ├── errorMiddleware.js    # Error handling```

│   │   └── validationMiddleware.jslyan-restaurant/

│   ├── models/├── backend/

│   │   ├── User.js               # User schema│   ├── config/

│   │   ├── Package.js            # Event package schema│   │   └── db.js                 # MongoDB connection

│   │   └── Booking.js            # Booking schema│   ├── controllers/

│   ├── routes/│   │   ├── authController.js

│   │   ├── adminRoutes.js│   │   ├── packageController.js  # NEW: Package CRUD

│   │   ├── authRoutes.js│   │   ├── bookingController.js  # NEW: Booking + WhatsApp

│   │   ├── packageRoutes.js│   │   └── ...

│   │   └── bookingRoutes.js│   ├── models/

│   ├── services/│   │   ├── User.js

│   │   ├── emailService.js│   │   ├── Package.js            # NEW: Package model

│   │   └── tokenService.js│   │   ├── Booking.js            # NEW: Booking model

│   ├── utils/│   │   └── ...

│   │   └── error.js│   ├── routes/

│   ├── .env                      # Environment variables│   │   ├── authRoutes.js

│   ├── index.js                  # Server entry point│   │   ├── packageRoutes.js      # NEW: Package routes

│   └── package.json│   │   ├── bookingRoutes.js      # NEW: Booking routes

││   │   └── ...

├── frontend/│   ├── middlewares/

│   ├── public/│   │   ├── authMiddleware.js

│   │   ├── index.html│   │   └── errorMiddleware.js

│   │   └── manifest.json│   ├── index.js                  # Main server file

│   ├── src/│   ├── package.json

│   │   ├── components/│   └── .env                      # Environment variables

│   │   │   ├── Navbar.js│

│   │   │   ├── Footer.js├── frontend/

│   │   │   ├── WhatsAppButton.js│   ├── public/

│   │   │   ├── Loader.js│   │   └── index.html

│   │   │   └── ProtectedRoute.js│   ├── src/

│   │   ├── context/│   │   ├── components/

│   │   │   ├── AuthContext.js    # Authentication state│   │   │   ├── Navbar.js

│   │   │   └── ThemeContext.js│   │   │   ├── WhatsAppButton.js  # NEW: Floating chat button

│   │   ├── pages/│   │   │   └── ...

│   │   │   ├── Home.js           # Landing page│   │   ├── pages/

│   │   │   ├── Packages.js       # Browse packages│   │   │   ├── Home.js

│   │   │   ├── Booking.js        # Booking form│   │   │   ├── Packages.js        # NEW: Browse packages

│   │   │   ├── Gallery.js        # Photo gallery│   │   │   ├── Booking.js         # NEW: Multi-step booking form

│   │   │   ├── Contact.js        # Contact info│   │   │   ├── Gallery.js         # NEW: Event photos carousel

│   │   │   ├── Login.js│   │   │   ├── Contact.js         # NEW: Contact info & social

│   │   │   ├── Register.js│   │   │   └── admin/

│   │   │   ├── UserDashboard.js│   │   │       └── AdminDashboard.js

│   │   │   └── admin/│   │   ├── context/

│   │   │       ├── AdminDashboard.js│   │   │   └── AuthContext.js

│   │   │       ├── Users.js│   │   ├── services/

│   │   │       └── Settings.js│   │   │   └── api.js             # UPDATED: Package & Booking APIs

│   │   ├── services/│   │   ├── App.js                 # UPDATED: New routes

│   │   │   ├── api.js            # API service layer│   │   └── index.js

│   │   │   └── authService.js│   ├── package.json

│   │   ├── styles/│   └── .env                       # Frontend env variables

│   │   │   └── global.css│

│   │   ├── App.js                # Main component├── package.json                   # Root package for concurrently

│   │   └── index.js├── .env.example                   # NEW: Example environment file

│   ├── .env                      # Frontend environment variables└── README.md                      # This file

│   └── package.json```

│

└── README.md---

```

## 🚀 Installation & Setup

## 🔧 Installation & Setup

### Prerequisites

### Prerequisites- **Node.js** (v14 or higher)

- Node.js v14+ and npm- **MongoDB** (local or MongoDB Atlas)

- MongoDB installed and running- **npm** or **yarn**

- Git

### Step 1: Clone the Repository

### 1. Clone the Repository```bash

```bashgit clone https://github.com/mame12b/lyan-restaurant.git

git clone https://github.com/mame12b/lyan-restaurant.gitcd lyan-restaurant/lyan-restaurant

cd lyan-restaurant```

```

### Step 2: Backend Setup

### 2. Backend Setup

1. **Navigate to backend directory**:

```bash   ```bash

# Navigate to backend directory   cd backend

cd backend   ```



# Install dependencies2. **Install dependencies**:

npm install   ```bash

   npm install

# Create .env file   ```

cat > .env << EOF

PORT=50013. **Create `.env` file** (copy from `.env.example`):

MONGODB_URI=mongodb://localhost:27017/lyan-restaurant   ```bash

JWT_SECRET=your_strong_secret_here_at_least_32_chars   cp ../.env.example .env

JWT_EXPIRES_IN=15m   ```

REFRESH_TOKEN_SECRET=your_strong_refresh_secret_different_from_jwt

REFRESH_TOKEN_EXPIRES_IN=7d4. **Configure environment variables** in `.env`:

EOF   ```env

   # Server

# Start MongoDB (if not running)   PORT=5000

sudo systemctl start mongod   NODE_ENV=development

sudo systemctl enable mongod   

   # Database

# Run the backend server   MONGODB_URI=mongodb://localhost:27017/lyan-catering-events

npm run dev   

```   # JWT

   JWT_SECRET=your_super_secret_jwt_key_change_this

The backend will start on **http://localhost:5001**   JWT_EXPIRES_IN=30d

   

### 3. Frontend Setup   # WhatsApp (Ethiopian format: 251 + 9XXXXXXXX)

   WHATSAPP_NUMBER=251912345678

```bash   

# Open a new terminal   # TeleBirr

# Navigate to frontend directory   TELEBIRR_ACCOUNT_NUMBER=0912345678

cd frontend   TELEBIRR_ACCOUNT_NAME=LYAN Catering & Events

   

# Install dependencies   # Frontend URL

npm install   FRONTEND_URL=http://localhost:3000

   ```

# Create .env file

cat > .env << EOF5. **Start MongoDB** (if local):

REACT_APP_API_URL=http://localhost:5001/api   ```bash

WDS_SOCKET_IGNORE_WARNINGS=true   mongod

EOF   ```



# Start the React development server6. **Run backend server**:

npm start   ```bash

```   npm run dev

   ```

The frontend will start on **http://localhost:3000**   Backend should be running at `http://localhost:5000`



## 🎨 Usage### Step 3: Frontend Setup



### For Customers1. **Open new terminal and navigate to frontend**:

   ```bash

1. **Browse Packages**   cd frontend

   - Visit homepage at http://localhost:3000   ```

   - Click "Browse Packages" to view available event packages

   - Filter by category (Catering, Decoration, Full Package, Venue, Photography)2. **Install dependencies**:

   - Filter by event type (Wedding, Birthday, Engagement, Meeting, Bridal Shower)   ```bash

   npm install

2. **Create Account**   ```

   - Click "Register" in navbar

   - Fill in Name, Email, Password3. **Create `.env` file** in frontend:

   - Submit to create account   ```bash

   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

3. **Book an Event**   ```

   - Login to your account

   - Click "Book Event" or navigate to /booking4. **Start React development server**:

   - **Step 1**: Enter event details (type, date, time, location, guests)   ```bash

   - **Step 2**: Select a package from available options   npm start

   - **Step 3**: Upload TeleBirr payment receipt   ```

   - Submit booking   Frontend should open at `http://localhost:3000`

   - Receive WhatsApp confirmation with booking details

### Step 4: Run Both Concurrently (Optional)

4. **View Bookings**

   - Go to User DashboardFrom the root `lyan-restaurant` directory:

   - View all your bookings and their status

1. **Install concurrently** (if not already):

### For Admins   ```bash

   npm install

1. **Access Admin Dashboard**   ```

   - Login with admin credentials

   - Navigate to /admin/dashboard2. **Start both servers**:

   ```bash

2. **Manage Users**   npm run dev

   - View all registered users   ```

   - Delete user accounts if needed

---

3. **Manage Packages**

   - Create new event packages## 🔑 Creating Admin User

   - Update existing packages

   - Set pricing and discountsTo access admin features, you need to create an admin user in MongoDB:

   - Toggle package availability

### Method 1: MongoDB Compass (GUI)

4. **Manage Bookings**1. Open MongoDB Compass and connect

   - View all bookings2. Navigate to `lyan-catering-events` database → `users` collection

   - Update booking status (pending → confirmed → completed)3. Find your user document

   - View payment receipts4. Edit the document and set `role: "admin"`



## 🔐 Authentication### Method 2: MongoDB Shell (CLI)

```bash

The application uses JWT (JSON Web Tokens) for authentication:mongo

use lyan-catering-events

- **Access Token**: Short-lived (15 minutes), stored in localStoragedb.users.updateOne(

- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookies  { email: "your@email.com" },

- **Protected Routes**: User and admin routes require valid tokens  { $set: { role: "admin" } }

- **Role-Based Access**: Admin routes check for admin role)

```

## 💳 Payment Integration

### Method 3: Register via API

Currently supports **manual TeleBirr payment**:```bash

1. Customer transfers payment to TeleBirr account# Register normally, then update via API or database

2. Customer uploads payment receipt screenshotcurl -X POST http://localhost:5000/api/auth/register \

3. Admin verifies payment manually  -H "Content-Type: application/json" \

4. Admin updates booking status to "confirmed"  -d '{

    "name": "Admin User",

*Future: TeleBirr API integration for automated payment verification*    "email": "admin@lyancatering.com",

    "password": "Admin@123"

## 📱 WhatsApp Integration  }'

```

Uses **wa.me** links for WhatsApp integration:

---

**Booking Confirmations**:

```## 📱 WhatsApp Integration

https://wa.me/251XXXXXXXXX?text=...

```### How It Works

Message includes:1. User fills booking form

- Customer name, email, phone2. Form data is saved to database

- Event type, date, time3. Backend generates WhatsApp message with booking details

- Selected package details4. User is redirected to WhatsApp chat with pre-filled message

- Total amount5. Admin receives formatted booking information

- Payment reference

### Message Format Example

**Floating Button**: ```

- Available on all pages🎉 *New Booking from LYAN Web App* 🎉

- Quick access to business WhatsApp

👤 *Customer Details*

## 🌍 LocalizationName: Abebe Kebede

Email: abebe@example.com

**Ethiopian Context**:Phone: 0912345678

- Currency: Ethiopian Birr (ብር)

- Phone format: +251 (Ethiopian country code)📅 *Event Details*

- Bilingual: Amharic (አማርኛ) and EnglishType: Wedding

- Ethiopian color palette (Green, Yellow, Red, Gold)Date: Saturday, December 15, 2025

Time: 2:00 PM

## 🗄️ Database SchemaLocation: Hotel

Guests: 200

### User Model

```javascript📦 *Package Selected*

{Premium Wedding Package

  name: String,Price: 150,000 ETB

  email: String (unique),

  password: String (hashed),💰 *Payment*

  role: String (enum: ['user', 'admin']),Total Amount: 150,000 ETB

  isVerified: Boolean,Advance Paid: 45,000 ETB

  createdAt: Date

}Booking ID: 674a1b2c3d4e5f6g7h8i9j0k

```Status: PENDING

```

### Package Model

```javascript### Customization

{Update WhatsApp number in `.env`:

  name: String,```env

  description: String,WHATSAPP_NUMBER=251912345678  # Format: Country code + number

  category: String (enum: ['catering', 'decoration', 'full-package', 'venue', 'photography']),```

  price: Number,

  discount: Number,---

  image: String,

  features: [String],## 💳 TeleBirr Payment Integration

  eventTypes: [String],

  maxGuests: Number,### Current Implementation (Simplified)

  isActive: Boolean,- Display TeleBirr account information

  createdAt: Date- User sends payment manually

}- User uploads payment screenshot (optional)

```- Admin confirms payment and updates booking status



### Booking Model### Account Setup

```javascriptUpdate in `.env`:

{```env

  userId: ObjectId (ref: 'User'),TELEBIRR_ACCOUNT_NUMBER=0912345678

  customerName: String,TELEBIRR_ACCOUNT_NAME=LYAN Catering & Events

  customerEmail: String,```

  customerPhone: String,

  eventType: String,### Future Enhancement Ideas

  eventDate: Date,- Integrate TeleBirr API (if available)

  eventTime: String,- Automated payment verification

  locationType: String (enum: ['our-venue', 'customer-venue']),- SMS notifications

  locationAddress: String,

  numberOfGuests: Number,---

  packageId: ObjectId (ref: 'Package'),

  specialRequests: String,## 🎨 Customization Guide

  paymentReceipt: String (URL),

  totalAmount: Number,### Changing Colors

  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),Edit `frontend/src/App.js` or create a theme in `frontend/src/styles/theme.js`:

  whatsappSent: Boolean,```javascript

  createdAt: Dateconst theme = {

}  primary: '#2C3E50',

```  secondary: '#FFD93D',

  success: '#25D366', // WhatsApp green

## 📡 API Endpoints  error: '#FF6B6B',

  // ... add more

### Authentication};

- `POST /api/auth/register` - Register new user```

- `POST /api/auth/login` - User login

- `POST /api/auth/logout` - User logout### Adding New Packages (Admin)

- `POST /api/auth/forgot-password` - Request password reset1. Login as admin

- `POST /api/auth/reset-password/:token` - Reset password2. Navigate to `/admin/dashboard`

- `GET /api/auth/verify-email/:token` - Verify email3. Go to "Packages" section

4. Click "Add New Package"

### Packages (Public)5. Fill in details and save

- `GET /api/packages` - Get all packages (with filters)

- `GET /api/packages/featured` - Get featured packages### Updating Contact Information

- `GET /api/packages/:id` - Get package by IDEdit `frontend/src/pages/Contact.js`:

```javascript

### Packages (Admin)const contactInfo = {

- `POST /api/packages` - Create package  phone: '+251 91 234 5678',

- `PUT /api/packages/:id` - Update package  email: 'info@lyancatering.com',

- `DELETE /api/packages/:id` - Delete package  address: 'Addis Ababa, Ethiopia',

- `PATCH /api/packages/:id/toggle-active` - Toggle package status  whatsapp: '251912345678',

  // ... update social media links

### Bookings (User)};

- `POST /api/bookings` - Create booking```

- `GET /api/bookings/my-bookings` - Get user's bookings

- `GET /api/bookings/:id` - Get booking details---

- `PATCH /api/bookings/:id/upload-receipt` - Upload payment receipt

- `PATCH /api/bookings/:id/cancel` - Cancel booking## 🧪 Testing



### Bookings (Admin)### Test User Flow

- `GET /api/bookings` - Get all bookings (with filters)1. **Register**: `http://localhost:3000/register`

- `GET /api/bookings/stats` - Get booking statistics2. **Login**: Use registered credentials

- `PATCH /api/bookings/:id/status` - Update booking status3. **Browse Packages**: `http://localhost:3000/packages`

4. **Create Booking**: `http://localhost:3000/booking`

### Admin5. **View Dashboard**: `http://localhost:3000/user/dashboard`

- `GET /api/admin/users` - Get all users

- `DELETE /api/admin/users/:id` - Delete user### Test Admin Flow

1. **Set user as admin** (see "Creating Admin User")

## 🔒 Environment Variables2. **Login**: `http://localhost:3000/login`

3. **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

### Backend (.env)4. **Manage Packages**: Add/Edit/Delete packages

```env5. **View Bookings**: See all customer bookings

PORT=5001

MONGODB_URI=mongodb://localhost:27017/lyan-restaurant---

JWT_SECRET=your_strong_secret_here_at_least_32_chars

JWT_EXPIRES_IN=15m## 🌐 Deployment

REFRESH_TOKEN_SECRET=your_strong_refresh_secret_different_from_jwt

REFRESH_TOKEN_EXPIRES_IN=7d### Backend Deployment (Render.com)

```

1. **Create account** on [Render.com](https://render.com)

### Frontend (.env)2. **Create Web Service**:

```env   - Connect GitHub repository

REACT_APP_API_URL=http://localhost:5001/api   - Root directory: `lyan-restaurant/backend`

WDS_SOCKET_IGNORE_WARNINGS=true   - Build command: `npm install`

```   - Start command: `npm start`

3. **Set Environment Variables** (from `.env.example`)

## 🐛 Troubleshooting4. **Deploy**



### Common Issues### Frontend Deployment (Vercel)



**Backend won't start - Port in use**1. **Install Vercel CLI**:

```bash   ```bash

# Kill process on port 5001   npm install -g vercel

lsof -ti:5001 | xargs kill -9   ```



# Or use different port in backend/.env2. **Deploy**:

PORT=5002   ```bash

```   cd frontend

   vercel

**MongoDB connection error**   ```

```bash

# Check if MongoDB is running3. **Configure**:

sudo systemctl status mongod   - Framework preset: Create React App

   - Root directory: `frontend`

# Start MongoDB

sudo systemctl start mongod4. **Set environment variable**:

```   ```

   REACT_APP_API_URL=https://your-backend-url.onrender.com/api

**Frontend compilation errors**   ```

```bash

# Clear cache and reinstall### Database (MongoDB Atlas)

rm -rf node_modules package-lock.json

npm install1. **Create cluster** on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

```2. **Get connection string**

3. **Update** `MONGODB_URI` in backend environment variables

**CORS errors**

- Ensure backend is running on port 5001---

- Check frontend .env has correct REACT_APP_API_URL

- Verify CORS configuration in backend/index.js## 📖 API Endpoints



## 🚀 Deployment### Authentication

```

### Backend (Node.js)POST   /api/auth/register        - Register new user

- Deploy to: Heroku, Railway, Render, AWS EC2POST   /api/auth/login           - Login user

- Set environment variablesPOST   /api/auth/forgot-password - Request password reset

- Use MongoDB Atlas for production database```



### Frontend (React)### Packages

- Deploy to: Vercel, Netlify, AWS S3 + CloudFront```

- Build production version: `npm run build`GET    /api/packages             - Get all packages (with filters)

- Update REACT_APP_API_URL to production backend URLGET    /api/packages/featured    - Get featured/discount packages

GET    /api/packages/:id         - Get single package

## 📝 ScriptsPOST   /api/packages             - Create package (Admin)

PUT    /api/packages/:id         - Update package (Admin)

### BackendDELETE /api/packages/:id         - Delete package (Admin)

```bash```

npm start          # Start server (production)

npm run dev        # Start server with nodemon (development)### Bookings

npm test           # Run tests```

```POST   /api/bookings             - Create new booking

GET    /api/bookings/my-bookings - Get user's bookings

### FrontendGET    /api/bookings/:id         - Get single booking

```bashGET    /api/bookings             - Get all bookings (Admin)

npm start          # Start development serverGET    /api/bookings/stats/overview - Get booking statistics (Admin)

npm run build      # Build for productionPUT    /api/bookings/:id/status  - Update booking status (Admin)

npm test           # Run testsPUT    /api/bookings/:id/payment-receipt - Upload payment receipt

npm run lint       # Run ESLintDELETE /api/bookings/:id         - Cancel booking

``````



## 🤝 Contributing---



1. Fork the repository## 🐛 Troubleshooting

2. Create a feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'Add amazing feature'`)### Backend Issues

4. Push to branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request**MongoDB Connection Error**:

```

## 📄 LicenseError: MongoDB connection failed

```

This project is licensed under the ISC License.**Solution**: 

- Check if MongoDB is running

## 👨‍💻 Author- Verify `MONGODB_URI` in `.env`

- Check network connectivity

**Mame**

- GitHub: [@mame12b](https://github.com/mame12b)**Port Already in Use**:

```

## 🙏 AcknowledgmentsError: Port 5000 is already in use

```

- Material-UI for beautiful components**Solution**:

- Unsplash for placeholder images```bash

- React community for excellent documentation# Kill process on port 5000

lsof -ti:5000 | xargs kill -9

## 📞 Support# Or change PORT in .env

```

For questions or support:

- WhatsApp: +251XXXXXXXXX### Frontend Issues

- Email: contact@lyan-events.com

- GitHub Issues: [Create an issue](https://github.com/mame12b/lyan-restaurant/issues)**CORS Error**:

```

---Access to XMLHttpRequest blocked by CORS policy

```

**Made with ❤️ for Ethiopian Event Management****Solution**: 

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
- **WhatsApp**: +971 56 356 1803
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
