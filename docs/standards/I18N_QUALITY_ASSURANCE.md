# i18n Quality Assurance & AI Context Rules

**Version:** 1.0.0  
**Status:** ✅ MANDATORY  
**Effective Date:** 2025-12-23  
**Authority:** CTO - Marcelo Escallón

---

## 🎯 Purpose

Define **quality assurance rules** for every module/option to ensure:
1. All 7 languages have complete, accurate translations
2. AI agents have proper context for each string
3. Translation quality is consistent and professional
4. No strings are missing or broken

---

## 📋 Quality Rules Per Module

### Rule 1: Translation Completeness

**MANDATORY:** Every module MUST have 100% translation coverage in all 7 languages.

**Validation:**
```typescript
// scripts/validate-i18n-completeness.ts
import { AVAILABLE_LOCALES } from '@/lib/i18n/types';
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  module: string;
  locale: Locale;
  missingKeys: string[];
  extraKeys: string[];
  coverage: number;
}

export function validateModuleTranslations(moduleName: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // Load English as reference (source of truth)
  const enPath = path.join(process.cwd(), `src/lib/i18n/translations/en/${moduleName}.json`);
  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const enKeys = getAllKeys(enTranslations);
  
  // Validate each locale
  for (const locale of AVAILABLE_LOCALES) {
    if (locale === 'en') continue; // Skip English (it's the reference)
    
    const localePath = path.join(process.cwd(), `src/lib/i18n/translations/${locale}/${moduleName}.json`);
    
    if (!fs.existsSync(localePath)) {
      results.push({
        module: moduleName,
        locale,
        missingKeys: enKeys,
        extraKeys: [],
        coverage: 0
      });
      continue;
    }
    
    const localeTranslations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    const localeKeys = getAllKeys(localeTranslations);
    
    const missingKeys = enKeys.filter(key => !localeKeys.includes(key));
    const extraKeys = localeKeys.filter(key => !enKeys.includes(key));
    const coverage = ((enKeys.length - missingKeys.length) / enKeys.length) * 100;
    
    results.push({
      module: moduleName,
      locale,
      missingKeys,
      extraKeys,
      coverage
    });
  }
  
  return results;
}

function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}
```

**Usage:**
```bash
npm run validate:i18n -- --module=navigation
npm run validate:i18n -- --module=projects
npm run validate:i18n -- --all
```

**Expected Output:**
```
✅ navigation (en): 100% (80/80 keys)
✅ navigation (es): 100% (80/80 keys)
✅ navigation (ar): 100% (80/80 keys)
✅ navigation (zh): 100% (80/80 keys)
✅ navigation (fr): 100% (80/80 keys)
✅ navigation (pt): 100% (80/80 keys)
✅ navigation (de): 100% (80/80 keys)

✅ All modules: 100% coverage
```

---

### Rule 2: Translation Quality

**MANDATORY:** Translations must be:
- ✅ Contextually appropriate
- ✅ Grammatically correct
- ✅ Culturally sensitive
- ✅ Consistent in terminology
- ✅ Natural-sounding (not machine-translated)

**Quality Checklist per String:**
```json
{
  "translation_key": "actions.save",
  "quality_check": {
    "en": {
      "value": "Save",
      "context": "Button to save changes",
      "tone": "neutral",
      "formality": "standard",
      "verified": true,
      "verified_by": "native_speaker",
      "verified_date": "2025-12-23"
    },
    "es": {
      "value": "Guardar",
      "context": "Botón para guardar cambios",
      "tone": "neutral",
      "formality": "standard",
      "verified": true,
      "verified_by": "native_speaker",
      "verified_date": "2025-12-23",
      "alternatives": ["Salvar", "Almacenar"],
      "chosen_reason": "Most common and natural in UI context"
    }
  }
}
```

---

### Rule 3: AI Context Requirement

**MANDATORY:** Every translation string MUST have AI context metadata.

