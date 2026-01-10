# ADR-007: Runtime Strategy — Mono-Stack Core + Hybrid Digital Twin

**Status:** ACCEPTED  
**Date:** 2026-01-09  
**Owner:** Architecture (Founder / Chief Architect)  
**Review Cadence:** Only if workload or SLA requirements change  

---

## Context

ViTo (VibeThink Orchestrator) operates in **two distinct runtime domains** with fundamentally different workload characteristics, SLA requirements, and risk profiles:

### ViTo Core: Company DNA Operating System

**Nature:** AI-First, Event-Driven platform for orchestrating business operations.

**Workloads:**
- **OCR/Document Intelligence:** CPU-intensive, 5-30s processing time, batch-oriented
- **NLP/Commitment Extraction:** LLM-heavy, 2-10s latency, async-friendly
- **ETL/Data Sync:** I/O-bound, webhook-driven, <200ms response target
- **Multi-Agent Orchestration:** Stateful, long-running (minutes to hours), requires compensation logic
- **Timeline Updates:** Real-time UI streaming, <100ms latency, WebSocket-based

**SLA Requirements:**
- **Availability:** 99.9% uptime (8.76 hrs/year downtime budget)
- **Latency:** <200ms for I/O operations, <30s for compute-heavy
- **Consistency:** Strong (Outbox Pattern mandated, transactional integrity)
- **Auditability:** Full event sourcing, Runtime Primitives Canon compliance

**Risk Profile:**
- **Multi-tenant isolation:** Critical (RLS + composite FKs enforced)
- **Data residency:** Regulated (GDPR/HIPAA for medical OCR)
- **Cost predictability:** High priority (hundreds of concurrent agents)

### Digital Twin: Real-Time Voice Avatar

**Nature:** Experimental, real-time conversational AI with voice synthesis.

**Workloads:**
- **Voice Gateway:** Ultra-low latency (<50ms), WebSocket connections, stateful
- **LLM Reasoning:** Standard latency (1-3s), stateless, can offload to Python
- **Voice Synthesis:** Real-time streaming, <100ms chunks

**SLA Requirements:**
- **Latency:** <50ms for voice gateway, <3s for LLM responses
- **Availability:** Best-effort (experimental module)
- **Consistency:** Eventual (voice state can be ephemeral)

**Risk Profile:**
- **Isolation:** Independent from ViTo Core (separate deployment)
- **Experimentation:** High iteration velocity required
- **Cost:** Variable (usage-based acceptable)

---

## Decision

### ViTo Core: Python Mono-Stack on Containers

**Runtime:**
- **Language:** Python 3.12+ (single source of truth)
- **Framework:** Agno (agent orchestration) + FastAPI (API layer) + BullMQ (job queue)
- **Deployment:** DigitalOcean Workers (containers, not serverless)
- **Async I/O:** uvloop + asyncio for high-concurrency workloads
- **Compute Offload:** ProcessPoolExecutor for CPU-bound tasks (OCR, Pandas)

**Infrastructure:**
- **Containers:** Mandatory base (predictable costs, full control)
- **Lambda:** Prohibited for core workloads (OCR, agents, WebSockets)
- **Database:** PostgreSQL + pgvector (Supabase-managed)
- **Queue:** Redis + BullMQ (job orchestration)

### Digital Twin: Node.js Gateway + Python Backend

**Runtime:**
- **Voice Gateway:** Node.js (WebSocket handling, ultra-low latency)
- **LLM Backend:** Python (reuse Agno agents, model inference)
- **Deployment:** Hybrid (Node.js on containers, Python workers on containers or Lambda)

**Rationale for Hybrid:**
- Voice gateway requires Node.js event loop efficiency for <50ms latency
- LLM reasoning can leverage existing Python Agno infrastructure
- Module is isolated from ViTo Core (no cross-contamination)

### Lambda: Exception-Only, Never Base

**Permitted Use Cases (must satisfy ALL):**
1. **Duration:** <15 minutes execution time
2. **State:** Fully stateless (no session management)
3. **Trigger:** Event-driven (S3, SNS, scheduled cron)
4. **Justification:** ADR required with cost/latency analysis

