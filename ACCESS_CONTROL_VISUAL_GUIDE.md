# Profile Approval Access Control - Visual Guide

## User Journey Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REGISTRATION                        │
├─────────────────────────────────────────────────────────────────┤
│ User fills: Name, Email, Password                              │
│ → Account created                                               │
│ → redirects to login                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                           USER LOGIN                             │
├─────────────────────────────────────────────────────────────────┤
│ User enters email/password                                      │
│ → Logged in successfully                                        │
│ → Dashboard loads                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD - STAGE 1                           │
│                  (Profile Not Completed)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  DMC Portal                                                      │
│  ├─ ✅ Complete Profile           ← ONLY THIS ACCESSIBLE       │
│  ├─ 🔒 Post Bid Inquiry           ← LOCKED                      │
│  ├─ 🔒 My Inquiries               ← LOCKED                      │
│  ├─ 🔒 Received Contracts         ← LOCKED                      │
│  ├─ 🔒 Browse Inquiries           ← LOCKED                      │
│  ├─ 🔒 My Bids                    ← LOCKED                      │
│  ├─ 🔒 Direct Inquiries           ← LOCKED                      │
│  ├─ 🔒 Staff Management           ← LOCKED                      │
│  ├─ 🔒 Activity Logs              ← LOCKED                      │
│  └─ 🔒 Profile                    ← LOCKED                      │
│                                                                   │
│  Status Badge: Profile Not Registered                           │
│                                                                   │
│  Clicking locked items shows:                                   │
│  ⚠️ "Please complete profile registration and wait for         │
│     admin approval"                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                    ↓ User clicks "Complete Profile"
┌─────────────────────────────────────────────────────────────────┐
│              PROFILE REGISTRATION PAGE                           │
├─────────────────────────────────────────────────────────────────┤
│ User fills:                                                      │
│ • Company Name                                                   │
│ • Registration Number                                           │
│ • Office Address                                                │
│ • Contact Information                                           │
│ • Logo/Documents                                                │
│ • Submit                                                         │
└─────────────────────────────────────────────────────────────────┘
                    ↓ Profile submitted
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD - STAGE 2                           │
│              (Profile Submitted - Pending Review)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  DMC Portal                                                      │
│  ├─ ✅ Complete Profile                                         │
│  ├─ 🔒 Post Bid Inquiry           ← STILL LOCKED               │
│  ├─ 🔒 My Inquiries               ← STILL LOCKED               │
│  ├─ 🔒 Received Contracts         ← STILL LOCKED               │
│  ├─ 🔒 Browse Inquiries           ← STILL LOCKED               │
│  ├─ 🔒 My Bids                    ← STILL LOCKED               │
│  ├─ 🔒 Direct Inquiries           ← STILL LOCKED               │
│  ├─ 🔒 Staff Management           ← STILL LOCKED               │
│  ├─ 🔒 Activity Logs              ← STILL LOCKED               │
│  └─ 🔒 Profile                    ← STILL LOCKED               │
│                                                                   │
│  Status Badge: ⏳ Pending Review                                 │
│                                                                   │
│  Message: "Your profile is waiting for admin review.            │
│   You will be notified once approved."                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         ↓ Platform Super Admin reviews and approves
┌─────────────────────────────────────────────────────────────────┐
│              ADMIN PANEL - APPROVAL ACTION                       │
├─────────────────────────────────────────────────────────────────┤
│ Platform Super Admin:                                           │
│ 1. Views pending company profiles                              │
│ 2. Reviews documents & information                             │
│ 3. Clicks "Approve"                                            │
│ → Profile status updated to APPROVED                           │
│ → User receives notification                                   │
└─────────────────────────────────────────────────────────────────┘
                    ↓ User login again
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD - STAGE 3                           │
│               (Profile Approved - Full Access)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  DMC Portal                                                      │
│  ├─ ✅ Complete Profile           ← ACCESSIBLE                  │
│  ├─ ✅ Post Bid Inquiry           ← ACCESSIBLE                  │
│  ├─ ✅ My Inquiries               ← ACCESSIBLE                  │
│  ├─ ✅ Received Contracts         ← ACCESSIBLE                  │
│  ├─ ✅ Browse Inquiries           ← ACCESSIBLE                  │
│  ├─ ✅ My Bids                    ← ACCESSIBLE                  │
│  ├─ ✅ Direct Inquiries           ← ACCESSIBLE                  │
│  ├─ ✅ Staff Management           ← ACCESSIBLE (Super Admin)    │
│  ├─ ✅ Activity Logs              ← ACCESSIBLE                  │
│  └─ ✅ Profile                    ← ACCESSIBLE                  │
│                                                                   │
│  Status Badge: ✓ Approved                                       │
│                                                                   │
│  User is now Super Admin of their organization                 │
│  Can create staff, post inquiries, bid on projects, etc.      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Sidebar Lock/Unlock States

