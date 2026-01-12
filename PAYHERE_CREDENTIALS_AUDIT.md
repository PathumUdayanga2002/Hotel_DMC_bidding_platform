# Hardcoded PayHere Credentials Audit

**Date:** January 10, 2026  
**Status:** ⚠️ CREDENTIALS FOUND - SECURITY REVIEW NEEDED

---

## 🔴 Critical Findings

### 1. Backend Configuration File
**File:** `backend/src/main/resources/application.properties`  
**Lines:** 77-81

```properties
# PayHere Payment Gateway Configuration
payhere.merchant.id=1230399
payhere.merchant.secret=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU
payhere.checkout.url=https://sandbox.payhere.lk/pay/checkout
payhere.api.url=https://sandbox.payhere.lk/merchant/v1
payhere.currency=LKR
```

**Issue:** ❌ Merchant ID and Secret are hardcoded in properties file  
**Risk Level:** 🔴 HIGH (if committed to Git)  
**Environment:** Sandbox (test credentials)

---

### 2. Docker Compose Configuration
**File:** `backend/docker-compose.yml`  
**Lines:** 71-75

```yaml
# PayHere Payment Gateway
- PAYHERE_MERCHANT_ID=1230399
- PAYHERE_MERCHANT_SECRET=MTUxMTE5NjM4OTMxNDc2MzkyMDAyMzUwNjE2NzYyMTI0OTIwMzMyMg==
- PAYHERE_CHECKOUT_URL=https://sandbox.payhere.lk/pay/checkout
- PAYHERE_API_URL=https://sandbox.payhere.lk/merchant/v1
- PAYHERE_CURRENCY=LKR
```

**Issue:** ❌ Different merchant secret than application.properties!  
**Risk Level:** 🔴 HIGH  
**Note:** This secret is DIFFERENT from the one in application.properties

---

## ✅ Frontend Check

**Status:** ✅ SECURE - No hardcoded credentials found

The frontend (`SubscriptionPurchase.jsx`) only:
- Validates payment data structure
- Receives credentials from backend API
- Does NOT contain any hardcoded merchant IDs or secrets

---

## 🔍 Detailed Analysis

### Hardcoded Credentials Locations

| Location | Merchant ID | Merchant Secret | Environment |
|----------|-------------|-----------------|-------------|
| `application.properties` | `1230399` | `NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU` | Sandbox |
| `docker-compose.yml` | `1230399` | `MTUxMTE5NjM4OTMxNDc2MzkyMDAyMzUwNjE2NzYyMTI0OTIwMzMyMg==` | Sandbox |

**⚠️ WARNING:** Two different merchant secrets detected!

### Decoded Values

Using Base64 decoding:

**application.properties secret:**
```
Original: NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU
Decoded: 436361020163466516513741230541958789 05
```

**docker-compose.yml secret:**
```
Original: MTUxMTE5NjM4OTMxNDc2MzkyMDAyMzUwNjE2NzYyMTI0OTIwMzMyMg==
Decoded: 15111963893147639200235061676212492 03322
```

These are DIFFERENT secrets! You need to verify which one is correct.

---

## 🔐 Security Recommendations

### Immediate Actions (Critical)

1. **Check Git History**
   ```bash
   git log --all --full-history -- "*application.properties"
   git log --all --full-history -- "*docker-compose.yml"
   ```
   If these files are committed, consider them COMPROMISED.

2. **Add to .gitignore**
   ```
   # Sensitive configuration files
   backend/src/main/resources/application.properties
   backend/docker-compose.yml
   
   # Or use environment-specific files
   application-prod.properties
   application-*.properties
   ```

3. **Rotate Credentials**
   - Since these are sandbox credentials, risk is lower
   - Before production, get NEW production credentials
   - NEVER commit production credentials

---

### Best Practices Implementation

#### Option 1: Environment Variables (RECOMMENDED)

**Step 1:** Update `application.properties`
```properties
# PayHere Payment Gateway Configuration
payhere.merchant.id=${PAYHERE_MERCHANT_ID}
payhere.merchant.secret=${PAYHERE_MERCHANT_SECRET}
payhere.checkout.url=${PAYHERE_CHECKOUT_URL:https://sandbox.payhere.lk/pay/checkout}
payhere.api.url=${PAYHERE_API_URL:https://sandbox.payhere.lk/merchant/v1}
payhere.currency=${PAYHERE_CURRENCY:LKR}
```

**Step 2:** Create `.env` file (NOT committed to Git)
```bash
# .env file (add to .gitignore)
PAYHERE_MERCHANT_ID=1230399
PAYHERE_MERCHANT_SECRET=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU
PAYHERE_CHECKOUT_URL=https://sandbox.payhere.lk/pay/checkout
PAYHERE_API_URL=https://sandbox.payhere.lk/merchant/v1
PAYHERE_CURRENCY=LKR
```

**Step 3:** Update `.gitignore`
```
# Environment variables
.env
.env.local
.env.production
.env.*.local

# Sensitive properties
application-prod.properties
application-secret.properties
```

---

#### Option 2: Spring Profiles

**Step 1:** Create separate property files
```
application.properties          # Default/shared config
application-dev.properties      # Development (can commit with fake values)
application-prod.properties     # Production (NEVER commit)
```

**application.properties:**
```properties
# Default configuration (safe to commit)
payhere.checkout.url=https://sandbox.payhere.lk/pay/checkout
payhere.api.url=https://sandbox.payhere.lk/merchant/v1
payhere.currency=LKR
```

