# Contributing to VibeThink Orchestrator

Thank you for your interest in contributing to VibeThink! This guide will help you understand our development standards and processes.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [**i18n Requirements (CRITICAL)**](#i18n-requirements-critical)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

Please be respectful and professional in all interactions. We're building amazing software together.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd bold-tharp

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. **Ensure i18n compliance** (see below)
4. Test your changes
5. Submit a pull request

---

## 🌍 i18n Requirements (CRITICAL)

**⚠️ MANDATORY: All modules, components, and third-party integrations MUST comply with our i18n protocol.**

### Quick Summary

Every module you create or integrate MUST:

✅ Support **9 languages**: `en`, `es`, `fr`, `pt`, `de`, `it`, `ko`, `ar`, `zh`
✅ Have **100% complete** English and Spanish translations
✅ Support **RTL (Right-to-Left)** for Arabic
✅ Use **NO hardcoded strings** in user-facing UI
✅ Follow the **fallback system**: Missing translations → English

### Required Languages

| Language | Code | Requirement | Notes |
|----------|------|-------------|-------|
| English | `en` | **Base language** | 100% complete, fallback source |
| Spanish | `es` | **Base language** | 100% complete |
| French | `fr` | Mandatory | Min 90% coverage |
| Portuguese | `pt` | Mandatory | Min 90% coverage |
| German | `de` | Mandatory | Min 90% coverage |
| Italian | `it` | Mandatory | Min 90% coverage |
| Korean | `ko` | Mandatory | Min 90% coverage |
| Arabic | `ar` | Mandatory | Min 90% coverage + RTL |
| Chinese | `zh` | Mandatory | Min 90% coverage |

### File Structure

```
your-module/
└── src/
    └── lib/
        └── i18n/
            └── translations/
                ├── en/
                │   └── module-name.json
                ├── es/
                │   └── module-name.json
                ├── fr/
                │   └── module-name.json
                ├── pt/
                │   └── module-name.json
                ├── de/
                │   └── module-name.json
                ├── it/
                │   └── module-name.json
                ├── ko/
                │   └── module-name.json
                ├── ar/
                │   └── module-name.json
                └── zh/
                    └── module-name.json
```

### Translation File Format

**Correct** ✅:
```json
{
  "header": {
    "title": "Welcome",
    "subtitle": "Get started"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**Incorrect** ❌:
```json
{
  "welcome_title": "Welcome",
  "btn_save": "Save"
}
```

### Usage in Code

```tsx
import { useTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useTranslation('module-name');

  return (
    <div>
      <h1>{t('header.title')}</h1>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

### Validation

Before submitting a PR:

```bash
# Validate all 9 languages exist
npm run i18n:validate

# Check for missing keys
npm run i18n:missing-keys

# Find hardcoded strings
npm run i18n:find-hardcoded
```

### RTL Support for Arabic

Your UI components MUST support RTL:

```tsx
// ✅ Good: Auto-adapts to RTL
<div className="flex items-center gap-2">
  <Icon />
  <Text />
</div>

// ❌ Bad: Fixed positioning
<div style={{ left: 0 }}>
  <Icon />
</div>
```

### Module Rejection Criteria

Your PR will be **REJECTED** if:

1. ❌ Missing any of the 9 required languages
2. ❌ English or Spanish translations are incomplete
3. ❌ Hardcoded UI strings found
4. ❌ RTL support is broken for Arabic
5. ❌ Translation files have invalid JSON

### Resources

📖 **Full Documentation**: `/docs/i18n/I18N_MODULE_REQUIREMENTS.md`
✅ **Compliance Checklist**: `/docs/i18n/I18N_COMPLIANCE_CHECKLIST.md`
💡 **Examples**: `/apps/dashboard/src/lib/i18n/translations/`

### Getting Help

If you need help with translations:
- Check existing modules for reference
- Ask in the #i18n channel
- Review the full i18n documentation

---

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types
- Document complex types

### React

- Use functional components with hooks
- Follow React best practices
- Keep components focused and small

### Styling

- Use Tailwind CSS classes
- Follow the design system
- Support RTL for Arabic (see i18n section)

### Naming Conventions

- **Files**: kebab-case (`my-component.tsx`)
- **Components**: PascalCase (`MyComponent`)
- **Functions**: camelCase (`handleClick`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

---

## Testing

### Unit Tests

```bash
npm run test
```

### i18n Tests

```bash
# Validate translations
npm run i18n:validate

# Test RTL
npm run i18n:test-rtl
```

### Manual Testing

Always test:
1. ✅ Your feature in English
2. ✅ Your feature in Spanish
3. ✅ Your feature in Arabic (RTL)
4. ✅ Language switching works

---

## Pull Request Process

### Before Submitting

- [ ] Code follows our style guide
- [ ] **All 9 languages are included and validated**
- [ ] **No hardcoded strings in UI**
- [ ] **RTL works for Arabic**
- [ ] Tests pass
- [ ] Documentation updated (if needed)

### PR Template

```markdown
## Description
[Describe your changes]

## i18n Compliance
- [ ] All 9 languages included
- [ ] English 100% complete
- [ ] Spanish 100% complete
- [ ] No hardcoded strings
- [ ] RTL tested with Arabic
- [ ] i18n validation passed

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[Describe how you tested]

## Screenshots
[If applicable, especially for RTL]
```

### Review Process

1. CI/CD checks must pass (including i18n validation)
2. Code review by at least one maintainer
3. i18n compliance verified
4. Testing completed
5. Approved and merged

---

## Third-Party Libraries

When integrating a third-party library:

1. Check if it supports i18n natively
2. If not, create a wrapper with translations
3. Ensure all 9 languages are covered
4. Document the integration

Example:

```tsx
// Wrapper for third-party library
import { ThirdPartyComponent } from 'some-library';
import { useTranslation } from '@/lib/i18n';

export function LocalizedThirdParty() {
  const { t } = useTranslation('third-party-wrapper');

  return (
    <ThirdPartyComponent
      title={t('title')}
      buttonText={t('actions.save')}
    />
  );
}
```

---

## Questions?

- 📖 Read the full documentation in `/docs/`
- 💬 Ask in project discussions
- 🐛 Report issues on GitHub

---

**Remember**: i18n compliance is **mandatory**. PRs without proper internationalization support will be rejected.

Thank you for contributing to VibeThink! 🚀
