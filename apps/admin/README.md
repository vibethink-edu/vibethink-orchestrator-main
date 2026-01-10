# CTRL — ViTo Global Operations Console

## What This Is
Enterprise-grade internal Control Plane for ViTo.
This is NOT a customer-facing product.

This console governs:
- Tenant lifecycle & provisioning
- Plans, limits, and cost controls
- Cross-tenant identity (1 user, N tenants)
- Security-critical operations (Break-Glass Impersonation)
- Full append-only audit trail

## What This Is NOT
- Not a business workflow UI
- Not a CRUD dashboard
- Not allowed to write directly to the database

## Core Guardrails (Non-Negotiable)
- **No direct DB writes from UI** — all mutations go through `/api/admin/*`
- **Append-Only Audit** — Every mutation emits `admin_audit_event`
- **Context Required** — Sensitive actions require `reason_code` + `ticket_ref`
- **Break-Glass** — Impersonation is time-bound, audited, and visible via global banner
- **Policy-Driven** — Tenant configuration managed via versioned JSON policies

## RBAC (MVP)
- **SUPPORT**: view-only + search + audit viewer
- **OPS**: limits, credits, resets, suspensions
- **SUPER**: break-glass impersonation + all OPS actions

### 4. Performance & UX
- **Data Density**: Admin UIs should show maximum information per pixel. Avoid "card" layouts; use tables.
- **Latency**: All list views must load in < 500ms.
- **Filtering**: Server-side filtering is mandatory for lists > 50 items.

## ✅ Testing Strategy (Agent Autonomy)

We use **Tests as Code** (Vitest) to ensure security and functionality without manual QA bottlenecks.

### Integration Tests (`tests/integration/*`)
These tests simulate API requests directly against Next.js Route Handlers, mocking the Auth/DB layer. They serve as our "Automated Postman".

- **Security Verification**: Every API endpoint has a test file verifying:
  - 401 Unauthorized (No Token)
  - 403 Forbidden (Insufficient Role)
  - 400 Bad Request (Missing Audit Context)
  - 200 OK (Happy Path)

### How to Run
```bash
# Run all admin tests
pnpm test

# Run API security tests only
vitest run tests/integration/api-rbac.test.ts
```

This strategy allows AI Agents to autonomously verify security fixes by running the test suite before requesting review.

## Developer Note
**If you are implementing UI or APIs here:**
1.  Assume auditors will read this code.
2.  Prefer safety, clarity, and auditability over speed.
3.  Never bypass the Service Layer validations.
