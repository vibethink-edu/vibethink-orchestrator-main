# SPEC-001: Restaurant Vertical Omnichannel POC

**Status:** DRAFT
**Owner:** Co-Architect AI
**Date:** 2025-12-31

---

## 1. Context
We need to validate the **"Dynamic Campaign-Driven Content"** pattern (Pattern Stash) using a real vertical.
The user selected **"Restaurant / Simple Business"** (e.g., La Petit).
**Key Driver:** The website should not be a separate "dev project"; it must be a **Projection** managed directly from ViTo, leveraging the same tech stack (Next.js/React).

## 2. Decision
Implement a **"Closed Loop" Proof of Concept** for a Restaurant:
1.  **Memory:** Define a `Campaign` entity in ViTo (e.g., "Valentine's Dinner").
2.  **Projection:** A simple, hard-coded Next.js route (`/restaurants/la-petit`) that reads the Active Campaign from ViTo Memory.
3.  **Ingestion:** A simple "Book Now" form on that page that sends a `Campaign.Enrollment` event back to ViTo.

**Architecture:** "ViTo as Backend-for-Frontend" for the Restaurant Site.
**No Separated CMS**: For this POC, ViTo *is* the CMS adapter.

## 3. Invariants
1.  **Memory First:** The Website NEVER has hardcoded "Valentine's" text. It MUST query `Campaign.active.artifact`.
2.  **Canonical Event:** The booking MUST be recorded as `campaign.enrollment` in the Entity Graph, not just an email.
3.  **Identity:** If the user email exists, append to their Timeline.

## 4. Scope
### IN
-   Mock "Memory" Service (JSON based for speed).
-   One "Projection" Page (The Restaurant Landing).
-   One "Campaign" (Title, Offer, Image).
-   One "Ingestion" Action (Submit Booking).

### OUT
-   Real Database Schema (Use Mock Service first).
-   Voice Agent Integration (Next phase).
-   Payment Processing.
-   Complex "CMS" UI (Use JSON editing for now).

## 5. Impacted Artifacts
-   `apps/dashboard/app/api/mock-memory/route.ts` (New Mock Service)
-   `apps/dashboard/app/restaurants/[slug]/page.tsx` (The Projection)
-   `packages/utils/src/events/taxonomy.ts` (Event Definition)

## 6. FITs (Functional Integration Tests)
-   [ ] FIT-005: Shell vs Content (Restaurant page must not leak admin shell).
-   [ ] FIT-OMNI-001: Event must be normalized.

## 7. Evidence / Verification
-   **Step 1:** Create Campaign in JSON.
-   **Step 2:** Visit Page -> Sees Campaign.
-   **Step 3:** Submit Form -> JSON Event Log updated.

## 8. Risks
-   **Routing Collision:** Ensure `/restaurants/*` does not conflict with Dashboard routes.
-   **Mock Debt:** Must replace JSON Mock with Real DB later.
