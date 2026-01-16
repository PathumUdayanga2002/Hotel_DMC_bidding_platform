#!/bin/bash

# Hotel Bidding Backend - Quick Deployment Script
# Run this script on your VPS

set -e  # Exit on error

echo "======================================"
echo "Hotel Bidding Backend Deployment"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Set application directory
APP_DIR="/opt/hotel-bidding-backend"

echo -e "${GREEN}Step 1: Creating application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

echo -e "${GREEN}Step 2: Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    apt update
    apt install -y docker.io docker-compose
    systemctl start docker
    systemctl enable docker
else
    echo -e "${GREEN}✓ Docker is installed${NC}"
fi

echo -e "${GREEN}Step 3: Checking Nginx installation...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Nginx not found. Installing Nginx...${NC}"
    apt install -y nginx certbot python3-certbot-nginx
    systemctl enable nginx
else
    echo -e "${GREEN}✓ Nginx is installed${NC}"
fi

echo -e "${GREEN}Step 4: Checking .env file...${NC}"
if [ ! -f "$APP_DIR/.env" ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    echo "Please create .env file from .env.production.template"
    echo "Run: cp .env.production.template .env && nano .env"
    exit 1
else
    echo -e "${GREEN}✓ .env file exists${NC}"
    # Secure .env file
    chmod 600 .env
fi

echo -e "${GREEN}Step 5: Setting up firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "y" | ufw enable
    echo -e "${GREEN}✓ Firewall configured${NC}"
else
    echo -e "${YELLOW}! UFW not installed, skipping firewall setup${NC}"
fi

echo -e "${GREEN}Step 6: Building Docker containers...${NC}"
# Note: MongoDB is hosted on MongoDB Atlas (cloud)
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
echo -e "${GREEN}✓ Build complete${NC}"

echo -e "${GREEN}Step 7: Starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✓ Containers started${NC}"

echo ""
echo -e "${GREEN}Step 8: Waiting for backend to start...${NC}"
sleep 10

# Check if backend is running
if curl -f http://localhost:8081/api/v1/auth/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running!${NC}"
else
    echo -e "${RED}✗ Backend is not responding${NC}"
    echo "Check logs: docker logs hotel-bidding-backend"
fi

echo ""
echo "======================================"
echo -e "${GREEN}Deployment Status${NC}"
echo "======================================"

# Show container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "======================================"
echo -e "${YELLOW}Next Steps:${NC}"
echo "======================================"
echo "1. Setup domain DNS: Point api.yourdomain.com to 103.111.154.74"
echo "2. Configure Nginx: Edit nginx-config.conf with your domain"
echo "3. Setup SSL: sudo certbot --nginx -d api.yourdomain.com"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View logs: docker logs -f hotel-bidding-backend"
echo "  Restart: docker-compose -f docker-compose.prod.yml restart"
echo "  Stop: docker-compose -f docker-compose.prod.yml down"
echo ""
echo -e "${GREEN}Deployment complete!${NC}"
