# 🧠 Research: The "Mock-to-Code" Protocol (n8n -> AGNO)

**Source:** VozFood Agent (Phase 4)
**Context:** Orchestrator Agent Lifecycle
**Goal:** Define the transition from Visual Prototyping (n8n) to High-Performance Code (AGNO).

---

## 1. The VibeThink Methodology
We admit that **Coding from scratch is slow**, but **Visual tools hit a ceiling**.
Therefore, we accept **Visual Prototyping** as Phase 1.

| Phase | Tool | Goal | Pros | Cons |
|-------|------|------|------|------|
| **1. Prototyping** | **n8n** | Validate Logic & UX | Fast, Visual, No Setup | Hard to version, Slow execution, "Spaghetti" |
| **2. Production** | **AGNO (Phidata)** | Performance & Scale | Git-native, Fast (Python), Type-safe | Higher barrier to entry |

---

## 2. The Migration Trigger
**When do we move to AGNO?**
1.  **Complexity:** When n8n has > 20 nodes or nested loops.
2.  **Latency:** When webhook response > 2s (Voice requires < 800ms).
3.  **Logic:** When we need complex algorithms (e.g., Recommendation Engine).

---

## 3. Mapping Concepts
How to translate n8n concepts to AGNO Framework:

*   **n8n Webhook** -> **AGNO API Route (FastAPI)**.
*   **n8n Switch Node** -> **Python `if/else` or Router Agent**.
*   **n8n HTTP Request** -> **AGNO `Tools` (Function calling)**.
*   **n8n Postgres Node** -> **AGNO Knowledge Base (SQLAlchemy/PgVector)**.

---

## 4. The Orchestrator's Role
Even when running AGNO, the Orchestrator (Next.js) likely still talks to it via REST API.
The Agent becomes a **Microservice** (Docker Container) running AGNO, instead of a Workflow running on an n8n instance.

> **Key Rule:** n8n flows in the Orchestrator repository should be labeled `[MOCK]` or `[PROTOTYPE]` once the AGNO migration begins.
