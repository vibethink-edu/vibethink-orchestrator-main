# Canon Index — ViTo Architectural Truth

**Version**: 1.0.0  
**Date**: 2025-12-31  
**Status**: FOUNDATIONAL  
**Authority**: Principal Product Architect

---

## 🎯 What is Canon?

**Canon** = Irrefutable architectural truth for VibeThink Orchestrator (ViTo).

Canon documents define:
- **What ViTo IS** (foundational architecture, not features)
- **What is allowed to claim** (with FIT gates validation)
- **What is prohibited to claim** (until gates pass)
- **Invariants** (rules that never change)

---

## 📐 Canon Principles

### 1. No Claim Without Evidence
- Every architectural assertion MUST reference code (file + line) or FIT gate
- "Planned" features are documented as SPEC, never as "EXISTS"

### 2. AS-IS vs INTENT Separation
- **AS-IS**: What code actually implements today (verified)
- **INTENT**: What architecture plans to become (roadmap)
- **GAP**: Difference between AS-IS and INTENT (blockers)

### 3. FIT Gates Before Claims
- No "Operational Brain" claim until FIT-001 (Specialists Existence) passes
- No "Entity Memory" claim until FIT-002 (Entity Graph Exists) passes
- See `docs/fits/FIT_INDEX.md` for all gates

### 4. Immutable Semantic IDs
- Architecture concepts use immutable IDs (e.g., `concept.core.memory.timeline`)
- Marketing language can change; semantic IDs cannot

---

## 📚 Canon Documents

### Foundational (MUST READ)

| Doc | Status | Purpose |
|-----|--------|---------|
| [`00_CANON_INDEX.md`](./00_CANON_INDEX.md) | ✅ ACTIVE | This index |
| [`02_AI_FIRST_3_LAYER_ARCHITECTURE.md`](./02_AI_FIRST_3_LAYER_ARCHITECTURE.md) | ✅ ACTIVE | 3-layer architecture (Memory + Reasoning + UX) |
| [`13_CORE_AND_DOMAIN_PACKS_MODEL.md`](./13_CORE_AND_DOMAIN_PACKS_MODEL.md) | ✅ ACTIVE | Core agnostic + Domain Packs (hotel/studio/etc) |

### Memory Layer (Operational Substrate)

| Doc | Status | Purpose |
|-----|--------|---------|
| [`06_OPERATIONAL_MEMORY_CONTRACT.md`](./06_OPERATIONAL_MEMORY_CONTRACT.md) | ✅ ACTIVE | Memory = Events + Entities + Policy |
| [`07_ENTITY_MEMORY_SCHEMA_SPEC.md`](./07_ENTITY_MEMORY_SCHEMA_SPEC.md) | 📋 SPEC | Entity Graph schema (PLANNED) |
| [`08_EVENT_TAXONOMY_COMPREHENSIVE.md`](./08_EVENT_TAXONOMY_COMPREHENSIVE.md) | 📋 SPEC | Event types taxonomy |
| [`14_WORKSPACE_AND_ACCESS_MODEL.md`](./14_WORKSPACE_AND_ACCESS_MODEL.md) | ✅ ACTIVE | Workspaces + Departments + RLS |

### Reasoning Layer (Specialists + Coordination)

| Doc | Status | Purpose |
|-----|--------|---------|
| [`09_SPECIALISTS_ARCHITECTURE_SPEC.md`](./09_SPECIALISTS_ARCHITECTURE_SPEC.md) | 📋 SPEC | Specialists by domain (PLANNED) |
| [`10_TRACE_AND_EVIDENCE_MODEL.md`](./10_TRACE_AND_EVIDENCE_MODEL.md) | 📋 SPEC | Decision trace logging |

### UX Layer (Projection + Actions)

| Doc | Status | Purpose |
|-----|--------|---------|
| [`12_DASHBOARD_BOUNDED_CONTEXTS.md`](./12_DASHBOARD_BOUNDED_CONTEXTS.md) | ✅ ACTIVE | 3 dashboards boundaries |

### Cross-Cutting

| Doc | Status | Purpose |
|-----|--------|---------|
| [`11_PLANS_AND_USAGE_LIMITS_MODEL.md`](./11_PLANS_AND_USAGE_LIMITS_MODEL.md) | ⚠️ PARTIAL | Subscription plans + limits |

---

## ✅ FIT Gates

**FIT** = Functional Integration Test (objective validation criteria)

