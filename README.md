# 🏨 Hotel & DMC Bidding Platform

A B2B marketplace connecting Hotels and DMCs (Destination Management Companies) for streamlined booking and bidding processes.

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development Status](#development-status)

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.7
- **Language:** Java 17
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe API (Phase 1), PayHere (Phase 2)
- **Email:** Spring Mail (SMTP)
- **PDF Generation:** iText7
- **File Storage:** AWS S3 / Local storage
- **API Documentation:** Springdoc OpenAPI (Swagger)

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4.1
- **State Management:** Context API + useReducer
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Yup

---

## ✨ Features

### For Hotels
- ✅ Comprehensive property registration
- ✅ Multi-room type management with amenities
- ✅ Seasonal rate plans (Wish/Want/Walk tiers)
- ✅ Supplements management (mandatory/optional)
- ✅ View and respond to DMC inquiries
- ✅ Participate in bidding requests
- ✅ Booking management dashboard
- ✅ Commission tracking

### For DMCs
- ✅ Company registration with market selection
- ✅ Browse and search hotels
- ✅ Direct hotel inquiries
- ✅ Create bidding requests for multiple hotels
- ✅ Compare hotel bids side-by-side
- ✅ Rate negotiation (Wish → Want → Walk)
- ✅ Secure payment integration
- ✅ Booking history and vouchers

### Admin Panel
- ✅ Manual user approval workflow
- ✅ User management (suspend/activate)
- ✅ Commission tracking and reports
- ✅ Platform analytics dashboard
- ✅ Dispute resolution

### Communication
- ✅ In-platform messaging system
- ✅ Email notifications
- ✅ Bidirectional reviews and ratings

---

## 📦 Prerequisites

### Backend Requirements
- Java 17 or higher
- Maven 3.8+
- MongoDB 6.0+ (local or Atlas)

### Frontend Requirements
- Node.js 18+ and npm

### Optional (for production)
- AWS account (for S3 file storage)
- Stripe account (for payments)
- SMTP email service (Gmail, SendGrid, etc.)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/PathumUdayanga2002/Hotel_DMC_bidding_platform.git
cd Hotel_DMC_bidding_platform
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
mvnw clean install
```

#### Configure MongoDB
1. Install MongoDB locally or create a free MongoDB Atlas cluster
2. Update `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/hotel_bidding_db
# OR for Atlas:
# spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/hotel_bidding_db
```

#### Configure Email
Update SMTP settings in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

For Gmail, enable "App Passwords": https://myaccount.google.com/apppasswords

#### Configure Stripe (Optional for now)
```properties
stripe.api.key=sk_test_your_stripe_secret_key
```
Get test keys from: https://dashboard.stripe.com/test/apikeys

#### Run Backend
```bash
mvnw spring-boot:run
```

Backend will start at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables (Backend)

Create `.env` file or use `application.properties`:

| Variable | Description | Default |
|----------|-------------|---------|
| `server.port` | Backend port | 8080 |
| `spring.data.mongodb.uri` | MongoDB connection string | localhost:27017 |
| `jwt.secret` | JWT secret key (256-bit min) | - |
| `jwt.access-token.expiration` | Access token expiry (ms) | 900000 (15 min) |
| `jwt.refresh-token.expiration` | Refresh token expiry (ms) | 604800000 (7 days) |
| `stripe.api.key` | Stripe secret key | - |
| `commission.rate` | Platform commission % | 5.0 |

### Frontend Configuration

Create `.env` in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

---

## 📂 Project Structure

### Backend
```
backend/src/main/java/com/hotel_bidding/backend/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   ├── MongoConfig.java
│   ├── JwtConfig.java
│   └── CorsConfig.java
├── controller/          # REST endpoints
│   ├── AuthController.java
│   ├── HotelController.java
│   ├── DMCController.java
│   ├── InquiryController.java
│   ├── BiddingController.java
│   └── BookingController.java
├── dto/                 # Data Transfer Objects
│   ├── request/
│   └── response/
├── entity/              # MongoDB documents
│   ├── User.java
│   ├── Hotel.java
│   ├── DMC.java
│   ├── Inquiry.java
│   ├── Bidding.java
│   └── Booking.java
├── repository/          # MongoDB repositories
├── service/             # Business logic
│   ├── impl/
│   └── interfaces/
├── security/            # JWT, authentication
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
├── util/                # Helper classes
├── exception/           # Custom exceptions
└── constants/           # Enums and constants
```

### Frontend
```
frontend/src/
├── components/          # Reusable components
│   ├── common/          # Buttons, inputs, modals
│   ├── layout/          # Header, footer, sidebar
│   └── features/        # Feature-specific
├── pages/               # Route pages
│   ├── auth/
│   ├── hotel/
│   ├── dmc/
│   └── admin/
├── services/            # API calls
│   └── api.js
├── context/             # React context
│   └── AuthContext.jsx
├── hooks/               # Custom hooks
├── utils/               # Helper functions
└── constants/           # Constants
```

---

## 📊 Development Status

### ✅ Completed
- [x] Project initialization
- [x] Package structure setup
- [x] Enums and constants defined
- [x] Dependencies configured
- [x] Implementation plan documented

### 🚧 In Progress (Phase 1)
- [ ] MongoDB configuration
- [ ] JWT authentication system
- [ ] User entity and repository
- [ ] Registration APIs (Hotel & DMC)
- [ ] Email verification (OTP)

### 📅 Upcoming
- Phase 2: Hotel Management
- Phase 3: DMC Management & Search
- Phase 4: Direct Inquiry Workflow
- Phase 5: Bidding Workflow
- Phase 6: Payment & Booking
- Phase 7: Messaging & Notifications
- Phase 8: Reviews & Ratings
- Phase 9: Admin Panel

**For detailed implementation plan, see:** [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)

---

## 📖 API Documentation

Once the backend is running, access interactive API documentation at:
```
http://localhost:8080/api/v1/swagger-ui.html
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit changes: `git commit -m "feat: add new feature"`
3. Push to branch: `git push origin feature/your-feature-name`
4. Open a Pull Request

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` Code formatting
- `docs:` Documentation
- `test:` Tests

---

## 📝 License

This project is proprietary software developed for HashxProject.

---

## 📞 Support

For questions or issues:
- **Developer:** Pathum Udayanga
- **Email:** your-email@example.com
- **GitHub:** [@PathumUdayanga2002](https://github.com/PathumUdayanga2002)

---

## 🎯 Next Steps

1. **Configure MongoDB** - Set up your database
2. **Update Email Settings** - Configure SMTP for emails
3. **Review Implementation Plan** - Check `IMPLEMENTATION_PLAN.md`
4. **Start Phase 1 Development** - Authentication system
5. **Run the application** - Test backend and frontend

---

**Last Updated:** October 26, 2025  
**Version:** 0.1.0 (Phase 1 - Foundation)
