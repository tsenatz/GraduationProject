# ERNS --- Zillow-Style User → Role → Verification → Property Architecture

## Purpose

This document defines the recommended ERNS architecture for user
accounts, roles, phone verification, professional/agent verification,
property ownership, property management, and backend authorization.

> **Core principle:** Being an agent and being authorized to manage a
> specific property are separate concepts.

## 1. Complete Authorization Chain

ERNS should use one unified account system:

``` text
ACCOUNT
   ↓
ROLE
   ↓
VERIFICATION
   ↓
PROPERTY RELATIONSHIP
   ↓
PERMISSION
```

  -----------------------------------------------------------------------
  Layer                   Question                Examples
  ----------------------- ----------------------- -----------------------
  Account                 Who are you?            User ID, email, phone

  Role                    What type of ERNS user  USER, AGENT, BROKER,
                          are you?                ADMIN

  Verification            What has been           Phone, professional
                          validated?              verification

  Property Relationship   What is your connection OWNER, MANAGER, AGENT,
                          to this property?       TENANT

  Permission              What can you do?        View, edit, manage,
                                                  list, administer
  -----------------------------------------------------------------------

## 2. Account: One Identity System

Use one unified `User` account system. A person should not need separate
accounts for being a consumer and an agent.

A user can progress conceptually:

``` text
User creates account
        ↓
USER
        ↓
Phone verified
        ↓
User becomes an agent
        ↓
Professional verification
        ↓
AGENT + VERIFIED
        ↓
Authorized to manage Property A
```

Recommended general User fields:

``` text
id
name
email
phone
phoneVerified
role
createdAt
updatedAt
```

> **Phone verification does NOT automatically make someone an agent.**

## 3. Roles

### USER

Normal ERNS consumer or property owner.

Possible capabilities:

-   Search properties
-   Save properties
-   Contact agents/owners
-   Own properties
-   Manage properties they are authorized to manage
-   Rent properties

A normal `USER` can therefore be a property owner.

### AGENT

A real-estate professional.

Possible capabilities:

-   Professional profile
-   Represent clients
-   List properties
-   Manage properties they are authorized to manage
-   Communicate with owners/renters

> **AGENT status alone does not give access to every property.**

### BROKER

A broker or professional-level account.

Potential future capabilities:

-   Manage agents
-   Brokerage information
-   Professional oversight
-   Brokerage listings

### ADMIN

ERNS administrator.

Possible capabilities:

-   Verify professionals
-   Moderate users
-   Moderate properties
-   Manage platform data
-   Review reports

Admin permissions must be enforced server-side.

## 4. Verification

Keep different trust checks separate.

### Phone Verification

**Proves:** the user controls the submitted phone number.

**Does not prove:**

-   The user is an agent
-   The user owns a property
-   The user is authorized to manage a property
-   The user is a broker

Example:

``` text
Phone: +251912345678
Phone verified: YES
Role: USER
```

This is completely valid.

### Professional / Agent Verification

This verifies the user's professional identity/status.

Possible verification statuses:

``` text
PENDING
VERIFIED
REJECTED
```

Professional verification may involve:

-   License information
-   Brokerage information
-   Professional documents
-   Admin review

> Professional verification does NOT automatically authorize an agent to
> manage every property.

### Property Authorization

This answers:

> **Is this user authorized to perform this action on this specific
> property?**

Example:

``` text
Role: AGENT
Professional verification: VERIFIED

Property A:
Relationship: AGENT
Status: ACTIVE

→ Can manage Property A
```

But:

``` text
Role: AGENT
Professional verification: VERIFIED

Property B:
No relationship

→ Cannot manage Property B
```

## 5. AgentProfile

Keep professional information separate from general account information.

``` text
User
 │
 └── AgentProfile
       ├── licenseNumber
       ├── brokerageId
       ├── professionalPhone
       ├── bio
       ├── verificationStatus
       ├── verifiedAt
       └── rejectionReason
```

Suggested fields:

``` text
id
userId
licenseNumber
brokerageId
professionalPhone
bio
verificationStatus
verifiedAt
rejectionReason
```

## 6. Property Ownership & Management

Property permissions must be **property-specific**.

A user can have different relationships with different properties:

``` text
User A
 ├── Property 1 → OWNER
 ├── Property 2 → MANAGER
 └── Property 3 → TENANT
```

An agent could have:

``` text
Agent A
 ├── Property 1 → AGENT
 ├── Property 2 → AGENT
 └── Property 3 → no relationship
```

Agent A should not automatically have access to Property 3.

## 7. Recommended Property Relationship Model

Use a separate relationship model such as:

``` text
PropertyUser
```

Conceptually:

``` text
PropertyUser
-------------------------
id
propertyId
userId
relationship
status
createdAt
```

Recommended relationship values:

``` text
OWNER
MANAGER
AGENT
TENANT
```

Recommended status values:

``` text
PENDING
ACTIVE
REVOKED
```

## 8. Why Use a Property Relationship Table?

