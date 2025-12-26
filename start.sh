#!/bin/bash

# Quick Start Script for LYAN Restaurant
# This script ensures all services are running properly

set -e

cd /home/mame/lyan-restaurant

echo "========================================="
echo "Starting LYAN Restaurant Services"
echo "========================================="
echo ""

# Stop any existing containers
echo "Stopping any existing containers..."
docker-compose down 2>/dev/null || true

# Start all services
echo "Starting all services..."
docker-compose up -d

# Wait for services to initialize
echo ""
echo "Waiting for services to initialize..."
sleep 5

# Check service status
echo ""
echo "Service Status:"
echo "----------------------------------------"
docker-compose ps

echo ""
echo "========================================="
echo "✓ All services started!"
echo "========================================="
echo ""
echo "Access your application at:"
echo "  Frontend: http://localhost:8888"
echo "  API:      http://localhost:8888/api"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
