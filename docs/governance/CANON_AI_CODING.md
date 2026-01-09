# Canon AI Coding Methodology

**Status**: CANON
**Version**: 1.0.0
**Date**: 2026-01-04
**Authority**: Principal Architect

---

## 🎯 Executive Summary

This document defines the **AI Coding Methodology** for Vibethink Vito (ViTo). It establishes the rules, roles, and enforcement mechanisms for AI agents operating within the codebase.

**Core Principle**: Agents are force-multipliers, not decision-makers. Canon is law.

---

## 🏛️ Authority Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    1. HUMAN ARCHITECT                       │
│                    (Absolute Authority)                     │
│         Creates Canon. Approves architecture changes.       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    2. CANON DOCUMENTS                       │
│                    (docs/canon/*)                           │
│         Static source of truth. Code follows Canon.         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    3. FIT GATES                             │
│                    (docs/fits/*)                            │
│         Objective validation. Claims require passing FITs.  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    4. CI ENFORCEMENT                        │
│                    (.github/workflows/*)                    │
│         Automated gates. Block violations.                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    5. AI AGENTS                             │
│                    (Claude, Gemini, Codex)                  │
│         Execute within boundaries. Never redefine.          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agent Roles & Permissions

### Role Definitions

| Role | Agent | Authority | Permissions | Constraints |
|------|-------|-----------|-------------|-------------|
| **Auditor** | Claude | VERIFICATION | Read all, Critique, Audit | Cannot execute bulk refactors |
| **Executor** | Gemini | EXECUTION | Read, Write code, Propose docs | Cannot invent architecture |
| **Reviewer** | Claude/Codex | REVIEW | Read PRs, Comment | Cannot approve or merge |
| **Planner** | Human + AI | DESIGN | Propose plans | Plans require Human approval |

### Critical Constraints

1. **No Self-Certification**: Agent cannot close a task it completed. Counter-agent or Human verifies.
2. **Canon First**: Always read `docs/canon/` before proposing changes. Never infer from legacy code.
3. **Explicit Mode**: Agent must declare mode (Audit vs Execute) in reasoning.
4. **No Architecture Invention**: Agents cannot create new patterns without RFC approval.

---

## 🔒 Protected Areas

### Canon Files (CODEOWNERS Protected)

| Path | Protection Level | Approver |
|------|------------------|----------|
| `docs/canon/**` | **ABSOLUTE** | Principal Architect only |
| `docs/fits/**` | **ABSOLUTE** | Principal Architect only |
| `docs/registry/**` | **HIGH** | Principal Architect only |
| `.github/CODEOWNERS` | **ABSOLUTE** | Principal Architect only |
| `AGENTS.md` | **HIGH** | Principal Architect only |

### Reference Directories (Read-Only)

| Path | Status |
|------|--------|
| `apps/bundui-reference/` | **READ-ONLY** - Never modify |
| Any path with `-reference` | **READ-ONLY** - Never modify |

---

## 🚦 CI Gating Policy

### Hard Gates (Block Merge)

| Gate | Script | Trigger |
|------|--------|---------|
| Merge markers | `check-merge-markers.mjs` | All PRs |
| JSON syntax | `check-json-parse.mjs` | All PRs |
| Methodology evidence | `validate-methodology-adoption.mjs` | Registry changes |
| FIT claims | `validate-fit-claims.mjs` | Canon changes |
| Canon approval | `canon-protection.yml` | Canon/Governance changes |

### Soft Gates (Warn Only)

| Gate | Script | Trigger |
|------|--------|---------|
| Hardcoded strings | `check-hardcoding.js` | All PRs |
| Lint warnings | `npm run lint` | All PRs |

---

## ⚠️ Anti-YOLO Rules

### What is YOLO?

YOLO = "You Only Live Once" coding. Making changes without:
- Reading Canon first
- Validating against FIT gates
- Getting proper review
- Following established patterns

### YOLO Detection Triggers

1. PR touches Canon without Architect approval
2. PR claims features with failing FIT gates
3. PR modifies reference directories
4. PR introduces patterns not in Canon
5. PR bypasses pre-commit hooks
6. Agent approves its own work

### Anti-YOLO Enforcement

| Layer | Mechanism |
|-------|-----------|
| Local | Pre-commit hook blocks violations |
| PR | CODEOWNERS requires specific reviewers |
| CI | Automated gates validate claims |
| Merge | Human Tech Lead has final authority |

---

## 📋 Workflow for AI Agents

### Before Starting Any Task

```
1. READ: docs/canon-drafts-es/00_CANON_INDEX_es.md (Spanish Draft)
2. READ: AGENTS.md (project rules)
3. CHECK: docs/fits/FIT_INDEX.md (what's allowed to claim)
4. CHECK: docs/registry/METHODOLOGY_REGISTRY.md (allowed patterns)
5. DECLARE: Mode (Audit | Execute | Review)
```

### During Task Execution

```
1. STAY within Canon boundaries
2. NEVER invent architecture
3. NEVER modify Canon without approval
4. VALIDATE changes against FIT gates
5. DOCUMENT reasoning in PR description
```

### After Task Completion

```
1. RUN: npm run validate:fit-claims
2. RUN: npm run validate:methodology-adoption
3. CREATE: PR with clear description
4. WAIT: For Human or Counter-Agent review
5. DO NOT: Approve your own PR
```

---

## 🔄 Parallel Agent Topology

When 3+ agents work simultaneously:

```
                    Human Architect
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Agent A  │    │ Agent B  │    │ Agent C  │
    │ (Planner)│    │ (Coder)  │    │ (Tester) │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         ▼               ▼               ▼
    ┌─────────────────────────────────────────┐
    │           Shared Repository             │
    │   Canon = READ-ONLY for agents          │
    │   Code = WRITE (separate branches)      │
    └─────────────────────────────────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  CI Pipeline  │
                 │  (Enforcer)   │
                 └───────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Claude Auditor│
                 │ (PR Review)   │
                 └───────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Human Merge   │
                 │ (Final Gate)  │
                 └───────────────┘
```

### Conflict Prevention

1. **Linear History**: Require rebase, not merge commits
2. **Separate Branches**: Each agent works on own branch
3. **Lock Critical Files**: Canon changes serialized through queue
4. **Counter-Agent Review**: Agent A reviews Agent B's work

---

## 📊 FIT Gate Summary

| FIT | Claim | Status | Blocking Level |
|-----|-------|--------|----------------|
| FIT-001 | "Operational Brain" | ❌ FAIL | CRITICAL |
| FIT-002 | "Entity Memory Graph" | ❌ FAIL | CRITICAL |
| FIT-003 | "Communication Events" | ❌ FAIL | HIGH |
| FIT-004 | "Trace Logging" | ❌ FAIL | HIGH |
| FIT-005 | "Shell vs Content" | ✅ PASS | - |
| FIT-006 | "Core + Domain Pack" | ⚠️ PARTIAL | Minor |

**Rule**: Cannot claim feature in README/AGENTS/marketing until FIT passes.

---

## 📖 Related Documents

| Document | Purpose |
|----------|---------|
| [Canon Index](../canon/00_CANON_INDEX.md) | Architectural truth |
| [Agent Governance Model](../canon/AGENT_GOVERNANCE_MODEL.md) | Agent authority |
| [FIT Index](../fits/FIT_INDEX.md) | Validation gates |
| [Methodology Registry](../registry/METHODOLOGY_REGISTRY.md) | Allowed patterns |
| [AGENTS.md](../../AGENTS.md) | Project rules |

---

## ✅ Adoption Checklist

For this methodology to be effective:

- [x] CODEOWNERS file created
- [x] CI gates configured
- [x] Pre-commit hooks enhanced
- [x] FIT claims validator created
- [x] Methodology validator enhanced
- [x] Canon protection workflow added
- [ ] Branch protection rules configured (GitHub Settings)
- [ ] Team members added to CODEOWNERS groups
- [ ] Agents onboarded to new workflow

---

**END OF CANON AI CODING METHODOLOGY**
