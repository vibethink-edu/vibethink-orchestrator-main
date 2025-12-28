# RTL & Hydration Fixes - 2025-12-28

**Fixed by:** Agent Mode (Warp)
**Date:** December 28, 2025
**Branch:** projects-v2-consolidation

## Problem Statement

Projects-v2 had critical RTL (Right-to-Left) support issues when switching to Arabic:
1. Sidebar disappeared on RTL
2. Footer became misconfigured
3. Hydration mismatch errors when changing languages dynamically
4. Missing translation files caused crashes

## Root Causes

### 1. Missing Translation Files in i18n Preload
- **File:** `apps/dashboard/app/layout.tsx`
- **Issue:** Attempting to load non-existent namespaces (`studio.json`, `cowork.json`, `coliving.json`)
- **Why:** These files don't exist as standalone namespace files (only as concept files)
- **Impact:** Console errors when any language was selected

### 2. Document Direction Not Updated Dynamically
- **File:** `apps/dashboard/src/lib/i18n/context.tsx`
- **Issue:** When `setLocale()` changed the language, `document.documentElement.dir` was NOT updated
- **Why:** The HTML dir attribute was set server-side with initial locale and never changed client-side
- **Impact:** RTL/LTR CSS rules didn't apply when language changed dynamically

### 3. Sidebar Positioning Using Hardcoded Direction
- **File:** `apps/dashboard/app/dashboard-bundui/projects-v2/page.tsx`
- **Issue:** Sidebar used `fixed top-0 right-0` (LTR hardcoded positioning)
- **Why:** No RTL-aware CSS (not using CSS logical properties)
- **Impact:** Sidebar stayed on right side even in RTL, or disappeared

### 4. Hydration Mismatch on Language Change
- **Files:** Language switchers in multiple locations
- **Issue:** Server rendered HTML with initial locale, client rendered with changed locale
- **Why:** Language change was client-only without server re-render
- **Impact:** React hydration errors: "Text content does not match server-rendered HTML"

### 5. Footer Not RTL-Aware
- **File:** `apps/dashboard/src/components/layout/footer.tsx`
- **Issue:** Used `md:flex-row` which doesn't respect text direction
- **Why:** No RTL-aware flexbox properties
- **Impact:** Footer alignment broke in RTL

## Solutions Implemented

### Fix #1: Remove Non-Existent Namespace Files
```typescript
// ❌ BEFORE (apps/dashboard/app/layout.tsx:109-131)
preloadNamespaces={[
  'common',
  'navigation',
  'default',
  'theme',
  'hotel',
  'studio',      // ❌ DOESN'T EXIST
  'cowork',      // ❌ DOESN'T EXIST
  'coliving',    // ❌ DOESN'T EXIST
  // ... other namespaces
]}

// ✅ AFTER
preloadNamespaces={[
  'common',
  'navigation',
  'default',
  'theme',
  'hotel',
  // studio, cowork, coliving removed (only concept-*.json exist)
  'chat',
  'projects',
  // ... other namespaces
]}
```

### Fix #2: Update Document Direction on Locale Change
```typescript
// ✅ ADDED to apps/dashboard/src/lib/i18n/context.tsx (line 253)
useEffect(() => {
  if (typeof window !== 'undefined') {
    const isRTL = locale === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    console.log(`[i18n] Updated dir to '${isRTL ? 'rtl' : 'ltr'}' for locale '${locale}'`);
  }
}, [locale]);
```

**Why this works:**
- Runs whenever `locale` changes
- Updates the HTML `dir` attribute to 'rtl' or 'ltr'
- This triggers CSS media queries like `[dir=rtl]` selector
- Tailwind and custom CSS respects the direction automatically

### Fix #3: Use Inline Styles for RTL-Aware Positioning
```typescript
// ❌ BEFORE (projects-v2/page.tsx:184)
<div className="fixed top-0 right-0 h-screen w-[400px] ...">

// ✅ AFTER
<div 
  style={{
    position: 'fixed',
    top: 0,
    [document.documentElement.dir === 'rtl' ? 'left' : 'right']: 0,
    height: '100vh',
    width: '400px',
    // ... other styles
  }}
>
```

**Why this works:**
- Dynamically chooses `left` (RTL) or `right` (LTR) property
- Immediately respects document direction
- No reliance on CSS compilation or Tailwind variants

