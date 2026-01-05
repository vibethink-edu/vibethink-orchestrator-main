# Reasoning Orchestrator Execution Specification

**Status**: CANONICAL — SEAL-READY
**Change Policy**: PROHIBITED without Canon Amendment
**Type**: ARCHITECTURAL_SPEC
**Version**: 1.0.0
**Last Updated**: 2026-01-04
**Parent Canons**: 02_AI_FIRST_3_LAYER_ARCHITECTURE.md, CANON-ORCH-STATE-001.md, CANON-EVENTS-001.md, CANON-TRACE-001.md, 09_SPECIALISTS_ARCHITECTURE_SPEC.md

---

## 1. Purpose

This document defines the runtime execution contract for the Reasoning Orchestrator (Layer 2). The Orchestrator is a **runtime controller**, not a cognitive agent. It coordinates Specialists, ToolCalls, and Effects using the sealed runtime state models (Signal, Run, Step, Effect, ToolCall).

**Non-negotiable invariants**:
- The Orchestrator MUST NOT introduce new canonical entities or domain models.
- Specialists MUST NOT call the Service Layer; they only return runtime action intents.
- All execution MUST be deterministic and replayable given the same inputs and versions.
- Persistent state is limited to trace/audit per CANON-TRACE; all other runtime state is ephemeral.

---

## 2. Orchestrator State Lifecycle

### 2.1 Creation
- A **Run** is created when a **Signal** is accepted for processing.
- A Run MUST be associated to a single Signal and a single correlation_id.
- session_id is a runtime execution identifier and MUST equal run_id for serialization purposes.

### 2.2 Lifespan
- A Run exists only while the Orchestrator is processing the Signal or awaiting approvals.
- Steps and Effects are created only as part of a Run execution.
- ToolCalls are created only within a Step.

### 2.3 Mutation Rules
- Run, Step, Effect, ToolCall state transitions MUST follow CANON-ORCH-STATE-001.
- State transitions MUST be recorded as events (CANON-EVENTS-001).
- Orchestrator MUST NOT mutate Memory Plane directly.

### 2.4 Destruction
- A Run reaches terminal state: COMPLETED, FAILED, or CANCELLED.
- After terminal state, no further Steps or Effects may be created for that run_id.

---

## 3. Execution Flow (Deterministic 9 Steps)

All steps are normative and MUST be executed in order. Each step MUST be recorded in trace logs and event logs.

1) **Signal Intake** (MUST)
- Validate Signal integrity and policy access.
- If invalid, emit SIGNAL_PROCESSING_FAILED and terminate.

2) **Run Initialization** (MUST)
- Create Run with run_type SIGNAL_PROCESSING and correlation_id.
- Emit RUN_STARTED.

3) **Input Snapshot** (MUST)
- Create deterministic input snapshot: Memory Plane view + Policy context + Signal payload.
- Compute input_snapshot_hash.

4) **Step Planning** (MUST)
- Determine next Step type and specialist selection using deterministic rules.
- Record plan in trace log.

5) **Specialist Invocation** (MUST)
- Execute Specialist with input snapshot and explicit goal context.
- Specialist output MUST be a runtime action intent and inferences only.

6) **ToolCall Execution** (MUST if invoked)
- Execute tool calls in a deterministic order.
- Record tool call inputs/outputs and tool version in trace.

7) **Approval Gate** (MUST)
- If action intent requires approval, create ApprovalRequest and block progression.
- No Effect may be created prior to approval.

8) **Service Layer Handoff** (MUST after approval)
- Convert approved action intent to Effect and outbox event.
- Enforce idempotency and retry rules.

9) **Run Finalization** (MUST)
- Emit RUN_COMPLETED or RUN_FAILED.
- Persist final trace and audit records.

MUST NOT:
- Skip any step or reorder steps.
- Execute Effects without Approval Gate or Workflow Gate.

---

## 4. Concurrency and Idempotency

### 4.1 Serialization
- Execution MUST be serialized by session_id (run_id).
- Only one active Run per session_id at a time.

### 4.2 Idempotency
- All Steps and Effects MUST include an idempotency_key derived from run_id, step_id, and payload hash.
- Reprocessing a Signal with the same source_id MUST NOT create duplicate Effects.

