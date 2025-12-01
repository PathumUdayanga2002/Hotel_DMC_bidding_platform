# 🚀 Quick Start Guide

## Prerequisites
- Java 17+
- Node.js 18+
- MongoDB 6.0+
- Maven 3.8+

---

## 1️⃣ MongoDB Setup

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
# Windows: net start MongoDB
# Mac/Linux: mongod --config /usr/local/etc/mongod.conf
```

### Option B: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `backend/src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/hotel_bidding_db
```

---

## 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
mvnw clean install

# Update application.properties with your settings:
# - MongoDB URI
# - Email SMTP credentials
# - JWT secret

# Run backend
mvnw spring-boot:run
```

**Backend will run on:** http://localhost:8080  
**Swagger UI:** http://localhost:8080/api/v1/swagger-ui.html

---

## 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env

# Run frontend
npm run dev
```

**Frontend will run on:** http://localhost:5173

---

## 4️⃣ Email Configuration

### For Gmail:
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Update `application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password
```

### For SendGrid:
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=your-sendgrid-api-key
```

---

## 5️⃣ Stripe Setup (Optional - for testing payments later)

1. Create account: https://dashboard.stripe.com/register
2. Get test keys: https://dashboard.stripe.com/test/apikeys
3. Update `application.properties`:
```properties
stripe.api.key=sk_test_your_secret_key
```
4. Update frontend `.env`:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key
```

---

## 6️⃣ Verify Installation

### Backend Health Check
```bash
curl http://localhost:8080/api/v1/actuator/health
```

### Frontend Access
Open browser: http://localhost:5173

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string format
- Verify network access (for Atlas)

### Port Already in Use
```bash
# Backend (8080)
# Windows: netstat -ano | findstr :8080
# Mac/Linux: lsof -i :8080

# Frontend (5173)
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -i :5173
```

### Maven Build Fails
```bash
# Clear cache and rebuild
mvnw clean
mvnw install -U
```

### npm Install Fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. ✅ Complete Phase 1 authentication setup
2. ✅ Test user registration flow
3. ✅ Move to Phase 2: Hotel Management
4. ✅ Refer to `IMPLEMENTATION_PLAN.md` for detailed roadmap

---

## 🆘 Getting Help

- **Documentation:** See `README.md`
- **Implementation Plan:** See `IMPLEMENTATION_PLAN.md`
- **Progress Tracker:** See `PHASE1_PROGRESS.md`

---

**Happy Coding! 🎉**
