# Bid Inquiry System - Backend Development Summary

## 📋 Overview
Complete backend implementation for DMC Bid Inquiry and Hotel Bidding system with 48-hour deadline, multiple city selection, email and in-app notifications.

---

## 🏗️ Architecture Components

### **1. Data Layer (Entities) ✅**
- `BidInquiry.java` - DMC inquiry entity with multiple cities, dates, rooms, guests, preferences
- `HotelBid.java` - Hotel bid entity with pricing, terms, negotiation capability
- `Notification.java` - In-app notification entity with priority levels

### **2. Constants/Enums ✅**
- `BidInquiryStatus` - OPEN, CLOSED, AWARDED, CANCELLED
- `BidStatus` - PENDING, ACCEPTED, REJECTED, WITHDRAWN
- `RoomType` - STANDARD, DELUXE, SUITE, EXECUTIVE, PRESIDENTIAL
- `MealPlan` - ROOM_ONLY, BREAKFAST, HALF_BOARD, FULL_BOARD, ALL_INCLUSIVE
- `NotificationType` - NEW_INQUIRY, NEW_BID, BID_ACCEPTED, BID_REJECTED, INQUIRY_CLOSED, INQUIRY_CANCELLED, DEADLINE_APPROACHING

### **3. DTOs (Request/Response) ✅**
**Request DTOs:**
- `CreateBidInquiryRequest` - 15 fields with Jakarta validation (@NotBlank, @Future, @Min/@Max, @Pattern)
- `UpdateBidInquiryRequest` - Optional fields + changeDescription for edit history
- `CreateHotelBidRequest` - 16 fields with validation
- `UpdateHotelBidRequest` - Optional fields + changeDescription

**Response DTOs:**
- `BidInquiryResponse` - Complete inquiry data
- `HotelBidResponse` - Complete bid data
- `NotificationResponse` - Notification data with read status
- `BidInquiryStatsResponse` - DMC dashboard statistics
- `HotelBidStatsResponse` - Hotel dashboard statistics with win rate

### **4. Repositories ✅**
**BidInquiryRepository:**
- `findByDmcUserId()` - Get inquiries by DMC
- `findByDmcUserIdAndStatus()` - Filter by status
- `findByDestinationCitiesContainingAndStatus()` - Find by cities
- `findByStatusAndDeadlineBefore()` - Find expired inquiries
- `searchByTitleOrDescription()` - Search with keyword
- `countByDmcUserIdAndStatus()` - Count statistics

**HotelBidRepository:**
- `findByInquiryId()` - Get all bids for inquiry
- `findByHotelUserId()` - Get bids by hotel
- `findByInquiryIdAndHotelUserId()` - Check if hotel already bid
- `findByHotelUserIdAndStatus()` - Filter by status
- `searchByTitleOrDescription()` - Search bids
- `countByHotelUserIdAndStatus()` - Count statistics

**NotificationRepository:**
- `findByRecipientUserIdOrderByCreatedAtDesc()` - Get user notifications
- `findByRecipientUserIdAndReadFalse()` - Get unread notifications
- `countByRecipientUserIdAndReadFalse()` - Count unread
- `deleteByCreatedAtBefore()` - Cleanup old notifications

### **5. Services (Business Logic) ✅**

**BidInquiryService/Impl (370 lines):**
- `createInquiry()` - Validates DMC approval, auto-generates 48-hour deadline, notifies hotels in matching cities
- `updateInquiry()` - Updates with edit history tracking
- `getInquiryById()` - Fetch inquiry details
- `getInquiriesByDmcUser()` - Pagination support
- `getInquiriesByDmcUserAndStatus()` - Filter by status
- `getAvailableInquiriesForHotel()` - Find open inquiries for hotel city
- `closeInquiry()` - Manual close by DMC
- `cancelInquiry()` - Cancel inquiry
- `awardInquiry()` - Accept a bid, close inquiry
- `autoCloseExpiredInquiries()` - Scheduled task to auto-close
- `getInquiryStats()` - Dashboard statistics

**HotelBidService/Impl (330 lines):**
- `createBid()` - Validates hotel approval, inquiry open status, price within budget
- `updateBid()` - Updates with price history
- `getBidById()` - Fetch bid details
- `getBidsByInquiryId()` - Get all bids for DMC review
- `getBidsByHotelUser()` - Get hotel's bids
- `acceptBid()` - DMC accepts bid (awards inquiry)
- `rejectBid()` - DMC rejects bid with reason
- `withdrawBid()` - Hotel withdraws bid
- `addNegotiationNotes()` - Add negotiation comments
- `getBidStats()` - Dashboard statistics with win rate

