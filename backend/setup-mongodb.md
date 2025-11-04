# MongoDB Authentication Setup Guide

## Problem
MongoDB is requiring authentication, but the connection string doesn't have credentials.

## Solution Options

### Option 1: Find Your Existing MongoDB Credentials

If you already have MongoDB credentials, update `/home/mame/lyan-restaurant/backend/.env`:

```env
MONGODB_URI=mongodb://YOUR_USERNAME:YOUR_PASSWORD@localhost:27017/lyan-restaurant?authSource=admin
```

Replace:
- `YOUR_USERNAME` with your MongoDB username
- `YOUR_PASSWORD` with your MongoDB password

### Option 2: Create New MongoDB User

If you need to create a new MongoDB user with admin privileges:

```bash
# Connect to MongoDB as root/admin user (if you have those credentials)
mongosh -u admin -p

# Or if MongoDB is running without auth temporarily:
mongosh

# Then run these commands:
use admin

db.createUser({
  user: "lyanadmin",
  pwd: "SecurePassword123!",  # Change this to a strong password
  roles: [
    { role: "readWrite", db: "lyan-restaurant" },
    { role: "dbAdmin", db: "lyan-restaurant" }
  ]
})
```

Then update your `.env` file:
```env
MONGODB_URI=mongodb://lyanadmin:SecurePassword123!@localhost:27017/lyan-restaurant?authSource=admin
```

### Option 3: Disable MongoDB Authentication (NOT RECOMMENDED FOR PRODUCTION)

**Only for development/testing:**

1. Stop MongoDB:
```bash
sudo systemctl stop mongod
```

2. Edit MongoDB config:
```bash
sudo nano /etc/mongod.conf
```

3. Comment out or remove the security section:
```yaml
#security:
#  authorization: enabled
```

4. Restart MongoDB:
```bash
sudo systemctl start mongod
```

5. Use simple connection string in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/lyan-restaurant
```

### Option 4: Use MongoDB Docker Container (Quick Setup)

If you want a fresh MongoDB instance for development:

```bash
# Stop existing MongoDB
sudo systemctl stop mongod

# Run MongoDB in Docker without authentication
docker run -d -p 27017:27017 --name mongodb-lyan mongo:latest

# Or with authentication:
docker run -d -p 27017:27017 --name mongodb-lyan \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=SecurePass123 \
  mongo:latest
```

Then use:
```env
MONGODB_URI=mongodb://admin:SecurePass123@localhost:27017/lyan-restaurant?authSource=admin
```

## After Updating .env

1. Restart your backend server:
```bash
cd /home/mame/lyan-restaurant/backend
npm run dev
```

2. You should see:
```
Server running on port 5001
MongoDB connected
```

3. Try logging in again with:
   - Email: `admin@lyan.com`
   - Password: `Admin@123456`

## Testing MongoDB Connection

Test your MongoDB connection:
```bash
# If using credentials:
mongosh "mongodb://YOUR_USERNAME:YOUR_PASSWORD@localhost:27017/lyan-restaurant?authSource=admin"

# Without credentials:
mongosh "mongodb://localhost:27017/lyan-restaurant"
```

You should see a MongoDB shell prompt if connection succeeds.
