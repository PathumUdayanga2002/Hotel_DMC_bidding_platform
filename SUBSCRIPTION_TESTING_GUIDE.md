# Subscription System Testing Guide

## Overview
This document provides comprehensive test scenarios for the subscription management system with PayHere integration.

---

## Test Environment Setup

### Prerequisites
1. **Backend**: Spring Boot application running on `http://localhost:8080`
2. **Frontend**: React application running on `http://localhost:5173`
3. **Database**: MongoDB connection established
4. **Email**: Gmail SMTP configured in `application.properties`
5. **PayHere**: Sandbox credentials configured

### Test Accounts Required
- Admin account (PLATFORM_SUPER_ADMIN role)
- DMC user account (pending approval → approved)
- Hotel user account (pending approval → approved)

---

## Test Scenarios

### 1. Trial Subscription Creation

#### Test Case 1.1: Trial Creation on Admin Approval
**Objective**: Verify 30-day trial is created when admin approves profile

**Steps**:
1. Register a new DMC/Hotel user
2. Admin logs in and navigates to approvals page
3. Admin approves the pending profile
4. User role upgraded to SUPER_ADMIN
5. Trial subscription created automatically

**Expected Results**:
- ✅ Subscription record created with status = `TRIAL`
- ✅ `startDate` = current timestamp
- ✅ `endDate` = startDate + 30 days
- ✅ User can access all features
- ✅ No email sent (trial just started)

**Verification**:
```bash
# Check MongoDB
db.subscriptions.find({ userId: "USER_ID" })
```

---

### 2. Trial Countdown Display

#### Test Case 2.1: Trial Banner Visibility
**Objective**: Verify subscription banner shows correct information

**Steps**:
1. Login as DMC/Hotel user with active trial
2. Navigate to dashboard
3. Observe subscription banner

**Expected Results** (based on days remaining):
- **> 7 days remaining**: Banner hidden or shows informational message
- **≤ 7 days remaining**: Yellow warning banner with countdown
- **≤ 3 days remaining**: Orange urgent warning
- **Expired**: Red banner blocking access

**Example Display**:
```
🔔 Trial Expires in 5 days
Your free trial will expire on January 8, 2026
[Subscribe Now] [Dismiss]
```

---

### 3. Access Control Filter

#### Test Case 3.1: Active Subscription Access
**Objective**: Verify users with active subscriptions can access all features

**Steps**:
1. Login with active trial/paid subscription
2. Navigate to various pages (inquiries, contracts, messages)
3. Submit new inquiry
4. Upload documents

**Expected Results**:
- ✅ All pages accessible
- ✅ All features functional
- ✅ No 403 errors

#### Test Case 3.2: Expired Subscription Blocking
**Objective**: Verify expired users are blocked from accessing features

**Steps**:
1. Manually expire a subscription in database:
   ```javascript
   db.subscriptions.updateOne(
     { userId: "USER_ID" },
     { $set: { status: "EXPIRED", endDate: new Date("2026-01-01") } }
   )
   ```
2. Login as that user
3. Try to access protected endpoints

**Expected Results**:
- ✅ HTTP 403 Forbidden response
- ✅ Error message: "Your subscription has expired"
- ✅ Redirected to subscription purchase page

**Excluded Paths** (Should still work):
- `/auth/*` (login, register)
- `/subscription/status`
- `/subscription/purchase`
- `/subscription/plans`
- `/public/*`

---

### 4. Email Notifications

#### Test Case 4.1: Trial Expiring Warning (7 days before)
**Objective**: Verify email sent 7 days before trial expiry

**Setup**:
```javascript
// Set trial to expire in 7 days
db.subscriptions.updateOne(
  { userId: "USER_ID" },
  { $set: { endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
)
```

**Trigger**: Wait for scheduled task to run at midnight OR manually trigger:
```java
@Autowired
private SubscriptionService subscriptionService;

// In test controller
subscriptionService.expireSubscriptions();
```

**Expected Email**:
- **Subject**: "🔔 Your Trial is Expiring Soon!"
- **Content**:
  - Days remaining: 7
  - Subscription plans: Monthly $200, Yearly $2000
  - Subscribe Now link
  - List of features

#### Test Case 4.2: Trial Expired Email
**Objective**: Verify email sent when trial ends

**Setup**:
```javascript
db.subscriptions.updateOne(
  { userId: "USER_ID" },
  { $set: { 
    status: "EXPIRED",
    endDate: new Date(Date.now() - 1000) 
  } }
)
```

**Expected Email**:
- **Subject**: "❌ Your Free Trial Has Expired"
- **Content**:
  - Trial expired message
  - List of blocked features
  - Subscribe immediately prompt
  - Pricing information