**NotificationService/Impl (370 lines):**
- `createNotification()` - General notification creation
- `notifyHotelsAboutNewInquiry()` - Finds approved hotels in matching cities, sends email + in-app notification
- `notifyDmcAboutNewBid()` - Notify DMC when hotel submits bid
- `notifyHotelAboutBidAcceptance()` - Congratulations email + notification
- `notifyHotelAboutBidRejection()` - Rejection notification with reason
- `notifyHotelsAboutInquiryClosed()` - Notify all bidding hotels
- `notifyAboutApproachingDeadline()` - 24-hour deadline warning
- `markAsRead()` - Mark notification as read
- `markAllAsRead()` - Bulk mark as read

**EmailService/Impl:**
- Existing: DMC and Hotel approval/rejection emails
- **New Methods Added:**
  - `sendNewInquiryNotificationToHotel()` - Detailed inquiry notification with deadline
  - `sendNewBidNotificationToDmc()` - Bid received notification with price
  - `sendBidAcceptanceNotificationToHotel()` - Congratulations email with booking value
  - `sendBidRejectionNotificationToHotel()` - Rejection with feedback

### **6. Controllers (REST API) ✅**

**DMCBidInquiryController** (`/api/dmc/inquiries`)
- `POST /` - Create inquiry
- `GET /my-inquiries` - Get DMC's inquiries (paginated, filterable by status)
- `GET /{inquiryId}` - Get inquiry details
- `PUT /{inquiryId}` - Update inquiry
- `PUT /{inquiryId}/close` - Close inquiry
- `PUT /{inquiryId}/cancel` - Cancel inquiry
- `PUT /{inquiryId}/award/{bidId}` - Award bid
- `GET /{inquiryId}/bids` - Get all bids for inquiry
- `GET /stats` - Get DMC statistics
- `GET /search` - Search inquiries by keyword

**HotelBidController** (`/api/hotel`)
- `GET /inquiries/available` - Get available inquiries (filtered by hotel city)
- `GET /inquiries/{inquiryId}` - Get inquiry details (with view count increment)
- `POST /bids` - Submit bid
- `GET /bids/my-bids` - Get hotel's bids
- `GET /bids/{bidId}` - Get bid details
- `PUT /bids/{bidId}` - Update bid
- `PUT /bids/{bidId}/withdraw` - Withdraw bid
- `POST /bids/{bidId}/negotiate` - Add negotiation notes
- `GET /bids/stats` - Get hotel statistics
- `GET /bids/search` - Search bids by keyword

**NotificationController** (`/api/notifications`)
- `GET /` - Get all notifications (paginated)
- `GET /unread-count` - Get unread count (for bell icon badge)
- `PUT /{notificationId}/mark-read` - Mark as read
- `PUT /mark-all-read` - Mark all as read
- `DELETE /{notificationId}` - Delete notification

### **7. Scheduled Tasks ✅**
**BidInquiryScheduler:**
- `autoCloseExpiredInquiries()` - Runs every 30 minutes, auto-closes inquiries past 48-hour deadline
- `@EnableScheduling` added to `BackendApplication.java`

---

## 🔐 Security Features

### **Authentication & Authorization**
- JWT with HttpOnly cookies (XSS protection)
- BCrypt password hashing (strength 12)
- Role-based access control:
  - `@PreAuthorize("hasRole('DMC_USER')")` - DMC endpoints
  - `@PreAuthorize("hasRole('HOTEL_USER')")` - Hotel endpoints
  - `@PreAuthorize("hasAnyRole('DMC_USER', 'HOTEL_USER')")` - Notification endpoints

### **Validation**
- Only APPROVED DMCs can post inquiries
- Only APPROVED hotels can submit bids
- Date validation (check-in must be future date)
- Budget validation (budgetMax >= budgetMin)
- Price validation (bid price within budget range)
- Inquiry must be OPEN for bids
- 48-hour deadline enforced

---

## 📧 Notification System

### **Dual Notification Approach**
1. **Email Notifications** (@Async, non-blocking):
   - New inquiry alert to hotels in matching cities
   - New bid alert to DMC
   - Bid acceptance/rejection notifications
   
2. **In-App Notifications**:
   - Bell icon with unread badge
   - Priority levels (1=High, 2=Medium, 3=Low)
   - Read/unread status tracking
   - Direct action URLs

---

## 🔄 Key Workflows

### **1. DMC Posts Inquiry**
```
DMC creates inquiry → 
System validates DMC approval → 
Auto-generates 48-hour deadline → 
Finds approved hotels in matching cities → 
Sends email + in-app notifications to hotels → 
Inquiry status: OPEN
```

### **2. Hotel Submits Bid**
```
Hotel views inquiry (view count++) → 
Hotel submits bid → 
System validates hotel approval, inquiry open, price within budget → 
Increments bid count on inquiry → 
Sends email + in-app notification to DMC → 
Bid status: PENDING
```

### **3. DMC Awards Bid**
```
DMC reviews all bids → 
DMC accepts winning bid → 
Bid status: ACCEPTED → 
Inquiry status: AWARDED → 
Sends congratulations email + notification to winning hotel → 
Sends rejection emails + notifications to other bidding hotels
```

