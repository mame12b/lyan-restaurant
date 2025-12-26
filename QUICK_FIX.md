# Quick Reference - Backend Connection Fix

## 🚨 Problem
Error: "Cannot connect to server. Please check the backend is running..."

## ✅ Quick Fix (30 seconds)

```bash
cd /home/mame/lyan-restaurant
./start.sh
```

## 🔍 Check Status

```bash
docker-compose ps
```

Should show all containers "Up":
- ✓ lyan_loadbalancer
- ✓ lyan-restaurant-backend-1,2,3
- ✓ lyan_mongodb

## 🛠️ Manual Restart

```bash
# Start nginx only
docker-compose up -d nginx

# Or restart everything
docker-compose restart
```

## 🏥 Enable Auto-Monitoring

```bash
# Run health check in background
nohup ./scripts/health-check.sh > health-check.log 2>&1 &

# View logs
tail -f health-check.log
```

## 📖 Full Documentation
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.
