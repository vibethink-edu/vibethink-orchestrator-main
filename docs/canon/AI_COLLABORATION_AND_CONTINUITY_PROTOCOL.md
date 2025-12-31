# AI Collaboration and Continuity Protocol

**Status:** CANON  
**Owner:** Platform Architecture  
**Last updated:** 2025-12-31

---

## 1. Purpose & Non-Goals

### Purpose

Define how AI collaborators (Claude, Gemini, GPT, others) work with ViTo's codebase and architectural truth without creating dependency on model memory or conversational state.

### Non-Goals

- This is NOT a prompt engineering guide
- This is NOT automation tooling
- This is NOT a replacement for human architectural judgment
- This does NOT assume AI models have persistent memory

---

## 2. Core Principle: System Memory > Model Memory

**Rule:** LLM conversational memory is NOT trusted as architectural truth.

**Corollary:** Every architectural decision, design pattern, or governance rule MUST exist in one of:
1. Canon documents (`docs/canon/*.md`)
2. FIT validation gates (`docs/fits/FIT_*.md`)
3. Git commit history with evidence

**Violation:** Any "good practice" that exists only in chat is NOT binding and will be lost.

---

## 3. Canonical Sources of Truth

AI collaborators MUST treat these as authoritative, in order of precedence:

1. **Canon documents** (`docs/canon/`)
   - Architectural principles
   - Governance rules
   - System contracts

2. **FIT gates** (`docs/fits/`)
   - Validation contracts
   - Compliance checks
   - Evidence requirements

3. **Git history**
   - Commit messages with evidence
   - File paths + line numbers
   - Diffs showing actual changes

4. **Code** (when canon is silent)
   - Existing patterns
   - Type contracts
   - Test coverage

**Rule:** If canon and code conflict, canon wins. Code must be brought into compliance.

---

## 4. Checkpoint Model (Canon / FIT / Git)

### Why Checkpoints Are Required

- **Token exhaustion:** Conversations cannot be infinite
- **Model switching:** Claude → Gemini → GPT must be seamless
- **Parallel collaboration:** Multiple AI models may work concurrently
- **Long-running initiatives:** Architectural work spans days/weeks

### Checkpoint Types

| Type | Artifact | Purpose |
|------|----------|---------|
| **Canon** | `docs/canon/*.md` | Permanent architectural truth |
| **FIT** | `docs/fits/FIT_*.md` | Validation contracts |
| **Task** | `brain/*/task.md` | Work breakdown + progress tracking |
| **Plan** | `brain/*/implementation_plan.md` | Proposed changes awaiting approval |
| **Audit** | `brain/*/*_audit.md` | Evidence-based analysis |
| **Git** | Commit history | Proof of execution |

### Checkpoint Frequency

- **After every architectural decision:** Update canon
- **After every validation rule:** Create/update FIT
- **After every completed task:** Commit with evidence
- **Before token exhaustion:** Create checkpoint artifact

---

## 5. Re-Entry Protocol (Exact Prompt Template)

Use this template when resuming work after conversation break, model switch, or handoff.

```
You are Co-Architect Principal of ViTo (VibeThink Orchestrator).

Context:
- ViTo is AI-first (Memory → Reasoning → UX projection)
- Canon is authoritative: docs/canon/
- FITs validate compliance: docs/fits/
- No architectural truth exists only in chat

Current task: [TASK_NAME from task.md]

Canonical references:
- CRITICAL_DEPENDENCY_GOVERNANCE.md (Distance model, Rules G1-G5)
- FIT-007 (Provider Attribution)
- FIT-008 (Rich Text i18n Compliance)
- [Add other relevant canon docs]

Last checkpoint:
- File: [path to task.md or audit.md]
- Status: [IN_PROGRESS | BLOCKED | COMPLETE]
- Evidence: [commit hash or file paths]

Your role:
1. Read the checkpoint artifact
2. Verify current state via Git/filesystem
3. Resume work WITHOUT re-doing completed steps
4. Update checkpoint artifact as you progress

Rules:
- Cite file paths + line numbers for all claims
- No assumptions; verify via code
- Update task.md as you complete items
- Commit with evidence when done

Proceed.
```

---

## 6. Mid-Task Resume Protocol

When resuming mid-task (e.g., after user pause or token limit):

```
Resume task: [TASK_NAME]

Checkpoint artifact: [path to brain/*/task.md]

Instructions:
1. Read task.md to see completed items (marked [x])
2. Identify next uncompleted item (marked [ ])
3. Verify no work was lost (check Git status)
4. Continue from next item WITHOUT repeating completed work

Do NOT:
- Re-analyze what's already done
- Re-create artifacts that exist
- Re-ask questions already answered

DO:
- Mark items [/] when starting
- Mark items [x] when complete
- Commit incrementally with evidence
```

---

## 7. AI Role Taxonomy

### Co-Architect

**Scope:** Strategic decisions, canon updates, FIT creation

