# Service Management Scripts

This directory contains utility scripts for managing the LYAN Restaurant application.

## Available Scripts

### 🚀 start.sh
Quick start script that ensures all services are running properly.

**Usage:**
```bash
./start.sh
```

**What it does:**
- Stops any existing containers
- Starts all services (MongoDB, Backend, Frontend, Nginx)
- Displays service status
- Shows access URLs

---

### 🏥 health-check.sh
Continuous health monitoring script that checks services every minute and auto-restarts them if needed.

**Usage:**
```bash
# Run in foreground (press Ctrl+C to stop)
./scripts/health-check.sh

# Run in background
nohup ./scripts/health-check.sh > health-check.log 2>&1 &
```

**What it does:**
- Checks if Docker containers are running
- Tests Nginx load balancer health
- Tests Backend API availability
- Auto-restarts services if failures are detected
- Logs all health check results

**Configuration:**
- Check interval: 60 seconds
- Max failures before restart: 3
- Timeout per check: 5 seconds

---

## Common Issues and Solutions

### Issue: Backend connection errors

**Symptoms:**
- "Cannot connect to server" error in browser
- API requests failing
- Empty package list

**Solutions:**

1. **Quick Fix - Restart all services:**
   ```bash
   ./start.sh
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **Check logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f nginx
   docker-compose logs -f backend
   ```

4. **Ensure containers restart on failure:**
   - The `docker-compose.yml` now has `restart: always` for all services
   - Services will automatically restart if they crash

5. **Run continuous health monitoring:**
   ```bash
   ./scripts/health-check.sh
   ```

---

### Issue: Nginx not running

**Solution:**
```bash
docker-compose up -d nginx
```

---

### Issue: Backend replicas not running

**Solution:**
```bash
docker-compose up -d --scale backend=3
```

---

## Automated Startup on System Boot

To ensure services start automatically when your system boots:

### Linux (systemd)

1. Create a systemd service file:
```bash
sudo nano /etc/systemd/system/lyan-restaurant.service
```

2. Add the following content:
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

3. Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable lyan-restaurant.service
sudo systemctl start lyan-restaurant.service
```

4. Check status:
```bash
sudo systemctl status lyan-restaurant.service
```

---

## Monitoring Commands

### Check all containers
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart a specific service
```bash
docker-compose restart nginx
docker-compose restart backend
```

### Rebuild and restart after code changes
```bash
docker-compose up -d --build
```

---

## Environment Variables

Make sure these are set in your frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:8888/api
```

---

## Troubleshooting

### Port already in use
```bash
# Find what's using port 8888
sudo lsof -i :8888

# Kill the process
sudo kill -9 <PID>
```

### Clean restart (removes all data)
```bash
docker-compose down -v
docker-compose up -d
```

### Check container health
```bash
docker inspect lyan_loadbalancer | grep -A 10 Health
```

---

## Support

For issues or questions, check:
- Main README.md
- Docker logs: `docker-compose logs`
- Health check logs: `cat health-check.log`