---

## 5. Approval Gates

### 5.1 User Approval
- User Approval is explicit user consent in UX.
- User Approval MUST block execution until received or expired.

### 5.2 Canonical Workflow Gate
- Workflow Gate is a deterministic system gate defined by canonical workflows.
- Workflow Gate applies even if User Approval is present.

### 5.3 Precedence and Timeouts
- Workflow Gate evaluation occurs before User Approval.
- If Workflow Gate denies, execution MUST terminate.
- Approval timeout MUST default to 24 hours and be configurable; expired approvals MUST terminate the Run.

---

## 6. Determinism and Replay

### 6.1 Required Hashes and Versions
Each Run MUST record in trace:
- input_snapshot_hash
- policy_context_id
- specialist_id and specialist_version
- prompt_hash (if LLM used)
- model_version
- tool_call_inputs_outputs
- action_intent_hash

### 6.2 Replay Procedure
1) Load Signal and Run events.
2) Load input snapshot by input_snapshot_hash.
3) Re-execute Steps in order using recorded versions.
4) Verify outputs match recorded action_intent_hash.

### 6.3 Retention
- Trace logs MUST be retained for at least 90 days.
- Event logs MUST be retained per CANON-EVENTS-001 policy.

---

## 7. Service Layer Handoff

### 7.1 Operational Schema (Non-Canonical)
- ServiceCall: { run_id, step_id, effect_type, idempotency_key, payload_hash, created_at }

### 7.2 Execution Order
- Effects MUST be executed in the order of Step completion.
- Parallel effects MAY be executed only if marked as independent in the action intent.

### 7.3 Retry Rules
- MUST use exponential backoff.
- Max retries MUST follow CANON-EVENTS-001 defaults.

---

## 8. Error Handling

- Specialist crash: mark Step as FAILED, emit STEP_FAILED, terminate Run.
- Validation failure: emit SIGNAL_PROCESSING_FAILED, terminate Run.
- Tool timeout: retry once if safe; otherwise STEP_FAILED.
- Approval timeout: terminate Run with RUN_FAILED.

---

## 9. Anti-Patterns (Prohibited)

1) Hidden state outside trace logs.
2) Direct Service Layer calls by Specialists.
3) Auto-commit of inferences to Canonical Memory.
4) New domain objects or contracts outside sealed canon.
5) Heuristic shortcuts that bypass Approval Gates.
6) Non-deterministic ordering of ToolCalls or Effects.

Detection (MUST):
- Trace logs MUST include markers for approval decisions, tool order, and effect order.
- Metrics MUST alert on missing approval or missing idempotency.

---

## 10. Observability

### Metrics (MUST)
- run_duration_ms
- step_duration_ms
- effect_retry_count
- approval_latency_ms
- tool_call_duration_ms

### Logs (MUST)
- Run start/stop with correlation_id
- Step state transitions
- Approval decision and timeout

### Tracing (SHOULD)
- Correlation across Signal, Run, Step, Effect, ToolCall

---

## 11. UX Interaction

- UX MAY present approval requests and status projections only.
- UX MUST NOT execute Effects.
- UX MUST route approvals to the Orchestrator.

---

## 12. Versioning and Compatibility

- This spec follows SemVer.
- Backward compatibility MUST be maintained for trace fields and action intents.

---

## 13. Security

- AuthZ checks MUST be applied before any Specialist invocation.
- Least privilege MUST be enforced for Service Layer calls.
- Audit logs MUST record who approved and when.

---

## 14. Operational Schemas (Non-Canonical)

These are runtime structures, not canonical entities:

- State: { run_id, step_id, status, started_at, completed_at }
- ServiceCall: { run_id, step_id, effect_type, idempotency_key, payload_hash, created_at }
- ApprovalRequest: { run_id, step_id, requested_by, requested_at, expires_at }
- ApprovalResponse: { run_id, step_id, approved_by, approved_at, decision }
- TraceRecord: { run_id, step_id, input_snapshot_hash, prompt_hash, model_version, tool_call_inputs_outputs, action_intent_hash }
- AuditLog: { run_id, actor_id, action, timestamp }
- StateProjection: { run_id, status, last_update_at }

---

**End of Reasoning Orchestrator Execution Specification**