**application-dev.properties:**
```properties
# Development credentials (sandbox - lower risk)
payhere.merchant.id=1230399
payhere.merchant.secret=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU
```

**application-prod.properties:** (NEVER COMMIT)
```properties
# Production credentials (DO NOT COMMIT)
payhere.merchant.id=${PAYHERE_MERCHANT_ID}
payhere.merchant.secret=${PAYHERE_MERCHANT_SECRET}
```

**Step 2:** Set active profile
```bash
# Development
java -jar app.jar --spring.profiles.active=dev

# Production
java -jar app.jar --spring.profiles.active=prod
```

---

#### Option 3: Secret Management Service

For production deployment, use:
- **AWS Secrets Manager**
- **Azure Key Vault**
- **HashiCorp Vault**
- **Docker Secrets**

Example with AWS Secrets Manager:
```java
@Configuration
public class PayHereConfig {
    @Value("${aws.secretsmanager.secret-name}")
    private String secretName;
    
    @Bean
    public PayHereCredentials getCredentials() {
        // Fetch from AWS Secrets Manager
        return awsSecretsManager.getSecret(secretName);
    }
}
```

---

## 🚨 Docker Compose Security Issue

Your `docker-compose.yml` has a DIFFERENT merchant secret than `application.properties`.

**Current State:**
```yaml
# docker-compose.yml
- PAYHERE_MERCHANT_SECRET=MTUxMTE5NjM4OTMxNDc2MzkyMDAyMzUwNjE2NzYyMTI0OTIwMzMyMg==

# application.properties  
payhere.merchant.secret=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU
```

**Which one is correct?** You need to verify with PayHere dashboard.

**Recommended Fix for docker-compose.yml:**
```yaml
services:
  backend:
    environment:
      # PayHere Payment Gateway
      - PAYHERE_MERCHANT_ID=${PAYHERE_MERCHANT_ID}
      - PAYHERE_MERCHANT_SECRET=${PAYHERE_MERCHANT_SECRET}
      - PAYHERE_CHECKOUT_URL=${PAYHERE_CHECKOUT_URL:-https://sandbox.payhere.lk/pay/checkout}
      - PAYHERE_API_URL=${PAYHERE_API_URL:-https://sandbox.payhere.lk/merchant/v1}
      - PAYHERE_CURRENCY=${PAYHERE_CURRENCY:-LKR}
```

Then create `.env` file in same directory:
```bash
PAYHERE_MERCHANT_ID=1230399
PAYHERE_MERCHANT_SECRET=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU
```

---

## 📋 Action Checklist

### Immediate (Do Today)

- [ ] Add `.env` to `.gitignore`
- [ ] Create `.env.example` with placeholder values
- [ ] Update `application.properties` to use environment variables
- [ ] Update `docker-compose.yml` to use environment variables
- [ ] Verify which merchant secret is correct
- [ ] Check if credentials are in Git history
- [ ] Create team documentation about credential management

### Before Production

- [ ] Get production PayHere credentials
- [ ] Store production credentials in secret manager
- [ ] Remove all hardcoded credentials from codebase
- [ ] Rotate sandbox credentials if needed
- [ ] Set up CI/CD with secret injection
- [ ] Document deployment process with secrets

### Long-term

- [ ] Implement secret rotation policy
- [ ] Set up monitoring for credential exposure
- [ ] Regular security audits
- [ ] Developer training on secret management

---

## 📝 Template Files

### `.env.example` (Safe to commit)
```bash
# PayHere Configuration
PAYHERE_MERCHANT_ID=your_merchant_id_here
PAYHERE_MERCHANT_SECRET=your_merchant_secret_here
PAYHERE_CHECKOUT_URL=https://sandbox.payhere.lk/pay/checkout
PAYHERE_API_URL=https://sandbox.payhere.lk/merchant/v1
PAYHERE_CURRENCY=LKR

# Note: Copy this file to .env and fill in actual values
# Never commit .env file to Git
```

### `.gitignore` additions
```
# Environment variables
.env
.env.local
.env.*.local
!.env.example

# Sensitive configuration
application-prod.properties
application-secret.properties
*-secret.properties

# Docker secrets
docker-compose.override.yml
secrets/
```

### `README.md` additions
```markdown
## Environment Setup

1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```

2. Fill in your PayHere credentials in `.env`
3. Never commit `.env` file to Git

## PayHere Credentials

- Development: Use sandbox credentials
- Production: Use production credentials from PayHere dashboard
- Store in environment variables or secret manager
```

---

## 🎯 Summary

**Current Risk Level:** 🟡 MEDIUM (sandbox credentials only)  
**Files Affected:** 2 files  
**Credentials Exposed:** 1 Merchant ID, 2 different Merchant Secrets  

**Critical Actions:**
1. ✅ Frontend is secure (no hardcoded credentials)
2. ❌ Backend has hardcoded credentials in 2 files
3. ⚠️ Two different merchant secrets detected - verify correct one
4. 🔒 Use environment variables immediately
5. 🚫 Never commit credentials to Git

**Good News:**
- These are sandbox (test) credentials
- Not production credentials
- Easy to fix with environment variables

**Next Steps:**
1. Implement environment variable approach
2. Update `.gitignore`
3. Verify correct merchant secret
4. Document credential management process
