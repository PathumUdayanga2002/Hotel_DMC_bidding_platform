# 🏗️ System Architecture Documentation

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Hotel Web   │  │   DMC Web    │  │  Admin Web   │          │
│  │   Portal     │  │   Portal     │  │   Portal     │          │
│  │ (React App)  │  │ (React App)  │  │ (React App)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                  │                   │
│         └─────────────────┴──────────────────┘                   │
│                           │                                       │
│                    Mobile Responsive                             │
│                    (TailwindCSS)                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            │ JSON
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                   Spring Boot Backend                            │
│                   (Java 17 + Maven)                              │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Controllers                           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Auth  │ Hotel │ DMC │ Inquiry │ Bidding │ Booking      │   │
│  └────┬───────────────────────────────────────────────┬────┘   │
│       │                                                │         │
│  ┌────▼───────────────────────────────────────────────▼────┐   │
│  │                   Service Layer                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • Authentication Service    • Payment Service          │   │
│  │  • Hotel Service            • Booking Service           │   │
│  │  • DMC Service              • Message Service           │   │
│  │  • Inquiry Service          • Email Service             │   │
│  │  • Bidding Service          • Commission Service        │   │
│  └────┬───────────────────────────────────────────────┬────┘   │
│       │                                                │         │
│  ┌────▼───────────────────────────────────────────────▼────┐   │
│  │                  Repository Layer                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │     MongoDB Data Access (Spring Data MongoDB)           │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Security Layer                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  JWT Provider │ Auth Filter │ User Details Service       │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    MongoDB Database                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Collections:                                             │  │
│  │  • users          • inquiries      • messages             │  │
│  │  • hotels         • biddings       • reviews              │  │
│  │  • dmcs           • bookings       • commissions          │  │
│  │  • payments       • notifications                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Stripe     │  │  SMTP Email  │  │   AWS S3     │          │
│  │   Payment    │  │   Service    │  │ File Storage │          │
│  │   Gateway    │  │ (Gmail/SG)   │  │  (Optional)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Architecture

### 1. Frontend Architecture (React)

```
src/
│
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Select.jsx
│   │   └── Spinner.jsx
│   │
│   ├── layout/              # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── MainLayout.jsx
│   │
│   └── features/            # Feature-specific components
│       ├── hotel/
│       ├── dmc/
│       └── admin/
│
├── pages/                   # Route pages
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── HotelRegister.jsx
│   │   └── DMCRegister.jsx
│   ├── hotel/
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── RoomManagement.jsx
│   │   └── Inquiries.jsx
│   ├── dmc/
│   │   ├── Dashboard.jsx
│   │   ├── HotelSearch.jsx
│   │   ├── CreateInquiry.jsx
│   │   └── Biddings.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       └── UserApprovals.jsx
│
├── services/                # API communication
│   ├── api.js               # Axios instance
│   ├── authService.js
│   ├── hotelService.js
│   └── dmcService.js
│
├── context/                 # Global state
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/                   # Custom hooks
│   ├── useAuth.js
│   └── useApi.js
│
├── utils/                   # Helper functions
│   ├── validation.js
│   └── formatters.js
│
└── constants/               # Constants
    ├── routes.js
    └── apiEndpoints.js
```

### 2. Backend Architecture (Spring Boot)

```
com.hotel_bidding.backend/
│
├── config/                     # Configuration classes
│   ├── SecurityConfig.java     # Spring Security setup
│   ├── MongoConfig.java        # MongoDB configuration
│   ├── JwtConfig.java          # JWT settings
│   ├── CorsConfig.java         # CORS policy
│   ├── SwaggerConfig.java      # API documentation
│   └── ModelMapperConfig.java  # DTO mapping
│
├── controller/                 # REST endpoints
│   ├── AuthController.java     # /api/v1/auth/**
│   ├── HotelController.java    # /api/v1/hotels/**
│   ├── DMCController.java      # /api/v1/dmcs/**
│   ├── InquiryController.java  # /api/v1/inquiries/**
│   ├── BiddingController.java  # /api/v1/biddings/**
│   ├── BookingController.java  # /api/v1/bookings/**
│   ├── MessageController.java  # /api/v1/messages/**
│   └── AdminController.java    # /api/v1/admin/**
│
├── dto/                        # Data Transfer Objects
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── HotelRegistrationRequest.java
│   │   └── CreateInquiryRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── HotelResponse.java
│       └── ApiResponse.java
│
├── entity/                     # MongoDB documents
│   ├── User.java
│   ├── Hotel.java
│   ├── DMC.java
│   ├── Inquiry.java
│   ├── Bidding.java
│   ├── Booking.java
│   ├── Payment.java
│   ├── Message.java
│   └── Review.java
│
├── repository/                 # Data access
│   ├── UserRepository.java
│   ├── HotelRepository.java
│   ├── DMCRepository.java
│   └── BookingRepository.java
│
├── service/                    # Business logic
│   ├── impl/                   # Service implementations
│   │   ├── AuthServiceImpl.java
│   │   ├── HotelServiceImpl.java
│   │   └── BookingServiceImpl.java
│   └── interfaces/             # Service interfaces
│       ├── AuthService.java
│       ├── HotelService.java
│       └── EmailService.java
│
├── security/                   # Security components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtAuthenticationEntryPoint.java
│   └── UserDetailsServiceImpl.java
│
├── exception/                  # Exception handling
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
│
├── util/                       # Utilities
│   ├── OTPGenerator.java
│   ├── EmailTemplate.java
│   └── DateUtil.java
│
└── constants/                  # Enums and constants
    ├── UserRole.java
    ├── UserStatus.java
    └── BookingStatus.java
```

