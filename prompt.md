# NexaStock Backend Stabilization & Production Architecture Phase

You are now entering the backend stabilization and production-hardening phase of NexaStock.

IMPORTANT:
Do NOT redesign the UI.
Do NOT rebuild existing flows.
Do NOT break existing frontend integrations.

Preserve:

* current routes
* current frontend API compatibility
* current Prisma schema
* existing onboarding/POS/inventory workflows

Your goal now is to transform the current connected full-stack prototype into a scalable, enterprise-grade SaaS backend architecture.

The system already has:

* modular Prisma schema
* PostgreSQL + Prisma
* onboarding flow
* inventory flow
* POS flow
* analytics flow
* AI insights flow
* frontend-backend integration
* TypeScript validation passing

Now the focus is:

* architecture quality
* security
* maintainability
* scalability
* SaaS correctness
* multi-tenant protection

---

# PRIMARY GOALS

Refactor and stabilize the backend into:

* modular backend architecture
* secure authentication system
* RBAC authorization
* strict tenant isolation
* reusable services
* centralized validation
* centralized error handling
* production-grade API standards

The final architecture should feel like:
Stripe / Shopify / Linear / Vercel backend quality.

---

# REQUIRED BACKEND ARCHITECTURE

Refactor backend into:

src/
│
├── modules/
│   ├── auth/
│   ├── tenant/
│   ├── users/
│   ├── inventory/
│   ├── products/
│   ├── stores/
│   ├── warehouses/
│   ├── procurement/
│   ├── transfers/
│   ├── pos/
│   ├── analytics/
│   ├── ai/
│   ├── notifications/
│   └── compliance/
│
│   Each module should contain:
│   ├── controller.ts
│   ├── service.ts
│   ├── repository.ts
│   ├── routes.ts
│   ├── schema.ts
│   ├── dto.ts
│   ├── types.ts
│   └── mapper.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── tenant.middleware.ts
│   ├── permission.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── rate-limit.middleware.ts
│
├── lib/
│   ├── prisma.ts
│   ├── logger.ts
│   ├── jwt.ts
│   ├── password.ts
│   ├── pagination.ts
│   ├── response.ts
│   ├── errors.ts
│   └── constants.ts
│
├── config/
│
├── types/
│
├── app.ts
└── server.ts

---

# AUTHENTICATION SYSTEM

Implement real authentication.

Current frontend login/register flows should now connect to actual backend auth.

Implement:

* bcrypt password hashing
* JWT access tokens
* refresh token rotation
* secure cookie handling
* login
* register
* logout
* token refresh
* current-user session endpoint

Create:

* auth middleware
* protected routes
* role-aware session handling

Use secure practices.

Never expose:

* password hashes
* sensitive tenant metadata
* internal IDs unnecessarily

---

# MULTI-TENANT SECURITY (CRITICAL)

Every database query MUST enforce tenant isolation.

All queries must use:

where: {
tenantId: currentTenantId
}

Implement:

* tenant middleware
* request-scoped tenant resolution
* tenant-safe repositories

Prevent:

* cross-tenant reads
* cross-tenant writes
* unsafe admin access

This is mandatory.

---

# RBAC AUTHORIZATION

The Prisma schema already contains:

* Role
* Permission
* RolePermission

Now fully implement RBAC.

Create:

* permission middleware
* route-level permission guards
* role-aware API access

Example:

* Cashier:

  * can create sales
  * cannot edit products
* Warehouse Operator:

  * can update stock
  * cannot access analytics
* Supplier:

  * limited procurement visibility
* Admin:

  * full tenant access

Do NOT hardcode permissions.
Use DB-driven permission checks.

---

# VALIDATION SYSTEM

Use Zod for:

* request body validation
* query validation
* params validation
* DTO parsing

Create reusable schemas.

Never trust frontend input.

All routes must validate input before business logic executes.

---

# ERROR HANDLING SYSTEM

Implement centralized error handling.

Create:

* AppError
* ValidationError
* UnauthorizedError
* ForbiddenError
* NotFoundError
* ConflictError

Create:

* asyncHandler wrapper
* standardized API responses
* consistent error formatting

Avoid:

* duplicated try/catch
* inconsistent error shapes

---

# RESPONSE STANDARDIZATION

All APIs should return standardized responses:

Success:
{
success: true,
data,
meta?,
message?
}

Error:
{
success: false,
error: {
code,
message,
details?
}
}

Add pagination metadata support.

---

# REPOSITORY + SERVICE LAYER

Separate:

* route handling
* business logic
* database access

Routes/controllers:

* thin
* validation only
* call services

Services:

* business logic

Repositories:

* Prisma queries only

Avoid Prisma queries directly inside route files.

---

# INVENTORY & POS HARDENING

Improve operational flows:

Inventory:

* stock adjustment logs
* movement audit trails
* transactional inventory updates
* low-stock threshold enforcement

POS:

* transactional checkout
* rollback on failure
* payment state handling
* customer association
* invoice generation
* return/refund flow

Use Prisma transactions where needed.

---

# ANALYTICS IMPROVEMENTS

Replace fake metrics with:

* aggregated DB queries
* reusable analytics services
* KPI calculators

Create:

* revenue summaries
* inventory turnover
* low stock alerts
* sales velocity
* store performance metrics

---

# AI MODULE STABILIZATION

Do NOT build advanced AI yet.

Instead:

* stabilize AI recommendation endpoints
* create AI service abstraction layer
* centralize forecasting logic
* prepare clean historical datasets

AI should consume:

* sales history
* inventory history
* stock movement history

Avoid fake hardcoded insights.

---

# AUDIT LOGGING

Implement audit logging for:

* stock changes
* role changes
* login activity
* checkout activity
* purchase order approvals

Use:

* AuditLog table
* ActivityEvent table

Track:

* actor
* action
* entity
* entityId
* timestamp

---

# API DOCUMENTATION

Implement Swagger/OpenAPI docs.

Create:

* /docs endpoint
* typed endpoint documentation
* auth examples
* request/response schemas

This is important for:

* frontend development
* demos
* deployment
* recruiter review

---

# RATE LIMITING & SECURITY

Add:

* helmet
* CORS config
* request rate limiting
* input sanitization
* secure headers

Protect:

* auth routes
* POS endpoints
* analytics endpoints

---

# CODE QUALITY REQUIREMENTS

Avoid:

* giant route files
* duplicated logic
* inline Prisma everywhere
* mixed concerns
* random utilities dumping

Enforce:

* reusable abstractions
* naming consistency
* typed DTOs
* clean module boundaries

---

# TYPESCRIPT REQUIREMENTS

Maintain:

* strict typing
* no implicit any
* DTO typing
* Prisma-generated type usage

Do NOT bypass type safety.

---

# TESTING

Add:

* integration test structure
* auth test coverage
* tenant isolation tests
* inventory transaction tests

Prepare architecture for future CI/CD.

---

# IMPORTANT CONSTRAINTS

Do NOT:

* redesign frontend
* remove existing endpoints
* break existing frontend pages
* rewrite Prisma schema architecture

Instead:

* stabilize
* modularize
* secure
* optimize

---

# FINAL EXPECTATION

The backend should evolve from:
“working demo backend”

into:
“production-ready multi-tenant SaaS ERP backend.”

The codebase should look like it was engineered by a senior backend team at a serious enterprise software company.
