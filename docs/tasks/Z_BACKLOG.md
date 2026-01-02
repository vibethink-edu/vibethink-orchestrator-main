# Z Carpenter – Executable Backlog

All tasks in this backlog are:
- Low-risk
- Deterministic
- Architect-approved
- Suitable for Z execution

---

## Z-001 – i18n Hardcoded String Inventory

**Goal**
Produce a complete inventory of hardcoded user-facing strings.

**Scope**
- apps/**
- packages/**
- ui/**

**Action**
- Scan for string literals not wrapped in `t()`
- Exclude test files

**Commands**
- rg '"[^"]+"' apps packages ui
- rg "t\(" --invert-match

**Deliverable**
- Markdown table:
  - file
  - line
  - string
  - context

**Acceptance**
- No files skipped
- Evidence included
- No modifications made

---

## Z-002 – Translation Placeholder Sync

**Goal**
Ensure all locale files share identical keys.

**Scope**
- src/lib/i18n/translations/

**Action**
- Detect missing keys per locale
- Insert placeholder values: `__MISSING_TRANSLATION__`

**Rules**
- Do NOT translate
- Do NOT rename keys

**Deliverable**
- Diff per locale
- List of added keys

**Acceptance**
- Structural parity achieved
- No semantic changes

---

## Z-003 – Component Export Registry Sync

**Goal**
Ensure index.ts files export all sibling components.

**Scope**
- packages/ui/**
- components/**

**Action**
- Enumerate component files
- Compare against index.ts exports
- Add missing exports only

**Deliverable**
- Diff
- File list

**Acceptance**
- No removals
- No renames
- No reordering unless specified

---

## Z-004 – TODO / FIXME Exhaustive Inventory

**Goal**
Surface all TODO / FIXME markers for triage.

**Scope**
- Entire repo

**Action**
- Scan for TODO, FIXME, HACK, XXX

**Deliverable**
- Markdown list grouped by folder

**Acceptance**
- Zero interpretation
- Raw extraction only

---

## Z-005 – JSON Structural Validation Sweep

**Goal**
Verify all JSON files are syntactically valid.

**Scope**
- **/*.json

**Action**
- Run jq on each file

**Commands**
- jq . file.json

**Deliverable**
- List of invalid files (if any)
- Raw jq output

**Acceptance**
- No fixes applied
- Evidence attached

---

## Z-006 – Registry / Manifest Drift Scan

**Goal**
Detect drift between declared and actual artifacts.

**Scope**
- package.json
- tsconfig paths
- export maps

**Action**
- Compare declarations vs filesystem

**Deliverable**
- Mismatch table

**Acceptance**
- No corrective changes
- Report only

---

## Z-007 – Placeholder Normalization

**Goal**
Normalize known placeholder tokens.

**Scope**
- Docs only

**Rules**
Replace ONLY:
- TBD → __TBD__
- FIXME → __FIXME__

**Deliverable**
- Diff
- File list

**Acceptance**
- No content edits beyond tokens

---

## Z-008 – Canon Cross-Reference Index

**Goal**
Generate index of canon documents.

**Scope**
- docs/canon/**

**Action**
- List files
- Extract title + purpose (first heading)

**Deliverable**
- Markdown index

**Acceptance**
- Read-only
- No edits to canon
