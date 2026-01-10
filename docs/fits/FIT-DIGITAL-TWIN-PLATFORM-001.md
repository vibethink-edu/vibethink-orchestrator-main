# FIT-DIGITAL-TWIN-PLATFORM-001: Digital Twin Vertical (ViTo Implementation)

> **Status:** SEALED FOR EXECUTION
> **Canonical Reference:** `docs/fits/FIT-DIGITAL-TWIN-PLATFORM-001.md`
> **Governance Authority:** ViTo Core Architecture
> **Enforcement Level:** STRICT (No Drift Allowed)

---

## 1. Canonical Declaration

This Feature Implementation Track (FIT) declares the **Digital Twin Platform** strictly as a **VERTICAL CONSUMER** of the existing `ViTo Core`.

**Mandate:**
*   This is NOT a new product. It is a new interface layout consuming existing core services.
*   **ViTo Core** remains the sole authority for Identity, Secrets, Billing, and Rate Limiting.
*   No new billing engines or tenant tables shall be created.

---

## 2. Scope & Tenant Model

### 2.1 The Non-Negotiable Tenant Rule
> **Rule:** `1 Avatar = 1 Tenant`

*   **Definition:** An "Avatar" (e.g., "Andrés Cantor Digital Twin") is treated as a distinct Tenant Unit within ViTo.
*   **Implication:** It has its own `tenant_id`, its own `secret_vault` (for video provider keys), and its own distinct Billing Meter.
*   **Isolation:** Data from "Andrés Cantor" (Tenant A) is cryptographically isolated from "Tony Robbins" (Tenant B).

### 2.2 Scope Definition

| Feature | Status | Constraint |
| :--- | :--- | :--- |
| **Real-Time Interaction** | **IN SCOPE** | Must use `LiveKit Agent` orchestration (Python/Node). |
| **Cost Control** | **IN SCOPE** | Must use `ViTo Billing` Pre-Flight Checks. |
| **API Integration** | **IN SCOPE** | Live Data (e.g., SportRadar) via `ViTo Secret Vault`. |
| **Model Training** | **OUT OF SCOPE** | Consumes existing models only. No fine-tuning infrastructure. |
| **Video Storage** | **OUT OF SCOPE** | Ephemeral streaming only. No long-term storage build. |
| **Clinical Features** | **OUT OF SCOPE** | No OCR, PHI, or DICOM handling. Shared security only. |

---

## 3. Canonical Use Cases (Validated)

This architecture validates two distinct operational profiles using identical infrastructure.

### 3.1 Use Case A: Sports Personality (High Burst)
*   **Identity:** **Andrés Cantor** (Football Commentator)
*   **Description:** Real-time voice/video avatar specializing in football, integrating paid sports APIs.
*   **Data Strategy:** Hybrid RAG (Historical Context + Live SportRadar API).
*   **Operational profile:** Mass B2C audience. Extreme burst spikes during live matches.
*   **Constraint:** Requires aggressive throttling and "Leaky Bucket" rate limiting to survive match-day traffic.

### 3.2 Use Case B: AI Consultant (High Value)
*   **Identity:** **José Luis Fernández** (AI Strategy Consultant - salesfyconsulting.com)
*   **Description:** Professional avatar for B2B executives providing strategic AI advice.
*   **Data Strategy:** Hybrid RAG (Proprietary Frameworks + Live Industry News).
*   **Operational profile:** Low volume, high interaction depth. Long sessions.
*   **Constraint:** Requires high token limits per session but stricter monthly budget caps.

### 3.3 Comparative Analysis (Same Engine, Different Config)

| Feature | Case A: Andrés Cantor | Case B: José Luis Fernández | ViTo Core Mechanism |
| :--- | :--- | :--- | :--- |
| **Traffic Pattern** | **Extreme Spikes** (Match Day) | **Steady / Scheduled** (Business Hours) | `RateLimiter.checkBurst()` |
| **Dominant Cost** | Voice Streaming + Sports API | LLM Tokens (Deep Reasoning) | `BillingMeter` (configurable weights) |
| **Risk Profile** | DDoS / Virality Cost Overrun | Hallucination / Confidentiality | `HardLimit` (Budget Cap) |
| **External Source** | SportRadar / API-Football | NewsAPI / Vector DB | `SecretVault` + `Adapter` |
| **Limit Strategy** | Strict Throttling (Queue/Drop) | Soft Cap (Downgrade to Text) | `PolicyConfig` (JSONB) |
| **Tenant Model** | 1 Avatar = 1 Tenant | 1 Avatar = 1 Tenant | **Identical** |

