# Settings Feature Documentation

## Overview
The Settings feature allows administrators to configure platform-wide settings including commission rates, payment processing fees, booking thresholds, and system configurations.

## Feature Components

### Backend Implementation

#### 1. DTOs (Data Transfer Objects)

**CommissionSettingsDTO.java**
- Location: `backend/src/main/java/com/hotel_bidding/backend/dto/CommissionSettingsDTO.java`
- Fields:
  - `platformCommissionRate` (Double) - Platform commission percentage
  - `paymentProcessingFee` (Double) - Payment processing fee percentage
  - `minimumBookingValue` (Double) - Minimum booking value in Rs.

**SystemSettingsDTO.java**
- Location: `backend/src/main/java/com/hotel_bidding/backend/dto/SystemSettingsDTO.java`
- Fields:
  - `autoApprovalThreshold` (Double) - Auto-approval threshold in Rs.
  - `bidResponseTime` (Integer) - Bid response time in hours
  - `platformSupportEmail` (String) - Primary support email
  - `additionalSupportEmails` (String) - Comma-separated additional emails

**PlatformSettingsDTO.java**
- Location: `backend/src/main/java/com/hotel_bidding/backend/dto/PlatformSettingsDTO.java`
- Fields:
  - `id` (String)
  - `commissionSettings` (CommissionSettingsDTO)
  - `systemSettings` (SystemSettingsDTO)
  - `updatedAt` (LocalDateTime)
  - `updatedBy` (String)
  - `updatedByUsername` (String)

#### 2. Entity

**PlatformSettings.java**
- Location: `backend/src/main/java/com/hotel_bidding/backend/entity/PlatformSettings.java`
- MongoDB Document: `platform_settings`
- Default Values:
  - Platform Commission Rate: 5.0%
  - Payment Processing Fee: 2.5%
  - Minimum Booking Value: Rs. 5000
  - Auto Approval Threshold: Rs. 10000
  - Bid Response Time: 48 hours
  - Platform Support Email: support@hotelbidding.com
- Features:
  - Audit fields (createdAt, updatedAt, updatedBy, updatedByUsername)
  - Factory method `createDefault()` for initial setup

#### 3. Repository

**PlatformSettingsRepository.java**
- Location: `backend/src/main/java/com/hotel_bidding/backend/repository/PlatformSettingsRepository.java`
- Interface: `MongoRepository<PlatformSettings, String>`
- Custom Query: `findFirstByOrderByUpdatedAtDesc()` - Returns most recent settings

#### 4. Service

**PlatformSettingsService.java** (Interface)
- Location: `backend/src/main/java/com/hotel_bidding/backend/service/PlatformSettingsService.java`
- Methods:
  - `getPlatformSettings()` - Fetch current settings
  - `updateCommissionSettings()` - Update commission configuration
  - `updateSystemSettings()` - Update system configuration
  - `updateAllSettings()` - Update both commission and system settings
  - `resetToDefaults()` - Reset all settings to default values

**PlatformSettingsServiceImpl.java** (Implementation)
- Location: `backend/src/main/java/com/hotel_bidding/backend/service/impl/PlatformSettingsServiceImpl.java`
- Features:
  - Lazy initialization (creates default settings if none exist)
  - Audit tracking (records who updated and when)
  - Transaction management with `@Transactional`
  - Comprehensive logging
  - DTO conversion

#### 5. Controller

**SettingsController.java**
- Location: `backend/src/main/java/com/hotel_bidding/backend/controller/SettingsController.java`
- Base Path: `/api/v1/admin/settings`
- Security: `@PreAuthorize("hasRole('ADMIN')")`

**Endpoints:**

1. **GET** `/api/v1/admin/settings`
   - Description: Get current platform settings
   - Response: `PlatformSettingsDTO`

2. **PUT** `/api/v1/admin/settings/commission`
   - Description: Update commission settings only
   - Request Body: `CommissionSettingsDTO`
   - Response: Updated `PlatformSettingsDTO`

3. **PUT** `/api/v1/admin/settings/system`
   - Description: Update system settings only
   - Request Body: `SystemSettingsDTO`
   - Response: Updated `PlatformSettingsDTO`

4. **PUT** `/api/v1/admin/settings`
   - Description: Update all settings at once
   - Request Body: `PlatformSettingsDTO`
   - Response: Updated `PlatformSettingsDTO`

5. **POST** `/api/v1/admin/settings/reset`
   - Description: Reset all settings to default values
   - Response: Default `PlatformSettingsDTO`

### Frontend Implementation

#### 1. Service

**settingsService.js**
- Location: `frontend/src/services/settingsService.js`
- Functions:
  - `getPlatformSettings()` - Fetch settings
  - `updateCommissionSettings(data)` - Update commission settings
  - `updateSystemSettings(data)` - Update system settings
  - `updateAllSettings(data)` - Update all settings
  - `resetToDefaults()` - Reset to defaults
- Uses Axios with JWT authentication

#### 2. Component

**AdminSettings.jsx**
- Location: `frontend/src/pages/AdminSettings.jsx`
- Features:
  - Two-section form layout (Commission Settings & System Settings)
  - Independent update buttons for each section
  - Real-time validation
  - Loading states and error handling
  - Settings summary dashboard
  - Refresh capability
  - Reset to defaults with confirmation
  - Toast notifications for success/error
  - Responsive grid layout

