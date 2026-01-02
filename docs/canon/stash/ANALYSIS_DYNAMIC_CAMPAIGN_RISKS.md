# CRITICAL ANALYSIS: Dynamic Campaign & Omnichannel Enrollment

**Status:** ANALYSIS (Critical Co-Architect View)
**Subject:** `PATTERN_DYNAMIC_CAMPAIGN_OMNICHANNEL.md`
**Date:** 2025-12-31

---

## ⚠️ Executive Summary of Tensions

This pattern proposes a high-value capability (Omnichannel Campaigns) but introduces significant architectural tension between **Memory Truth** and **Channel Reality**.

**Core Tension:**
Marketing demands "Speed of Light" (Projection) while Architecture demands "Immutable Truth" (Memory).
If we optimize purely for Marketing speed (coupled CMS), we break the Entity Graph.
If we optimize purely for Architecture (strict Memory first), we kill Marketing velocity.

**Verdict:** The pattern is viable **IF AND ONLY IF** the "CMS as Adapter" principle is strictly enforced via specific FITs.

---

## A) Pattern Normalization Risks

### 1. The "Website Builder" Trap
**Risk:** By allowing "Dynamic Content" driven by Campaigns, we risk reinventing a Website Builder inside ViTo.
**Tension:** Marketing wants visual control (`layout_id`, `color_scheme`). ViTo stores *Semantic Data*.
**Hard Rule:** ViTo stores **Artifacts** (Copy, Image Assets, Offer Logic), NOT **Layouts**. The Layout is determined by the `ProjectionLayer` (The Landing Page App) based on the Artifact's attributes.
**Trade-off:** Marketing loses "pixel-perfect drag-and-drop" inside ViTo, but gains "instant omnichannel consistency".

### 2. The "Campaign as Database" Fallacy
**Risk:** Treating the Campaign entity as the container for Leads.
**Correction:** A Campaign is a **Lens**, not a container.
- Leads are `Person` entities.
- Enrollments are `Events` on the Person's timeline.
- The Campaign is merely the `target_id` of the Event.

---

## B) Mapping Tensions (ViTo Model)

### 1. Departmental Overreach
**Risk:** Marketing Department "owning" the `Person` entity because they found the lead.
**Critical Invariant:** `Person` entities are **Global**. Marketing owns the *Campaign* and the *Artifacts*. They do NOT own the *Person*.
**Trade-off:** Access Control (RLS) must be granular. Marketing can see "Leads they generated", but Sales might "own" the negotiation.

### 2. Memory Latency
**Risk:** Real-time personalizaton (e.g., a Landing Page greeting a user by name from a previous session) requires <50ms read access to the Entity Graph.
**Trade-off:** ViTo's primary SQL storage might be too slow for high-traffic edge rendering.
**Architecture Requirement:** We may need a "Hot Edge Memory" (Redis/KV) projection for active Campaigns, separate from the "Deep Storage" (Postgres).

---

## C) Omnichannel Canonical Risks

### 1. Identity Resolution Collision
**Scenario:** User clicks an ad (Anonymous Cookie), then calls (Phone Number), then Chats (Session ID).
**Risk:** Creating 3 separate `Person` entities.
**Mitigation:** The "Identity Reconciler" Service.
**Trade-off:** Aggressive reconciliation risks merging two different people (False Positive). Conservative reconciliation yields fragmented history (False Negative).
**Decision:** Err on the side of **Fragmented History** (False Negative) and provide "Merge Tools" for Specialists, rather than corrupting identities automatically.

### 2. The "Channel Truth" Paradox
**Problem:** A user says "I accept" on the phone. The Voice Agent hears it. The Database records it.
**Tension:** Who is the Source of Truth? The Audio Recording? The Transcript? or the `Campaign.Enrollment` event?
**Canon:** The **Event** is the Source of Truth for *Business Logic*. The **Evidence** (Audio/Transcript) is attached for *Audit*.

---

## D) CMS Adapter: The "Projection" Contract

### 1. The "Distance ≥ 1" Rule
**Invariants:**
- ViTo **NEVER** reads directly from the CMS Database.
- ViTo **NEVER** relies on CMS IDs as Primary Keys.
- The CMS is a **Sink** (Write-Only from ViTo's perspective) or a **Dumb Pipe** (Read-Only for the Frontend).

### 2. Lifecycle Governance Risk
**Scenario:** Campaign Ends in ViTo. CMS Page stays up.
**Risk:** User enrolls in dead campaign.
**Mitigation:** `FIT-CMS-001`. The Adapter MUST implement a `teardown()` hook.
**Trade-off:** If the teardown fails, we need a "Dead Man's Switch" in the Landing Page (checks Campaign Status on load).

---

## E) Systemic Readiness & Gaps

| Gap | Risk Level | Description |
| :--- | :--- | :--- |
| **Identity Reconciliation** | 🔴 HIGH | We lack a probabilistic matching engine for Email/Phone/Cookie. |
| **Edge Projection** | 🟠 MED | We lack a pattern for pushing Campaign Data to Edge (Vercel KV / Cloudflare). |
| **Audio Ingestion** | 🔴 HIGH | We lack the pipeline to turn "Voice Stream" into "Structured Event" reliably. |

---

## F) Final Recommendation

**Proceed with Caution.**
The pattern is architecturally sound but **operationally expensive**.
Do NOT build the "Omnichannel Identity" engine from scratch in Phase 1.
**Start with explicit, deterministic channels** (Web Form with active email, Logged-in Chat) before attempting "Anonymous to Known" reconciliation.