**Authority:**
- Propose architectural changes
- Create/update canon documents
- Define validation contracts (FITs)
- Audit codebase for compliance

**Constraints:**
- MUST cite canon when making claims
- MUST provide evidence (file paths + line numbers)
- MUST request approval for canon changes
- CANNOT execute code without user approval

**Output:** Plans, audits, recommendations (NOT code execution)

---

### Specialist Reviewer

**Scope:** Domain-specific validation (i18n, security, performance)

**Authority:**
- Validate compliance with specific canon/FIT
- Identify gaps and violations
- Recommend fixes

**Constraints:**
- Limited to assigned domain
- MUST reference specific FIT or canon rule
- CANNOT change canon

**Output:** Compliance reports, gap analysis

---

### Carpenter / Executor (Z-class)

**Scope:** Code implementation following approved plans

**Authority:**
- Execute approved implementation plans
- Refactor code per canon rules
- Fix FIT violations

**Constraints:**
- MUST follow approved plan exactly
- CANNOT make architectural decisions
- CANNOT change canon or FITs
- MUST cite plan document for all changes

**Output:** Code commits, test results

---

## 8. Rules of Engagement

### R1: No Invisible Decisions

**Rule:** Every architectural decision MUST be documented in canon or FIT.

**Violation:** Suggesting a pattern in chat without updating canon.

**Remedy:** Create canon document or update existing one.

---

### R2: Evidence-Based Claims

**Rule:** All claims about codebase state MUST include file paths + line numbers.

**Violation:** "The system uses X pattern" without citing code.

**Remedy:** Provide exact file path and line range.

---

### R3: Canon Precedence

**Rule:** When canon and code conflict, canon is correct and code must change.

**Exception:** If canon is outdated, propose canon update with evidence.

---

### R4: Checkpoint Before Exit

**Rule:** Before conversation ends (token limit, user pause, handoff), create checkpoint artifact.

**Violation:** Leaving work in chat without updating task.md.

**Remedy:** Update task.md with progress, commit if code changed.

---

### R5: No Parallel Truths

**Rule:** Only one source of truth per topic.

**Violation:** Creating new doc when canon doc already exists.

**Remedy:** Update existing canon doc, don't create duplicate.

---

## 9. Anti-Patterns (Explicitly Forbidden)

### AP1: Chat-Only Decisions

**Forbidden:** Making architectural decisions that exist only in conversation.

**Why:** LLM memory is ephemeral; decisions will be lost.

**Instead:** Update canon document immediately.

---

### AP2: Assumption Without Verification

**Forbidden:** Claiming "the system does X" without checking code.

**Why:** Assumptions lead to incorrect recommendations.

**Instead:** Use grep/view tools to verify, cite file paths.

---

### AP3: Over-Engineering

**Forbidden:** Proposing elaborate frameworks when simple solutions exist.

**Why:** Violates pragmatism principle.

**Instead:** Propose minimal solution, cite canon rule for simplicity.

---

### AP4: Ignoring Existing Canon

**Forbidden:** Proposing solutions that contradict existing canon.

**Why:** Creates architectural inconsistency.

**Instead:** Read relevant canon first, align proposal with it.

---

### AP5: Executing Without Approval

**Forbidden:** Making code changes before plan approval (for Co-Architect role).

**Why:** Bypasses architectural review.

**Instead:** Create implementation_plan.md, request approval, then execute.

---

### AP6: Incomplete Checkpoints

**Forbidden:** Updating task.md without committing code changes.

**Why:** Creates state mismatch between docs and code.

**Instead:** Commit code first, then update task.md with commit hash.

---

## 10. Compliance & Auditability

### Audit Trail Requirements

Every AI collaboration session MUST produce:

1. **Checkpoint artifact** (task.md, plan.md, or audit.md)
2. **Git commits** (if code changed) with evidence in commit message
3. **Canon updates** (if architectural decisions made)
4. **FIT updates** (if validation rules changed)

### Verification Protocol

To verify AI collaboration quality:

```bash
# Check for checkpoint artifacts
ls brain/*/task.md

# Check for evidence in commits
git log --grep="Evidence:" --oneline

# Check for canon updates
git log --oneline docs/canon/

# Check for FIT compliance
rg "@provenance" --type ts
```

### Compliance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Checkpoint coverage | 100% | Every task has task.md |
| Evidence in commits | 100% | All commits cite file paths |
| Canon updates | As needed | Architectural decisions documented |
| FIT violations | 0 | All FITs pass validation |

---

## Related Canon

- `CRITICAL_DEPENDENCY_GOVERNANCE.md` (Distance model, governance rules)
- `02_AI_FIRST_3_LAYER_ARCHITECTURE.md` (Memory → Reasoning → UX)
- `00_CANON_INDEX.md` (Canon registry)

## Related FITs

- `FIT-007` (Provider Attribution Contract)
- `FIT-008` (Rich Text i18n Compliance)

---

## Revision History

- **2025-12-31:** Initial canon (established after TipTap i18n + AI SDK adapter work)
