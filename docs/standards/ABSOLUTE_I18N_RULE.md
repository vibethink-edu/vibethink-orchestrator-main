# ABSOLUTE I18N RULE - ZERO HARDCODED STRINGS

**Status:** 🔴 MANDATORY - NO EXCEPTIONS  
**Applies to:** ALL code (own components + third-party components)  
**Enforcement:** CI/CD blocking + Code review requirement

---

## 🎯 **THE RULE**

### **MINIMUM REQUIREMENT**

```
✅ REQUIRED: English (en) translation for EVERY string
```

**Translation Priority:**
1. **English (en)** - MANDATORY (default locale)
2. **Other languages** - RECOMMENDED (es, ar, zh, fr, pt, de)

### **ABSOLUTE PROHIBITION**

```
❌ FORBIDDEN: Hardcoded strings in ANY component
```

**This applies to:**
- ✅ Own components (custom React components)
- ✅ Third-party components (shadcn/ui, Material-UI, etc.)
- ✅ Library components (react-table, react-select, etc.)
- ✅ Utility functions
- ✅ Error messages
- ✅ Validation messages
- ✅ Tooltips, placeholders, labels
- ✅ Button text, menu items
- ✅ **EVERYTHING that appears in the UI**

---

## 📋 **EXAMPLES**

### ❌ **WRONG - Hardcoded String**

```tsx
// FORBIDDEN - Even if only in English
export function MyButton() {
  return <button>Save</button>;
}
```

```tsx
// FORBIDDEN - Third-party component with hardcoded text
import { Button } from '@/components/ui/button';

export function MyForm() {
  return <Button>Submit</Button>;
}
```

```tsx
// FORBIDDEN - Hardcoded placeholder
export function SearchInput() {
  return <input placeholder="Search..." />;
}
```

### ✅ **CORRECT - Using i18n**

```tsx
// CORRECT - Using translation
import { useTranslation } from '@/lib/i18n';

export function MyButton() {
  const { t } = useTranslation('common');
  return <button>{t('actions.save')}</button>;
}
```

```tsx
// CORRECT - Third-party component with translation
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

export function MyForm() {
  const { t } = useTranslation('common');
  return <Button>{t('actions.submit')}</Button>;
}
```

```tsx
// CORRECT - Translated placeholder
import { useTranslation } from '@/lib/i18n';

export function SearchInput() {
  const { t } = useTranslation('common');
  return <input placeholder={t('common.search')} />;
}
```

---

## 🔍 **DETECTION & ENFORCEMENT**

### **Automated Detection**

**Script:** `scripts/detect-hardcoded-strings.js`

```bash
# Scan for hardcoded strings
npm run i18n:detect-hardcoded

# Scan specific directory
npm run i18n:detect-hardcoded -- --dir=apps/dashboard/app

# Strict mode (fail on any hardcoded string)
npm run i18n:detect-hardcoded -- --strict
```

**What it detects:**
- JSX text content: `<button>Text</button>`
- String props: `placeholder="text"`
- Template literals in JSX: `<div>{`text`}</div>`
- Concatenated strings: `<span>{"Hello " + name}</span>`

**Exceptions (allowed):**
- CSS class names: `className="text-red-500"`
- Data attributes: `data-testid="button"`
- Technical identifiers: `id="user-123"`
- URLs: `href="https://example.com"`
- File paths: `src="/images/logo.png"`

### **CI/CD Integration**

**Pre-commit Hook:**
```bash
#!/bin/sh
# .husky/pre-commit

npm run i18n:detect-hardcoded --strict
if [ $? -ne 0 ]; then
  echo "❌ BLOCKED: Hardcoded strings detected"
  echo "Fix all hardcoded strings before committing"
  exit 1
fi
```

**GitHub Actions:**
```yaml
# .github/workflows/i18n-check.yml
name: I18N Validation

on: [push, pull_request]

jobs:
  check-hardcoded:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - name: Detect hardcoded strings
        run: npm run i18n:detect-hardcoded --strict
      - name: Validate translations
        run: npm run i18n:validate --strict
```

---

## 📝 **TRANSLATION FILE STRUCTURE**

### **Minimum (English Only)**

```
apps/dashboard/src/lib/i18n/translations/
└── en/
    ├── common.json          ← Generic UI strings
    ├── module.json          ← Module-specific strings
    └── module.context.json  ← AI context (optional but recommended)
```

**Example: `en/common.json`**
```json
{
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "submit": "Submit"
  },
  "common": {
    "search": "Search...",
    "filter": "Filter",
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
```

### **Recommended (All 7 Languages)**

```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   ├── common.json
│   ├── module.json
│   └── module.context.json
├── es/
│   ├── common.json
│   └── module.json
├── ar/
│   ├── common.json
│   └── module.json
... (zh, fr, pt, de)
```

---

## 🚨 **THIRD-PARTY COMPONENTS**

### **Problem**

Third-party components often have hardcoded English text:

```tsx
// shadcn/ui DataTable example
<DataTableViewOptions table={table} />
// Renders: "Columns" button (hardcoded)
```

### **Solution: Wrapper Components**

**Create i18n-enabled wrappers:**

```tsx
// components/ui/data-table-view-options-i18n.tsx
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import { useTranslation } from '@/lib/i18n';

export function DataTableViewOptionsI18n({ table }) {
  const { t } = useTranslation('common');
  
  // Override the hardcoded text
  return (
    <DataTableViewOptions 
      table={table}
      columnsText={t('table.common.columns')}
    />
  );
}
```

**If component doesn't support text override:**

