# Troubleshooting Guide - LYAN Restaurant

This guide provides solutions to common issues you might encounter.

---

## 🚨 Most Common Issue: "Cannot Connect to Server" Error

### Symptoms
- Error message: "Cannot connect to server. Please check the backend is running..."
- Empty package list
- API requests failing
- Red notification in the top-right corner

### Root Cause
The Nginx load balancer container has stopped running, preventing the frontend from accessing the backend API.

---

## ✅ Permanent Fix

### Quick Fix (Recommended)
```bash
# From project root directory
./start.sh
```

This script will:
- Stop any existing containers
- Start all services fresh
- Display service status
- Show access URLs

---

### Manual Fix

**1. Check container status:**
```bash
docker-compose ps
```

**2. If nginx is not running:**
```bash
docker-compose up -d nginx
```

**3. If backend is not running:**
```bash
docker-compose up -d backend
```

**4. Restart all services:**
```bash
docker-compose restart
```

**5. Verify services are running:**
```bash
docker-compose ps
```

You should see:
- `lyan_loadbalancer` - Up
- `lyan-restaurant-backend-1` - Up
- `lyan-restaurant-backend-2` - Up
- `lyan-restaurant-backend-3` - Up
- `lyan_mongodb` - Up

---

## 🛡️ Permanent Solutions

### 1. Auto-Restart Configuration

The `docker-compose.yml` has been updated with `restart: always` for all services. This means:
- Services automatically restart if they crash
- Services start automatically when your computer boots
- No manual intervention needed

### 2. Health Monitoring Script

Run the health monitoring script to automatically detect and fix issues:

```bash
# Run in background
nohup ./scripts/health-check.sh > health-check.log 2>&1 &

# Check if it's running
ps aux | grep health-check

# View live logs
tail -f health-check.log

# Stop the script
pkill -f health-check.sh
```

**What it does:**
- Checks service health every 60 seconds
- Tests Nginx and API availability
- Automatically restarts services if they fail
- Logs all activities for debugging

### 3. Frontend Auto-Retry

The frontend now automatically:
- Retries failed API requests 3 times
- Uses exponential backoff (1s, 2s, 3s delays)
- Shows user-friendly error messages
- Handles network timeouts gracefully

### 4. System Startup Auto-Start (Linux)

Make services start automatically when your computer boots:

**Create systemd service:**
```bash
sudo nano /etc/systemd/system/lyan-restaurant.service
```

**Add this content:**
```ini
[Unit]
Description=LYAN Restaurant Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/mame/lyan-restaurant
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
User=mame

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable lyan-restaurant.service
sudo systemctl start lyan-restaurant.service
```

**Check status:**
```bash
sudo systemctl status lyan-restaurant.service
```

---

## 🔍 Diagnostic Commands

### Check Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Last 50 lines:**
```bash
docker-compose logs --tail=50 nginx
```

### Test API Directly

```bash
# Test load balancer
curl http://localhost:8888/health

# Test API endpoint
curl http://localhost:8888/api/packages

# Detailed test
curl -v http://localhost:8888/api/packages
```

### Check Container Health

```bash
# List running containers
docker ps

# Inspect health status
docker inspect lyan_loadbalancer | grep -A 10 Health

# Check container resource usage
docker stats
```

---

## 🐛 Other Common Issues

### Issue: Port Already in Use

**Error:** `Bind for 0.0.0.0:8888 failed: port is already allocated`

**Solution:**
```bash
# Find what's using port 8888
sudo lsof -i :8888

# Kill the process (replace PID with actual process ID)
sudo kill -9 <PID>

# Or use a different port in docker-compose.yml
ports:
  - "9999:80"  # Change 8888 to 9999
```

---

### Issue: MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**
```bash
# Check MongoDB status
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Verify MongoDB is accessible
docker exec -it lyan_mongodb mongosh --eval "db.runCommand({ping:1})"
```

---

### Issue: Frontend Build Errors

**Error:** `Module not found` or compilation errors

**Solution:**
```bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build

# Rebuild
npm run build
```

---

### Issue: Docker Daemon Not Running

**Error:** `Cannot connect to the Docker daemon`

**Solution:**
```bash
# Start Docker service (Linux)
sudo systemctl start docker
sudo systemctl enable docker

# Check Docker status
sudo systemctl status docker
```

---

### Issue: Out of Disk Space

**Error:** `no space left on device`

**Solution:**
```bash
# Remove unused Docker resources
docker system prune -a

# Remove old images
docker image prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df
```

---

### Issue: CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**

1. Check backend CORS configuration in `backend/config/origins.js`
2. Ensure frontend URL is in allowed origins
3. Verify `REACT_APP_API_URL` in frontend `.env`
4. Restart backend: `docker-compose restart backend`

---

### Issue: Authentication Errors

**Error:** `401 Unauthorized` or `Token expired`

**Solution:**
```bash
# Clear browser localStorage
# In browser console:
localStorage.clear()

# Or logout and login again
```

---

## 📊 Health Check Checklist

Run through this checklist to verify everything is working:

- [ ] All containers running: `docker-compose ps`
- [ ] Nginx responding: `curl http://localhost:8888/health`
- [ ] API responding: `curl http://localhost:8888/api/packages`
- [ ] Frontend loads: Open `http://localhost:8888` in browser
- [ ] Packages display: Navigate to `/packages` page
- [ ] Login works: Try logging in
- [ ] No console errors: Check browser console (F12)

---

## 🆘 Still Having Issues?

If none of the above solutions work:

1. **Collect diagnostic information:**
   ```bash
   # Create a diagnostic report
   docker-compose ps > diagnostic.txt
   docker-compose logs --tail=100 >> diagnostic.txt
   docker system df >> diagnostic.txt
   cat frontend/.env >> diagnostic.txt
   ```

2. **Clean restart:**
   ```bash
   # Stop everything
   docker-compose down
   
   # Remove volumes (WARNING: This deletes data!)
   docker-compose down -v
   
   # Rebuild and start fresh
   docker-compose up -d --build
   ```

3. **Check documentation:**
   - Main README: [README.md](README.md)
   - Scripts documentation: [scripts/README.md](scripts/README.md)
   - API documentation: [API.md](API.md)

4. **Get help:**
   - Create an issue on GitHub with your diagnostic report
   - Include screenshots of errors
   - Describe steps to reproduce the problem

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Last Updated:** December 26, 2025