**Why?** AI agents need to understand:
- What the string is for
- Where it appears
- What tone to use
- What the user expects

**Context Schema:**
```typescript
interface TranslationContext {
  // Basic Info
  key: string;                    // Translation key (e.g., "actions.save")
  module: string;                 // Module name (e.g., "navigation")
  
  // UI Context
  component: string;              // Component where used (e.g., "Button")
  location: string;               // Where it appears (e.g., "Sidebar footer")
  element_type: 'button' | 'label' | 'heading' | 'message' | 'placeholder' | 'tooltip' | 'error';
  
  // Semantic Context
  purpose: string;                // What it does (e.g., "Saves user changes")
  user_action: string;            // What happens when clicked/used
  
  // Tone & Style
  tone: 'formal' | 'casual' | 'professional' | 'friendly' | 'urgent' | 'neutral';
  formality_level: 1 | 2 | 3 | 4 | 5;  // 1=very casual, 5=very formal
  
  // AI Instructions
  ai_context: string;             // Instructions for AI when using this string
  ai_alternatives: string[];      // Alternative phrasings AI can suggest
  ai_avoid: string[];             // What AI should NOT say
  
  // Related Strings
  related_keys: string[];         // Other keys that should be consistent
  
  // Validation
  max_length?: number;            // UI constraint (e.g., button width)
  required_variables?: string[];  // Variables that must be present (e.g., {name})
}
```

**Example:**
```json
{
  "key": "navigation.items.projects_v2",
  "module": "navigation",
  "component": "NavItem",
  "location": "Sidebar main menu",
  "element_type": "label",
  "purpose": "Navigate to Projects V2 module",
  "user_action": "Clicking opens Projects V2 dashboard",
  "tone": "professional",
  "formality_level": 3,
  "ai_context": "When user asks about projects, suggest this navigation item. Emphasize V2 features (AI integration, advanced analytics).",
  "ai_alternatives": [
    "Go to Projects V2",
    "Open Projects dashboard",
    "View your projects"
  ],
  "ai_avoid": [
    "Old projects",
    "Legacy projects",
    "Projects V1"
  ],
  "related_keys": [
    "navigation.items.project_management",
    "projects.header.title"
  ],
  "max_length": 20
}
```

---

### Rule 4: Context File Structure

**MANDATORY:** Every module MUST have a context file alongside translations.

**File Structure:**
```
translations/
├── en/
│   ├── navigation.json          # Translations
│   └── navigation.context.json  # AI Context
├── es/
│   ├── navigation.json
│   └── navigation.context.json  # Same structure, localized descriptions
└── ...
```

**Context File Example:**
```json
// en/navigation.context.json
{
  "module": "navigation",
  "description": "Sidebar navigation menu for the entire application",
  "usage": "Used in AppSidebar component, visible on all pages",
  "ai_instructions": "When user asks about navigation, refer to these items. Suggest relevant sections based on their current task.",
  
  "strings": {
    "groups.dashboards": {
      "element_type": "label",
      "location": "Sidebar group header",
      "purpose": "Group label for dashboard-related items",
      "tone": "professional",
      "formality_level": 3,
      "ai_context": "Main category for all dashboard views. When user wants to see overview or analytics, suggest items in this group.",
      "max_length": 15
    },
    
    "items.projects_v2": {
      "element_type": "label",
      "location": "Sidebar menu item",
      "purpose": "Navigate to Projects V2 module",
      "user_action": "Opens Projects V2 dashboard with AI features",
      "tone": "professional",
      "formality_level": 3,
      "ai_context": "Premium feature with AI integration. Emphasize AI capabilities when suggesting this. Available on Professional plan and above.",
      "ai_alternatives": [
        "Check your projects",
        "Go to project management",
        "Open Projects V2"
      ],
      "related_keys": [
        "projects.header.title",
        "projects.ai_chat.welcome"
      ],
      "max_length": 20,
      "feature_gate": "projects_v2",
      "required_plan": "professional"
    },
    
    "badges.new": {
      "element_type": "label",
      "location": "Badge next to menu item",
      "purpose": "Indicate new feature",
      "tone": "friendly",
      "formality_level": 2,
      "ai_context": "Highlight new features to user. Use when promoting recently added functionality.",
      "max_length": 8
    }
  }
}
```

