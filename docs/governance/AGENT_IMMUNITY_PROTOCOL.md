# 🛡️ Agent Immunity Protocol (OpenSpec Standard)

> **Canonical Reference:** `docs/governance/AGENT_IMMUNITY_PROTOCOL.md`
> **Status:** ACTIVE
> **Target Audience:** AI Agents (Claude 3.5 Sonnet, OpenAI o1, Gemini 1.5 Pro)

---

## 🏗️ Architecture & Roles

This project operates on a **Multi-Model Agent Topology** using the **OpenSpec** methodology.

| Role | Model | Responsibility |
| :--- | :--- | :--- |
| **THE ARCHITECT** | **OpenAI o1** | Creates valid, sealed OpenSpec definitions (`.openspec.md`). Defines boundaries, schemas, and architectural decisions. |
| **THE BUILDER** | **Claude 3.5 Sonnet** | Implements code based *strictly* on the OpenSpec. Executes validation scripts. Iterates until green. |
| **THE AUDITOR** | **Gemini 1.5 / CodeRabbit** | Reviews code against governance documents and global consistency. |

---

## 📜 The Immunity Workflow

To maintain system immunity, Agents MUST follow this rigid workflow:

### 1. The Isolation Phase (Setup)
*   **Branch:** NEVER push to `main` or `develop`. Use `agent/feat-[task-id]`.
*   **Context:** Load `docs/governance/AI_AGENT_SAFETY_PROTOCOL.md` and `package.json` scripts.
*   **Database:** Use `pnpm run db:setup-ci` to initialize the secure sandbox (RLS enabled).

### 2. The Implementation Phase (Build)
*   **Source of Truth:** The `.openspec.md` file is LAW. Do not improvize features not in the spec.
*   **Incremental coding:** Write small chunks, then validate.
*   **Mandatory Checks:**
    *   `pnpm run validate:syntax` (Before every file save)
    *   `pnpm run validate:imports` (After adding dependencies)
    *   `pnpm run validate:type-safety` (Continuously)

### 3. The Immunity Gate (Verification)
Before considering a task "DONE", the Agent MUST run the full immunity suite:

```bash
pnpm run safety:check
```

If this fails, the Agent is **not allowed** to push or request review. The Agent must self-correct based on the error logs.

---

## 🔒 Technical Commandments (Hard Guardrails)

The following rules are enforced by CI/CD scripts. Violation leads to immediate rejection.

### A. Multi-Tenancy (Zero Trust)
*   **Rule:** Every DB query MUST filter by `company_id`.
*   **Enforcement:** `validate:multi-tenancy` script & RLS Policies.
*   **Failure Mode:** `DELETE` without `WHERE` triggers CI failure.

### B. Type Safety (No Casting)
*   **Rule:** `as any`, `as unknown`, and `!` assertions are PROHIBITED.
*   **Exception:** Tests (if scoped).
*   **Enforcement:** `validate:type-safety` script.
*   **Remedy:** Use Type Guards (`isExecError`) or Zod schemas.

### C. Import Hygiene
*   **Rule:** No hallucinated imports. No barrel files (`index.ts`) circular deps.
*   **Enforcement:** `validate:imports` & `validate:tsconfig-paths`.
*   **Remedy:** Check `package.json` and `tsconfig.json` before importing.

### D. Spec Adherence
*   **Rule:** Code must match the OpenSpec interface exactly.
*   **Enforcement:** TypeScript Interface Implementation.

---

## 🤖 Self-Correction Strategy (Anti-Loop Mechanism)

**CRITICAL RULE: The 3-Strike Limit**

To prevent infinite loops and token waste:

1.  **Attempt 1:** Analyze output, apply fix.
2.  **Attempt 2:** If failed again, re-read the Spec and specific file. Try a different approach.
3.  **Attempt 3 (FINAL):** If validation still fails:
    *   **STOP immediately.**
    *   **REVERT** changes to the last clean state.
    *   **REPORT** to the user: "Unable to satisfy guardrails for task X after 3 attempts."

**DO NOT** continue blindly fixing beyond 3 attempts. Ask for human intervention.

---

**Signed:**
*The Human in the Loop*
