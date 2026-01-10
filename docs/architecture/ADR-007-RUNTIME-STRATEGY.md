# ADR-007: Runtime Strategy — Mono-Stack Core + Hybrid Digital Twin

**Status:** ACCEPTED  
**Date:** 2026-01-09  
**Owner:** Architecture (Founder / Chief Architect)  
**Review Cadence:** Only if workload, SLA, volume, or business model changes  

---

## Context

ViTo operates in **two distinct runtime domains** that must NOT be conflated:

### ViTo Core: Company DNA Operating System

**Nature:** Multi-tenant SaaS for enterprise orchestration (AI-first, event-driven, billing-grade).

**Workloads:**
- OCR/Document Intelligence (CPU-intensive, 5-30s, batch)
- NLP/Commitment Extraction (LLM-heavy, 2-10s, async)
- ETL/Data Sync (I/O-bound, webhook-driven, <200ms)
- Multi-Agent Orchestration (stateful, long-running, requires compensation)
- Timeline Updates (real-time UI streaming, <100ms, WebSocket)

**SLA Requirements:**
- **Availability:** 99.9% uptime
- **Latency:** <200ms I/O, <30s compute
- **Consistency:** Strong (Outbox Pattern mandated)
- **Auditability:** Full event sourcing (Runtime Primitives Canon)

**Constraints:**
- Multi-tenant isolation (RLS + composite FKs)
- Data residency compliance (GDPR/HIPAA)
- Cost predictability (hundreds of concurrent agents)

### Digital Twin: Real-Time Voice Avatar

**Nature:** Experimental module for bidirectional voice streaming (independent from Core).

**Workloads:**
- Voice Gateway (ultra-low latency <50ms, persistent WebSocket connections)
- LLM Reasoning (1-3s, stateless, offloadable to Python)
- Voice Synthesis (real-time streaming, <100ms chunks)

**SLA Requirements:**
- **Latency:** <50ms voice gateway, <3s LLM
- **Availability:** Best-effort (experimental)
- **Consistency:** Eventual (ephemeral state acceptable)

**Constraints:**
- Isolated deployment (no cross-contamination with Core)
- High iteration velocity (rapid experimentation)
- Variable cost model (usage-based acceptable)

**Why Separation Matters:**  
Mixing Core (mission-critical, regulated, predictable) with Digital Twin (experimental, real-time, variable) in a single runtime creates architectural debt and operational risk.

---

## Decision

### ViTo Core: Python Mono-Stack on Containers

**Runtime:**
- **Language:** Python 3.12+ (single source of truth)
- **Framework:** Agno + FastAPI + BullMQ
- **Deployment:** Containers (DigitalOcean Workers, NOT serverless)
- **Async I/O:** uvloop + asyncio
- **Compute:** ProcessPoolExecutor (OCR, Pandas)

**Infrastructure:**
- **Containers:** Mandatory (predictable costs, full control)
- **Database:** PostgreSQL + pgvector (Supabase)
- **Queue:** Redis + BullMQ
- **Lambda:** Prohibited for Core workloads

### Digital Twin: Hybrid by Exception

**Runtime:**
- **Voice Gateway:** Node.js (WebSocket handling, <50ms latency)
- **LLM Backend:** Python (reuse Agno infrastructure)
- **Deployment:** Hybrid (Node.js containers + Python workers/Lambda)

**Justification:**  
Voice gateway requires Node.js event loop efficiency. LLM reasoning leverages existing Python Agno stack. Module is isolated—no impact on Core.

### Lambda: Exception-Only, Never Base

**Permitted IF AND ONLY IF ALL apply:**
1. **Stateless** (no session management)
2. **Event-driven** (S3, SNS, cron)
3. **<15 minutes** (hard AWS limit)
4. **ADR approved** (cost/latency analysis required)

**Prohibited:**
- ❌ OCR/PDF processing
- ❌ Long-running agents
- ❌ WebSocket servers
- ❌ Core API endpoints

---

## Rationale

### 1. Operational Simplicity

**One language (Python) for Core:**
- Single mental model
- No type sharing overhead (TypeScript ↔ Python)
- No cross-language debugging
- Single CI/CD pipeline

### 2. Control & Predictability

**Containers provide:**
- Full observability (no vendor lock-in)
- Debugging parity (local = production)
- Deployment control (blue/green, canary)
- Predictable resource allocation

**Lambda limitations:**
- Cold starts (500ms-5s)
- 15-minute timeout (incompatible with agents)
- Vendor lock-in (AWS-specific)

### 3. Cost Optimization

**ViTo Core (sustained workload):**
- Containers: ~$200/month (100 agents, 24/7)
- Lambda: ~$800-1,200/month
- **Savings:** 4-6x

**Digital Twin (sporadic workload):**
- Lambda: ~$20-50/month (<10 users)
- Containers: ~$100/month (over-provisioned)
- **Savings:** 2-5x

### 4. SLA Alignment

