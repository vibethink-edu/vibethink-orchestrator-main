# Global Multilingual Standard - Official Policy

**Status:** ✅ APPROVED & MANDATORY  
**Effective Date:** 2025-12-23  
**Scope:** All development, databases, APIs, and infrastructure  
**Authority:** Executive Decision - Marcelo Escallón

---

## 🌍 Official Language Support

### Approved Languages (Effective Immediately)

| Code | Language | Script | Direction | Encoding | Priority |
|------|----------|--------|-----------|----------|----------|
| `en` | English | Latin | LTR | UTF-8 | P0 (Base) |
| `es` | Spanish | Latin | LTR | UTF-8 | P0 (Base) |
| `ar` | Arabic | Arabic | **RTL** | UTF-8 | P1 (Phase 2) |
| `zh` | Chinese Simplified | Han | LTR | UTF-8 | P1 (Phase 2) |
| `fr` | French | Latin | LTR | UTF-8 | P1 (Phase 2) |
| `pt` | Portuguese | Latin | LTR | UTF-8 | P1 (Phase 2) |
| `de` | German | Latin | LTR | UTF-8 | P1 (Phase 2) |

**Total Coverage:** 4.5+ billion people worldwide

---

## 📋 Mandatory Requirements

### 1. Database Schema

**REQUIRED for ALL tables with user-facing content:**

```sql
-- ✅ CORRECT: All text columns MUST use UTF-8
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  locale VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ CORRECT: PostgreSQL (recommended)
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  locale VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- PostgreSQL uses UTF-8 by default

-- ❌ WRONG: Latin1 or other encodings
CREATE TABLE projects (
  name VARCHAR(255) CHARACTER SET latin1  -- ❌ FORBIDDEN
);
```

**Database Configuration:**

```sql
-- MySQL/MariaDB
ALTER DATABASE vibethink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PostgreSQL (verify)
SHOW SERVER_ENCODING;  -- Must return: UTF8
```

---

### 2. API Responses

**REQUIRED headers for ALL API endpoints:**

```typescript
// ✅ CORRECT: All API responses
export async function GET(req: Request) {
  return Response.json(data, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Language': locale || 'en'
    }
  });
}

// ✅ CORRECT: Accept-Language header support
export async function POST(req: Request) {
  const locale = req.headers.get('Accept-Language')?.split(',')[0] || 'en';
  // Use locale for response
}
```

---

### 3. Frontend Configuration

**REQUIRED in all HTML documents:**

```html
<!-- ✅ CORRECT: Root layout -->
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <!-- Content -->
  </body>
</html>

<!-- ✅ CORRECT: Arabic (RTL) -->
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
  </head>
</html>
```

**TypeScript Configuration:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "charset": "utf8",
    "locale": "en"
  }
}
```

---

### 4. File Encoding

**REQUIRED for ALL source files:**

- ✅ **Encoding:** UTF-8 (without BOM)
- ✅ **Line endings:** LF (Unix style)
- ✅ **Indentation:** 2 spaces (no tabs)

**Git Configuration:**

```bash
# .gitattributes (MANDATORY)
* text=auto eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.md text eol=lf
```

**Editor Configuration:**

```ini
# .editorconfig (MANDATORY)
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
```

---

### 5. Locale Configuration

**REQUIRED for all locales:**

```typescript
// src/lib/i18n/locale-config.ts
import { getLocaleConfig, formatCurrency, formatNumber, getVoiceLanguage } from '@/lib/i18n/locale-config';

// Currency formatting
const price = formatCurrency(1234.56, 'es');  // "1.234,56 $"
const priceAr = formatCurrency(1234.56, 'ar'); // "1٬234٫56 ر.س"

// Number formatting
const number = formatNumber(1234567.89, 'fr', 2);  // "1 234 567,89"

