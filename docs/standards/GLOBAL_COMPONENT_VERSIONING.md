# Global Component Versioning Standard

**Status**: PROPOSED  
**Scope**: All Internal Components & External Vendors  
**Last Updated**: 2026-01-09

---

## 1. Internal Component Versioning

Each logical component (package, app, or library) in the monorepo has **Independent Versioning**. We do not force a unified version across all packages (`fixed` mode in Lerna/Nx terms), allowing components to mature at their own pace.

### 1.1 Versioning Rules
- **Format**: Semantic Versioning `MAJOR.MINOR.PATCH` (e.g., `1.2.0`).
- **Location**: The source of truth for a component's version is its `package.json` file.
- **Tagging**: When releasing a specific component, the git tag must follow the format:
  - `${component-name}@${version}`
  - Example: `ui@0.2.1`, `dashboard@1.1.0`.

### 1.2 "Lock-Step" Exceptions
Certain core groups may be versioned in lock-step if they are tightly coupled:
- **Core Libraries**: `packages/utils`, `packages/tokens` might be kept in sync if a major breaking change affects the fundamental design system.

---

## 2. External / Vendor Component Versioning

We import and adapt code from external ecosystems (shadcn, bundui, etc.). To avoid "Drift" (when our local copy diverges unknowningly from the source), we must track the **Source Version**.

### 2.1 Tracking Policy
Every component imported from an external library (where code is copied `src/`) must have a version tracking entry.

- **Option A (Preferred):** Use the specialized tracking file `docs/references/VENDOR_VERSIONS.md`.
- **Option B (Header):** If a specific file is a direct 1:1 copy, add a header comment:
  ```typescript
  // Source: shadcn/ui v0.8.0
  // Modified: Yes/No
  ```

### 2.2 Vendor Matrix (Golden Source)
Refer to `docs/references/VENDOR_VERSIONS.md` for the official matrix of:
- **Bundui Premium**: Tracks the version of the purchased kit.
- **Shadcn UI**: Tracks the CLI and registry version used.
- **React Flow**: Tracks the upstream library version.

### 2.3 Drift Management
- **Quarterly Audit**: Every Q, check `VENDOR_VERSIONS.md` against upstream releases.
- **Update Strategy**:
  1. Update the "Vendor Reference" repo (e.g. running `git pull` in the `C:\IA Marcelo Labs\bundui` folder).
  2. Diff functionality.
  3. Port changes to `packages/ui` only if beneficial.
  4. Update the version in `VENDOR_VERSIONS.md` history.

---

## 3. Library Dependencies (npm/pnpm)

- **Strict Versions**: Use exact versions or strictly pinned ranges (`1.2.3` or `~1.2.3`) for critical infrastructure (React, Next.js) to avoid "it works on my machine" issues.
- **Automated Updates**: Dependabot/Renovate should be configured to group updates by component.

---

## 4. Summary Table

| Entity Type | Version Source | Update Frequency | Policy |
|:---|:---|:---|:---|
| **App** (`apps/dashboard`) | `package.json` | Per Release | SemVer Independent |
| **UI Kit** (`packages/ui`) | `package.json` | Frequent | SemVer Independent |
| **Imported Code** (Shadcn) | `VENDOR_VERSIONS.md` | Quarterly / On-Demand | Manual Drift Check |
| **3rd Party Libs** (npm) | `pnpm-lock.yaml` | Continuous | Pinned Strict (`~`) |