**Conclusion:** Both use cases are 100% supported by the current FIT without architectural changes. Configuration (Limits/Secrets) handles the divergence.

---

## 4. Technical Implementation Plan

### 4.1 Interaction Units (The Currency)

We define three standardized units of consumption mapping to ViTo Billing:

1.  **`token_unit`:** (LLM) 1K tokens input/output.
2.  **`minute_unit`:** (Video/Voice) 60 seconds of generated stream.
3.  **`interaction_unit`:** (Orchestrator) 1 successful turn (User Input -> Agent Response).

*Usage:* Every request is debited against one or more of these meters.

### 4.2 The Request Lifecycle (Pre-Flight Check)

**Critical Path:** NO vendor call happens without prior authorization.

1.  **Incoming Request:** User sends audio packet to `wss://twin-gateway`.
2.  **Identify Tenant:** Gateway extracts `tenant_id` from JWT/API Key.
3.  **PRE-FLIGHT CHECK (Synchronous):**
    *   Call `ViTo.Billing.checkLimit(tenant_id, expected_cost)`.
    *   Call `ViTo.RateLimit.checkBurst(tenant_id)`.
4.  **Decision Gate:**
    *   ✅ **PASS:** Proceed to Step 5.
    *   ⚠️ **THROTTLE:** Queue request (if within burst buffer).
    *   ⛔ **DENY:** Return `429 Too Many Requests` or `402 Payment Required`.
5.  **Vendor Execution:** Call `LiveKit` / `Tavus` / `Cartesia`.
6.  **Post-Flight Audit:** Async event `BILLING_EVENT` sent to ViTo Audit Log.

### 4.3 Vendor-Agnostic Interfaces

To prevent vendor lock-in, we implement strictly typed adapters:

```typescript
interface IStreamingAvatarProvider {
  /** Initiate a streaming session. Validates cost before connection. */
  initializeSession(config: AvatarConfig, limits: RuntimeLimits): Promise<SessionId>;
  
  /** Send text/audio driver. usageCallback tracks real-time cost. */
  driveAvatar(input: StreamInput, usageCallback: (metrics: Metrics) => void): Promise<void>;
  
  /** Hard kill switch for cost control */
  terminate(reason: 'COST_LIMIT' | 'USER_EXIT'): Promise<void>;
}

interface IRealTimeContextAdapter {
  /** Fetch live context (e.g. soccer score) using Tenant Secrets */
  fetchContext(query: string, secretScope: string): Promise<ContextData>;
}
```

---

## 5. Cost Control Strategy: Burst Management

We implement a 3-stage defense against cost overruns:

1.  **Stage 1: Throttle (Leaky Bucket)**
    *   Smooths out spikes. Delays response by ms instead of rejecting.
2.  **Stage 2: Downgrade (Fallback)**
    *   If Video quota exhausted -> Switch to Voice-Only.
    *   If Voice quota exhausted -> Switch to Text-Only.
3.  **Stage 3: Deny (Hard Stop)**
    *   If `monthly_hard_limit` reached -> Immediate 402 Error. "Twin is sleeping".

---

## 6. Evidence Checklist (FIT Gate)

The Auditor must verify these claims before "RELEASE":

| ID | Claim | Verification Method (Evidence) |
| :--- | :--- | :--- |
| **EV-01** | **Hard Limit Implementation** | Configure Tenant A with $1.00 limit. Run $1.01 of simulated traffic. **RESULT:** Request #101 must fail with 402. Vendor API MUST NOT be called. |
| **EV-02** | **Tenant Isolation** | Use Tenant A's valid key to request Tenant B's avatar. **RESULT:** Immediate 403 Forbidden. |
| **EV-03** | **Burst Throttling** | Send 100 req/sec with limit 50 req/sec. **RESULT:** 50 Success, 50 Throttled/Rejected. No crash. |
| **EV-04** | **Audit Trail Integrity** | Perform 1 minute of video. **RESULT:** DB `audit_logs` shows exactly 1 entry with correct `cost_amount` and `provider_id`. |

---

**Signed:**
VibeThink Governance Architect
*Strict Adherence Required*
