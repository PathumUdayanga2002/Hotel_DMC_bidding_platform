# 🔐 RBAC Architecture: Current vs Proposed

## Visual Comparison

### CURRENT ARCHITECTURE (FLAWED) ❌

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATFORM USERS                           │
└─────────────────────────────────────────────────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │  Hotel User │      │   DMC User  │      │   Admin     │
    │  (role)     │      │   (role)    │      │   (role)    │
    └─────────────┘      └─────────────┘      └─────────────┘
         │                      │                      │
    ┌────┴─────────────┐   ┌────┴─────────────┐       │
    ▼                  ▼   ▼                  ▼       ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ SUPER_ADMIN  │  │ SUPER_ADMIN  │  │ SUPER_ADMIN  │  │ SUPER_ADMIN  │
│ (accountType)│  │ (accountType)│  │ (accountType)│  │ (accountType)│
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
    │                  │                  │                  │
    ├──► Can access    ├──► Can access    ├──► Can access    └──► Can access
    │    all HOTEL     │    all DMC       │    PLATFORM          all 
    │    features      │    features      │    features      stakeholder
    │    + partially   │    + partially   │    + Hotel +     features
    │    DMC ❌       │    Hotel ❌      │    DMC ❌       (WRONG!) ❌
    │                 │                  │
    ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  STAFF       │  │   STAFF      │  │   STAFF      │
│ (accountType)│  │ (accountType)│  │ (accountType)│
└──────────────┘  └──────────────┘  └──────────────┘
    │                  │                  │
    ├──► Limited       ├──► Limited       └──► Limited
    │    Hotel access  │    DMC access        Platform access
    │    + Can access  │    + Can access      
    │    DMC? ❌      │    Hotel? ❌        

SECURITY GAPS:
1. SUPER_ADMIN too generic - works for all stakeholders
2. No organizational boundary enforcement
3. Hotel staff could access DMC endpoints
4. DMC staff could access Hotel endpoints
5. Hotel/DMC admins could access Platform features
```

---

### PROPOSED ARCHITECTURE (SECURE) ✅

```
┌─────────────────────────────────────────────────────────────────┐
│              MULTI-STAKEHOLDER PLATFORM                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     PLATFORM LEVEL                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     PLATFORM_SUPER_ADMIN                                │  │
│  │  (Full platform access, user management, analytics)     │  │
│  │  Can: View all hotels, DMCs, transactions, settings     │  │
│  │  Cannot: Access hotel/DMC specific operations           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      HOTEL LEVEL                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        HOTEL_SUPER_ADMIN                                │  │
│  │   (All hotel features, staff management)                │  │
│  │   Can: Create staff, manage profiles, view analytics    │  │
│  │   Cannot: Access DMC/Platform features                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        HOTEL_STAFF_ADMIN (up to N staff)               │  │
│  │   (Limited hotel features, manage inquiries)           │  │
│  │   Can: View hotel inquiries, manage bids               │  │
│  │   Cannot: Create staff, access other organizations     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       DMC LEVEL                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         DMC_SUPER_ADMIN                                 │  │
│  │    (All DMC features, staff management)                 │  │
│  │    Can: Create staff, manage profiles, view analytics   │  │
│  │    Cannot: Access Hotel/Platform features               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         DMC_STAFF_ADMIN (up to N staff)                │  │
│  │    (Limited DMC features, manage bids)                 │  │
│  │    Can: View inquiries, submit bids, manage contracts  │  │
│  │    Cannot: Create staff, access other organizations    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

SECURITY BENEFITS:
✅ Clear role hierarchy
✅ Role name indicates scope (HOTEL_, DMC_, PLATFORM_)
✅ Role name indicates level (_SUPER_ADMIN vs _STAFF_ADMIN)
✅ No cross-organization access possible
✅ Cannot confuse which role can do what
✅ Single role contains all authorization info
```

---

## Authorization Decision Tree

### CURRENT SYSTEM (Insufficient Checks)

```
REQUEST: User tries to POST /hotel/staff

Step 1: Check @PreAuthorize("hasRole('HOTEL_USER')")
        ├─ User role = HOTEL_USER? ✓ YES
        └─ Grant access? → CONTINUE

Step 2: Check staffAuthorizationService.requireSuperAdmin()
        ├─ User accountType = SUPER_ADMIN? ✓ YES
        └─ Grant access? → ALLOW ✓

PROBLEM: No check if user is from correct organization!
        Hotel A SUPER_ADMIN can modify Hotel B's staff
        DMC SUPER_ADMIN can modify Hotel's staff
        Platform ADMIN can do everything
