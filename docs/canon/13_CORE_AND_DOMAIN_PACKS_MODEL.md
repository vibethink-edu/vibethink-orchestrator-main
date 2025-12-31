# Core + Domain Packs Model

**Version**: 1.0.0  
**Date**: 2025-12-31  
**Status**: FOUNDATIONAL ✅  
**Evidence**: Code implementation verified

---

## 🎯 Vision: Core Agnostic Platform

ViTo is **NOT** hotel software, **NOT** studio software.  
ViTo is a **Core + Domain Packs** platform:

- **CORE**: Agnostic capabilities (Timeline, Permissions, Workspaces, Specialists orchestration)
- **DOMAIN PACK**: Industry-specific configuration (vocabulary, rules, entities, workflows)

**Same core** powers:
- Hotel bookings (rooms, amenities, housekeeping)
- Music studio sessions (recording rooms, instruments, engineers)
- Cowork spaces (desks, meeting rooms, memberships)
- Healthcare (appointments, treatment rooms, medical staff)
- Restaurant reservations (tables, menus, kitchen)

---

## 📐 Architecture Model

```
┌────────────────────────────────────────────────────────┐
│  DOMAIN PACK: HOTEL                                    │
│  - Vocabulary: "Room", "Check-in", "Guest"             │
│  - Entities: Room, Amenity, Reservation                │
│  - Workflows: Housekeeping, Concierge                  │
│  - Rules: Check-in time, cancellation policy           │
└────────────────────────────────────────────────────────┘
                         ↓ configures
┌────────────────────────────────────────────────────────┐
│  CORE CAPABILITIES (Agnostic)                          │
│  - Timeline (universal event stream)                   │
│  - Entity Graph (any entity type)                      │
│  - Policy Layer (departmental permissions)             │
│  - Workspaces (departments + roles)                    │
│  - Specialists (domain-anchored AI agents)             │
│  - i18n 3-Layer (context-aware translations)           │
└────────────────────────────────────────────────────────┘
                         ↓ powers
┌────────────────────────────────────────────────────────┐
│  RUNTIME INSTANCE                                      │
│  - Tenant: "Grand Hotel Barcelona"                     │
│  - productContext: 'hotel'                             │
│  - Departments: Front Desk, Housekeeping, Concierge    │
│  - Specialists: Front Desk Agent, Housekeeping Manager │
└────────────────────────────────────────────────────────┘
```

---

## ✅ AS-IS Evidence (What EXISTS Today)

### 1. Core i18n 3-Layer System with ProductContext

**Status**: ✅ **EXISTS** (Full Implementation)

**Evidence**:
- Types: `packages/utils/src/i18n/terminology/types.ts`
  - Line 43: `export type ProductContext = 'hotel' | 'studio' | 'cowork' | 'coliving';`
  - Line 174-209: `interface TerminologyContext` with `productContext` field
  - Line 238-278: `interface AgentContext` (AI-specific, requires productContext)

- Engine: `packages/utils/src/i18n/terminology/engine.ts`
  - Line 59-64: Namespace resolution logic per productContext
  - Line 517-521: `getNamespaceForProduct(productContext)` → `concept-${productContext}.json`

**What it does**:
- **Context-aware terminology resolution**: Same `concept.booking.resource.room` →
  - `hotel` context → "Habitación" / "Room"
  - `studio` context → "Sala" / "Studio Room"
  - `cowork` context → "Espacio" / "Space"

- **Fallback chain**:
  1. Try `concept-hotel.json` (product-specific override)
  2. Fallback to `concept.json` (universal base)
  3. Fallback to English
  4. Last resort: return concept ID

**Example**:
```typescript
import { term } from '@vibethink/utils/i18n/terminology';

//Hotel context
const roomLabel = await term('concept.booking.resource.room', {
  locale: 'es',
  productContext: 'hotel'
});
// → "Habitación"

// Studio context
const studioRoomLabel = await term('concept.booking.resource.room', {
  locale: 'es',
  productContext: 'studio'
});
// → "Sala de Grabación"
```

---

### 2. Domain Pack Translation Files

**Status**: ✅ **EXISTS** (10 Domain Packs Implemented)

**Evidence**: `apps/dashboard/src/lib/i18n/translations/en/`

Found 10 concept translation files (per language):
1. `concept.json` (base, universal)
2. `concept-hotel.json` ⭐
3. `concept-studio.json` ⭐
4. `concept-cowork.json` ⭐
5. `concept-coliving.json` ⭐
6. `concept-healthcare.json`
7. `concept-restaurant.json`
8. `concept-agency.json`
9. `concept-legal-firm.json`
10. `concept-media.json`
11. `concept-nonprofit.json`

**Structure** (each × 9 languages = 99 concept files total):
```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   ├── concept.json
│   ├── concept-hotel.json
│   ├── concept-studio.json
│   └── ... (8 more)
├── es/
│   ├── concept.json
│   ├── concept-hotel.json
│   └── ...
├── fr/
├── pt/
├── de/
├── it/
├── ko/
├── ar/
└── zh/
```