---

## 🤖 AI-First Context Integration

### How AI Uses Context

**1. When User Asks Questions:**
```typescript
// AI Agent Logic
const userQuestion = "¿Cómo veo mis proyectos?";

// AI loads context
const navContext = loadContext('navigation', userLocale);
const projectsContext = navContext.strings['items.projects_v2'];

// AI response (using context)
const response = t('ai.responses.navigation_help', {
  item: t('navigation.items.projects_v2'),
  location: projectsContext.location,
  action: projectsContext.user_action,
  alternatives: projectsContext.ai_alternatives.join(', ')
});

// Result: "Puedes ver tus proyectos en 'Proyectos V2' en el menú lateral. 
// También puedes decir 'Abre el panel de proyectos' o 'Muestra mis proyectos'."
```

**2. When Suggesting Actions:**
```typescript
// AI detects user intent
const intent = detectIntent(userMessage); // "wants to manage projects"

// AI finds relevant navigation
const relevantItems = findRelevantNavItems(intent, navContext);

// AI suggests with context
const suggestion = {
  action: "navigate",
  target: "projects_v2",
  reason: projectsContext.ai_context,
  alternatives: projectsContext.ai_alternatives
};
```

**3. When Validating User Input:**
```typescript
// User tries to use feature
const featureRequest = "Quiero usar la IA de proyectos";

// AI checks context
const projectsContext = loadContext('navigation', 'es').strings['items.projects_v2'];

// AI validates plan access
if (user.plan < projectsContext.required_plan) {
  return t('feature_locked.projects_v2', {
    required_plan: t(`plans.${projectsContext.required_plan}`)
  });
}
```

---

## 📊 Quality Metrics

### Per-Module Quality Score

```typescript
interface ModuleQualityScore {
  module: string;
  overall_score: number;  // 0-100
  
  completeness: {
    score: number;        // 0-100
    total_keys: number;
    translated_keys: number;
    missing_keys: string[];
  };
  
  context_coverage: {
    score: number;        // 0-100
    total_strings: number;
    with_context: number;
    missing_context: string[];
  };
  
  quality_checks: {
    score: number;        // 0-100
    verified_translations: number;
    unverified_translations: number;
    flagged_issues: string[];
  };
  
  ai_readiness: {
    score: number;        // 0-100
    strings_with_ai_context: number;
    strings_with_alternatives: number;
    strings_with_feature_gates: number;
  };
}
```

**Calculation:**
```typescript
function calculateModuleQuality(module: string): ModuleQualityScore {
  const completeness = calculateCompleteness(module);
  const contextCoverage = calculateContextCoverage(module);
  const qualityChecks = calculateQualityChecks(module);
  const aiReadiness = calculateAIReadiness(module);
  
  const overall_score = (
    completeness.score * 0.4 +
    contextCoverage.score * 0.2 +
    qualityChecks.score * 0.2 +
    aiReadiness.score * 0.2
  );
  
  return {
    module,
    overall_score,
    completeness,
    context_coverage: contextCoverage,
    quality_checks: qualityChecks,
    ai_readiness: aiReadiness
  };
}
```

---

## ✅ Module Certification Process

### Step 1: Create Translations
```bash
# Create all 7 language files
touch src/lib/i18n/translations/{en,es,ar,zh,fr,pt,de}/my-module.json
```

### Step 2: Create Context Files
```bash
# Create context files
touch src/lib/i18n/translations/{en,es,ar,zh,fr,pt,de}/my-module.context.json
```

### Step 3: Validate Completeness
```bash
npm run validate:i18n -- --module=my-module
```

