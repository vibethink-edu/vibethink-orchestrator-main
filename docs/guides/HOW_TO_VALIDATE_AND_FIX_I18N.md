# How to Validate and Fix i18n Issues - Step by Step Guide

**Date:** 2025-12-23  
**Purpose:** Practical guide to validate and fix i18n issues like "Recent Projects"

---

## 🎯 Problem Example: "Recent Projects" Hardcoded

### Step 1: Run Validation

```bash
# Validate the projects module
npm run lang-quality -- --module=projects
```

**Expected Output:**
```
🔍 Validating module: projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 LANGUAGE QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Module: projects
Timestamp: 2025-12-23 18:00:00

1. Translation Completeness ................ 25/25 ✅
2. Context Coverage ........................ 0/20 ❌
3. Translation Quality ..................... 20/25 🟡
4. Code Implementation ..................... 20/20 ✅
5. Testing & Validation .................... 7/10 🟡

🎯 OVERALL SCORE: 72/100 (72%)
Level: 2 - Intermediate 🟡
Status: 🟡 NEEDS IMPROVEMENT
```

---

### Step 2: Find Hardcoded Strings

```bash
# Search for hardcoded strings in the codebase
grep -r "Recent Projects" apps/dashboard --include="*.tsx" --include="*.ts"
```

**Result:**
```
apps/dashboard/app/dashboard-bundui/projects-v2/components/table-recent-projects.tsx:345:
    <CardTitle>Recent Projects</CardTitle>
```

**❌ PROBLEM:** String is hardcoded, not using `t()` function

---

### Step 3: Add Translation Key

**File:** `src/lib/i18n/translations/en/projects.json`

```json
{
  "common": {
    // ... existing keys
  },
  "v2": {
    "recentProjects": {
      "title": "Recent Projects",
      "description": "View and manage your most recent projects",
      "empty": "No recent projects",
      "viewAll": "View All Projects"
    }
  }
}
```

---

### Step 4: Add Translations for All 7 Languages

**Spanish (es/projects.json):**
```json
{
  "v2": {
    "recentProjects": {
      "title": "Proyectos Recientes",
      "description": "Ver y gestionar tus proyectos más recientes",
      "empty": "No hay proyectos recientes",
      "viewAll": "Ver Todos los Proyectos"
    }
  }
}
```

**Arabic (ar/projects.json):**
```json
{
  "v2": {
    "recentProjects": {
      "title": "المشاريع الأخيرة",
      "description": "عرض وإدارة مشاريعك الأخيرة",
      "empty": "لا توجد مشاريع حديثة",
      "viewAll": "عرض جميع المشاريع"
    }
  }
}
```

**Chinese (zh/projects.json):**
```json
{
  "v2": {
    "recentProjects": {
      "title": "最近的项目",
      "description": "查看和管理您最近的项目",
      "empty": "没有最近的项目",
      "viewAll": "查看所有项目"
    }
  }
}
```

**French (fr/projects.json):**
```json
{
  "v2": {
    "recentProjects": {
      "title": "Projets Récents",
      "description": "Voir et gérer vos projets les plus récents",
      "empty": "Aucun projet récent",
      "viewAll": "Voir Tous les Projets"
    }
  }
}
```

**Portuguese (pt/projects.json):**
```json
{
  "v2": {
    "recentProjects": {
      "title": "Projetos Recentes",
      "description": "Ver e gerenciar seus projetos mais recentes",
      "empty": "Nenhum projeto recente",
      "viewAll": "Ver Todos os Projetos"
    }
  }
}
```

**German (de/projects.json):**
```json
{
  "v2": {
    "recentProjects": {
      "title": "Neueste Projekte",
      "description": "Sehen und verwalten Sie Ihre neuesten Projekte",
      "empty": "Keine aktuellen Projekte",
      "viewAll": "Alle Projekte Anzeigen"
    }
  }
}
```

---

### Step 5: Fix the Component

**File:** `app/dashboard-bundui/projects-v2/components/table-recent-projects.tsx`

**Before (❌ WRONG):**
```tsx
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export function TableRecentProjects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      {/* ... */}
    </Card>
  );
}
```

**After (✅ CORRECT):**
```tsx
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';

export function TableRecentProjects() {
  const { t } = useTranslation('projects');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('v2.recentProjects.title')}</CardTitle>
      </CardHeader>
      {/* ... */}
    </Card>
  );
}
```

---

### Step 6: Add Context File (AI Context)

**File:** `src/lib/i18n/translations/en/projects.context.json`