**Example Content** (`concept-hotel.json`):
```json
{
  "concept.booking.resource.room": "Room",
  "concept.booking.resource.area": "Area",
  "concept.booking.action.reserve": "Book",
  "concept.booking.time.checkin": "Check-in",
  "concept.booking.time.checkout": "Check-out",
  "concept.booking.unit.night": "night"
}
```

**Example Content** (`concept-studio.json`):
```json
{
  "concept.booking.resource.room": "Studio Room",
  "concept.booking.resource.area": "Recording Area",
  "concept.booking.action.reserve": "Book Session",
  "concept.booking.time.checkin": "Session Start",
  "concept.booking.time.checkout": "Session End",
  "concept.booking.unit.hour": "hour"
}
```

---

### 3. Core Timeline System (Domain-Agnostic)

**Status**: ✅ **EXISTS**

**Evidence**: `src/infrastructure/supabase/migrations/20250124000000_universal_timeline_system.sql`

**Domain-agnostic design**:
- `type` field supports: SHIPPING, CASE, PURCHASE, PROJECT, TASK, EVENT (extensible)
- `context` JSONB field stores domain-specific data (hotel reservation, studio session, etc.)
- **Same service, different contexts**

**Example**:
```typescript
// Hotel booking timeline
await timelineService.createTimeline({
  type: 'PROJECT', // or custom 'BOOKING'
  company_id: 'hotel-uuid',
  context: {
    domain: 'hotel',
    room_number: '305',
    guest_name: 'John Doe',
    checkin: '2025-02-01',
    checkout: '2025-02-05'
  }
});

// Studio session timeline
await timelineService.createTimeline({
  type: 'PROJECT',
  company_id: 'studio-uuid',
  context: {
    domain: 'studio',
    room_name: 'Studio A',
    artist: 'Jane Smith',
    session_start: '2025-02-01T10:00',
    session_end: '2025-02-01T14:00'
  }
});
```

**Core capability**: Timeline service doesn't care about domain; context drives specialization.

---

### 4. Core Workspaces (Departments)

**Status**: ✅ **EXISTS**

**Evidence**: `src/infrastructure/supabase/migrations/20250618120000_create_departmental_permissions.sql`

**Domain-agnostic departments**:
- ENUM `department_code`: OPERATIONS, FINANCE, HR, IT, MARKETING, SALES, LEGAL, EXECUTIVE, GENERAL
- **Same structure** across domains:
  - Hotel: Front Desk (OPERATIONS), Housekeeping (OPERATIONS), Concierge (SALES)
  - Studio: Recording Engineers (OPERATIONS), Production (OPERATIONS), Booking (SALES)
  - Cowork: Community Managers (OPERATIONS), Marketing (MARKETING), Facilities (OPERATIONS)

**Domain Pack customization** (via tenant config):
- Department names can be overridden per tenant
- Example: OPERATIONS → "Front Desk" (hotel) vs "Studio Engineers" (studio)

---

## 📋 Domain Pack Contract

A **Domain Pack** must provide:

### 1. Vocabulary (Concept Overrides)

**File**: `concept-{domain}.json` (per language)

**Required concepts**:
- `concept.booking.resource.room` (main bookable unit)
- `concept.booking.action.reserve` (booking action verb)
- `concept.booking.time.checkin` / `checkout` (time boundaries)
- `concept.booking.unit.*` (hour/day/night/session)

**Example** (minimal hospital domain pack):
```json
{
  "concept.booking.resource.room": "Treatment Room",
  "concept.booking.action.reserve": "Schedule Appointment",
  "concept.booking.time.checkin": "Appointment Start",
  "concept.booking.time.checkout": "Appointment End",
  "concept.booking.unit.hour": "hour"
}
```

---

### 2. Entity Types (Schema Extensions)

**Future**: Domain Packs define entity types via config (not separate tables)

**Example** (`domain-pack-hotel.json`):
```json
{
  "domain": "hotel",
  "entity_types": [
    {
      "type": "ROOM",
      "fields": {
        "room_number": "string",
        "floor": "number",
        "bed_type": "string",
        "max_occupancy": "number"
      }
    },
    {
      "type": "AMENITY",
      "fields": {
        "name": "string",
        "category": "string",
        "availability": "boolean"
      }
    }
  ]
}
```

**Core** (agnostic):
- `entities` table with `type` VARCHAR (extensible)
- `metadata` JSONB stores domain-specific fields
- Domain Pack defines schema, Core stores data

---

### 3. Workflows / Milestones (Config)

**Future**: Domain Packs define default milestones per timeline type

**Example** (hotel check-in workflow):
```json
{
  "timeline_type": "BOOKING",
  "domain": "hotel",
  "default_milestones": [
    { "name": "Reservation Confirmed", "order": 1 },
    { "name": "Guest Arrived (Check-in)", "order": 2 },
    { "name": "Room Prepared", "order": 3 },
    { "name": "Guest Checked Out", "order": 4 },
    { "name": "Room Cleaned", "order": 5 }
  ]
}
```

