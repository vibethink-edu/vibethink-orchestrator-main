# Third-Party Component i18n Adaptation Guide

**Version:** 2.0.0  
**Last Updated:** 2025-12-25  
**Status:** ✅ ACTIVE - Part of Third-Party Component Management System

---

## 📌 Document Scope

This document focuses **exclusively on i18n (internationalization) adaptation** of third-party components for VibeThink's 9-language support.

**For complete third-party component management, see:**
- `docs/architecture/THIRD_PARTY_COMPONENTS_POLICY.md` - Overall policy & workflow
- `docs/architecture/THIRD_PARTY_ONBOARDING_QA.md` - Component validation checklist
- `docs/architecture/REACT_VERSION_STRATEGY.md` - React version compatibility

---

## 🎯 Purpose

Define the **mandatory i18n adaptation process** for third-party components to ensure they work seamlessly across all 9 VibeThink languages:
- English (en)
- Spanish (es)
- Arabic (ar)
- Chinese (zh)
- French (fr)
- Portuguese (pt)
- German (de)
- Japanese (ja)
- Hindi (hi)

---

## 🔄 i18n Adaptation Workflow

### Phase 1: Text Audit

**Identify all user-facing text:**

```bash
# Scan component for hardcoded strings
grep -rn '"[A-Za-z]' component-directory/ | grep -v 'className\|import'
```

**Document:**
- Button labels
- Placeholder text
- Error/success messages
- Tooltips & aria-labels
- Alt text
- Status messages

---

### Phase 2: Translation Extraction

**Create namespace files for all 9 languages:**

```
apps/dashboard/src/lib/i18n/translations/
├── en/component-name.json
├── es/component-name.json
├── ar/component-name.json
├── zh/component-name.json
├── fr/component-name.json
├── pt/component-name.json
├── de/component-name.json
├── ja/component-name.json
└── hi/component-name.json
```

**Example structure:**
```json
{
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "labels": {
    "name": "Name",
    "email": "Email"
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred"
  }
}
```

---

### Phase 3: Component Wrapping (Preferred Method)

**Create i18n wrapper:**

```typescript
// components/ui/calendar-i18n.tsx
'use client';

import { Calendar as OriginalCalendar } from '@/components/ui/calendar';
import { useTranslation } from '@/lib/i18n';
import type { CalendarProps } from '@/components/ui/calendar';

export function Calendar(props: CalendarProps) {
  const { t } = useTranslation('calendar');
  
  return (
    <OriginalCalendar
      {...props}
      labels={{
        today: t('actions.today'),
        clear: t('actions.clear'),
        apply: t('actions.apply')
      }}
    />
  );
}
```

**Benefits:**
- ✅ Original component untouched (easy updates)
- ✅ Centralized i18n logic
- ✅ Type-safe
- ✅ Reusable across app

---

### Phase 4: RTL Support (Arabic)

**Ensure RTL compatibility:**

```typescript
import { useI18n } from '@/lib/i18n';

export function ComponentI18n(props) {
  const { locale, dir } = useI18n();
  const { t } = useTranslation('component');
  
  return (
    <div dir={dir} className={dir === 'rtl' ? 'rtl-specific-styles' : ''}>
      <OriginalComponent
        {...props}
        labels={/* translated labels */}
      />
    </div>
  );
}
```

**CSS considerations:**
```css
/* Use logical properties for RTL */
.component {
  margin-inline-start: 1rem; /* Instead of margin-left */
  padding-inline-end: 0.5rem; /* Instead of padding-right */
}
```

---

### Phase 5: Locale-Specific Formatting

**Date/Time formatting:**
```typescript
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/i18n/locale-config';

export function DateDisplay({ date }: { date: Date }) {
  const { locale } = useI18n();
  
  return (
    <span>
      {format(date, 'PPP', { locale: getDateFnsLocale(locale) })}
    </span>
  );
}
```

**Number/Currency formatting:**
```typescript
export function PriceDisplay({ amount }: { amount: number }) {
  const { locale } = useI18n();
  
  return (
    <span>
      {new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD'
      }).format(amount)}
    </span>
  );
}
```

---

## 🧪 Testing Requirements

