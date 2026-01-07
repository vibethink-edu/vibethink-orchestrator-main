# ViTo Core Architecture — Canonical Principles

**STATUS:** 🟢 DRAFT (Pending Canonical Seal)  
**VERSION:** 1.0.0  
**AUTHOR:** VibeThink Architecture Team  
**DATE:** 2026-01-06

---

## 🏛️ Executive Summary

ViTo (VibeThink Orchestrator) is an AI-first orchestration platform designed for extreme scalability, flexibility, and operational precision. The architecture is built upon four foundational pillars that ensure the system can serve any industry, in any region, and for any organization without structural modifications.

---

## 💎 The Four Pillars

### 1. Multi-Entity (Hierarchical Orchestration)
ViTo is natively designed to manage complex organizational structures. It is not limited to a single tenant; it orchestrates multiple entities with a unified core.

- **Unified Identity**: Entities (Companies, Providers, Departments) are first-class citizens in the Entity Graph.
- **Hierarchical Configuration**: Policies and settings flow through a deterministic inheritance chain:
  `System Default → Company/Tenant → Workspace/Department → User Preference`.
- **Resource Ownership**: Every resource in the system is explicitly anchored to an owner entity, ensuring strict isolation and multi-tenant security.

### 2. Multi-Jurisdiction (Regional Compliance)
The platform operates globally while respecting local constraints. Complexity is handled at the infrastructure level, keeping business logic clean.

- **Regional Configuration System**: Native support for locales, currencies, number formats, and legal standards.
- **Timezone Safety**: "No-Timezone-Wars" policy. Distinguishes between **Civil Dates** (calendar-based, e.g., Hotel stays) and **Instants** (physical time points, e.g., Studio sessions).
- **Venue-Anchored Truth**: The source of truth for time and currency is the **Resource's Location**, not the user's location.

### 3. Context-First (Dynamic Decisioning)
Intelligence in ViTo is driven by context, not just by static code. Every interaction and decision is evaluated within a rich contextual frame.

- **ProductContext**: High-level business vertical (e.g., `hotel`, `studio`, `restaurant`) that drives terminology and behavior.
- **ResourceContext**: Granular metadata about the resource being orchestrated (e.g., source system, location, specific rules).
- **Zero-Drift Synchronicity**: Total consistency between UI strings and AI System Prompts via a 3-layer i18n/Terminology engine.

### 4. Domain-Agnostic (Core + Domain Packs)
ViTo is not a vertical product (like a specific PMS or CRM). It is a generic engine specialized via Domain Packs.

- **Platform Core**: Agnostic capabilities (Timeline, Permissions, Workspaces, Specialist Orchestration).
- **Domain Packs**: Vertical-specific configurations (Vocabulary, Industry Rules, Entity Schemas, Custom Workflows).
- **Strict Separation**: The Core never hardcodes domain logic. All specialization is injected via configuration and Metadata JSONB.

---

## 📐 Structural Proposal (`docs/arch/`)

To maintain the purity of these principles, we propose the following structure:

```text
docs/arch/
├── README.md                 # Index and Navigation of the Core Architecture
├── CORE_VITO_ARCHITECTURE.md # This canonical document
├── PILAR_I_MULTI_ENTITY.md   # Deep dive into identity and hierarchy
├── PILAR_II_REGIONAL.md      # Deep dive into timezone and regional laws
├── PILAR_III_CONTEXT.md      # Deep dive into Product/Resource contexts
└── PILAR_IV_DOMAIN_PACKS.md  # Deep dive into the extension model
```

---

## 🚀 Architectural Invariants (Non-Negotiables)

1. **AI-First Integration**: All data structures must be unambiguous and consumable by both Humans and AI Agents without drift.
2. **Persistence Plane Separation**: Logic must be decoupled from the underlying storage, using normalized adapters for external data.
3. **Traceability by Design**: Every decision, especially if AI-driven, must be logged with its full contextual snapshot (Traceability).

---

> [!NOTE]
> This document remains in DRAFT state until the formal "Canonical Seal" is applied by the Architecture Committee.
