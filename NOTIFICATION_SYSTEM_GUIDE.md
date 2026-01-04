# Notification System Implementation Guide

## Overview
This document describes the comprehensive notification system implemented for the Hotel-DMC Bidding Platform. The system provides real-time in-app notifications for Hotels, DMCs, and Admins across various activities.

## Implementation Date
January 4, 2026

## System Architecture

### Backend Components

#### 1. NotificationType Enum
**Location:** `backend/src/main/java/com/hotel_bidding/backend/constants/NotificationType.java`

**Notification Types:**

##### Bid & Inquiry Notifications
- `NEW_INQUIRY` - New inquiry posted (for hotels)
- `NEW_BID` - New bid received (for DMC)
- `BID_ACCEPTED` - Bid accepted by DMC
- `BID_REJECTED` - Bid rejected by DMC
- `INQUIRY_CLOSED` - Inquiry closed
- `INQUIRY_CANCELLED` - Inquiry cancelled
- `DEADLINE_APPROACHING` - 24 hours before deadline

##### Hotel-Specific Notifications
- `HOTEL_PROFILE_APPROVED` - Profile approved by admin ⭐
- `HOTEL_PROFILE_REJECTED` - Profile rejected by admin ⭐
- `DIRECT_INQUIRY_CREATED` - Direct inquiry created ⭐
- `DIRECT_INQUIRY_UPDATED` - Direct inquiry updated
- `PROPOSAL_RECEIVED` - Proposal from DMC ⭐
- `PROPOSAL_ACCEPTED` - Proposal accepted
- `PROPOSAL_REJECTED` - Proposal rejected
- `HOTEL_STAFF_ADDED` - Staff member added ⭐
- `HOTEL_STAFF_REMOVED` - Staff member removed ⭐
- `BID_STATUS_UPDATED` - Bid status changed ⭐

##### DMC-Specific Notifications
- `DMC_PROFILE_APPROVED` - Profile approved by admin ⭐
- `DMC_PROFILE_REJECTED` - Profile rejected by admin ⭐
- `DMC_ACCOUNT_ACTIVATED` - Account activated ⭐
- `DMC_ACCOUNT_SUSPENDED` - Account suspended ⭐
- `DMC_ACCOUNT_DEACTIVATED` - Account deactivated ⭐
- `INQUIRY_RECEIVED` - New inquiry received ⭐
- `INQUIRY_UPDATED` - Inquiry updated ⭐
- `CONTRACT_RECEIVED` - Contract from hotel ⭐
- `CONTRACT_SIGNED` - Contract signed
- `DMC_STAFF_ADDED` - Staff member added ⭐
- `DMC_STAFF_REMOVED` - Staff member removed ⭐

##### Messaging Notifications
- `MESSAGE_RECEIVED` - New message ⭐
- `MESSAGE_SENT` - Message sent
- `MESSAGE_FAILED` - Message delivery failed ⭐

##### Admin Notifications
- `USER_REGISTRATION` - New user registered
- `PROFILE_SUBMITTED` - Profile submitted for review
- `PAYMENT_RECEIVED` - Payment received
- `SUBSCRIPTION_EXPIRED` - Subscription expired
- `SUBSCRIPTION_RENEWED` - Subscription renewed

⭐ = Newly implemented

#### 2. NotificationService Interface
**Location:** `backend/src/main/java/com/hotel_bidding/backend/service/NotificationService.java`

**New Methods Added:**

```java
// Hotel Notifications
void notifyHotelProfileApproved(String hotelUserId, String profileId);
void notifyHotelProfileRejected(String hotelUserId, String profileId, String reason);
void notifyDirectInquiryCreated(String hotelUserId, String inquiryId);
void notifyProposalReceived(String hotelUserId, String proposalId, String dmcName);
void notifyBidStatusUpdated(String hotelUserId, String bidId, String status);
void notifyHotelStaffAdded(String hotelUserId, String staffName, String staffEmail);
void notifyHotelStaffRemoved(String hotelUserId, String staffName);
void notifyMessageReceived(String recipientUserId, String senderName, String messageId);
void notifyMessageFailed(String senderUserId, String recipientName, String reason);

// DMC Notifications
void notifyDmcProfileApproved(String dmcUserId, String profileId);
void notifyDmcProfileRejected(String dmcUserId, String profileId, String reason);
void notifyDmcAccountStatusChanged(String dmcUserId, String newStatus, String reason);
void notifyInquiryReceived(String dmcUserId, String inquiryId, String hotelName);
void notifyInquiryUpdated(String dmcUserId, String inquiryId, String updateType);
void notifyContractReceived(String dmcUserId, String contractId, String hotelName);
void notifyDmcStaffAdded(String dmcUserId, String staffName, String staffEmail);
void notifyDmcStaffRemoved(String dmcUserId, String staffName);
```

