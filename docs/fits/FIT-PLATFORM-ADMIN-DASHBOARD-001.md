# FIT-PLATFORM-ADMIN-DASHBOARD-001: The "God Mode" (Super Admin)

> **Status:** DEFINITION
> **Scope:** VibeThink Internal Operations
> **Target:** `apps/admin-portal`
> **Role:** The Central Control Tower for Support & Provisioning

---

## 1. The Vision: "One View to Rule Them All"

This is the interface for VibeThink Support & DevOps staff. It provides visibility across the entire Universe of Tenants, regardless of their vertical (Twin, Clinical, or CRM).

**Core Philosophy:** "Configuration over Code." We do not deploy new code to enable a feature for a client; we toggle a flag in this Dashboard.

---

## 2. Core Capabilities

### 2.1 The "Polymorphic Onboarding" Engine
The Dashboard controls the `onboarding_flow` configuration for each tenant.

| Tenant Type | Onboarding Modules Activated | Tech Stack Enabled |
| :--- | :--- | :--- |
| **Corporate** (Attio-Style) | `O365_SYNC`, `GWORKSPACE_SYNC`, `CRM_CORE` | Graph API, Gmail API |
| **Celebrity** (Twin-Style) | `DNA_PROFILING`, `TWIN_MEDIA`, `PAYMENT_GATE` | LiveKit, Tavus, VectorDB |
| **Clinical** (Doc-Style) | `HIPAA_AGREEMENT`, `SCANNER_CALIBRATION` | OCR Pipeline, Audit Logs |

*   **Implementation:** A JSONB column `tenant_config.active_modules` managed SOLELY by this Dashboard.

### 2.2 The "Cross-Tenant" Identity View (The Accountant Case)
We solve the "Accountant Problem" (One User, Many Contexts).

*   **Problem:** User `juan@contador.com` works for 5 different companies using ViTo.
*   **Support View:** "Where is Juan?"
    *   -> Shows list of 5 Tenants he accesses.
    *   -> Shows his Roles in each (Admin in A, Viewer in B).
    *   -> Action: "Reset Password" (Applies globally) or "Revoke Access from Tenant B".

### 2.3 AI-First Support Ops (The "Ops Agent")
Instead of passive charts, an embedded **AI Agent** specifically monitors operational health.

*   **Proactive Alerts:** "Tenant 'Andrés Cantor' is projecting a billing overrun in 4 hours based on current burst."
*   **Automated Diagnostics:** "Tenant B reported 'Sync Failed'. Agent analysis: Their Refresh Token expired 20 mins ago."
*   **Action:** Support staff clicks "Send Re-Connect Email" suggested by the Agent.

---

## 3. Architecture & Security

### 3.1 The "Super Admin" Role
*   This Dashboard uses a specific RBAC Role: `PLATFORM_SUPER_ADMIN`.
*   **Constraint:** This role CANNOT see user data (emails/chats) by default (Privacy). It sees META-DATA (usage, logs, configs).
*   **Break-Glass Protocol:** If full data access is needed for debugging, a rigorous "Break Glass" audit event is logged.

### 3.2 Global Billing Overview
*   Aggregated MRR (Monthly Recurring Revenue) across all verticals.
*   Cost Analysis: "Are we losing money on the Sports API integration?"

---

## 4. UI Modules (The Big Menu)

1.  **Universe View:** Interactive map/table of all active Tenants.
2.  **User Tracer:** Input email -> See all linked Workspaces.
3.  **Feature Flags:** Toggle `BETA_TWIN_V2` for specific tenants.
4.  **Health Center:** Red/Green status of global integrations (e.g., "Is OpenAI down?").
5.  **Audit Explorer:** Searchable log of every admin action taken on the platform.

**Signed:** VibeThink Architecture Team
