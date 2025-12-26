#!/bin/bash

# Health Check Script for LYAN Restaurant Services
# This script monitors the health of all services and restarts them if needed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NGINX_URL="http://localhost:8888/health"
API_URL="http://localhost:8888/api/packages"
MAX_FAILURES=3
FAILURE_COUNT=0

echo "========================================="
echo "LYAN Restaurant Health Check"
echo "========================================="
echo ""

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    
    echo -n "Checking ${service_name}... "
    
    if curl -s --max-time 5 "${url}" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed${NC}"
        return 1
    fi
}

# Function to restart services
restart_services() {
    echo ""
    echo -e "${YELLOW}Restarting services...${NC}"
    cd /home/mame/lyan-restaurant
    docker-compose up -d
    echo -e "${GREEN}Services restarted${NC}"
    echo ""
    
    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 10
}

# Function to check docker containers
check_containers() {
    echo -n "Checking Docker containers... "
    
    # Check if all required containers are running
    local nginx_status=$(docker ps --filter "name=lyan_loadbalancer" --format "{{.Status}}" 2>/dev/null || echo "not running")
    local backend_count=$(docker ps --filter "name=lyan-restaurant-backend" --format "{{.Names}}" | wc -l)
    
    if [[ $nginx_status == *"Up"* ]] && [[ $backend_count -ge 1 ]]; then
        echo -e "${GREEN}✓ All containers running${NC}"
        return 0
    else
        echo -e "${RED}✗ Some containers are down${NC}"
        echo "  - Nginx: ${nginx_status}"
        echo "  - Backend replicas: ${backend_count}"
        return 1
    fi
}

# Main health check loop
while true; do
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Running health check..."
    
    # Check if containers are running
    if ! check_containers; then
        restart_services
        continue
    fi
    
    # Check Nginx/Load Balancer
    if ! check_service "Nginx Load Balancer" "${NGINX_URL}"; then
        ((FAILURE_COUNT++))
    fi
    
    # Check API
    if ! check_service "Backend API" "${API_URL}"; then
        ((FAILURE_COUNT++))
    fi
    
    # If too many failures, restart services
    if [ $FAILURE_COUNT -ge $MAX_FAILURES ]; then
        echo -e "${RED}Too many failures detected (${FAILURE_COUNT}/${MAX_FAILURES})${NC}"
        restart_services
        FAILURE_COUNT=0
    else
        if [ $FAILURE_COUNT -eq 0 ]; then
            echo -e "${GREEN}All services healthy!${NC}"
        fi
    fi
    
    echo ""
    echo "Next check in 60 seconds..."
    echo "========================================="
    echo ""
    
    # Wait before next check
    sleep 60
done
