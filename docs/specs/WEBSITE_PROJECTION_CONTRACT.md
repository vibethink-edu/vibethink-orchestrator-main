# CONTRACT: Website Projection (ViTo → Payload → Frontend)

**Status:** STASH (Architecture Contract)
**Audience:** Frontend Developers, Platform Architects
**Date:** 2025-12-31

---

## 1. The Core Principle
The Frontend Application (Next.js/Remix) is a **Projection** of ViTo's Memory.
It **NEVER** defines business logic. It **NEVER** stores the "Source of Truth" for an Order, a User, or a Campaign.

**Data Flow:**
`ViTo Memory` (Truth) → `Payload CMS` (Adapter/Cache) → `Frontend` (UX)

---

## 2. The Role of Payload (The Adapter)
Payload CMS is NOT the "Creator". It is the **Buffer**.
1.  **Read-Model:** It holds a "published" version of the content optimized for the web.
2.  **Gating:** It ensures that if ViTo says "Campaign Ended", the API response for that Campaign returns 404 or "Ended" status, regardless of what the static JSON says.
3.  **Preview:** It allows humans to see the "Projection" before it goes live.

---

## 3. Minimal Content Types (Conceptual)

### `GlobalConfig`
-   `branding`: Colors, Logo, Fonts (From ViTo DNA).
-   `navigation`: Header/Footer links.
-   `seo`: Default meta tags.

### `CampaignPage` (The Landing)
-   `slug`: URL identifier (e.g., `/workshops/summer-2025`).
-   `source_campaign_id`: Link to ViTo Entity (Immutable).
-   `status`: `DRAFT` | `ACTIVE` | `ARCHIVED` (Controlled by ViTo).
-   `blocks`: Array of UI components (Hero, Features, Form).
    -   *Constraint:* Frontend devs define the Blocks. ViTo populates the *Content* of the blocks.

### `Artifact` (Blog/News)
-   `title`, `slug`, `content` (Rich Text).
-   *Constraint:* Authorship and Approval happen in ViTo.

---

## 4. Conceptual Endpoints (What Frontend Consumes)

-   `GET /api/globals`: Returns branding, nav, SEO.
-   `GET /api/pages/[slug]`: Returns page layout/content.
    -   *Logic:* If tied to a Campaign, checks `Campaign.status`. If `ENDED`, returns "Campaign Over" fallback.
-   `POST /api/enrollment`:
    -   *Input:* `{ campaign_id, user_data, source: 'web' }`
    -   *Action:* Passthrough to ViTo `IngestEvent`.

---

## 5. HARD INVARIANTS (Do Not Break)
1.  **No "Page Builder" Logic:** The Frontend cannot create new routes that ViTo doesn't authorize.
2.  **No "Hidden" Campaigns:** You cannot publish a page for a Campaign ID that does not exist in ViTo.
3.  **Identity preservation:** If a user logs in or provides email, that identity MUST be passed to the `Enrollment` event. No generic "Guest" events if we know who they are.

---

## 6. What breaks this model? (Red Flags)
-   Storing "Orders" in the Payload Database. (Orders belong in ViTo).
-   Hardcoding specific campaign logic ("If date is xmas...") in the React component. (Logic belongs in ViTo/Campaign).
-   Creating pages in Payload that have no conceptual owner in ViTo.