// Voice agent language
const voiceLang = getVoiceLanguage('zh');  // "zh-CN"
```

**Locale-Specific Settings:**

| Locale | Currency | Decimal | Thousands | Voice | Date Format |
|--------|----------|---------|-----------|-------|-------------|
| en | $ (USD) | . | , | en-US | MM/DD/YYYY |
| es | $ (USD) | , | . | es-ES | DD/MM/YYYY |
| ar | ر.س (SAR) | ٫ | ٬ | ar-SA | DD/MM/YYYY |
| zh | ¥ (CNY) | . | , | zh-CN | YYYY/MM/DD |
| fr | € (EUR) | , | (space) | fr-FR | DD/MM/YYYY |
| pt | R$ (BRL) | , | . | pt-BR | DD/MM/YYYY |
| de | € (EUR) | , | . | de-DE | DD.MM.YYYY |

**Voice Agent Configuration:**

```typescript
// AI voice agents automatically use user's locale
const userLocale = getClosestLocale(navigator.languages);
const voiceConfig = {
  language: getVoiceLanguage(userLocale),
  voice: `${userLocale}-Neural`  // e.g., "es-ES-Neural"
};
```

---

### 6. i18n Implementation

**REQUIRED structure:**

```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   ├── projects.json
│   ├── ai-chat.json
│   └── ...
├── es/
│   ├── projects.json
│   ├── ai-chat.json
│   └── ...
├── ar/  (Phase 2)
├── zh/  (Phase 2)
├── fr/  (Phase 2)
├── pt/  (Phase 2)
└── de/  (Phase 2)
```

**REQUIRED in all components:**

```typescript
// ✅ CORRECT: Use translation hook
import { useTranslation } from '@/lib/i18n';

export function Component() {
  const { t } = useTranslation('namespace');
  
  return <h1>{t('key')}</h1>;
}

// ❌ WRONG: Hardcoded strings
export function Component() {
  return <h1>Welcome</h1>;  // ❌ FORBIDDEN
}
```

---

### 7. English Fallback Rule

**MANDATORY: Automatic fallback to English**

**RULE:** If a translation key is not found in the current locale, the system MUST automatically fallback to English.

**Implementation:**
```typescript
// ✅ AUTOMATIC in i18n system
const text = t('projects.welcome.title');
// 1. Try current locale (e.g., 'ar')
// 2. If not found → Fallback to 'en'
// 3. If still not found → Return key as-is
```

**Behavior:**
- User in Arabic sees English text if Arabic translation missing
- User in Chinese sees English text if Chinese translation missing
- **NEVER** show raw keys like `projects.welcome.title` to users
- **NEVER** show blank/empty strings

**Example:**
```typescript
// User locale: 'zh' (Chinese)
// Translation exists in EN but not in ZH

t('projects.new_feature.title')
// → Returns: "New Feature" (English fallback)
// → NOT: "projects.new_feature.title" ❌
// → NOT: "" ❌
```

**Console Output:**
```
[i18n] Translation not found for 'projects.new_feature.title' in 'zh', falling back to English
[i18n] ✅ Fallback successful: Using English translation
```

**Rationale:**
- ✅ Prevents broken UI with raw keys
- ✅ English is universally understood as fallback
- ✅ Allows gradual translation (start with EN/ES, add others later)
- ✅ Better UX than showing nothing

**This is implemented automatically in the i18n system.**

---

### 8. Automatic Translation Rule

**MANDATORY: AI-Powered Translation for All UI Elements**

**RULE:** When creating ANY new UI element (button, label, message, etc.), you MUST automatically generate translations in ALL 7 languages.

**Applies to:**
- All buttons and labels
- All messages and notifications
- All form fields and placeholders
- All error and success messages
- All tooltips and help text
- All navigation items
- All status indicators

**Process:**

1. **Create English base** (always first)
   ```json
   // en/module.json
   {
     "new_feature": {
       "title": "New Feature",
       "description": "This is a new feature"
     }
   }
   ```

2. **Generate Spanish translation** (manual or AI)
   ```json
   // es/module.json
   {
     "new_feature": {
       "title": "Nueva Funcionalidad",
       "description": "Esta es una nueva funcionalidad"
     }
   }
   ```

3. **Auto-generate remaining 5 languages** (AI-powered)
   ```json
   // ar/module.json (Arabic)
   {
     "new_feature": {
       "title": "ميزة جديدة",
       "description": "هذه ميزة جديدة"
     }
   }
   
   // zh/module.json (Chinese)
   {
     "new_feature": {
       "title": "新功能",
       "description": "这是一个新功能"
     }
   }
   
   // fr/module.json (French)
   {
     "new_feature": {
       "title": "Nouvelle Fonctionnalité",
       "description": "Ceci est une nouvelle fonctionnalité"
     }
   }
   
   // pt/module.json (Portuguese)
   {
     "new_feature": {
       "title": "Nova Funcionalidade",
       "description": "Esta é uma nova funcionalidade"
     }
   }
   
   // de/module.json (German)
   {
     "new_feature": {
       "title": "Neue Funktion",
       "description": "Dies ist eine neue Funktion"
     }
   }
   ```

**Translation Quality Guidelines:**

**✅ AUTO-TRANSLATE (High confidence):**
- Standard UI elements (Save, Cancel, Delete, Edit)
- Technical terms (Status, Priority, Date, Time)
- Common actions (Create, Update, Export, Import)
- System messages (Loading, Success, Error)

**⚠️ REVIEW REQUIRED (Medium confidence):**
- Business-specific terminology
- Domain-specific jargon
- Cultural references
- Idiomatic expressions

**🚫 HUMAN TRANSLATION ONLY (Critical):**
- Marketing copy and slogans
- Legal terms and conditions
- Privacy policies
- Brand messaging
- Customer-facing communications

**AI Translation Prompt Template:**

```
Translate the following UI text to [LANGUAGE]:

