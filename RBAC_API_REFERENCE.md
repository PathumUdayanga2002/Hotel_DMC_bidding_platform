# RBAC API Quick Reference

## Base URLs
- DMC Portal: `http://localhost:8081/dmc`
- Hotel Portal: `http://localhost:8081/hotel`
- Auth: `http://localhost:8081/auth`

## Authentication
All protected endpoints require JWT token in HTTP-only cookie (set during login).

### Updated Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user123",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "DMC_USER",
    "accountType": "SUPER_ADMIN",  // NEW: SUPER_ADMIN or STAFF
    "fullName": "John Doe"          // NEW: Full name if available
  }
}
```

## Staff Management Endpoints

### Create Staff
**POST** `/dmc/staff` or `/hotel/staff`  
**Access:** Super Admin Only

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "position": "Sales Manager",
  "profilePhotoUrl": "https://example.com/photo.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Staff member created successfully",
  "data": {
    "staff": {
      "id": "staff123",
      "username": "janesmith",
      "email": "jane@example.com",
      "fullName": "Jane Smith",
      "phone": "+1234567890",
      "position": "Sales Manager",
      "profilePhotoUrl": "https://example.com/photo.jpg",
      "accountType": "STAFF",
      "isActive": true,
      "parentUserId": "user123",
      "createdBy": "John Doe",
      "createdAt": "2025-01-15T10:30:00",
      "lastLoginAt": null,
      "actionCount": 0
    },
    "generatedPassword": "Xy9#mK2$pL4&"  // Show this to super admin ONCE
  }
}
```

### List All Staff
**GET** `/dmc/staff` or `/hotel/staff`  
**Access:** Super Admin Only

**Response:**
```json
{
  "success": true,
  "message": "Staff list retrieved successfully",
  "data": [
    {
      "id": "staff123",
      "username": "janesmith",
      "email": "jane@example.com",
      "fullName": "Jane Smith",
      "phone": "+1234567890",
      "position": "Sales Manager",
      "profilePhotoUrl": "https://example.com/photo.jpg",
      "accountType": "STAFF",
      "isActive": true,
      "parentUserId": "user123",
      "createdBy": "John Doe",
      "createdAt": "2025-01-15T10:30:00",
      "lastLoginAt": "2025-01-15T14:20:00",
      "actionCount": 15
    }
  ]
}
```

### Get Staff By ID
**GET** `/dmc/staff/{staffId}` or `/hotel/staff/{staffId}`  
**Access:** Super Admin Only

**Response:** Same as single staff object from list

### Update Staff
**PUT** `/dmc/staff/{staffId}` or `/hotel/staff/{staffId}`  
**Access:** Super Admin Only

**Request Body:**
```json
{
  "fullName": "Jane Smith Updated",
  "phone": "+0987654321",
  "position": "Senior Sales Manager",
  "profilePhotoUrl": "https://example.com/new-photo.jpg"
}
```
*Note: All fields are optional - only provided fields will be updated*

**Response:**
```json
{
  "success": true,
  "message": "Staff member updated successfully",
  "data": {
    // Updated staff object
  }
}
```

### Toggle Staff Status
**PUT** `/dmc/staff/{staffId}/toggle-status` or `/hotel/staff/{staffId}/toggle-status`  
**Access:** Super Admin Only

**Response:**
```json
{
  "success": true,
  "message": "Staff member deactivated successfully",  // or "activated"
  "data": {
    // Staff object with updated isActive field
  }
}
```

