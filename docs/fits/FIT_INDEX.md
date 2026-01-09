# FIT Index — Functional Integration Tests

**Version**: 1.0.0  
**Date**: 2025-12-31  
**Purpose**: Objective validation gates for architectural claims

---

## 🎯 What is a FIT?

**FIT** = **F**unctional **I**ntegration **T**est

A FIT is an **objective, executable validation** that determines if an architectural claim is true.

**Rules**:
- FIT must be **pass/fail** (no ambiguity)
- FIT includes **verification script** or **SQL query**
- Claims BLOCKED by FIT cannot appear in README/AGENTS/marketing until FIT passes

---

## 📊 FIT Status Summary

| FIT | Claim Blocked | Status | Impact |
|-----|---------------|--------|--------|
| [FIT-001](#fit-001) | "Operational Brain with Specialists" | ❌ FAIL | **CRITICAL** — No brain without specialists |
| [FIT-002](#fit-002) | "Entity Memory Graph" | ❌ FAIL | **BLOCKER** — Specialists need graph to reason |
| [FIT-003](#fit-003) | "Communication Events Capture" | ❌ FAIL | **HIGH** — Rich signals missing |
| [FIT-004](#fit-004) | "Trace Logging" | ❌ FAIL | **HIGH** — No auditability |
| [FIT-005](#fit-005) | "Shell vs Content Enforcement" | ✅ PASS | None |
| [FIT-006](#fit-006) | "Core + Domain Pack Contract" | ⚠️ PARTIAL | Minor — Foundation exists |
| [FIT-DOCUMENT-INTELLIGENCE-001](./FIT-DOCUMENT-INTELLIGENCE-001.md) | "Document Intelligence Service" | 📋 PROPOSED | Vertical FIT — Awaiting implementation |

**Overall**: 1.5 / 7 FITs (21% passing, 1 proposed)  
**Blockers**: FIT-001, FIT-002 must pass before "Operational Brain" claim  
**Proposed**: FIT-DOCUMENT-INTELLIGENCE-001 (Document Intelligence vertical)

---

## FIT-001: Specialists Existence

**Claim Blocked**: "ViTo is an Operational Business Brain with domain specialists"

**Status**: ❌ **FAIL**

**Verification**:
```bash
# Search for specialist classes
grep -r "class.*Specialist" apps/ packages/ src/ --include="*.ts"
# Expected: At least 1 result (e.g., SalesSpecialist, OperationsSpecialist)
# Actual: 0 results

# Search for specialist interfaces
grep -r "interface.*ISpecialist" src/ packages/ --include="*.ts"
# Expected: ISpecialist interface definition
# Actual: 0 results
```

**SQL Verification**:
```sql
-- Check if specialists table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'specialists';
-- Expected: 1 row
-- Actual: 0 rows
```

**Pass Criteria**:
- [ ] At least 1 specialist class exists (SalesSpecialist OR OperationsSpecialist OR any domain)
- [ ] `ISpecialist` interface defined with methods: `analyzeMemory()`, `decideAction()`, `executeAction()`
- [ ] `specialists` table exists in DB with columns: specialist_type, department_id, config

**Current Status**: 0/3 criteria met

**See**: [`FIT_001_SPECIALISTS_EXISTENCE.md`](./FIT_001_SPECIALISTS_EXISTENCE.md)

---

## FIT-002: Entity Graph Exists

**Claim Blocked**: "ViTo has Entity Memory enabling specialists to reason over relationships"

**Status**: ❌ **FAIL**

**Verification**:
```sql
-- Check for entities table
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'entities';
-- Expected: 1 row
-- Actual: 0 rows

-- Check for entity_relationships table
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'entity_relationships';
-- Expected: 1 row
-- Actual: 0 rows
```

**Pass Criteria**:
- [ ] `entities` table exists with columns: id, type, company_id, department_id, name, metadata
- [ ] `entity_relationships` table exists with: from_entity_id, to_entity_id, relationship_type
- [ ] `universal_timelines` table has `entity_id` FK (not just opaque `context` JSONB)

**Current Status**: 0/3 criteria met

**Impact**: **BLOCKER** — Specialists cannot reason without structured entity graph

**See**: [`FIT_002_ENTITY_GRAPH_EXISTS.md`](./FIT_002_ENTITY_GRAPH_EXISTS.md)

---

## FIT-003: Communication Events Capture

**Claim Blocked**: "ViTo captures all operational signals including emails, calls, chats"

**Status**: ❌ **FAIL**

**Verification**:
```sql
-- Check for communication_events table
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'communication_events';
-- Expected: 1 row
-- Actual: 0 rows
```

**Code Search**:
```bash
grep -r "email_event\|call_event\|chat_event" src/ --include="*.ts"
# Expected: Event type definitions or enum
# Actual: 0 results
```

**Pass Criteria**:
- [ ] `communication_events` table exists
- [ ] Event types enum includes: EMAIL_SENT, EMAIL_RECEIVED, CALL_STARTED, CALL_ENDED, CHAT_MESSAGE_SENT
- [ ] At least 1 email/call/chat event logged in production DB

**Current Status**: 0/3 criteria met

**Impact**: **HIGH** — Specialists miss critical signals (customer emails, support calls)

**See**: [`FIT_003_COMMUNICATION_EVENTS_CAPTURE.md`](./FIT_003_COMMUNICATION_EVENTS_CAPTURE.md)

---

## FIT-004: Trace Logging

**Claim Blocked**: "Specialist decisions are auditable with full trace evidence"

**Status**: ❌ **FAIL**

**Verification**:
```sql
-- Check for specialist_trace_logs table
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'specialist_trace_logs';
-- Expected: 1 row
-- Actual: 0 rows
```

**Pass Criteria**:
- [ ] `specialist_trace_logs` table exists with columns: specialist_id, entity_id, decision_reasoning, confidence_score
- [ ] At least 1 trace log entry exists (specialist made at least 1 decision)
- [ ] Trace includes: input context, reasoning steps, decision output

**Current Status**: 0/3 criteria met

**Impact**: **HIGH** — No auditability, debugging, or compliance proof

**See**: [`FIT_004_TRACE_LOGGING.md`](./FIT_004_TRACE_LOGGING.md)

---

## FIT-005: Shell vs Content Enforcement

**Claim**: "ViTo enforces shell vs content visibility via policy layer"

**Status**: ✅ **PASS**

**Verification**:
```sql
-- Check for departmental_permissions table
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'departmental_permissions';
-- Expected: 1 row
-- Actual: ✅ 1 row

-- Check permission_level enum
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'permission_level'::regtype;
-- Expected: NONE, VIEW, COMMENT, EDIT, MANAGE, ADMIN
-- Actual: ✅ All 6 levels exist

-- Check check_resource_access function
SELECT proname FROM pg_proc WHERE proname = 'check_resource_access';
-- Expected: 1 row
-- Actual: ✅ 1 row
```

**Pass Criteria**:
- [x] `departmental_permissions` table exists ✅
- [x] `permission_level` hierarchy enforced ✅
- [x] `check_resource_access()` function returns permission level ✅

**Current Status**: 3/3 criteria met ✅

**See**: [`FIT_005_SHELL_VS_CONTENT_ENFORCEMENT.md`](./FIT_005_SHELL_VS_CONTENT_ENFORCEMENT.md)

---

## FIT-006: Core + Domain Pack Contract

**Claim**: "ViTo implements Core agnostic + Domain Packs architecture"

**Status**: ⚠️ **PARTIAL PASS**

**Verification**:
```bash
# Check ProductContext type exists
grep "export type ProductContext" packages/utils/src/i18n/terminology/types.ts
# Expected: ProductContext = 'hotel' | 'studio' | 'cowork' | 'coliving'
# Actual: ✅ Found

# Check concept-*.json files exist
ls apps/dashboard/src/lib/i18n/translations/en/concept-*.json | wc -l
# Expected: At least 4 (hotel, studio, cowork, coliving)
# Actual: ✅ 10 files

# Check domain_packs table (registry)
SELECT table_name FROM information_schema.tables WHERE table_name = 'domain_packs';
# Expected: 1 row
# Actual: ❌ 0 rows (MISSING)
```

**Pass Criteria**:
- [x] `ProductContext` type exists with multiple domains ✅
- [x] Domain Pack translation files exist (concept-hotel.json, etc) ✅
- [x] Core Timeline is domain-agnostic (context JSONB, not hardcoded) ✅
- [ ] `domain_packs` table exists (registry) ❌
- [ ] Entity schemas validated per domain ❌

**Current Status**: 3/5 criteria met (60%)

**Verdict**: Foundation exists, full registry planned

**See**: [`FIT_006_CORE_DOMAIN_PACK_CONTRACT.md`](./FIT_006_CORE_DOMAIN_PACK_CONTRACT.md)

---

## 🔒 FIT Usage Rules

### For Development
1. **Before implementing feature**: Check if FIT exists
2. **After implementation**: Run FIT verification script
3. **Link PR to FIT**: "Closes FIT-001" in PR description

### For Documentation
1. **Prohibited claims**: If FIT fails, claim CANNOT appear in README/AGENTS
2. **Allowed phrasing**:
   - ❌ "ViTo is an Operational Brain" (FIT-001 fails)
   - ✅ "ViTo is architected to become an Operational Brain (Specialists layer planned)"

### For Product/Marketing
1. Check FIT status before public claims
2. Use "roadmap" or "planned" for failed FITs
3. Only claim features with passing FITs

---

## 📅 FIT Roadmap

**Q1 2026** (Target):
- FIT-002: Entity Graph implementation → PASS
- FIT-001: At least 1 specialist (Sales or Ops) → PASS
- FIT-004: Trace logging infrastructure → PASS

**Q2 2026** (Target):
- FIT-003: Communication events (email integration) → PASS

**When all FITs pass**: "Operational Brain" claim unlocked ✅

---

**END OF FIT INDEX**