Context: [Module name and purpose]
Text type: [Button/Label/Message/etc.]
English text: "[text]"

Requirements:
- Keep it concise and natural
- Use formal tone for business context
- Maintain technical accuracy
- Consider cultural appropriateness
- Match the length of the original if possible

Provide ONLY the translation, no explanations.
```

**Validation Checklist:**

Before committing translations:
- [ ] All 7 language files updated
- [ ] Keys match exactly across all files
- [ ] No English text in non-EN files (except proper nouns)
- [ ] Translations are contextually appropriate
- [ ] Special characters properly encoded (UTF-8)
- [ ] Tested in UI (no overflow, truncation)

**Example Workflow:**

```typescript
// 1. Add new UI element
<Button>{t('actions.export_data')}</Button>

// 2. Add to EN
"actions": {
  "export_data": "Export Data"
}

// 3. AI generates for all languages
// es: "Exportar Datos"
// ar: "تصدير البيانات"
// zh: "导出数据"
// fr: "Exporter les Données"
// pt: "Exportar Dados"
// de: "Daten Exportieren"

// 4. Commit all 7 files together
git add translations/*/module.json
git commit -m "feat(i18n): Add export_data translations (7 languages)"
```

**Benefits:**

- ✅ **Zero technical debt** - No "translate later" backlog
- ✅ **Global from day one** - Every feature works in 7 languages
- ✅ **Consistent experience** - All users get same quality
- ✅ **Faster development** - No waiting for translators
- ✅ **Cost effective** - AI translations are free/cheap
- ✅ **Scalable** - Easy to add more languages

**Non-Compliance:**

- ❌ PR rejected if missing any language
- ❌ Deployment blocked if translations incomplete
- ❌ CI/CD checks fail if keys don't match

**This rule is MANDATORY for all new UI development.**

---

### 9. RTL Support

**REQUIRED for Arabic (ar):**

```typescript
// lib/i18n/config.ts
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function isRTL(locale: string): boolean {
  return RTL_LANGUAGES.includes(locale);
}
```

**REQUIRED CSS:**

```css
/* ✅ CORRECT: RTL-aware spacing */
.container {
  padding-inline-start: 1rem;  /* Use logical properties */
  padding-inline-end: 1rem;
}

/* ❌ WRONG: Fixed direction */
.container {
  padding-left: 1rem;   /* ❌ Breaks in RTL */
  padding-right: 1rem;
}
```

---

### 7. Validation Rules

**MANDATORY checks before deployment:**

```bash
# 1. Verify all translation files exist
node scripts/validate-i18n-completeness.js --all-locales

# 2. Check for hardcoded strings
node scripts/detect-hardcoded-strings.js --strict

# 3. Verify database encoding
SELECT DEFAULT_CHARACTER_SET_NAME FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'vibethink_db';
-- Must return: utf8mb4

# 4. Test RTL layout
npm run test:rtl
```

---

## 🚫 ZERO TOLERANCE RULE: NO HARDCODED STRINGS

### ABSOLUTE RULE: Every String MUST Be Localized

**MANDATORY:** There is **ZERO TOLERANCE** for hardcoded strings anywhere in the codebase.

**This rule applies to:**

#### ✅ ALL User-Facing Text
- Buttons, labels, links
- Titles, subtitles, headings
- Messages (success, error, warning, info)
- Tooltips and help text
- Placeholders in inputs
- Alt text for images
- Breadcrumbs and navigation
- Table headers and columns
- Form labels and validation messages
- Modal titles and content
- Notifications and toasts
- Loading states and spinners
- Empty states
- 404/500 error pages

#### ✅ ALL AI Context and Prompts
- System prompts for AI agents
- User instructions
- AI response templates
- Context descriptions
- Voice agent scripts
- Chatbot responses
- Auto-complete suggestions
- Search hints

#### ✅ ALL Internal UI Elements
- Developer tools
- Debug messages (visible in UI)
- Admin panel text
- Settings and preferences
- Dashboard widgets
- Status indicators
- Progress messages

#### ✅ ALL Data Displayed to Users
- User names (when templated)
- Dates and times (formatted)
- Numbers and currency
- Percentages and metrics
- Lists and enumerations

### ❌ FORBIDDEN Examples

```typescript
// ❌ ABSOLUTELY FORBIDDEN
<button>Save</button>
<h1>Welcome to ViTo</h1>
<p>Loading...</p>
<input placeholder="Enter your name" />
<img alt="User avatar" />

