# RTL Implementation Guide for VibeThink Applications

## 🎯 Purpose

This guide documents the **correct way** to implement Right-to-Left (RTL) support in VibeThink applications, specifically for Arabic, Hebrew, Persian, and Urdu languages.

**Target Languages**:
- Arabic (`ar`) - Primary RTL language
- Hebrew (`he`)
- Persian/Farsi (`fa`)
- Urdu (`ur`)

---

## ⚠️ Critical Lessons Learned

### What NOT To Do

❌ **DO NOT** apply global CSS overrides that change flex directions:

```css
/* ❌ WRONG - Breaks Shadcn Sidebar */
html[dir="rtl"] [data-slot="sidebar-wrapper"] {
  flex-direction: row-reverse; /* This breaks the sidebar! */
}

html[dir="rtl"] .flex-row {
  flex-direction: row-reverse !important; /* This moves footer to top! */
}
```

❌ **DO NOT** try to manually position the sidebar with CSS:

```css
/* ❌ WRONG - Conflicts with Shadcn's built-in positioning */
html[dir="rtl"] aside {
  left: auto;
  right: 0;
}
```

### What TO Do

✅ **DO** use the component's built-in `side` prop:

```tsx
// ✅ CORRECT - Let Shadcn handle positioning
<AppSidebar side={isRTL ? "right" : "left"} />
```

✅ **DO** use minimal CSS that only sets direction and text alignment:

```css
/* ✅ CORRECT - Minimal and safe */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

---

## 📋 Implementation Checklist

### 1. HTML Attribute Management

The `dir` attribute on the `<html>` element is the **source of truth** for RTL:

```tsx
// In your i18n context or layout
useEffect(() => {
  const isRTL = locale === 'ar' || locale === 'he' || locale === 'fa' || locale === 'ur';
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', locale);
}, [locale]);
```

**Key Points**:
- Set `dir="rtl"` when language is RTL
- Set `lang` to match the locale
- This happens automatically when locale changes
- Persists across page reloads via cookie

### 2. Component-Level RTL Detection

Components need to detect and react to RTL:

```tsx
export function MyLayout({ children }) {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Initial check
    const direction = document.documentElement.getAttribute('dir');
    setIsRTL(direction === 'rtl');

    // Watch for changes (when user switches language)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          const newDir = document.documentElement.getAttribute('dir');
          setIsRTL(newDir === 'rtl');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Sidebar side={isRTL ? "right" : "left"}>
      {children}
    </Sidebar>
  );
}
```

**Why MutationObserver?**
- Detects dynamic language changes without page reload
- Updates layout immediately when user switches to Arabic
- Works with Shadcn components that depend on `side` prop

### 3. Minimal Global CSS

Keep RTL CSS minimal and non-invasive:

```css
/* Set direction and text alignment */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

html[dir="rtl"] body {
  direction: rtl;
}

/* Flip directional icons */
html[dir="rtl"] .lucide-chevron-left {
  transform: scaleX(-1);
}

html[dir="rtl"] .lucide-chevron-right {
  transform: scaleX(-1);
}

/* Align menus and dropdowns */
html[dir="rtl"] [role="menu"],
html[dir="rtl"] [role="listbox"] {
  text-align: right;
}

/* CRITICAL: DO NOT add flex-direction overrides */
```

---

## 🏗️ Architecture

### Server-Side (SSR)

```typescript
// app/layout.tsx (Server Component)
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const isRTL = locale === 'ar' || locale === 'he' || locale === 'fa' || locale === 'ur';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
```

**Key Points**:
- HTML `dir` attribute set on server
- Prevents flash of incorrect direction
- Cookie persists user's language choice

### Client-Side (React)

```typescript
// i18n context
const setLocale = (newLocale: Locale) => {
  // Save to cookie for SSR
  document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

  // Update HTML immediately
  const isRTL = newLocale === 'ar' || newLocale === 'he' || newLocale === 'fa' || newLocale === 'ur';
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', newLocale);

  // Update state
  setLocaleState(newLocale);
};
```

**Flow**:
1. User selects Arabic from language picker
2. `setLocale('ar')` is called
3. Cookie saved: `NEXT_LOCALE=ar`
4. HTML updated: `<html dir="rtl" lang="ar">`
5. MutationObserver fires in layout components
6. Sidebar updates: `side="right"`
7. On reload: Server reads cookie → Sets `dir="rtl"` → Client syncs

---

## 🎨 Component Patterns

### Shadcn Sidebar (Correct Usage)

```tsx
import { SidebarProvider, SidebarInset, Sidebar } from '@vibethink/ui';

