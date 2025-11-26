# Frontend Payment System Documentation

## Overview

This document provides comprehensive information about the frontend payment system implementation for the Hotel DMC Bidding Platform. The payment system integrates with PayHere payment gateway for secure payment processing.

## Features

- **Payment Initiation**: DMC users can initiate payments after awarding bids
- **Payment Status Tracking**: Real-time payment status updates
- **Payment History**: View all payment transactions
- **Bank Account Management**: Hotels can manage their payout bank accounts
- **Admin Dashboard**: Complete payment and payout management
- **Secure PayHere Integration**: PCI-compliant payment processing

## Architecture

### Components Structure

```
frontend/src/
├── pages/
│   ├── PaymentInitiation.jsx        # DMC payment initiation page
│   ├── PaymentReturn.jsx            # Payment success/processing page
│   ├── PaymentCancel.jsx            # Payment cancellation page
│   ├── DMCPaymentHistory.jsx        # DMC payment history
│   ├── HotelPaymentHistory.jsx      # Hotel payment & bank details
│   ├── AdminPaymentDashboard.jsx    # Admin payment overview
│   └── AdminPayoutManagement.jsx    # Admin payout management
├── context/
│   └── AuthContext.jsx              # Authentication context
└── App.jsx                          # Route configuration
```

## Page Descriptions

### 1. PaymentInitiation.jsx

**Purpose**: Allow DMC users to review and initiate payment after awarding a bid.

**Features**:
- Payment summary with booking details
- 15-minute countdown timer
- Payment breakdown (total, commission, payout)
- Secure redirect to PayHere gateway
- Session storage for payment tracking

**Route**: `/payment/initiate?inquiryId={id}&bidId={id}`

**Access**: DMC Users only

**Key Functions**:
```javascript
// Initiate payment and redirect to PayHere
handleInitiatePayment()

// Fetch payment preview details
fetchPaymentPreview()
```

### 2. PaymentReturn.jsx

**Purpose**: Handle return from PayHere after payment completion.

**Features**:
- Payment status verification
- Real-time status polling
- Success/failure handling
- Automatic payment verification via webhook

**Route**: `/payment/return?order_id={orderId}`

**Access**: DMC Users only

**Status Flow**:
1. Processing → Verifying with PayHere
2. Success → Payment completed
3. Pending → Awaiting confirmation
4. Error → Payment failed

### 3. PaymentCancel.jsx

**Purpose**: Handle payment cancellation by user.

**Features**:
- Cancel confirmation message
- Retry payment option
- Navigation back to dashboard

**Route**: `/payment/cancel?order_id={orderId}`

**Access**: DMC Users only

### 4. DMCPaymentHistory.jsx

**Purpose**: Display payment history for DMC users.

**Features**:
- Paginated payment list
- Search by order ID or hotel
- Filter by payment status
- Payment details view
- Responsive table/card views

**Route**: `/dmc/payments`

**Access**: DMC Users only

**API Endpoints Used**:
```javascript
GET /api/payments/dmc/my-payments?page={page}&size={size}
```

### 5. HotelPaymentHistory.jsx

**Purpose**: Display payment history and manage bank details for hotels.

**Features**:
- **Payments Tab**:
  - View received payments
  - See payout status
  - Filter and search payments
  - View DMC information
  
- **Bank Details Tab**:
  - Add/update bank account information
  - View verification status
  - Required fields: Account holder, number, bank, branch, SWIFT code

**Route**: `/hotel/payments`

**Access**: Hotel Users only

**API Endpoints Used**:
```javascript
GET /api/payments/hotel/my-payments?page={page}&size={size}
POST /api/payments/hotel/bank-details
GET /api/payments/hotel/bank-details
```

### 6. AdminPaymentDashboard.jsx

**Purpose**: Admin overview of all payment transactions.

**Features**:
- Dashboard statistics:
  - Total payments
  - Completed payments
  - Pending payments
  - Platform balance (commission earned)
- Payment list with filters
- Quick actions:
  - Manage payouts
  - View platform balance
  - Verify bank details
- Search and filter capabilities

**Route**: `/admin/payments`

**Access**: Admin only

**API Endpoints Used**:
```javascript
GET /api/admin/payments?page={page}&size={size}
GET /api/admin/payments/status/{status}?page={page}&size={size}
GET /api/admin/payments/platform-balance
```

### 7. AdminPayoutManagement.jsx

**Purpose**: Admin management of hotel payouts.

**Features**:
- View all payouts requiring approval
- Approve/reject individual payouts
- View hotel bank details
- Process all approved payouts
- Filter by payout status
- Payout status tracking:
  - PENDING → Awaiting admin approval
  - APPROVED → Approved, awaiting processing
  - PROCESSING → Being processed via PayHere
  - COMPLETED → Payout successful
  - FAILED → Payout failed
  - CANCELLED → Payout cancelled

