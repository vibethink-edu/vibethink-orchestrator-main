# ViTo Governance Baseline v1 (VGB-1)

## 1. Purpose & Authority

This document establishes the **VGB-1** standard as the sole canonical governance baseline for the ViTo platform. It defines the minimum non-negotiable rules for technology selection, structural organization, and auditability.

**Authority**:
*   This standard supersedes all previous governance methodologies.
*   Enforcement is automated via CI/CD pipelines and Static Analysis.
*   Violations of **Blocker** rules mandate immediate rejection of code contributions.

## 2. Scope

This baseline applies to:
*   **All new code** contributed to the monorepo.
*   **Third-party dependencies** candidate for inclusion.
*   **Architecture & File Structure** modifications.
*   **Audit trails** for sensitive operations.

It does **not** cover specific feature implementation details, which are governed by specialized FIT documents.

## 3. Stack Acceptance Rules (Static Norms)

All technology stack decisions must comply with the following static norms. These are hard constraints.

### 3.1. Licensing Constraints
**Permitted**: MIT, Apache 2.0, BSD-3-Clause, ISC.
**Restricted**: MPL-2.0, LGPL (Review required).
**BLOCKED (Absolute Rejection)**:
*   GPL 3.0 / GPL 2.0 (Viral risk)
*   AGPL (Viral risk)
*   Proprietary / Closed Source (without enterprise license)
*   UNLICENSED (Legal risk)

### 3.2. Technical Constraints
**BLOCKED Frameworks**:
*   Angular (Incompatible architecture)
*   Vue.js (Incompatible ecosystem)
*   Svelte (Incompatible ecosystem)
*   jQuery (Legacy obsolescence)

**Mandatory Baselines**:
*   **Runtime**: Node.js >= 18 LTS
*   **Language**: TypeScript >= 5.0 (Strict Mode)
*   **Format**: ESM (ECMAScript Modules) primarily

## 4. Naming & Structure (References)

Governance over naming and structure is delegated to the specific sealed canonical standards. VGB-1 enforces strict adherence to:

1.  **Code Structure**: MUST follow `CORE_VITO_ARCHITECTURE.md`.
    *   *Violation*: Creating top-level directories outside the defined canon.
2.  **Naming Conventions**: MUST follow `docs/standards/NAMING_CONVENTIONS.md`.
    *   *Rule*: `kebab-case` for files/directories; `PascalCase` for Components/Classes.
    *   *Rule*: Domain-First naming (e.g., `user-profile` not `utils-user`).

## 5. Audit & Traceability

The Source of Truth for all governance states is **Git History**.

### 5.1. Authoritative State
*   **Git Commit**: The only valid proof of change. Manual "signatures" or "stamps" in files are invalid and prohibited.
*   **SemVer**: Versioning applies to release artifacts (packages) via `package.json`, not to the governance methodology itself.

### 5.2. Transparency
*   **No Obfuscation**: Code must be readable and explicit.
*   **No Shadow Logic**: Governance rules must be explicit in configuration (e.g., eslint config), not hidden in opaque scripts.

## 6. Governance Integrity (SSOT)

**Single Source of Truth (SSOT)** is the primary architectural principle.

1.  **No Duplicates**: Logic, scripts, and documentation must exist in exactly one canonical location.
    *   *Action*: Duplicate tools found during audit must be deleted immediately.
2.  **No "Shadow" Copies**: Local copies of platform libraries (e.g., `_utils_copy`) are prohibited.
3.  **Reference Integrity**: Imports must resolve to the canonical module defined in `tsconfig.json` paths, not relative paths acting as bypasses.

## 7. Deprecations & Prohibitions

The following patterns are explicitly **PROHIBITED** under VGB-1:

1.  **Methodological Branding in Naming**:
    *   Files or variables named after management methodologies (e.g., `xtp-*`, `xtr-*`, `aipair-*`) are banned. Naming must describe **function**.
2.  **Numeric Directory Prefixes**:
    *   Top-level documentation folders starting with `01_`, `02_`, etc., are prohibited. Use semantic names (`docs/canon`, `docs/guides`).
3.  **Manual Governance Artifacts**:
    *   "Compliance Certificates", "Sign-off Sheets", or "Execution Logs" stored as code files are prohibited. Pipeline results are the only compliance artifact.
