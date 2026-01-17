# PayHere "Unauthorized Payment Request" Error - Investigation & Fix

## 🔴 Critical Issue
When attempting subscription payment, PayHere displays:
```
Unauthorized payment request
This is a merchant's error
Please inform this error to your Merchant to get it resolved
```

## 📊 Observed Behavior

### Browser Console Logs
```javascript
[API Request] POST /subscription/purchase?plan=MONTHLY
[API Response] Status: 200

Payment data received: {
  merchant_id: "1230399",
  amount: "200.00",
  hash: "D770E4332F44BD6EC07CB276F8F30992",
  sandbox: true,
  order_id: "SUB-e7d56307-d8b4-475b-ba0e-e4182501b24e",
  currency: "LKR",
  // ... other fields
}
```

### PayHere Error
Modal shows "Unauthorized payment request" - This means PayHere rejected the payment data.

## 🔍 Root Causes Identified

### 1. **Variable Naming Inconsistency** (FIXED ✅)
**Location:** `SubscriptionServiceImpl.java` Line 41
```java
// BEFORE (WRONG):
@Value("${payhere.merchant.id}")
private String payheremerchant;  // Lowercase 'm'

// AFTER (CORRECT):
@Value("${payhere.merchant.id}")
private String payhereMerchantId;  // Consistent camelCase
```

**Impact:** Variable was being used inconsistently throughout code, potentially causing null values.

### 2. **Merchant Secret Configuration Issue** (NEEDS VERIFICATION ⚠️)
**Location:** `application.properties`
```properties
payhere.merchant.secret=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU=
```

**Concern:** 
- This is a Base64-encoded secret
- PayHere documentation requires: `MD5(Base64_decoded_merchant_secret)`
- Code attempts to decode Base64, but if secret is wrong, hash will be invalid
- **Two different secrets found in codebase!** (See PAYHERE_CREDENTIALS_AUDIT.md)

### 3. **Hash Generation Formula** (NEEDS VERIFICATION ⚠️)
**PayHere Required Formula:**
```
MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))
```

**Current Implementation:**
```java
String merchantSecretMd5 = MD5(Base64.decode(payhereMerchantSecret));
String hashString = merchantId + orderId + amount + currency + merchantSecretMd5;
String finalHash = MD5(hashString).toUpperCase();
```

**Potential Issues:**
- If merchant secret is incorrect, entire hash chain fails
- PayHere validates this hash server-side
- Mismatch = "Unauthorized" error

### 4. **Missing Error Logging** (FIXED ✅)
Previously no way to debug:
- Which merchant ID was being sent
- What hash was generated
- Whether credentials were loaded correctly

## ✅ Fixes Applied

### Backend Changes (SubscriptionServiceImpl.java)

#### 1. Fixed Variable Names
```java
- private String payheremerchant;
- private String payhereSecret;
+ private String payhereMerchantId;
+ private String payhereMerchantSecret;
```

#### 2. Added Credential Validation
```java
if (payhereMerchantId == null || payhereMerchantId.trim().isEmpty()) {
    log.error("PayHere Merchant ID is not configured!");
    throw new IllegalStateException("Payment gateway not configured");
}
if (payhereMerchantSecret == null || payhereMerchantSecret.trim().isEmpty()) {
    log.error("PayHere Merchant Secret is not configured!");
    throw new IllegalStateException("Payment gateway not configured");
}
```

#### 3. Added Comprehensive Logging
```java
log.info("=== INITIALIZING SUBSCRIPTION PAYMENT ===");
log.info("PayHere Merchant ID: {}", payhereMerchantId);
log.info("PayHere Merchant Secret Length: {}", payhereMerchantSecret.length());
log.info("Currency: {}", currency);
log.info("Generated Order ID: {}", orderId);
log.info("Generating hash with: merchantId={}, orderId={}, amount={}, currency={}", ...);
log.info("Generated Hash: {}", hash);

// In hash generation:
log.info("=== HASH GENERATION DETAILS ===");
log.info("Merchant ID: {}", payhereMerchantId);
log.info("Merchant Secret MD5: {}", merchantSecretMd5);
log.info("Hash String (before MD5): {}", hashString);
log.info("Generated Final Hash: {}", finalHash);
```

### Frontend Changes (SubscriptionPurchase.jsx)

#### Added Detailed Error Logging
```javascript
console.log('=== PAYMENT DATA RECEIVED ===');
console.log('Merchant ID:', paymentData.merchant_id);
console.log('Hash:', paymentData.hash);
console.log('Sandbox Mode:', paymentData.sandbox);

// PayHere SDK validation
if (typeof window.payhere === 'undefined') {
  console.error('PayHere SDK not loaded!');
  toast.error('Payment gateway not initialized');
  return;
}

// Try-catch around startPayment
try {
  window.payhere.startPayment(paymentData);
} catch (payhereError) {
  console.error('=== PAYHERE START PAYMENT ERROR ===');
  console.error('Error Message:', payhereError.message);
  toast.error('Failed to start payment');
}
```

## 🔧 How to Debug Further