---

## Data Flow Diagrams

### 1. User Registration Flow

```
┌────────┐         ┌────────────┐         ┌─────────┐
│ Client │         │   Backend  │         │   DB    │
└───┬────┘         └─────┬──────┘         └────┬────┘
    │                    │                     │
    │ POST /auth/register│                     │
    ├───────────────────>│                     │
    │                    │                     │
    │                    │ Validate data       │
    │                    │ Hash password       │
    │                    │ Generate OTP        │
    │                    │                     │
    │                    │ Save user (pending) │
    │                    ├────────────────────>│
    │                    │                     │
    │                    │<────────────────────┤
    │                    │ Send OTP email      │
    │                    │                     │
    │ Return success     │                     │
    │<───────────────────┤                     │
    │                    │                     │
    │ POST /auth/verify  │                     │
    ├───────────────────>│                     │
    │                    │                     │
    │                    │ Verify OTP          │
    │                    │ Update user status  │
    │                    ├────────────────────>│
    │                    │                     │
    │ Email verified ✓   │                     │
    │<───────────────────┤                     │
```

### 2. Direct Inquiry Workflow

```
DMC                    Backend               Hotel
 │                        │                    │
 │ Create Inquiry         │                    │
 ├───────────────────────>│                    │
 │                        │ Save inquiry       │
 │                        │ (status: PENDING)  │
 │                        │                    │
 │                        │ Notify hotel       │
 │                        ├───────────────────>│
 │                        │                    │
 │                        │  Hotel views       │
 │                        │  Offers Wish Rate  │
 │                        │<───────────────────┤
 │ View Wish Rate         │                    │
 │<───────────────────────┤                    │
 │                        │                    │
 │ Request negotiation    │                    │
 ├───────────────────────>│                    │
 │                        │ Notify hotel       │
 │                        ├───────────────────>│
 │                        │                    │
 │                        │  Hotel approves    │
 │                        │  Want Rate         │
 │                        │<───────────────────┤
 │ View Want Rate         │                    │
 │<───────────────────────┤                    │
 │                        │                    │
 │ Accept & Pay           │                    │
 ├───────────────────────>│                    │
 │                        │ Process payment    │
 │                        │ (Stripe)           │
 │                        │ Generate voucher   │
 │                        │ Send emails        │
 │                        ├───────────────────>│
 │ Booking confirmed ✓    │  Booking confirmed │
 │<───────────────────────┤                    │
```

### 3. Bidding Workflow

