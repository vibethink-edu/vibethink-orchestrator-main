# Break-Glass Impersonation Protocol

> **Risk Level:** CRITICAL
> **Audience:** SUPER ADMINS Only
> **Enforcement:** Code + Audit Log

---

## 1. Principle

"Impersonation" allows a Super Admin to log in *as* a specific user/tenant to reproduce bugs or verify configuration. **This bypasses standard privacy controls** and therefore is treated as a "Break Glass" emergency procedure.

---

## 2. Technical Protocol

### 2.1 Pre-Requisites
1.  **Role:** Actor must have `SUPER_ADMIN` role claim in JWT.
2.  **Justification:** A valid `ticket_ref` (JIRA/Linear ID) and `reason_code` are MANDATORY.
3.  **No Silent Entry:** The action is loudly logged.

### 2.2 The Flow
1.  **Request:** Admin clicks "Impersonate" on Tenant Detail page.
2.  **Prompt:** Modal asks for Ticket ID and Reason.
3.  **Token Generation:** Backend mints a temporary `impersonation_token` (Short TTL: 15 mins).
4.  **Session Switch:** Admin browser stores this token (separate from Admin Token).
5.  **Banner:** UI displays a sticky **RED BANNER**: *"IMPERSONATING USER [EMAIL] in TENANT [ID]"*.

### 2.3 Limits
*   **Duration:** Max 15 minutes. Auto-logout after.
*   **Scope:** The impersonated session inherits the *exact permissions* of the target user (cannot do more than the user).
*   **Termination:** "Stop Impersonation" button immediately destroys the session.

---

## 3. Audit Trail

**Event: `AUTH_IMPERSONATION_START`**
```json
{
  "actor_id": "admin_123",
  "target_user_id": "user_456",
  "target_tenant_id": "tenant_abc",
  "reason": "Ticket SUPPORT-999: Reproduce billing error",
  "meta": { "ip": "10.0.0.1", "ttl_minutes": 15 }
}
```

**Event: `AUTH_IMPERSONATION_END`**
*   Logged manually on "Stop" or automatically on expiry.

---

## 4. Alerting
*   **(Future)** Real-time Slack notification to `#sec-ops` channel on every impersonation start.
