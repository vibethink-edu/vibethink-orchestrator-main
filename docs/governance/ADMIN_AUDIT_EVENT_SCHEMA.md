# Admin Audit Event Schema

> **Purpose:** Immutable record of all privileged administrative actions.
> **Storage:** `admin_audit_events` (PostgreSQL) + Future Cold Storage (S3/Blob).
> **Retention:** Indefinite (Minimum 7 years).

---

## 1. Schema Definition (Generic)

Every event shares this structure:

```typescript
type AdminAuditEvent = {
  id: string; // UUID
  created_at: string; // ISO8601 UTC
  
  // THE ACTOR (Who did it?)
  actor_user_id: string;
  actor_email: string; // Snapshot at time of action
  actor_role: 'SUPPORT' | 'OPS' | 'SUPER';
  ip_address: string;
  user_agent: string;
  
  // THE TARGET (To whom?)
  target_tenant_id?: string;
  target_user_id?: string;
  
  // THE ACTION (What did they do?)
  action_type: ActionType; // e.g., 'UPDATE_TENANT_LIMIT'
  
  // THE JUSTIFICATION (Why?)
  reason_code: string; // e.g., 'CUSTOMER_REQUEST'
  ticket_ref?: string; // e.g., 'CS-1023'
  
  // THE CHANGE (Proof)
  details: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    diff?: Record<string, any>;
  };
};
```

## 2. Action Types Registry

| Action | Description | Risk Level |
| :--- | :--- | :--- |
| `TENANT_POLICY_UPDATE` | Changing features/flavors | HIGH |
| `BILLING_CREDIT_ADD` | Adding manual balance | HIGH |
| `LIMIT_OVERRIDE` | Changing hard limits | MEDIUM |
| `USER_SUSPEND` | Blocking a user | MEDIUM |
| `IMPERSONATION_START` | Break-glass login | CRITICAL |
| `TENANT_VIEW_DETAILS` | Accessing sensitive meta-data | LOW |

## 3. SQL Implementation

```sql
CREATE TABLE admin_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  actor_user_id UUID NOT NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  target_tenant_id UUID,
  target_user_id UUID,
  action_type TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  ticket_ref TEXT,
  payload JSONB NOT NULL, -- Contains before/after/diff
  metadata JSONB -- IP, UA
);

-- Append-Only Enforcement
CREATE RULE protect_audit_log AS ON DELETE TO admin_audit_events DO INSTEAD NOTHING;
CREATE RULE protect_audit_log_update AS ON UPDATE TO admin_audit_events DO INSTEAD NOTHING;
```
