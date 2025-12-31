# Critical Providers Registry (Distance 0–1)

**Status:** REGISTRY (P0)  
**Last updated:** 2025-12-31

---

## Notes

- Este registry lista dependencias externas cercanas al Core AI-first.
- "Evidence" indica dónde está declarada o usada (no se inventa).
- "Wrapper/Adapter Status" indica si existe un boundary canónico.

---

## Distance 0 — Memory Layer (CRITICAL)

### 1) Supabase Client

- **Package:** `@supabase/supabase-js`
- **Version:** `^2.89.0`
- **Declared in:** `apps/dashboard/package.json:27`
- **License:** MIT
- **Risk:** **CRITICAL** — single source of truth for operational memory
- **Replacement cost:** 6+ months (persistence layer)
- **Wrapper/Adapter status:** ❓ UNKNOWN (requires audit of services layer)
- **Usage evidence:** Declared only (usage not verified in this audit)

**Governance requirement (P0):**
- Identify boundary module(s) where Supabase client is instantiated and accessed.
- Add provenance header to those boundaries (FIT-007).

---

### 2) date-fns

- **Package:** `date-fns`
- **Version:** `4.1.0`
- **Declared in:** `apps/dashboard/package.json:50`
- **License:** MIT
- **Risk:** **HIGH** — temporal correctness, timezone safety risks
- **Canonical wrapper (spec):** `@vibethink/utils/datetime` (referenced in `VITO_ARCHITECTURE_SPEC_UNIFIED.md` Part 2)
- **Wrapper status:** ✅ SPECIFIED (spec exists); implementation/usage needs verification
- **Evidence gap:** ❌ No imports found of `@vibethink/utils/datetime` in dashboard (GAP)

**Governance requirement (P0):**
- Declare the "datetime boundary" and enforce usage via wrapper (or a documented usage pattern).
- Add provenance header on the canonical datetime entrypoint.

---

## Distance 1 — Reasoning Layer (HIGH RISK)

### 3) AI SDK (OpenAI)

- **Package:** `@ai-sdk/openai`
- **Version:** `^3.0.1`
- **Declared in:** `apps/dashboard/package.json:24`
- **License:** Apache-2.0
- **Risk:** **HIGH** — core reasoning vendor lock-in risk
- **Adapter status:** ❌ MISSING (direct usage found)
- **Usage evidence:** `apps/dashboard/app/api/chat/route.ts:1` direct import:
  - `import { openai } from '@ai-sdk/openai'`

**Governance requirement (P0):**
- Create an adapter boundary (even if thin) to avoid direct provider import in route handlers.
- Add provenance header on the adapter boundary.

---

### 4) Vercel AI SDK (Core)

- **Package:** `ai`
- **Version:** `^6.0.3`
- **Declared in:** `apps/dashboard/package.json:45`
- **License:** Apache-2.0
- **Risk:** MEDIUM-HIGH — streaming/tool calling abstractions
- **Adapter status:** ❓ UNKNOWN
- **Notes:** underlying providers can be swapped via `@ai-sdk/*`

**Governance requirement (P0):**
- Confirm where the AI SDK is called and centralize usage in an "AI boundary".

---

### 5) XYFlow (React Flow)

- **Package:** `@xyflow/react`
- **Version:** `^12.10.0`
- **Declared in:** `apps/dashboard/package.json:44`
- **License:** MIT
- **Risk:** MEDIUM — could be Distance 3 if only visual; Distance 1 if workflow execution is used
- **Usage context:** ❓ UNKNOWN

**Governance requirement (P0):**
- Audit usage: visualization-only vs workflow engine.
- Classify final distance after audit.

---

## Distance 1–2 — Hybrid (Memory ↔ UX Boundary)

### 6) TipTap Editor Ecosystem

- **Packages:** 11 packages, all `v2.22.3` pinned
  - `@tiptap/react` (dashboard:40)
  - `@tiptap/starter-kit` (dashboard:41)
  - `@tiptap/extension-*` (dashboard:29–38)
  - `@tiptap/pm` (dashboard:39)
- **Risk:** MEDIUM — rich content affects stored memory and retrieval
- **i18n status:** ❓ UNKNOWN (audit toolbar/menu strings)
- **Wrapper status:** ❓ UNKNOWN

**Governance requirement (P0):**
- Define a "Rich Content Boundary": what is stored, how sanitized, how localized.

---

### 7) Zod

- **Package:** `zod`
- **Version:** `^4.2.1`
- **Declared in:** `apps/dashboard/package.json:76`
- **Risk:** MEDIUM — schema validation at memory boundaries
- **Usage context:** API contracts, normalization, validation

**Governance requirement (P0):**
- Encourage use in boundary validators (API + normalization), not as scattered one-offs.

---

### 8) Zustand

- **Package:** `zustand`
- **Version:** `5.0.5`
- **Declared in:** `apps/dashboard/package.json:77`
- **Risk:** MEDIUM — can violate "UX as projection" if used as source of truth
- **Needs audit:** ensure ephemeral UI state only

**Governance requirement (P0):**
- Document allowed usage patterns (ephemeral UI caching only).
- Prohibit storing canonical memory state in client stores.

---

## Summary

- **Total providers listed:** 8
- **Distance 0:** 2
- **Distance 1:** 3
- **Distance 1–2:** 3

**Next step:** run FIT-007 checks on boundary files once identified/created.
