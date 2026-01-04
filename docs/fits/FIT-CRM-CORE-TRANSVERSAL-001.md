# FIT-CRM-CORE-TRANSVERSAL-001

**Status**: ACTIVE
**Type**: ARCHITECTURAL_TEST
**Target**: `packages/core` (Schema & Scoping)
**Ref**: `CRM_CORE_TRANSVERSAL_MODEL.md`

---

## 1. Test: Identity Purity
**Condition**:
Check the database schema definition for the `users` (or `identities`) table.

*   **FAIL**: If the table contains a discriminator column mixed with business logic status like `type: 'STAFF' | 'CLIENT'` AND both types share all columns.
*   **PASS**: If `identity_user` (Staff) and `external_principal` (Client) are separate tables OR if they are strictly 1:1 extensions of a base `auth_identity` table with distinct profile tables.

## 2. Test: Context Trust (Server-Side)
**Condition**:
Review API Controllers/Resolvers for context derivation.

*   **FAIL**: `const tenantId = req.body.tenantId;` (Blind Trust).
*   **PASS**: `const tenantId = authService.resolveTenant(req.user.id, req.header['x-tenant-slug']);` (Verified Trust).

## 3. Test: Ownership Polymorphism
**Condition**:
Inspect shared resource tables (e.g., `comments`, `files`, `tasks`).

*   **FAIL**: Table has `organization_id`, `workspace_id`, `sub_organization_id` columns (Sparse).
*   **PASS**: Table has `owner_type` and `owner_id` (Unified) OR a single, rigid `workspace_id` if the resource is strictly workspace-scoped.

## 4. Test: Tenant Isolation
**Condition**:
Inspect the SQL RLS policies or ORM Global Scopes.

*   **FAIL**: Any query is possible without a `tenant_id` WHERE clause.
*   **PASS**: All "Top Level" queries enforce `WHERE tenant_id = :current_tenant`.

---

## 5. Violation Examples (Do Not Merge)

```typescript
// ❌ REJECT: Sparse ownership
model Document {
  id: string;
  orgId?: string;      // 🤮
  workspaceId?: string; // 🤮
  userId?: string;     // 🤮
}

// ❌ REJECT: Client in Staff Table
model User {
  id: string;
  role: 'SUPER_ADMIN' | 'CLIENT_GUEST'; // 🤮 Mixing privilege levels dangerously
}
```