**Prohibited Use Cases:**
- ❌ OCR/PDF processing (CPU-intensive, >15min potential)
- ❌ Long-running agents (stateful, compensation logic required)
- ❌ WebSocket servers (connection-oriented, not event-driven)
- ❌ Core API endpoints (predictable load, containers more cost-effective)

---

## Rationale

### 1. Operational Control

**Containers provide:**
- Predictable resource allocation (CPU/memory limits)
- Full observability (logs, metrics, tracing without vendor lock-in)
- Debugging parity (local dev = production runtime)
- Deployment rollback control (blue/green, canary)

**Lambda limitations:**
- Cold start unpredictability (500ms-5s for Python with heavy deps)
- 15-minute hard timeout (incompatible with long-running agents)
- Vendor lock-in (AWS-specific event formats, IAM complexity)

### 2. Cost Predictability

**ViTo Core workload analysis:**
- **Baseline:** 100 concurrent agents, 24/7 operation
- **Container cost:** ~$200/month (2 vCPU, 4GB RAM, reserved)
- **Lambda cost:** ~$800-1,200/month (bursty, per-invocation pricing)
- **Savings:** 4-6x with containers for sustained workloads

**Digital Twin workload:**
- **Baseline:** Experimental, <10 concurrent users
- **Lambda cost:** ~$20-50/month (pay-per-use justified)
- **Container cost:** ~$100/month (over-provisioned for low usage)
- **Savings:** 2-5x with Lambda for sporadic workloads

### 3. Avoid Dual-Stack Complexity

**Python mono-stack eliminates:**
- Type sharing overhead (TypeScript ↔ Python DTOs)
- Cross-language debugging (correlation IDs, distributed tracing)
- Dual CI/CD pipelines (npm + pip, Docker images × 2)
- Cognitive load (one ecosystem, one set of patterns)

**Cost of dual-stack (documented):**
- Engineering overhead: 5-10x hidden costs vs. infrastructure
- Time-to-market: +40% for features touching both stacks
- Onboarding: +2 weeks for new developers

### 4. SLA Separation

**ViTo Core:**
- Mission-critical (99.9% uptime)
- Requires strong consistency (Outbox Pattern)
- Containers provide stability and control

**Digital Twin:**
- Experimental (best-effort availability)
- Eventual consistency acceptable
- Lambda provides rapid iteration without infrastructure overhead

### 5. Runtime Primitives Canon Alignment

**Canon requirements (RTP-*):**
- **RTP-201:** Timeout enforcement → `asyncio.wait_for()` (Python native)
- **RTP-202:** Heartbeat monitoring → Container health checks (native)
- **RTP-203:** Compensation logic → Requires stateful runtime (containers)
- **RTP-301:** Approval gates → Long-lived WebSocket connections (containers)

**Lambda incompatibilities:**
- Stateless by design (compensation logic requires state)
- 15-minute timeout (approval gates can take hours)
- Cold starts break heartbeat assumptions

---

## Consequences

### Positive

1. **Mental Simplicity:**
   - One language (Python) for ViTo Core
   - One deployment model (containers) for production workloads
   - Clear decision tree: "Is it Digital Twin? → Hybrid. Else → Python mono-stack."

2. **Independent Scaling:**
   - ViTo Core scales horizontally (add containers)
   - Digital Twin scales independently (Lambda auto-scales)
   - No resource contention between modules

3. **Reduced Technical Debt:**
   - No type sharing maintenance
   - No cross-language debugging
   - Single CI/CD pipeline for Core

4. **Cost Optimization:**
   - Containers for sustained workloads (4-6x cheaper)
   - Lambda for sporadic workloads (2-5x cheaper)
   - Predictable monthly budget

### Negative

1. **No "Pure Pay-Per-Use" for Core:**
   - Containers run 24/7 (fixed cost even at low usage)
   - Mitigation: Auto-scaling based on queue depth (BullMQ metrics)

2. **Container Discipline Required:**
   - Must monitor resource utilization (CPU/memory)
   - Must implement health checks and graceful shutdown
   - Must manage Docker image sizes and build times

