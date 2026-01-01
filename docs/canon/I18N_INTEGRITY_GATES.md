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
- `docs/projects` (Legacy recursive artifact)

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

## 5. Definition of Done: "Integrity Trusted"

The repository is considered to be in an "Integrity Trusted" state only when:

1.  **Merge Markers = 0**: `rg "<<<<<<<|=======|>>>>>>>" -S .` returns no matches.
2.  **JSON Syntax = PASS**: `node scripts/check-json-parse.mjs` validates 100% of non-excluded files.
3.  **Runtime Loads**: The core application (dashboard-bundui) loads without crashing due to parsing errors.
4.  **Enforcement**: Integrity status checks are configured as **Required** in Branch Protection.

**Note on Build Status:** A "Build Green" state is separate from "Integrity Trusted". The repository may be Integrity Trusted (safe from corruption) while still carrying Build Debt (e.g., TypeScript errors in UI components).

---

## 6. Runbook: CI Integrity Failure

When the `integrity` CI job fails:

1.  **Stop:** Do NOT attempt to merge or override.
2.  **Diagnose:**
    - Run `rg -n "<<<<<<<|=======|>>>>>>>" -S .` to find merge markers.
    - Run `node scripts/check-json-parse.mjs` to identify broken JSON files.
3.  **Fix:**
    - If markers exist: Resolve the git conflict manually and commit the result.
    - If JSON is invalid: Fix the syntax error (missing commas, quotes, braces).
4.  **Verify:** Run the scripts locally until they PASS.
5.  **Push:** Push the fix to the branch.

**NEVER** use `--no-verify` or force push to bypass these checks if they are failing due to integrity violations.

---

## 7. Scripts Reference

*   `scripts/check-merge-markers.mjs`: Scans for conflict markers in all text files.
*   `scripts/check-json-parse.mjs`: Strict `JSON.parse` validation for all `.json` files.
