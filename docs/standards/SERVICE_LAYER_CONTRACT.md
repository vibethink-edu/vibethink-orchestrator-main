# Service Layer Contract (ActionIntent)

Status: ACTIVE
Last Updated: 2026-01-05
Scope: Execution contract (non-canonical)
Canon-Impact: NONE

## Purpose
Define a minimal, typed, and verifiable handoff contract from the Reasoning
Orchestrator to the Service Layer without introducing new Canon entities.

## Normative Rules
- MUST validate ActionIntent payloads against the JSON Schema before execution.
- MUST reject any ActionIntent with unknown fields (schema `additionalProperties=false`).
- MUST honor idempotency and retries rules.
- SHOULD log trace/audit records for every ActionIntent attempt and outcome.
- MAY extend inputs with domain-specific data as long as it stays inside `inputs`.

## ActionIntent Schema (Required Fields)
Required at top level:
- `action_type` (string): action category (for example: `provision`, `notify`, `apply_policy`)
- `tenant_id` (string)
- `created_at` (string, ISO-8601)
- `idempotency_key` (string)
- `policy_context_id` (string)
- `inputs` (object)
- `requested_by` (object)
- `trace_link` (object or string)
- `correlation_id` (string)
- `run_id` (string)

Required in `requested_by`:
- `actor_id` (string)
- `actor_type` (string, for example: `user`, `service`, `system`)

Required in `trace_link`:
- If object: `input_snapshot_hash` OR `trace_id` (at least one required)
- If string: a non-empty reference token

Optional:
- `required_approvals` (array of approval IDs)
- `retry_count` (integer, defaults to 0)

## Idempotency Contract
- MUST provide `idempotency_key` per action intent.
- MUST treat repeated intents with the same key as the same logical operation.
- SHOULD use `retry_count` to indicate retries (0 for first attempt).

## Ordering Rules
- MUST respect `preconditions` inside `inputs` when present.
- MUST execute in order when `inputs.sequence` is provided.
- SHOULD reject out-of-order intents when sequencing is declared.

## AuthZ Boundary
- `policy_context_id` defines the authorization boundary.
- Service Layer MUST NOT execute an action that violates policy context.

## Failure Modes
- `timeout`: retryable if no side effects committed.
- `partial_failure`: MUST emit trace and audit events; retry only if safe.
- `retryable`: client MAY retry with same `idempotency_key`.
- `non_retryable`: client MUST NOT retry; requires new intent.

## Trace and Audit Requirements
- MUST log ActionIntent receipt, validation outcome, and execution result.
- MUST include `trace_link` and `policy_context_id` in logs.
- SHOULD record `idempotency_key`, `correlation_id`, and `run_id` when present.
