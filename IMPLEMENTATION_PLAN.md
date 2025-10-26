# Hotel & DMC Bidding Platform - Implementation Plan

## 🎯 Project Overview
**Tech Stack:**
- Backend: Spring Boot 3.5.7 + Java 17
- Frontend: React 19 + Vite + TailwindCSS
- Database: MongoDB
- Payment: Stripe (Phase 1) + PayHere (Phase 2)
- Email: Spring Mail
- Architecture: RESTful API

---

## 📋 Implementation Phases

### **PHASE 1: Foundation & Authentication** (Week 1-2)
**Goal:** Set up project structure, database, authentication system

#### Backend Tasks:
- [x] Initial Spring Boot setup
- [ ] Configure MongoDB connection
- [ ] Set up project package structure
- [ ] Implement JWT authentication
- [ ] Create User entity and repository
- [ ] Registration API (Hotel & DMC)
- [ ] Login/Logout APIs
- [ ] Email verification (OTP)
- [ ] Password reset functionality
- [ ] Role-based authorization

#### Frontend Tasks:
- [ ] Set up routing (React Router)
- [ ] Create layout components (Header, Footer, Sidebar)
- [ ] Design authentication pages:
  - Landing page
  - Hotel registration form (multi-step)
  - DMC registration form (multi-step)
  - Login page
  - Email verification page
  - Password reset page
- [ ] Set up Axios/Fetch for API calls
- [ ] Implement authentication context/state
- [ ] Protected route component

#### Database Collections:
```javascript
users: {
  _id, email, password (hashed), role: "hotel_user|dmc_user|admin",
  status: "pending|approved|rejected|suspended",
  emailVerified: boolean, verificationToken, resetToken,
  createdAt, updatedAt, lastLogin
}
```

---

### **PHASE 2: Hotel Management** (Week 3-4)
**Goal:** Complete hotel profile, room management, rate plans, supplements

#### Backend Tasks:
- [ ] Hotel entity and repository
- [ ] Hotel profile CRUD APIs
- [ ] Room type management APIs
- [ ] Rate plan CRUD APIs (Wish/Want/Walk rates)
- [ ] Supplement CRUD APIs (Mandatory/Optional)
- [ ] File upload service (images, brochure PDF)
- [ ] Integration with cloud storage (AWS S3 or Cloudinary)

#### Frontend Tasks:
- [ ] Hotel dashboard layout
- [ ] Hotel profile management page
- [ ] Room type management UI
  - Add/Edit/Delete room types
  - Upload room images
  - Multi-image gallery component
- [ ] Rate plan management UI
  - Season selector (Summer/Winter)
  - Rate tier input (Wish/Want/Walk)
  - Room type mapping
- [ ] Supplements management UI
  - Add/Edit/Delete supplements
  - Date range picker
  - Mandatory/Optional toggle
- [ ] Facility images upload
- [ ] Brochure/video link upload
- [ ] Image preview and crop functionality

#### Database Collections:
```javascript
hotels: {
  _id, userId (ref: users),
  propertyName, city, starRating,
  contacts: [{firstName, lastName, designation, mobile, email}],
  rooms: [{
    roomType, numberOfRooms, specialFeatures,
    amenities: [], roomSize, images: []
  }],
  facilityImages: {pool: [], restaurant: [], spa: [], garden: [], other: []},
  services: [], brochure: {type: "pdf|video", url},
  ratePlans: [{
    season: "summer|winter",
    roomType, stayFrom, stayTo,
    wishRate, wantRate, walkRate
  }],
  supplements: [{
    name, fromDate, toDate, type: "mandatory|optional",
    ratePerPerson, ratePerRoom
  }],
  status: "pending|approved|rejected",
  createdAt, updatedAt
}
```

---

### **PHASE 3: DMC Management & Hotel Discovery** (Week 5-6)
**Goal:** DMC profile, hotel search, filtering

