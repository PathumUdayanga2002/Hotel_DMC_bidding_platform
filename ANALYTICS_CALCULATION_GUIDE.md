# Platform Analytics Calculation Guide

## Overview
The Platform Analytics system provides comprehensive insights into revenue, performance, and hotel market data. All calculations are performed in the backend and displayed in the admin portal.

---

## 1. Revenue Analytics

### 📊 **Total Revenue (YTD)**
**Calculation:**
```java
Sum of all Payment.totalAmount where:
- PaymentStatus = COMPLETED
- PaymentCompletedAt > Start of Current Year
```

**What it represents:**
- Total money received from completed bookings this year
- Includes the full payment amount from DMCs

**Backend:** `PlatformAnalyticsServiceImpl.getRevenueAnalytics()`
```java
double totalRevenue = completedPayments.stream()
    .mapToDouble(p -> p.getTotalAmount())
    .sum();
```

---

### 💰 **Platform Commission**
**Calculation:**
```java
Sum of all Payment.platformCommission where:
- PaymentStatus = COMPLETED
- PaymentCompletedAt > Start of Current Year
```

**What it represents:**
- Platform's earnings from booking transactions
- The commission charged on each completed booking

**Backend:** `PlatformAnalyticsServiceImpl.getRevenueAnalytics()`
```java
double totalCommission = completedPayments.stream()
    .mapToDouble(p -> p.getPlatformCommission())
    .sum();
```

---

### 💳 **Subscription Revenue**
**Calculation:**
```java
Sum of all Subscription.amount where:
- Status = ACTIVE or TRIAL
- CreatedAt > Start of Current Year
```

**What it represents:**
- Revenue from user subscriptions (Monthly/Yearly plans)
- Separate from booking commissions

**Backend:** `PlatformAnalyticsServiceImpl.getRevenueAnalytics()`
```java
double subscriptionRevenue = activeSubscriptions.stream()
    .filter(s -> s.getStatus() == ACTIVE || s.getStatus() == TRIAL)
    .filter(s -> s.getCreatedAt().isAfter(startOfYear))
    .mapToDouble(s -> s.getAmount())
    .sum();
```

**Note:** The Total Revenue from subscriptions and commissions would be:
```
Total Platform Earnings = Platform Commission + Subscription Revenue
```

---

### 📈 **Average Booking Value**
**Calculation:**
```java
Total Revenue ÷ Total Completed Bookings
```

**What it represents:**
- Average amount per booking transaction
- Helps track booking value trends

**Backend:** `PlatformAnalyticsServiceImpl.getRevenueAnalytics()`
```java
double averageBookingValue = totalBookings > 0 
    ? totalRevenue / totalBookings 
    : 0.0;
```

---

### 📊 **Growth Rate (Year-over-Year)**
**Calculation:**
```java
((Current Year Revenue - Previous Year Revenue) / Previous Year Revenue) × 100
```

**What it represents:**
- Percentage change in revenue compared to last year
- Positive = growth, Negative = decline

**Backend:** `PlatformAnalyticsServiceImpl.getRevenueAnalytics()`
```java
double growthRate = previousYearRevenue > 0 
    ? ((totalRevenue - previousYearRevenue) / previousYearRevenue) * 100
    : (totalRevenue > 0 ? 100.0 : 0.0);
```

---

## 2. Platform Performance

### ✅ **Booking Success Rate**
**Calculation:**
```java
(Accepted Bids ÷ Total Bids) × 100
```

**What it represents:**
- Percentage of bids that were accepted by DMCs
- Higher = better bid quality and relevance

**Backend:** `PlatformAnalyticsServiceImpl.getPlatformPerformance()`
```java
long acceptedBids = allBids.stream()
    .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
    .count();

double bookingSuccessRate = totalBids > 0 
    ? (acceptedBids * 100.0) / totalBids 
    : 0.0;
```

**Data Source:** `hotel_bids` collection
- Total Bids = count of all HotelBid documents
- Accepted Bids = count where status = "ACCEPTED"

---

### ⏱️ **Average Response Time**
**Current Implementation:**
```java
Hardcoded: 24.0 hours
```

**What it should represent:**
- Average time from inquiry creation to first hotel bid
- Currently a placeholder value

**Backend:** `PlatformAnalyticsServiceImpl.getPlatformPerformance()`
```java
double averageResponseTime = 24.0; // Placeholder
```

**Future Enhancement:**
```java
// Calculate actual response time
double averageResponseTime = allBids.stream()
    .filter(bid -> bid.getInquiryCreatedAt() != null && bid.getSubmittedAt() != null)
    .mapToDouble(bid -> {
        Duration duration = Duration.between(bid.getInquiryCreatedAt(), bid.getSubmittedAt());
        return duration.toHours();
    })
    .average()
    .orElse(24.0);
```

---

### 😊 **User Satisfaction**
**Calculation:**
```java
(Completed Payments ÷ Total Payments) × 100
```

**What it represents:**
- Simplified satisfaction metric based on payment completion
- Assumption: Completed payment = satisfied customer

**Backend:** `PlatformAnalyticsServiceImpl.getPlatformPerformance()`
```java
long completedPayments = allPayments.stream()
    .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
    .count();

double userSatisfaction = allPayments.size() > 0
    ? (completedPayments * 100.0) / allPayments.size()
    : 0.0;
```