#### Test Case 4.3: Payment Success Email
**Objective**: Verify email sent after successful payment

**Trigger**: Complete PayHere payment (see Test Case 5)

**Expected Email**:
- **Subject**: "🎉 Payment Successful - Subscription Activated!"
- **Content**:
  - Payment details table (Plan, Amount, Order ID, Status)
  - Subscription duration (30/365 days)
  - Features unlocked
  - Thank you message

#### Test Case 4.4: Subscription Expired Email
**Objective**: Verify email sent when paid subscription expires

**Setup**:
```javascript
db.subscriptions.updateOne(
  { userId: "USER_ID" },
  { $set: { 
    status: "ACTIVE",
    plan: "MONTHLY",
    endDate: new Date(Date.now() - 1000)
  } }
)
```

**Expected Email**:
- **Subject**: "❌ Your Subscription Has Expired"
- **Content**: Similar to trial expired but mentions "suspended state"

---

### 5. PayHere Payment Integration

#### Test Case 5.1: Payment Initialization
**Objective**: Verify payment data generation

**Steps**:
1. Login as DMC/Hotel user
2. Navigate to `/subscription/purchase`
3. Select Monthly or Yearly plan
4. Click "Subscribe Now"

**Expected Results**:
- ✅ API call to `POST /subscription/purchase?plan=MONTHLY`
- ✅ Response contains PayHere data:
  - `merchant_id`
  - `order_id` (format: `SUB-UUID`)
  - `amount` (200.00 or 2000.00)
  - `hash` (MD5 signature)
  - `return_url`, `cancel_url`, `notify_url`
  - User details (name, email)

**Verification**:
```javascript
// Check subscription updated with paymentId
db.subscriptions.findOne({ userId: "USER_ID" })
// Should have: paymentId = "SUB-xxx", plan = "MONTHLY", amount = 200.00
```

#### Test Case 5.2: PayHere Sandbox Payment
**Objective**: Complete test payment in PayHere sandbox

**Steps**:
1. After initialization, PayHere modal opens
2. Use PayHere test card:
   - **Visa**: `4111111111111111`
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
3. Complete payment

**Expected Results**:
- ✅ PayHere sends POST request to `/api/subscription/payhere-notify`
- ✅ Backend verifies MD5 signature
- ✅ Subscription activated:
  - `status` = "ACTIVE"
  - `payherePaymentId` = PayHere transaction ID
  - `startDate` = current timestamp
  - `endDate` = startDate + 30/365 days
- ✅ Payment history record created
- ✅ Payment success email sent
- ✅ User redirected to success page

**Webhook Payload Example**:
```json
{
  "merchant_id": "1228337",
  "order_id": "SUB-123e4567-e89b-12d3-a456-426614174000",
  "payment_id": "320056295977",
  "payhere_amount": "200.00",
  "payhere_currency": "USD",
  "status_code": "2",
  "md5sig": "ABC123DEF456..."
}
```

#### Test Case 5.3: Payment Verification Failure
**Objective**: Verify system rejects invalid signatures

**Steps**:
1. Manually send POST to `/api/subscription/payhere-notify` with invalid `md5sig`
2. Use Postman or curl

**Expected Results**:
- ✅ HTTP 401 Unauthorized
- ✅ Error: "Invalid payment signature"
- ✅ Subscription not activated

---

### 6. Payment History

#### Test Case 6.1: View Payment History
**Objective**: Verify payment history displays correctly

**Steps**:
1. Login as user who made payments
2. Navigate to `/payment-history`
3. View payment records

**Expected Results**:
- ✅ Table shows all payments (newest first)
- ✅ Columns: Date, Order ID, Plan, Amount, Status, Transaction Ref
- ✅ Summary card shows:
  - Total Payments: X
  - Successful: Y
  - Total Spent: $Z

**Sample Data**:
```
Date                  | Order ID      | Plan    | Amount  | Status  | Ref
----------------------|---------------|---------|---------|---------|-------------
Jan 3, 2026 3:30 PM   | SUB-abc123    | MONTHLY | $200.00 | SUCCESS | 320056295977
Dec 15, 2025 10:15 AM | SUB-def456    | YEARLY  | $2000.00| SUCCESS | 320056123456
```

#### Test Case 6.2: Empty Payment History
**Objective**: Verify empty state

**Steps**:
1. Login as user with no payments
2. Navigate to `/payment-history`

**Expected Results**:
- ✅ Empty state message: "You haven't made any payments yet"
- ✅ Icon and helpful text displayed

---

### 7. Admin Subscription Management

#### Test Case 7.1: View All Subscriptions
**Objective**: Verify admin can see all subscriptions

