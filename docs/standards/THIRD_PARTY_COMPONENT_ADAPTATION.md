# Third-Party Component Adaptation Protocol

**Version:** 1.0.0  
**Status:** ✅ MANDATORY  
**Effective Date:** 2025-12-23  
**Authority:** CTO - Marcelo Escallón

---

## 🎯 Purpose

This protocol defines the **mandatory process** for adapting third-party components (shadcn/ui, bundui, Radix UI, etc.) to our **multilingual stack** with 7-language support.

---

## 📋 Scope

**Applies to:**
- All third-party UI components
- All third-party libraries with user-facing text
- All external templates and themes
- All open-source components integrated into the codebase

**Examples:**
- shadcn/ui components
- bundui premium components
- Radix UI primitives
- React Hook Form
- Date pickers, calendars
- Chart libraries
- Table components

---

## 🔄 Adaptation Workflow

### Phase 1: Assessment

**Before integrating any third-party component:**

1. **Identify all hardcoded strings**
   ```bash
   # Scan component for hardcoded text
   grep -r "\"[A-Za-z]" component-directory/
   ```

2. **Document all text elements**
   - Button labels
   - Placeholder text
   - Error messages
   - Tooltips
   - Aria labels
   - Alt text

3. **Check for locale dependencies**
   - Date formatting
   - Number formatting
   - Currency display
   - Time zones

4. **Assess RTL compatibility**
   - CSS properties (left/right vs inline-start/end)
   - Layout direction
   - Icon positioning

---

### Phase 2: Translation Extraction

**Create translation keys for ALL text:**

1. **Create namespace file**
   ```
   translations/
   ├── en/
   │   └── component-name.json
   ├── es/
   │   └── component-name.json
   └── (ar, zh, fr, pt, de)/
       └── component-name.json
   ```

2. **Extract all strings**
   ```json
   // en/calendar.json
   {
     "months": {
       "january": "January",
       "february": "February",
       // ... all months
     },
     "days": {
       "monday": "Monday",
       "tuesday": "Tuesday",
       // ... all days
     },
     "actions": {
       "today": "Today",
       "clear": "Clear",
       "cancel": "Cancel",
       "apply": "Apply"
     }
   }
   ```

3. **Generate translations for all 7 languages**
   - Use AI for initial translation
   - Review for accuracy
   - Test in UI

---

### Phase 3: Component Wrapping

**Create a multilingual wrapper:**

```typescript
// components/ui/calendar-i18n.tsx
'use client';

import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import { useTranslation } from '@/lib/i18n';
import type { CalendarProps } from '@/components/ui/calendar';

export function Calendar(props: CalendarProps) {
  const { t } = useTranslation('calendar');
  
  return (
    <ShadcnCalendar
      {...props}
      locale={getLocaleForCalendar(locale)}
      labels={{
        today: t('actions.today'),
        clear: t('actions.clear'),
        // ... all labels
      }}
    />
  );
}
```

**Benefits:**
- ✅ Original component untouched (easy updates)
- ✅ Centralized i18n logic
- ✅ Type-safe
- ✅ Reusable

---

### Phase 4: Patch Strategy

**For components that can't be wrapped:**

1. **Create patch file**
   ```bash
   # patches/shadcn-calendar+1.0.0.patch
   diff --git a/node_modules/shadcn-calendar/index.tsx
   --- a/node_modules/shadcn-calendar/index.tsx
   +++ b/node_modules/shadcn-calendar/index.tsx
   @@ -10,7 +10,7 @@
   -  <button>Today</button>
   +  <button>{props.labels?.today || 'Today'}</button>
   ```

2. **Use patch-package**
   ```bash
   npm install patch-package --save-dev
   npx patch-package shadcn-calendar
   ```

3. **Add to package.json**
   ```json
   {
     "scripts": {
       "postinstall": "patch-package"
     }
   }
   ```

---

### Phase 5: Testing

**Mandatory tests for each component:**

1. **Visual test in all 7 languages**
   ```typescript
   // __tests__/calendar.i18n.test.tsx
   describe('Calendar i18n', () => {
     AVAILABLE_LOCALES.forEach(locale => {
       it(`renders correctly in ${locale}`, () => {
         render(<Calendar />, { locale });
         expect(screen.getByText(translations[locale].today)).toBeInTheDocument();
       });
     });
   });
   ```

2. **RTL layout test (Arabic)**
   ```typescript
   it('renders RTL correctly for Arabic', () => {
     render(<Calendar />, { locale: 'ar' });
     expect(document.documentElement).toHaveAttribute('dir', 'rtl');
   });
   ```

3. **Locale formatting test**
   ```typescript
   it('formats dates according to locale', () => {
     const { rerender } = render(<Calendar date={new Date('2025-12-23')} />, { locale: 'en' });
     expect(screen.getByText('12/23/2025')).toBeInTheDocument();
     
     rerender(<Calendar date={new Date('2025-12-23')} />, { locale: 'es' });
     expect(screen.getByText('23/12/2025')).toBeInTheDocument();
   });
   ```

---

## 📝 Documentation Requirements

**For each adapted component, create:**