export function DashboardLayout({ children }) {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Detection logic here (see above)
  }, []);

  return (
    <SidebarProvider>
      {/* Use built-in side prop */}
      <Sidebar side={isRTL ? "right" : "left"} variant="inset">
        {/* Sidebar content */}
      </Sidebar>

      <SidebarInset>
        {/* Main content */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer /> {/* Will stay at bottom */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

**Why This Works**:
- Shadcn Sidebar component has built-in RTL support via `side` prop
- `SidebarInset` automatically adjusts margins
- `flex-col` keeps vertical layout (header → content → footer)

### Flex Containers

```tsx
// Horizontal layouts that should reverse in RTL
<div className="flex flex-row items-center gap-2">
  <Icon /> {/* Will be on right in RTL */}
  <Text /> {/* Will be on left in RTL */}
</div>

// Vertical layouts stay the same
<div className="flex flex-col">
  <Header />
  <Content />
  <Footer />
</div>
```

**CSS Behavior**:
- `direction: rtl` automatically reverses `flex-row`
- `flex-col` is NOT affected by `direction`
- No manual overrides needed

### Icons and Arrows

```tsx
// Icons that need flipping in RTL
<ChevronLeft className="w-4 h-4" /> {/* Auto-flipped via CSS */}
<ChevronRight className="w-4 h-4" /> {/* Auto-flipped via CSS */}

// Icons that should NOT flip
<Settings className="w-4 h-4" /> {/* No flip */}
<User className="w-4 h-4" /> {/* No flip */}
```

**CSS**:
```css
html[dir="rtl"] .lucide-chevron-left,
html[dir="rtl"] .lucide-chevron-right {
  transform: scaleX(-1);
}
```

---

## 🧪 Testing Checklist

### Manual Testing

- [ ] **Language Switch**
  1. Start in English
  2. Switch to Arabic
  3. ✅ Sidebar appears on right
  4. ✅ Text aligns right
  5. ✅ Icons flip correctly

- [ ] **Page Reload**
  1. Set language to Arabic
  2. Press F5 to reload
  3. ✅ Page loads in Arabic
  4. ✅ Sidebar stays on right
  5. ✅ No flash of wrong direction

- [ ] **Layout Integrity**
  1. In Arabic mode
  2. ✅ Header at top
  3. ✅ Content in middle
  4. ✅ Footer at bottom (NOT at top!)
  5. ✅ Sidebar visible and functional

- [ ] **Dynamic Switching**
  1. Switch Arabic → English
  2. ✅ Sidebar moves left
  3. Switch English → Arabic
  4. ✅ Sidebar moves right
  5. ✅ No page reload needed

### Automated Testing

```tsx
describe('RTL Support', () => {
  it('sets dir attribute when locale is Arabic', () => {
    render(<App initialLocale="ar" />);
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });

  it('positions sidebar on right for RTL', () => {
    render(<Dashboard locale="ar" />);
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveAttribute('data-side', 'right');
  });

  it('keeps footer at bottom in RTL', () => {
    render(<Layout locale="ar" />);
    const footer = screen.getByRole('contentinfo');
    const content = screen.getByRole('main');

    // Footer should come after content in DOM
    expect(content.nextElementSibling).toBe(footer);
  });
});
```

---

## 🐛 Troubleshooting

### Sidebar Disappears in RTL

**Problem**: Sidebar is not visible when switching to Arabic

**Cause**: Global CSS is overriding Shadcn's positioning

**Solution**:
1. Remove any `flex-direction: row-reverse` on sidebar containers
2. Use `side` prop instead: `<Sidebar side={isRTL ? "right" : "left"} />`
3. Check `globals.css` for interfering rules

### Footer Appears at Top

**Problem**: Footer renders above content in RTL

**Cause**: Global `flex-row-reverse` being applied to `flex-col` containers

**Solution**:
1. Remove global `flex-row-reverse` rules
2. Use explicit `flex-col` on vertical containers
3. Ensure `direction: rtl` doesn't override vertical flex

### Layout "Flashes" on Load

**Problem**: Page loads in LTR then switches to RTL

**Cause**: Server not setting initial `dir` attribute

**Solution**:
1. Set `dir` in server component (see Architecture section)
2. Read locale from cookie on server
3. Include `dir` in initial HTML

### Icons Don't Flip

**Problem**: Directional icons (arrows, chevrons) don't flip in RTL

**Cause**: Missing CSS transform

**Solution**:
```css
html[dir="rtl"] .lucide-chevron-left,
html[dir="rtl"] .lucide-chevron-right {
  transform: scaleX(-1);
}
```

---

## 📚 Reference Implementation

### File Locations

1. **Server Layout** - Sets initial dir
   ```
   apps/dashboard/app/layout.tsx (lines 88-93)
   ```

2. **i18n Context** - Updates dir on change
   ```
   apps/dashboard/src/lib/i18n/context.tsx (lines 140-146, 256-281)
   ```

3. **Dashboard Layout** - Detects and reacts to RTL
   ```
   apps/dashboard/app/dashboard-bundui/layout.tsx (lines 25-50)
   ```

4. **Global CSS** - Minimal RTL rules
   ```
   apps/dashboard/app/globals.css (lines 68-100)
   ```

### Complete Example

See working implementation:
- **URL**: http://localhost:3007/dashboard-bundui/projects-v2
- **Switch to Arabic**: Use language picker
- **Verify**: Sidebar on right, text aligned right, footer at bottom

---

## 📖 Best Practices

### DO ✅

1. **Trust the browser**: `direction: rtl` handles most layout automatically
2. **Use component props**: `side="right"` for explicit control
3. **Keep CSS minimal**: Only set direction and alignment
4. **Use MutationObserver**: For dynamic language switching
5. **Test on reload**: Ensure persistence works
6. **Document exceptions**: Note any components that need special handling

### DON'T ❌

1. **Override flex globally**: Breaks layouts
2. **Manually position**: Let components handle it
3. **Use !important**: Usually indicates wrong approach
4. **Forget server-side**: Prevents flash of wrong direction
5. **Skip testing**: RTL bugs are subtle
6. **Hardcode directions**: Always derive from locale

---

## 🔄 Migration Guide

### From Broken RTL to Working RTL

If you have existing RTL that's broken:

1. **Remove problematic CSS**:
   ```diff
   - html[dir="rtl"] [data-slot="sidebar-wrapper"] {
   -   flex-direction: row-reverse;
   - }
   - html[dir="rtl"] .flex-row {
   -   flex-direction: row-reverse !important;
   - }
   ```

2. **Add component-level detection**:
   ```tsx
   + const [isRTL, setIsRTL] = useState(false);
   + useEffect(() => {
   +   // MutationObserver setup
   + }, []);
   ```

3. **Use built-in props**:
   ```tsx
   - <Sidebar />
   + <Sidebar side={isRTL ? "right" : "left"} />
   ```

4. **Keep minimal CSS**:
   ```css
   html[dir="rtl"] {
     direction: rtl;
     text-align: right;
   }
   ```

---

## 📞 Support

### Questions?

- **Documentation**: This file + `/docs/i18n/`
- **Examples**: `/apps/dashboard/app/dashboard-bundui/`
- **Reference**: Shadcn Sidebar docs

### Reporting Issues

When reporting RTL issues, include:
1. Current locale
2. Expected behavior
3. Actual behavior
4. Screenshots (both LTR and RTL)
5. Browser console errors
6. Steps to reproduce

---

**Last Updated**: 2025-12-27
**Version**: 1.0.0
**Status**: ✅ Production Ready
**Author**: VibeThink i18n Team
