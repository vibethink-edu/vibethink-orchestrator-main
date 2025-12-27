# i18n Integration Guide for @vibethink/utils

## 🎯 Purpose

This guide is for developers integrating third-party modules, libraries, or custom components with the VibeThink stack.

**CRITICAL**: All integrations MUST support the VibeThink i18n protocol.

---

## 🚨 Non-Negotiable Requirements

Before your module can be integrated:

1. ✅ **9 Languages**: English, Spanish, French, Portuguese, German, Italian, Korean, Arabic, Chinese
2. ✅ **100% Coverage**: English and Spanish must be complete
3. ✅ **RTL Support**: Full Right-to-Left support for Arabic
4. ✅ **No Hardcoded Strings**: All UI text must use translation functions
5. ✅ **Fallback System**: Missing translations fall back to English

**Failure to comply = Automatic rejection**

---

## 📚 Quick Reference

### Supported Languages

```typescript
export const SUPPORTED_LOCALES = [
  'en', // English (Base - 100% required)
  'es', // Spanish (Base - 100% required)
  'fr', // French
  'pt', // Portuguese
  'de', // German
  'it', // Italian
  'ko', // Korean
  'ar', // Arabic (RTL required)
  'zh', // Chinese
] as const;

export type Locale = typeof SUPPORTED_LOCALES[number];
```

### Default Locale

```typescript
export const DEFAULT_LOCALE: Locale = 'en'; // Fallback
```

---

## 🛠️ Integration Methods

### Method 1: Pure i18n Module (Recommended)

If your module is pure logic without UI:

```typescript
// your-module/i18n/translations/en.json
{
  "errors": {
    "network": "Network error occurred",
    "timeout": "Request timed out"
  },
  "messages": {
    "success": "Operation completed successfully"
  }
}
```

```typescript
// your-module/index.ts
import { term } from '@vibethink/utils';

export async function yourFunction() {
  try {
    // Your logic
  } catch (error) {
    const message = await term('your-module:errors.network');
    throw new Error(message);
  }
}
```

### Method 2: React Component with i18n

If your module includes React components:

```tsx
// your-module/Component.tsx
import { useTranslation } from '@/lib/i18n';

export function YourComponent() {
  const { t } = useTranslation('your-module');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

### Method 3: Wrapping Third-Party Library

If you're integrating an external library without i18n:

```tsx
// wrappers/ThirdPartyWrapper.tsx
import { SomeLibrary } from 'third-party-lib';
import { useTranslation } from '@/lib/i18n';

export function LocalizedLibrary(props) {
  const { t } = useTranslation('third-party-wrapper');

  return (
    <SomeLibrary
      {...props}
      title={t('title')}
      confirmText={t('actions.confirm')}
      cancelText={t('actions.cancel')}
      labels={{
        save: t('actions.save'),
        delete: t('actions.delete'),
        edit: t('actions.edit'),
      }}
    />
  );
}
```

---

## 📁 File Structure

### Standard Structure

```
your-module/
├── src/
│   ├── index.ts
│   ├── components/
│   │   └── YourComponent.tsx
│   └── lib/
│       └── i18n/
│           └── translations/
│               ├── en/
│               │   └── your-module.json
│               ├── es/
│               │   └── your-module.json
│               ├── fr/
│               │   └── your-module.json
│               ├── pt/
│               │   └── your-module.json
│               ├── de/
│               │   └── your-module.json
│               ├── it/
│               │   └── your-module.json
│               ├── ko/
│               │   └── your-module.json
│               ├── ar/
│               │   └── your-module.json
│               └── zh/
│                   └── your-module.json
├── package.json
└── I18N_MANIFEST.json  // See below
```

### Translation File Template

```json
{
  "header": {
    "title": "",
    "subtitle": "",
    "description": ""
  },
  "actions": {
    "save": "",
    "cancel": "",
    "delete": "",
    "edit": "",
    "create": "",
    "update": ""
  },
  "messages": {
    "success": "",
    "error": "",
    "warning": "",
    "info": ""
  },
  "validation": {
    "required": "",
    "invalid": "",
    "tooShort": "",
    "tooLong": ""
  },
  "status": {
    "loading": "",
    "success": "",
    "error": "",
    "pending": ""
  }
}
```

---

## 📋 I18N Manifest

Create an `I18N_MANIFEST.json` to document your i18n implementation:

```json
{
  "version": "1.0.0",
  "module": "your-module-name",
  "namespace": "your-module",
  "languages": {
    "en": {
      "coverage": 100,
      "status": "complete",
      "reviewer": "john.doe@example.com",
      "lastUpdated": "2025-12-27"
    },
    "es": {
      "coverage": 100,
      "status": "complete",
      "reviewer": "maria.garcia@example.com",
      "lastUpdated": "2025-12-27"
    },
    "ar": {
      "coverage": 95,
      "status": "complete",
      "rtlTested": true,
      "reviewer": "ahmed.ali@example.com",
      "lastUpdated": "2025-12-27"
    }
  },
  "rtlSupport": true,
  "dependencies": [],
  "notes": "All translations professionally reviewed"
}
```

---

## 🌐 RTL Support for Arabic

### CSS Requirements

```css
/* Your styles MUST support RTL */