```
DMC           Backend            Hotel1   Hotel2   Hotel3
 │               │                  │        │        │
 │ Create Bid    │                  │        │        │
 ├──────────────>│ Save bidding     │        │        │
 │               │ (status: OPEN)   │        │        │
 │               │                  │        │        │
 │               │ Notify all hotels│        │        │
 │               ├─────────────────>│        │        │
 │               ├────────────────────────>│  │        │
 │               ├───────────────────────────────────>│
 │               │                  │        │        │
 │               │  Submit bid $100 │        │        │
 │               │<─────────────────┤        │        │
 │               │         Submit bid $95    │        │
 │               │<─────────────────────────┤         │
 │               │                Submit bid $98      │
 │               │<───────────────────────────────────┤
 │               │                  │        │        │
 │ View bids     │                  │        │        │
 │<──────────────┤                  │        │        │
 │               │                  │        │        │
 │ Select Hotel2 │                  │        │        │
 │ (winner)      │                  │        │        │
 ├──────────────>│                  │        │        │
 │               │ Update bidding   │        │        │
 │               │ (winner_selected)│        │        │
 │               │                  │        │        │
 │ Pay & Confirm │                  │        │        │
 ├──────────────>│ Process payment  │        │        │
 │               │ Generate voucher │        │        │
 │               │ Notify winner    │        │        │
 │               ├────────────────────────>│  │        │
 │ Booking done ✓│   You won! ✓     │        │        │
 │<──────────────┤                  │        │        │
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Layer 1: HTTPS/TLS                                      │
│  ├─ All communication encrypted                          │
│  └─ SSL certificate (Let's Encrypt in production)        │
│                                                           │
│  Layer 2: CORS Policy                                    │
│  ├─ Allowed origins: Frontend domain                     │
│  └─ Credentials allowed: True                            │
│                                                           │
│  Layer 3: JWT Authentication                             │
│  ├─ Access token: 15 minutes                             │
│  ├─ Refresh token: 7 days                                │
│  ├─ Token stored in: HttpOnly cookie / LocalStorage      │
│  └─ Token validation on every request                    │
│                                                           │
│  Layer 4: Role-Based Access Control (RBAC)              │
│  ├─ Roles: HOTEL_USER, DMC_USER, ADMIN                  │
│  └─ Endpoint protection: @PreAuthorize                   │
│                                                           │
│  Layer 5: Input Validation                               │
│  ├─ @Valid annotations on DTOs                           │
│  ├─ Spring Validation (JSR-380)                          │
│  └─ MongoDB query sanitization                           │
│                                                           │
│  Layer 6: Password Security                              │
│  ├─ BCrypt hashing (cost factor: 12)                     │
│  ├─ Minimum 8 characters                                 │
│  └─ Must include: uppercase, lowercase, number           │
│                                                           │
│  Layer 7: Rate Limiting                                  │
│  ├─ Login attempts: 5 per 15 minutes                     │
│  ├─ OTP requests: 3 per hour                             │
│  └─ API calls: 100 per minute                            │
│                                                           │
│  Layer 8: Email Verification                             │
│  ├─ OTP: 6 digits, 10-minute expiry                      │
│  └─ Required before account activation                   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Production)

```
┌──────────────────────────────────────────────────────────────┐
│                         USERS                                 │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                     CDN / Load Balancer                       │
│                      (Cloudflare / AWS)                       │
└────────┬──────────────────────────────────────┬──────────────┘
         │                                       │
         │ Static Files                          │ API Requests
         ▼                                       ▼
┌────────────────────┐              ┌────────────────────────┐
│   Frontend Server  │              │   Backend Server(s)    │
│   (Vercel/Netlify) │              │   (AWS EC2 / Railway)  │
│                    │              │                        │
│  - React Build     │              │  - Spring Boot App     │
│  - Static Assets   │              │  - Port 8080           │
│  - Auto-scale      │              │  - Auto-scale          │
└────────────────────┘              └──────────┬─────────────┘
                                               │
                                               ▼
                              ┌─────────────────────────────┐
                              │    MongoDB Atlas            │
                              │    (Cloud Database)         │
                              │  - Replica Set              │
                              │  - Auto Backup              │
                              │  - Multi-region             │
                              └─────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    External Services                          │
├──────────────────────────────────────────────────────────────┤
│  AWS S3          SendGrid        Stripe          Monitoring   │
│  (Files)         (Emails)        (Payments)      (DataDog)    │
└──────────────────────────────────────────────────────────────┘
```

---

## Technology Decision Rationale

| Technology | Why Chosen | Alternatives Considered |
|------------|-----------|------------------------|
| **Spring Boot** | Enterprise-grade, extensive ecosystem, excellent for REST APIs | Node.js, Django |
| **MongoDB** | Flexible schema for complex nested data (hotels, biddings) | PostgreSQL, MySQL |
| **JWT** | Stateless authentication, scalable, mobile-friendly | Session-based auth |
| **React** | Component-based, large ecosystem, performance | Angular, Vue.js |
| **Vite** | Fast HMR, modern build tool, excellent DX | Create React App, Webpack |
| **TailwindCSS** | Utility-first, rapid development, mobile-first | Bootstrap, Material-UI |
| **Stripe** | Best-in-class payment API, easy integration, trusted | PayPal, Square |

---

**Last Updated:** October 26, 2025  
**Version:** 1.0
