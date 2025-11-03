# ✅ LYAN Catering & Events - Setup Checklist

Use this checklist to ensure everything is properly set up!

---

## 🔧 Initial Setup

### Prerequisites
- [ ] Node.js installed (v14+) - Run: `node --version`
- [ ] npm installed (v6+) - Run: `npm --version`
- [ ] MongoDB installed - Run: `mongod --version`
- [ ] Git installed - Run: `git --version`
- [ ] Code editor (VS Code recommended)

---

## 📂 Project Setup

### Backend Setup
- [ ] Navigate to `/backend` directory
- [ ] Run `npm install` to install dependencies
- [ ] Copy `.env.example` to create `.env` file
- [ ] Update `.env` with your settings:
  - [ ] MongoDB URI (local or Atlas)
  - [ ] JWT_SECRET (generate strong random string)
  - [ ] WHATSAPP_NUMBER (your business WhatsApp)
  - [ ] TELEBIRR_ACCOUNT_NUMBER
  - [ ] TELEBIRR_ACCOUNT_NAME
- [ ] Start MongoDB service
- [ ] Test backend: `npm run dev`
- [ ] Backend should run on http://localhost:5000

### Frontend Setup
- [ ] Navigate to `/frontend` directory
- [ ] Run `npm install` to install dependencies
- [ ] Create `.env` file with: `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] Test frontend: `npm start`
- [ ] Frontend should open at http://localhost:3000

---

## 🧪 Testing Checklist

### User Flow Testing
- [ ] **Register New User**
  - [ ] Go to http://localhost:3000/register
  - [ ] Create account with email and password
  - [ ] Verify registration success

- [ ] **Login**
  - [ ] Go to http://localhost:3000/login
  - [ ] Login with registered credentials
  - [ ] Verify redirect to home/dashboard

- [ ] **Browse Packages**
  - [ ] Go to http://localhost:3000/packages
  - [ ] Test category filter
  - [ ] Test event type filter
  - [ ] Verify packages display correctly

- [ ] **Create Booking**
  - [ ] Click "Book Now" on a package
  - [ ] Fill Step 1: Event Details
  - [ ] Fill Step 2: Package Selection
  - [ ] Fill Step 3: Payment Info
  - [ ] Submit and verify WhatsApp redirect
  - [ ] Check if booking saved in database

- [ ] **View My Bookings**
  - [ ] Go to http://localhost:3000/user/dashboard
  - [ ] Verify bookings are displayed
  - [ ] Check booking details

- [ ] **Gallery Page**
  - [ ] Go to http://localhost:3000/gallery
  - [ ] Verify image carousel works
  - [ ] Test hover effects on images

- [ ] **Contact Page**
  - [ ] Go to http://localhost:3000/contact
  - [ ] Test WhatsApp button
  - [ ] Verify social media links

- [ ] **WhatsApp Floating Button**
  - [ ] Check if button appears on all pages
  - [ ] Click and verify WhatsApp opens
  - [ ] Check message is prefilled

### Admin Flow Testing
- [ ] **Make User Admin**
  ```bash
  mongo
  use lyan-catering-events
  db.users.updateOne(
    {email: "your@email.com"},
    {$set: {role: "admin"}}
  )
  ```

- [ ] **Login as Admin**
  - [ ] Login with admin credentials
  - [ ] Should have admin menu access

- [ ] **Admin Dashboard**
  - [ ] Go to http://localhost:3000/admin/dashboard
  - [ ] Verify booking statistics display
  - [ ] Check recent bookings list

- [ ] **Manage Packages**
  - [ ] Create new package
  - [ ] Edit existing package
  - [ ] Toggle package active/inactive
  - [ ] Delete package (test carefully!)

- [ ] **Manage Bookings**
  - [ ] View all bookings
  - [ ] Filter by status
  - [ ] Update booking status
  - [ ] Add admin notes

---

## 🔍 API Testing

### Using Postman/Thunder Client

#### Authentication
- [ ] POST `/api/auth/register` - Register user
- [ ] POST `/api/auth/login` - Login user
- [ ] GET `/api/auth/profile` - Get user profile (with token)

#### Packages (Public)
- [ ] GET `/api/packages` - Get all packages
- [ ] GET `/api/packages/featured` - Get featured packages
- [ ] GET `/api/packages/:id` - Get single package

#### Packages (Admin)
- [ ] POST `/api/packages` - Create package (admin token)
- [ ] PUT `/api/packages/:id` - Update package (admin token)
- [ ] DELETE `/api/packages/:id` - Delete package (admin token)

#### Bookings (User)
- [ ] POST `/api/bookings` - Create booking (user token)
- [ ] GET `/api/bookings/my-bookings` - Get my bookings (user token)
- [ ] GET `/api/bookings/:id` - Get single booking (user token)

#### Bookings (Admin)
- [ ] GET `/api/bookings` - Get all bookings (admin token)
- [ ] GET `/api/bookings/stats/overview` - Get statistics (admin token)
- [ ] PUT `/api/bookings/:id/status` - Update status (admin token)

---

## 📱 WhatsApp Testing

- [ ] Create a booking with all details
- [ ] Verify redirect to WhatsApp
- [ ] Check message format:
  - [ ] Customer details included
  - [ ] Event details included
  - [ ] Package details included
  - [ ] Payment info included
  - [ ] Booking ID included
- [ ] Test sending message to your WhatsApp number
- [ ] Verify admin receives the message

---

## 🎨 UI/UX Testing

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Test landscape orientation
- [ ] Check all images load correctly
- [ ] Verify text is readable on all screens

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Visual Elements
- [ ] Animations work smoothly
- [ ] Hover effects function
- [ ] Buttons are clickable
- [ ] Forms validate correctly
- [ ] Error messages display
- [ ] Success messages display
- [ ] Loading spinners appear

---

## 🐛 Error Handling Testing

- [ ] Test with invalid credentials
- [ ] Test with missing form fields
- [ ] Test with past event dates
- [ ] Test with non-existent package ID
- [ ] Test unauthorized access to admin routes
- [ ] Test network errors (disconnect internet)
- [ ] Test MongoDB connection errors

---

## 📊 Database Verification

### MongoDB Collections
- [ ] Open MongoDB Compass
- [ ] Connect to `lyan-catering-events` database
- [ ] Verify collections exist:
  - [ ] users
  - [ ] packages
  - [ ] bookings
- [ ] Check sample data in each collection
- [ ] Verify relationships (refs) work correctly

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] No errors in server logs
- [ ] Environment variables documented
- [ ] README updated
- [ ] Code committed to Git
- [ ] .gitignore includes .env files

### Backend Deployment (Render/Heroku)
- [ ] Create account on hosting platform
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Test API endpoints
- [ ] Get production API URL

### Frontend Deployment (Vercel/Netlify)
- [ ] Update REACT_APP_API_URL to production backend
- [ ] Deploy frontend
- [ ] Test production build
- [ ] Verify all features work

### Database (MongoDB Atlas)
- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Whitelist IP addresses
- [ ] Get connection string
- [ ] Update MONGODB_URI in backend
- [ ] Test connection

### Post-Deployment
- [ ] Test complete user flow on production
- [ ] Test admin features on production
- [ ] Verify WhatsApp integration works
- [ ] Check mobile responsiveness
- [ ] Monitor for errors
- [ ] Set up error logging (optional: Sentry)

---

## 📝 Documentation Checklist

- [ ] README.md is complete and accurate
- [ ] QUICKSTART.md is easy to follow
- [ ] IMPLEMENTATION_SUMMARY.md reviewed
- [ ] API endpoints documented
- [ ] Environment variables explained
- [ ] Setup instructions tested
- [ ] Troubleshooting section helpful

---

## 🎓 Learning Verification

### Understand the Concepts
- [ ] How JWT authentication works
- [ ] How MongoDB schemas and models work
- [ ] How React Context API manages state
- [ ] How React Router handles navigation
- [ ] How Material-UI components are used
- [ ] How Axios makes API requests
- [ ] How environment variables work
- [ ] How async/await handles promises

### Can You Explain?
- [ ] The complete user booking flow
- [ ] How WhatsApp integration is implemented
- [ ] The difference between user and admin routes
- [ ] How packages are filtered and displayed
- [ ] The purpose of each backend controller
- [ ] How authentication middleware works
- [ ] The structure of the MongoDB database

---

## ✅ Final Verification

- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] All features working as expected
- [ ] Documentation is clear and complete
- [ ] Code is organized and clean
- [ ] Git repository is up to date
- [ ] Ready for demo/presentation

---

## 🎉 Completion Status

**When all boxes are checked, you're ready to:**
- ✅ Demo your project
- ✅ Deploy to production
- ✅ Add to your portfolio
- ✅ Show to potential clients
- ✅ Continue building new features

---

## 📞 Need Help?

If any checkbox fails:
1. Check the error message
2. Review QUICKSTART.md
3. Search the issue in README.md
4. Check IMPLEMENTATION_SUMMARY.md
5. Review the code in that section
6. Test in isolation
7. Ask for help with specific error message

---

**Good luck with your LYAN Catering & Events project!** 🚀

**Made with ❤️ for Ethiopian Developers** 🇪🇹
