# 🧠 Research: Headless CMS Strategy (SSOT)

**Source:** VozFood Agent (Phase 5)
**Context:** Content Management across Satellite Agents.
**Goal:** Centralize content (Menus, Events, Policies) to feed Web, Mobile, and AI Agents simultaneously.

---

## 1. The Problem: "Brain Split"
*   **Scenario:** A restaurant updates their menu on the Website.
*   **Issue:** The Voice Agent (running on n8n) doesn't know. It still sells the old menu.
*   **Root Cause:** The Website DB and the Agent DB are separated.

## 2. The Solution: Single Source of Truth (SSOT)
We use the **Orchestrator's Payload CMS** as the master database.

### The Flow:
1.  **Input:** User updates "Price of Burger" in Admin Panel (Payload).
2.  **Web:** `repo-website` triggers rebuild (ISR) or fetches fresh JSON.
3.  **Agent:** `repo-voice-agent` receives a webhook (`menu.updated`) and refreshes its Vector Store (RAG).

---

## 3. Content Architecture (Payload Collections)
Instead of dedicated tables, we define Global Collections:

*   `Menus` (Nested Categories/Items).
*   `Locations` (Hours, Phones).
*   `Events` (Time-sensitive context).
*   `Policies` (FAQ for the AI).

## 4. Integration Pattern
*   **Push (Webhook):** Payload -> n8n -> Agent Vector DB.
*   **Pull (API):** Agent (Tool Call) -> `GET /api/menus?active=true`.

---

## 5. Migration Note
VozFood originally researched **Strapi**.
For the **Orchestrator**, we adapt this to **Payload CMS** (Native Next.js/Typescript integration) to maintain the Monorepo DNA.
