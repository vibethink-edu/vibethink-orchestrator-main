# Admin Console - Security Hardening Guide

> **Classification:** CRITICAL INFRASTRUCTURE  
> **Audience:** VibeThink Security Team & Senior Engineers  
> **Last Updated:** 2026-01-10

---

## 🔐 Security Posture

The Admin Console is the **heart of the VibeThink SaaS platform**. Compromise here = full system compromise.

### Threat Model
- **Attacker Goal:** Gain Super Admin access to manipulate tenant data, billing, or impersonate users
- **Attack Vectors:** 
  - Credential theft (phishing, session hijacking)
  - SQL injection via tenant policies (JSONB)
  - CSRF on state-changing operations
  - Privilege escalation (Support → Super Admin)
  - Audit log tampering

---

## ✅ Implemented Security Controls

### 1. Authentication & Authorization

#### Service Role Key Protection
**File:** `apps/admin/lib/supabase.ts`

```typescript
// ✅ Fail-fast if credentials missing
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("FATAL: Supabase admin credentials required");
}

// ✅ Protected by server-only package
import 'server-only';
```

**Controls:**
- Service Role Key stored in `.env.local` (never committed)
- `server-only` package prevents client-side import
- Fail-fast initialization (app won't start without valid credentials)

#### Role-Based Access Control (RBAC)
**File:** `apps/admin/lib/auth.ts`

```typescript
export async function getAdminSession(req: NextRequest): Promise<AdminSession | null> {
  // 1. Verify Bearer token
  // 2. Query admin_role_assignments table
  // 3. Return { userId, email, role } or null
}
```

**Roles:**
- `SUPER`: Full access (tenant creation, deletion, impersonation)
- `OPS`: Read/write access (policy updates, billing)
- `SUPPORT`: Read-only access (view tenants, audit logs)

**Enforcement:** Every API route must call `getAdminSession()` and check role.

---

### 2. Data Protection

#### SQL Injection Prevention
**Risk:** JSONB fields in `tenant_policies` could be exploited.

**Mitigation:**
- ✅ Use Supabase client (parameterized queries)
- ✅ Validate JSONB with Zod schemas before `UPDATE`
- ⚠️ **TODO:** Add input sanitization for tenant names/slugs

#### Sensitive Data Exposure
**Controls:**
- ✅ `robots: "noindex, nofollow"` in metadata (prevent search indexing)
- ✅ No Service Role Key in client-side code
- ✅ Audit logs include IP address and User-Agent for forensics

---

### 3. Session Security

#### Current State
⚠️ **GAP:** No session timeout or IP binding implemented yet.

**Recommended:**
```typescript
// apps/admin/middleware.ts (to be created)
export async function middleware(req: NextRequest) {
  const session = await getAdminSession(req);
  
  if (!session) {
    return NextResponse.redirect('/login');
  }
  
  // Check session age (max 8 hours)
  if (isSessionExpired(session)) {
    return NextResponse.redirect('/login?reason=expired');
  }
  
  // Optional: IP binding (controversial, breaks VPN users)
  // if (session.ip !== req.ip) { ... }
}
```

---

### 4. Audit Trail

#### Immutable Logging
**Table:** `admin_audit_events`

**Schema:**
```sql
CREATE TABLE admin_audit_events (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  actor_user_id UUID NOT NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  target_tenant_id UUID,
  action_type TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  ticket_ref TEXT,
  payload JSONB,
  ip_address TEXT,
  user_agent TEXT
);
```

**Controls:**
- ✅ Append-only (no UPDATE/DELETE permissions for admins)
- ✅ Captures "before" and "after" state in `payload`
- ✅ Requires `reason_code` and optional `ticket_ref` for accountability

**Usage:**
```typescript
await adminDb.from('admin_audit_events').insert({
  actor_user_id: session.userId,
  actor_email: session.email,
  actor_role: session.role,
  target_tenant_id: tenantId,
  action_type: 'UPDATE_POLICY',
  reason_code: 'CUSTOMER_REQUEST',
  ticket_ref: 'JIRA-1234',
  payload: { before: oldPolicy, after: newPolicy },
  ip_address: req.headers.get('x-forwarded-for'),
  user_agent: req.headers.get('user-agent')
});
```

---

### 5. Network Security

#### Deployment Recommendations

**Vercel/Production:**
- [ ] Enable Vercel Authentication (IP allowlist for `/admin/*`)
- [ ] Use Vercel Edge Config for dynamic IP allowlist
- [ ] Enable WAF (Web Application Firewall) rules
- [ ] Set up DDoS protection

**Supabase:**
- [x] Service Role Key rotated quarterly (manual process)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Restrict Supabase API to Vercel IPs only (if possible)

---

### 6. Code Security

#### Dependency Scanning
**Current:** Pre-commit hooks run tests, but no security scanning.

**Recommended:**
```json
// package.json
{
  "scripts": {
    "audit": "pnpm audit --audit-level=high",
    "security:check": "pnpm dlx @socketsecurity/cli scan"
  }
}
```

Run `pnpm audit` weekly in CI.

#### Secret Scanning
**GitHub:**
- [ ] Enable GitHub Secret Scanning (Settings > Security > Secret scanning)
- [ ] Add `.env.local` to `.gitignore` (already done)
- [ ] Use GitHub Actions secrets for CI/CD

---

## 🚨 Critical TODOs (Before Production)

### High Priority
1. **Implement Session Timeout** (8-hour max)
2. **Add CSRF Protection** (Next.js built-in, verify enabled)
3. **Enable RLS on Supabase Tables** (prevent direct DB access bypass)
4. **IP Allowlist for Admin Routes** (Vercel Edge Middleware)
5. **Multi-Factor Authentication (MFA)** for Super Admins

### Medium Priority
6. **Rate Limiting** on API routes (prevent brute force)
7. **Webhook Signature Verification** (if using webhooks)
8. **Content Security Policy (CSP)** headers
9. **Automated Dependency Audits** in CI/CD

### Low Priority (Nice to Have)
10. **Honeypot Fields** in forms (detect bots)
11. **Anomaly Detection** (alert on unusual admin activity)
12. **Backup Admin Account** (break-glass access if primary compromised)

---

## 📋 Security Checklist (Pre-Deployment)

- [ ] All API routes require `getAdminSession()` check
- [ ] Service Role Key stored in Vercel Environment Variables (not `.env.local`)
- [ ] Audit logging enabled for all state-changing operations
- [ ] RLS enabled on `admin_audit_events`, `admin_role_assignments`
- [ ] IP allowlist configured (or VPN required)
- [ ] MFA enabled for all Super Admin accounts
- [ ] Session timeout enforced (8 hours)
- [ ] HTTPS enforced (Vercel does this by default)
- [ ] `robots.txt` blocks `/admin/*` (redundant with `noindex`, but defense-in-depth)
- [ ] Security headers configured (`X-Frame-Options`, `X-Content-Type-Options`, etc.)

---

## 🔍 Monitoring & Incident Response

### Alerts to Configure
1. **Failed Login Attempts** (> 5 in 10 minutes)
2. **Privilege Escalation Attempts** (Support user tries Super Admin action)
3. **Bulk Tenant Deletion** (> 10 tenants deleted in 1 hour)
4. **Audit Log Gaps** (missing entries for critical actions)

### Incident Response Plan
1. **Detect:** Monitoring alerts trigger
2. **Contain:** Revoke compromised admin's session (delete from `admin_role_assignments`)
3. **Investigate:** Query `admin_audit_events` for timeline
4. **Remediate:** Rotate Service Role Key, patch vulnerability
5. **Document:** Post-mortem in `docs/incidents/YYYY-MM-DD-admin-breach.md`

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod#security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)

---

**Maintainer:** VibeThink Security Team  
**Review Frequency:** Quarterly (or after any security incident)
