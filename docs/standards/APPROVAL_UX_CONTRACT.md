# Approval UX Contract (Request/Response)

Status: ACTIVE
Last Updated: 2026-01-05
Scope: Runtime UX contract (non-canonical)
Canon-Impact: NONE

## Purpose
Define a verifiable approval handoff between the Orchestrator and UX without
introducing Canon entities or executing side effects.

## Normative Rules
- MUST validate approval payloads against the schemas before use.
- MUST treat approvals as decision records only (no side effects).
- MUST include trace linkage (`trace_link`, `run_id`, `correlation_id`) in both request and response.
- SHOULD record expiration and priority to guide UX ordering.
- MAY extend `metadata` and `context` inside the request (not top-level).

## ApprovalRequest (Required Fields)
Required:
- `tenant_id` (string)
- `run_id` (string)
- `correlation_id` (string)
- `policy_context_id` (string)
- `request_id` (string)
- `action_intent_ref` (string)
- `expires_at` (string, ISO-8601)
- `priority` (enum: LOW|MEDIUM|HIGH|URGENT)
- `requested_by` (actor object)
- `trace_link` (object or string)

Requested_by:
- `actor_id` (string)
- `actor_type` (string, for example: user|service|system)

Trace_link:
- If object: `input_snapshot_hash` OR `trace_id`
- If string: non-empty reference token

## ApprovalResponse (Required Fields)
Required:
- `tenant_id` (string)
- `run_id` (string)
- `correlation_id` (string)
- `policy_context_id` (string)
- `decision_id` (string)
- `request_id` (string)
- `action_intent_ref` (string)
- `decision` (enum: APPROVE|DENY|TIMEOUT)
- `decided_by` (actor object)
- `decided_at` (string, ISO-8601)
- `trace_link` (object or string)

Decided_by:
- `actor_id` (string)
- `actor_type` (string)

## Precedence
- User approval does NOT override canonical workflow gates.
- Canonical gates always retain final authority.
- Approvals may only allow or block actions already permitted by policy.

## Timeouts
- If `expires_at` passes with no response, decision is `TIMEOUT`.
- `TIMEOUT` responses MUST be treated as non-approval.
- Expired requests MUST NOT be executed.

## Replay and Trace Requirements
- Requests and responses MUST include `trace_link`, `run_id`, and `correlation_id`.
- Trace link must be stable enough to locate the related ActionIntent.

## Security
- `policy_context_id` defines the authorization boundary.
- `tenant_id` is mandatory for all requests/responses.
- `requested_by` and `decided_by` must identify the actor.

## No Side Effects
- Approval records never execute effects directly.
- Execution must remain in the Orchestrator/Service Layer.
