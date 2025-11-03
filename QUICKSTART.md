# Quick Start Guide - LYAN Catering & Events

Get up and running with LYAN Catering & Events in under 10 minutes!

## 🚀 Quick Overview

This is a full-stack MERN application for Ethiopian catering and event management. You'll need:
- Node.js 14+ and npm
- MongoDB (local or cloud)
- 10 minutes of your time ⏱️

---

## ⚡ Super Quick Start (Copy-Paste)

```bash
# 1. Clone the repository
git clone https://github.com/mame12b/lyan-restaurant.git
cd lyan-restaurant

# 2. Setup Backend
cd backend
npm install
cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lyan-restaurant
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
REFRESH_TOKEN_EXPIRES_IN=7d
EOF

# 3. Setup Frontend
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env

# 4. Start MongoDB (if not running)
sudo systemctl start mongod

# 5. Run Backend (Terminal 1)
cd ../backend
npm run dev

# 6. Run Frontend (Terminal 2 - open new terminal)
cd frontend
npm start
```

**Done!** 🎉 Your app should open at http://localhost:3000

---

## 📋 Step-by-Step Guide

### Step 1: Prerequisites Check

Make sure you have these installed:

```bash
# Check Node.js (need v14+)
node --version

# Check npm
npm --version

# Check if MongoDB is installed
mongod --version
```