#### Backend Tasks:
- [ ] DMC entity and repository
- [ ] DMC profile CRUD APIs
- [ ] Hotel search and filter APIs
  - Search by city, star rating, amenities
  - Filter by price range
  - Pagination support
- [ ] Hotel detail view API
- [ ] Favorite hotels feature

#### Frontend Tasks:
- [ ] DMC dashboard layout
- [ ] DMC profile management page
- [ ] Hotel search page
  - Search bar with filters
  - Filter sidebar (city, star, price, amenities)
  - Hotel card grid view
  - Pagination
- [ ] Hotel detail view page
  - Image gallery
  - Room types display
  - Facilities showcase
  - Reviews section
  - Rate plans preview
- [ ] Favorite hotels list

#### Database Collections:
```javascript
dmcs: {
  _id, userId (ref: users),
  companyName, address: {no, city, country},
  businessRegNumber, sltdaCertificate,
  generalContact, email,
  handlingMarkets: ["Indian", "European", ...],
  contactPersons: [{
    name, email, contactNumber, generalLine, mobile, designation, market
  }],
  status: "pending|approved|rejected",
  createdAt, updatedAt
}

favorites: {
  _id, dmcId (ref: dmcs), hotelId (ref: hotels), createdAt
}
```

---

### **PHASE 4: Direct Inquiry Workflow** (Week 6-7)
**Goal:** DMC can inquire to specific hotel, negotiation flow

#### Backend Tasks:
- [ ] Inquiry entity and repository
- [ ] Create inquiry API
- [ ] Hotel response APIs
  - Offer Wish rate
  - Approve Want rate
  - Offer Walk rate
- [ ] Negotiation state machine
- [ ] Inquiry status tracking
- [ ] Email notifications for inquiry events

#### Frontend Tasks:
- [ ] Inquiry form (DMC side)
  - Hotel selection
  - Date picker (check-in/out)
  - Room type, meal plan, pax
  - Special requests
- [ ] DMC inquiry history page
- [ ] Hotel inquiry inbox
- [ ] Inquiry detail view (both sides)
- [ ] Negotiation interface
  - Show current rate offer
  - Request better rate button (DMC)
  - Approve/Reject buttons (Hotel)
- [ ] Status indicators (pending, negotiation, confirmed)

#### Database Collections:
```javascript
inquiries: {
  _id, dmcId (ref: dmcs), hotelId (ref: hotels),
  checkInDate, checkOutDate, roomType, numberOfRooms,
  bedType, mealPlan, adults, children, specialRequests, notes,
  status: "pending|wish_offered|negotiation_requested|want_offered|
           want_accepted|walk_offered|walk_accepted|payment_pending|
           confirmed|cancelled",
  currentRate: {type: "wish|want|walk", amount, breakdown},
  negotiationHistory: [{
    timestamp, action, performedBy, rate, message
  }],
  createdAt, updatedAt
}
```

---

### **PHASE 5: Bidding Workflow** (Week 7-8)
**Goal:** DMC creates bids, hotels submit bids, DMC selects winner

#### Backend Tasks:
- [ ] Bidding entity and repository
- [ ] Create bidding API (DMC)
- [ ] List active biddings API (Hotel)
- [ ] Submit/Update bid API (Hotel)
- [ ] Bid comparison API (DMC)
- [ ] Select winner API (DMC)
- [ ] Bid status management
- [ ] Auto-close bidding after deadline
- [ ] Email notifications for bidding events

#### Frontend Tasks:
- [ ] Create bidding form (DMC)
  - City, dates, pax, meal plan
  - Star class, room type
  - Bid end date/time picker
  - Region selection
- [ ] DMC bidding history page
- [ ] Active biddings list (Hotel side)
- [ ] Bid submission form (Hotel)
  - Pricing for single/double/triple
  - Child rates
  - Supplements inclusion
  - Remarks
- [ ] Bid comparison table (DMC)
  - Hotel details with reviews, star class
  - Pricing comparison
  - Supplements breakdown
  - Select winner button
