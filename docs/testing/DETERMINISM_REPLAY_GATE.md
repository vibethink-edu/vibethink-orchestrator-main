# Determinism Replay Gate

**Status**: ACTIVE
**Last Updated**: 2026-01-04

## Purpose
Ensure determinism and replayability for Reasoning Orchestrator traces:
Given the same Signal + same evidence snapshot + same versions, outputs and effects must match.

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

## Local Run
- Determinism verify:
  - `node scripts/determinism/verify-trace-completeness.js tests/fixtures/determinism/trace-good.json`
- Determinism tests:
  - `node --test tests/determinism/trace-completeness.test.js`
- Replay harness stub:
  - `node scripts/determinism/replay-harness.js tests/fixtures/determinism/replay-input.json tests/fixtures/determinism/replay-output.json`

## CI Run
The workflow `.github/workflows/quality-gate-determinism.yml` runs:
- Lint, type-check, test
- Trace completeness verification (good fixture must pass, bad fixture must fail)
- Replay harness stub

## PASS Criteria
- Trace completeness verifier passes on good fixture
- Verifier fails on bad fixture
- Tests pass
- Replay harness stub passes

## FAIL Criteria
- Any missing required trace fields
- Verifier unexpectedly passes on bad fixture
- Missing scripts or incorrect paths

## Lessons Learned (Enforced)
- No missing scripts: all scripts referenced by CI are versioned
- No magic paths: use repo root paths, not worktree paths
- No worktrees: CI assumes main checkout
- No temporary files: avoid logs or ad-hoc outputs

