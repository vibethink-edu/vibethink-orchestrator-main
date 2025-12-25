
### Incident: i18n Implementation Issues (Projects Module)

**Date:** 2025-12-25
**Affected Modules:** `src/lib/i18n`, `RecentProjectsTable.tsx` (Projects)

#### Symptoms
1. **Side-Effect in Render:** "Cannot update a component while rendering a different component"
2. **Rules of Hooks Violation:** "Rendered more hooks than during the previous render"
3. **TypeError:** "Cannot read properties of undefined (reading 'language')"

#### Root Causes
1. **Side-Effect:** Calling `loadNamespace` (which updates state) directly inside the `t()` function during render.
2. **Hook Violation:** Calling `useTranslation` inside a helper function (`getStatusBadge`) that is called within a loop in the render method.
3. **API Misunderstanding:** Destructuring `i18n` from `useTranslation` when the custom hook only returns `{ t, locale }`, leading to undefined access.

#### Solutions applied

**1. Side-Effect Fix (Context Pattern):**
Moved the `loadNamespace` triggering logic out of the `t()` function (render phase) and into a `useEffect` within the `useTranslation` hook.

```typescript
// ✅ CORRECT PATTERN
export function useTranslation(namespace) {
  const { loadNamespace } = useI18n();
  // Trigger side-effect (loading) in Effect, not Render
  useEffect(() => { loadNamespace(namespace); }, [namespace]);
  // ...
}
```

**2. Rules of Hooks Fix (Component Refactor):**
Refactoring helper functions to be pure functions that accept `t` as an argument, rather than calling hooks internally.

```tsx
// ❌ WRONG
const getBadge = () => { const {t} = useTranslation(); return t(...); }

// ✅ CORRECT
const getBadge = (t) => { return t(...); }
// Call in component: getBadge(t)
```

**3. API Usage Fix:**
Correctly destructuring the available properties from the custom hook.

```tsx
// ❌ WRONG
const { t, i18n } = useTranslation('ns'); 
console.log(i18n.language); // undefined

// ✅ CORRECT
const { t, locale } = useTranslation('ns');
console.log(locale); // 'en', 'es', etc.
```

#### Lessons Learned for Agents
*   **Verify Hook Signatures:** Never assume a custom hook follows the exact signature of a 3rd party library (like `react-i18next`). Read the hook definition first.
*   **Pure Render Phase:** `t()` functions should be pure string formatters. If data fetching is needed, it must be triggered by effects or loaders, not by the translation function itself.
*   **Hook Placement:** Never use hooks inside conditional logic, loops, or nested functions. Pass dependencies as arguments instead.

### Incident: Missing Translations after Merging i18n Keys

**Date:** 2025-12-25
**Affected Modules:** `Projects`, `i18n`

#### Symptoms
*   Translated text (like "Resumen", "Proyectos") appeared in standard English despite `src/locales/es.json` being updated correctly.
*   The `useTranslation('projects')` hook was working (no errors), but returned keys or English fallbacks instead of expected Spanish/Arabic values.

#### Root Cause
1.  **Split File Structure:** The `apps/dashboard` uses a split/code-splitting strategy for translations located in `apps/dashboard/src/lib/i18n/translations/[locale]/[namespace].json`.
2.  **Misleading Root File:** We updated `src/locales/[locale].json`, assuming this was the single source of truth. However, the dashboard's dynamic loader ignores this root file for specific namespaces when running in the app context.
3.  **Dynamic Loading:** The `loader.ts` specifically imports from `./translations/${locale}/${namespace}.json`.

#### Solution
*   **Update Namespace Specific Files:** We had to manually update `apps/dashboard/src/lib/i18n/translations/es/projects.json`, `en/projects.json`, and `ar/projects.json`.
*   **Merge Keys:** Copying the full content from `src/locales` to these specific files resolved the issue.

#### Lessons Learned for Agents
*   **Check `loader.ts` Logic:** Always inspect how translations are loaded. If it uses `import('./translations/...')`, editing a root `src/locales` file is useless.
*   **Verify File Structure:** Look for `translations` or `locales` directories *inside* the specific app (`apps/dashboard`) before assuming a root `products/locales` folder applies.
*   **Bundui Premium Import:** When importing modules from Bundui Premium, remember to split their translation keys into the appropriate per-module JSON file in `apps/dashboard/src/lib/i18n/translations/[locale]/...`.
