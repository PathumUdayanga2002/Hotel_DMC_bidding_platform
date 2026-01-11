# PayHere Integration Analysis & Recommendation

**Date:** January 10, 2026  
**Document Purpose:** Complete audit of PayHere payment integration for subscription system

---

## Executive Summary

✅ **GOOD NEWS:** Your subscription payment system is **correctly implemented** according to PayHere JavaScript SDK documentation.

⚠️ **CRITICAL ISSUE:** You have **TWO SEPARATE PayHere integrations** running in parallel:
1. **New System** - Subscription payments (CORRECT implementation)
2. **Old System** - Bid award payments (OUTDATED approach, security risk)

---

## 1. Subscription Payment Implementation (✅ CORRECT)

### Current Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| PayHere.js SDK | ✅ Correct | Loaded from CDN dynamically |
| Hash Generation | ✅ Correct | Uses proper MD5(merchant_id + order_id + amount + currency + MD5(secret)) |
| Sandbox Mode | ✅ Enabled | `sandbox: true` flag present |
| Event Handlers | ✅ Complete | onCompleted, onDismissed, onError all implemented |
| Server Callback | ✅ Correct | notify_url points to backend |
| User Redirects | ✅ Correct | return_url/cancel_url point to frontend |
| Security | ✅ Secure | Hash generated server-side, not client-side |

### How It Works in Your Platform

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION PAYMENT FLOW                     │
└─────────────────────────────────────────────────────────────────┘

1. USER SELECTS PLAN
   ├─ Frontend: SubscriptionPurchase.jsx
   ├─ Plans: MONTHLY ($200) or YEARLY ($2000)
   └─ Currency: LKR

2. PAYMENT INITIALIZATION
   ├─ POST /api/v1/subscription/purchase?plan=MONTHLY
   ├─ Backend: SubscriptionServiceImpl.initializeSubscriptionPayment()
   ├─ Generates unique order_id: "SUB-{UUID}"
   ├─ Creates payment data with:
   │   ├─ merchant_id: 1230399
   │   ├─ sandbox: true
   │   ├─ return_url: http://localhost:5173/subscription/success
   │   ├─ cancel_url: http://localhost:5173/subscription/cancel
   │   ├─ notify_url: http://localhost:8081/api/v1/subscription/payhere-notify
   │   └─ hash: MD5(merchant_id + order_id + amount + LKR + MD5(decoded_secret))
   └─ Returns payment data to frontend

