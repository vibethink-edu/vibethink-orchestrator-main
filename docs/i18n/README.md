# VibeThink i18n Documentation

## 🌍 Internationalization (i18n) Protocol

Welcome to the VibeThink internationalization documentation. This directory contains all the resources you need to ensure your modules comply with our i18n requirements.

---

## 📚 Documentation Index

### 1. [**Module Requirements**](./I18N_MODULE_REQUIREMENTS.md) 🔴 **START HERE**

   **Required reading for ALL developers**

   Complete protocol for i18n compliance. Covers:
   - 9 mandatory languages
   - Base languages (English & Spanish)
   - Fallback system
   - RTL support for Arabic
   - File structure and naming
   - Code examples
   - Quality metrics

   **Status**: ✅ Mandatory for all modules

---

### 2. [**Compliance Checklist**](./I18N_COMPLIANCE_CHECKLIST.md) ✅

   **Use before submitting PRs**

   Step-by-step checklist to validate:
   - Translation files exist
   - Structure is correct
   - Quality standards met
   - RTL support implemented
   - Testing completed

   Includes scoring system (minimum 90/100 required)

   **Status**: ✅ Required before code review

---

### 3. [**Integration Guide**](../../packages/utils/I18N_INTEGRATION_GUIDE.md) 🛠️

   **For third-party developers and external integrations**

   Detailed guide for:
   - Integrating external libraries
   - Creating i18n wrappers
   - Validation scripts
   - Testing procedures
   - Submission process

   **Status**: 📖 Reference for integrations

---

### 4. [**Contributing Guide**](../../CONTRIBUTING.md#i18n-requirements-critical) 🤝

   **General contribution guidelines with i18n section**

   Includes:
   - Quick i18n summary
   - Development workflow
   - PR process
   - Code standards

   **Status**: 📖 General reference

---

## 🚀 Quick Start

### For New Modules

1. **Read**: [Module Requirements](./I18N_MODULE_REQUIREMENTS.md)
2. **Create**: Translation files for all 9 languages
3. **Validate**: Use the [Compliance Checklist](./I18N_COMPLIANCE_CHECKLIST.md)
4. **Submit**: Follow the PR process in [Contributing Guide](../../CONTRIBUTING.md)

### For Third-Party Integrations

1. **Read**: [Integration Guide](../../packages/utils/I18N_INTEGRATION_GUIDE.md)
2. **Wrapper**: Create localized wrapper if needed
3. **Translate**: Add all 9 language files
4. **Test**: Validate RTL and language switching
5. **Document**: Create I18N_MANIFEST.json

---

## 🌐 Supported Languages

| # | Language | Code | Status | Coverage Requirement | Notes |
|---|----------|------|--------|---------------------|-------|
| 1 | English | `en` | **Base** | 100% | Fallback language |
| 2 | Español | `es` | **Base** | 100% | Primary market |
| 3 | Français | `fr` | Mandatory | 90%+ | |
| 4 | Português | `pt` | Mandatory | 90%+ | |
| 5 | Deutsch | `de` | Mandatory | 90%+ | |
| 6 | Italiano | `it` | Mandatory | 90%+ | |
| 7 | 한국어 | `ko` | Mandatory | 90%+ | |
| 8 | العربية | `ar` | Mandatory | 90%+ | **RTL required** |
| 9 | 中文 | `zh` | Mandatory | 90%+ | |

---

## 📋 Validation Commands

Run these before submitting:

```bash
# Validate all languages exist
npm run i18n:validate

# Check for missing keys
npm run i18n:missing-keys

# Find hardcoded strings
npm run i18n:find-hardcoded

# Test RTL support
npm run i18n:test-rtl

# Generate coverage report
npm run i18n:coverage
```

---

## 🚨 Rejection Criteria

Your module/PR will be **AUTOMATICALLY REJECTED** if:

| # | Issue | Impact |
|---|-------|--------|
| 1 | Missing any of the 9 languages | 🔴 Critical |
| 2 | English or Spanish incomplete | 🔴 Critical |
| 3 | Hardcoded UI strings found | 🔴 Critical |
| 4 | RTL broken for Arabic | 🔴 Critical |
| 5 | Invalid JSON in translation files | 🔴 Critical |
| 6 | Coverage below 90% for non-base languages | 🟡 Warning → Rejection |

---

## ✅ Examples

### Good Examples

See these implementations for reference:

1. **Projects V2 Module**
   - Path: `/apps/dashboard/app/dashboard-bundui/projects-v2/`
   - Translations: `/apps/dashboard/src/lib/i18n/translations/*/projects.json`
   - Status: ✅ Full compliance

2. **Dashboard Bundui Layout**
   - Path: `/apps/dashboard/app/dashboard-bundui/layout.tsx`
   - RTL Detection: Lines 25-31
   - Status: ✅ RTL compliant

3. **Arabic Translations**
   - Path: `/apps/dashboard/src/lib/i18n/translations/ar/projects.json`
   - Coverage: 100%
   - Status: ✅ Complete

### Bad Examples (Don't do this)

```tsx
// ❌ BAD: Hardcoded string
<button>Save</button>

// ✅ GOOD: Translated
<button>{t('actions.save')}</button>
```

```tsx
// ❌ BAD: Fixed positioning (breaks RTL)
<div style={{ left: 0 }}>Icon</div>

// ✅ GOOD: Logical positioning
<div className="inline-start-0">Icon</div>
```

```json
// ❌ BAD: Flat structure
{
  "save_button": "Save",
  "cancel_btn": "Cancel"
}

// ✅ GOOD: Semantic nesting
{
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

---

## 🛠️ Tools and Utilities

### Available in @vibethink/utils

```typescript
// Translation functions
import { term, termSync } from '@vibethink/utils';

// Format functions
import {
  formatMessage,
  isICUMessage,
} from '@vibethink/utils';

// Locale utilities
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
} from '@vibethink/utils';
```

### React Hooks

```typescript
// Main translation hook
import { useTranslation } from '@/lib/i18n';

// Locale context
import { useLocale, useSetLocale } from '@/lib/i18n';
```

---

## 📊 Metrics and Monitoring

### Coverage Requirements

| Metric | Minimum | Target |
|--------|---------|--------|
| Total languages | 9/9 (100%) | 9/9 (100%) |
| English coverage | 100% | 100% |
| Spanish coverage | 100% | 100% |
| Other languages | 90% | 100% |
| RTL support | Yes | Yes |
| Hardcoded strings | 0 | 0 |

### Quality Score

**Formula**:
```
Score = (languages_complete × 30) +
        (en_coverage × 25) +
        (es_coverage × 25) +
        (no_hardcoded × 20)
```

**Minimum passing score**: 90/100

---

## 🔄 Update Process

### Adding New Translations

1. Create feature branch
2. Add new keys to `en/module.json`
3. Copy structure to all 8 other languages
4. Translate each language
5. Validate with scripts
6. Submit PR

### Updating Existing Translations

1. Update in English first
2. Update in Spanish
3. Update other languages
4. Run validation
5. Test in UI
6. Submit PR

---

## 🆘 Support and Resources

### Documentation

- **This Directory**: `/docs/i18n/`
- **Utils Package**: `/packages/utils/I18N_INTEGRATION_GUIDE.md`
- **Contributing**: `/CONTRIBUTING.md`

### Getting Help

- 💬 **Slack**: #i18n channel
- 📧 **Email**: i18n-support@vibethink.com
- 📖 **Examples**: See `/apps/dashboard/src/lib/i18n/translations/`
- 🐛 **Issues**: GitHub issues with `i18n` label

### Training

- **i18n Onboarding**: Required for all new developers
- **RTL Workshop**: For UI developers
- **Translation Review**: For content contributors

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-27 | Initial protocol documentation |
| | | - 9 mandatory languages defined |
| | | - RTL support requirements added |
| | | - Validation process established |

---

## 🎯 Goals

### Current

- ✅ 100% compliance for new modules
- ✅ RTL support for all UI components
- ✅ Automated validation in CI/CD

### Future

- 🔄 Automated translation suggestions
- 🔄 Visual regression testing for RTL
- 🔄 Translation management dashboard
- 🔄 Community translation contributions

---

## 📜 License

All i18n documentation and utilities are part of the VibeThink Orchestrator project and follow the same license.

---

**Maintained by**: VibeThink i18n Team
**Last Updated**: 2025-12-27
**Status**: ✅ Active and Enforced

---

## Quick Links

- 🔴 [Module Requirements](./I18N_MODULE_REQUIREMENTS.md) - **Start here**
- ✅ [Compliance Checklist](./I18N_COMPLIANCE_CHECKLIST.md) - Before PR
- 🛠️ [Integration Guide](../../packages/utils/I18N_INTEGRATION_GUIDE.md) - For integrations
- 🤝 [Contributing](../../CONTRIBUTING.md) - General guidelines
