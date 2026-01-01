# PATTERN: Corporate Website with Campaign-Enabled Landing Pages

**Status:** STASH (Pattern)
**Type:** Business Pattern
**Domain:** Corporate Communications / Marketing
**Date:** 2025-12-31

---

## 1. Problem Statement & Context
Many organizations (NGOs, SMBs, Restaurants) need a "Corporate Website" for permanent identity (Who we are) and dynamic "Campaigns" for growth (What we are doing now). They struggle with:
1.  **Disconnection:** The website is a "brochure" disconnected from the CRM/Operations.
2.  **Friction:** Launching a simple landing page requires a developer or a disconnected tool (Wix/Unbounce), creating data silos.
3.  **Identity Drift:** Campaigns often violate brand guidelines because "it was faster to build outside".

## 2. The Solution Pattern
**ViTo as the Orchestrator, Website as a Projection.**
The website is NOT a standalone product. It is a **Projection** of the Organization's Memory.
-   **Permanent Content:** (About Us, Contact) = Projected from `Company` entity.
-   **Dynamic Content:** (Landing Pages, Offers) = Projected from `Campaign` entities via a CMS Adapter.

### Anti-Goals (What this is NOT)
-   ❌ **Not a Website Builder:** We do not drag-and-drop pixels in ViTo. We define *Intent* and *Content*.
-   ❌ **Not a Generic CMS:** We do not manage arbitrary pages. We manage *Entities* (Campaigns, Events, Products) that *manifest* as pages.
-   ❌ **Not an Agency Model:** We do not build custom CSS per client request. We provide a robust *Shell* that adapts to the Client's DNA (Tokens/Theme).

---

## 3. Architecture Alignment (Memory → Reasoning → UX)

### Memory (The Truth)
-   **Campaigns:** Live in ViTo. Have start/end dates, goals, and approved artifacts.
-   **Identity:** The "Company DNA" (Colors, Tone, Values) lives in ViTo.
-   **Events:** "User Enrolled", "Form Submitted" are events on the Entity Graph.

### Reasoning (The Logic)
-   **Marketing Department:** Acts as the *Approver* and *Activator*. They do NOT design.
-   **AI Specialist:** Generates content variants aligned with DNA.
-   **CMS Adapter (Payload):** Protecting the invariant. It receives "Approved Content" and exposes it to the Frontend.

### UX (The Projection)
-   **The Website:** A "Dumb" Next.js application that fetches content from the CMS Adapter (Payload) or ViTo APIs directly.
-   **Lifecycle:**
    -   Campaign Active -> Landing Page Route is Live.
    -   Campaign Ended -> Landing Page Route 404s or Redirects.

---

## 4. Omnichannel by Event
**Principle:** "The Channel is the Pipe, the Event is the Truth."

Whether a user:
1.  Fills a form on the **Landing Page**...
2.  Chats with an AI Agent on **WhatsApp**...
3.  Speaks to a Voice Agent on the **Phone**...

They trigger the **SAME Canonical Event**: `Campaign.Enrollment`.
-   **Source:** Tagged by channel (`web`, `chat`, `voice`).
-   **Outcome:** Unified in Memory. No "Website Leads" vs "Phone Leads".

---

## 5. Risks & Early Warning Signals
-   **"Can I change the padding?"**: If users ask for pixel controls, we are sliding into "Website Builder" territory. **STOP.**
-   **"Just for this one page..."**: If we allow hardcoded HTML bypassing the Campaign/Artifact model, we break the "Event Truth". **STOP.**
-   **cms-is-truth**: If the CMS creates campaigns that ViTo doesn't know about, the architecture is broken. ViTo *pushes* to CMS; CMS does *not* create business logic.