**Steps**:
1. Login as PLATFORM_SUPER_ADMIN
2. Navigate to `/admin/subscriptions`
3. View subscription list

**Expected Results**:
- ✅ Table with all subscriptions
- ✅ Pagination working (10 per page)
- ✅ Filters: By status, by search (email/username)
- ✅ Statistics cards showing:
  - Total Subscriptions
  - Active Subscriptions
  - Trial Subscriptions
  - Monthly Revenue
  - Expired Subscriptions
  - Expiring Soon (7 days)
  - Conversion Rate

#### Test Case 7.2: Extend Subscription
**Objective**: Verify admin can manually extend subscription

**Steps**:
1. On admin dashboard, find a subscription
2. Click "Extend" button
3. Enter days to extend (e.g., 30)
4. Confirm

**Expected Results**:
- ✅ API call: `POST /admin/subscriptions/{id}/extend?days=30`
- ✅ Subscription `endDate` extended by 30 days
- ✅ Status changed to "ACTIVE" if was expired
- ✅ Success message displayed
- ✅ Table refreshes with new data

**Verification**:
```javascript
// Check endDate updated
db.subscriptions.findOne({ _id: "SUBSCRIPTION_ID" })
// endDate should be +30 days from previous value
```

#### Test Case 7.3: Cancel Subscription
**Objective**: Verify admin can cancel subscription

**Steps**:
1. On admin dashboard, find an active subscription
2. Click "Cancel" button
3. Confirm cancellation

**Expected Results**:
- ✅ API call: `POST /admin/subscriptions/{id}/cancel`
- ✅ Subscription `status` = "CANCELLED"
- ✅ User loses access immediately
- ✅ Success message displayed

---

### 8. Scheduled Tasks

#### Test Case 8.1: Daily Subscription Expiry Check
**Objective**: Verify scheduled task runs daily at midnight

**Setup**: Cannot wait for midnight, so manually trigger

**Trigger Method**:
```java
// Add test endpoint in SubscriptionController
@GetMapping("/test/expire-subscriptions")
@PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')")
public ResponseEntity<String> testExpireSubscriptions() {
    subscriptionService.expireSubscriptions();
    return ResponseEntity.ok("Expiry check completed");
}
```

**Steps**:
1. Create subscriptions with various expiry dates:
   - 1 day remaining (should send warning)
   - 7 days remaining (should send warning)
   - 8 days remaining (no email)
   - Already expired (should expire and email)
2. Call test endpoint: `GET /subscription/test/expire-subscriptions`

**Expected Results**:
- ✅ Warning emails sent to users with ≤7 days remaining
- ✅ Subscriptions expired where `endDate < now`
- ✅ Expiry emails sent to expired users
- ✅ Logs show processing for each subscription

---

### 9. Error Handling

#### Test Case 9.1: No Subscription Found
**Steps**: Login as new user (no subscription record exists)

**Expected**: Error message or automatic trial creation

#### Test Case 9.2: Invalid Plan Selected
**Steps**: Call `POST /subscription/purchase?plan=INVALID`

**Expected**: HTTP 400 Bad Request

#### Test Case 9.3: Duplicate Payment
**Steps**: Try to pay for subscription twice with same order ID

**Expected**: Second payment rejected or subscription extended

---

## Testing Checklist

### Backend Tests
- [ ] Trial creation on approval (DMC)
- [ ] Trial creation on approval (Hotel)
- [ ] Subscription status endpoint
- [ ] Payment initialization
- [ ] PayHere webhook verification (valid signature)
- [ ] PayHere webhook verification (invalid signature)
- [ ] Subscription activation after payment
- [ ] Payment history recording
- [ ] Payment history retrieval
- [ ] Subscription cancellation
- [ ] Access control filter (active subscription)
- [ ] Access control filter (expired subscription)
- [ ] Scheduled task execution
- [ ] Email sending (all 4 types)
- [ ] Admin: View all subscriptions
- [ ] Admin: Subscription statistics
- [ ] Admin: Extend subscription
- [ ] Admin: Cancel subscription

### Frontend Tests
- [ ] SubscriptionBanner displays correctly
- [ ] Banner colors change based on days remaining
- [ ] Banner dismissal works
- [ ] Subscription purchase page loads
- [ ] Plan selection works (Monthly/Yearly)
- [ ] PayHere modal opens
- [ ] Payment success redirect
- [ ] Payment cancel redirect
- [ ] Payment history page displays
- [ ] Admin subscription dashboard loads
- [ ] Admin statistics display correctly
- [ ] Admin filters work (status, search)
- [ ] Admin pagination works
- [ ] Admin extend modal works
- [ ] Admin cancel confirmation works