// ❌ FORBIDDEN: AI Context
const systemPrompt = "You are a helpful assistant";
const aiInstruction = "Please summarize this text";

// ❌ FORBIDDEN: Error Messages
throw new Error("Invalid input");
toast.error("Something went wrong");

// ❌ FORBIDDEN: Status Text
<span>Active</span>
<div>Pending approval</div>

// ❌ FORBIDDEN: Even Comments Visible in UI
{/* This feature is coming soon */}  // If shown to users
```

### ✅ CORRECT Examples

```typescript
// ✅ CORRECT: All text localized
<button>{t('common.save')}</button>
<h1>{t('welcome.title')}</h1>
<p>{t('common.loading')}</p>
<input placeholder={t('form.name_placeholder')} />
<img alt={t('user.avatar_alt')} />

// ✅ CORRECT: AI Context
const systemPrompt = t('ai.system_prompt');
const aiInstruction = t('ai.summarize_instruction');

// ✅ CORRECT: Error Messages
throw new Error(t('errors.invalid_input'));
toast.error(t('errors.generic'));

// ✅ CORRECT: Status Text
<span>{t('status.active')}</span>
<div>{t('status.pending_approval')}</div>
```

### 🔍 Detection and Enforcement

**Automated Checks:**
```bash
# Run before every commit
npm run lint:hardcoded-strings

# CI/CD Pipeline
- name: Check for hardcoded strings
  run: |
    node scripts/detect-hardcoded-strings.js --strict --fail-on-found
