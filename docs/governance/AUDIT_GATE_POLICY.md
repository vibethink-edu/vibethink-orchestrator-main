# ViTo Audit Gate Policy — Canonical v1.0

**Status**: ACTIVE  
**Version**: v1.0  
**Effective Date**: 2026-01-09  
**Applies to**: Security, Billing, Multi-tenant, Identity, Documentation, Enforcement

---

## Purpose

This policy establishes **mandatory audit gates** for all production-critical changes in the ViTo platform. It ensures that security, billing integrity, multi-tenant isolation, and documentation truthfulness are verified **before merge and deployment**.

---

## Scope

This policy applies to:

1. **Security-critical features**: API key management, authentication, authorization, secrets management
2. **Billing-critical features**: Usage tracking, cost calculation, anti-double-charge mechanisms
3. **Multi-tenant isolation**: RLS policies, tenant_id enforcement, data segregation
4. **Identity and access control**: User authentication, role-based access, permissions
5. **Documentation standards**: FITs, Standards, API documentation
6. **Enforcement mechanisms**: Rate limiting, cost limits, quota management

---

## Audit Gate Criteria

### 1. Security Gate

**BLOCKER** if any of the following are violated:

- ✅ **Timing-safe operations**: No timing attacks possible (e.g., hash comparison must use `timingSafeEqual`)
- ✅ **No secrets in logs**: API keys, passwords, tokens, hashes must NEVER appear in logs or error messages
- ✅ **Fail-fast validation**: Invalid input must be rejected immediately with generic error messages
- ✅ **Multi-tenant isolation**: All queries must filter by `tenant_id` with RLS enabled
- ✅ **No SQL injection**: All queries must use parameterized statements or ORM-safe methods

**MAJOR** if any of the following are violated:

- ⚠️ **Incomplete RLS policies**: Missing INSERT/UPDATE/DELETE policies (if non-service-key clients need write access)
- ⚠️ **Sensitive data in warnings**: Low-sensitivity data (e.g., prefixes) logged unnecessarily

---

### 2. Billing Gate

**BLOCKER** if any of the following are violated:

- ✅ **Anti-double-charge**: UNIQUE constraint on `(tenant_id, request_id)` for event-based billing
- ✅ **Idempotent tracking**: Duplicate `request_id` must be silently ignored (PostgreSQL error code 23505)
- ✅ **Deterministic aggregation**: Daily upsert `onConflict` must match PRIMARY KEY exactly
- ✅ **Multi-workload support**: Billing must distinguish `workload_class` and `meter_key`

**MAJOR** if any of the following are violated:

- ⚠️ **Missing billing tests**: Event idempotency, daily aggregation, or endpoint normalization not tested
- ⚠️ **Inconsistent metering**: `meter_qty` and `billable_units` not aligned

---

### 3. Documentation Gate

**BLOCKER** if any of the following are violated:

- ✅ **Truthfulness**: Documentation must accurately reflect implementation (no false claims)
- ✅ **Phase clarity**: Phase 1 vs Phase 2 features must be clearly distinguished
- ✅ **Authoritative references**: Standards and FITs must reference each other correctly

**MAJOR** if any of the following are violated:

- ⚠️ **Incomplete FIT**: Missing acceptance criteria, success metrics, or phase deliverables
- ⚠️ **Outdated examples**: Code examples in standards do not match actual implementation

---

### 4. Test Coverage Gate

**BLOCKER** if any of the following are violated:

- ✅ **Billing-critical paths tested**: Event idempotency, daily aggregation, scope validation
- ✅ **Security-critical paths tested**: Timing-safe selection, expired keys, invalid keys
- ✅ **Integration tests exist**: Not just unit tests with mocks

**MAJOR** if any of the following are violated:

- ⚠️ **Low coverage**: Critical business logic not covered by tests
- ⚠️ **Flaky tests**: Tests that pass/fail non-deterministically

---

## Audit Process

### 1. Pre-Merge Audit (Mandatory)

Before merging to `main`, the following must be completed:

1. **Self-Audit**: Developer reviews code against this policy
2. **Peer Review**: At least one other engineer reviews the PR
3. **Automated Checks**: Lint, typecheck, and tests must pass
4. **Independent Audit** (for critical features): External auditor (e.g., Claude, security team) reviews

### 2. Audit Severity Levels

- **BLOCKER**: Must be fixed before merge. No exceptions.
- **MAJOR**: Must be fixed before merge or explicitly documented as technical debt with mitigation plan.
- **MINOR**: Should be fixed but can be deferred to next sprint.
- **NIT**: Optional improvement, no blocking impact.

### 3. Audit Evidence

All audits must produce:

- **Audit Report**: Markdown document with findings, severity, and recommendations
- **Fix Evidence**: Commits that address BLOCKER and MAJOR issues
- **Re-Audit Confirmation**: Independent verification that fixes are correct

---

## Seal Criteria

A feature is **SEALED FOR PRODUCTION** when:

1. ✅ All **BLOCKER** issues resolved
2. ✅ All **MAJOR** issues resolved or documented as technical debt
3. ✅ Tests pass (unit + integration)
4. ✅ Documentation is truthful and complete
5. ✅ Independent audit confirms compliance

---

## Enforcement

- **Pre-Merge**: GitHub branch protection rules require passing checks
- **Post-Merge**: Automated monitoring alerts on policy violations in production
- **Escalation**: Security or billing violations trigger immediate incident response

---

## Exemptions

Exemptions to this policy require:

1. **Written justification**: Why the exemption is necessary
2. **Risk assessment**: What risks are accepted
3. **Mitigation plan**: How risks will be reduced
4. **Approval**: From Tech Lead and Security Lead

---

## References

- **FIT Template**: `docs/fits/FIT-TEMPLATE.md`
- **Standards**: `docs/standards/`
- **Testing Strategy**: `docs/qa/TESTING_STRATEGY.md`

---

## Revision History

| Version | Date       | Changes                          | Author       |
|---------|------------|----------------------------------|--------------|
| v1.0    | 2026-01-09 | Initial canonical policy created | ViTo Team    |

---

**END OF POLICY**