1. **Adaptation Guide**
   ```markdown
   # Calendar Component - i18n Adaptation
   
   ## Original Source
   - Package: shadcn/ui
   - Version: 1.0.0
   - Original file: components/ui/calendar.tsx
   
   ## Changes Made
   - Created wrapper: components/ui/calendar-i18n.tsx
   - Added translations: translations/*/calendar.json
   - Tested in: All 7 languages
   
   ## Usage
   ```tsx
   import { Calendar } from '@/components/ui/calendar-i18n';
   ```
   
   ## Maintenance
   - Update wrapper when upgrading shadcn/ui
   - Re-test all languages after updates
   ```

2. **Migration Notes**
   - Document breaking changes
   - List deprecated props
   - Provide migration examples

---

## 🚫 Anti-Patterns to Avoid

### ❌ DON'T: Modify third-party source directly

```typescript
// ❌ WRONG: Editing node_modules/component/index.tsx
export function Component() {
  return <button>Save</button>; // Hardcoded!
}
```

### ✅ DO: Create wrapper or patch

```typescript
// ✅ CORRECT: Wrapper
export function Component(props) {
  const { t } = useTranslation('component');
  return <OriginalComponent label={t('save')} {...props} />;
}
```

---

### ❌ DON'T: Use component-specific i18n

```typescript
// ❌ WRONG: Component has its own i18n system
import { useComponentI18n } from 'third-party-lib';

export function Component() {
  const t = useComponentI18n(); // Different from our system!
  return <div>{t('label')}</div>;
}
```

### ✅ DO: Integrate with our i18n system

```typescript
// ✅ CORRECT: Use our unified system
import { useTranslation } from '@/lib/i18n';

export function Component() {
  const { t } = useTranslation('component');
  return <div>{t('label')}</div>;
}
```

---

## 📊 Adaptation Checklist

**Before marking component as "adapted":**

- [ ] All hardcoded strings identified
- [ ] Translation files created for all 7 languages
- [ ] Wrapper or patch implemented
- [ ] Component tested in all 7 languages
- [ ] RTL layout tested (Arabic)
- [ ] Date/number formatting verified
- [ ] Documentation created
- [ ] Migration guide written
- [ ] Tests passing
- [ ] Code review completed

---

## 🔧 Tools and Scripts

### Detection Script

```bash
# scripts/detect-third-party-hardcoded.sh
#!/bin/bash

# Scan third-party components for hardcoded strings
find node_modules/@shadcn -name "*.tsx" -o -name "*.ts" | \
  xargs grep -n "\"[A-Z][a-z]" | \
  grep -v "className" | \
  grep -v "import"
```

### Wrapper Generator

```bash
# scripts/generate-i18n-wrapper.sh
#!/bin/bash

COMPONENT_NAME=$1
NAMESPACE=$2

cat > "components/ui/${COMPONENT_NAME}-i18n.tsx" << EOF
'use client';

import { ${COMPONENT_NAME} as Original${COMPONENT_NAME} } from '@/components/ui/${COMPONENT_NAME}';
import { useTranslation } from '@/lib/i18n';

export function ${COMPONENT_NAME}(props) {
  const { t } = useTranslation('${NAMESPACE}');
  
  return (
    <Original${COMPONENT_NAME}
      {...props}
      // Add i18n props here
    />
  );
}
EOF
```

---

## 🎯 Priority Components

**High Priority (Adapt First):**
1. Form components (inputs, selects, buttons)
2. Date/time pickers
3. Modals and dialogs
4. Tables and data grids
5. Navigation components

**Medium Priority:**
6. Charts and graphs
7. File uploaders
8. Rich text editors
9. Search components
10. Pagination

**Low Priority:**
11. Icons (usually no text)
12. Layout components
13. Utility components

---

## 📚 Examples

### Example 1: Button Component

**Original (shadcn/ui):**
```typescript
// components/ui/button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
```

**Adapted:**
```typescript
// components/ui/button-i18n.tsx
export function Button({ labelKey, children, ...props }) {
  const { t } = useTranslation('common');
  
  return (
    <OriginalButton {...props}>
      {labelKey ? t(labelKey) : children}
    </OriginalButton>
  );
}

// Usage
<Button labelKey="actions.save" />
// Instead of: <Button>Save</Button>
```

---

### Example 2: Date Picker

**Original (react-datepicker):**
```typescript
import DatePicker from 'react-datepicker';

<DatePicker
  selected={date}
  onChange={setDate}
  // Hardcoded locale!
/>
```

**Adapted:**
```typescript
import { useI18n } from '@/lib/i18n';
import { getDatePickerLocale } from '@/lib/i18n/locale-config';

export function DatePickerI18n(props) {
  const { locale } = useI18n();
  const { t } = useTranslation('datepicker');
  
  return (
    <DatePicker
      {...props}
      locale={getDatePickerLocale(locale)}
      dateFormat={getDateFormat(locale)}
      placeholderText={t('placeholder')}
      todayButton={t('today')}
      clearButtonTitle={t('clear')}
    />
  );
}
```

---

## ⚖️ Enforcement

**This protocol is MANDATORY for:**
- All new third-party integrations
- All existing components (gradual migration)
- All updates to third-party libraries

**Non-Compliance:**
- ❌ PR rejected
- ❌ Component cannot be used in production
- ❌ Must be refactored before merge

---

## ✅ Approval

**Approved by:** Marcelo Escallón (CTO)  
**Date:** 2025-12-23  
**Status:** MANDATORY for all development  
**Version:** 1.0.0

---

**Questions or exceptions require CTO approval.**