- [ ] Bidding status tracking

#### Database Collections:
```javascript
biddings: {
  _id, dmcId (ref: dmcs),
  city, checkInDate, checkOutDate,
  numberOfPax: {adults, children},
  mealPlan, starClass, roomType,
  specialRequest, notes,
  bidEndDateTime, publishedRegions: [],
  status: "open|closed|winner_selected|cancelled",
  bids: [{
    hotelId (ref: hotels), 
    pricing: {single, double, triple, childRate},
    supplements: [{name, amount}],
    totalAmount, remarks, submittedAt, updatedAt
  }],
  winnerId (ref: hotels),
  createdAt, updatedAt
}
```

---

### **PHASE 6: Booking & Payment** (Week 8-9)
**Goal:** Payment integration, booking confirmation, voucher generation

#### Backend Tasks:
- [ ] Booking entity and repository
- [ ] Stripe integration
  - Payment intent creation
  - Payment confirmation webhook
- [ ] Create booking API
- [ ] Booking status management
- [ ] Voucher generation (PDF)
- [ ] Email voucher to DMC and Hotel
- [ ] Booking lifecycle management
  - Confirmed → Checked In → Checked Out → Completed
- [ ] Commission calculation
- [ ] Supplement auto-application logic

#### Frontend Tasks:
- [ ] Payment page
  - Booking summary
  - Supplement breakdown
  - Total amount display
  - Stripe payment form
  - Payment confirmation UI
- [ ] Booking confirmation page
- [ ] View voucher page
- [ ] Download voucher button
- [ ] Booking history (DMC & Hotel)
- [ ] Booking detail view
- [ ] Mark as checked-in/out (Hotel)

#### Database Collections:
```javascript
bookings: {
  _id, 
  sourceType: "inquiry|bidding",
  sourceId (ref: inquiries or biddings),
  dmcId (ref: dmcs), hotelId (ref: hotels),
  checkInDate, checkOutDate,
  roomDetails: {roomType, numberOfRooms, bedType, mealPlan},
  guestDetails: {adults, children},
  baseAmount, 
  supplements: [{name, type, amount}],
  totalAmount, commissionAmount: 0,
  paymentId (ref: payments),
  voucherUrl,
  status: "payment_pending|confirmed|checked_in|checked_out|
           completed|cancelled|refunded",
  commissionStatus: "pending|collected",
  specialRequests, notes,
  createdAt, updatedAt, confirmedAt, checkedInAt, checkedOutAt
}

payments: {
  _id, bookingId (ref: bookings),
  amount, currency: "USD",
  stripePaymentIntentId, stripeChargeId,
  paymentMethod, status: "pending|succeeded|failed|refunded",
  metadata, paidAt, refundedAt, createdAt
}
```

---

### **PHASE 7: Messaging & Notifications** (Week 9-10)
**Goal:** In-platform chat, email notifications, real-time updates

#### Backend Tasks:
- [ ] Message entity and repository
- [ ] Send message API
- [ ] Get conversation API
- [ ] Mark message as read API
- [ ] File attachment support
- [ ] WebSocket setup (optional for real-time)
- [ ] Notification service
- [ ] Email template system
- [ ] Notification preferences

#### Frontend Tasks:
- [ ] Messaging interface
  - Conversation list
  - Chat window
  - Message composer
  - File attachment
- [ ] Notification bell icon
- [ ] Notification dropdown
- [ ] Mark as read functionality
- [ ] Email notification preferences page

#### Database Collections:
```javascript
messages: {
  _id,
  conversationId: "inquiry_<id>|booking_<id>",
  senderId (ref: users), senderRole,
  receiverId (ref: users), receiverRole,
  message, attachments: [{filename, url}],
  isRead, readAt, sentAt, createdAt
}

notifications: {
  _id, userId (ref: users),
  type: "inquiry|bid|booking|message|payment|approval",
  title, message, link,
  isRead, readAt, createdAt
}
```

