---
name: AI-Ready Task
about: Create a task that AI agents can execute with clear boundaries
title: '[AI-READY] '
labels: 'ai-ready, needs-triage'
assignees: ''
---

## 📋 Task Summary
<!-- One sentence describing what needs to be done -->


## 🎯 Acceptance Criteria
<!-- Clear, measurable criteria for completion -->
- [ ]
- [ ]
- [ ]

## 🚧 Boundaries & Constraints

### ✅ In Scope
<!-- What the agent IS allowed to do -->
-
-

### ❌ Out of Scope
<!-- What the agent must NOT do -->
- Do NOT modify Canon files (`docs/canon/**`)
- Do NOT modify reference directories (`*-reference/**`)
- Do NOT invent new architectural patterns
-

## 📚 Context & References

### Required Reading
<!-- Documents agent must read before starting -->
- [ ] `docs/canon/00_CANON_INDEX.md`
- [ ] `AGENTS.md`
- [ ]

### Related FIT Gates
<!-- Which FITs apply to this task -->
| FIT | Status | Relevant |
|-----|--------|----------|
| FIT-001 | ❌ FAIL | ☐ |
| FIT-002 | ❌ FAIL | ☐ |
| FIT-005 | ✅ PASS | ☐ |
| FIT-006 | ⚠️ PARTIAL | ☐ |

### Related Files
<!-- Key files that may need modification -->
- `path/to/file1.ts`
- `path/to/file2.tsx`

## 🔍 Validation Steps
<!-- How to verify the task is complete -->
1. [ ] Run `npm run validate:fit-claims`
2. [ ] Run `npm run lint`
3. [ ] Run `npm run type-check`
4. [ ] Manual verification:

## 🏷️ Task Metadata

### Complexity
<!-- Simple | Medium | Complex -->
- [ ] Simple (1-2 files, clear changes)
- [ ] Medium (3-5 files, some decisions)
- [ ] Complex (6+ files, architectural impact)

### Agent Mode
<!-- Audit | Execute | Review -->
- [ ] **Execute**: Make code changes
- [ ] **Audit**: Review and report findings
- [ ] **Review**: Check existing PR

### Estimated Effort
<!-- For planning only - agents don't estimate time -->
- Files to modify:
- New files to create:
- Tests required: Yes / No

## ⚠️ Risk Flags
<!-- Check all that apply -->
- [ ] Touches security-sensitive code
- [ ] Modifies shared packages (`packages/*`)
- [ ] Affects i18n/translations
- [ ] Changes database schema
- [ ] Impacts authentication/authorization

---

## 🤖 Agent Instructions

**Before starting:**
1. Read all documents in "Required Reading"
2. Confirm you understand the boundaries
3. Declare your mode: `MODE: Execute` or `MODE: Audit`

**During execution:**
1. Stay within the defined scope
2. Do NOT modify files outside scope
3. Ask for clarification if ambiguous

**After completion:**
1. Run all validation steps
2. Create PR with clear description
3. Link PR to this issue
4. Wait for review (do NOT approve yourself)

---

*This template ensures AI agents have clear, bounded tasks with explicit constraints.*
