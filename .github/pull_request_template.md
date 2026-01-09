---
name: Pull Request Check
about: Standard PR template for ViTo
title: 'feat/fix: Description'
labels: ''
assignees: ''

---

## 📝 Summary
<!-- What does this PR do? -->

## 🔗 Related Issues
<!-- Closes #123 -->

## 🛡️ Quality Gates Checklist (MANDATORY)

By submitting this PR, I confirm conformance to [GOV-QA — Quality Gates Pack v1](docs/qa/QUALITY_GATES_PACK_V1.md):

- [ ] **Banned Patterns Scan**: Ran `pnpm gate:banned` and passed (No `as any`, `as unknown as`, `@ts-ignore`).
- [ ] **Type Safety**: No new `any` types introduced. Used Rule of Least Power.
- [ ] **Runtime Safety**: Runtime type guards implemented for external data.
- [ ] **Tenant Context**: Verified `is_local=true` or proper tenant enforcement.
- [ ] **Error Handling**: `fail-fast` pattern used for invalid states.
- [ ] **Idempotency**: Workers/Mutations handle retries safely.
- [ ] **Tests**: `pnpm test` passes locally.

## 📸 Screenshots (if UI)

## 🏎️ Performance Impact
<!-- Does this impact load times or db queries? -->
