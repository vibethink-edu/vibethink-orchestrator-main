# 🧠 Research: Omnichannel Architecture (Unified Context)

**Source:** VozFood Agent (Phase 2)
**Context:** Orchestrator Communication Layer
**Goal:** A user can start on WhatsApp, switch to Voice, and finish on Web without losing context.

---

## 1. The Core Problem: "Amnesia"
*   **Siloed:** WhatsApp bot knows "I want Pizza". Voice bot picks up and asks "What do you want?".
*   **Unified:** Voice bot greets: *"Hi Marcelo, calling about the Pizza you mentioned on WhatsApp?"*

## 2. The Solution: Context ID & Central Memory
We use **Supabase** (or Redis) as the state store, keyed by `user_phone` or `session_id`.

### The Flow
1.  **WhatsApp (Text):** User types "Menu?".
    *   Agent creates `session_123`.
    *   Stores: `last_intent: browse_menu`.
2.  **Trigger Call:** User requesting a callback.
3.  **Voice (Audio):**
    *   Agent queries `session_123`.
    *   System Prompt Injection: `Context: User just looked at menu.`.

---

## 3. Implementation Channels

### A. WhatsApp (Text/Audio)
*   **Provider:** Kwaati / Meta Cloud API.
*   **Role:** Async communication, Menu browsing, Receipts.
*   **Tech:** n8n Webhook -> `POST /whatsapp`.

### B. Voice (Telephony)
*   **Provider:** Retell AI / Vapi.
*   **Role:** High-bandwidth negotiation (Complex orders, complaints).
*   **Tech:** SIP Trunking / WebRTC.

### C. Web (Chat/UI)
*   **Provider:** VibeThink Chat Widget (Orchestrator).
*   **Role:** Visual confirmation.

---

## 4. The "Unified Thread" UI
In the Orchestrator Admin Dashboard, the agent sees a **Single Timeline**:
*   `[10:00 AM] [WA] User: Hi`
*   `[10:01 AM] [APP] System: Sent Menu PDF`
*   `[10:05 AM] [VOICE] Call Duration: 45s (Transcript: ...)`

**Key Takeaway:** Channels are just different UI for the *same* conversation thread.
