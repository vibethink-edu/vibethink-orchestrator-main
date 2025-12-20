# Troubleshooting Guide

This document captures common technical issues, their root causes, and resolutions for the VibeThink Orchestrator.

## React & Next.js

### Incident: "Objects are not valid as a React child" (Barrel Export Failure)

**Date:** 2025-12-20  
**Affected Modules:** `@vibethink/ui`, `apps/dashboard` (E-commerce, Fitness)

#### Symptoms
- The application crashes with the error:  
  `Runtime Error: Objects are not valid as a React child (found: object with keys {$$typeof, type, key, props, _owner, _store}). If you meant to render a collection of children, use an array instead.`
- This occurs primarily in **Client Components** (`"use client"`) that import UI components.

#### Root Cause
This issue is caused by a **React Version Mismatch** combined with **Barrel File Exports**.
1.  **Version Mismatch:** The root application (`apps/dashboard`) is running **React 18**. However, `packages/ui` had a strict or hoisted dependency that resolved to **React 19 Types** (or a higher version of declaractions via `@types/react`).
2.  **Serialization Failure:** When Next.js attempts to process the barrel file (`index.ts` in `@vibethink/ui`), the type mismatch causes the Server-to-Client serialization boundary to fail. Next.js receives a raw object representation of a component instead of a valid React Element, which throws the "Objects are not valid" error when rendered.

#### Solution
**Immediate Fix (Recommended):**
Refactor imports to use **Direct Subpath Imports**. Bypass the barrel file entirely.

*   ❌ **BAD:**  
    ```tsx
    import { Card, Button } from "@vibethink/ui";
    ```
*   ✅ **GOOD:**  
    ```tsx
    import { Card } from "@vibethink/ui/components/card";
    import { Button } from "@vibethink/ui/components/button";
    ```
    This ensures that only the specific component code is imported, avoiding the complex dependency graph of the barrel file and improving tree-shaking.

#### Long-Term Fix
Ensure strict dependency alignment across the monorepo.
- Use `overrides` (npm) or `resolutions` (pnpm) in the root `package.json` to force a single React version (e.g., `18.3.1`) and its types (`@types/react@18.3.12`) across all packages.
- Delete `node_modules` and lockfiles to flush out any cached version mismatches.

### Prevention Strategy (BundUI/Package Updates)
To prevent this issue from recurring when updating `BundUI` or `@vibethink/ui`, follow these best practices:

#### 1. Enforce Direct Imports via ESLint
The most robust prevention method is to technically prohibit the use of the barrel import. Add this rule to your root `.eslintrc.json`:

```json
"rules": {
  "no-restricted-imports": [
    "error",
    {
      "paths": [
        {
          "name": "@vibethink/ui",
          "message": "Please import directly from '@vibethink/ui/components/...' to avoid React version mismatch crashes."
        }
      ]
    }
  ]
}
```

#### 2. Strict Version Pinning in `packages/ui`
When updating the UI package:
1.  Open `packages/ui/package.json`.
2.  Ensure `devDependencies` explicitly lists the **exact same version** of React as `apps/dashboard` (e.g., `^18.3.1`, not `^19.0.0` or `latest`).
3.  Check `peerDependencies` to ensure it allows the legacy version (e.g., `">=18"`).
4.  Run `npm list react` in the root to verify no duplicate versions are installed.

