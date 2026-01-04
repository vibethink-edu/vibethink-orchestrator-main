# AI Stability Rules & Guardrails

**Status**: NON-CANON (Operational Only)  
**Authority**: Subordinate to `docs/canon/*`  
**Last Updated**: 2026-01-02

---

## 🏛️ Authority & Scope

This document defines **Operational Guardrails** to prevent system instability.
It is **NOT** an architectural definition.

**Hierarchy of Truth**:
1.  `docs/canon/02_AI_FIRST_3_LAYER_ARCHITECTURE.md` (The Law)
2.  `docs/canon/*` (Specific Laws)
3.  `AI_STABILITY_RULES.md` (This Document - The Police)

If a rule in this file conflicts with a Canon document, **Canon wins**.

---

## 🛡️ Critical Stability Rules

### 1. Dependency Governance
**Rule**: Strict separation of Monorepo Dependencies.

*   **ROOT ONLY**: Core framework deps (`react`, `next`, `typescript`, `@types/*`, `eslint`, `prettier`).
    *   *Why*: To ensure single version policy across the monorepo.
*   **APP/PACKAGE LEVEL**: Feature-specific deps (`@fullcalendar/react`, `framer-motion`, `lucide-react`).
    *   *Why*: To prevent bloating the root node_modules with unused libs.

**AMBIGUITY RESOLVED**: If a library is used by >1 app/package, it does **not** automatically move to Root. It moves to a `packages/ui` or `packages/utils` shared package, and apps consume the internal package. Root is reserved for the *build system* and *framework core*.

### 2. Hydration Safety
**Rule**: All client-side hooks must run inside a `mounted` check or dynamic import.
*   *Anti-pattern*: `const isMobile = useMediaQuery()` at top level.
*   *Required*: `if (!mounted) return null;`

### 3. I18n Integrity Exceptions
**global Rule**: All languages must be 100% complete.
**TEMPORARY EXCEPTION (Expiring Q2 2026)**:
*   **IT (Italian)** and **KO (Korean)** are permitted to fallback to English (`en`) for up to 50% of keys.
*   *Reason*: Pending certified translation vendor.
*   *Constraint*: Critical UI paths (Login, Checkout) must be translated.

---

## 🤖 Agent Operational Protocol

1.  **Read Canon First**: Do not infer architecture from code. Read `docs/canon/`.
2.  **No "Creative" Refactoring**: Do not refactor folder structures without an accepted RFC in `docs/architecture/`.
3.  **Atomic Commits**: `feat:`, `fix:`, `docs:` must be separate operations.
