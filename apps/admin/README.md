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

## Performance & UX
- Dense, technical UI (Control Room style)
- Server-side filtering & pagination
- Target <500ms perceived load for list views

## Developer Note
**If you are implementing UI or APIs here:**
1.  Assume auditors will read this code.
2.  Prefer safety, clarity, and auditability over speed.
3.  Never bypass the Service Layer validations.