**Route**: `/admin/payouts`

**Access**: Admin only

**API Endpoints Used**:
```javascript
GET /api/admin/payments/status/COMPLETED?page={page}&size={size}
POST /api/admin/payments/approve-payout
POST /api/admin/payments/process-payouts
GET /api/admin/payments/hotel/{hotelUserId}/bank-details
```

## Payment Flow

### Complete Payment Journey

```
1. DMC Awards Bid
   └─→ InquiryDetailsPage.jsx: handleAwardBid()
       └─→ Backend: POST /api/bid-inquiries/{inquiryId}/award/{bidId}
           └─→ Returns: AwardBidResponse with payment details

2. Redirect to Payment Initiation
   └─→ Navigate to: /payment/initiate?inquiryId={id}&bidId={id}
       └─→ PaymentInitiation.jsx loads

3. DMC Reviews Payment Details
   └─→ 15-minute countdown starts
       └─→ Display: Total amount, commission, hotel payout
       └─→ User clicks "Proceed to Payment"

4. Initiate Payment
   └─→ Backend: POST /api/payments/initiate
       └─→ Creates Payment record
       └─→ Generates PayHere checkout URL with MD5 signature
       └─→ Returns: {checkoutUrl, paymentId, orderId}

5. Redirect to PayHere
   └─→ window.location.href = checkoutUrl
       └─→ User enters payment details on PayHere
       └─→ User completes payment

6. PayHere Processes Payment
   └─→ PayHere sends webhook notification
       └─→ Backend: POST /api/webhooks/payhere/notify
           └─→ Verifies MD5 signature
           └─→ Updates Payment status
           └─→ Updates PlatformBalance
           └─→ Sets Payout status to PENDING

7. User Returns from PayHere
   └─→ Redirect to: /payment/return?order_id={orderId}
       └─→ PaymentReturn.jsx loads
       └─→ Polls payment status every 3 seconds
       └─→ Displays success/failure message

8. Admin Approves Payout
   └─→ Admin Dashboard: /admin/payouts
       └─→ Admin reviews payout request
       └─→ Clicks "Approve"
       └─→ Backend: POST /api/admin/payments/approve-payout
           └─→ Updates Payout status to APPROVED

9. Automated Payout Processing
   └─→ Scheduled task runs every hour
       └─→ Backend: PaymentScheduler.processPendingPayouts()
           └─→ Finds APPROVED payouts
           └─→ Calls PayHere Payout API
           └─→ Updates Payout status to PROCESSING → COMPLETED

10. Hotel Receives Payout
    └─→ Bank account credited with 95% of payment amount
        └─→ Hotel can view in: /hotel/payments
```

## Configuration

### Environment Variables

Create `.env` file in frontend root:

```env
VITE_API_URL=http://localhost:8080/api
```

### Axios Configuration

Ensure axios is configured to use the API base URL:

```javascript
// src/services/api.js or similar
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true // For cookie-based auth
});

export default api;
```

## Security Features

### 1. Route Protection

All payment routes are protected by `ProtectedRoute` component:

```javascript
<Route
  path="/payment/initiate"
  element={
    <ProtectedRoute allowedRoles={['DMC_USER']}>
      <PaymentInitiation />
    </ProtectedRoute>
  }
/>
```

### 2. Payment Timeout

- 15-minute countdown timer prevents expired payments
- Auto-cancellation on backend after 15 minutes
- Visual countdown display for user awareness

### 3. Payment Verification

- Real-time payment status verification
- Polling mechanism to check webhook processing
- Signature verification on backend (MD5 hash)

### 4. Access Control

- DMC users can only see their own payments
- Hotel users can only see their received payments
- Admin users can see all payments
- Bank details are encrypted and secured

## Styling

The payment system uses **Tailwind CSS** for styling with a consistent color scheme:

### Color Palette

- **Primary**: Cyan-500 to Blue-600 (gradients)
- **Success**: Green-600
- **Warning**: Yellow-600
- **Error**: Red-600
- **Info**: Blue-600
- **Admin**: Purple-500 to Indigo-600

### Responsive Design

All pages are fully responsive with:
- Desktop: Full table views with all columns
- Tablet: Optimized layouts
- Mobile: Card-based views with essential information

### Icons

Using **Lucide React** icons throughout:
- CreditCard, Wallet, DollarSign (payment related)
- Clock, CheckCircle, XCircle (status indicators)
- Search, Filter (filtering/search)
- Calendar, FileText (data display)

## Testing

### Manual Testing Checklist