3. **Digital Twin Complexity:**
   - Hybrid runtime (Node.js + Python) adds operational overhead
   - Mitigation: Isolated deployment, separate team ownership

---

## Explicit Non-Goals

### 1. Mastra for ViTo Core Orchestration

**Rejected because:**
- Agno provides superior performance (529x faster instantiation)
- Python mono-stack avoids dual-language complexity
- Mastra's TypeScript focus conflicts with Core's Python ecosystem

**Status:** Mastra remains in HOLD for future evaluation (Digital Twin gateway candidate).

### 2. Lambda for Core Workloads

**Rejected for:**
- OCR/PDF processing (CPU-intensive, >15min potential)
- Long-running agents (stateful, requires compensation)
- WebSocket servers (connection-oriented)
- Core API endpoints (sustained load, containers more cost-effective)

**Status:** Lambda permitted only for exception cases (see Guardrails).

### 3. Mixing Digital Twin with ViTo Core

**Rejected because:**
- Different SLA requirements (99.9% vs. best-effort)
- Different risk profiles (regulated vs. experimental)
- Different deployment cadences (stable vs. rapid iteration)

**Status:** Digital Twin is a separate module with independent deployment pipeline.

---

## Guardrails

### Lambda Usage Approval Process

Any use of Lambda for ViTo workloads **MUST** satisfy ALL criteria:

1. **Duration:** <15 minutes execution time (hard AWS limit)
2. **State:** Fully stateless (no session management, no compensation logic)
3. **Trigger:** Event-driven (S3 upload, SNS notification, scheduled cron)
4. **Justification:** ADR required with:
   - Cost analysis (Lambda vs. container for expected load)
   - Latency analysis (cold start impact on p99)
   - Failure mode analysis (timeout, retry, idempotency)

**Approval:** Chief Architect (Founder) must sign off on ADR.

### New Hybrid Runtime Approval Process

Any proposal to introduce a **new runtime language or framework** (e.g., Rust, Go, Elixir) **MUST**:

1. **Create ADR:** Document decision with evidence-based rationale
2. **Provide Metrics:** Demonstrate that Python mono-stack cannot meet requirements
   - Benchmarks showing performance gap >2x
   - Cost analysis showing savings >30%
   - Latency analysis showing improvement >50ms p99
3. **Define Boundaries:** Specify exact module/component scope (no "gradual creep")
4. **Commit to Ownership:** Assign dedicated team for maintenance and on-call

**Approval:** Requires consensus from Architecture + Engineering Leadership.

---

## Review & Ownership

**Owner:** Architecture (Founder / Chief Architect)  
**Stakeholders:** Engineering Leadership, DevOps, Product  
**Review Cadence:** Only if workload or SLA requirements change  

**Triggers for Review:**
- ViTo Core exceeds 500 concurrent agents (scaling limits)
- Digital Twin graduates to production SLA (99.9% uptime required)
- New regulatory requirements (e.g., data residency mandates)
- Cost analysis shows >30% savings with alternative runtime

**Review Process:**
1. Propose ADR amendment with evidence (metrics, benchmarks, cost analysis)
2. Architecture review (2-week feedback period)
3. Consensus approval (Architecture + Engineering Leadership)
4. Update ADR with amendment history

---

## Conclusion

This ADR **CLOSES** the runtime and deployment strategy debate for ViTo Core and Digital Twin until real-world metrics justify revisiting the decision.

**Key Takeaways:**
- **ViTo Core:** Python mono-stack on containers (predictable, controllable, cost-effective)
- **Digital Twin:** Node.js gateway + Python backend (hybrid justified by SLA differences)
- **Lambda:** Exception-only (never base infrastructure)
- **Dual-Stack:** Avoided for Core (5-10x hidden costs documented)

**Next Steps:**
1. Implement Agno + FastAPI + BullMQ on DigitalOcean Workers (Phases 1-2)
2. Benchmark 500 concurrent webhooks with Python AsyncIO + uvloop (Validation)
3. Deploy Digital Twin as isolated module with independent pipeline

**No further runtime debates until metrics prove otherwise.**

---

**Signed:**  
Marcelo Ruiz (Founder / Chief Architect)  
Date: 2026-01-09
