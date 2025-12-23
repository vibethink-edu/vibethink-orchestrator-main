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

### 5. i18n Implementation

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

### 6. RTL Support

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