#### DMC Payment Flow
- [ ] Award a bid successfully
- [ ] Redirect to payment initiation page
- [ ] Verify payment details are correct
- [ ] Countdown timer displays and counts down
- [ ] Click "Proceed to Payment"
- [ ] Redirect to PayHere sandbox
- [ ] Complete payment with test card
- [ ] Redirect to payment return page
- [ ] Verify payment status updates
- [ ] Check payment appears in DMC payment history

#### Hotel Payout Flow
- [ ] Add bank account details
- [ ] Verify "Awaiting verification" status
- [ ] Admin verifies bank details
- [ ] Receive payment from DMC
- [ ] View payment in hotel payment history
- [ ] Check payout status is PENDING
- [ ] Admin approves payout
- [ ] Payout status changes to APPROVED
- [ ] Automated scheduler processes payout
- [ ] Payout status changes to COMPLETED

#### Admin Management
- [ ] View all payments in admin dashboard
- [ ] Filter payments by status
- [ ] Search payments by order ID
- [ ] View platform balance
- [ ] Navigate to payout management
- [ ] Approve pending payouts
- [ ] Manually trigger payout processing
- [ ] View hotel bank details

### Test Cards (PayHere Sandbox)

```
Visa (Success):
Card Number: 4916217501611292
CVV: 123
Expiry: 12/25

Mastercard (Success):
Card Number: 5307732125531996
CVV: 123
Expiry: 12/25

Amex (Success):
Card Number: 377798723487141
CVV: 1234
Expiry: 12/25
```

## Troubleshooting

### Common Issues

**Issue**: Payment initiation page shows "Invalid payment request"
- **Solution**: Ensure `inquiryId` and `bidId` are present in URL query params

**Issue**: Payment status stuck on "Processing"
- **Solution**: Check webhook is being received by backend. Verify PayHere notification URL is correct and accessible

**Issue**: Bank details not saving
- **Solution**: Verify all required fields are filled. Check API endpoint is correct and authentication is working

**Issue**: Countdown timer not displaying
- **Solution**: Check browser console for JavaScript errors. Ensure React hooks are working correctly

**Issue**: Payment history not loading
- **Solution**: Check API endpoint, verify authentication token, ensure pagination params are correct

**Issue**: Admin cannot see payments
- **Solution**: Verify user has ADMIN role. Check API endpoint authorization

## API Integration

### Payment Endpoints

```javascript
// DMC Endpoints
POST /api/payments/initiate
GET /api/payments/{paymentId}
GET /api/payments/order/{orderId}
GET /api/payments/dmc/my-payments?page={page}&size={size}

// Hotel Endpoints
GET /api/payments/hotel/my-payments?page={page}&size={size}
POST /api/payments/hotel/bank-details
GET /api/payments/hotel/bank-details

// Admin Endpoints
GET /api/admin/payments?page={page}&size={size}
GET /api/admin/payments/status/{status}?page={page}&size={size}
POST /api/admin/payments/approve-payout
POST /api/admin/payments/process-payouts
GET /api/admin/payments/platform-balance
GET /api/admin/payments/hotel/{id}/bank-details
POST /api/admin/payments/hotel/{id}/verify-bank-details

// Webhook Endpoints (called by PayHere)
POST /api/webhooks/payhere/notify
GET /api/webhooks/payhere/return
GET /api/webhooks/payhere/cancel
```

### Request/Response Examples

#### Initiate Payment

**Request**:
```javascript
POST /api/payments/initiate
{
  "inquiryId": "64a5b3f2e1234567890abcde",
  "bidId": "64a5b4a2e1234567890abcdf",
  "returnUrl": "http://localhost:5173/payment/return",
  "cancelUrl": "http://localhost:5173/payment/cancel",
  "notifyUrl": "http://localhost:8080/api/webhooks/payhere/notify"
}
```

**Response**:
```javascript
{
  "paymentId": "64a5b5e2e1234567890abce0",
  "orderId": "ORD-1234567890",
  "checkoutUrl": "https://sandbox.payhere.lk/pay/checkout?...",
  "totalAmount": 1000.00,
  "currency": "USD",
  "expiresAt": "2024-01-15T10:30:00Z"
}
```

## Deployment

### Production Checklist

- [ ] Update `.env` with production API URL
- [ ] Configure CORS on backend for production domain
- [ ] Update PayHere configuration to production endpoints
- [ ] Replace sandbox merchant credentials with production
- [ ] Set up SSL certificate for webhook URL
- [ ] Test payment flow end-to-end in production
- [ ] Set up error logging and monitoring
- [ ] Configure backup and disaster recovery

### Build Command

```bash
npm run build
```

### Environment Variables for Production

```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Support

For issues or questions:
- Backend API Documentation: See `PAYMENT_SYSTEM_README.md`
- PayHere Documentation: https://support.payhere.lk/
- Project Repository: [Your GitHub repo]

## License

[Your License]

---

**Last Updated**: January 2024  
**Version**: 1.0.0