```tsx
// Create custom version
export function DataTableViewOptionsI18n({ table }) {
  const { t } = useTranslation('common');
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {t('table.common.columns')} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      {/* Rest of implementation */}
    </DropdownMenu>
  );
}
```

### **Documentation Requirement**

**File:** `docs/standards/THIRD_PARTY_COMPONENT_ADAPTATION.md`

For EVERY third-party component used:
1. Document if it has hardcoded text
2. Create i18n wrapper if needed
3. Add to component registry
4. Provide usage examples

---

## ✅ **VALIDATION CHECKLIST**

Before marking ANY feature as complete:

### **Code Review**
- [ ] No hardcoded strings in JSX
- [ ] No hardcoded strings in props
- [ ] All text uses `t()` function
- [ ] Third-party components wrapped if needed

### **Automated Checks**
- [ ] `npm run i18n:detect-hardcoded` passes
- [ ] `npm run i18n:validate` shows 100% for English
- [ ] No console warnings about missing translations

### **Manual Testing**
- [ ] All UI text visible in English
- [ ] No "undefined" or blank text
- [ ] No translation keys showing (e.g., "common.actions.save")

### **Documentation**
- [ ] Translation keys added to `en/*.json`
- [ ] AI context added (if new module)
- [ ] Third-party wrappers documented (if applicable)

---

## 🎯 **ENFORCEMENT LEVELS**

### **Level 1: Warning (Development)**
```bash
npm run i18n:detect-hardcoded
# Output: ⚠️ Found 3 hardcoded strings
# Action: Fix before committing
```

### **Level 2: Blocking (Pre-commit)**
```bash
# .husky/pre-commit
npm run i18n:detect-hardcoded --strict
# Exit code 1 = Commit blocked
```

### **Level 3: CI/CD Failure**
```yaml
# GitHub Actions
- run: npm run i18n:detect-hardcoded --strict
# PR cannot be merged if fails
```

### **Level 4: Code Review Requirement**
```
PR Checklist:
☐ No hardcoded strings (verified by reviewer)
☐ i18n checks pass
☐ English translations complete
```

---

## 📊 **METRICS & REPORTING**

### **Dashboard Metrics**

Track i18n compliance:
- **Hardcoded String Count:** 0 (target)
- **English Translation Coverage:** 100% (required)
- **Multi-language Coverage:** X% (goal: 100%)
- **Third-party Wrappers:** X/Y components

### **Monthly Report**

Generate compliance report:
```bash
npm run i18n:report
```

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 I18N COMPLIANCE REPORT - December 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hardcoded Strings: 0 ✅
English Coverage: 100% ✅
Multi-language Coverage: 95% 🟡
Third-party Wrappers: 12/15 🟡

Status: ✅ COMPLIANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎓 **TRAINING & ONBOARDING**

### **For New Developers**

**Required Reading:**
1. This document (ABSOLUTE_I18N_RULE.md)
2. AI_AGENT_I18N_GUIDE.md
3. GLOBAL_MULTILINGUAL_STANDARD.md

**Required Training:**
1. Watch: "i18n Best Practices" video
2. Complete: i18n coding exercise
3. Review: Example PRs with proper i18n

**Certification:**
- [ ] Understands zero hardcoded strings rule
- [ ] Can use `useTranslation` hook
- [ ] Can create translation files
- [ ] Can wrap third-party components
- [ ] Passed i18n quiz (80% minimum)

### **For AI Agents**

**Context Files Required:**
- `ABSOLUTE_I18N_RULE.md` (this file)
- `AI_AGENT_I18N_GUIDE.md`
- `module.context.json` (for each module)

**Validation Required:**
- Run `i18n:detect-hardcoded` before suggesting code
- Verify English translations exist
- Suggest translation keys for new text
- Flag hardcoded strings in code review

---

## 🚀 **MIGRATION STRATEGY**

### **For Existing Codebase**

**Phase 1: Audit**
```bash
npm run i18n:detect-hardcoded --all > hardcoded-audit.txt
# Review all hardcoded strings
```

**Phase 2: Prioritize**
1. Critical user-facing text (buttons, forms)
2. Error messages
3. Navigation items
4. Table headers
5. Tooltips, placeholders

**Phase 3: Fix**
```bash
# Fix by module
npm run i18n:fix -- --module=projects
npm run i18n:fix -- --module=dashboard
```

**Phase 4: Validate**
```bash
npm run i18n:validate --strict
# Must pass before deployment
```

---

## 📞 **SUPPORT**

### **Questions?**

**Slack:** #i18n-support  
**Email:** i18n-team@company.com  
**Docs:** https://docs.company.com/i18n

### **Report Issues**

**Hardcoded string found:**
1. Create issue: "Hardcoded string in [component]"
2. Tag: `i18n`, `bug`, `high-priority`
3. Assign: i18n team

**Translation missing:**
1. Add to `en/*.json`
2. Create PR
3. Request review from i18n team

---

## 📜 **SUMMARY**

### **THE RULE (One Sentence)**

> **Every string that appears in the UI MUST be in a translation file (minimum English), NEVER hardcoded in code.**

### **WHY?**

1. **Consistency:** All text in one place
2. **Maintainability:** Easy to update
3. **Scalability:** Easy to add languages
4. **Quality:** Automated validation
5. **Professionalism:** Production-ready standard

### **HOW?**

1. Use `useTranslation` hook
2. Add strings to `en/*.json`
3. Run `i18n:detect-hardcoded`
4. Wrap third-party components
5. Pass CI/CD checks

---

**Last Updated:** 2025-12-23  
**Version:** 1.0.0  
**Status:** 🔴 MANDATORY STANDARD  
**Enforcement:** CI/CD Blocking