### Mandatory i18n Tests

```typescript
// __tests__/component.i18n.test.tsx
import { render, screen } from '@testing-library/react';
import { AVAILABLE_LOCALES } from '@/lib/i18n/config';

describe('Component i18n', () => {
  AVAILABLE_LOCALES.forEach(locale => {
    it(`renders correctly in ${locale}`, () => {
      render(<Component />, { wrapper: createI18nWrapper(locale) });
      // Verify translated text appears
    });
  });
  
  it('renders RTL correctly for Arabic', () => {
    render(<Component />, { wrapper: createI18nWrapper('ar') });
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });
});
```

---

## 📊 i18n Adaptation Checklist

**Before marking component as i18n-ready:**

- [ ] All hardcoded strings extracted
- [ ] Translation files created for all 9 languages
- [ ] Wrapper component created
- [ ] Component tested in all 9 languages
- [ ] RTL layout tested (Arabic)
- [ ] Date/number formatting verified for all locales
- [ ] Accessibility (aria-labels) translated
- [ ] Documentation updated

---

## 🚫 Common i18n Anti-Patterns

### ❌ DON'T: Hardcode text in components

```typescript
// ❌ WRONG
export function Button() {
  return <button>Save</button>;
}
```

### ✅ DO: Use translation keys

```typescript
// ✅ CORRECT
export function Button() {
  const { t } = useTranslation('common');
  return <button>{t('actions.save')}</button>;
}
```

---

### ❌ DON'T: Use component-specific i18n libraries

```typescript
// ❌ WRONG: Different i18n system
import { useComponentI18n } from 'third-party-lib';
```

### ✅ DO: Use VibeThink's unified i18n

```typescript
// ✅ CORRECT: Our system
import { useTranslation } from '@/lib/i18n';
```

---

### ❌ DON'T: Concatenate translated strings

```typescript
// ❌ WRONG: Breaks in some languages
const message = t('hello') + ' ' + userName + '!';
```

### ✅ DO: Use interpolation

```typescript
// ✅ CORRECT: Proper interpolation
const message = t('greeting', { name: userName });
// Translation: "Hello {{name}}!"
```

---

## 🔧 i18n Tools & Scripts

### Hardcoded Text Detector

```bash
# scripts/detect-hardcoded-text.sh
#!/bin/bash
find apps/dashboard -name "*.tsx" -o -name "*.ts" | \
  xargs grep -n '"[A-Z][a-z]' | \
  grep -v 'className\|import\|type\|interface' | \
  grep -v 'node_modules'
```

### Translation Completeness Checker

```bash
# scripts/check-translation-completeness.sh
#!/bin/bash
# Verify all 9 languages have same keys
node scripts/validate-9-language-compliance.js
```

---

## 📚 Real-World Examples

### Example: Form Component

```typescript
// components/forms/contact-form-i18n.tsx
'use client';

import { useTranslation } from '@/lib/i18n';
import { ContactForm as OriginalForm } from './contact-form';

export function ContactForm(props) {
  const { t } = useTranslation('forms');
  
  return (
    <OriginalForm
      {...props}
      labels={{
        name: t('fields.name'),
        email: t('fields.email'),
        message: t('fields.message'),
        submit: t('actions.submit')
      }}
      placeholders={{
        name: t('placeholders.name'),
        email: t('placeholders.email'),
        message: t('placeholders.message')
      }}
      validation={{
        required: t('validation.required'),
        invalidEmail: t('validation.invalidEmail')
      }}
    />
  );
}
```

---

## ⚖️ Enforcement

**This i18n adaptation is MANDATORY for:**
- All third-party components with user-facing text
- All form components
- All navigation components
- All data display components

**Non-Compliance:**
- ❌ PR will be rejected
- ❌ Component cannot be used in production
- ❌ Must be refactored before merge

---

## 📞 Questions?

**For i18n-specific questions:**
- Review `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`
- Check `docs/i18n-guide.md`

**For general third-party component questions:**
- Review `docs/architecture/THIRD_PARTY_COMPONENTS_POLICY.md`

---

**Last Updated:** 2025-12-25  
**Maintained by:** VibeThink Architecture Team  
**Version:** 2.0.0