### **4. Auto-Close Expired Inquiries**
```
Scheduler runs every 30 minutes → 
Finds inquiries past 48-hour deadline with status OPEN → 
Changes status to CLOSED → 
Sends notifications to all bidding hotels → 
Logs closure
```

---

## 📊 Statistics/Dashboards

### **DMC Dashboard (BidInquiryStatsResponse)**
- Total inquiries posted
- Open inquiries count
- Closed inquiries count
- Awarded inquiries count
- Cancelled inquiries count
- Total bids received

### **Hotel Dashboard (HotelBidStatsResponse)**
- Total bids submitted
- Pending bids count
- Accepted bids count
- Rejected bids count
- Withdrawn bids count
- **Win rate** (accepted / total bids * 100)

---

## 🛠️ Technical Stack

- **Backend:** Spring Boot 3.5.7, Java 17
- **Database:** MongoDB with Spring Data MongoDB
- **Security:** Spring Security, JWT (HMAC-SHA256)
- **Email:** Spring Mail (@Async)
- **Validation:** Jakarta Validation
- **Scheduling:** Spring Scheduling
- **Build Tool:** Maven

---

## ✅ Build Status

```
[INFO] BUILD SUCCESS
[INFO] Total time:  7.064 s
[INFO] 106 source files compiled successfully
```

---

## 🚀 Next Steps

### **Backend (Optional Enhancements)**
1. Add deadline approaching notification scheduler (24 hours before)
2. Implement pagination sorting options
3. Add more search filters (date range, budget range)
4. Add bid comparison endpoint for DMC
5. Add bid history endpoint

### **Frontend Development (Main Task)**
1. **DMC Dashboard:**
   - Post Inquiry Form (multi-select cities dropdown)
   - My Inquiries List (tabs: All, Open, Closed, Awarded, Cancelled)
   - View Bids Page (side-by-side comparison table)
   - Accept/Reject Bid Actions
   - Inquiry Details Page

2. **Hotel Dashboard:**
   - Available Inquiries List (filtered by hotel city)
   - Inquiry Details Page
   - Submit Bid Form (price calculator)
   - My Bids List (tabs: All, Pending, Accepted, Rejected)
   - Edit/Withdraw Bid Actions

3. **Notification System:**
   - Bell icon with unread badge (real-time count)
   - Notification dropdown (latest 10)
   - Notification page (all notifications with pagination)
   - Mark as read functionality
   - Direct action links

4. **Integration:**
   - API service layer (axios)
   - State management (Context API or Redux)
   - Protected routes by role
   - Real-time updates (WebSocket or polling)

---

## 📝 API Endpoints Summary

### DMC Endpoints
- `POST /api/dmc/inquiries` - Create inquiry
- `GET /api/dmc/inquiries/my-inquiries` - List inquiries
- `GET /api/dmc/inquiries/{id}` - Get inquiry details
- `PUT /api/dmc/inquiries/{id}` - Update inquiry
- `PUT /api/dmc/inquiries/{id}/close` - Close inquiry
- `PUT /api/dmc/inquiries/{id}/cancel` - Cancel inquiry
- `PUT /api/dmc/inquiries/{id}/award/{bidId}` - Award bid
- `GET /api/dmc/inquiries/{id}/bids` - Get bids for inquiry
- `GET /api/dmc/inquiries/stats` - Get statistics
- `GET /api/dmc/inquiries/search` - Search inquiries

### Hotel Endpoints
- `GET /api/hotel/inquiries/available` - Get available inquiries
- `GET /api/hotel/inquiries/{id}` - Get inquiry details
- `POST /api/hotel/bids` - Submit bid
- `GET /api/hotel/bids/my-bids` - List my bids
- `GET /api/hotel/bids/{id}` - Get bid details
- `PUT /api/hotel/bids/{id}` - Update bid
- `PUT /api/hotel/bids/{id}/withdraw` - Withdraw bid
- `POST /api/hotel/bids/{id}/negotiate` - Add negotiation note
- `GET /api/hotel/bids/stats` - Get statistics
- `GET /api/hotel/bids/search` - Search bids

### Notification Endpoints
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/{id}/mark-read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete notification

---

## 🔒 Security Concerns (Identified Earlier - Not Fixed)

**CRITICAL ISSUES (Deferred):**
1. All secrets exposed in `application.properties` (JWT secret, MongoDB URI, Cloudinary, Email credentials)
2. No refresh token implementation
3. 15-minute token expiration too short (should be 1 hour)
4. No rate limiting on API endpoints
5. No password complexity requirements
6. No account lockout after failed attempts

**Recommendation:** Move secrets to environment variables or use Spring Cloud Config before production deployment.

---

**🎉 Backend development complete! Ready for frontend integration.**
