# USE CASE: Ovitality (NGO Website & Directory)

**Status:** STASH (Reference Implementation)
**Pattern:** Corporate Website with Campaign-Enabled Landing Pages
**Vertical:** NGO / Directory / Community
**Date:** 2025-12-31

---

## 1. Context
**Ovitality** is an NGO that requires:
1.  **Corporate Presence:** "Who we are", "Mission", "Donate".
2.  **Directory:** A searchable list of Professionals/Services.
3.  **Active Agenda:** Workshops, Talks, Events (Campaigns).

## 2. Entity Mapping (Memory Layer)

| Concept | ViTo Entity | Notes |
| :--- | :--- | :--- |
| **The NGO** | `Company` | Source of branding, mission text, legal info. |
| **Directory** | `Specialist` / `Partner` | External professionals listed. NOT generic CMS pages. |
| **Workshops** | `Campaign` | Temporal events with registration. |
| **Donation** | `Product` | Fixed or variable items to "buy". |
| **Blog/News** | `Artifact` | Content generated/curated by Marketing Specialist. |

## 3. Administration (ViTo vs CMS)

### ✅ Managed in ViTo (The Brain)
-   **Campaigns:** Creating a new Workshop ("Mindfulness 101").
-   **Approvals:** Reviewing the copy for the Workshop page.
-   **Directory Data:** Vetting and approving a new Professional.
-   **Leads/Attendees:** Viewing who signed up.

### ❌ Managed in CMS (The Adapter)
-   **Menu Structure:** (Maybe) organizing the nav links.
-   **Rich Text Tweaks:** Fixing a typo in the "About Us" page (if allowed by governance).
-   **Media Library:** Storing the actual JPGs/PNGs (managed assets).

### ❌ NOT Managed (The Code)
-   **Layouts:** The Next.js theme handles the "Grid vs List" view.
-   **Colors:** Defined in `Company.DNA`, processed into CSS Variables.

## 4. Why this is a Perfect Reference
Ovitality proves the **"Hybrid"** model:
-   **Permanent Data (Directory):** Needs structure, search, filters. (Perfect for ViTo Entities).
-   **Temporal Data (Workshops):** Needs landing pages, enrollment, urgency. (Perfect for Campaigns).
-   **Transaction (Donation):** Needs secure checkout event. (Perfect for Event Graph).

If we build Ovitality as a "ViTo Projection", we prove that ViTo can handle **Content + Commerce + Community** without becoming WordPress.
