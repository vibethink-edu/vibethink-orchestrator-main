# Determinism Replay Gate

**Status**: ACTIVE
**Last Updated**: 2026-01-04

## Purpose
Ensure determinism and replayability for Reasoning Orchestrator traces:
Given the same Signal + same evidence snapshot + same versions, outputs and effects must match.

## 3-Minute Local Run (Quick Start)
Prereqs:
- Node.js >= 18 (see `package.json` engines)
- Run from repo root

PowerShell:
```powershell
node scripts/determinism/verify-trace-completeness.js tests/fixtures/determinism/trace-good.json
node scripts/determinism/verify-trace-completeness.js tests/fixtures/determinism/trace-bad.json
node --test tests/determinism/trace-completeness.test.js
node scripts/determinism/replay-harness.js tests/fixtures/determinism/replay-input.json tests/fixtures/determinism/replay-output.json
```

bash:
```bash
node scripts/determinism/verify-trace-completeness.js tests/fixtures/determinism/trace-good.json
node scripts/determinism/verify-trace-completeness.js tests/fixtures/determinism/trace-bad.json
node --test tests/determinism/trace-completeness.test.js
node scripts/determinism/replay-harness.js tests/fixtures/determinism/replay-input.json tests/fixtures/determinism/replay-output.json
```

## Determinism Contract (Required Fields)
- `signal_id`
- `input_snapshot_hash`
- `policy_context_id`
- `prompt_hash`
- `model_version`
- `versions` (`model_version`, `specialist_version`)
- `tool_call_inputs_outputs` (array of tool call hashes)
- `output_hash`
- `determinism_key` (sha256 of stable JSON: `signal_id`, `input_snapshot_hash`, `versions`)

## Replay Contract (Required Fields)
- Input: `signal`, `input_snapshot_hash`, `versions`, `expected_output_hash`
- Output: `effects`, `expected_output_hash`
- Hashing: `expected_output_hash` is sha256 of stable JSON for output payload (excluding `expected_output_hash`)

## PASS / FAIL Signals
PASS:
- Good fixture prints `Trace completeness check passed.`
- Bad fixture exits non-zero (expected failure)
- `node --test` reports `pass` for both tests
- Replay harness prints `Replay harness stub passed.`

FAIL:
- Missing or invalid required fields in trace records
- Bad fixture unexpectedly passes
- Missing scripts or incorrect paths
- Replay output hash mismatch or input/output hash mismatch

## CI Run
The workflow `.github/workflows/quality-gate-determinism.yml` runs:
- Trace completeness verification (good fixture must pass, bad fixture must fail)
- Replay harness stub

Expected jobs:
- Determinism checks only (no lint/type-check/test in this workflow)

## Troubleshooting
Node version:
- Check: `node -v`
- Fix: install Node.js >= 18, then retry Quick Start commands.

Missing scripts or wrong paths:
- Ensure you are in repo root: `git rev-parse --show-toplevel`
- Confirm files exist:
  - `scripts/determinism/verify-trace-completeness.js`
  - `scripts/determinism/replay-harness.js`
  - `tests/determinism/trace-completeness.test.js`
  - `tests/fixtures/determinism/trace-good.json`
  - `tests/fixtures/determinism/trace-bad.json`

Replay hash mismatch:
- Recompute expected output hash from `tests/fixtures/determinism/replay-output.json` (excluding `expected_output_hash`)
- Ensure `tests/fixtures/determinism/replay-input.json` and output use the same `expected_output_hash`

GitHub Actions:
- Check the workflow run for `Quality Gate - Determinism` on `main`
- Validate steps:
  - Verify trace completeness (good/bad)
  - Replay harness stub

## Lessons Learned (Enforced)
- No missing scripts: all scripts referenced by CI are versioned
- No magic paths: use repo root paths, not worktree paths
- No worktrees: CI assumes main checkout
- No temporary files: avoid logs or ad-hoc outputs

