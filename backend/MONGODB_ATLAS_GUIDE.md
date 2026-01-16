# MongoDB Atlas Setup Guide

This project uses **MongoDB Atlas** (cloud-hosted MongoDB) instead of a local MongoDB instance.

## 🚀 Quick Setup

### 1. Access MongoDB Atlas

Your MongoDB is already hosted on Atlas. Get your connection details:

**Database:** `hotel_bidding_db`
**Existing Connection String:** Check your current `application.properties` or ask your database admin

### 2. Get Connection String

```bash
# Login to MongoDB Atlas
https://cloud.mongodb.com/

# Navigate to:
Database → Connect → Connect your application

# Copy connection string (looks like):
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hotel_bidding_db?retryWrites=true&w=majority
```

### 3. Add VPS IP to Whitelist

**IMPORTANT:** Your VPS needs network access to MongoDB Atlas.

```bash
# In MongoDB Atlas Dashboard:
1. Go to: Network Access (left sidebar)
2. Click: "+ ADD IP ADDRESS"
3. Enter VPS IP: 103.111.154.74
4. Description: "Production VPS"
5. Click: "Confirm"
```

### 4. Verify Database User

```bash
# In MongoDB Atlas Dashboard:
1. Go to: Database Access (left sidebar)
2. Verify user exists with:
   - Username: (your username)
   - Password: (your password)
   - Database: hotel_bidding_db
   - Role: Read and write to any database
```

### 5. Update .env File

```bash
# On VPS, edit .env file:
SPRING_DATA_MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/hotel_bidding_db?retryWrites=true&w=majority
```

**Replace:**
- `your-username` - Atlas database username
- `your-password` - Atlas database password  
- `cluster0.xxxxx` - Your actual cluster URL

---

## 🔒 Security Checklist

- ✅ **Strong password** for database user (min 12 characters)
- ✅ **IP Whitelist** configured (only VPS IP: 103.111.154.74)
- ✅ **Connection string** in .env file (not in code)
- ✅ **Encryption at rest** enabled in Atlas
- ✅ **Encryption in transit** (TLS/SSL) enabled by default

---

## 📊 Monitoring & Backups

### View Database Metrics

```bash
# MongoDB Atlas Dashboard
1. Go to: Database → Cluster → Metrics
2. Monitor:
   - Connection count
   - Operations per second
   - Disk usage
   - Network traffic
```

### Enable Automatic Backups

```bash
# MongoDB Atlas Dashboard
1. Go to: Backup tab
2. Click: "Turn On Cloud Provider Snapshots"
3. Configure:
   - Snapshot frequency: Daily
   - Retention: 7 days (or more)
4. Backups are handled automatically by Atlas
```

### Manual Backup (if needed)

```bash
# Install MongoDB tools on VPS
apt install -y mongodb-mongosh mongodb-database-tools

# Create backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/hotel_bidding_db" \
  --out=/opt/backups/mongodb/$(date +%Y%m%d)

# Restore backup (if needed)
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/" \
  /opt/backups/mongodb/20260112/hotel_bidding_db
```

---

## 🧪 Test Connection

### From VPS

```bash
# Install MongoDB Shell
apt install -y mongodb-mongosh

# Test connection
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hotel_bidding_db"

# If successful, you'll see:
# Atlas atlas-xxxxx-shard-0 [primary] hotel_bidding_db>
```

### From Application

```bash
# Check backend logs for connection
docker logs hotel-bidding-backend | grep -i mongodb

# Should see:
# "Successfully connected to MongoDB Atlas"
# "MongoDB connection established"
```

---

## 🐛 Troubleshooting

### Connection Timeout

```bash
# Problem: "MongoSocketOpenException: Timeout while connecting"
# Solution:
1. Check IP whitelist includes VPS IP: 103.111.154.74
2. Verify firewall allows outbound connections on port 27017
3. Test DNS resolution: nslookup cluster0.xxxxx.mongodb.net
```

### Authentication Failed

```bash
# Problem: "Authentication failed"
# Solution:
1. Verify username/password in .env
2. Check user has correct permissions in Atlas
3. Ensure password is URL-encoded (replace @ with %40, etc.)
```

### Network Access Denied

```bash
# Problem: "Network access denied"
# Solution:
1. Add VPS IP to Atlas whitelist
2. Or temporarily allow access from anywhere (0.0.0.0/0) for testing
3. Check Atlas network access settings
```

### Connection String Format

```bash
# CORRECT formats:
mongodb+srv://username:password@cluster.mongodb.net/database
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# INCORRECT (missing srv+):
mongodb://username:password@cluster.mongodb.net/database

# INCORRECT (old format for self-hosted):
mongodb://username:password@localhost:27017/database
```

---

## 📋 Current Database Info

Based on your existing configuration:

```bash
# Database User (from application.properties comment):
Username: udayangap996_db_user
# Note: Verify this in MongoDB Atlas Dashboard

# Database Name:
hotel_bidding_db

# Collections (auto-created by Spring):
- users
- subscriptions
- payment_history
- hotel_profiles
- dmc_profiles
- bids
- inquiries
- notifications
```

---

## 🔄 Migration Notes

Since you're already using MongoDB Atlas:

1. **No migration needed** - Database is already in cloud
2. **Just update .env** with correct connection string
3. **Add VPS IP** to Atlas whitelist
4. **Test connection** before deploying

---

## 💡 Best Practices

1. **Use environment-specific databases:**
   - Development: `hotel_bidding_dev`
   - Production: `hotel_bidding_db`

2. **Monitor usage:**
   - Check Atlas dashboard regularly
   - Set up alerts for high connections
   - Monitor storage usage

3. **Performance optimization:**
   - Create indexes for frequently queried fields
   - Enable connection pooling (already configured in Spring)
   - Use projection to fetch only needed fields

4. **Security:**
   - Rotate database passwords quarterly
   - Use strong passwords (16+ chars)
   - Keep IP whitelist restrictive
   - Enable audit logging in Atlas

---

## 📞 Support

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **MongoDB Support:** https://support.mongodb.com/
- **Spring Data MongoDB:** https://docs.spring.io/spring-data/mongodb/

---

**Connection String Template for .env:**

```bash
SPRING_DATA_MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER-URL]/hotel_bidding_db?retryWrites=true&w=majority
```

Replace `[USERNAME]`, `[PASSWORD]`, and `[CLUSTER-URL]` with your actual values.