### Fix #4: Reload Page on Language Change
```typescript
// ✅ ADDED to both language switchers
const handleLanguageChange = (langCode: string) => {
  setLocale(langCode);
  // Reload page to ensure server renders with new locale
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

// Used in onClick handlers instead of direct setLocale()
onClick={() => handleLanguageChange(lang.code)}
```

**Why this works:**
- Sets locale in localStorage/cookie (persists across reload)
- Page reload forces Next.js to re-render on server with new locale
- Server sees new locale cookie and renders HTML correctly
- Eliminates hydration mismatch completely
- User sees seamless transition with correct language + direction

### Fix #5: Make Footer RTL-Aware
```typescript
// ✅ ADDED [direction:inherit] to all footer divs
<div className="... md:flex-row md:py-4 [direction:inherit]">
```

**Why this works:**
- `[direction:inherit]` forces elements to inherit text direction from parent
- Prevents hardcoded direction issues
- Works with flexbox automatically

## Best Practices Documented

### 1. Language Switcher Pattern
When implementing language switchers:
```typescript
const handleLanguageChange = (newLocale: Locale) => {
  setLocale(newLocale);
  window.location.reload(); // ✅ ALWAYS reload on locale change
};
```

**Why:** Prevents hydration mismatches when server-side rendering depends on locale.

### 2. Document Direction Management
Always update `document.documentElement.dir` when locale changes:
```typescript
useEffect(() => {
  document.documentElement.dir = isRTLLocale(locale) ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
}, [locale]);
```

**Why:** CSS media queries and browser layout engine need this to apply RTL rules.

### 3. RTL-Safe Positioning
Use computed styles for position-based properties:
```typescript
// ❌ DON'T: className="right-0"
// ✅ DO: style={{ [isRTL ? 'left' : 'right']: 0 }}
```

**Why:** Tailwind CSS logical properties may not cover all cases; inline styles are guaranteed.

### 4. Namespace Validation
Before adding namespaces to `preloadNamespaces`:
```bash
# Verify file exists in at least one language
ls apps/dashboard/src/lib/i18n/translations/en/*.json | grep "^namespace\.json$"
```

**Why:** Missing files cause console errors and prevent app initialization.

## Testing Checklist for Future Changes

When working with i18n or RTL:

- [ ] Test language switcher in all supported languages
- [ ] Test RTL languages (Arabic) specifically:
  - [ ] Sidebar position correct
  - [ ] Footer alignment correct
  - [ ] Text direction correct
  - [ ] Icons/images not mirrored (unless intentional)
- [ ] Refresh browser after changing language
- [ ] Check console for hydration errors
- [ ] Verify `document.documentElement.dir` updates in DevTools
- [ ] Test with browser DevTools RTL emulation (Chrome DevTools → Rendering → CSS media feature prefers-color-scheme)

## Files Modified

1. `apps/dashboard/app/layout.tsx` - Removed non-existent namespaces from preload
2. `apps/dashboard/src/lib/i18n/context.tsx` - Added useEffect to update document direction
3. `apps/dashboard/app/dashboard-bundui/projects-v2/page.tsx` - Changed sidebar to use computed RTL-aware positioning
4. `apps/dashboard/src/components/layout/footer.tsx` - Added [direction:inherit] for RTL support
5. `apps/dashboard/app/dashboard-bundui/projects-v2/components/LanguageSwitcher.tsx` - Added page reload on language change
6. `apps/dashboard/src/components/i18n/LocaleSelector.tsx` - Added page reload on language change

## Related Documentation

- **README.md** - General stability rules and project overview
- **PROJECT_STATUS.md** - Overall project status and decisions
- **GUIA_MANTENIMIENTO_CONCEPTOS.md** - i18n concept maintenance guide

## Future Improvements

1. **CSS Logical Properties:** Migrate to CSS logical properties (inset-inline-end) when Tailwind v4 fully supports them
2. **RTL Components Library:** Create RTL-safe component wrappers to enforce patterns
3. **Automated Testing:** Add Playwright tests for RTL in Arabic language
4. **Performance:** Consider not reloading page on language change for better UX (requires client-side re-hydration strategy)

---

**Last Updated:** 2025-12-28 by Agent Mode (Warp)
