# Hotel Bidding Platform - Backend Deployment Guide

## VPS Details
- **IP:** 103.111.154.74
- **User:** root
- **Password:** Reach@123_
- **OS:** Ubuntu with Docker & Nginx installed

---

## 📋 Pre-Deployment Checklist

### 1. Gather All Secrets & Credentials

Before deployment, collect these credentials:

- ✅ **MongoDB Atlas connection string** (from MongoDB Atlas dashboard)
- ✅ **JWT secret** (generate random 256-bit key)
- ✅ **PayHere credentials** (merchant ID & secret from dashboard)
- ✅ **Gmail credentials** (email & app-specific password)
- ✅ **Cloudinary credentials** (cloud name, API key, API secret)
- ✅ **Domain name** (for frontend and backend)

### 2. Generate Strong Secrets

```bash
# Generate JWT secret (run on your local machine)
openssl rand -base64 64
```

### 3. Get MongoDB Atlas Connection String

```bash
# Login to MongoDB Atlas: https://cloud.mongodb.com/
# Go to: Database → Connect → Connect your application
# Copy connection string, it looks like:
# mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hotel_bidding_db
```

---

## 🚀 Deployment Steps

### Step 1: Connect to VPS

```bash
ssh root@103.111.154.74
# Password: Reach@123_
```

### Step 2: Install Required Tools (if not already installed)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker (if not installed)
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Install Nginx (if not installed)
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 3: Create Application Directory

```bash
# Create directory for the application
mkdir -p /opt/hotel-bidding-backend
cd /opt/hotel-bidding-backend
```

### Step 4: Transfer Backend Files to VPS

**From your local machine:**

```bash
# Navigate to your backend directory
cd "d:\Clients Projects\HashxProject\Hotel_DMC_bidding_platform\backend"

# Transfer files using SCP
scp -r * root@103.111.154.74:/opt/hotel-bidding-backend/
scp -r * root@103.140.194.84:/opt/hotel-bidding-backend/

# Or use rsync (recommended)
rsync -avz --exclude 'target' --exclude 'node_modules' --exclude '.git' \
  ./ root@103.111.154.74:/opt/hotel-bidding-backend/
```

**Alternative: Use Git (recommended)**

```bash
# On VPS
cd /opt/hotel-bidding-backend
git clone <your-repository-url> .
```

### Step 5: Create Production .env File

```bash
# On VPS
cd /opt/hotel-bidding-backend

# Copy template
cp .env.production.template .env

# Edit with your actual credentials
nano .env
```

**Fill in these values in .env:**

```bash
# MongoDB Atlas (get from Atlas dashboard)
SPRING_DATA_MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/hotel_bidding_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=<your-generated-jwt-secret>
JWT_ACCESS_TOKEN_EXPIRATION=86400000
JWT_REFRESH_TOKEN_EXPIRATION=604800000

# PayHere (use production credentials)
PAYHERE_MERCHANT_ID=<your-merchant-id>
PAYHERE_MERCHANT_SECRET=<your-merchant-secret>
PAYHERE_CHECKOUT_URL=https://www.payhere.lk/pay/checkout
PAYHERE_API_URL=https://www.payhere.lk/merchant/v1
PAYHERE_CURRENCY=LKR

# Email
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=<your-email@gmail.com>
SPRING_MAIL_PASSWORD=<your-gmail-app-password>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Admin
ADMIN_EMAIL=admin@yourdomain.com

# CORS (replace with your actual domain)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS

# URLs (replace with your actual domain)
APP_FRONTEND_URL=https://yourdomain.com
APP_BACKEND_URL=https://api.yourdomain.com/api/v1
APP_BASE_URL=https://yourdomain.com
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Set Correct Permissions

```bash
# Secure the .env file
chmod 600 .env

# Ensure Docker can read files
chown -R root:root /opt/hotel-bidding-backend
```

### Step 7: Build and Start Docker Containers

```bash
cd /opt/hotel-bidding-backend

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check if containers are running
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

**Expected output:**
```
CONTAINER ID   IMAGE                      STATUS          PORTS
xxxxx          hotel-bidding-backend     Up 2 minutes    0.0.0.0:8081->8081/tcp
```

### Step 8: Test Backend API

```bash
# Test health endpoint
curl http://localhost:8081/api/v1/auth/health

# Expected response: {"status":"UP"}
```

### Step 9: Setup Domain & SSL Certificate

#### A. Point Domain to VPS

Go to your domain registrar and create these DNS records:

```
Type    Name      Value              TTL
A       api       103.111.154.74     3600
```

Wait 5-10 minutes for DNS propagation.

#### B. Configure Nginx