A simple:

``` text
Property.ownerId
```

may work for basic ownership, but real-world systems often need multiple
people connected to the same property.

Example:

``` text
Property A
│
├── Tsenat → OWNER
├── Agent X → AGENT
└── Manager Y → MANAGER
```

A relationship table is more scalable.

## 9. The "Manage Rental" Flow

The Zillow-style behavior that matters is that clicking:

``` text
Manage Rental
```

should trigger a **property authorization check**, not simply an
agent-role check.

Recommended flow:

``` text
User signs in
      ↓
User selects property
      ↓
Server identifies authenticated user
      ↓
Check property relationship
      ↓
Is user OWNER / MANAGER / authorized AGENT?
      ↓
       YES
        ↓
Perform required verification checks
        ↓
Grant management access
```

If there is no valid relationship:

``` text
→ Deny access
```

## 10. Examples

  -----------------------------------------------------------------------
  Scenario                            Result
  ----------------------------------- -----------------------------------
  USER + verified phone + OWNER       Can manage authorized property

  USER + verified phone + no          Cannot manage another user's
  relationship                        property

  VERIFIED AGENT + no relationship    Cannot manage property merely
                                      because they are an agent

  VERIFIED AGENT + AGENT relationship Can perform authorized agent
                                      actions

  AGENT + PENDING verification        Restricted from protected
                                      verified-agent actions

  ADMIN                               Administrative capabilities
                                      according to backend policy
  -----------------------------------------------------------------------

## 11. Conceptual Prisma Schema

Adapt this to the existing ERNS Prisma schema rather than replacing it
blindly.

``` prisma
model User {
  id            String   @id @default(cuid())
  email         String?  @unique
  phone         String?  @unique
  phoneVerified DateTime?
  role          Role     @default(USER)

  agentProfile  AgentProfile?
  propertyLinks PropertyUser[]
}

model AgentProfile {
  id                 String             @id @default(cuid())
  userId             String             @unique
  licenseNumber      String?
  brokerageId        String?
  professionalPhone  String?
  verificationStatus AgentVerification  @default(PENDING)
  verifiedAt         DateTime?
  rejectionReason    String?

  user User @relation(fields: [userId], references: [id])
}

model PropertyUser {
  id           String               @id @default(cuid())
  propertyId   String
  userId       String
  relationship PropertyRelationship
  status       PropertyLinkStatus   @default(ACTIVE)
  createdAt    DateTime             @default(now())

  property Property @relation(fields: [propertyId], references: [id])
  user     User     @relation(fields: [userId], references: [id])

  @@unique([propertyId, userId, relationship])
}

enum Role {
  USER
  AGENT
  BROKER
  ADMIN
}

enum AgentVerification {
  PENDING
  VERIFIED
  REJECTED
}

enum PropertyRelationship {
  OWNER
  MANAGER
  AGENT
  TENANT
}

enum PropertyLinkStatus {
  PENDING
  ACTIVE
  REVOKED
}
```

## 12. Backend Authorization

The frontend may hide/show UI based on roles, but it must **never be the
security boundary**.

The backend must verify authorization for every protected operation.

Example:

``` typescript
const user = authenticatedSession.user;

if (!user) {
  return 401;
}

const relationship = await prisma.propertyUser.findFirst({
  where: {
    propertyId,
    userId: user.id,
    status: "ACTIVE",
    relationship: {
      in: ["OWNER", "MANAGER", "AGENT"]
    }
  }
});

if (!relationship) {
  return 403;
}

// Continue with the management operation
```

For professional-only actions, additionally require the appropriate role
and verified professional status.

## 13. Never Trust Client-Supplied Ownership

Do not use client-provided IDs as proof of authorization:

``` typescript
const { userId, propertyId } = await request.json();

if (userId === property.ownerId) {
  // allow
}
```

Instead:

``` text
Browser
   ↓
Authenticated session
   ↓
Server obtains user.id
   ↓
Server checks database relationship
   ↓
Server grants/denies access
```

The authenticated identity should come from the server-side
session/authentication system.

## 14. Agent Authorization

For professional-only actions:

``` text
Authenticated user
        +
Role = AGENT
        +
Agent verification = VERIFIED
        +
Property relationship = AGENT
        +
Relationship status = ACTIVE
        ↓
AUTHORIZED
```

Not:

``` text
Role = AGENT
        ↓
AUTHORIZED EVERYWHERE
```

## 15. Phone OTP Architecture

Phone OTP should be a security mechanism.

``` text
User enters phone
        ↓
/api/auth/phone/send-otp
        ↓
Validate phone
        ↓
Generate OTP
        ↓
Store OTP securely
        ↓
Send SMS
        ↓
User receives OTP
        ↓
User enters OTP
        ↓
/api/auth/phone/verify-otp
        ↓
Validate session
        ↓
Validate OTP
        ↓
Check expiration
        ↓
Mark User.phoneVerified
        ↓
Invalidate OTP
```

Phone verification should generally update:

``` text
User.phone
User.phoneVerified
```

rather than only:

``` text
AgentProfile.professionalPhone
```

Professional phone information can remain in `AgentProfile` if ERNS
needs it.

## 16. OTP Security Rules

Production OTP implementation should:

1.  Use a cryptographically secure OTP generator.
2.  Rate-limit OTP requests.
3.  Rate-limit failed verification attempts.
4.  Make OTPs single-use.
5.  Invalidate expired OTPs.
6.  Keep SMS API credentials server-side.
7.  Consider storing a hash of the OTP instead of plaintext.
8.  Never expose OTPs in production API responses or logs.
9.  Keep phone verification separate from professional verification.
10. Never let successful phone verification automatically assign
    `AGENT`.

## 17. Important Distinctions

Keep these concepts separate:

``` text
Phone Verified
      ≠
Agent Verified
      ≠
Property Owner
      ≠
Property Manager
      ≠
Property Agent
      ≠
Admin
```

For example:

``` text
A USER can be an OWNER.

An AGENT can be an AGENT for Property A.

A VERIFIED AGENT can have no relationship with Property B.

A TENANT can be associated with a property without owning it.

A phone-verified user does not automatically gain professional privileges.
```

## 18. Recommended "Manage Rental" Permission Check

When the user selects **Manage Rental**, the backend should conceptually
perform:

``` text
1. Is the user authenticated?
       ↓
2. Does the property exist?
       ↓
3. Does this user have a property relationship?
       ↓
4. Is the relationship ACTIVE?
       ↓
5. Does this action require phone verification?
       ↓
6. Does this action require professional verification?
       ↓
7. Does the user's role satisfy the action?
       ↓
8. Grant or deny the operation.
```

## 19. Future-Proofing

Possible future property relationships:

``` text
OWNER
CO_OWNER
MANAGER
AGENT
BROKER
TENANT
PROPERTY_ADMIN
MAINTENANCE
```

Possible future roles:

``` text
USER
AGENT
BROKER
ADMIN
PROPERTY_MANAGER
```

Do not hard-code the assumption:

``` text
One user = one property permission
```

A user may have many relationships with many properties.

## 20. Instructions for the Coding Agent

### Account

-   Use one unified authentication/account system.
-   Do not create separate authentication systems for consumers and
    agents.
-   A user can transition from USER to AGENT without creating another
    account.

### Roles

-   Use explicit roles such as USER, AGENT, BROKER, and ADMIN.
-   Do not infer role from phone verification.
-   Do not let the frontend assign privileged roles.

### Verification

-   Keep phone verification separate from professional verification.
-   Keep professional verification separate from property authorization.
-   Agent verification should have explicit statuses such as PENDING,
    VERIFIED, and REJECTED.

### Agent Profile

-   Keep professional information in AgentProfile.
-   Do not unnecessarily put professional fields into User.

### Properties

-   Represent property-specific relationships explicitly.
-   Support OWNER, MANAGER, AGENT, and TENANT relationships.
-   Support relationship statuses such as PENDING, ACTIVE, and REVOKED.

### Authorization

-   Always derive the authenticated user from the server-side
    authentication/session.
-   Never trust client-supplied `userId`, `agentId`, `ownerId`, or
    similar fields as authorization proof.
-   Every protected property-management API must check the database
    relationship.
-   Every professional-only API must check the appropriate role and
    professional verification status.

### Manage Rental

-   Do not use `role === AGENT` as the only condition.
-   Check whether the user is authorized for that specific property.
-   Apply additional phone/professional verification requirements where
    appropriate.

### Database

-   Adapt this architecture to the existing ERNS Prisma schema.
-   Do not delete or overwrite existing models without checking current
    relationships.
-   Prefer additive, backward-compatible changes where possible.
-   Preserve existing authentication and property data unless migration
    is explicitly planned.

## 21. Final Architecture Rule

ERNS should answer five separate questions:

### 1. Identity

> **Who are you?**

``` text
User account
```

### 2. Role

> **What are you on ERNS?**

``` text
USER / AGENT / BROKER / ADMIN
```

### 3. Verification

> **What claims have we validated?**

``` text
Phone verified
Professional verified
```

### 4. Property Relationship

> **What is your connection to this property?**

``` text
OWNER / MANAGER / AGENT / TENANT
```

### 5. Permission

> **What are you allowed to do right now?**

``` text
VIEW
EDIT
MANAGE
LIST
ADMINISTER
```

Therefore:

``` text
             USER ACCOUNT
                  │
                  ▼
                ROLE
                  │
                  ▼
             VERIFICATION
                  │
                  ▼
        PROPERTY RELATIONSHIP
                  │
                  ▼
             PERMISSION
```

> **This separation is the key Zillow-style architectural principle for
> ERNS.**

It prevents the common mistake of treating:

``` text
"I am an agent"
```

as equivalent to:

``` text
"I am authorized to manage this property."
```

Those are different claims and should be represented, verified, and
authorized separately.
