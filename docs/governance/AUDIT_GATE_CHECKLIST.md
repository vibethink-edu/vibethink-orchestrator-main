# ViTo Audit Gate Checklist

**Version**: v1.0  
**Purpose**: Pre-merge checklist for production-critical changes  
**Reference**: `docs/governance/AUDIT_GATE_POLICY.md`

---

## How to Use

Copy this checklist into your PR description and check off each item before requesting review.

---

## Security Gate

- [ ] **Timing-safe operations**: Hash comparisons use `timingSafeEqual` or equivalent
- [ ] **No secrets in logs**: API keys, passwords, tokens, hashes never logged
- [ ] **Fail-fast validation**: Invalid input rejected with generic error messages
- [ ] **Multi-tenant isolation**: All queries filter by `tenant_id` with RLS enabled
- [ ] **No SQL injection**: Parameterized queries or ORM-safe methods used
- [ ] **RLS policies complete**: INSERT/UPDATE/DELETE policies defined (if needed)
- [ ] **Minimal logging**: No sensitive data in warnings (e.g., no key IDs, prefixes)

---

## Billing Gate

- [ ] **Anti-double-charge**: UNIQUE constraint on `(tenant_id, request_id)` exists
- [ ] **Idempotent tracking**: Duplicate `request_id` silently ignored (error code 23505)
- [ ] **Deterministic aggregation**: Daily upsert `onConflict` matches PRIMARY KEY
- [ ] **Multi-workload support**: `workload_class` and `meter_key` distinguished
- [ ] **Endpoint normalization**: IDs replaced with `:id` for consistent billing
- [ ] **Cost tracking**: `cost_usd_micros` or equivalent tracked accurately

---

## Documentation Gate

- [ ] **Truthfulness**: Documentation accurately reflects implementation
- [ ] **Phase clarity**: Phase 1 vs Phase 2 features clearly distinguished
- [ ] **Authoritative references**: Standards and FITs reference each other correctly
- [ ] **Complete FIT**: Acceptance criteria, success metrics, deliverables present
- [ ] **Updated examples**: Code examples match actual implementation
- [ ] **Phase 1 disclaimers**: Limitations clearly stated (e.g., rate limiting)

---

## Test Coverage Gate

- [ ] **Billing-critical paths tested**: Event idempotency, daily aggregation, scope validation
- [ ] **Security-critical paths tested**: Timing-safe selection, expired keys, invalid keys
- [ ] **Integration tests exist**: Not just unit tests with mocks
- [ ] **Edge cases covered**: Duplicate requests, hash mismatches, expired keys
- [ ] **Tests pass**: `pnpm test` succeeds without errors
- [ ] **No flaky tests**: Tests are deterministic and reproducible

---

## Code Quality Gate

- [ ] **Lint passes**: `pnpm lint` succeeds
- [ ] **Typecheck passes**: `pnpm typecheck` succeeds
- [ ] **No console.log**: Debug logs removed or replaced with proper logging
- [ ] **Error handling**: All async operations have error handling
- [ ] **No TODOs in critical paths**: TODOs documented in issues, not blocking

---

## Evidence Gate

- [ ] **Commit message follows convention**: `feat/fix/docs(scope): description`
- [ ] **PR description complete**: What, why, how, testing, evidence
- [ ] **Screenshots/videos**: For UI changes (if applicable)
- [ ] **Migration tested**: Database migrations run successfully (if applicable)
- [ ] **Rollback plan**: How to revert if deployment fails

---

## Seal Criteria (Final Check)

- [ ] All **BLOCKER** issues resolved
- [ ] All **MAJOR** issues resolved or documented as technical debt
- [ ] Tests pass (unit + integration)
- [ ] Documentation is truthful and complete
- [ ] Independent audit confirms compliance (for critical features)

---

## Approval

- [ ] **Self-review**: I have reviewed my own code against this checklist
- [ ] **Peer review**: At least one other engineer has reviewed this PR
- [ ] **Automated checks**: CI/CD pipeline passes
- [ ] **Independent audit**: External auditor approved (if required)

---

**Reviewer Notes**:

(Add any additional context, risks, or follow-up items here)

---

**END OF CHECKLIST**