3. PAYHERE MODAL OPENS
   ├─ Frontend calls: window.payhere.startPayment(paymentData)
   ├─ PayHere modal opens as iframe (NO CORS - it's not AJAX!)
   ├─ User enters card details in PayHere secure form
   └─ Payment processed by PayHere servers

4. SERVER-TO-SERVER CALLBACK
   ├─ PayHere sends POST to: notify_url (backend)
   ├─ Backend: SubscriptionController.handlePayHereNotification()
   ├─ Verification: MD5 signature check
   ├─ Status code "2" = success
   ├─ Updates subscription:
   │   ├─ status: TRIAL → ACTIVE
   │   ├─ plan: MONTHLY/YEARLY
   │   ├─ startDate: now
   │   ├─ endDate: now + 30/365 days
   └─ Saves to MongoDB

5. USER REDIRECT
   ├─ PayHere redirects user to: return_url (frontend)
   ├─ Frontend: payhere.onCompleted callback fires
   ├─ Shows success message
   └─ Redirects to dashboard (hotel/dmc)
```

### Configuration Variables in application.properties

```properties
# ✅ ALL REQUIRED VARIABLES ARE PRESENT

# PayHere Credentials
payhere.merchant.id=1230399                                    # ✅ Merchant ID
payhere.merchant.secret=NDM2MzYxMDIwMTYzNDY2NTE2NTEzNzQxMjMwNTQxOTU4Nzg5MDU  # ✅ Base64 encoded
payhere.checkout.url=https://sandbox.payhere.lk/pay/checkout   # ✅ Sandbox checkout
payhere.api.url=https://sandbox.payhere.lk/merchant/v1         # ✅ Sandbox API
payhere.currency=LKR                                           # ✅ Currency

# Callback URLs
app.frontend.url=http://localhost:5173                         # ✅ For return/cancel
app.backend.url=http://localhost:8081/api/v1                  # ✅ For notify webhook
app.base.url=http://localhost:5173                            # ✅ Base URL
```

### Security Implementation

#### ✅ Hash Generation (Correct)

**Frontend:** NO hash generation (secure)
**Backend:** Hash generated server-side

```java
// Step 1: Decode Base64 merchant secret
byte[] decodedBytes = Base64.getDecoder().decode(merchantSecret);
String decodedSecret = new String(decodedBytes);

// Step 2: Generate MD5 of secret
String merchantSecretMd5 = MD5(decodedSecret).toUpperCase();

// Step 3: Generate final hash
String hash = MD5(merchant_id + order_id + amount + currency + merchantSecretMd5).toUpperCase();
```

**This matches PayHere documentation exactly!** ✅

#### ✅ Payment Verification (Correct)

When PayHere sends notification to `notify_url`:

```java
// Reconstruct local hash
String localHash = MD5(merchant_id + order_id + payhere_amount + currency + status_code + MD5(secret));

// Compare with received md5sig
if (localHash.equals(md5sig)) {
    // ✅ Payment verified - Update database
}
```

---

## 2. Old Bid Payment System (⚠️ NEEDS REMOVAL)

### Why It's Problematic

| Issue | Impact | Risk Level |
|-------|--------|------------|
| **Outdated Approach** | Uses checkout URL redirect instead of JavaScript SDK | 🟡 Medium |
| **Shared Credentials** | Uses same merchant ID/secret as subscription | 🔴 High |
| **Incorrect Hash** | Had wrong hash algorithm (now fixed but still duplicate) | 🔴 Critical |
| **Maintenance Burden** | Two separate payment systems to maintain | 🟡 Medium |
| **Future Vulnerability** | Different hash algorithms could cause confusion | 🟠 High |

### Files to Review/Remove

```
BACKEND FILES (OLD BID PAYMENT SYSTEM):
├─ PaymentService.java                    ⚠️ Review - Keep bid tracking, remove PayHere
├─ PaymentServiceImpl.java                ⚠️ Refactor - Remove PayHere integration
├─ PayHereService.java                    ❌ DELETE - Only used by bid payments
├─ PayHereServiceImpl.java                ❌ DELETE - Duplicate implementation
├─ PaymentController.java                 ⚠️ Review - Remove PayHere endpoints
├─ PaymentWebhookController.java          ⚠️ Review - Keep if needed for bid tracking
└─ PaymentHistory.java                    ✅ KEEP - For bid payment records

FRONTEND FILES (OLD BID PAYMENT SYSTEM):
├─ PaymentInitiation.jsx                  ⚠️ Review - Check if used
├─ PaymentReturn.jsx                      ⚠️ Review - Check if used
├─ PaymentCancel.jsx                      ⚠️ Review - Check if used
├─ DMCPaymentHistory.jsx                  ✅ KEEP - For bid payment history
└─ HotelPaymentHistory.jsx                ✅ KEEP - For bid payment history
```

---

## 3. Recommended Action Plan

### Phase 1: Immediate (This Week)

1. **✅ Document Current System**
   - Mark all subscription payment files with clear comments
   - Add "SUBSCRIPTION SYSTEM" header comments

2. **⚠️ Separate Payment Systems**
   - Rename `PayHereService` → `LegacyBidPaymentService`
   - Add deprecation warnings
   - Document which system handles what

3. **✅ Add Monitoring**
   - Log all PayHere transactions with system identifier
   - Track success/failure rates separately

### Phase 2: Short Term (This Month)

1. **🔄 Refactor Bid Payment System**
   - Remove PayHere integration from bid payments
   - Option A: Move bids to subscription-based access (RECOMMENDED)
   - Option B: Use different payment provider for bids
   - Option C: Manual bank transfer for bid awards

2. **🗑️ Remove Redundant Code**
   - Delete `PayHereService.java` and `PayHereServiceImpl.java`
   - Clean up `PaymentServiceImpl.java` - remove PayHere methods
   - Update frontend payment pages

3. **📝 Update Documentation**
   - Create PAYMENT_ARCHITECTURE.md
   - Document subscription-only payment flow

### Phase 3: Long Term (Next Quarter)

1. **🔐 Production Hardening**
   - Move from sandbox to production PayHere
   - Update merchant credentials
   - Set `sandbox: false`
   - Update notify_url to production domain

2. **📊 Analytics Integration**
   - Track conversion rates
   - Monitor failed payments
   - Set up alerts for payment issues

3. **💳 Recurring Payments** (Optional)
   - Implement PayHere recurring API
   - Auto-renew subscriptions
   - Save payment methods

---

## 4. Critical Code Sections

### ✅ KEEP THESE (Subscription System)

```
Backend:
├─ SubscriptionService.java
├─ SubscriptionServiceImpl.java
├─ SubscriptionController.java
├─ AdminSubscriptionService.java
├─ AdminSubscriptionServiceImpl.java
├─ AdminSubscriptionController.java
├─ Subscription.java (entity)
└─ SubscriptionResponse.java (DTO)

Frontend:
├─ SubscriptionPurchase.jsx
├─ SubscriptionPlanIntro.jsx
├─ AdminSubscriptionManagement.jsx
└─ AdminSubscriptionDetail.jsx
```

### ⚠️ REVIEW THESE (Old Bid System)

```java
// PayHereServiceImpl.java - Lines 30-90
// This is DUPLICATE hash generation for old system
// Should be removed after bid payment migration

@Override
public String generateCheckoutUrl(...) {
    // This builds a redirect URL (old approach)
    // Subscription system uses JavaScript SDK (better)
}
```

---

## 5. Configuration Checklist

### Development Environment ✅

- [x] Merchant ID configured
- [x] Merchant Secret configured (Base64)
- [x] Sandbox mode enabled
- [x] Localhost URLs configured
- [x] Currency set to LKR
- [x] Hash generation correct
- [x] Webhook endpoint accessible

### Production Readiness ⚠️

- [ ] Production merchant credentials
- [ ] Production domain URLs
- [ ] SSL certificate (HTTPS required)
- [ ] Sandbox mode disabled
- [ ] PayHere domain approval
- [ ] Webhook testing on public domain
- [ ] Load testing
- [ ] Error monitoring
- [ ] Payment reconciliation process

---

## 6. Security Recommendations

### ✅ Currently Implemented

1. Hash generated server-side
2. Merchant secret not exposed to client
3. Signature verification on webhook
4. Base64 decoding of merchant secret
5. Proper MD5 hash algorithm

### 🔐 Additional Recommendations

1. **Rate Limiting**
   ```java
   // Add to SubscriptionController
   @RateLimit(maxRequests = 3, duration = 1, unit = TimeUnit.MINUTES)
   public Map<String, Object> initializeSubscriptionPayment(...)
   ```

2. **IP Whitelist for Webhooks**
   ```java
   // Verify webhook comes from PayHere IPs
   String[] payhereIPs = {"x.x.x.x", "y.y.y.y"};
   if (!Arrays.asList(payhereIPs).contains(request.getRemoteAddr())) {
       throw new UnauthorizedException("Invalid webhook source");
   }
   ```

3. **Idempotency**
   ```java
   // Prevent double-processing of same payment
   if (subscription.getPayherePaymentId() != null) {
       log.warn("Payment already processed for order: {}", orderId);
       return;
   }
   ```

4. **Audit Logging**
   ```java
   // Log all payment attempts
   auditLog.record(userId, "PAYMENT_INITIATED", orderId, amount);
   auditLog.record(userId, "PAYMENT_COMPLETED", paymentId, amount);
   ```

---

## 7. Testing Checklist

### Subscription Payments ✅

- [x] Monthly plan purchase
- [x] Yearly plan purchase
- [x] Payment success flow
- [x] Payment cancellation
- [x] Payment failure
- [x] Webhook verification
- [x] Duplicate payment prevention
- [ ] Expired card handling
- [ ] Insufficient funds handling
- [ ] Network timeout handling

### Edge Cases to Test

1. User closes modal before payment
2. User loses internet during payment
3. Webhook arrives before redirect
4. Webhook arrives after redirect
5. Multiple rapid clicks on purchase button
6. Payment succeeds but webhook fails
7. Payment fails but webhook says success
8. Invalid hash received

---

## 8. Migration Strategy for Bid Payments

### Option A: Subscription-Based Access (RECOMMENDED)

```
Current: DMC pays for each awarded bid
New: DMC subscription includes unlimited bidding

Benefits:
- Simpler system (one payment integration)
- Better UX (no payment friction per bid)
- Predictable revenue (subscription model)
- Less payment processing fees

Changes needed:
- Remove bid payment flow
- Update business logic
- Migrate existing bid payments to subscription
```

### Option B: Separate Provider for Bids

```
Keep: Subscription payments use PayHere
New: Bid payments use Stripe/Other

Benefits:
- Separation of concerns
- Different pricing models
- Feature isolation

Drawbacks:
- Multiple payment integrations
- More complexity
- Higher maintenance cost
```

### Option C: Manual Processing

```
For enterprise/bulk bid awards:
- Manual bank transfer
- Invoice generation
- Payment verification by admin

Benefits:
- Lower fees for large amounts
- Suitable for B2B transactions

Drawbacks:
- Manual work required
- Slower processing
```

---

## 9. Conclusion

### ✅ What's Working Well

1. **Subscription system** is correctly implemented per PayHere documentation
2. Security is properly handled (server-side hash generation)
3. All required PayHere parameters are present
4. Sandbox testing environment is configured
5. Event handling is complete

### ⚠️ What Needs Action

1. **Remove or refactor old bid payment PayHere integration**
   - Prevents future confusion
   - Reduces security surface area
   - Simplifies maintenance

2. **Decide bid payment strategy**
   - Move to subscription model (recommended)
   - OR choose different provider
   - OR implement manual processing

3. **Production preparation**
   - Get PayHere domain approval
   - Update to production credentials
   - Test on public domain

### 📊 Estimated Effort

| Task | Effort | Priority |
|------|--------|----------|
| Document current system | 2 hours | High |
| Remove old PayHere code | 1 day | High |
| Update bid payment flow | 2-3 days | Medium |
| Production setup | 1 day | Low |
| Testing & QA | 2 days | High |

**Total:** 1-2 weeks for complete cleanup and migration

---

## 10. Next Steps

1. **Today:**
   - ✅ Read this document
   - ✅ Understand the dual-system issue
   - 🔄 Decide on bid payment strategy

2. **This Week:**
   - Create backup of current code
   - Mark subscription files with clear comments
   - Add deprecation warnings to old PayHere code

3. **Next Week:**
   - Implement chosen bid payment strategy
   - Remove redundant PayHere integration
   - Update documentation

4. **Before Production:**
   - Complete security audit
   - Load testing
   - Get PayHere production approval
   - Update all URLs to production

---

**Questions or concerns? Review sections 2 (Old System) and 8 (Migration Strategy) carefully.**