### Step 1: Check Backend Logs
Restart your Spring Boot application and look for:
```
=== INITIALIZING SUBSCRIPTION PAYMENT ===
PayHere Merchant ID: 1230399
PayHere Merchant Secret Length: XX
Currency: LKR
Generated Order ID: SUB-xxxx
```

**Verify:**
- ✅ Merchant ID is `1230399`
- ✅ Merchant Secret Length is > 0 (should be ~60 characters after Base64)
- ✅ Currency is `LKR`

### Step 2: Check Hash Generation Logs
Look for:
```
=== HASH GENERATION DETAILS ===
Merchant ID: 1230399
Order ID: SUB-xxxx
Amount: 200.00
Currency: LKR
Merchant Secret MD5: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Hash String (before MD5): 1230399SUB-xxxx200.00LKRXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Generated Final Hash: YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

**Verify:**
- ✅ Merchant Secret MD5 is 32 characters (valid MD5 hash)
- ✅ Hash String format matches PayHere requirements
- ✅ Generated Final Hash is 32 characters (uppercase MD5)

### Step 3: Compare Hash with PayHere
Use this online MD5 calculator to verify:
1. Take your merchant secret from application.properties
2. Decode Base64: https://www.base64decode.org/
3. Calculate MD5 of decoded secret: https://www.md5hashgenerator.com/
4. Should match "Merchant Secret MD5" in logs

### Step 4: Verify PayHere Credentials

#### Test Your Credentials Manually
Visit PayHere Merchant Portal:
- Sandbox: https://sandbox.payhere.lk/merchant/
- Login with your merchant account
- Go to Settings → Integration
- Verify:
  - ✅ Merchant ID: `1230399`
  - ✅ Merchant Secret matches what's in application.properties
  - ✅ Account is Active (not suspended)
  - ✅ Sandbox mode is enabled

#### Check for Account Issues
PayHere shows "Unauthorized" if:
- ❌ Merchant account is suspended
- ❌ Merchant secret was regenerated (old one in code)
- ❌ IP restrictions enabled (PayHere blocks your server IP)
- ❌ Account not verified for sandbox testing

## 🚨 Known Issues in Codebase

### Issue 1: Two Different Merchant Secrets Found
```properties
# application.properties
payhere.merchant.secret=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU=

# docker-compose.yml
PAYHERE_MERCHANT_SECRET=MTUxMTE5NjM4OTMxNDc2MzkyMDAyMzUwNjE2NzYyMTI0OTIwMzMyMg==
```

**Which one is correct?** You MUST verify with PayHere portal!

### Issue 2: Currency Mismatch
```java
@Value("${payhere.currency:LKR}")  // Now defaults to LKR (correct)
// Previously was USD (wrong for PayHere Sri Lanka)
```

## 📋 Testing Checklist

After restarting backend, test again:

1. ✅ Click "Subscribe to Monthly"
2. ✅ Check browser console for new detailed logs
3. ✅ Check backend logs for:
   - Payment initialization logs
   - Hash generation logs
   - Credential validation
4. ✅ Note the exact hash being generated
5. ✅ Compare with PayHere's expected hash
6. ✅ If still unauthorized, verify merchant account status

## 🔑 Next Steps

### Immediate Actions
1. **Restart Backend Server** - Apply new logging
2. **Test Payment Again** - Collect new logs
3. **Check Backend Console** - Look for detailed hash info
4. **Verify Merchant Secret** - Login to PayHere portal and confirm correct secret

### If Still Unauthorized
1. **Generate New Merchant Secret** in PayHere portal
2. **Update application.properties** with new secret
3. **Test Hash Generation** manually with new secret
4. **Contact PayHere Support** if merchant account has issues

### Security Improvements (After Fix)
1. Move credentials to environment variables (see PAYHERE_CREDENTIALS_AUDIT.md)
2. Use single source of truth for merchant secret
3. Add secret rotation capability
4. Implement proper secret management (AWS Secrets Manager, etc.)

## 📞 PayHere Support Contacts
If issue persists, contact PayHere:
- Email: support@payhere.lk
- Phone: +94 11 2 399 399
- Provide: Merchant ID `1230399`, Order IDs from logs, error screenshots

## 📝 Log Files to Check
1. **Backend Console** - Spring Boot application logs
2. **Browser Console** - JavaScript payment data logs
3. **Network Tab** - Check if payment endpoint returns 200
4. **PayHere Developer Portal** - Check transaction logs

---

## Summary

The "Unauthorized payment request" error is caused by **invalid hash signature**. This happens when:
1. Merchant secret is incorrect ❌
2. Hash generation formula is wrong ❌
3. Merchant account has issues ❌

**We fixed:**
- Variable naming consistency ✅
- Added comprehensive logging ✅
- Added credential validation ✅

**You need to verify:**
- Correct merchant secret from PayHere portal ⚠️
- Account is active and sandbox-enabled ⚠️
- Compare generated hash with expected hash ⚠️

**Next Action:** Restart backend, test payment, collect logs, compare with PayHere documentation.
