# I18n Integrity Gates

**Status:** CANON  
**Owner:** Platform Engineering / Co-Architect Principal  
**Last Updated:** 2025-12-31

---

## 1. Purpose

To guarantee the structural integrity of the codebase by preventing invalid artifacts (merge markers, broken JSON) from ever entering the `main` branch. This is particularly critical for `translations/**/*.json` files which must remain machine-readable at all times.

---

## 2. Invariant: WIT-I18N-001

**Rule:** No file in the repository (especially under `translations/`) may contain Git merge markers (`<<<<<<<`, `=======`, `>>>>>>>`) or invalid JSON syntax.

**Violation:** A blocking failure in the CI pipeline.
**Severity:** CRITICAL (Blocks Build/Deploy).

---

## 3. Scope & Exclusions

The integrity gates scan the **entire repository** with the following canonical exclusions, which must be strictly classified:

### Category A: Generated/Build Artifacts (Ignored)
- `node_modules`
- `.git`
- `.next`
- `dist`
- `build`
- `coverage`
- `.turbo`
- `out`
- `vendor`
- `tmp`

### Category B: Archived Legacy / Non-Productive (Quarantined)
- `.cursor` (Local configuration snippets, known schema issues)
- `_legacy` (Deprecated tools, not part of production build)
- `packages/cli/src/validation` (Legacy report templates with invalid JSON fragments)
- `docusaurus-dev` (Legacy documentation requirements)

### Rule: No Productive Code Exclusion
**NO** productive code path (e.g., `apps/`, `packages/ui/`) may ever be excluded from these gates. Any JSON error in productive code must be fixed, not ignored.

All other files (including root configs like `package.json`, `turbo.json`, and all `apps/` source code) are subject to validation.

---

## 4. Enforcement Layers

### Layer 1: Local (Recommended)
Developers should run checks locally before pushing.
```bash
node scripts/check-merge-markers.mjs
node scripts/check-json-parse.mjs
```

### Layer 2: Continuous Integration (Required)
The `.github/workflows/integrity-gates.yml` workflow runs on every Pull Request and matching push.
- **Job:** `integrity`
- **Steps:** `check-merge-markers`, `check-json-parse`

### Layer 3: Branch Protection (Mandatory)
The `integrity` job status check MUST be configured as **Required** for merging into `main`.
- **System:** GitHub Branch Protection Rules
- **Policy:** "Require status checks to pass before merging" -> `integrity`

---

## 5. Recovery Protocol

If the gate fails:

1.  **Identify the culprit:** Read the CI log for `❌ Invalid JSON in ...` or `❌ Merge marker found in ...`.
2.  **Fix locally:** Run the scripts locally to reproduce.
3.  **Resolve:**
    *   For markers: complete the merge resolution and commit.
    *   For JSON: fix the syntax error (commas, quotes, brackets).
4.  **Verify:** Run scripts again until `✅ PASSED`.
5.  **Push:** Update the PR.

---

## 6. Scripts Reference

*   `scripts/check-merge-markers.mjs`: Scans for conflict markers in all text files.
*   `scripts/check-json-parse.mjs`: strict `JSON.parse` validation for all `.json` files.