### Before Fix (WRONG) ❌
```
User Logs In
    ↓
All menu items immediately accessible
    ↓
User can access features without completing profile
    ↓
SECURITY ISSUE
```

### After Fix (CORRECT) ✅
```
User Logs In
    ↓
profileStatus.isApproved == false
    ↓
Loop through menu items:
  ├─ requiresApproval: false → locked = false ✅
  └─ requiresApproval: true  → locked = true  🔒
    ↓
Only "Complete Profile" accessible
All other items show padlock icon
```

## Code Logic Flow

```
┌─────────────────────────┐
│   User Logs In          │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  fetchProfileStatus()   │
│  ↓                      │
│  profileStatus = {      │
│    isApproved: false,   │
│    status: 'PENDING'    │
│  }                      │
└────────────┬────────────┘
             ↓
┌─────────────────────────────────────┐
│  isFeatureLocked()                  │
│  return !profileStatus?.isApproved  │
│  → returns: true                    │
└────────────┬────────────────────────┘
             ↓
┌──────────────────────────────────────────┐
│  Render Menu Items                       │
│                                          │
│  menuItems.map((item) => {              │
│    const locked = item.requiresApproval │
│      ? isFeatureLocked()  // ← true     │
│      : false                            │
│    ↓                                    │
│    if (item.id === 'profile')          │
│      locked = false  ✅ Accessible      │
│    else                                 │
│      locked = true   🔒 Locked          │
│  })                                     │
└────────────┬─────────────────────────────┘
             ↓
┌─────────────────────────┐
│  Sidebar Rendered       │
│  ✅ Complete Profile    │
│  🔒 Post Bid Inquiry    │
│  🔒 My Inquiries        │
│  ... (all locked)       │
└─────────────────────────┘
```

## State Transitions

```
┌──────────────────────────────────────────────────────────────┐
│                    PROFILE STATES                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  NOT_STARTED                                                 │
│  (No profile created)                                        │
│  • Menu items: 🔒 LOCKED                                     │
│  • isApproved: false                                        │
│  • isFeatureLocked(): true                                  │
│           ↓                                                  │
│  PENDING/UNDER_REVIEW                                        │
│  (Profile submitted, awaiting admin approval)               │
│  • Menu items: 🔒 LOCKED                                    │
│  • isApproved: false                                        │
│  • isFeatureLocked(): true                                  │
│           ↓                                                  │
│  APPROVED                                                    │
│  (Admin approved the profile)                               │
│  • Menu items: ✅ UNLOCKED                                   │
│  • isApproved: true                                         │
│  • isFeatureLocked(): false                                 │
│           ↓                                                  │
│  SUSPENDED (rare)                                            │
│  (Admin suspended the account)                              │
│  • Menu items: 🔒 LOCKED                                    │
│  • isApproved: false                                        │
│  • isFeatureLocked(): true                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Visual Sidebar Comparison

### Stage 1: Profile Not Registered
```
┌─────────────────────┐
│   DMC Portal        │
├─────────────────────┤
│ ✓ Complete Profile  │  ← Can click
├─────────────────────┤
│ 🔐 Post Inquiry     │  ← Cannot click
│ 🔐 My Inquiries     │  ← Cannot click
│ 🔐 Received Items   │  ← Cannot click
│ 🔐 Browse Inquiries │  ← Cannot click
│ 🔐 My Bids          │  ← Cannot click
│ 🔐 Direct Inquiries │  ← Cannot click
│ 🔐 Staff Mgmt       │  ← Cannot click
│ 🔐 Activity Logs    │  ← Cannot click
│ 🔐 Profile          │  ← Cannot click
└─────────────────────┘
Status: Profile Not Registered
```

### Stage 3: Profile Approved
```
┌─────────────────────┐
│   DMC Portal        │
├─────────────────────┤
│ ✓ Complete Profile  │  ← Can click
├─────────────────────┤
│ ✓ Post Inquiry      │  ← Can click
│ ✓ My Inquiries      │  ← Can click
│ ✓ Received Items    │  ← Can click
│ ✓ Browse Inquiries  │  ← Can click
│ ✓ My Bids           │  ← Can click
│ ✓ Direct Inquiries  │  ← Can click
│ ✓ Staff Mgmt        │  ← Can click (Super Admin)
│ ✓ Activity Logs     │  ← Can click
│ ✓ Profile           │  ← Can click
└─────────────────────┘
Status: ✓ Approved
```

---

**File Modified**: `frontend/src/pages/DMCDashboard.jsx`  
**Type**: Access Control Fix  
**Priority**: Critical  
**Status**: ✅ Complete
