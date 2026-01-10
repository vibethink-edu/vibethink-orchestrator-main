# CTRL — Global Operations Console (ViTo Nexus)

> **Status:** ACTIVE
> **Target:** `apps/admin` (Standalone Admin Portal)
> **Access:** Prohibited to Clients. Internal Staff ONLY.

---

## 1. System Overview

The **ViTo Nexus System** is the internal control plane for VibeThink. It enables Support, DevOps, and Account Managers to provision, monitor, and troubleshoot Tenants across all verticals (Twin, Clinical, CRM).

**Critical Guardrail:**
> This console NEVER writes directly to the database via client-side logic. All mutations MUST pass through the strictly typed `/api/admin` service layer which enforces RBAC and Audit Logging.

---

## 2. Functional Capabilities

### 2.1 Provisioning & Onboarding Configurator
Controls the "shape" of a Tenant via Policy Configuration.

*   **Tenant Flavor:** `ENTERPRISE` (SSO forced), `PRO` (Self-serve), `TRIAL`.
*   **Vertical Modules:**
    *   `ENABLE_DIGITAL_TWIN` (boolean)
    *   `ENABLE_CLINICAL_OPS` (boolean)
    *   `ENABLE_CRM_INTEGRATION` (boolean)

### 2.2 Billing Throttle & Credits
Manage the economic lifecycle of a Tenant.

*   **Hard Limits:** Override defaults (e.g., increase Token Limit for VIP client).
*   **Manual Credits:** Issue "Apology Credits" or "Pilot Budget".
*   **Emergency Brake:** usage freeze switch for unpaid bills.

### 2.3 Cross-Tenant Identity
View a user's presence across the entire multiverse.
*   Input: `user_email`
*   Output: List of all Tenants where this user has a role.
*   Actions: Password Reset, Global Suspension.

---

## 3. Security Architecture

### 3.1 Role-Based Access Control (RBAC) (Simplified MVP)

| Role | Scope | Search/View | Edit Limits | Reset Users | Break-Glass |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **SUPPORT** | Read-Only | ✅ | ❌ | ❌ | ❌ |
| **OPS** | Operational | ✅ | ✅ | ✅ | ❌ |
| **SUPER** | Root Access | ✅ | ✅ | ✅ | ✅ |

### 3.2 Audit Logging (Immutable)
Every non-read action generates an `admin_audit_event`.
*   **Who:** Actor ID + Role
*   **What:** Action Type + Target Tenant
*   **Why:** `reason_code` + `ticket_ref` (MANDATORY)
*   **Change:** Before/After JSON Diff

### 3.3 Break-Glass Impersonation
See [BREAK_GLASS_IMPERSONATION.md](../security/BREAK_GLASS_IMPERSONATION.md).

---

## 4. Technical Implementation

*   **Framework:** Next.js App Router (`apps/admin`)
*   **Styling:** shadcn/ui (Density: High)
*   **State:** Server Actions + React Query
*   **Database:** Supabase (Direct connection for Admin Service)