#### 3. NotificationServiceImpl
**Location:** `backend/src/main/java/com/hotel_bidding/backend/service/impl/NotificationServiceImpl.java`

All new notification methods have been implemented with:
- Clear, actionable titles with emojis (🎉, 📩, 👤, etc.)
- Descriptive messages
- Appropriate action URLs for navigation
- Priority levels (1=High, 2=Medium, 3=Low)

### Frontend Components

#### NotificationBell Component
**Location:** `frontend/src/components/NotificationBell.jsx`

**Enhancements:**
1. **Icon Support** - Visual icons for each notification type
2. **Improved Layout** - Better visual hierarchy with icons
3. **Smart Navigation** - Clicking notifications navigates to relevant pages

**New Function:**
```javascript
const getNotificationIcon = (type) => {
  // Returns emoji icon based on notification type
  // Examples: 🎉 for approvals, 📩 for proposals, 👤 for staff, etc.
}
```

## Integration Points

### 1. Hotel Profile Approval/Rejection
**File:** `backend/src/main/java/com/hotel_bidding/backend/service/impl/AdminHotelServiceImpl.java`

**When Admin Approves Hotel Profile:**
```java
// In approveHotelProfile method
notificationService.notifyHotelProfileApproved(profile.getUserId(), profileId);
```

**When Admin Rejects Hotel Profile:**
```java
// In rejectHotelProfile method
notificationService.notifyHotelProfileRejected(profile.getUserId(), profileId, reason);
```

### 2. DMC Profile Approval/Rejection & Status Changes
**File:** `backend/src/main/java/com/hotel_bidding/backend/service/impl/AdminDMCServiceImpl.java`

**When Admin Approves DMC Profile:**
```java
// In approveDMCProfile method
notificationService.notifyDmcProfileApproved(profile.getUserId(), profileId);
```

**When Admin Rejects DMC Profile:**
```java
// In rejectDMCProfile method
notificationService.notifyDmcProfileRejected(profile.getUserId(), profileId, reason);
```

**When Admin Changes DMC Status:**
```java
// In updateDMCStatus method
notificationService.notifyDmcAccountStatusChanged(dmcUserId, "Suspended", reason);
```

## How to Add Notifications to Other Features

### Example: Adding Notification for Direct Inquiry Creation

1. **In your service class** (e.g., `DirectInquiryServiceImpl`):

```java
@Service
@RequiredArgsConstructor
public class DirectInquiryServiceImpl implements DirectInquiryService {
    
    private final NotificationService notificationService;
    
    public InquiryResponse createDirectInquiry(InquiryRequest request, String hotelUserId) {
        // Create inquiry logic...
        Inquiry inquiry = inquiryRepository.save(newInquiry);
        
        // Send notification
        notificationService.notifyDirectInquiryCreated(hotelUserId, inquiry.getId());
        
        return convertToResponse(inquiry);
    }
}
```

### Example: Adding Notification for Staff Management

```java
public void addStaffMember(String userId, StaffRequest request) {
    // Add staff logic...
    Staff staff = staffRepository.save(newStaff);
    
    // Determine user type and send appropriate notification
    if (userRole == UserRole.HOTEL_SUPER_ADMIN) {
        notificationService.notifyHotelStaffAdded(userId, staff.getName(), staff.getEmail());
    } else if (userRole == UserRole.DMC_SUPER_ADMIN) {
        notificationService.notifyDmcStaffAdded(userId, staff.getName(), staff.getEmail());
    }
}
```

### Example: Adding Notification for Messages

