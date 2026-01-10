# 🎻 VibeThink Agent Orchestration Workflow

> **Purpose:** Standard operating procedure for orchestrating AI Agents (Architect -> Builder -> Auditor).
> **Objective:** Convert human intent into production-grade code with zero regressions.

---

## 🔁 The Automation Loop

### PHASE 1: ARCHITECT (Model: OpenAI o1 / o1-mini)

**Goal:** Turn a request into a sealed OpenSpec. **DO NOT CODE.**

**Context Required:**
- `docs/arch/*` (Architecture guidelines)
- `docs/data/DB_NAMING_AND_RULES.md`

**Prompt Template:**
```markdown
# ROLE: Senior System Architect

# TASK:
Design the implementation spec for: "[INSERT YOUR FEATURE REQUEST HERE]"

# OUTPUT FORMAT (OpenSpec):
Create a file `docs/specs/XXX_feature_name.md` containing:
1. **User Stories:** BDD format.
2. **Schema Changes:** SQL DDL (following DB naming rules).
3. **API Interface:** Typescript Interfaces only.
4. **Step-by-Step Implementation Plan.**
5. **Validation Strategy:** Which scripts must pass.

# CONSTRAINT:
Do NOT write implementation code. Only architecture and interfaces.
Consider Multi-Tenancy and RLS in your design.
```

---

### PHASE 2: BUILDER (Model: Claude 3.5 Sonnet)

**Goal:** Turn the OpenSpec into code that passes all Immunity Checks.

**Context Required:**
- The generated `docs/specs/XXX_feature_name.md`
- `docs/governance/AGENT_IMMUNITY_PROTOCOL.md` (CRITICAL)
- `package.json` (for scripts)

**Prompt Template:**
```markdown
# ROLE: Senior TypeScript Engineer (The Builder)

# INPUT:
I have attached the OpenSpec (`docs/specs/XXX.md`) and the Immunity Protocol.

# TASK:
Implement the feature exactly as specified.
1. Create a branch `agent/feat-name`.
2. Follow the "Implementation Phase" in the Immunity Protocol.
3. Use `pnpm run setup-db-schema` to prepare your sandbox.

# LOOP (CRITICAL):
After WRITING code, you MUST run:
`pnpm run validate:all`

- If it fails: Analyze the error, FIX it, and re-run.
- Only stop when `Safety Gates Summary` shows all ✅.

# OUTPUT:
Commit your changes and ask for visual confirmation.
```

---

### PHASE 3: AUDITOR (Model: CodeRabbit / Gemini 1.5 Pro)

**Goal:** Sanity check before merge.

**Automated:**
- Push the branch. CodeRabbit will auto-scan based on `.coderabbit.yaml`.

**Manual (Gemini):**
```markdown
# ROLE: Security Auditor

# TASK:
Review the changed files in this PR against `docs/governance/AI_AGENT_SAFETY_PROTOCOL.md`.
Focus on:
1. Is multi-tenancy bypassed anywhere?
2. Are there hidden `as any` or `ts-ignore`?
3. Does it match the OpenSpec requirements?
```

---

## 🚦 Emergency Stop

If the Builder agent gets stuck in a loop failing tests:
1. **STOP** the agent.
2. Read the `pnpm run validate:all` logs yourself.
3. Check if the OpenSpec was flawed (Architect error).
4. Restart from Phase 1 if needed.
