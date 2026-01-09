# Trace Retention Policy Tests

Status: NON-CANONICAL
Last Updated: 2026-01-05
Scope: Operational reference only
Canon-Impact: NONE

## Purpose
Explain how to run the trace retention and redaction tests locally and how to
interpret PASS/FAIL signals.

## Local Run
PowerShell:
```powershell
node --test tests/ops/trace-retention.test.js
```

bash:
```bash
node --test tests/ops/trace-retention.test.js
```

Optional direct script runs:
```bash
node scripts/ops/trace-retention/plan-retention.js tests/fixtures/ops/trace-retention/retention-input.json --now 2026-01-05T00:00:00Z
TRACE_REDACTION_SALT=test-salt node scripts/ops/trace-retention/redact-trace.js tests/fixtures/ops/trace-retention/redact-input.json
```

## PASS Criteria
- Redaction output matches `tests/fixtures/ops/trace-retention/redact-expected.json`
- Retention plan matches `tests/fixtures/ops/trace-retention/retention-plan-expected.json`
- Replay window enforcement marks only fresh traces as replay-available

## FAIL Criteria
- Non-deterministic redaction or plan output
- Missing required fields for replay availability
- Date parsing or retention window errors

## Troubleshooting
- Node version: `node -v` must be >= 18
- Run from repo root to ensure paths resolve correctly
- Ensure fixtures exist under `tests/fixtures/ops/trace-retention/`