---

### **PHASE 8: Reviews & Ratings** (Week 10)
**Goal:** Bidirectional review system

#### Backend Tasks:
- [ ] Review entity and repository
- [ ] Submit review API
- [ ] Get reviews API (for hotel/DMC)
- [ ] Average rating calculation
- [ ] Review moderation (optional)

#### Frontend Tasks:
- [ ] Review submission form
  - Star rating component
  - Comment textarea
  - Submit after booking completion
- [ ] Review display on hotel profile
- [ ] Review display on DMC dashboard
- [ ] Average rating badge

#### Database Collections:
```javascript
reviews: {
  _id, bookingId (ref: bookings),
  reviewerId (ref: users), reviewerType: "hotel|dmc",
  revieweeId (ref: users), revieweeType: "hotel|dmc",
  rating: 1-5, comment,
  status: "published|hidden",
  createdAt, updatedAt
}
```

---

### **PHASE 9: Admin Panel** (Week 11-12)
**Goal:** User approval, commission tracking, analytics

#### Backend Tasks:
- [ ] Admin dashboard APIs
- [ ] User approval/rejection APIs
- [ ] Commission tracking APIs
- [ ] Analytics APIs
  - Total bookings
  - Revenue
  - User stats
  - Popular hotels/cities
- [ ] Report generation

#### Frontend Tasks:
- [ ] Admin dashboard
- [ ] Pending registrations page
  - Hotel approval form
  - DMC approval form
  - Approve/Reject actions
- [ ] User management page
  - List all users
  - Suspend/Activate accounts
  - View user details
- [ ] Commission tracking page
  - Pending commissions
  - Collected commissions
  - Payment history
- [ ] Analytics dashboard
  - Charts and graphs
  - Key metrics
  - Filters by date range
- [ ] Booking management
  - View all bookings
  - Dispute resolution

#### Database Collections:
```javascript
commissions: {
  _id, bookingId (ref: bookings), hotelId (ref: hotels),
  bookingAmount, commissionRate: 5, commissionAmount,
  status: "pending|collected",
  collectedAt, createdAt
}

adminLogs: {
  _id, adminId (ref: users),
  action: "approve_hotel|reject_dmc|suspend_user|etc",
  targetId, details, timestamp
}
```

---

## 🛠️ Development Best Practices

### Backend:
1. **Package Structure:**
```
com.hotel_bidding.backend/
├── config/          # Security, MongoDB, Stripe config
├── controller/      # REST endpoints
├── dto/             # Request/Response DTOs
├── entity/          # MongoDB documents
├── repository/      # MongoDB repositories
├── service/         # Business logic
├── security/        # JWT, auth filters
├── util/            # Helper classes
├── exception/       # Custom exceptions
└── constants/       # Enums, constants
```

