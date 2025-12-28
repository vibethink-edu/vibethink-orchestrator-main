# 👨‍💻 Developer Guide - VibeThink Orchestrator

**Audiencia:** Desarrolladores humanos que trabajen en el proyecto
**Última actualización:** 2025-12-25

---

## 🚀 Quick Start

### First Time Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd vibethink-orchestrator-main

# 2. Install dependencies
npm install

# 3. Start development server
cd apps/dashboard
npm run dev

# 4. Open browser
http://localhost:3005/dashboard-bundui
```

---

## 📋 Estado Actual del Proyecto

### Versión y Tecnologías

**Versión:** 0.5.1
**Node:** >= 18
**Package Manager:** npm@10.2.4 (⚠️ NO usar pnpm/yarn)

**Tech Stack:**
- **Framework:** Next.js 15.3.4
- **React:** 19.0.0
- **TypeScript:** 5.8.3
- **Styling:** Tailwind CSS 4.1.10
- **UI Components:** shadcn/ui
- **Monorepo:** Turborepo + npm workspaces

### Decisiones Ejecutivas Recientes

#### ✅ 9 Idiomas con Lazy Loading (Aprobado 2025-12-25)

**Qué:** Sistema i18n expandido de 7 a 9 idiomas

**Idiomas:**
- Base (P0): English, Spanish
- Fase 1 (P1): Arabic, Chinese, French, Portuguese, German
- Fase 2 (P2): **Italian, Japanese** ← NUEVOS

**Estrategia:** Lazy loading - solo cargar idiomas necesarios del usuario/workspace

**Impacto:**
- Reducción de bundle: 67-78%
- Usuario solo descarga su idioma + fallback
- Máximo 3 idiomas en memoria

**Estado:** Documentado, pendiente implementación (Sprint 1-6, ~6 semanas)

**Docs:**
- `docs/architecture/I18N_LAZY_LOADING_STRATEGY.md`
- `docs/sessions/SESSION_2025-12-25_9_LANGUAGES_IMPLEMENTATION_PLAN.md`

---

## 🏗️ Estructura del Proyecto

### Monorepo Layout

```
vibethink-orchestrator-main/
├── apps/
│   └── dashboard/              # Main dashboard application
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   ├── dashboard-bundui/    # BundUI dashboards
│       │   │   └── dashboard-vibethink/ # Custom dashboards
│       │   └── layout.tsx
│       ├── src/
│       │   ├── components/
│       │   ├── lib/
│       │   │   └── i18n/               # i18n system
│       │   └── shared/
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── utils/                  # Shared utilities
│   └── integrations/           # External integrations
│
├── docs/                       # Documentation
│   ├── architecture/           # Architecture docs
│   ├── sessions/              # Session logs
│   └── standards/             # Official standards
│
├── scripts/                    # Automation scripts
├── CHANGELOG.md               # Official change log
├── PROJECT_STATUS.md          # For AI/agents
└── DEVELOPER_GUIDE.md         # This file
```

### Dashboard Routes

**BundUI Dashboards (Reference):**
```
/dashboard-bundui/default       ← Default dashboard
/dashboard-bundui/ecommerce     ← E-commerce
/dashboard-bundui/analytics     ← Analytics
/dashboard-bundui/crm-v2        ← CRM v2
... (34+ modules)
```

**VibeThink Dashboards (Custom):**
```
/dashboard-vibethink            ← Custom default
/dashboard-vibethink/ecommerce  ← Custom e-commerce
... (custom implementations)
```

**⚠️ IMPORTANTE:** `/dashboard-bundui` debe redirigir a `/dashboard-bundui/default`

---

## 🔧 Development Workflow

### Common Commands

```bash
# Development
npm run dev                     # Start dev server (port 3005)
npm run build                   # Build for production
npm run start                   # Start production server
npm run lint                    # Run linter

# Validation
npm run validate:i18n          # Validate i18n keys
node scripts/validate-package-json-syntax.js  # Validate package.json

# Testing (when implemented)
npm run test                   # Run tests
npm run test:watch            # Watch mode
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes...