```json
{
  "module": "projects",
  "description": "Project management module for Projects V2",
  "usage": "Used in Projects V2 dashboard",
  "ai_instructions": "When user asks about projects, refer to this module. Emphasize V2 features.",
  
  "strings": {
    "v2.recentProjects.title": {
      "element_type": "heading",
      "location": "Projects V2 dashboard - Recent Projects card header",
      "purpose": "Display title for recent projects section",
      "tone": "professional",
      "formality_level": 3,
      "ai_context": "When user asks about recent projects, suggest this section. Show most recently updated projects.",
      "ai_alternatives": [
        "Latest projects",
        "Your recent work",
        "Recent activity"
      ],
      "related_keys": [
        "v2.recentProjects.description",
        "v2.recentProjects.viewAll"
      ],
      "max_length": 30
    }
  }
}
```

---

### Step 7: Re-validate

```bash
# Run validation again
npm run lang-quality -- --module=projects
```

**Expected Output:**
```
🎯 OVERALL SCORE: 95/100 (95%)
Level: 5 - Perfect ⭐⭐⭐⭐⭐
Status: ✅ PRODUCTION READY
```

---

## 🔄 Automated Workflow

### Create a Pre-commit Hook

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run i18n validation before commit
npm run lang-quality:all --fail-below=90

if [ $? -ne 0 ]; then
  echo "❌ i18n validation failed. Please fix issues before committing."
  exit 1
fi
```

---

### CI/CD Integration

**File:** `.github/workflows/i18n-validation.yml`

```yaml
name: i18n Validation

on:
  pull_request:
    paths:
      - 'apps/dashboard/src/lib/i18n/translations/**'
      - 'apps/dashboard/**/*.tsx'
      - 'apps/dashboard/**/*.ts'

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run i18n Validation
        run: npm run lang-quality:all --fail-below=90
      
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ i18n validation failed. Please ensure all strings are translated in all 7 languages.'
            })
```

---

## 📋 Quick Checklist

**For every new string:**

- [ ] Add translation key to `en/module.json`
- [ ] Add translations for all 7 languages (ES, AR, ZH, FR, PT, DE)
- [ ] Add context to `en/module.context.json`
- [ ] Use `t('key')` in component (never hardcode)
- [ ] Run `npm run lang-quality -- --module=X`
- [ ] Verify score ≥ 90%
- [ ] Test in browser (all 7 languages)
- [ ] Commit changes

---

## 🚫 Common Mistakes

### Mistake 1: Forgetting to Import useTranslation

```tsx
// ❌ WRONG
export function Component() {
  return <h1>Recent Projects</h1>;
}

// ✅ CORRECT
import { useTranslation } from '@/lib/i18n';

export function Component() {
  const { t } = useTranslation('projects');
  return <h1>{t('v2.recentProjects.title')}</h1>;
}
```

---

### Mistake 2: Only Translating Some Languages

```json
// ❌ WRONG - Only EN and ES
en/projects.json: { "title": "Recent Projects" }
es/projects.json: { "title": "Proyectos Recientes" }
// Missing: AR, ZH, FR, PT, DE

// ✅ CORRECT - All 7 languages
en/projects.json: { "title": "Recent Projects" }
es/projects.json: { "title": "Proyectos Recientes" }
ar/projects.json: { "title": "المشاريع الأخيرة" }
zh/projects.json: { "title": "最近的项目" }
fr/projects.json: { "title": "Projets Récents" }
pt/projects.json: { "title": "Projetos Recentes" }
de/projects.json: { "title": "Neueste Projekte" }
```

---

### Mistake 3: No Context File

```
// ❌ WRONG - No context
translations/en/projects.json ✓
translations/en/projects.context.json ✗

// ✅ CORRECT - With context
translations/en/projects.json ✓
translations/en/projects.context.json ✓
```

---

## 🎯 Summary

**To validate and fix "Recent Projects":**

1. **Run validation:** `npm run lang-quality -- --module=projects`
2. **Find hardcoded:** `grep -r "Recent Projects" apps/dashboard`
3. **Add translation key:** `projects.json` (all 7 languages)
4. **Add context:** `projects.context.json`
5. **Fix component:** Use `t('v2.recentProjects.title')`
6. **Re-validate:** Score should be ≥ 90%
7. **Test in browser:** Switch languages and verify

**Commands:**
```bash
# Validate
npm run lang-quality -- --module=projects

# Validate all
npm run lang-quality:all

# Find hardcoded strings
grep -r "text" apps/dashboard --include="*.tsx"
```

---

**Last Updated:** 2025-12-23  
**Status:** ✅ Complete Guide
