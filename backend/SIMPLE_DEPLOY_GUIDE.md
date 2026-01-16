# Backend Deployment Guide - VPS with Docker + Nginx

## 🎯 Simple 3-Step Deployment

### Prerequisites
- VPS: 103.111.154.74 (root/Reach@123_)
- Docker installed
- Nginx installed
- MongoDB Atlas connection string ready

---

## Step 1: Deploy Backend with Docker

### 1.1 Connect to VPS

```bash
ssh root@103.111.154.74
# Password: Reach@123_
```

### 1.2 Create Application Directory

```bash
mkdir -p /opt/hotel-backend
cd /opt/hotel-backend
```

### 1.3 Transfer Your Backend Files

**Option A: Using Git (Recommended)**
```bash
cd /opt/hotel-backend
git clone <your-repo-url> .
```

**Option B: Using SCP from your local machine**
```bash
# Run this on your Windows machine
cd "d:\Clients Projects\HashxProject\Hotel_DMC_bidding_platform\backend"
scp -r * root@103.111.154.74:/opt/hotel-backend/
```

### 1.4 Create .env File

```bash
cd /opt/hotel-backend
nano .env
```

**Paste this and fill your values:**

```bash
# Server
SERVER_PORT=8081
CONTEXT_PATH=/api/v1

# MongoDB Atlas
SPRING_DATA_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel_bidding_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-jwt-secret-here-use-openssl-rand-base64-64
JWT_ACCESS_TOKEN_EXPIRATION=86400000
JWT_REFRESH_TOKEN_EXPIRATION=604800000

# PayHere
PAYHERE_MERCHANT_ID=1230399
PAYHERE_MERCHANT_SECRET=140246618834262519621224412597325013147
PAYHERE_CHECKOUT_URL=https://www.payhere.lk/pay/checkout
PAYHERE_API_URL=https://www.payhere.lk/merchant/v1
PAYHERE_CURRENCY=LKR

# Email
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# File Upload
SPRING_SERVLET_MULTIPART_ENABLED=true
SPRING_SERVLET_MULTIPART_MAX-FILE-SIZE=10MB
SPRING_SERVLET_MULTIPART_MAX-REQUEST-SIZE=10MB
FILE_UPLOAD_DIR=/app/uploads

# Admin
ADMIN_EMAIL=admin@yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS

# URLs
APP_FRONTEND_URL=https://yourdomain.com
APP_BACKEND_URL=https:// rezpitch-system.hashx.live/api/v1
APP_BASE_URL=https://yourdomain.com
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### 1.5 Build and Run Docker Container

```bash
# Build the image
docker build -t hotel-backend .

# Run the container
docker run -d --name hotel-backend --restart unless-stopped -p 8081:8081 --env-file .env hotel-backend

# Check if running
docker ps

# View logs
docker logs -f hotel-backend
```

### 1.6 Test Backend

```bash
# Test health endpoint
curl http://localhost:8081/api/v1/auth/health

# Should return: {"status":"UP"} or similar
```

✅ **Backend is now running on port 8081!**

---

## Step 2: Configure Nginx Reverse Proxy

### 2.1 Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/hotel-backend
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name rezpitch-system.hashx.live;  # Change to your domain

    # For testing without domain, you can use IP:
    # server_name 103.111.154.74;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/hotel-backend-access.log;
    error_log /var/log/nginx/hotel-backend-error.log;

    # Max upload size
    client_max_body_size 10M;

    # Proxy to backend
    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### 2.2 Enable the Configuration

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/hotel-backend /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Should show: "syntax is ok" and "test is successful"
```

### 2.3 Restart Nginx

```bash
systemctl restart nginx
systemctl status nginx
```

### 2.4 Configure Firewall

```bash
# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp  # Keep SSH open!

# Enable firewall
ufw enable
ufw status
```

### 2.5 Test via Nginx

```bash
# Test via IP (if no domain yet)
curl http://103.111.154.74/api/v1/auth/health

# Test via domain (if configured)
curl http://rezpitch-system.hashx.live/api/v1/auth/health
```

✅ **Backend is now accessible through Nginx!**

---

## Step 3: Setup SSL (Optional but Recommended)