### Step 4: Validate Context
```bash
npm run validate:context -- --module=my-module
```

### Step 5: Quality Review
```bash
npm run quality:review -- --module=my-module
```

### Step 6: AI Testing
```bash
npm run test:ai-context -- --module=my-module
```

### Step 7: Certification
```bash
npm run certify:module -- --module=my-module
```

**Certification Output:**
```
✅ Module: my-module
✅ Completeness: 100% (all 7 languages)
✅ Context Coverage: 100%
✅ Quality Checks: PASSED
✅ AI Readiness: 95%

🎉 Module CERTIFIED for production
```

---

## 🔧 Automated Tools

### 1. Translation Validator
```bash
# Validate all modules
npm run validate:i18n --all

# Validate specific module
npm run validate:i18n --module=navigation

# Fix missing keys (copy from English)
npm run validate:i18n --module=navigation --fix
```

### 2. Context Generator
```bash
# Generate context template
npm run generate:context --module=navigation

# Validate context completeness
npm run validate:context --module=navigation
```

### 3. Quality Checker
```bash
# Check translation quality
npm run quality:check --module=navigation

# Generate quality report
npm run quality:report --module=navigation --output=report.html
```

### 4. AI Context Tester
```bash
# Test AI context usage
npm run test:ai-context --module=navigation

# Simulate AI queries
npm run test:ai-queries --module=navigation --locale=es
```

---

## 📋 Quality Checklist Template

**For each new module:**

```markdown
# Module: [MODULE_NAME]

## Translation Completeness
- [ ] English (en) - 100%
- [ ] Spanish (es) - 100%
- [ ] Arabic (ar) - 100%
- [ ] Chinese (zh) - 100%
- [ ] French (fr) - 100%
- [ ] Portuguese (pt) - 100%
- [ ] German (de) - 100%

## Context Files
- [ ] en/[module].context.json created
- [ ] es/[module].context.json created
- [ ] ar/[module].context.json created
- [ ] zh/[module].context.json created
- [ ] fr/[module].context.json created
- [ ] pt/[module].context.json created
- [ ] de/[module].context.json created

## Quality Checks
- [ ] All strings have context
- [ ] All strings have AI instructions
- [ ] All strings have tone defined
- [ ] All strings have max_length (if UI constraint)
- [ ] All strings verified by native speaker (or AI)
- [ ] No hardcoded strings in code
- [ ] All feature gates documented

## AI Readiness
- [ ] AI context complete for all strings
- [ ] AI alternatives provided
- [ ] AI avoid list defined
- [ ] Related keys mapped
- [ ] Feature gates defined
- [ ] Plan requirements documented

## Testing
- [ ] Validated with npm run validate:i18n
- [ ] Validated with npm run validate:context
- [ ] Quality checked with npm run quality:check
- [ ] AI tested with npm run test:ai-context
- [ ] Manual testing in all 7 languages
- [ ] Screenshots captured

## Certification
- [ ] Overall quality score: ≥ 95%
- [ ] Module certified for production
- [ ] Documentation updated
- [ ] Team notified
```

---

## 🎯 Success Criteria

**A module is production-ready when:**
- ✅ 100% translation coverage in all 7 languages
- ✅ 100% context coverage for all strings
- ✅ Quality score ≥ 95%
- ✅ AI readiness score ≥ 90%
- ✅ All automated tests passing
- ✅ Manual review completed
- ✅ Certified by QA team

---

## 🚫 Common Mistakes to Avoid

1. **Missing context files** - Every module needs context
2. **Generic AI instructions** - Be specific about usage
3. **No max_length constraints** - UI can break
4. **Inconsistent terminology** - Use related_keys
5. **Missing feature gates** - AI won't know plan requirements
6. **No alternatives** - AI can't suggest variations
7. **Unverified translations** - Quality suffers

---

**Last Updated:** 2025-12-23  
**Version:** 1.0.0  
**Status:** ✅ Mandatory for all modules