```

**Manual Review:**
- Every PR must be reviewed for hardcoded strings
- Reviewers MUST reject PRs with any hardcoded text
- No exceptions without CTO approval

**Detection Script:**
```javascript
// scripts/detect-hardcoded-strings.js
// Scans for:
// - JSX text nodes without {t(...)}
// - String literals in render functions
// - Hardcoded error messages
// - Non-localized placeholders
```

### 📋 Migration Checklist

**For Existing Code:**
1. Identify all hardcoded strings
2. Create translation keys in `en/*.json`
3. Replace strings with `t('key')`
4. Generate translations for all 7 languages
5. Test in all languages
6. Commit with message: `fix(i18n): Remove hardcoded strings from [component]`

### 🎯 Why This Matters

**User Experience:**
- Users in all 7 languages get equal experience
- No broken UI with mixed languages
- Professional, polished appearance

**Maintenance:**
- Easy to update text (one place)
- No hunting for strings in code
- Consistent terminology

**Scalability:**
- Adding new languages is trivial
- No refactoring needed later
- Future-proof architecture

### ⚠️ Consequences of Non-Compliance

**Immediate:**
- ❌ PR automatically rejected
- ❌ CI/CD pipeline fails
- ❌ Cannot merge to main

**Long-term:**
- ❌ Technical debt accumulates
- ❌ Inconsistent user experience
- ❌ Expensive refactoring later

### 🔒 No Exceptions

**This rule has NO exceptions.**

Even for:
- "Quick prototypes" → Must be localized
- "Internal tools" → Must be localized
- "Admin only" → Must be localized
- "Temporary code" → Must be localized

**If it's in the codebase, it MUST be localized.**

---

## 🚫 Forbidden Practices

### ❌ NEVER Do This:

1. **Hardcoded strings in components**
   ```typescript
   // ❌ FORBIDDEN
   <h1>Welcome to ViTo</h1>
   ```

2. **Non-UTF-8 encodings**
   ```sql
   -- ❌ FORBIDDEN
   CHARACTER SET latin1
   CHARACTER SET ascii
   ```

3. **Fixed text direction**
   ```css
   /* ❌ FORBIDDEN */
   text-align: left;  /* Use logical properties instead */
   ```

4. **Language-specific logic**
   ```typescript
   // ❌ FORBIDDEN
   if (text.includes('Hello')) { ... }  // Breaks in other languages
   ```

5. **Locale-specific date formats**
   ```typescript
   // ❌ FORBIDDEN
   const date = '12/23/2025';  // Ambiguous format
   
   // ✅ CORRECT
   const date = new Date('2025-12-23').toLocaleDateString(locale);
   ```

---

## 📊 Compliance Checklist

### For Every New Feature:

- [ ] All user-facing text uses `t()` function
- [ ] Database columns use UTF-8 encoding
- [ ] API responses include `Content-Language` header
- [ ] RTL layout tested for Arabic
- [ ] Translation files exist for all 7 languages
- [ ] No hardcoded strings in code
- [ ] CSS uses logical properties (inline-start/end)
- [ ] Date/time formatting uses locale-aware functions

### For Every Database Migration:

- [ ] All VARCHAR/TEXT columns use `utf8mb4_unicode_ci`
- [ ] `locale` column exists where applicable
- [ ] Default locale is `'en'`
- [ ] Indexes on locale columns for performance

### For Every API Endpoint:

- [ ] Accepts `Accept-Language` header
- [ ] Returns `Content-Language` header
- [ ] Error messages are translatable
- [ ] Validation messages use i18n keys

---

## 🎯 Implementation Phases

### Phase 1: Current (EN/ES) ✅
- English (base language)
- Spanish (complete)
- All infrastructure ready

### Phase 2: Global Expansion (2024 Q2)
- Arabic (RTL support)
- Chinese Simplified
- French
- Portuguese
- German

---

## 📖 Reference Documentation

**Primary Documents:**
- `docs/architecture/I18N_COMPONENT_NAMESPACE_STRATEGY.md` - i18n architecture
- `docs/examples/MULTILINGUAL_EXAMPLES.md` - Real-world examples
- `COMPONENT_WRAPPER_PATTERN.md` - Component safety pattern

**Technical Specs:**
- UTF-8: RFC 3629
- BCP 47: Language tags
- Unicode: Version 15.0+

---

## ⚖️ Enforcement

**This is a MANDATORY standard. All code must comply.**

**Review Process:**
1. Automated checks in CI/CD pipeline
2. Manual review for RTL layouts
3. Translation completeness validation
4. Database encoding verification

**Non-Compliance:**
- ❌ Pull requests will be rejected
- ❌ Deployments will be blocked
- ❌ Technical debt tickets created

---

## ✅ Approval & Authority

**Approved by:** Marcelo Escallón (CTO)  
**Date:** 2025-12-23  
**Status:** MANDATORY for all development  
**Version:** 1.0.0

**This standard is effective immediately and applies to:**
- All new development
- All database schemas
- All API endpoints
- All frontend components
- All third-party integrations

---

**Questions or exceptions require CTO approval.**

---

## 🔒 Module Completion Rule

### MANDATORY: 7-Language Implementation

**RULE:** Every module mockup MUST be implemented in ALL 7 languages before being considered "complete".

**Applies to:**
- All new modules
- All new features
- All UI components
- All user-facing text

**Process:**
1. **Create English base** (`en/*.json`)
2. **Translate to Spanish** (`es/*.json`) - REQUIRED
3. **Copy to remaining 5 languages** (`ar/`, `zh/`, `fr/`, `pt/`, `de/`) - Use English as placeholder
4. **Mark for translation** - Add `// TODO: Translate` comments in non-EN/ES files
5. **Validate** - Run `npm run validate:i18n`

**Example Structure:**
```
translations/
├── en/
│   ├── module-name.json  ✅ English (base)
│   └── ...
├── es/
│   ├── module-name.json  ✅ Spanish (translated)
│   └── ...
├── ar/
│   ├── module-name.json  🔄 Arabic (English placeholder)
│   └── ...
├── zh/
│   ├── module-name.json  🔄 Chinese (English placeholder)
│   └── ...
├── fr/
│   ├── module-name.json  🔄 French (English placeholder)
│   └── ...
├── pt/
│   ├── module-name.json  🔄 Portuguese (English placeholder)
│   └── ...
└── de/
    ├── module-name.json  🔄 German (English placeholder)
    └── ...
```

**Rationale:**
- ✅ Prevents technical debt
- ✅ Ensures global-ready infrastructure from day one
- ✅ Avoids "we'll translate later" syndrome
- ✅ Makes future translation easier (files already exist)
- ✅ Testing works in all languages immediately

**Non-Compliance:**
- ❌ Module cannot be merged to main
- ❌ Feature cannot be deployed
- ❌ PR will be rejected

**This rule is effective immediately for all development.**
