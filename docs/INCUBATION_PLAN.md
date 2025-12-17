# 🥚 VibeThink Dev-Kit Incubation Plan

**Objective:** Transform `vibethink-orchestrator` from a Monolith (Folder-based) to a true Monorepo (Package-based) to incubate the "Dev-Kit".

## 📊 Current State Analysis
- **Structure:** Hybrid. Has `lerna.json` but `src/shared` and `src/tools` are just folders, not packages.
- **Dependency Model:** Path Aliases (`@/shared/*`) relying on `tsconfig.json`.
- **Problem:** Code is tightly coupled. You cannot extract `dev-tools` because it likely imports from `src/shared` using relative paths or aliases that won't exist in a new repo.

## 🚀 Execution Strategy

### Phase 1: Structure & CLI (The "Tools" Part)
*Goal: Encapsulate the scripts into a runnable CLI package.*

1.  **Create Workspace:**
    - Create `packages/cli`.
    - Initialize `packages/cli/package.json` with name `@vibethink/cli`.

2.  **Migrate Dev-Tools:**
    - Move contents of `dev-tools/` into `packages/cli/src/`.
    - Refactor `master-orchestrator.ps1` to be a command in `packages/cli/bin/vtk`.
    - **Outcome:** You can run `npm install -g @vibethink/cli` (from local) and use `vtk status` anywhere.

### Phase 2: Configuration as Code
*Goal: Extract specific configs to be reusable.*

1.  **ESLint Config:**
    - Create `packages/eslint-config`.
    - Move `ai-pair-parametric` rules from `.eslintrc.js` to this package.
    - **Outcome:** Apps extend `"extends": ["@vibethink/eslint-config"]`.

### Phase 3: Shared Libraries (The "Methodology" Code)
*Goal: Turn `src/shared` into proper NPM packages.*

1.  **Identify Utils:**
    - Scan `src/shared` for pure functions (no React, no hooks, just logic).
    - Move them to `packages/utils`.
2.  **Identify UI Core:**
    - Scan `src/shared/components` for generic UI.
    - Move them to `packages/ui-core`.
3.  **Refactor Apps:**
    - Update `apps/dashboard` to import from `@vibethink/utils`.
    - **Note:** This is the most labor-intensive part (fixing imports).

## 📅 Immediate Action Plan (Incubation)

1.  [x] **Setup:** Create `packages/` directory and update `package.json` workspaces.
2.  [x] **CLI:** Initialize `@vibethink/cli` in `packages/cli`.
3.  [x] **Migration:** Move `dev-tools/*` to `packages/cli/src` and fix internal paths.
4.  [x] **Binary:** Configure `bin` entry point for `vtk`.
5.  [x] **Config:** Extract `@vibethink/eslint-config`.
6.  [x] **Utils:** Incubate `@vibethink/utils`.
7.  [x] **UI:** Incubate `@vibethink/ui` (Button migrated).

---
8.  [x] **Automation:** Implement `vtk upgrade:bundui` for auto-sync.

---
**Status:** ✅ Incubation Complete (Phases 1-5 executed).
**Next:**
1.  **EXECUTE:** Run `vtk upgrade:bundui --repo <URL>` to pull the latest BundUI version.
2.  Resolve React 19/18 peer dependency warnings.
3.  Migrate remaining UI components.
