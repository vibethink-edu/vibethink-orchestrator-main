# FIT-EXTERNAL-CLIENT-ACCESS-001

**Status**: ACTIVE
**Type**: SECURITY_TEST
**Target**: `packages/api` (External Gateways)
**Ref**: `EXTERNAL_PRINCIPALS_AND_CLIENT_ACCOUNTS_MODEL.md`

---

## 1. Test: Membership Precondition
**Condition**:
Review the middleware/interceptor chain for routes starting with `/api/portal/*` or `/api/external/*`.

*   **FAIL**: The endpoint checks `auth.isAuthenticated()` but forgets to check `externalMemberService.isActive(user, context)`.
*   **PASS**: Explicit `RequireExternalMembership` guard present.

## 2. Test: Scope Leakage
**Condition**:
Submit a request as a valid External Principal to a resource in a different workspace (which they are NOT a member of).

*   **FAIL**: Returns 200 OK or 404 Not Found (Leak: implies resource might exist).
*   **PASS**: Returns 403 Forbidden (Deterministically).

## 3. Test: Admin Role Escalation
**Condition**:
Attempt to assign an `external_principal` to an Internal RBAC Role (e.g., `WORKSPACE_ADMIN`).

*   **FAIL**: Database allows the assignment.
*   **PASS**: Database constraint or Service Logic throws `InvalidRoleType: External Principals cannot hold Staff Roles`.

## 4. Test: Owner Masquerading
**Condition**:
Inspect resource creation inputs from external APIs.

*   **FAIL**: Client can send `owner_ref: { type: 'WORKSPACE', id: 'any_id' }` and create data anywhere.
*   **PASS**: API ignores `owner_ref` in body and forces it to `current_membership.workspace_id`.

---

## 5. Violation Examples (Do Not Merge)

```typescript
// ❌ REJECT: Missing Membership Check
app.get('/api/portal/projects/:id', (req, res) => {
  // If I have a valid token, I see the project? NO!
  return projectService.findById(req.params.id);
});

// ✅ ACCEPT: Verified Access
app.get('/api/portal/projects/:id', async (req, res) => {
  await guard.ensureExternalAccess(req.user, req.params.id); // Checks membership table
  return projectService.findById(req.params.id);
});
```
