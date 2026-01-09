# ViTo Testing Strategy · QA Canon v1.0 (SEALED)

## 1. Vision & Purpose
This document defines the mandatory testing standards for the ViTo project. Every contribution must adhere to these gates to ensure deterministic, stable, and contract-safe releases.

**Core Principle:** *Determinism over Coverage.* Every test must be 100% stable; flaky tests are considered technical debt and must be neutralized/removed from the gate immediately.

---

## 2. QA Gates (Testing Pyramid)

| Gate | Scope | Tooling (Suggested) | Execution | Environment |
| :--- | :--- | :--- | :--- | :--- |
| **Unit** | Isolated Logic, Utils | Vitest / Jest | `pnpm test:unit` | Local / CI |
| **Hooks** | React Hook Behavior | Vitest + RTL | `pnpm test:unit` | Local / CI |
| **Integration** | DB, Services, Multi-pkg | Testcontainers / Docker | `pnpm test:integration` | CI (Headless) |
| **Contract** | API Specs, DTOs | OpenAPI / JSON Schema | `pnpm test:contract` | Local / CI |
| **API** | Headless CI-friendly | Playwright API / Newman | `pnpm test:api` | CI (Headless) |

---

## 3. Mandatory Directory Structure

The following structure is strictly enforced across the monorepo:

```plaintext
tests/
├── unit/             # Isolated logic and hook tests
├── integration/      # Infrastructure/Database dependent tests
├── contract/         # Consumer/Provider contract validation
├── api/              # Headless API flows (CI-ready)
├── fixtures/         # Test Data Governance
│   ├── canonical/    # Truth-source data (matches Ontology)
│   └── generators/   # Deterministic data factories (Seeds)
└── setup/            # Runner config and global hooks
```

---

## 4. Test Data Rules (Determinism Law)

1. **Fixtures Small & Explicit:** Avoid monolithic data. Each test should use the smallest payload possible.
2. **Deterministic Seeds:** All generators must use fixed seeds. `Math.random()` is prohibited in test generation.
3. **No PII:** Personal Identifiable Information is strictly forbidden.
4. **Controlled Context:**
    - **Dates:** Always mock the system clock (`vi.setSystemTime`).
    - **IDs:** Use predictable UUIDs/ULIDs or incremental sequences.
5. **Versioned Data:** Fixtures are part of the codebase and must be versioned alongside the code.

---

## 5. Canonical Scripts (Contractual)

Regardless of the underlying tool, the following scripts must exist in the root and relevant packages:

- `test:unit`: Fast isolated execution. Blocks PR.
- `test:integration`: Infrastructure-heavy. Blocks PR.
- `test:contract`: External/Internal API alignment. Blocks PR & Release.
- `test:api`: Full system health check (Headless). Blocks Release.

---

## 6. QA Release Gates (Blocking Rules)

### 6.1 What Blocks a PR?
- Any failure in `test:unit`, `test:integration`, or `test:contract`.
- Any flaky test detected in the CI run (must be skipped or fixed to pass).
- Missing `contract` tests for new external service integrations.

### 6.2 What Blocks a Release?
- Failure in `test:api`.
- Regression in performance metrics (if defined).
- Non-documented manual QA sign-off (for specific UX-critical flows).

---

## 7. Prohibited (Anti-Patterns)

- ⚠️ **Proposing refactors to the core sealed architecture.**
- ⚠️ **Introducing vendor lock** (tools requiring specific cloud environments).
- ⚠️ **Mixing test types** (e.g., calling a real DB from a `unit/` folder).
- ⚠️ **Non-deterministic tests (Flaky).** Any flake must be removed from the gate immediately.
- ⚠️ **CI with UI requirement.** All CI gates must run headless.
- ⚠️ **Newman/Postman as human-only tools.** Postman exports are allowed, but the execution MUST be automated via Newman or similar in CI.

---

## 8. Specific Guidelines: Hooks Testing
Hooks with stateful logic or orchestration must be tested for **behavior**:
- Do not test implementation details (internal state).
- Test inputs vs. outputs/side-effects.
- Mock all context providers.

---

*Status: SEALED · Enforceable · Operative*
*QA Architect: Antigravity*
*Date: 2026-01-09*
