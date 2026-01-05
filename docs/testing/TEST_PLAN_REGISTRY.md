# Test Plan Registry

Status: NON-CANONICAL
Last Updated: 2026-01-05
Scope: Operational reference only
Canon-Impact: NONE

## Executed
- Determinism/Replay: Verified via CI (commit `91dc19f4`).

## Pending (Priority)
- P0: Failure Injection (requires manual review for side effects).
- P0: LLM Approval Obedience (`tests/e2e/llm-approval-obedience.test.js`).
- P1: Contract tests (ActionIntent, Approval UX, FailureEnvelope) if not run in CI.
- P2: CI sanity (workflow runs not covered by determinism gate).

## What Each Validates
- Determinism/Replay: Trace completeness, replay harness determinism.
- Failure Injection: Resilience and retry boundaries under injected faults.
- LLM Approval Obedience: Ensures approvals are enforced before execution.
- Contract tests: Schema compliance for runtime contracts.
- CI sanity: End-to-end CI workflow reliability and consistency.

## Local Commands
- Determinism/Replay:
  - `node scripts/determinism/verify-trace-completeness.js tests/fixtures/determinism/trace-good.json`
  - `node scripts/determinism/replay-harness.js tests/fixtures/determinism/replay-input.json tests/fixtures/determinism/replay-output.json`
- Failure Injection:
  - `node --test tests/e2e/failure-injection.test.js`
- LLM Approval Obedience:
  - `node --test tests/e2e/llm-approval-obedience.test.js`
- Contract tests:
  - `node --test tests/contracts/action-intent.test.js`
  - `node --test tests/contracts/approval-contract.test.js`
  - `node --test tests/contracts/failure-envelope.test.js`
- CI sanity:
  - `gh run list --branch main --limit 5`

## No Side Effects Signal
All tests must:
- Avoid writing to production systems.
- Use fixtures and local-only stubs.
- Exit non-zero on any unexpected mutation or live calls.