```bash
# Edit nginx config with your domain
cd /opt/hotel-bidding-backend
nano nginx-config.conf

# Replace 'api.yourdomain.com' with your actual domain
# Example: api.hotelbidding.com
```

```bash
# Copy nginx config
sudo cp nginx-config.conf /etc/nginx/sites-available/hotel-bidding-api
sudo ln -s /etc/nginx/sites-available/hotel-bidding-api /etc/nginx/sites-enabled/

# Remove default nginx config
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t
```

#### C. Get SSL Certificate

```bash
# Install SSL certificate using Let's Encrypt
sudo certbot --nginx -d api.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS (option 2)
```

#### D. Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 10: Verify Deployment

```bash
# Test via domain
curl https://api.yourdomain.com/api/v1/auth/health

# Expected: {"status":"UP"}
```

---

## 🔒 Security Best Practices

### 1. Firewall Configuration

```bash
# Install UFW if not installed
sudo apt install ufw -y

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

### 2. Secure MongoDB Atlas

```bash
# MongoDB Atlas is already secure by default
# Ensure these settings in Atlas dashboard:
# 1. Network Access: Add VPS IP (103.111.154.74) to whitelist
# 2. Database Access: Use strong password
# 3. Enable encryption at rest
```

### 3. Regular Security Updates

```bash
# Create update script
cat > /opt/update-system.sh << 'EOF'
#!/bin/bash
apt update
apt upgrade -y
apt autoremove -y
docker image prune -af
EOF

chmod +x /opt/update-system.sh

# Run weekly via cron
crontab -e
# Add: 0 2 * * 0 /opt/update-system.sh
```

### 4. Setup Automated Backups

```bash
# MongoDB Atlas provides automatic backups
# Enable in Atlas Dashboard:
# 1. Go to Backup tab
# 2. Enable Cloud Backups
# 3. Configure retention policy (recommended: 7 days)
# 4. Backups are handled automatically by Atlas
```

---

## 📊 Monitoring & Logs

### View Application Logs

```bash
# Backend logs
docker logs -f hotel-bidding-backend

# MongoDB Atlas logs
# View in Atlas Dashboard → Database → Metrics

# Nginx logs
sudo tail -f /var/log/nginx/hotel-bidding-api-access.log
sudo tail -f /var/log/nginx/hotel-bidding-api-error.log
```

### Monitor Resources

```bash
# Check disk space
df -h

# Check memory
free -h

# Check Docker stats
docker stats
```

---

## 🔄 Update & Redeploy

```bash
# Pull latest code
cd /opt/hotel-bidding-backend
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check logs
docker logs hotel-bidding-backend

# Common issues:
# 1. Environment variables not set - check .env file
# 2. MongoDB connection failed - check MongoDB is running
# 3. Port already in use - check: sudo netstat -tulpn | grep 8081
```

### MongoDB Atlas connection error

```bash
# Check connection string format in .env
# Should be: mongodb+srv://username:password@cluster.mongodb.net/database

# Verify Atlas network access:
# 1. Login to MongoDB Atlas
# 2. Network Access → IP Whitelist
# 3. Add VPS IP: 103.111.154.74

# Test connection from VPS
apt install -y mongodb-mongosh
mongosh "mongodb+srv://username:password@cluster.mongodb.net/hotel_bidding_db"
```

### Nginx 502 Bad Gateway

```bash
# Check backend is running
curl http://localhost:8081/api/v1/auth/health

# Check nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 📝 Important Notes

1. **Never commit .env file** - Add to `.gitignore`
2. **Change default passwords** immediately after deployment
3. **Use production PayHere credentials** for live payments
4. **Setup monitoring** (Uptime Robot, New Relic, etc.)
5. **Enable automatic SSL renewal** - certbot handles this automatically
6. **Regular backups** - Both MongoDB data and uploaded files
7. **Monitor logs** regularly for security issues

---

## 🆘 Emergency Contacts

- **VPS Provider Support:** [Contact info]
- **PayHere Support:** https://www.payhere.lk/support
- **Developer:** [Your contact]

---

## ✅ Post-Deployment Checklist

- [ ] MongoDB Atlas connection string configured
- [ ] VPS IP (103.111.154.74) added to Atlas whitelist
- [ ] All environment variables set correctly
- [ ] Backend accessible via domain
- [ ] SSL certificate installed and working
- [ ] Firewall configured
- [ ] MongoDB Atlas backups enabled
- [ ] PayHere webhooks working
- [ ] Email notifications working
- [ ] Frontend can connect to backend
- [ ] Payment flow tested end-to-end
- [ ] Admin login working
- [ ] File uploads working (Cloudinary)

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Backend Version:** _____________