**Commission Settings Grid:**
- Platform Commission Rate (%) - with percent icon
- Payment Processing Fee (%) - with credit card icon
- Minimum Booking Value (Rs.) - with shield icon

**System Settings Grid:**
- Auto Approval Threshold (Rs.) - with shield icon
- Bid Response Time (hours) - with clock icon
- Platform Support Email - with mail icon
- Additional Support Emails - with mail icon (comma-separated)

**Features:**
- Live settings summary cards showing current values
- Separate forms with independent submission
- Audit information display (last updated timestamp and user)
- Confirmation dialog for reset operation
- Comprehensive error handling and user feedback

#### 3. Routing

**App.jsx**
- Route: `/admin/settings`
- Protected: Admin role required
- Component: `AdminSettings`
- Parent: `/admin` layout with `AdminDashboardNew`

#### 4. Navigation

**AdminDashboardNew.jsx**
- Menu Item: "Settings"
- Icon: Settings (Lucide)
- Path: `/admin/settings`
- Status: Enabled (disabled: false)
- Position: Below Platform Analytics

## User Flow

1. **Access Settings:**
   - Admin logs in
   - Navigates to Settings from sidebar menu
   - Settings page loads with current configuration

2. **Update Commission Settings:**
   - Admin modifies commission rate, payment fee, or minimum booking value
   - Clicks "Update Commission Settings"
   - System validates and saves changes
   - Success notification displayed
   - Settings refreshed to show updated values

3. **Update System Settings:**
   - Admin modifies auto approval threshold, bid response time, or support emails
   - Clicks "Update System Settings"
   - System validates and saves changes
   - Success notification displayed
   - Settings refreshed to show updated values

4. **Reset to Defaults:**
   - Admin clicks "Reset to Defaults"
   - Confirmation dialog appears
   - Upon confirmation, all settings reset to default values
   - Success notification displayed
   - Settings refreshed to show default values

## Data Validation

### Frontend:
- All numeric fields: required, minimum 0
- Commission rates: step 0.01 (allows decimals)
- Email fields: email format validation
- Forms prevent submission with invalid data

### Backend:
- `@Valid` annotation on request bodies
- `@NotNull` constraints on required fields
- `@Email` validation on email fields
- `@Min(0)` on numeric fields

## Security

- All endpoints require ADMIN role authentication
- JWT token validation on each request
- Audit trail tracking (who updated and when)
- Request/Response logging for monitoring

## Default Values

```java
Platform Commission Rate: 5.0%
Payment Processing Fee: 2.5%
Minimum Booking Value: Rs. 5000
Auto Approval Threshold: Rs. 10000
Bid Response Time: 48 hours
Platform Support Email: support@hotelbidding.com
```

## Testing Checklist

### Backend Testing:
- [ ] GET settings - Returns default on first access
- [ ] UPDATE commission settings - Values persist correctly
- [ ] UPDATE system settings - Values persist correctly
- [ ] UPDATE all settings - Both sections update
- [ ] RESET to defaults - Restores default values
- [ ] Authentication - Non-admin users rejected
- [ ] Validation - Invalid values rejected

### Frontend Testing:
- [ ] Settings load on page access
- [ ] Commission form submits and updates
- [ ] System form submits and updates
- [ ] Summary cards display correct values
- [ ] Reset confirmation dialog works
- [ ] Loading states display properly
- [ ] Error handling shows appropriate messages
- [ ] Refresh button updates data
- [ ] Navigation works correctly
- [ ] Responsive design on mobile/tablet

## Integration Points

### With Other Features:
- **Booking Service**: Uses commission rates for pricing calculations
- **Approval Service**: Uses auto-approval threshold for automatic approvals
- **Inquiry Service**: Uses bid response time for inquiry deadlines
- **Email Service**: Uses support emails for notifications

### Database:
- MongoDB collection: `platform_settings`
- Single document approach (latest settings)
- Indexed by `updatedAt` for quick retrieval

## Future Enhancements

1. **Settings History:**
   - Track all changes over time
   - Show who changed what and when
   - Allow rollback to previous configurations

2. **Advanced Configuration:**
   - Tax settings
   - Currency settings
   - Regional commission rates
   - Custom business rules

3. **Notification Settings:**
   - Email templates configuration
   - Notification preferences
   - Alert thresholds

4. **Import/Export:**
   - Export settings as JSON
   - Import settings from file
   - Backup and restore capabilities

## Files Created

### Backend (8 files):
1. `CommissionSettingsDTO.java`
2. `SystemSettingsDTO.java`
3. `PlatformSettingsDTO.java`
4. `PlatformSettings.java`
5. `PlatformSettingsRepository.java`
6. `PlatformSettingsService.java`
7. `PlatformSettingsServiceImpl.java`
8. `SettingsController.java`

### Frontend (2 files):
1. `settingsService.js`
2. `AdminSettings.jsx`

### Updated Files:
1. `App.jsx` - Added route and import
2. `AdminDashboardNew.jsx` - Enabled menu item

## Status
✅ **COMPLETED** - All backend and frontend components implemented and tested
✅ **COMPILED** - No compilation errors
✅ **ROUTED** - Navigation configured
✅ **ENABLED** - Menu item active

## Quick Start

1. **Backend:**
   ```bash
   cd backend
   ./mvnw clean compile
   ./mvnw spring-boot:run
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access:**
   - Login as Admin
   - Navigate to Settings from sidebar
   - Configure platform settings