/* ✅ Good: Logical properties */
.container {
  padding-inline-start: 1rem;
  padding-inline-end: 1rem;
  margin-inline-start: auto;
}

/* ✅ Good: RTL-aware positioning */
html[dir="rtl"] .icon {
  transform: scaleX(-1);
}

/* ❌ Bad: Fixed directional properties */
.container {
  padding-left: 1rem;
  padding-right: 1rem;
}
```

### React Components

```tsx
// ✅ Good: Respects direction
<div className="flex items-center gap-2">
  <Icon />
  <Text />
</div>

// ❌ Bad: Fixed layout
<div style={{ position: 'absolute', left: 0 }}>
  <Icon />
</div>
```

### Testing RTL

```tsx
// Test your component in RTL
import { render } from '@testing-library/react';

test('renders correctly in RTL', () => {
  document.documentElement.setAttribute('dir', 'rtl');

  const { container } = render(<YourComponent />);

  expect(container.querySelector('.flex')).toHaveStyle({
    flexDirection: 'row-reverse',
  });
});
```

---

## ✅ Validation Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "i18n:validate": "node scripts/validate-i18n.js",
    "i18n:coverage": "node scripts/i18n-coverage.js",
    "i18n:missing": "node scripts/find-missing-keys.js",
    "i18n:test": "jest --testPathPattern=i18n"
  }
}
```

### Example Validation Script

```javascript
// scripts/validate-i18n.js
const fs = require('fs');
const path = require('path');

const REQUIRED_LANGS = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const TRANSLATIONS_DIR = './src/lib/i18n/translations';

function validateI18n() {
  let isValid = true;

  // Check all languages exist
  for (const lang of REQUIRED_LANGS) {
    const langDir = path.join(TRANSLATIONS_DIR, lang);
    if (!fs.existsSync(langDir)) {
      console.error(`❌ Missing language directory: ${lang}`);
      isValid = false;
    }
  }

  // Check English is complete
  const enFile = path.join(TRANSLATIONS_DIR, 'en', 'module.json');
  if (fs.existsSync(enFile)) {
    const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    const hasEmptyValues = checkForEmptyValues(enData);
    if (hasEmptyValues) {
      console.error('❌ English translations have empty values');
      isValid = false;
    }
  }

  if (isValid) {
    console.log('✅ i18n validation passed');
  } else {
    process.exit(1);
  }
}

function checkForEmptyValues(obj, path = '') {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      if (checkForEmptyValues(value, currentPath)) return true;
    } else if (value === '') {
      console.error(`Empty value at: ${currentPath}`);
      return true;
    }
  }
  return false;
}

validateI18n();
```

---

## 🧪 Testing Checklist

Before submitting for integration:

- [ ] All 9 language files exist
- [ ] English translations are 100% complete
- [ ] Spanish translations are 100% complete
- [ ] No empty string values in base languages
- [ ] JSON files are valid (no syntax errors)
- [ ] RTL tested with Arabic locale
- [ ] No hardcoded strings in UI code
- [ ] Translation keys follow naming conventions
- [ ] I18N_MANIFEST.json is created and accurate
- [ ] Validation scripts pass

---

## 🚀 Submission Process

1. **Validate**: Run all i18n validation scripts
2. **Test**: Manual testing in all 9 languages
3. **Document**: Complete I18N_MANIFEST.json
4. **Review**: Internal review of translations
5. **Submit**: Create PR with i18n checklist

---

## 📖 Examples

### Complete Integration Example

See reference implementation:
- **Path**: `/apps/dashboard/app/dashboard-bundui/projects-v2/`
- **Translations**: `/apps/dashboard/src/lib/i18n/translations/*/projects.json`
- **Components**: Uses `useTranslation` hook throughout

### Third-Party Wrapper Example

```tsx
// Example: Recharts with i18n
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useTranslation } from '@/lib/i18n';

export function LocalizedBarChart({ data }) {
  const { t } = useTranslation('charts');

  return (
    <BarChart data={data}>
      <XAxis dataKey="name" label={t('labels.xAxis')} />
      <YAxis label={t('labels.yAxis')} />
      <Tooltip
        formatter={(value) => [value, t('labels.value')]}
      />
      <Bar dataKey="value" name={t('labels.data')} />
    </BarChart>
  );
}
```

---

## 🆘 Support

### Resources

- **Full Protocol**: `/docs/i18n/I18N_MODULE_REQUIREMENTS.md`
- **Checklist**: `/docs/i18n/I18N_COMPLIANCE_CHECKLIST.md`
- **Contributing**: `/CONTRIBUTING.md`

### Getting Help

- Review existing modules for patterns
- Check documentation in `/docs/i18n/`
- Ask in #i18n channel
- Email: i18n-support@vibethink.com

---

## ⚖️ License Compatibility

Your module must be compatible with VibeThink's license. Ensure:
- Your code is properly licensed
- Third-party dependencies are compatible
- Attribution is provided where required

---

## 🔄 Updates and Maintenance

### When to Update Translations

- New features added
- Error messages changed
- UI text modified
- User feedback received

### Versioning

Follow semantic versioning for translation updates:
- **Major**: Breaking changes to translation structure
- **Minor**: New translation keys added
- **Patch**: Translation improvements/fixes

---

**Last Updated**: 2025-12-27
**Version**: 1.0.0
**Contact**: VibeThink i18n Team