**Data Source:** `payments` collection
- Total Payments = all Payment documents
- Completed = where paymentStatus = "COMPLETED"

---

### ⚠️ **Dispute Rate**
**Calculation:**
```java
(Failed + Cancelled Payments ÷ Total Payments) × 100
```

**What it represents:**
- Percentage of problematic transactions
- Lower = better platform reliability

**Backend:** `PlatformAnalyticsServiceImpl.getPlatformPerformance()`
```java
long disputedPayments = allPayments.stream()
    .filter(p -> p.getPaymentStatus() == PaymentStatus.FAILED || 
                p.getPaymentStatus() == PaymentStatus.CANCELLED)
    .count();

double disputeRate = allPayments.size() > 0
    ? (disputedPayments * 100.0) / allPayments.size()
    : 0.0;
```

**Data Source:** `payments` collection
- Disputed = where paymentStatus = "FAILED" or "CANCELLED"

---

## 3. Top Market Hotels

### 🏆 **Hotel Rankings**
**Data Source:** All APPROVED hotels from `hotel_profiles` collection

**Calculation Process:**
1. Fetch all approved hotels
2. For each hotel, calculate:
   - **Total Bids**: Count of bids placed by this hotel
   - **Accepted Bids**: Count where status = "ACCEPTED"
   - **Success Rate**: (Accepted ÷ Total) × 100
   - **Total Revenue**: Sum of completed payments for this hotel
   - **Avg Bid Value**: Average of all bid amounts

**Backend:** `PlatformAnalyticsServiceImpl.getTopHotelMarkets()`
```java
// Get all approved hotels
List<HotelProfile> allHotels = hotelRepository.findByStatus("APPROVED");

// For each hotel:
List<HotelBid> hotelBids = allBids.stream()
    .filter(bid -> bid.getHotelUserId().equals(hotelUserId))
    .collect(Collectors.toList());

int totalBids = hotelBids.size();
long acceptedBids = hotelBids.stream()
    .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
    .count();
double successRate = totalBids > 0 ? (acceptedBids * 100.0) / totalBids : 0.0;

double totalRevenue = allPayments.stream()
    .filter(p -> p.getHotelUserId().equals(hotelUserId))
    .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
    .mapToDouble(p -> p.getTotalAmount())
    .sum();

double avgBidValue = hotelBids.stream()
    .mapToDouble(bid -> bid.getTotalPrice())
    .average()
    .orElse(0.0);
```

**Sorting Options:**
- `totalbids`: Sort by number of bids (default)
- `revenue`: Sort by total revenue
- `successrate`: Sort by success rate percentage
- `avgbidvalue`: Sort by average bid value

**Filtering Options:**
- `city`: Filter by city name (case-insensitive)
- `minStars`: Minimum star rating (1-5)
- `limit`: Number of hotels to show (5, 10, 20, 50)

---

## API Endpoints

### Revenue Analytics
```
GET /api/v1/admin/analytics/revenue
Response: {
  totalRevenueYTD: 150000.00,
  platformCommission: 15000.00,
  subscriptionRevenue: 5000.00,
  averageBookingValue: 2500.00,
  growthRate: 25.50,
  currency: "USD",
  totalBookingsYTD: 60
}
```

### Platform Performance
```
GET /api/v1/admin/analytics/performance
Response: {
  bookingSuccessRate: 75.50,
  averageResponseTime: 24.0,
  userSatisfaction: 85.20,
  disputeRate: 5.30,
  totalBids: 200,
  acceptedBids: 151,
  completedPayments: 150,
  totalDisputes: 9
}
```

### Top Hotels
```
GET /api/v1/admin/analytics/top-hotels?limit=10&sortBy=revenue&minStars=4&city=Colombo
Response: [
  {
    hotelId: "...",
    hotelName: "Grand Hotel",
    city: "Colombo",
    country: "Sri Lanka",
    totalBids: 50,
    acceptedBids: 40,
    successRate: 80.00,
    totalRevenue: 125000.00,
    averageBidValue: 2500.00,
    hotelStars: 5,
    status: "APPROVED"
  }
]
```

### Complete Analytics
```
GET /api/v1/admin/analytics?limit=10&sortBy=totalbids
Response: {
  revenueAnalytics: {...},
  platformPerformance: {...},
  topHotelMarkets: [...],
  generatedAt: "2026-01-13T00:45:30",
  period: "YTD 2026"
}
```

---

## Frontend Display

**Layout:**
```
Revenue Analytics (2 rows):
Row 1: [Total Revenue] [Platform Commission] [Subscription Revenue]
Row 2: [Average Booking Value] [Growth Rate]

Platform Performance (1 row):
[Booking Success Rate] [Avg Response Time] [User Satisfaction] [Dispute Rate]

Top Market Hotels (Table with filters):
- Sort by: Total Bids | Revenue | Success Rate | Avg Bid Value
- Filter: City, Star Rating, Limit
```

---

## Key Notes

1. **YTD (Year-to-Date)**: All calculations from January 1st of current year
2. **Currency**: All amounts in USD
3. **Rounding**: Values rounded to 2 decimal places
4. **Empty Data**: Returns 0.0 if no data available
5. **Real-time**: Data calculated on each request (no caching)
