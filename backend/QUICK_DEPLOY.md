# 🚀 Quick Deployment Guide - TL;DR

**For experienced developers who want to deploy quickly.**

## Prerequisites
- Ubuntu VPS: 103.111.154.74 (root/Reach@123_)
- Docker & Nginx installed
- Domain name ready (e.g., api.yourdomain.com)
- **MongoDB Atlas account** with connection string ready

## 1️⃣ Transfer Files to VPS

```bash
# From your local machine
cd "d:\Clients Projects\HashxProject\Hotel_DMC_bidding_platform\backend"
scp -r * root@103.111.154.74:/opt/hotel-bidding-backend/
```

## 2️⃣ Create .env File

```bash
# On VPS
ssh root@103.111.154.74
cd /opt/hotel-bidding-backend
cp .env.production.template .env
nano .env
```

**Fill in:**
- **MongoDB Atlas connection string** (from Atlas dashboard)
- JWT secret: `openssl rand -base64 64`
- PayHere credentials
- Gmail app password
- Cloudinary credentials
- Your domain name

## 3️⃣ Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

## 4️⃣ Setup Domain & SSL

```bash
# Point DNS: api.yourdomain.com → 103.111.154.74

# Update nginx config
nano nginx-config.conf
# Replace 'api.yourdomain.com' with your domain

# Copy to nginx
sudo cp nginx-config.conf /etc/nginx/sites-available/hotel-bidding-api
sudo ln -s /etc/nginx/sites-available/hotel-bidding-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Get SSL
sudo certbot --nginx -d api.yourdomain.com

# Restart
sudo systemctl restart nginx
```

## 5️⃣ Test

```bash
curl https://api.yourdomain.com/api/v1/auth/health
```

## 📋 Environment Variables Checklist

```bash
✅ SPRING_DATA_MONGODB_URI (from MongoDB Atlas)
✅ JWT_SECRET  
✅ PAYHERE_MERCHANT_ID
✅ PAYHERE_MERCHANT_SECRET
✅ SPRING_MAIL_USERNAME
✅ SPRING_MAIL_PASSWORD
✅ CLOUDINARY_CLOUD_NAME
✅ CLOUDINARY_API_KEY
✅ CLOUDINARY_API_SECRET
✅ CORS_ALLOWED_ORIGINS=https://yourdomain.com
✅ APP_FRONTEND_URL=https://yourdomain.com
✅ APP_BACKEND_URL=https://api.yourdomain.com/api/v1
```

## 🔧 Useful Commands

```bash
# View logs
docker logs -f hotel-bidding-backend

# Restart
docker-compose -f docker-compose.prod.yml restart

# Update & redeploy
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🐛 Troubleshooting

**Backend won't start:**
```bash
docker logs hotel-bidding-backend
```

**502 Bad Gateway:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

**MongoDB Atlas connection failed:**
```bash
# Check connection string in .env
# Verify IP whitelist in Atlas: 103.111.154.74
# Test: mongosh "mongodb+srv://user:pass@cluster.mongodb.net/db"
```

---

**Full guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
