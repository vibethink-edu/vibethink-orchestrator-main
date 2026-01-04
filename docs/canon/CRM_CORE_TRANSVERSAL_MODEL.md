# CRM Core Transversal Model

**Status**: CANON
**Type**: ARCHITECTURAL_CORE
**Last Updated**: 2026-01-02
**Scope**: Identity, Tenancy, Organization Structure, Access Boundaries.
**Exclusions**: Global Ontology (World Entities), Product Features, Pricing Logic.

---

## 1. Purpose & Scope

This document defines the **CRM Core**—the nervous system of the platform. It establishes how we define "Who is acting" (**Identity**), "Where they are acting" (**Context**), and "Who owns the data" (**Tenancy**).

**Canonical Authority**:
*   All modules MUST derive their scoping and tenancy logic from this model.
*   Verticals (Sales, Ops, etc.) MUST NOT invent their own definition of "User" or "Workspace".

---

## 2. Core Entities

### 2.1 Identity & Tenancy

1.  **`tenant`** (Root Boundary)
    *   **Definition**: The billable, legal entity that owns data. The absolute hard boundary for data isolation.
    *   **Invariant**: Data MUST NEVER leak across tenants.
    *   **Legacy Map**: Maps to `organizations` table.

2.  **`identity_user`** (Internal Actor)
    *   **Definition**: A staff member or system administrator authenticated to act within the platform.
    *   **Scope**: Internal / Staff only.
    *   **Key Attributes**: `auth_id` (link to Auth Provider), `email`.
    *   **Legacy Map**: Maps to `users` (where role is staff).

3.  **`organization_unit`** (Structural Grouping)
    *   **Definition**: A hierarchical node for grouping resources or reporting (e.g., "North America Division", "Marketing Dept").
    *   **Role**: Structural only. Does NOT define data isolation boundaries implies by Tenancy.

4.  **`workspace`** (Operational Container)
    *   **Definition**: The primary container for collaborative work. Users "work in" a Workspace.
    *   **Invariant**: Every operational resource (Task, File, Deal) MUST belong to a Workspace (or directly to Tenant).
    *   **Legacy Map**: Maps to `workspaces` table.

5.  **`workspace_member`** (Access Link)
    *   **Definition**: The association between an `identity_user` and a `workspace`, carrying roles and permissions.

6.  **`capability_activation`** (Feature Flagging)
    *   **Definition**: Record that a specific specific capability (e.g., `CRM_MODULE`, `AI_AGENT_X`) is active for a Tenant or Workspace.

---

## 3. Ownership & Scoping Contract

To avoid "sparse column hell" (e.g., `org_id`, `work_id`, `sub_id` all nullable), all transversal resources MUST implement the **Owner Reference Pattern**.

### 3.1 The `owner_ref` Contract

```typescript
interface OwnerRef {
  /** Discriminator for the owner type */
  owner_type: 'TENANT' | 'ORG_UNIT' | 'WORKSPACE' | 'USER';

  /** UUID of the owner entity */
  owner_id: string; // UUID
}
```

### 3.2 Scoping Rules
1.  **Strict Hierarchy**: A `WORKSPACE` always belongs to a `TENANT`.
2.  **Default Scope**: By default, operational resources (projects, tasks) should be owned by `WORKSPACE`.
3.  **Global Scope**: System-wide configs are owned by `TENANT`.

---

## 4. Policy Integration Contract

The CRM Core provides the inputs for the Policy Layer (defined elsewhere).

*   **Subject**: `identity_user` (resolved via Auth Token).
*   **Resource**: Target Object (must have `owner_ref` + `tenant_id`).
*   **Action**: `string` (e.g., `crm:contact:create`).
*   **Context**: Derived Server-Side (Current Tenant, Current Workspace).

---

## 5. Invariants (Audit Rules)

*   **MUST**: All data queries MUST include a `tenant_id` filter (or equivalent RLS).
*   **MUST NOT**: Mix `identity_user` (Staff) and `external_principal` (Clients) in the same database table without strict discriminator types.
*   **FORBIDDEN**: Trusting `tenant_id` or `workspace_id` provided in the Request Body/Query Params without validating it against the Authenticated User's memberships.

---

## 6. Legacy Mapping (Non-Canon Transition Guide)

To align existing implementations (`packages/cli` evidence) with this Canon:

| Legacy Concept | Canonical Concept | Notes |
| :--- | :--- | :--- |
| `platforms` table | **System Provider** | The SaaS operator itself. Above Tenant. |
| `organizations` table | **`tenant`** | The billing/isolation unit. |
| `workspaces` table | **`workspace`** | Keeps same name. |
| `sub_organizations` | **`client_account`** | See `EXTERNAL_PRINCIPALS...` model. |
| `hierarchical_users` | **`workspace_member`** | Split into Member vs External Link. |

---

## 7. No-Gos (Strict Prohibitions)

1.  **Sparse Ownership Columns**: New tables MUST NOT have `org_id, workspace_id, unit_id` as separate columns. Use `owner_id` + `owner_type` (polymorphic) OR a single strict FK if scope is fixed.
2.  **Client-Side Context Trust**: Never accept `DELETE /api/workspace/:id` without checking if `auth.user` is a member of `:id`.
3.  **Ambiguous Identity**: An entity cannot be "sometimes a user, sometimes a contact".

---
**JSON Example (Resource)**
```json
{
  "id": "res_123",
  "name": "Q3 Report",
  "owner_ref": {
    "owner_type": "WORKSPACE",
    "owner_id": "ws_456"
  },
  "tenant_context_id": "ten_789" // Denormalized for RLS performance (Optional but recommended)
}
```
