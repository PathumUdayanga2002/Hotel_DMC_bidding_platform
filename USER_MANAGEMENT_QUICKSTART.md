# User Management Feature - Quick Start Guide

## 🎯 What Was Built

A complete User Management system for the Admin Portal that shows:
- **Statistics**: How many hotels and DMCs are connected
- **Pending Approvals**: List of all applications awaiting review
- **Approval Actions**: Ability to approve or reject applications

## 🚀 How to Access

1. **Login as Admin**: Navigate to `/login` and use admin credentials
2. **Go to Admin Portal**: You'll be redirected to `/admin/dashboard`
3. **Click User Management**: 
   - From the main dashboard, click the "User Management" card, OR
   - Use the sidebar menu and click "User Management"

## 📊 Features Overview

### Statistics Dashboard
Four key metrics are displayed:
- **Total Hotels** (with breakdown: Approved, Pending)
- **Total DMCs** (with breakdown: Approved, Pending)
- **Pending Approvals** (combined count)
- **Rejected** (both hotels and DMCs)

### Pending Approvals List
Each approval shows:
- Type badge (HOTEL or DMC)
- Name and location
- Contact information (email, phone)
- Applied date
- Document verification status
- Action buttons (Review, Approve, Reject)

### Actions Available
1. **Review**: Opens detailed modal with full information
2. **Approve**: One-click approval with confirmation
3. **Reject**: Requires entering a rejection reason

## 🛠️ Technical Details

### Backend Endpoints
```
GET    /api/v1/admin/user-management/stats
GET    /api/v1/admin/user-management/pending-approvals
GET    /api/v1/admin/user-management/pending-approvals/{id}
POST   /api/v1/admin/user-management/pending-approvals/{id}/action
```

### Frontend Routes
```
/admin/user-management - Main user management page
```

## 📁 Files Created

### Backend (6 files)
```
backend/src/main/java/com/hotel_bidding/backend/
├── dto/
│   ├── UserManagementStatsDTO.java
│   ├── PendingApprovalDTO.java
│   └── ApprovalActionRequest.java
├── service/
│   ├── UserManagementService.java
│   └── impl/UserManagementServiceImpl.java
└── controller/
    └── UserManagementController.java
```

### Frontend (2 files)
```
frontend/src/
├── services/
│   └── userManagementService.js
└── pages/
    └── AdminUserManagement.jsx
```

### Modified Files (3 files)
```
frontend/src/
├── App.jsx (added route)
├── pages/AdminDashboard.jsx (added navigation card)
└── pages/AdminDashboardNew.jsx (enabled menu item)
```

## 🎨 UI Components Used

- **Statistics Cards**: Color-coded gradient backgrounds
- **Pending List**: Responsive card-based layout
- **Review Modal**: Full-screen overlay with details
- **Reject Modal**: Form dialog for rejection reason
- **Pagination**: Navigate through multiple pages
- **Toast Notifications**: Success/error feedback

## ✅ Testing Checklist

- [ ] Login as admin
- [ ] Navigate to User Management
- [ ] Verify statistics display correctly
- [ ] Check pending approvals list
- [ ] Click "Review" on an approval
- [ ] Verify modal shows correct details
- [ ] Test "Approve" action
- [ ] Test "Reject" action (with reason)
- [ ] Verify pagination works
- [ ] Check responsive design on mobile

## 🔒 Security

- All endpoints require ADMIN role
- JWT authentication enforced
- Rejection reason is mandatory
- Input validation on all forms

## 📝 Usage Examples

### Approve a Hotel
1. Click "Approve" button on hotel listing
2. Confirm the action
3. Success notification appears
4. Hotel moves to "Approved" status

### Reject a DMC
1. Click "Reject" button on DMC listing
2. Enter rejection reason (required)
3. Click "Confirm Reject"
4. Success notification appears
5. DMC moves to "Rejected" status

### Review Details
1. Click "Review" button
2. Modal opens with full details
3. View hotel/DMC specific information
4. Check document verification status
5. Approve or reject from modal

## 🐛 Troubleshooting

**Statistics not showing?**
- Check backend is running on port 8081
- Verify database has hotel/DMC data
- Check browser console for errors

**Can't approve/reject?**
- Ensure you're logged in as admin
- Check network tab for API errors
- Verify JWT token is valid

**Pagination not working?**
- Ensure you have more than 10 pending approvals
- Check console for errors
- Verify API response structure

## 🎯 Next Steps

The feature is fully functional! You can:
1. Start the backend server
2. Start the frontend server
3. Login as admin
4. Navigate to User Management
5. Manage pending approvals

For detailed documentation, see `USER_MANAGEMENT_FEATURE.md`
