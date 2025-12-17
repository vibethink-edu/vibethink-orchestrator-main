# 🧠 Research: AI-First CRM (Meta-Schema)

**Source:** VozFood Agent (Phase 4)
**Context:** Orchestrator CRM Capability
**Goal:** Implement a flexible, "Attio-like" data structure for dynamic Agent memory.

---

## 1. The Philosophy: "No More Fixed Tables"
Traditional CRMs (`contacts`, `companies`) are too rigid for AI.
We need an **Object-Attribute-Record (OAR)** model. This allows the AI to "invent" new data types on the fly.

## 2. The Meta-Schema
Instead of 100 tables, we need 3 core tables in Postgres (using `JSONB`).

### A. Object Definitions ("The Blueprint")
*   **Table:** `crm_objects`
*   **Data:** `Supplier`, `VIP Guest`, `Emergency Contact`.
*   **Role:** Defines what "entities" exist in the system.

### B. Attribute Definitions ("The Shape")
*   **Table:** `crm_attributes`
*   **Data:** `delivery_days` (for Supplier), `allergies` (for Guest).
*   **Role:** Defines the fields for each object. Supports: `text`, `number`, `select`, `relation`.

### C. Records ("The Data")
*   **Table:** `crm_records`
*   **Data:** `{ "name": "Veggie Corp", "delivery_days": ["Mon", "Fri"] }`
*   **Role:** The actual data, stored in a pure `JSONB` column.

---

## 3. Why this fits the Orchestrator?
1.  **Multi-Tenant:** Each tenant can have custom Objects without database migrations.
2.  **AI Ingestion:** When an agent hears *"Deliver only on Fridays"*, it can look up the `delivery_days` attribute in the meta-schema and update the JSON.
3.  **UI Agnostic:** The Frontend renders a "Data Grid" based on the `crm_attributes` metadata, not hardcoded columns.

---

## 4. Next Steps for Implementation
1.  Define the `crm_` tables in Supabase (Orchestrator DB).
2.  Create a "Schema Manager" UI in the Admin Panel.