### Integration Tests
- [ ] End-to-end: Register → Approve → Trial → Expire → Subscribe → Active
- [ ] End-to-end: Trial → Warning Email → Expire → Expiry Email
- [ ] End-to-end: Subscribe → Payment → Email → History
- [ ] End-to-end: Admin extends → Access restored
- [ ] End-to-end: Admin cancels → Access blocked

---

## Test Data Setup

### Create Test Users
```javascript
// Admin
{
  username: "admin",
  email: "admin@example.com",
  role: "PLATFORM_SUPER_ADMIN"
}

// DMC User (Trial)
{
  username: "dmc_trial",
  email: "dmc_trial@example.com",
  role: "DMC_SUPER_ADMIN",
  subscription: {
    status: "TRIAL",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
}

// Hotel User (Expired)
{
  username: "hotel_expired",
  email: "hotel_expired@example.com",
  role: "HOTEL_SUPER_ADMIN",
  subscription: {
    status: "EXPIRED",
    startDate: new Date("2025-12-01"),
    endDate: new Date("2025-12-31")
  }
}

// DMC User (Active Paid)
{
  username: "dmc_paid",
  email: "dmc_paid@example.com",
  role: "DMC_SUPER_ADMIN",
  subscription: {
    status: "ACTIVE",
    plan: "MONTHLY",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    amount: 200.00
  }
}
```

---

## PayHere Sandbox Credentials

**From application.properties:**
```properties
payhere.merchant.id=1228337
payhere.merchant.secret=[Your Secret]
payhere.currency=USD
app.base.url=http://localhost:5173
```

**Test Cards:**
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **Amex**: 378282246310005

**Test Credentials (if required):**
- Email: Any valid email
- Phone: Any 10 digits

---

## Troubleshooting

### Issue: Emails not sending
**Solution**: Check Gmail SMTP configuration:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```
Generate App Password: Google Account → Security → 2-Step Verification → App Passwords

### Issue: PayHere webhook not received
**Solution**: 
1. Use ngrok to expose localhost: `ngrok http 8080`
2. Update `app.base.url` to ngrok URL
3. Update PayHere `notify_url` to use ngrok URL

### Issue: Filter blocking login page
**Solution**: Verify excluded paths in SubscriptionFilter:
```java
if (requestPath.startsWith("/auth/")) {
    filterChain.doFilter(request, response);
    return;
}
```

### Issue: Scheduled task not running
**Solution**: Ensure `@EnableScheduling` in main application class

---

## Performance Testing

### Load Test Scenarios
1. **Concurrent Payments**: 100 users subscribing simultaneously
2. **Email Queue**: 1000 expiry warnings sent in batch
3. **Admin Dashboard**: Loading 10,000 subscriptions with filters

### Tools
- **JMeter**: For load testing REST APIs
- **Postman Collections**: For API regression testing
- **Selenium**: For frontend automated testing

---

## Security Testing

### Test Cases
1. **CSRF Protection**: Verify CSRF tokens on payment endpoints
2. **SQL Injection**: Try injecting SQL in search parameters
3. **XSS**: Try injecting scripts in user input fields
4. **Authorization**: Try accessing admin endpoints as regular user
5. **Payment Tampering**: Try modifying payment amounts in requests

---

## Monitoring

### Logs to Monitor
```bash
# Subscription creation
grep "Trial subscription created" backend.log

# Payment processing
grep "Payment initialization successful" backend.log
grep "Subscription activated successfully" backend.log

# Email sending
grep "Sent expiry warning" backend.log

# Scheduled task
grep "Starting subscription expiry check" backend.log
```

### Metrics to Track
- Subscription creation rate
- Payment success rate
- Email delivery rate
- Trial-to-paid conversion rate
- Average subscription duration
- Monthly recurring revenue (MRR)

---

## Sign-Off Checklist

Before marking complete:
- [ ] All backend endpoints tested and working
- [ ] All frontend components rendering correctly
- [ ] PayHere payment flow tested end-to-end
- [ ] Emails delivered successfully
- [ ] Access control filter blocking expired users
- [ ] Admin dashboard functional
- [ ] Payment history accurate
- [ ] Scheduled task tested manually
- [ ] Documentation complete
- [ ] No compilation errors
- [ ] No console errors in browser
- [ ] Security tested (authorization, validation)
- [ ] Performance acceptable (< 2s response times)

---

## Completion Date: _________________

**Tested By**: _________________

**Sign-Off**: _________________

---

**Note**: This is a comprehensive test plan. For initial deployment, focus on critical path testing (Scenarios 1-5) first, then proceed to advanced features (6-8) and finally security/performance testing (9).