### 3.1 Prerequisites
- Domain name pointing to VPS IP (103.111.154.74)
- DNS A record: ` rezpitch-system.hashx.live` → `103.111.154.74`

### 3.2 Install Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### 3.3 Get SSL Certificate

```bash
# Replace with your domain
certbot --nginx -d rezpitch-system.hashx.live

# Follow prompts:
# 1. Enter email
# 2. Agree to terms (Y)
# 3. Choose: Redirect HTTP to HTTPS (option 2)
```

### 3.4 Test HTTPS

```bash
curl https:// rezpitch-system.hashx.live/api/v1/auth/health
```

### 3.5 Auto-Renewal Setup

```bash
# Certbot auto-renewal is configured automatically
# Test renewal process:
certbot renew --dry-run
```

✅ **SSL is now configured!**

---

## 🔧 Useful Commands

### Docker Commands

```bash
# View logs
docker logs -f hotel-backend

# Restart container
docker restart hotel-backend

# Stop container
docker stop hotel-backend

# Remove container
docker rm hotel-backend

# Rebuild and restart
docker stop hotel-backend
docker rm hotel-backend
docker build -t hotel-backend .
docker run -d --name hotel-backend --restart unless-stopped -p 8081:8081 --env-file .env hotel-backend
```

### Nginx Commands

```bash
# Test configuration
nginx -t

# Reload configuration
nginx -s reload

# Restart Nginx
systemctl restart nginx

# View logs
tail -f /var/log/nginx/hotel-backend-access.log
tail -f /var/log/nginx/hotel-backend-error.log
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory
free -h

# Check running containers
docker ps

# Check Docker resource usage
docker stats hotel-backend
```

---

## 🐛 Troubleshooting

### Backend not starting

```bash
# Check logs
docker logs hotel-backend

# Common issues:
# - Wrong MongoDB connection string
# - Missing environment variables
# - Port 8081 already in use
```

### Nginx 502 Bad Gateway

```bash
# Check backend is running
docker ps
curl http://localhost:8081/api/v1/auth/health

# Check Nginx configuration
nginx -t

# Check logs
tail -f /var/log/nginx/hotel-backend-error.log
```

### Cannot connect to MongoDB Atlas

```bash
# 1. Check connection string in .env
cat .env | grep MONGODB_URI

# 2. Add VPS IP to MongoDB Atlas whitelist
# Login to: https://cloud.mongodb.com
# Network Access → Add IP: 103.111.154.74

# 3. Test connection
apt install mongodb-mongosh -y
mongosh "your-connection-string"
```

### Port 8081 already in use

```bash
# Find process using port
netstat -tulpn | grep 8081

# Kill process
kill -9 <PID>
```

---

## 🔄 Update & Redeploy

When you make code changes:

```bash
# 1. Pull latest code
cd /opt/hotel-backend
git pull

# 2. Rebuild and restart
docker stop hotel-backend
docker rm hotel-backend
docker build -t hotel-backend .
docker run -d --name hotel-backend --restart unless-stopped -p 8081:8081 --env-file .env hotel-backend

# 3. Check logs
docker logs -f hotel-backend
```

---

## 📋 Quick Checklist

**Before deployment:**
- [ ] MongoDB Atlas connection string ready
- [ ] VPS IP added to MongoDB Atlas whitelist
- [ ] All credentials collected (PayHere, Gmail, Cloudinary)
- [ ] Domain DNS configured (if using domain)

**After deployment:**
- [ ] Backend container running: `docker ps`
- [ ] Health check works: `curl http://localhost:8081/api/v1/auth/health`
- [ ] Nginx proxy works: `curl http://103.111.154.74/api/v1/auth/health`
- [ ] SSL configured (if using domain)
- [ ] Firewall enabled: `ufw status`

---

## 🎉 You're Done!

Your backend is now:
- ✅ Running in Docker container
- ✅ Behind Nginx reverse proxy
- ✅ Accessible via domain (with SSL)
- ✅ Auto-restart on server reboot

**Access your API at:**
- Without SSL: `http:// rezpitch-system.hashx.live/api/v1/`
- With SSL: `https:// rezpitch-system.hashx.live/api/v1/`
- Test endpoint: `https:// rezpitch-system.hashx.live/api/v1/auth/health`
