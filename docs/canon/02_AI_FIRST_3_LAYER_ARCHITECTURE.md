# AI-First 3-Layer Architecture

**Version**: 1.0.0  
**Date**: 2025-12-31  
**Status**: FOUNDATIONAL ✅  
**Evidence**: Code implementation verified

---

## 🎯 Architecture Definition

ViTo implements a **3-layer AI-first architecture**:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: UX (Projection + Suggested Actions)          │
│  - Timeline visualization                              │
│  - Action composer (suggestions from specialists)      │
│  - Shell vs content rendering                          │
└─────────────────────────────────────────────────────────┘
                         ↑ projects
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: REASONING (Specialists + Coordination)        │
│  - Domain specialists (Sales, Ops, Finance, Support)   │
│  - Orchestration / decision-making                      │
│  - Trace logging (evidence of decisions)               │
└─────────────────────────────────────────────────────────┘
                         ↑ consumes
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: MEMORY (Operational Substrate)                │
│  - Event Stream (Timeline)                             │
│  - Entity Memory (Graph)                               │
│  - Policy Layer (RLS + departmental permissions)        │
│  - Workspace Model                                      │
└─────────────────────────────────────────────────────────┘
```

**Critical**: UX is **projection**, NOT source of truth. Timeline UI shows what's in Memory; suggested actions come from Specialists.

---

## 📊 Layer 1: MEMORY (Operational Substrate)

### 1.1 Event Stream (Timeline)

**Status**: ✅ **EXISTS** (Full Implementation)

**Evidence**:
- Migration: `src/infrastructure/supabase/migrations/20250124000000_universal_timeline_system.sql`
- Service: `src/shared/services/services/TimelineService.ts`
- Tables: `universal_timelines`, `timeline_milestones`, `timeline_events`, `timeline_alerts`, `timeline_notifications`

**What it does**:
- Universal event tracking for SHIPPING, CASE, PURCHASE, PROJECT, TASK, EVENT types
- Milestones with progress tracking (0-100%)
- Automatic alert generation (delays, SLA breaches)
- Realtime subscriptions via Supabase channels

**What it does NOT do** (yet):
- Link to Entity Graph (context is opaque JSONB, not structured)
- Capture communication events (email/chat/call - see FIT-003)

**Example**:
```typescript
// Create timeline for shipment
await timelineService.createTimeline({
  type: 'SHIPPING',
  company_id: 'uuid',
  context: { order_id: '123', customer: 'Acme Corp' }, // ⚠️ JSONB blob
  expected_end_time: '2025-01-15T00:00:00Z',
});
```

---

### 1.2 Entity Memory (Graph)

**Status**: ❌ **MISSING** (Planned - see [`07_ENTITY_MEMORY_SCHEMA_SPEC.md`](./07_ENTITY_MEMORY_SCHEMA_SPEC.md))

**What SHOULD exist**:
- `entities` table (id, type, company_id, department_id, name, metadata)
- `entity_relationships` table (from_entity → to_entity, relationship_type)
- `entity_events` table (entity_id, event_type, event_data)

**Current workaround**:
- Timeline uses `context` JSONB field (opaque, no structured queries)

**Gap Impact**: **BLOCKER** for Specialists (cannot reason over entity relationships)

---

### 1.3 Policy Layer (Permissions + RLS)

**Status**: ✅ **EXISTS** (Robust Implementation)

**Evidence**:
- Migration: `src/infrastructure/supabase/migrations/20250618120000_create_departmental_permissions.sql` (368 lines)
- Service: `src/shared/services/services/departmentService.ts`
- Hooks: `useDepartmentalPermissions.tsx`, `useDepartmentStandards.ts`

**What it does**:
- Departmental permissions: `resource_type` (FOLDER, DOCUMENT, WORKFLOW, AI_FEATURE) × `permission_level` (NONE → VIEW → EDIT → MANAGE → ADMIN)
- `resource_pattern` wildcards (e.g., `"Finance/*"` → Finance dept sees all Finance resources)
- RLS policies (users see only their company + departments)
- Function `check_resource_access(user_id, resource, required_level)` with hierarchy logic

**Shell vs Content**:
- **Shell visibility**: User sees resource EXISTS (list view, metadata)
- **Content visibility**: User can read/write resource data
- Implemented via `permission_level` granularity

**Example**:
```sql
-- Finance department can MANAGE all finance/* resources
INSERT INTO departmental_permissions (
  company_id, department_code, resource_type, resource_pattern, permission_level
) VALUES (
  'company-uuid', 'FINANCE', 'DOCUMENT', 'finance/*', 'MANAGE'
);
```

---

### 1.4 Workspace Model

**Status**: ✅ **EXISTS** (Departments + Memberships)

**Evidence**:
- Same migration as 1.3: `departments` table (company_id, code, name, manager_user_id, parent_department_id)
- `user_department_memberships` table (user_id, department_id, role_in_department, primary_department)

**What it does**:
- 9 default departments per company: OPERATIONS, FINANCE, HR, IT, MARKETING, SALES, LEGAL, EXECUTIVE, GENERAL
- Hierarchy support (`parent_department_id`)
- User can belong to MULTIPLE departments with different roles (MEMBER, LEAD, MANAGER, ADMIN)

**Example**:
```typescript
// Assign user to Sales department as LEAD
await assignUserToDepartment(userId, departmentId, companyId, 'LEAD');
```

---

## 🧠 Layer 2: REASONING (Specialists + Coordination)

### 2.1 Domain Specialists

**Status**: ❌ **MISSING** (Planned - see [`09_SPECIALISTS_ARCHITECTURE_SPEC.md`](./09_SPECIALISTS_ARCHITECTURE_SPEC.md))

**What SHOULD exist**:
- Specialist classes: `SalesSpecialist`, `AccountingSpecialist`, `OperationsSpecialist`, `SupportSpecialist`
- Interface `ISpecialist` with methods: `analyzeMemory()`, `decideAction()`, `executeAction()`
- Anchored to departments: Each specialist assigned to 1+ departments

**Current state**: **ZERO** classes, **ZERO** interfaces

**Gap Impact**: **BLOCKER** for "Operational Brain" claim (no brain without specialists)

---

### 2.2 Orchestration

**Status**: ❌ **MISSING** (No coordination layer)

**What SHOULD exist**:
- Orchestrator service coordinates specialists across departments
- Handoff logic (e.g., Sales closes deal → triggers Finance invoice + Ops fulfillment)
- Conflict resolution (if multiple specialists suggest contradictory actions)

**Current state**: None

---

### 2.3 Trace Logging

**Status**: ❌ **MISSING** (Planned - see [`10_TRACE_AND_EVIDENCE_MODEL.md`](./10_TRACE_AND_EVIDENCE_MODEL.md))

**What SHOULD exist**:
- `specialist_trace_logs` table (specialist_id, entity_id, decision_reasoning, confidence_score)
- Every specialist decision recorded with full context

**Current state**: None

**Gap Impact**: No auditability of specialist decisions (critical for compliance/debugging)

---

## 🎨 Layer 3: UX (Projection + Suggested Actions)

### 3.1 Timeline Visualization

**Status**: ✅ **EXISTS** (Multiple UI components)

**Evidence**:
- `packages/ui/src/components/extensions/timeline.tsx`
- `apps/dashboard/app/dashboard-bundui/projects-v2/components/collapsible-timeline.tsx`
- `apps/dashboard/app/dashboard-bundui/crm-v2-ai/lead/[id]/components/contextual-timeline.tsx`

**What it does**:
- Projects Timeline data (from Memory Layer) as visual UI
- Shows milestones, progress bars, alerts
- **Read-only projection** (updates go through Memory Layer, not UI)

---

### 3.2 Action Composer (Suggested Actions)

**Status**: ⚠️ **PARTIAL** (UI exists, specialist suggestions missing)

**Evidence**:
- Generic AI chat: `apps/dashboard/app/dashboard-bundui/ai-chat*/`
- NOT specialist-driven (no specialists exist)

**What SHOULD exist**:
- Specialist analyzes Timeline/Entity → suggests actions (e.g., "Follow up on delayed shipment")
- User approves/rejects → Specialist executes or logs override

**Current state**: Generic AI chat, no domain-specific specialist suggestions

---

### 3.3 Shell vs Content Rendering

**Status**: ✅ **EXISTS** (Policy layer enforces)

**Evidence**:
- `check_resource_access()` function returns permission level
- UI components check permission before rendering content vs shell

**Example**:
```tsx
// Shell: Always visible
<ResourceCard title={resource.name} />

