# External Principals & Client Accounts Model

**Status**: CANON
**Type**: ARCHITECTURAL_CORE
**Last Updated**: 2026-01-02
**Scope**: External Identity, Client Access, B2B/B2C Relationships.
**Dependencies**: `CRM_CORE_TRANSVERSAL_MODEL.md`

---

## 1. Purpose

This document defines how **External Actors** (Clients, Partners, Vendors) interact with the CRM Core. It solves the "Dual Identity" problem (Staff vs. Client) and enforces strict isolation for external access.

**Critical Law**:
> An `external_principal` is NEVER an `identity_user`. They are distinct table entities with distinct authentication lifecycles, even if they share an Auth Provider (e.g., Auth0/Supabase Auth).

---

## 2. Core Entities

### 2.1 `client_account` (The External Organization)
*   **Definition**: The entity representing the external business or household.
*   **Role**: Groups external principals and shared resources.
*   **Ownership**: Owned by a `workspace` (or `tenant`).
*   **Legacy Map**: Maps to `sub_organizations`.

### 2.2 `external_principal` (The External User)
*   **Definition**: A human or machine actor belonging to a `client_account` who needs limited access to the platform (e.g., Client Portal).
*   **Authentication**: Linked to an Auth Provider ID, but distinct from Staff ID.
*   **Invariant**: MUST NOT have direct permissions on `workspace` resources unless explicitly granted via `external_membership`.

### 2.3 `external_membership` (The Bridge)
*   **Definition**: A record granting an `external_principal` access to a specific `workspace` or `client_account` scope.
*   **Attributes**: `status` (ACTIVE/INACTIVE), `access_level` (VIEWER/EDITOR).

### 2.4 `client_workspace_link` (B2B Connection)
*   **Definition**: Many-to-Many link between a `client_account` and internal `workspaces`.
*   **Use Case**: "Acme Corp (Client)" works with "Sales Workspace" AND "Support Workspace".

---

## 3. Access Control Rules (The "Guest" Logic)

### 3.1 Precondition: Active Membership
No external request can proceed unless:
1.  Token resolves to an `external_principal`.
2.  `external_membership` exists for the target scope.
3.  `external_membership.status` is 'ACTIVE'.

### 3.2 Resource Visibility (Tagging Pattern)
Resources (docs, tasks) are NOT "owned" by the client. They are owned by the `workspace` and **tagged** for client visibility.

*   **Pattern**: `visibility_scope: 'INTERNAL' | 'CLIENT_SHARED'`
*   **Link**: `client_account_id` (FK) on the resource.

**Restriction**:
*   **MVP**: `owner_type` MUST remains `WORKSPACE` (or `USER` for staff).
*   **Forbidden**: Do NOT use `owner_type: 'CLIENT_ACCOUNT'` for operational resources in the MVP. Clients "see" workspace data; they don't "host" it architecturally yet.

---

## 4. Invariants (Audit Rules)

*   **MUST**: Every External API endpoint MUST validate `external_membership` before returning data.
*   **MUST NOT**: Grant an `external_principal` a "Staff Role" (e.g., 'ADMIN', 'MANAGER') in a workspace. They only have "Client Roles".
*   **FORBIDDEN**: Storing Client Passwords/Secrets in the same table as Staff Credentials (if utilizing distinct auth mechanisms).

---

## 5. JSON Example (External Principal)

```json
{
  "id": "ext_user_999",
  "client_account_id": "cli_acct_888",
  "email": "contact@client.com",
  "memberships": [
    {
      "workspace_id": "ws_456",
      "status": "ACTIVE",
      "role": "PORTAL_VIEWER"
    }
  ]
}
```

---

## 6. Implementation Notes

*   **Separation**: Ensure UI/Frontend uses distinct "Portals" for Clients vs "Dashboards" for Staff to avoid pollution of context.
*   **Onboarding**: `client_account` creation usually triggers an invitation flow for `external_principal`.

---