```

### PROPOSED SYSTEM (Multiple Layers)

```
REQUEST: User tries to POST /hotel/staff

Step 1: Check @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
        ├─ User role = HOTEL_SUPER_ADMIN? 
        │  ├─ YES  → CONTINUE
        │  └─ NO   → DENY 403 ❌ 
        │          (DMC_SUPER_ADMIN, PLATFORM_SUPER_ADMIN rejected)
        
Step 2: Check Organization Boundary
        ├─ User parentUserId = CurrentOrganizationId?
        │  ├─ YES  → CONTINUE
        │  └─ NO   → DENY 403 ❌
        │          (Cannot modify other organization's staff)

Step 3: Check Staff Exists & Belongs to Organization
        ├─ Create staff for parent organization
        │  ├─ SUCCESS → ALLOW 200 ✅
        │  └─ FAIL    → DENY 400/403 ❌

BENEFITS:
✅ Multiple authorization layers
✅ Role prevents cross-stakeholder access
✅ Organization boundary prevents cross-org access
✅ Clear error messages
✅ Impossible to grant wrong permissions
```

---

## API Endpoint Protection Examples

### BEFORE (Current - INSECURE)

```
HOTEL ENDPOINTS:
GET    /hotel/profile              @PreAuthorize("hasRole('HOTEL_USER')")
POST   /hotel/staff                @PreAuthorize("hasRole('HOTEL_USER')") 
       + staffAuthorizationService.requireSuperAdmin()
DELETE /hotel/staff/{id}           @PreAuthorize("hasRole('HOTEL_USER')")
       + staffAuthorizationService.requireSuperAdmin()

DMC ENDPOINTS:
GET    /dmc/profile                @PreAuthorize("hasRole('DMC_USER')")
POST   /dmc/staff                  @PreAuthorize("hasRole('DMC_USER')")
       + staffAuthorizationService.requireSuperAdmin()
DELETE /dmc/staff/{id}             @PreAuthorize("hasRole('DMC_USER')")
       + staffAuthorizationService.requireSuperAdmin()

ADMIN ENDPOINTS:
GET    /admin/dashboard            @PreAuthorize("hasRole('ADMIN')")
       NO verification it's PLATFORM_SUPER_ADMIN

SECURITY ISSUES:
❌ Hotel staff with SUPER_ADMIN could potentially call DMC endpoints
❌ Dual-role checking in code is error-prone
❌ Admin endpoints don't validate stakeholder type
❌ No organization boundary enforcement
```

### AFTER (Proposed - SECURE)

```
HOTEL ENDPOINTS:
GET    /hotel/profile              @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
POST   /hotel/staff                @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
DELETE /hotel/staff/{id}           @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")

GET    /hotel/inquiries            @PreAuthorize("hasAnyRole('HOTEL_SUPER_ADMIN', 
                                                            'HOTEL_STAFF_ADMIN')")
       + authorizationService.requireHotelAccess(userId)
       + authorizationService.requireSameOrganization(userId, hotelId)

DMC ENDPOINTS:
GET    /dmc/profile                @PreAuthorize("hasRole('DMC_SUPER_ADMIN')")
POST   /dmc/staff                  @PreAuthorize("hasRole('DMC_SUPER_ADMIN')")
DELETE /dmc/staff/{id}             @PreAuthorize("hasRole('DMC_SUPER_ADMIN')")

GET    /dmc/inquiries              @PreAuthorize("hasAnyRole('DMC_SUPER_ADMIN',
                                                            'DMC_STAFF_ADMIN')")
       + authorizationService.requireDMCAccess(userId)
       + authorizationService.requireSameOrganization(userId, dmcId)

PLATFORM ADMIN ENDPOINTS:
GET    /admin/dashboard            @PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')")
POST   /admin/settings             @PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')")
GET    /admin/analytics            @PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')")

SECURITY BENEFITS:
✅ Role name is self-documenting
✅ Impossible to give wrong role to wrong endpoint
✅ Organization boundaries explicitly checked
✅ Cross-stakeholder access prevented at annotation level
✅ Minimal runtime checks needed (only org boundary)
✅ Cleaner code, easier to audit
```

---

## Role Hierarchy & Permissions Matrix

### CURRENT SYSTEM

```
                    HOTEL_USER       DMC_USER        ADMIN
                  (+ SUPER_ADMIN)  (+ SUPER_ADMIN)  (+ SUPER_ADMIN)
                                                    
Hotel Profile          ✓             ❌ (but could)   ❌ (but could)
Hotel Staff Management ✓             ❌ (but could)   ❌ (but could)
Hotel Analytics        ✓             ❌ (but could)   ❌ (but could)
                                     
DMC Profile            ❌ (but could) ✓              ❌ (but could)
DMC Staff Management   ❌ (but could) ✓              ❌ (but could)
DMC Analytics          ❌ (but could) ✓              ❌ (but could)
                                     
Platform Settings      ❌            ❌              ✓
Platform Analytics     ❌            ❌              ✓
User Approval          ❌            ❌              ✓

Legend:
✓  = Can access
❌ = Cannot access
❌ (but could) = SECURITY GAP - should not access but might be able to
```

### PROPOSED SYSTEM

```
                 PLATFORM   HOTEL      HOTEL      DMC        DMC
                SUPER_ADMIN SUPER_ADMIN STAFF_ADMIN SUPER_ADMIN STAFF_ADMIN
                                                   
Hotel Profile      ✓ (view)   ✓          ✓          ❌         ❌
Hotel Staff Mgmt   ✓ (manage) ✓          ❌          ❌         ❌
Hotel Analytics    ✓ (view)   ✓          ✓          ❌         ❌
Hotel Bids/RFQs    ✓ (view)   ✓          ✓          ❌         ❌
                                        
DMC Profile        ✓ (view)   ❌         ❌          ✓ (full)   ✓
DMC Staff Mgmt     ✓ (manage) ❌         ❌          ✓          ❌
DMC Analytics      ✓ (view)   ❌         ❌          ✓          ✓
DMC Bids/Proposals ✓ (view)   ❌         ❌          ✓          ✓
                                        
Platform Settings  ✓          ❌         ❌          ❌         ❌
Platform Analytics ✓          ❌         ❌          ❌         ❌
User Approval      ✓          ❌         ❌          ❌         ❌
System Reports     ✓          ❌         ❌          ❌         ❌

Legend:
✓ = Full access
✓ (view) = Read-only access
✓ (manage) = Full management access
✓ (full) = Complete stakeholder access
❌ = No access (enforced by role)
```

---

## Code Flow Comparison

### CURRENT REQUEST FLOW (Flawed)

```
User Login (role: HOTEL_USER, accountType: SUPER_ADMIN)
    ↓
POST /hotel/staff
    ↓
@PreAuthorize("hasRole('HOTEL_USER')") 
    ↓ Spring checks: user.getAuthorities() contains ROLE_HOTEL_USER?
    ├─ YES → Continue
    └─ NO → Deny
    ↓
staffAuthorizationService.requireSuperAdmin(userId)
    ↓
    ├─ Check: user.accountType == SUPER_ADMIN?
    ├─ YES → Return (allow)
    └─ NO → Throw UnauthorizedException
    ↓
Controller creates staff member
    ↓
✓ Staff created

PROBLEM:
- If same user tries POST /dmc/staff:
  ├─ @PreAuthorize("hasRole('DMC_USER')") → FAIL
  └─ But they might still have access through other means
  
- No check that staff belongs to their organization
- DMC_SUPER_ADMIN could modify Hotel staff's parent organization
```

### PROPOSED REQUEST FLOW (Secure)

```
User Login (role: HOTEL_SUPER_ADMIN)
    ↓
POST /hotel/staff
    ↓
@PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    ↓ Spring checks: user.getAuthorities() contains ROLE_HOTEL_SUPER_ADMIN?
    ├─ YES → Continue
    └─ NO → Deny (DMC_SUPER_ADMIN will be rejected here)
    ↓
authorizationService.requireHotelSuperAdmin(userId)
    ↓
    ├─ Check: user.role == HOTEL_SUPER_ADMIN?
    ├─ YES → Return (allow)
    └─ NO → Throw UnauthorizedException
    ↓
authorizationService.requireSameOrganization(userId, targetOrgId)
    ↓
    ├─ Check: user.parentUserId == targetOrgId OR user.id == targetOrgId?
    ├─ YES → Return (allow)
    └─ NO → Throw UnauthorizedException (cannot modify other org)
    ↓
Controller creates staff member with organization linkage
    ↓
✓ Staff created with correct organization boundary

BENEFITS:
- Role annotation prevents cross-stakeholder access
- Runtime check prevents cross-org access
- All checks happen in sequence
- Clear error messages if any check fails
- Impossible to bypass
```

---

## Attack Scenario Analysis

### Scenario 1: Hotel Staff tries to access DMC features

#### CURRENT SYSTEM:
```
Attacker: hotel_staff@example.com
├─ role: HOTEL_USER
├─ accountType: STAFF

Attack: POST /dmc/staff/create
Result:
├─ @PreAuthorize("hasRole('DMC_USER')") → FAIL ✓
├─ Access denied at Spring level
└─ Status: 403 Forbidden

Verdict: ✓ BLOCKED (but only because of role, not robust)
```

#### PROPOSED SYSTEM:
```
Attacker: hotel_staff@example.com
├─ role: HOTEL_STAFF_ADMIN

Attack: POST /dmc/staff/create
Result:
├─ @PreAuthorize("hasRole('DMC_SUPER_ADMIN')") → FAIL ✓
├─ Role name immediately shows this is not a DMC admin
├─ Access denied at Spring level
└─ Status: 403 Forbidden

Verdict: ✓ BLOCKED (impossible to bypass)
```

---

### Scenario 2: Hotel Super Admin tries to access Platform features

#### CURRENT SYSTEM:
```
Attacker: hotel_admin@example.com
├─ role: HOTEL_USER
├─ accountType: SUPER_ADMIN

Attack: POST /admin/settings
Result:
├─ @PreAuthorize("hasRole('ADMIN')") → FAIL ✓
├─ Access denied
└─ Status: 403 Forbidden

BUT Vulnerability: What if they forge an ADMIN role?
├─ JWT token contains role claim
├─ If signing key compromised, attacker can add ADMIN role
├─ No way to verify they should have ADMIN role for their org

Verdict: ✓ CURRENTLY BLOCKED, but vulnerable if key compromised
```

#### PROPOSED SYSTEM:
```
Attacker: hotel_admin@example.com
├─ role: HOTEL_SUPER_ADMIN

Attack: POST /admin/settings
Result:
├─ @PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')") → FAIL ✓
├─ Even if attacker adds PLATFORM_SUPER_ADMIN to JWT
├─ Role hierarchy mismatch detected
└─ Status: 403 Forbidden

Verdict: ✓ BLOCKED (even if JWT key compromised)
Reason: Role name indicates stakeholder level
```

---

## Database Schema Changes

### CURRENT STRUCTURE

```mongodb
db.users.insertOne({
  _id: ObjectId("..."),
  username: "hotel_admin",
  email: "admin@hotel.com",
  password: "bcrypt_hash",
  role: "HOTEL_USER",           ← Generic role
  accountType: "SUPER_ADMIN",   ← Super/Staff distinction
  parentUserId: null,            ← null for super admin
  isActive: true,
  fullName: "Hotel Owner",
  // ... other fields
})

db.users.insertOne({
  _id: ObjectId("..."),
  username: "hotel_staff_1",
  email: "staff@hotel.com",
  password: "bcrypt_hash",
  role: "HOTEL_USER",           ← Same as super admin!
  accountType: "STAFF",          ← Different accountType
  parentUserId: ObjectId("..."), ← Links to super admin
  isActive: true,
  fullName: "Staff Member",
  // ... other fields
})

PROBLEM: Role is same for both super admin and staff
         Only accountType differentiates them
         accountType is not used by Spring Security directly
```

### PROPOSED STRUCTURE

```mongodb
db.users.insertOne({
  _id: ObjectId("..."),
  username: "hotel_admin",
  email: "admin@hotel.com",
  password: "bcrypt_hash",
  role: "HOTEL_SUPER_ADMIN",     ← Specific role for super admin
  accountType: "SUPER_ADMIN",    ← Kept for backward compatibility
  parentUserId: null,
  isActive: true,
  fullName: "Hotel Owner",
  // ... other fields
})

db.users.insertOne({
  _id: ObjectId("..."),
  username: "hotel_staff_1",
  email: "staff@hotel.com",
  password: "bcrypt_hash",
  role: "HOTEL_STAFF_ADMIN",      ← Different role for staff
  accountType: "STAFF",            ← Kept for backward compatibility
  parentUserId: ObjectId("..."),   ← Links to super admin
  isActive: true,
  fullName: "Staff Member",
  // ... other fields
})

BENEFIT: Role field alone contains all authorization info
         No need to check accountType
         Spring Security can directly use role
```

---

## Conclusion

The proposed role-based architecture solves all identified security issues by:

1. **Making roles explicit** - Role name indicates exact permissions
2. **Eliminating generic roles** - No room for interpretation
3. **Enforcing organizational boundaries** - Runtime checks for org access
4. **Simplifying authorization** - Single annotation is sufficient
5. **Improving auditability** - Clear role hierarchy visible in code
6. **Reducing complexity** - One source of truth instead of two

**The new 6-role system is the correct architectural solution.**