| FIT | Claim Blocked | Status | Doc |
|-----|---------------|--------|-----|
| FIT-001 | "Operational Brain" | ❌ FAIL | [`FIT_001_SPECIALISTS_EXISTENCE.md`](../fits/FIT_001_SPECIALISTS_EXISTENCE.md) |
| FIT-002 | "Entity Memory" | ❌ FAIL | [`FIT_002_ENTITY_GRAPH_EXISTS.md`](../fits/FIT_002_ENTITY_GRAPH_EXISTS.md) |
| FIT-003 | "Communication Events Capture" | ❌ FAIL | [`FIT_003_COMMUNICATION_EVENTS_CAPTURE.md`](../fits/FIT_003_COMMUNICATION_EVENTS_CAPTURE.md) |
| FIT-004 | "Trace Logging" | ❌ FAIL | [`FIT_004_TRACE_LOGGING.md`](../fits/FIT_004_TRACE_LOGGING.md) |
| FIT-005 | "Shell vs Content Enforcement" | ✅ PASS | [`FIT_005_SHELL_VS_CONTENT_ENFORCEMENT.md`](../fits/FIT_005_SHELL_VS_CONTENT_ENFORCEMENT.md) |
| FIT-006 | "Core + Domain Pack Contract" | ✅ PASS | [`FIT_006_CORE_DOMAIN_PACK_CONTRACT.md`](../fits/FIT_006_CORE_DOMAIN_PACK_CONTRACT.md) |

See [`docs/fits/FIT_INDEX.md`](../fits/FIT_INDEX.md) for details.

---

## 🚫 Claims Prohibited Until Gates Pass

### ❌ Cannot Claim (as of 2025-12-31):

1. **"ViTo is an Operational Business Brain"**
   - **Blocker**: FIT-001 (Specialists), FIT-002 (Entity Graph)
   - **Allowed**: "ViTo is a multi-tenant dashboard platform with Timeline tracking and departmental permissions, **architected to become** an Operational Brain"

2. **"Specialists reason over Operational Memory"**
   - **Blocker**: FIT-001 (no specialists exist)
   - **Allowed**: "ViTo's architecture includes a Specialist layer (SPEC, not implemented)"

3. **"Entity Graph connects contacts, deals, projects"**
   - **Blocker**: FIT-002 (no entity tables)
   - **Allowed**: "ViTo's Timeline system uses context JSONB; Entity Graph is planned"

4. **"Communication events (email/chat/call) are captured"**
   - **Blocker**: FIT-003 (no communication_events table)
   - **Allowed**: "Timeline captures milestones; communication events planned"

---

## ✅ Claims Allowed (Verified as of 2025-12-31):

1. **"ViTo has 3-layer AI-first i18n architecture"**
   - **Evidence**: `packages/utils/src/i18n/terminology/types.ts`, `engine.ts`
   - **FIT**: Documentation exists, code implements CAPA 1-2

2. **"ViTo supports multi-domain via Core + Domain Packs"**
   - **Evidence**: `ProductContext` type (hotel/studio/cowork/coliving), 10 `concept-*.json` files
   - **FIT**: FIT-006 passes

3. **"ViTo has departmental permissions with RLS"**
   - **Evidence**: `20250618120000_create_departmental_permissions.sql`, `departmentService.ts`
   - **FIT**: FIT-005 passes (shell vs content)

4. **"ViTo has Universal Timeline System"**
   - **Evidence**: `20250124000000_universal_timeline_system.sql`, `TimelineService.ts`
   - **FIT**: Migration + service exist, realtime subscriptions work

---

## 🔒 Invariants

These rules NEVER change:

1. **Semantic IDs are immutable** (CAPA 1)
   - `concept.booking.resource.room` NEVER renamed
   - Marketing can say "Habitación" or "Room" or "Sala"; ID stays same

2. **Core is agnostic, Domains specialize**
   - `TimelineService` works for ANY domain (hotel, studio, hospital)
   - Domain Pack provides vocabulary + rules, NOT core logic

3. **UX is projection, not source of truth**
   - Timeline UI projects operational memory (read-only view + suggested actions)
   - Source of truth: Memory Layer (Events + Entities + Policy)

4. **No claim without FIT gate**
   - If FIT fails, claim is prohibited in README/AGENTS/marketing
   - Specs (PLANNED features) allowed in `docs/canon/*.md` only

5. **Departments = Ownership Boundaries**
   - Entity ownership determined by `department_id`
   - Policy layer filters memory access per department
   - Specialists (future) anchored to departments

---

## 📖 How to Use This Canon

### For AI Agents (Development)
1. Read `02_AI_FIRST_3_LAYER_ARCHITECTURE.md` first
2. Check FITs in `docs/fits/` before claiming features
3. When implementing, link PRs to canon docs

### For Product/Marketing
1. **Allowed claims**: See "Claims Allowed" section above
2. **Prohibited claims**: See "Claims Prohibited" section
3. **Roadmap language**: Use "architected to support" for SPEC features

### For New Team Members
1. Start with this index
2. Read all ✅ ACTIVE canon docs
3. Understand FIT gates (what's missing vs what exists)

---

## 🔄 Canon Updates

Canon is **living documentation** but changes require:
1. **Evidence** (code change + file paths)
2. **FIT gate validation** (if claiming new capability)
3. **Approval** from Principal Architect

**Last Updated**: 2025-12-31  
**Next Review**: Q1 2026 (after Entity Graph + Specialists implementation)

---

**END OF CANON INDEX**
