# COMMERCE ADAPTER EVALUATION: Payload vs MedusaJS

**Context:** ViTo (AI-first, Memory → Reasoning → UX).
**Paradigm:** Adapter-first, Event-first, Spec-driven.
**Objective:** Define auditable keys to decide between Payload (Low Complexity) and MedusaJS (High Complexity/Scale) while maintaining Architectural Canon.

---

## 1. Roles & Definition of Truth

To avoid "CMS Coupling" (Inversion of Control), we strict define roles.

| Component | Role | Responsibility | Source of Truth? |
| :--- | :--- | :--- | :--- |
| **ViTo Brain** | **Orchestrator** | Memory (Graph), Policy, Reasoning, Event Distribution. | **YES (Business Truth)** |
| **Commerce Engine** | **Transaction Processor** | Cart, Checkout, Payments, Taxes, Stock reservations. | **YES (Operational Truth)** |
| **Payload CMS** | **Editorial Projection** | Product descriptions, Images, Marketing copy, Layouts. | **NO (Projection)** |
| **Storefront** | **View Layer** | Rendering state from Brain/Engine. Ephemeral. | **NO** |

**Crucial Distinction:**
- `Price` & `Inventory` belong to **Commerce Engine**.
- `Marketing Description` & `Hero Image` belong to **CMS**.
- ViTo syncs them via `Canonical Events`.

---

## 2. Decision Model: The Complexity Gates

We default to **Payload (Concept Phase)**, but enforce strict gates to upgrade to **Medusa (Production/Scale Phase)**.

### Option A: Payload as "Good Enough" Commerce (Incipient)
*Scenario:* Selling simple digital items, limited SKUs, or low volume where "Engine" overhead is unjustified.
*Implementation:* Payload Collections (`Orders`, `Carts`) with custom hooks, OR `payload-plugin-ecommerce` (deprecated/maintained fork).

**Gate Checklist: Payload Readiness**
| Requirement | Status | Control/Test |
| :--- | :--- | :--- |
| **Eventability** | **FAIL/WARN** | Does Payload emit `order.created` reliably aside from simple hooks? Needs `afterChange` hook -> Message Queue adapter immediately. |
| **Idempotency** | **FAIL** | Native hooks are not inherently idempotent. Needs custom middleware to prevent double-charging on webhook retries. |
| **Transactional Integrity** | **PASS_WITH_LIMITATIONS** | DB transactions (Postgres) support atomic updates, but logic is manual. |
| **Separation** | **FAIL** | High risk of mixing "Order Status" (Engine) with "Content" (CMS). Requires steep discipline. |

**Verdict:** Use Payload ONLY if Transaction Volume < X/day AND logic is trivial (e.g., "sell one PDF"). **MUST** implement a rigid "Adapter Layer" inside Payload to mock a real Engine API.

### Option B: MedusaJS as Commerce Engine (Standard)
*Scenario:* Physical goods, complex shipping, taxes, returns, or high reliability requirement.
*Implementation:* Medusa Backend + ViTo Adapter.

**Gate Checklist: Medusa Readiness**
| Requirement | Status | Control/Test |
| :--- | :--- | :--- |
| **Eventability** | **PASS** | Native Event Bus (Redis/Local). Easy to sub to `order.placed` and forward to ViTo. |
| **Idempotency** | **PASS** | Built-in idempotency keys for payments/carts. |
| **Audit Trail** | **PASS** | Dedicated tables/services for order flows. |
| **Completeness** | **PASS** | Handles Tax/Shipping/Inv logic out of box (prevents re-inventing wheel). |
| **Separation** | **PASS** | Enforces "Product" (Engine) vs "Product Content" (CMS reference). |

**Verdict:** The default for any serious "Commerce" capability. The overhead of deploying Node+Postgres+Redis is worth the isolation safety.

---

## 3. The Conceptual Contract (Events & References)

Regardless of the engine (Payload vs Medusa), ViTo speaks only **Canonical Events**.

### Minimal Canonical Events List (Inbound to ViTo)
These must be emitted by the Commerce Adapter (which listens to the Engine).

1.  `commerce.product.created` / `updated`
    *   *Payload:* `{ id: "prod_123", sku: "ABC", price: 100 }`
    *   *ViTo Action:* Create/Update Entity Node. Trigger "Enrich Product" specialist.
2.  `commerce.cart.created` / `updated`
    *   *Payload:* `{ id: "cart_xyz", items: [...] }`
    *   *ViTo Action:* Update "Session Context".
3.  `commerce.order.placed`
    *   *Payload:* `{ id: "ord_999", customer_id: "usr_1", total: 1000 }`
    *   *ViTo Action:* Record "Purchase" Event. Trigger "Post-Purchase" Campaign.
4.  `commerce.fulfillment.shipped`
    *   *Payload:* `{ id: "ful_555", tracking: "..." }`
    *   *ViTo Action:* Notify User (Channel Agnostic).

### Stable References (Invariants)
*   **Commerce ID (`c_id`)**: The ID in the Engine (Medusa `prod_...`).
*   **CMS ID (`cms_id`)**: The ID in Payload.
*   **ViTo Entity ID**: The Graph Node ID.
*   *Rule:* ViTo maps `c_id` specific product nodes. CMS holds `c_id` as a read-only field for linking.

---

## 4. Invariants & Anti-Patterns ("The Red Flags")

1.  **NEVER** manage Inventory in the CMS.
    *   *Why:* Race conditions. CMS is eventual consistency (ISR/Cache). Inventory requires ACID.
2.  **NEVER** calculate Prices in the Frontend/Client.
    *   *Why:* Security. Trust only the Engine.
3.  **NEVER** tightly couple ViTo Specialists to Medusa/Payload SDKs.
    *   *Why:* Vendor lock-in. Use the Adapter pattern.
4.  **NEVER** use CMS "Rich Text" to store structural data (e.g., JSON in a description field).

---

## 5. Risks & Signals

*   **Risk:** "Double Master". Marketing changes product title in Medusa, then changes it in Payload. Which wins?
    *   *Mitigation:* Unidirectional Sync. Engine (Tech specs) -> ViTo -> Payload (Draft). Marketing only edits Payload. Engine specs are read-only in Payload.
*   **Signal:** Dev team writing custom "Stock Check" logic in a Next.js API route.
    *   *Action:* STOP. Move to Commerce Engine logic.

---

## 6. Open Questions (To Resolve in Spec)

1.  **Sync Direction:** Does ViTo push products to Medusa, or does Medusa push products to ViTo? (Likely: Medusa = Operational Creator -> ViTo -> CMS).
2.  **Auth token sharing:** How to share `customer_id` between ViTo Auth and Medusa Auth without duplication? (Multipass or Federated).
3.  **Cart Persistence:** Does ViTo Memory store every "Add to Cart" event interaction, or only the final Checkout composition? (Noise vs Signal).