**Core:** Mission-critical (99.9%) → Containers (stability)  
**Digital Twin:** Experimental (best-effort) → Lambda (rapid iteration)

### 5. Runtime Primitives Canon Compliance

**Canon requirements (RTP-*):**
- RTP-201 (Timeouts) → `asyncio.wait_for()` ✅
- RTP-202 (Heartbeats) → Container health checks ✅
- RTP-203 (Compensation) → Stateful runtime ✅
- RTP-301 (Approval Gates) → Long-lived WebSockets ✅

**Lambda incompatibilities:**
- Stateless (compensation requires state) ❌
- 15-minute timeout (approval gates can take hours) ❌
- Cold starts (heartbeat assumptions broken) ❌

---

## Consequences

### Positive

1. **Mental Simplicity:** One language, one deployment model for Core
2. **Independent Scaling:** Core and Digital Twin scale separately
3. **Reduced Debt:** No type sharing, no dual CI/CD, no cross-language debugging
4. **Cost Control:** Predictable monthly budget (containers for sustained, Lambda for sporadic)
5. **Enterprise-Grade:** Full observability, rollback control, compliance-ready

### Negative

1. **No Pure Pay-Per-Use:** Containers run 24/7 (fixed cost at low usage)
2. **Container Discipline:** Requires monitoring, health checks, graceful shutdown
3. **Digital Twin Complexity:** Hybrid runtime adds operational overhead (mitigated by isolation)

---

## Explicit Non-Goals

### ❌ Mastra for ViTo Core Orchestration

**Rejected:**
- Agno is 529x faster (instantiation)
- Python mono-stack avoids dual-language complexity
- Mastra's TypeScript focus conflicts with Core ecosystem

**Status:** HOLD (Digital Twin gateway candidate only)

### ❌ Lambda for Core Workloads

**Rejected:**
- OCR/PDF (CPU-intensive, >15min potential)
- Long-running agents (stateful, compensation required)
- WebSockets (connection-oriented)
- Core APIs (sustained load, containers cheaper)

**Status:** Exception-only (see Guardrails)

### ❌ Mixing Digital Twin with ViTo Core

**Rejected:**
- Different SLAs (99.9% vs best-effort)
- Different risk profiles (regulated vs experimental)
- Different deployment cadences (stable vs rapid)

**Status:** Separate module, independent pipeline

### ❌ New Runtimes Without Evidence

**Rejected:**
- No Rust/Go/Elixir without ADR + metrics
- No "gradual creep" of languages
- No decisions based on convenience or trends

**Status:** Requires ADR with performance gap >2x or cost savings >30%

---

## Guardrails

### Lambda Usage (Strict Approval Required)

**ALL criteria MUST be satisfied:**
1. **Stateless** (no session, no compensation)
2. **Event-driven** (S3, SNS, cron—not HTTP long-poll)
3. **<15 minutes** (hard limit)
4. **ADR with analysis:**
   - Cost (Lambda vs container for expected load)
   - Latency (cold start impact on p99)
   - Failure modes (timeout, retry, idempotency)

**Approval:** Chief Architect (Founder) sign-off required.

### New Runtime Introduction (Strict Approval Required)

**ALL criteria MUST be satisfied:**
1. **ADR with evidence-based rationale**
2. **Metrics proving Python mono-stack insufficient:**
   - Performance gap >2x (benchmarks)
   - Cost savings >30% (analysis)
   - Latency improvement >50ms p99
3. **Scope definition** (exact module/component, no creep)
4. **Ownership commitment** (dedicated team, on-call)

**Approval:** Architecture + Engineering Leadership consensus.

---

## Review & Ownership

**Owner:** Architecture (Founder / Chief Architect)  
**Stakeholders:** Engineering Leadership, DevOps, Product  

**Review Triggers (ONLY if):**
- ViTo Core exceeds 500 concurrent agents
- Digital Twin graduates to production SLA (99.9%)
- New regulatory requirements (data residency)
- Cost analysis shows >30% savings with alternative

**Review Process:**
1. Propose ADR amendment with evidence (metrics, benchmarks, cost)
2. Architecture review (2-week feedback period)
3. Consensus approval (Architecture + Engineering Leadership)
4. Update ADR with amendment history

---

## Conclusion

This ADR **CLOSES** the runtime and deployment debate for ViTo Core and Digital Twin.

**No further discussion on:**
- "Lambda or containers?"
- "Mono-stack or hybrid?"
- "Node or Python for Core?"

**Decisions are final until:**
- Production metrics prove inadequacy
- New ADR with evidence is approved

**Next Steps:**
1. Implement Agno + FastAPI + BullMQ on containers (Phases 1-2)
2. Benchmark 500 webhooks with Python AsyncIO + uvloop (validation)
3. Deploy Digital Twin as isolated module

**Signed:**  
Marcelo Ruiz (Founder / Chief Architect)  
Date: 2026-01-09
