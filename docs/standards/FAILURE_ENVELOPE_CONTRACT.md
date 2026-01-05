# Failure Envelope Contract (Tool/Service Errors)

Status: ACTIVE
Last Updated: 2026-01-05
Scope: Runtime error contract (non-canonical)
Canon-Impact: NONE

## Purpose
Define a single, verifiable error envelope for ToolCalls and Service calls with
explicit retry semantics.

## Normative Rules
- MUST validate all failure envelopes against the JSON Schema.
- MUST classify failures as `RETRYABLE` or `NON_RETRYABLE`.
- MUST include `tenant_id`, `run_id`, `correlation_id`, and `policy_context_id`.
- SHOULD include trace linkage for replay and audit.
- MAY include vendor or tool metadata in `details`.

## FailureEnvelope (Required Fields)
Required:
- `error_id` (string)
- `error_type` (string)
- `message` (string)
- `classification` (enum: RETRYABLE|NON_RETRYABLE)
- `occurred_at` (string, ISO-8601)
- `tenant_id` (string)
- `run_id` (string)
- `correlation_id` (string)
- `policy_context_id` (string)
- `source` (object)
- `trace_link` (object or string)

Source:
- `system` (string, for example: tool|service|infra)
- `name` (string, tool/service name)

Trace_link:
- If object: `input_snapshot_hash` OR `trace_id`
- If string: non-empty reference token

## Retry Semantics
- `RETRYABLE` indicates safe retry with same idempotency key.
- `NON_RETRYABLE` indicates retry is unsafe and requires new intent.
- `retry_after_ms` MAY be provided for backoff hints.

## Failure Modes
- `timeout`: typically retryable when no side effects are committed.
- `partial_failure`: must include details about side effects; retry only if safe.
- `validation_error`: non-retryable.

## Trace and Audit Requirements
- MUST log failure envelopes with `trace_link` and `policy_context_id`.
- SHOULD include `action_intent_ref` and `tool_call_ref` when available.