# Before commit: validate
node scripts/validate-package-json-syntax.js
npm run build

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/your-feature-name
```

### Branch Strategy

- **main** - Production-ready code
- **projects-v2-consolidation** - Current development branch
- **feature/** - Feature branches
- **fix/** - Bug fix branches

---

## 🌍 i18n System

### Current Status

**Implemented Languages (7):**
- ✅ en (English) - 100%
- ✅ es (Spanish) - 100%
- ⚠️ ar (Arabic) - 40%
- ⚠️ zh (Chinese) - 40%
- ⚠️ fr (French) - 40%
- ⚠️ pt (Portuguese) - 40%
- ⚠️ de (German) - 40%

**Pending Languages (2):**
- 🔄 it (Italian) - 0% (Sprint 1)
- 🔄 ja (Japanese) - 0% (Sprint 1)

### Using i18n in Components

**React Component:**

```typescript
'use client';

import { useTranslation } from '@/lib/i18n/client';

export function MyComponent() {
  const { t } = useTranslation('common'); // namespace

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

**With Parameters:**

```typescript
const { t } = useTranslation('analytics');

<p>{t('analytics.totalSales', { amount: 1000, currency: 'USD' })}</p>
```

**JSON Structure:**

```json
// apps/dashboard/src/lib/i18n/translations/en/analytics.json
{
  "analytics": {
    "totalSales": "Total sales: {{currency}} {{amount}}"
  }
}
```

### Adding New Translations

**1. Create namespace JSON file:**

```bash
# For each language
touch apps/dashboard/src/lib/i18n/translations/en/my-module.json
touch apps/dashboard/src/lib/i18n/translations/es/my-module.json
# ... repeat for all 9 languages
```

**2. Add translations:**

```json
// en/my-module.json
{
  "my-module": {
    "title": "My Module",
    "description": "This is my module"
  }
}
```

**3. Use in component:**

```typescript
const { t } = useTranslation('my-module');
<h1>{t('my-module.title')}</h1>
```

---

## 🚨 Critical Rules

### Package Manager

**✅ ALWAYS use npm:**
```bash
npm install
npm install <package>
```

**❌ NEVER use:**
```bash
pnpm install    # ❌ NO
yarn install    # ❌ NO
```

**Why:** Project uses npm@10.2.4. Other package managers have incompatible syntax.

### package.json Syntax

**✅ CORRECT:**
```json
{
  "dependencies": {
    "@vibethink/utils": "^0.1.0"
  }
}
```

**❌ WRONG:**
```json
{
  "dependencies": {
    "@vibethink/utils": "workspace:*"  // ❌ pnpm/yarn syntax
  }
}
```

**Validation:**
```bash
node scripts/validate-package-json-syntax.js
```

### React 19 Rules

**✅ CORRECT - Client Components:**
```typescript
'use client';

import { useState, useEffect } from 'react';

export function MyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>Content</div>;
}
```

**❌ WRONG - Hydration Issues:**
```typescript
'use client';

export function MyComponent() {
  const { theme } = useTheme(); // ❌ Can cause hydration mismatch
  return <div className={theme}>Content</div>;
}
```

---

## 📦 Adding Dependencies

### Install Package

```bash
# In workspace (apps/dashboard)
cd apps/dashboard
npm install <package>

# In root (for all workspaces)
cd ../..
npm install <package> -w apps/dashboard
```

### Verify Installation

```bash
# Check package is installed
npm ls <package>

# Validate no syntax errors
node scripts/validate-package-json-syntax.js

# Test build
npm run build
```

---

## 🎨 UI Components

### Using shadcn/ui

**Import from @vibethink/ui:**

```typescript
import { Button, Card } from '@vibethink/ui';

export function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

**Add new shadcn component:**

```bash
npx shadcn@latest add <component-name>
```

**⚠️ Always use shadcn components when available** - Don't create custom implementations.

---

## 🐛 Troubleshooting

### Error: Cannot find module 'autoprefixer'

**Cause:** package.json uses `workspace:*` syntax (incompatible with npm)

**Solution:**
1. Check `packages/integrations/package.json`
2. Change `"workspace:*"` to `"^0.1.0"`
3. Run `npm install`

**Details:** `docs/TROUBLESHOOTING.md`

### Error: EADDRINUSE port 3005

**Cause:** Port already in use

**Solution:**
```bash
# Windows
npx kill-port 3005

# Or use different port
npm run dev -- -p 3006
```

### Hydration Errors

**Cause:** Server/client mismatch

**Solution:**
1. Add `'use client'` directive
2. Use mounted state pattern
3. Avoid client-only hooks in SSR

**Details:** `README.md` - Hydration Safety Rules

### Build Fails

**Checklist:**
```bash
# 1. Validate package.json
node scripts/validate-package-json-syntax.js

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Check TypeScript errors
npx tsc --noEmit

# 4. Try build again
npm run build
```

---

## 📚 Documentation

### For Developers

- **This file:** `DEVELOPER_GUIDE.md` - Main developer guide
- **CHANGELOG.md** - All changes (check [Unreleased] section)
- **TROUBLESHOOTING.md** - Common issues and solutions
- **docs/architecture/** - Architecture decisions

### For AI/Agents

- **PROJECT_STATUS.md** - Project status for AI
- **AI_AGENT_QUICK_START.md** - Quick start for AI
- **README.md** - AI stability rules

### Standards

- **docs/standards/GLOBAL_MULTILINGUAL_STANDARD.md** - i18n standard
- **docs/architecture/SHADCN_FIRST_POLICY.md** - UI component policy
- **docs/architecture/PACKAGE_MANAGER_COMPATIBILITY.md** - Package manager guide

---

## 🎯 Upcoming Work

### Sprint 1: 9 Languages Setup (Week 1)

**Tasks:**
- [ ] Update `locale-config.ts` with `it` and `ja`
- [ ] Create `translations/it/` directory
- [ ] Create `translations/ja/` directory
- [ ] Configure webpack for code splitting

**Owner:** TBD
**Timeline:** Week 1

### Sprint 2: Lazy Loading (Week 2)

**Tasks:**
- [ ] Implement `dynamic-loader.ts`
- [ ] Detection system for user/workspace preferences
- [ ] Cache management (max 3 languages)
- [ ] Testing

**Owner:** TBD
**Timeline:** Week 2

**Full Roadmap:** `docs/sessions/SESSION_2025-12-25_9_LANGUAGES_IMPLEMENTATION_PLAN.md`

---

## 🤝 Contributing

### Before Making Changes

1. Read `CHANGELOG.md` section [Unreleased]
2. Check if your change conflicts with approved decisions
3. Run validation: `node scripts/validate-package-json-syntax.js`
4. Test build: `npm run build`

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactor
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(i18n): Add Italian and Japanese language support
fix(build): Fix workspace:* syntax in package.json
docs(guide): Update developer guide with i18n section
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Test locally
4. Update documentation if needed
5. Create PR with description
6. Wait for review

---

## 📞 Getting Help

### Documentation First

1. Check `DEVELOPER_GUIDE.md` (this file)
2. Check `TROUBLESHOOTING.md`
3. Search in `docs/architecture/`
4. Check `CHANGELOG.md`

### Still Stuck?

1. Review recent session logs in `docs/sessions/`
2. Check GitHub issues
3. Ask team lead

### For AI/Agents Working on Project

If an AI is helping you, point them to:
1. `PROJECT_STATUS.md`
2. `AI_AGENT_QUICK_START.md`
3. `CHANGELOG.md`

---

## 📊 Project Metrics

### Bundle Size

**Current (7 languages, eager loading):**
- Total: ~450KB
- Per language: ~50KB

**Target (9 languages, lazy loading):**
- Total: ~100-150KB (only loaded languages)
- Reduction: 67-78%

### Language Coverage

**Current:**
- Languages: 7/9 (78%)
- Translations: ~50% complete
- en/es: 100%
- Others: 40%

**Target:**
- Languages: 9/9 (100%)
- Translations: 100% complete
- Timeline: 6 weeks

---

## ✅ Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `apps/dashboard/src/lib/i18n/locale-config.ts` | Language configurations |
| `apps/dashboard/app/(dashboard)/layout.tsx` | Main layout |
| `packages/integrations/package.json` | Integration dependencies (⚠️ use ^0.1.0) |
| `next.config.js` | Next.js configuration |

### Key Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build production |
| `node scripts/validate-package-json-syntax.js` | Validate syntax |

### Key Ports

| Port | Service |
|------|---------|
| 3005 | Dashboard (default) |
| 3006 | Dashboard (alternate) |

---

**Last Updated:** 2025-12-25
**Maintained By:** Development Team
**Version:** 1.0.0