// Content: Only if permission >= VIEW
{hasAccess('VIEW') && <ResourceDetails data={resource.data} />}
```

---

## 📦 Mapping Repo Modules to Layers

### Layer 1: MEMORY

| Module | Purpose | Status |
|--------|---------|--------|
| `src/infrastructure/supabase/migrations/` | DB schema (timelines, departments, permissions) | ✅ EXISTS |
| `src/shared/services/services/TimelineService.ts` | Event stream service | ✅ EXISTS |
| `src/shared/services/services/departmentService.ts` | Workspace + permissions | ✅ EXISTS |
| **GAP**: `entities`, `entity_relationships` tables | Entity Graph | ❌ MISSING |

### Layer 2: REASONING

| Module | Purpose | Status |
|--------|---------|--------|
| **GAP**: `packages/specialists/` or `src/specialists/` | Specialist classes | ❌ MISSING |
| **GAP**: `specialist_trace_logs` table | Decision logging | ❌ MISSING |

### Layer 3: UX

| Module | Purpose | Status |
|--------|---------|--------|
| `apps/dashboard/app/dashboard-bundui/` | Dashboard UI components | ✅ EXISTS |
| `packages/ui/src/components/` | Reusable UI library | ✅ EXISTS |
| `apps/dashboard/app/dashboard-bundui/ai-chat*/` | Generic AI chat | ⚠️ PARTIAL (not specialist-driven) |

---

## ✅ AS-IS Summary (2025-12-31)

| Layer | Component | Status |
|-------|-----------|--------|
| **LAYER 1** | Event Stream (Timeline) | ✅ EXISTS |
| **LAYER 1** | Entity Graph | ❌ MISSING |
| **LAYER 1** | Policy Layer | ✅ EXISTS |
| **LAYER 1** | Workspace Model | ✅ EXISTS |
| **LAYER 2** | Specialists | ❌ MISSING |
| **LAYER 2** | Orchestration | ❌ MISSING |
| **LAYER 2** | Trace Logging | ❌ MISSING |
| **LAYER 3** | Timeline UI | ✅ EXISTS |
| **LAYER 3** | Action Composer | ⚠️ PARTIAL |
| **LAYER 3** | Shell/Content | ✅ EXISTS |

**Verdict**: ViTo has **LAYER 1** (Memory) **60% complete** and **LAYER 3** (UX) projecting it. **LAYER 2** (Reasoning) is **0% implemented** → **NO "Operational Brain" claim allowed** until FIT-001 passes.

---

## 🔒 Architectural Invariants

1. **UX is projection, never source of truth**
   - Timeline UI reads from `universal_timelines` table
   - User actions → service layer → update Memory → UI re-renders

2. **Memory is policy-aware from day 1**
   - Every read filtered by `check_resource_access()`
   - No "add permissions later" — baked into schema

3. **Specialists consume Memory, never bypass it**
   - Specialists read from Entity Graph + Events
   - Specialists write decisions to `specialist_trace_logs`
   - Specialists execute actions via service layer (not direct DB)

---

**END OF 3-LAYER ARCHITECTURE CANON**