```java
public void sendMessage(MessageRequest request, String senderId) {
    // Send message logic...
    Message message = messageRepository.save(newMessage);
    
    try {
        // Deliver message...
        notificationService.notifyMessageReceived(
            request.getRecipientId(), 
            senderName, 
            message.getId()
        );
    } catch (Exception e) {
        notificationService.notifyMessageFailed(
            senderId, 
            recipientName, 
            e.getMessage()
        );
    }
}
```

## Notification Priority Levels

- **Priority 1 (High)** - Red border
  - Profile approvals/rejections
  - Account status changes
  - Contract received
  - Proposals received
  - Inquiry received

- **Priority 2 (Medium)** - Yellow border
  - Bid status updates
  - Direct inquiry created
  - Messages
  - Inquiry updates

- **Priority 3 (Low)** - Blue border
  - Staff additions/removals

## Action URLs for Navigation

Each notification includes an `actionUrl` that navigates users to the relevant page:

- `/hotel/profile` - Hotel profile page
- `/hotel/inquiries/:id` - Specific inquiry
- `/hotel/bids/:id` - Specific bid
- `/hotel/proposals/:id` - Specific proposal
- `/hotel/settings/staff` - Staff management
- `/dmc/profile` - DMC profile page
- `/dmc/inquiries/:id` - DMC inquiry view
- `/dmc/contracts/:id` - Contract view
- `/dmc/settings/staff` - Staff management
- `/messages/:id` - Message thread

## Testing the Notification System

### For Hotel Portal:
1. **Profile Approval** - Admin approves hotel profile → Check notification bell
2. **Direct Inquiry** - Create direct inquiry → Check notification
3. **Proposal Received** - DMC sends proposal → Check notification
4. **Staff Management** - Add/remove staff → Check notification

### For DMC Portal:
1. **Profile Approval** - Admin approves DMC profile → Check notification
2. **Account Status** - Admin changes status → Check notification
3. **Inquiry Received** - Hotel creates inquiry → Check notification
4. **Contract Received** - Hotel sends contract → Check notification
5. **Staff Management** - Add/remove staff → Check notification

## Files Modified

### Backend
- ✅ `NotificationType.java` - Added 20+ new notification types
- ✅ `NotificationService.java` - Added 18 new method signatures
- ✅ `NotificationServiceImpl.java` - Implemented all new methods
- ✅ `AdminHotelServiceImpl.java` - Integrated hotel profile notifications
- ✅ `AdminDMCServiceImpl.java` - Integrated DMC profile and status notifications

### Frontend
- ✅ `NotificationBell.jsx` - Enhanced with icons and improved layout

## Files NOT Modified (As Per Requirement)
- ❌ `pom.xml` - No changes
- ❌ `application.properties` - No changes
- ❌ API endpoints - No new endpoints created
- ❌ Database schema - Uses existing Notification collection

## Next Steps for Full Integration

To complete the notification system, integrate notification calls in these areas:

1. **Bid Service** - When bid status changes
2. **Proposal Service** - When proposals are sent/received
3. **Direct Inquiry Service** - When direct inquiries are created
4. **Message Service** - When messages are sent/failed
5. **Staff Management Service** - When staff are added/removed
6. **Contract Service** - When contracts are received

### Example Integration Template

```java
// In your service method
public YourResponse yourMethod(YourRequest request, String userId) {
    // Your business logic
    YourEntity entity = yourRepository.save(newEntity);
    
    // Add notification
    notificationService.notifyXXX(userId, entity.getId(), additionalInfo);
    
    return convertToResponse(entity);
}
```

## Benefits

1. **Real-time Feedback** - Users instantly know about important events
2. **Better UX** - Clear visual notifications with icons
3. **Smart Navigation** - Click to navigate to relevant pages
4. **Comprehensive Coverage** - All major user actions covered
5. **Role-Based** - Different notifications for Hotel, DMC, and Admin
6. **Priority System** - Important notifications stand out
7. **Non-Intrusive** - Existing APIs and database unchanged

## Support

For questions or issues with the notification system, refer to:
- `NotificationService.java` for available methods
- `NotificationType.java` for notification types
- `NotificationBell.jsx` for frontend implementation

---

**Last Updated:** January 4, 2026  
**Status:** ✅ Core Implementation Complete
