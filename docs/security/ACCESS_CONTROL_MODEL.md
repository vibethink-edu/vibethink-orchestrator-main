# Access Control Model (RBAC) & Hierarchy

> **Scope:** VibeThink Platform (Admin Console + Client Dashboard)  
> **Status:** DRAFT (Canonical)  
> **Last Updated:** 2026-01-10

---

## 🏛️ Hierarchy Levels

The platform operates on two distinct levels of authority:

### Level 1: Platform (VibeThink Staff)
- **Scope:** Cross-tenant (can see all tenants).
- **Tool:** `apps/admin` (Admin Console).
- **Purpose:** Operations, Support, Billing, Security, Compliance.
- **Constraints:** Cannot generate fresh API keys for clients (keys are private). Can verify/revoke/monitor keys.

### Level 2: Tenant (Client)
- **Scope:** Single-tenant (isolated data).
- **Tool:** `apps/dashboard` (Client Dashboard).
- **Purpose:** Application usage, User management, Integration setup.
- **Constraints:** Cannot see other tenants. Cannot change platform-wide settings.

---

## 👥 Platform Roles (VibeThink)

| Role | Access | Responsibilities | Key Capabilities |
|------|--------|------------------|------------------|
| **SUPER_ADMIN** | Full | System Architecture, Emergency | Provision tenants, Change feature flags, Impersonate users. |
| **OPS** | High | Infrastructure, Billing | Monitor health, Inject credits, View audit logs. |
| **SUPPORT** | Read-Only | Customer Success, Diagnosis | View tenant status, Check API usage, Troubleshoot errors. |

---

## 🏢 Tenant Roles (Client)

| Role | Access | Responsibilities | Key Capabilities |
|------|--------|------------------|------------------|
| **OWNER** | Full | Billing, Liability | Manage credit card, Delete workspace, Transfer ownership. |
| **ADMIN** | High | User Mgmt, Integrations | Create/Revoke API Keys, Invite members, Configure webhooks. |
| **MEMBER** | Standard | Day-to-day usage | Use app features, View own usage. |

---

## 🔐 Sensitivity Matrix: API Keys & Secrets

Who can do what with sensitive credentials?

| Action | Platform (VibeThink) | Tenant Admin (Client) | Tenant Member |
|--------|----------------------|-----------------------|---------------|
| **Create Key** | ❌ NO (Private to client) | ✅ YES | ❌ NO |
| **View Key** | ❌ NO (Hashed/Masked) | ✅ YES (Once at creation) | ❌ NO |
| **Revoke Key** | ✅ YES (Security Audit) | ✅ YES | ❌ NO |
| **View Usage** | ✅ YES (Diagnostic) | ✅ YES | ❌ NO |
| **Rotate Key** | ❌ NO | ✅ YES | ❌ NO |

> **Security Rule:** VibeThink staff can NEVER see raw API keys. They can only see metadata (prefix, creation date, usage) and revoke keys in case of compromise.

---

## 🕵️‍♂️ Impersonation (Emergency Access)

**Definition:** A Platform Admin temporarily acting as a Tenant Admin to debug an issue.

**Rules:**
1. **Requires Justification:** Must enter a reason (e.g., "Ticket #123").
2. **Audit Logged:** Action is logged in BOTH Platform Audit Log and Tenant Audit Log.
3. **Time-Limited:** Session expires automatically (e.g., 1 hour).
4. **Restricted Actions:** Cannot modify billing or delete data during impersonation.

---

## 🔄 Data Visibility

| Data Point | VibeThink Support | Tenant Admin |
|------------|-------------------|--------------|
| Tenant Name/Slug | ✅ Visible | ✅ Visible |
| Feature Flags | ✅ Visible/Editable | ❌ Hidden (System) |
| Credit Balance | ✅ Visible/Editable | ✅ Read-Only |
| API Usage Stats | ✅ Visible | ✅ Visible |
| Raw User Data | ⚠️ Masked (PII) | ✅ Visible |
| Billing Invoices | ✅ Visible | ✅ Visible |

---

**Approved By:** Security Architect  
**Enforced By:** Middleware & RLS Policies