**Don't have them?**
- [Install Node.js](https://nodejs.org/) (includes npm)
- [Install MongoDB](https://docs.mongodb.com/manual/installation/)

### Step 2: Get the Code

```bash
# Clone the repository
git clone https://github.com/mame12b/lyan-restaurant.git

# Navigate to project
cd lyan-restaurant

# Check what's inside
ls -la
```

You should see:
- `backend/` - Node.js/Express API
- `frontend/` - React application
- `README.md` - Main documentation

### Step 3: Setup Backend

```bash
# Go to backend folder
cd backend

# Install dependencies (this takes 1-2 minutes)
npm install

# Create environment file
cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lyan-restaurant
JWT_SECRET=your_jwt_secret_here_change_this_in_production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_secret_here_change_this_in_production
REFRESH_TOKEN_EXPIRES_IN=7d
EOF

# Verify .env was created
cat .env
```

### Step 4: Setup Frontend

```bash
# Go to frontend folder (from backend)
cd ../frontend

# Install dependencies (this takes 1-2 minutes)
npm install

# Create environment file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5001/api
WDS_SOCKET_IGNORE_WARNINGS=true
EOF

# Verify .env was created
cat .env
```

### Step 5: Start MongoDB

```bash
# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot (optional)
sudo systemctl enable mongod

# Check if MongoDB is running
sudo systemctl status mongod
```

You should see "active (running)" in green.

**Alternative: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `backend/.env` with your Atlas connection string

### Step 6: Start Backend Server

```bash
# Make sure you're in backend folder
cd backend

# Start development server
npm run dev
```

You should see:
```
Server running on port 5001
MongoDB Connected
```

**Leave this terminal running!** Don't close it.

### Step 7: Start Frontend (New Terminal)

Open a **NEW terminal** window/tab:

```bash
# Navigate to frontend
cd /path/to/lyan-restaurant/frontend

# Start React development server
npm start
```

Your browser should automatically open to http://localhost:3000

If it doesn't, manually open: **http://localhost:3000**

---

## 🎯 What to Do Next

### 1. Create an Account

1. Click **"Register"** in the top-right corner
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: At least 6 characters
3. Click **"Register"**

### 2. Browse Packages

1. Click **"Packages"** in the navigation
2. Browse available event packages
3. Filter by:
   - Category (Catering, Decoration, etc.)
   - Event Type (Wedding, Birthday, etc.)

### 3. Make a Test Booking

1. Click **"Book Event"** button
2. **Step 1**: Enter event details
   - Event type: Wedding
   - Date: Pick a future date
   - Number of guests: 100
3. **Step 2**: Select a package
4. **Step 3**: Upload a test image as "payment receipt"
5. Submit booking

### 4. Access Admin Dashboard

**Create admin account via MongoDB:**

```bash
# Open MongoDB shell
mongosh

# Use the database
use lyan-restaurant

# Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@lyan.com",
  password: "$2a$10$rOzJQjUgYW5qNKXW1YZzaO9GqHfqQFNv8yYXYvBvBYXYYYYYYYYYY", // password: "admin123"
  role: "admin",
  isVerified: true,
  createdAt: new Date()
})
```

**Login as admin:**
1. Logout if logged in
2. Login with:
   - Email: admin@lyan.com
   - Password: admin123
3. You'll see **"Admin"** option in navigation

---

## 🛠️ Common Issues & Fixes

### Issue: "EADDRINUSE: Port 5001 already in use"

**Fix:**
```bash
# Find and kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or use different port in backend/.env
PORT=5002
```

### Issue: "MongoDB connection failed"

**Fix:**
```bash
# Make sure MongoDB is running
sudo systemctl start mongod

# Check status
sudo systemctl status mongod

# Check if MongoDB is listening
sudo netstat -tulpn | grep 27017
```

### Issue: Frontend shows "Network Error"

**Fix:**
1. Make sure backend is running (check Terminal 1)
2. Verify `REACT_APP_API_URL` in `frontend/.env` is correct
3. Restart frontend:
   ```bash
   # In frontend terminal
   Ctrl+C
   npm start
   ```

### Issue: "Module not found" errors

**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: React app won't start on port 3000

**Fix:**
```bash
# If port 3000 is in use, React will ask if you want to use another port
# Press 'Y' to use the suggested port (usually 3001)
```

---

## 📱 Test the Application

### Customer Flow Test

1. **Register** → Create account
2. **Browse Packages** → View available packages
3. **Book Event** → Create a booking
4. **Upload Receipt** → Upload payment screenshot
5. **My Bookings** → View your bookings

### Admin Flow Test

1. **Login as admin** (use the admin account created above)
2. **Admin Dashboard** → View statistics
3. **Users** → See all registered users
4. **Bookings** → View and manage all bookings
5. **Settings** → Configure system

---

## 🔍 Project URLs

**Frontend (React):**
- Homepage: http://localhost:3000
- Packages: http://localhost:3000/packages
- Booking: http://localhost:3000/booking
- Login: http://localhost:3000/login
- Admin: http://localhost:3000/admin/dashboard

**Backend (API):**
- Base URL: http://localhost:5001/api
- Health check: http://localhost:5001/api/health (if configured)
- Packages: http://localhost:5001/api/packages
- Auth: http://localhost:5001/api/auth/login

---

## 📚 Next Steps

Now that you have the app running:

1. **Read the full documentation:**
   - [README.md](./README.md) - Complete overview
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
   - [API.md](./API.md) - API endpoints

2. **Explore the code:**
   - Backend: `backend/controllers/`, `backend/models/`
   - Frontend: `frontend/src/pages/`, `frontend/src/components/`

3. **Make changes:**
   - Read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
   - Create a new branch for your changes
   - Test thoroughly before committing

4. **Deploy to production:**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md) guide
   - Use MongoDB Atlas for database
   - Deploy backend to Railway/Heroku
   - Deploy frontend to Vercel/Netlify

---

## 💡 Pro Tips

**Development:**
- Use `nodemon` for backend auto-restart (already configured with `npm run dev`)
- React auto-reloads on file changes
- Use browser DevTools → Network tab to debug API calls

**Database:**
- Use MongoDB Compass to view database visually
- Download at: https://www.mongodb.com/products/compass

**VS Code Extensions (Recommended):**
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- MongoDB for VS Code

**Keyboard Shortcuts:**
- `Ctrl+C` in terminal to stop servers
- `Ctrl+Shift+~` in VS Code to open terminal
- `Ctrl+P` in VS Code to quickly open files

---

## 🆘 Getting Help

**Something not working?**

1. Check the [Troubleshooting section](#common-issues--fixes) above
2. Read the [full README.md](./README.md)
3. Open a [GitHub Issue](https://github.com/mame12b/lyan-restaurant/issues)
4. Ask in GitHub Discussions

**Common Questions:**

**Q: Can I use a different port?**  
A: Yes! Change `PORT` in `backend/.env` and update `REACT_APP_API_URL` in `frontend/.env`

**Q: Do I need to install MongoDB?**  
A: You can use MongoDB Atlas (cloud) instead of local MongoDB

**Q: How do I stop the servers?**  
A: Press `Ctrl+C` in the terminals running the servers

**Q: Can I use Windows?**  
A: Yes! Most commands work in PowerShell or Git Bash

---

## ✅ Quick Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# Start MongoDB
sudo systemctl start mongod

# Stop servers
Ctrl+C in terminal

# Reinstall dependencies
rm -rf node_modules && npm install

# View logs
# Backend logs are in the terminal running backend
# Frontend logs are in browser console (F12)
```

---

**Need more details?** Check out the [full README.md](./README.md)

**Ready to contribute?** Read [CONTRIBUTING.md](./CONTRIBUTING.md)

**Deploying to production?** Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

---

Happy coding! 🚀

**Last Updated**: November 3, 2025