**Core** (agnostic):
- `timeline_type_configs` table stores default configs per domain
- Milestones are data, not hardcoded

---

### 4. Rules / Policies (Business Logic)

**Future**: Domain Packs define validation rules

**Example** (hotel cancellation policy):
```json
{
  "domain": "hotel",
  "rules": {
    "cancellation_policy": {
      "free_cancellation_hours": 24,
      "penalty_percentage": 50
    },
    "check_in_time": "15:00",
    "check_out_time": "12:00"
  }
}
```

**Core** provides rule engine; Domain Pack provides rules.

---

## 🔒 Core Boundaries (What CANNOT be Domain-Specific)

1. **Timeline Service Logic**
   - Timeline creation, milestone tracking, alert generation = **CORE**
   - Milestone NAMES can vary (domain-specific), but logic is agnostic

2. **Permission System**
   - RLS policies, `check_resource_access()` = **CORE**
   - Resource TYPES can vary, but permission hierarchy is fixed

3. **Specialist Orchestration** (future)
   - Coordination between specialists = **CORE**
   - Specialist RULES (what triggers decisions) = **DOMAIN PACK**

4. **Entity Graph Storage**
   - `entities`, `entity_relationships` tables = **CORE**
   - Entity TYPES and metadata schemas = **DOMAIN PACK**

---

## ⚠️ What is MISSING (Gaps)

### 1. Domain Pack Registry

**Need**: Centralized registry of installed Domain Packs per tenant

**Proposed**: `domain_packs` table
```sql
CREATE TABLE domain_packs (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  domain_code TEXT NOT NULL, -- 'hotel', 'studio', etc.
  version TEXT NOT NULL,
  config JSONB, -- Overrides, custom rules
  is_active BOOLEAN DEFAULT true,
  installed_at TIMESTAMPTZ DEFAULT now()
);
```

**Usage**:
```typescript
// Tenant "Grand Hotel Barcelona" installs hotel pack
await installDomainPack(companyId, 'hotel', { version: '1.0.0' });

// UI/API automatically uses productContext='hotel'
```

---

### 2. Domain-Specific Entity Schemas

**Need**: Define entity types + fields per Domain Pack (not hardcoded tables)

**Current workaround**: `context` JSONB in Timeline (opaque)

**Proposed**: Entity metadata validation via JSON Schema per domain

---

### 3. Specialist Domain Anchoring

**Need**: Link specialists to Domain Pack (e.g., Hotel Concierge Specialist)

**Proposed**: `specialists` table with `domain_code` field
```sql
CREATE TABLE specialists (
  id UUID PRIMARY KEY,
  company_id UUID,
  department_id UUID,
  specialist_type TEXT, -- 'concierge', 'housekeeping', etc.
  domain_code TEXT, -- 'hotel', 'studio', etc.
  config JSONB -- Domain-specific rules
);
```

---

## ✅ Current Implementation Status

| Component | Status | Evidence |
|-----------|--------|----------|
| **Core i18n with ProductContext** | ✅ EXISTS | `types.ts`, `engine.ts` |
| **10 Domain Pack translation files** | ✅ EXISTS | `concept-hotel.json`, `concept-studio.json`, etc. |
| **Core Timeline (agnostic)** | ✅ EXISTS | `universal_timelines` table |
| **Core Workspaces (Departments)** | ✅ EXISTS | `departments` table |
| **Domain Pack Registry** | ❌ MISSING | No `domain_packs` table |
| **Entity Schemas per Domain** | ❌ MISSING | No schema validation |
| **Specialist Domain Anchoring** | ❌ MISSING | No specialists exist |

---

## 🎯 FIT Gate: FIT-006

**VALIDATION**: Does ViTo implement Core + Domain Pack contract?

**Criteria**:
- [ ] Core i18n supports P roductContext ✅ **PASS**
- [ ] Domain Pack translation files exist ✅ **PASS**
- [ ] Core Timeline is domain-agnostic ✅ **PASS**
- [ ] Domain Pack Registry exists ❌ **FAIL** (future)
- [ ] Entity schemas per domain ❌ **FAIL** (future)

**Overall**: ⚠️ **PARTIAL PASS** (foundation exists, registry missing)

**Allowed Claim**: "ViTo's i18n and Timeline are designed as Core + Domain Packs; full registry and entity schemas are planned"

---

## 🔒 Architectural Invariants

1. **Core NEVER hardcodes domain logic**
   - No `if (domain === 'hotel')` in Core services
   - Use `context` JSONB, Domain Pack config, or metadata schemas

2. **Domain Pack CANNOT override Core logic**
   - Timeline milestone tracking logic = fixed
   - Domain Pack defines milestone NAMES, not tracking algorithm

3. **All features expressed as: Core + Domain Pack + Policy + Trace**
   - Example: "Hotel check-in workflow" =
     - Core: Timeline + Milestones
     - Domain Pack: "Check-in" vocabulary + default milestones
     - Policy: Front Desk dept has MANAGE permission on bookings
     - Trace: Concierge Specialist logged check-in decision

---

**END OF CORE + DOMAIN PACKS CANON**