2. **Use DTOs** for API requests/responses (don't expose entities)
3. **Validation** using `@Valid` annotations
4. **Global exception handler** for consistent error responses
5. **Logging** using SLF4J
6. **API versioning** (/api/v1/...)
7. **Unit tests** for services
8. **Integration tests** for controllers

### Frontend:
1. **Folder Structure:**
```
src/
├── components/      # Reusable components
│   ├── common/      # Buttons, inputs, modals
│   ├── layout/      # Header, footer, sidebar
│   └── features/    # Feature-specific components
├── pages/           # Route pages
├── services/        # API calls
├── context/         # React context (auth, theme)
├── hooks/           # Custom hooks
├── utils/           # Helper functions
├── constants/       # Constants
└── styles/          # Global styles
```

2. **Component naming:** PascalCase
3. **State management:** Context API + useReducer (or Redux if needed)
4. **Form validation:** React Hook Form + Yup
5. **API layer:** Axios with interceptors
6. **Error handling:** Toast notifications
7. **Loading states** for all async operations
8. **Responsive design:** Mobile-first approach with TailwindCSS

### Database:
1. **Indexing:** Add indexes on frequently queried fields (email, city, dates)
2. **Timestamps:** Use `createdAt`, `updatedAt` for all collections
3. **Soft delete:** Use status field instead of deleting records
4. **References:** Use ObjectId references for relationships
5. **Validation:** Use MongoDB schema validation

---

## 🎨 UI/UX Guidelines

### Design System:
- **Colors:**
  - Primary: Blue (#3B82F6)
  - Secondary: Green (#10B981)
  - Accent: Orange (#F59E0B)
  - Danger: Red (#EF4444)
  - Neutral: Gray shades
  
- **Typography:**
  - Headings: Inter or Poppins
  - Body: Inter or Roboto
  
- **Spacing:** Use TailwindCSS spacing scale (4px increments)

### Responsive Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Key UI Components:
- [ ] Button (primary, secondary, outline, danger)
- [ ] Input fields (text, email, password, number, date)
- [ ] Select dropdown
- [ ] Multi-select with search
- [ ] Date range picker
- [ ] File upload with preview
- [ ] Modal/Dialog
- [ ] Toast notifications
- [ ] Loading spinner
- [ ] Pagination
- [ ] Table with sorting
- [ ] Card component
- [ ] Badge/Tag
- [ ] Avatar
- [ ] Rating stars
- [ ] Progress bar
- [ ] Tabs
- [ ] Accordion

---

## 📝 API Documentation

Use **Swagger/OpenAPI** for API documentation:
- Add `springdoc-openapi-starter-webmvc-ui` dependency
- Access at: `http://localhost:8080/swagger-ui.html`

---

## 🔒 Security Checklist

- [ ] JWT token expiration (15 min access, 7 days refresh)
- [ ] Password hashing with BCrypt
- [ ] HTTPS in production
- [ ] CORS configuration
- [ ] Rate limiting for APIs
- [ ] SQL injection prevention (MongoDB query sanitization)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] File upload validation (type, size)
- [ ] Email verification before account activation
- [ ] Strong password policy

---

## 🚀 Deployment Plan

### Development:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- MongoDB: Local or MongoDB Atlas

### Production:
- Backend: Deploy to AWS EC2 / Heroku / Railway
- Frontend: Deploy to Vercel / Netlify
- MongoDB: MongoDB Atlas
- File Storage: AWS S3 or Cloudinary
- SSL Certificate: Let's Encrypt

---

## 📊 Success Metrics

- [ ] All registration flows working
- [ ] Authentication secure and functional
- [ ] Hotel profile management complete
- [ ] DMC can search and view hotels
- [ ] Direct inquiry workflow functional
- [ ] Bidding workflow functional
- [ ] Payment integration working (Stripe)
- [ ] Voucher generation working
- [ ] Messaging system functional
- [ ] Reviews working
- [ ] Admin can approve users
- [ ] Commission tracking working
- [ ] Mobile responsive on all pages
- [ ] Email notifications working
- [ ] Performance: Page load < 3 seconds
- [ ] Zero security vulnerabilities

---

## 🔄 Git Workflow

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/authentication` - Feature branches
- `bugfix/payment-error` - Bug fix branches

**Commit Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` Code formatting
- `docs:` Documentation
- `test:` Tests

---

## 📞 Support & Maintenance

Post-launch tasks:
- [ ] Monitor error logs
- [ ] Track user feedback
- [ ] Performance optimization
- [ ] Security updates
- [ ] Feature enhancements based on usage
- [ ] PayHere integration (Phase 2)
- [ ] Mobile app (Future)

---

## 🎯 Current Status: PHASE 1 - Foundation Setup

**Next Immediate Tasks:**
1. Configure MongoDB connection
2. Set up project package structure
3. Add required dependencies (JWT, file upload, etc.)
4. Create base entities
5. Implement authentication APIs

---

**Last Updated:** October 26, 2025
**Version:** 1.0
