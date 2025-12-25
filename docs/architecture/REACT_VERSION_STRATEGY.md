
# React Version Strategy & Coexistence Protocol

**Status:** Active
**Primary Version:** React 19.x (Next.js 15 App Router standard)
**Compatibility Target:** React 18.x (Legacy libraries & Specific Components)

## 1. The "React 19 First" Mandate

VibeThink Orchestrator is architects as a **React 19 native application**.
- All new development (`apps/dashboard`, `packages/ui`) targets React 19 features (Server Components, Actions, useOptimistic, etc.).
- We maintain the latest Next.js 15+ stack.

## 2. The "Dual React" Problem

In a monorepo, many third-party libraries (and some internal legacy code) may strictly declare dependencies on React 18. This creates a "Dual React" hazard where two copies of React are bundled:
1.  React 19 (App Root)
2.  React 18 (Nested node_modules)

**Symptoms:**
- `Error: Objects are not valid as a React child` (Component from one React instance passed to another).
- Hooks failing (`Invalid hook call`).
- Contexts breaking.

## 3. The Resolution Strategy: Forced Overrides

To ensure runtime stability, we strictly enforce **Resolution Overrides** at the root level. We force the entire dependency tree to resolve to our single "Source of Truth" version of React.

**Root `package.json` Configuration:**
```json
{
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

## 4. Coexistence Guidelines for Developers

When adding a new library or component that claims "React 18 only":

1.  **Trust the Override:** Most React 18 libraries function perfectly in React 19 due to backward compatibility. The override handles the npm warning.
2.  **Manual Verification:** Check if the library relies on removed APIs (legacy Context, string refs, etc.).
3.  **Strict Mode:** We run in Strict Mode. If a library crashes solely in Strict Mode, document it here.

## 5. Deprecation Audit (React 18 -> 19)

**Deprecated APIs to Avoid:**
- `ReactDOM.render` -> Use `createRoot` (Default in Next.js).
- `useContext` (legacy behavior) -> Standard `use`.
- `forwardRef` (in some cases) -> React 19 allows refs as props in functional components.

## 6. How to verify your environment
Run the validation script to ensure no version drift:
```bash
node scripts/validate-react-versions.js
```