### Reset Staff Password
**POST** `/dmc/staff/{staffId}/reset-password` or `/hotel/staff/{staffId}/reset-password`  
**Access:** Super Admin Only

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "newPassword": "Zx8&nM3$qP5#"  // New generated password
  }
}
```

### Delete Staff
**DELETE** `/dmc/staff/{staffId}` or `/hotel/staff/{staffId}`  
**Access:** Super Admin Only

**Response:**
```json
{
  "success": true,
  "message": "Staff member deleted successfully"
}
```

### Get Staff Count
**GET** `/dmc/staff/count` or `/hotel/staff/count`  
**Access:** Super Admin Only

**Response:**
```json
{
  "success": true,
  "message": "Staff count retrieved successfully",
  "data": {
    "count": 5
  }
}
```

## Activity Log Endpoints

### Get Activity Logs (Paginated)
**GET** `/dmc/activity-logs` or `/hotel/activity-logs`  
**Access:** All Users (Super Admin & Staff)

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 20)

**Example:** `/dmc/activity-logs?page=0&size=20`

**Response:**
```json
{
  "success": true,
  "message": "Activity logs retrieved successfully",
  "data": {
    "content": [
      {
        "id": "log123",
        "activityType": "INQUIRY_CREATED",
        "performedBy": "staff123",
        "performedByName": "Jane Smith",
        "companyName": "ABC DMC",
        "companyId": "user123",
        "targetId": "inquiry456",
        "targetType": "BidInquiry",
        "description": "Created new inquiry for Colombo to Kandy",
        "details": {
          "destination": "Kandy",
          "travelers": 4
        },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2025-01-15T14:20:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 150,
    "totalPages": 8,
    "last": false
  }
}
```

### Get Activity Logs by Date Range
**GET** `/dmc/activity-logs/range` or `/hotel/activity-logs/range`  
**Access:** All Users

**Query Parameters:**
- `startDate` (ISO format: 2025-01-01T00:00:00)
- `endDate` (ISO format: 2025-01-31T23:59:59)

**Example:** `/dmc/activity-logs/range?startDate=2025-01-01T00:00:00&endDate=2025-01-31T23:59:59`

**Response:** Same as paginated logs

### Get Recent Activities
**GET** `/dmc/activity-logs/recent` or `/hotel/activity-logs/recent`  
**Access:** All Users

**Response:**
```json
{
  "success": true,
  "message": "Recent activities retrieved successfully",
  "data": [
    // Array of last 10 activity log objects
  ]
}
```

## Activity Types Reference

### Authentication Activities
- `LOGIN` - User logged in
- `LOGOUT` - User logged out

### Staff Management Activities
- `STAFF_CREATED` - New staff member created
- `STAFF_UPDATED` - Staff member details updated
- `STAFF_ACTIVATED` - Staff account activated
- `STAFF_DEACTIVATED` - Staff account deactivated
- `STAFF_DELETED` - Staff account deleted
- `STAFF_PASSWORD_RESET` - Staff password reset by admin

### Inquiry & Bid Activities
- `INQUIRY_CREATED` - New bid inquiry created
- `INQUIRY_UPDATED` - Bid inquiry updated
- `INQUIRY_DELETED` - Bid inquiry deleted
- `BID_SUBMITTED` - Bid submitted by hotel
- `BID_UPDATED` - Bid updated
- `BID_WITHDRAWN` - Bid withdrawn
- `BID_AWARDED` - Bid awarded to hotel

### Payment Activities
- `PAYMENT_INITIATED` - Payment process started
- `PAYMENT_COMPLETED` - Payment successfully completed
- `PAYMENT_FAILED` - Payment failed

### Profile Activities
- `PROFILE_CREATED` - User profile created
- `PROFILE_UPDATED` - User profile updated
- `PROFILE_COMPLETED` - Profile completed (all required fields)

### Document Activities
- `DOCUMENT_UPLOADED` - Document uploaded
- `DOCUMENT_DELETED` - Document deleted

### Notification Activities
- `NOTIFICATION_SENT` - Notification sent to user

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

### 403 Forbidden (Staff accessing super admin endpoint)
```json
{
  "success": false,
  "message": "This action requires super admin privileges",
  "error": "Forbidden"
}
```

### 400 Bad Request (Deactivated staff login)
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact your administrator.",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Staff member not found",
  "error": "Not Found"
}
```

## Frontend Integration Examples

### Check if User is Super Admin
```javascript
// In AuthContext or component
const isSuperAdmin = () => {
  return user?.accountType === 'SUPER_ADMIN';
};

// Usage
{isSuperAdmin() && (
  <Link to="/staff-management">Manage Staff</Link>
)}
```

### Create Staff with Error Handling
```javascript
const createStaff = async (staffData) => {
  try {
    const response = await api.post('/dmc/staff', staffData);
    
    if (response.data.success) {
      const { staff, generatedPassword } = response.data.data;
      
      // Show password in modal
      showPasswordModal(generatedPassword);
      
      // Refresh staff list
      fetchStaffList();
      
      toast.success('Staff member created successfully');
    }
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error('Only super admins can create staff');
    } else {
      toast.error('Failed to create staff member');
    }
  }
};
```

### Fetch Activity Logs
```javascript
const fetchActivityLogs = async (page = 0, size = 20) => {
  try {
    const response = await api.get(
      `/dmc/activity-logs?page=${page}&size=${size}`
    );
    
    if (response.data.success) {
      const { content, totalPages, totalElements } = response.data.data;
      setLogs(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
    }
  } catch (error) {
    toast.error('Failed to fetch activity logs');
  }
};
```

### Toggle Staff Status
```javascript
const toggleStaffStatus = async (staffId) => {
  try {
    const response = await api.put(`/dmc/staff/${staffId}/toggle-status`);
    
    if (response.data.success) {
      const staff = response.data.data;
      toast.success(
        `Staff ${staff.isActive ? 'activated' : 'deactivated'} successfully`
      );
      fetchStaffList(); // Refresh list
    }
  } catch (error) {
    toast.error('Failed to update staff status');
  }
};
```

---

**Note:** Replace `/dmc` with `/hotel` for Hotel portal endpoints. All endpoints require authentication except `/auth/*` endpoints.
