# Strategy Alignment: ViTo Core + Digital Twin Vertical

> **Purpose:** Executive Alignment & Agent Instruction Guide
> **Audience:** Human Stakeholders, OpenAI o1, Claude 3.5 Sonnet
> **Context:** Reusing Clinical Infrastructure for Digital Twins

---

## 1. The Core Thesis: "It's the Same Engine"

We have successfully modeled a system for **Clinical Document Scanning** (FIT-CLINICAL).
We are now building a system for **Digital Twin Interaction** (FIT-DIGITAL-TWIN).

**Technically, they are identical:**

| Concept | Clinical FIT | Digital Twin FIT | ViTo Core Component (Shared) |
| :--- | :--- | :--- | :--- |
| **The "Unit"** | 1 Clinic / Doctor | 1 Celebrity / Twin | `TenantEntity` |
| **The "Action"** | Scan Prescription (OCR) | Generate Video (Streaming) | `MeteredAction` |
| **The "Resource"** | Document Storage + LLM | Video/Voice API + RAG | `ExternalProvider` |
| **The "Cost"** | Cost per page / scan | Cost per minute / token | `BillingMeter` |
| **The "Limit"** | Max 100 scans/day | Max 60 mins/day | `RateLimiter` |
| **The "Secret"** | Azure Form Recognizer Key | Tavus/Cartesia Key | `SecretVault` |

**Strategic Directive:**
Do not build "Twin Billing". Use "ViTo Billing".
Do not build "Twin Auth". Use "ViTo Auth".

---

## 2. The Implementation Profile

### The "Twin Orchestrator" (The Brain)
We will use **LiveKit Agents** framework (Python or Node) as the runtime environment.

*   **Role:** It listens to the user. It decides "What to say". It calls the Voice/Video APIs.
*   **Guardrail:** Before processing a frame, it checks ViTo Core: *"Does Andrés have credit?"*

### The "Knowledge Feed" (RAG)
Just as a Doctor needs access to specific patient history, a Twin needs access to specific real-time feeds.

*   **Andrés Cantor** -> Needs `SportRadar API` access.
*   **Mechanism:** We inject these API keys via the **Tenant Secret Vault**. The Agent reads them at runtime securely.

---

## 3. Technology Stack Choice

*   **Real-Time Transport:** **LiveKit** (Best in class for latency).
*   **Orchestration Logic:** **Python** (Superior for RAG, Data Processing, and LiveKit Agents SDK).
*   **Frontend Check:** **Next.js** (Standard ViTo Dashboard).

---

## 4. Instructions for AI Agents (OpenSpec)

When generating the OpenSpec for this module:

1.  **Reference `FIT-DIGITAL-TWIN-PLATFORM-001.md`** as the absolute source of truth.
2.  **Import `ViTo Core` interfaces** for billing/tenancy. Do not define new ones.
3.  **Focus strictly on the ADAPTER layer.** The work is in connecting LiveKit/Cartesia to our existing billing system.
4.  **Enforce the "Pre-Flight Check"** pattern in every sequence diagram.

---

**Status:** ALIGNED AND APPROVED
**Next Step:** Architectural OpenSpec generation.
