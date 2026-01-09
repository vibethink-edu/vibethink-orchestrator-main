# Trace Retention and Audit Policy

Status: NON-CANONICAL
Seal-Candidate: YES
Last Updated: 2026-01-05
Scope: Operational reference only
Canon-Impact: NONE

## Purpose
Define trace retention, audit, replay windows, PII/secret handling, export, and purge rules.
This policy is operational and does not introduce Canon entities.

## Data Classification (MUST)
- Canonical Memory (Truth): Canon facts and stable records. Not a trace store.
- Trace logs (evidence): Execution traces and chain evidence for replay.
- Audit logs: Security and compliance events for attestations.
- Tool call payloads: Inputs/outputs from tools (may contain sensitive data).
- Attachments / EvidencePack references: External evidence pointers and file references.

## Retention Windows (MUST)
- Hot: 30 days (fast access, replay-focused)
- Warm: 180 days (investigation and audit support)
- Cold/Archive: 365 days (optional, lower cost)
- Legal hold: indefinite until explicitly released

Retention tiers are based on trace age and legal hold overrides.

## Replay Window Policy (MUST)
Replay is guaranteed only inside the replay window (default 30 days) and only if
all required replay fields are present.

Required replay fields:
- signal_id
- input_snapshot_hash
- policy_context_id
- prompt_hash
- model_version
- versions (model_version, specialist_version)
- tool_call_inputs_outputs (hashes)
- output_hash
- determinism_key

Replay is not guaranteed if:
- any required replay field is missing
- trace age exceeds the replay window
- legal hold or redaction removes required replay fields

Hash requirements for replay integrity:
- input snapshot hash
- prompt hash
- model version
- tool call IO hashes
- output hash
- determinism key (hash of signal_id, input_snapshot_hash, versions)

## PII and Secrets (MUST)
- No raw secrets in trace logs. This is an invariant.
- Redact or hash identifiers before storage or export.
- Sensitive identifiers MUST be hashed with a deterministic salt.

Redaction rules:
- Full redaction: password, secret, token, api_key, authorization, cookies
- Hashed identifiers: user_id, account_id, org_id, tenant_id, session_id,
  trace_id, email, phone, ip

Incident procedure if PII or secrets are detected:
1) Immediate freeze on affected traces
2) Redact and re-export
3) Create an audit incident record
4) Review root cause and update redaction rules

## Purge and Export (MUST)
- Purge plan MUST be a dry-run plan (what would be deleted and why).
- Purge execution MAY exist later, but is not implemented now.
- Export for audit MUST use redacted traces.

## Observability and Governance (MUST)
Minimum metrics:
- traces_per_day
- redaction_rate
- purge_volume
- legal_hold_count

Ownership and approvals:
- Owner: Security and Compliance
- Approvers: Platform Lead, Security Lead
- Changes to retention windows require approval

## Implementation References
- Policy tests: docs/testing/TRACE_RETENTION_POLICY_TESTS.md
- Retention planner: scripts/ops/trace-retention/plan-retention.js
- Redaction tool: scripts/ops/trace-retention/redact-trace.js
