# FIT-DIGITAL-TWIN-PLATFORM-001: Celebrity/Persona AI (Video & Voice Twin)

> **Status:** DRAFT (Pending Seal)
> **Owner:** VibeThink Architecture Team
> **Canonical Reference:** `docs/fits/FIT-DIGITAL-TWIN-PLATFORM-001.md`
> **Dependence:** Relies strictly on `ViTo Core` for tenancy, billing, and limits.

---

## 1. Canonical Declaration & Mandate

This Feature Implementation Track (FIT) defines the **Digital Twin Vertical** solely as a consumer of the existing **ViTo Core**.

**The Gold Standard:**
*   **ViTo Core** is the ONLY Source of Truth for: API Keys, Tenant Secrets, Billing, Hard Limits, Throttling, and Audit Logs.
*   **NO Reinvention:** This vertical MUST NOT create parallel billing, auth, or rate-limiting tables. It must adapter-bind to existing Core modules.
*   **One Tenant Rule:** In this specific vertical context, **1 Persona/Avatar = 1 Tenant Unit**. A "Company" (e.g., VibeThink) may own multiple Tenants (Avatars), or an Avatar may be its own self-managed Tenant.

---

## 2. Scope

### ✅ IN SCOPE (The Vertical)
1.  **Orchestration of Real-Time Interaction:** Connecting end-users to Voice/Video providers via ViTo.
2.  **Vendor-Agnostic Adapters:** Interfaces for Video (e.g., Tavus, HeyGen) and Voice (e.g., Cartesia, ElevenLabs).
3.  **Knowledge Injection:** Feeding the Avatar with real-time data from predefined APIs (e.g., SportRadar, Financial News).
4.  **Cost Control Logic:** Implementing the specific *Throttle -> Downgrade -> Deny* workflow based on ViTo Core limits.
5.  **Multi-Channel Usage:** Portal, Embedded Widget, or Campaign Landing.

### 🚫 OUT OF SCOPE (Hard Exclusions)
1.  **Model Training:** We do not train LLMs. We consume APIs.
2.  **Video Storage/Hosting:** We stream; we do not build a YouTube clone.
3.  **Parallel Infrastructure:** No separate auth, no separate logging, no separate billing engine.
4.  **Clinical Features:** No OCR, no HIPAA-specific workflows (though security is shared).

---

## 3. Targeted Architecture (Layered)

This vertical sits strictly at the **Application Layer**, consuming Core Services.

```mermaid
graph TD
    User[End User] --> Widget[Embedded / Portal Widget]
    Widget --> Orchestrator[Twin Orchestrator (The Vertical)]
    
    subgraph "ViTo Core (The Authority)"
        Orchestrator -- "Authorize & Check Limits" --> Limits[Rate Limiter / Billing]
        Orchestrator -- "Get API Keys" --> Secrets[Tenant Key Vault]
        Orchestrator -- "Log Event" --> Audit[Audit Logger]
        Limits --> DB[(ViTo DB)]
    end
    
    subgraph "External Providers (via Adapters)"
        Orchestrator -- "Stream" --> VideoAPI[Video Provider (Tavus/LiveKit)]
        Orchestrator -- "Stream" --> VoiceAPI[Voice Provider (Cartesia)]
        Orchestrator -- "Fetch Data" --> DataAPI[Real-time Data (Stats/News)]
    end
```

---

## 4. Technical Implementation Plan

### 4.1. Interfaces & Adapters (Vendor-Agnostic)

We define interfaces, not vendor implementations, to ensure replaceability.

*   `IVideoTwinProvider`: Methods for `initializeSession()`, `streamFrame()`, `terminate()`.
*   `IVoiceSynthesizer`: Methods for `streamAudio()`, `interrupt()`.
*   `IRealTimeDataSource`: Methods for `fetchContext(topic)`.

### 4.2. The Cost Control Loop (The "Kill Switch")

Before **EVERY** interaction tick (e.g., every minute of video or every LLM turn), the Orchestrator performs a **Pre-Flight Check** against ViTo Core:

1.  **Check Hard Limit:** Is `current_usage >= monthly_cap`?
    *   *If YES:* **DENY**. Return fallback ("I am sleeping now") or downgrade to Text-Only.
2.  **Check Burst Limit (Throttling):** Is `concurrent_users > burst_allowance`?
    *   *If YES:* **QUEUE** or **DENY**.
3.  **Execute:** Call External Provider.
4.  **Post-Debit:** Asynchronously update Core Billing meter.

### 4.3. Audit & Claims

The system must produce a verifiable audit trail for every cent charged.

*   **Metric Unit:** `interaction_seconds` or `token_count`.
*   **Audit Log Structure:**
    ```json
    {
      "tenant_id": "avatar-andres-cantor",
      "event_type": "TWIN_INTERACTION",
      "provider": "tavus-video",
      "units_consumed": 45,
      "unit_type": "seconds",
      "cost_currency": "USD",
      "cost_amount": 0.045,
      "limit_check_id": "req_12345" // Traceability to the permission check
    }
    ```

---

## 5. Guardrails against Drift

1.  **No Direct Vendor Calls:** All external calls MUST go through the `Orchestrator` wrapper which enforces limits. Direct calls from frontend are BANNED.
2.  **Secret Isolation:** Keys for SportRadar or Tavus live in `tenant_secrets` (encrypted), NEVER in code or environment variables shared globally.
3.  **Fail-Safe defaults:** If Billing Service is unreachable, the Twin defaults to **OFFLINE** (Safety First), not Free.

---

## 6. Verification & Evidence Checklist

To efficiently prove this implementation works without testing in production:

| Check ID | Requirement | Evidence Method |
| :--- | :--- | :--- |
| **EVIDENCE-01** | **Hard Limit Enforcement** | **Unit Test:** Mock Billing Service to return `quota_exceeded`. Verify Orchestrator returns `402 Payment Required` without calling Video Provider. |
| **EVIDENCE-02** | **Throttling under Burst** | **Load Test:** Simulate 100 concurrent requests when limit is 50. Verify 50 succeed and 50 are queued/rejected. |
| **EVIDENCE-03** | **Tenant Isolation** | **Integration Test:** Verify User A cannot activate User B's avatar even with valid JWT. |
| **EVIDENCE-04** | **Audit Traceability** | **DB Query:** Perform 1 interaction. Query `audit_logs` table. Verify strict match of cost/seconds. |
| **EVIDENCE-05** | **Adapter Swappability** | **Code Review:** Verify strictly typed Interfaces. Swap MockProvider for RealProvider via config injection. |

---

**Signed:**
*   **Architect:** VibeThink Governance AI
*   **Date:** 2026-01-10
