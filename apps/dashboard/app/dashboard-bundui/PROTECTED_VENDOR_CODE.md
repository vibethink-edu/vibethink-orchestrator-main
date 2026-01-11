# 🛡️ PROTECTED VENDOR CODE: BUNDUI DASHBOARD
# 🛑 STOP AND READ BEFORE EDITING 🛑

## 1. IMMUTABILITY PRINCIPLE
This directory (`apps/dashboard/app/dashboard-bundui`) contains the "Golden Standard" reference implementation for the VibeThink UI. 
**It is considered STABLE and should NOT be refactored for stylistic preferences, "code cleanup", or minor optimizations.**

## 2. STRICT RULES FOR MODIFICATION
Any changes to this directory must adhere to the following rules:

*   **NO Automated Refactors:** Do not accept automated "fix all" suggestions from IDEs or AI agents regarding imports, unused variables, or code style in this specific directory.
*   **Icon Source:** ALL icons must be imported from `@vibethink/ui/icons`. 
    *   **RULE:** Do NOT import directly from `lucide-react`. Use the centralized vault to ensure version stability across the monorepo.
    *   **PREFERENCE:** Use legacy-safe names (e.g., `ChevronDown`, `Plus`, `Check`) where possible, or check `packages/ui/src/icons.tsx` for available aliases.
*   **Verification Required:** Every change must be verified by running the app (`pnpm dev:dashboard`) and visiting the specific page. "It compiles" is NOT enough verification for this module.

## 3. DEPENDENCY AWARENESS
This code relies on specific versions of:
- `lucide-react`
- `@vibethink/ui` (shadcn wrapper)
- `recharts`

Upgrading these dependencies globally may break this reference implementation. If a global upgrade occurs, this directory must be manually smoke-tested (CRM, Analytics, Projects pages).

## 4. PURPOSE
This code serves as the:
1.  **Visual Reference:** How the UI *should* look.
2.  **Component Library Source:** Source of truth for complex compositions.
3.  **Demo/Sales Material:** Must always be demo-ready.

---
**Last Stabilized:** 2026-01-10 (Fixing Icon Runtime Crashes)
**Status:** 🟢 STABLE
**See Also:** [⚖️ MOCKUP STANDARDS LAW](./MOCKUP_STANDARDS_LAW.md)
