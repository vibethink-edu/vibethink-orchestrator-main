# PATTERN: Dynamic Campaign-Driven Content & Omnichannel Enrollment

**Status:** PROPOSED
**Type:** Architectural Pattern
**Domain:** Marketing / Onboarding / Communication
**Date:** 2025-12-31
**Distinction:** Domain-Agnostic (Retail, Services, B2B)
**Related Analysis:** [`ANALYSIS_DYNAMIC_CAMPAIGN_RISKS.md`](./ANALYSIS_DYNAMIC_CAMPAIGN_RISKS.md)

---

## A) Normalization: The Abstract Pattern

### Problem Statement
Organizations need to proactively engage external actors (customers, leads, applicants) via temporal "Campaigns" without managing permanent technical infrastructure for each initiative. Marketing/Sales departments require autonomy to "spin up" and "tear down" engagement surfaces (landing pages, ads, offers) while maintaining a unified, rigorous record of the resulting interactions.

### What THIS Pattern IS
-   **Event-Driven Engagement**: Content exists only to trigger a canonical Event (Enrollment, Purchase, Booking).
-   **Ephemeral Projection**: The interaction surface (web, landing) is a temporary projection of a Campaign Entity.
-   **Omnichannel by Default**: The "Success Event" is identical regardless of the ingestion channel (Voice, Click, Chat).

### What THIS Pattern IS NOT
-   **NOT a Website Builder**: It does not care about pixels or layout composition as a primary goal.
-   **NOT a CMS**: It uses content management only as a mechanism to distribute the Campaign Payload.
-   **NOT a Siloed Funnel**: Data does not live in "The Landing Page Database"; it lives in the Entity Graph.

### Why AI-First?
-   **Zero-Friction Context**: AI generates/curates variations of the Campaign (text, image, tone) based on the Company DNA, removing the "web design" bottleneck.
-   **Unified Reasoning**: Specialists (Sales Agent, Support Bot) reason over the *Campaign Entity*, not the *Web Page*, allowing them to answer questions about the offer via voice/chat without scraping a URL.

---

## B) Mapping to ViTo Model

This pattern maps strictly to the 3-Layer Architecture (Memory, Reasoning, UX).

### 1. Memory Layer (The Truth)
-   **Entity**: `Campaign` (The initiative).
    -   *Attributes*: `goal`, `duration`, `target_audience`, `offer_logic`.
-   **Entity**: `Artifact` (The content assets).
    -   *Attributes*: `copy`, `media`, `dna_alignment_score`.
-   **Event**: `Campaign.Activated` / `Campaign.Deactivated`.

### 2. Reasoning Layer (The Logic)
-   **Department**: `Marketing` (Owner of the Campaign, NOT the Person).
-   **Specialist**: `CampaignManager` (Curates content, approves Artifacts).
-   **Specialist**: `EnrollmentAgent` (Handles verification of incoming leads).

### 3. UX Projection (The Surface)
-   **Projection**: `LandingPage` (A rendering of Artifacts via a CMS Adapter).
-   **Projection**: `VoiceAgentPrompt` (The script used by the AI voice agent for this campaign).

---

## C) Omnichannel Canon

**Principle:** Channels are "Ingestion Pipes", not "Data Silos".

### The Canonical Event: `Enrollment`
Whether a user clicks a button, says "Yes" on a call, or types "Sign me up", the **exact same event** is written to the Timeline.

```typescript
// Canonical Event Structure (Abstract)
interface CampaignEnrollmentEvent {
  type: "campaign.enrollment";
  actor_id: string; // The Lead/Person
  target_id: string; // The Campaign
  channel_source: "web_form" | "voice_agent" | "chat_bot" | "manual_entry";
  evidence_id: string; // Formatting depends on channel (recording, dom_event, chat_log)
  timestamp: string;
}
```

### Identity Resolution
-   **Single Source of Truth**: The `Person` entity.
-   **Matching**: The system resolves `email`, `phone`, or `voice_biometrics` to a single `Person` ID (or creates a new one).
-   **Anti-Duplication**: A person calling in after visiting the page is NOT a new lead; they are an existing Entity adding a new Event (`Call.Inbound`) to their Timeline.
-   **Risk Note**: See `ANALYSIS_DYNAMIC_CAMPAIGN_RISKS.md` for fragmentation risks.

---

## D) CMS as Adapter (Distance ≥ 2)

**Principle:** The CMS is a "Dumb Display". It owns **Presentation**, not **Definition**.

1.  **CMS is Downstream**: ViTo (Memory) pushes approved Artifacts to the CMS. The CMS does not "create" the campaign; it "displays" it.
2.  **CMS is Interchangeable**: Switching from Strapi to Contentful changes the *Projection Adapter*, not the *Campaign Entity* or *Enrollment Logic*.
3.  **Lifecycle Governance**:
    -   When `Campaign.status` -> `ACTIVE`: Adapter publishes content to CMS.
    -   When `Campaign.status` -> `ENDED`: Adapter unpublishes/archives content on CMS.
    -   *Governance check*: Validation that the CMS is not serving "Zombie Content" (active pages for dead campaigns).

---

## E) FIT & Governance Readiness

### Existing FITs (Partial Coverage)
-   `FIT-006` (Core + Domain Pack): Covers the definition of a "Campaign" concept within distinct domains (Hotel Offer vs Retail Sale).
-   `FIT-005` (Shell vs Content): Ensures the Campaign Management UI is separate from the Campaign Public Page.

### Future FITs (Current Gaps)
-   **[NEW] `FIT-OMNI-001` (Event Normalization Strategy)**: Verify that Voice, Chat, and Form inputs strictly map to the SAME event schema before touching Memory.
-   **[NEW] `FIT-CMS-001` (Projection Sync)**: Verify that CMS state reflects Memory state (e.g., if Campaign dies, Page dies).
-   **[NEW] `FIT-DNA-001` (Artifact Alignment)**: Verify that generated content passes a "Company DNA" similarity check before publication.

---

## F) Status of Pattern

**Verdict:** **PROPOSED** (Stash)

### Path to Canon (`ACTIVE`)
To elevate this pattern to Canon, we require:
1.  **Schema Definition**: SQL/TypeScript definition of the `Campaign` and `Enrollment` entities (Memory Layer).
2.  **Adapter Interface**: A defined TypeScript interface for `ICmsAdapter` (Reasoning/IO Layer).
3.  **FIT Implementation**: Stubbing and eventual implementation of `FIT-OMNI-001`.
4.  **Prototype**: A "Steel Thread" implementation (e.g., creating a Campaign in ViTo that spawns a mock page and accepts a mock voice enrollment).
