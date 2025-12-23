# Enterprise Configuration Guide - i18n & Settings

**Version:** 1.0.0  
**Status:** ✅ REFERENCE GUIDE  
**Last Updated:** 2025-12-23  
**Purpose:** Configure i18n and settings at enterprise/organization level

---

## 🎯 Purpose

Define how to configure i18n settings, language preferences, quality standards, and customizations at the **enterprise/organization level** for future scalability.

---

## 🏢 Configuration Levels

### 1. Global Level (Platform-Wide)
**Scope:** All users, all organizations  
**Managed by:** Platform administrators  
**Examples:**
- Supported languages (7 languages)
- Default fallback language (English)
- Quality standards
- Translation validation rules

### 2. Organization Level (Per Company)
**Scope:** All users within an organization  
**Managed by:** Organization administrators  
**Examples:**
- Primary language for organization
- Allowed languages for organization
- Custom terminology/glossary
- Brand voice and tone
- Industry-specific translations

### 3. Team Level (Per Department)
**Scope:** Users within a team/department  
**Managed by:** Team administrators  
**Examples:**
- Team-specific language preferences
- Department terminology
- Custom translations for team workflows

### 4. User Level (Individual)
**Scope:** Individual user  
**Managed by:** User themselves  
**Examples:**
- Preferred language
- UI preferences
- Notification language
- Voice preferences

---

## 📊 Database Schema

### Organizations Table

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- i18n Settings
  primary_language VARCHAR(5) DEFAULT 'en',
  allowed_languages VARCHAR(5)[] DEFAULT ARRAY['en', 'es'],
  fallback_language VARCHAR(5) DEFAULT 'en',
  
  -- Quality Standards
  translation_quality_threshold INTEGER DEFAULT 95,
  require_native_verification BOOLEAN DEFAULT false,
  require_context_files BOOLEAN DEFAULT true,
  
  -- Custom Terminology
  custom_glossary JSONB DEFAULT '{}',
  brand_voice JSONB DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Organization i18n Settings Table

```sql
CREATE TABLE organization_i18n_settings (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  
  -- Language Configuration
  enabled_languages VARCHAR(5)[] NOT NULL,
  default_language VARCHAR(5) NOT NULL,
  force_language BOOLEAN DEFAULT false,
  
  -- Translation Settings
  auto_translate BOOLEAN DEFAULT true,
  translation_provider VARCHAR(50) DEFAULT 'ai',
  require_human_review BOOLEAN DEFAULT false,
  
  -- Quality Settings
  min_quality_score INTEGER DEFAULT 90,
  require_context BOOLEAN DEFAULT true,
  require_ai_instructions BOOLEAN DEFAULT true,
  
  -- Custom Settings
  custom_translations JSONB DEFAULT '{}',
  terminology_overrides JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Custom Translations Table

```sql
CREATE TABLE custom_translations (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  
  -- Translation Info
  namespace VARCHAR(100) NOT NULL,
  key VARCHAR(255) NOT NULL,
  locale VARCHAR(5) NOT NULL,
  value TEXT NOT NULL,
  
  -- Context
  context JSONB,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(organization_id, namespace, key, locale)
);
```

### Glossary Table

```sql
CREATE TABLE organization_glossary (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  
  -- Term Info
  term VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  
  -- Translations
  translations JSONB NOT NULL,
  -- Example: {"en": "Project", "es": "Proyecto", "ar": "مشروع"}
  
  -- Context
  definition TEXT,
  usage_notes TEXT,
  examples JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(organization_id, term)
);
```

---

## 🔧 Configuration API

### Get Organization Settings

```typescript
// GET /api/organizations/{orgId}/i18n/settings
export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  const settings = await db.query(`
    SELECT * FROM organization_i18n_settings
    WHERE organization_id = $1
  `, [params.orgId]);
  
  return Response.json(settings);
}
```

### Update Organization Settings

```typescript
// PUT /api/organizations/{orgId}/i18n/settings
export async function PUT(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  const body = await req.json();
  
  const updated = await db.query(`
    UPDATE organization_i18n_settings
    SET
      enabled_languages = $1,
      default_language = $2,
      auto_translate = $3,
      min_quality_score = $4,
      updated_at = NOW()
    WHERE organization_id = $5
    RETURNING *
  `, [
    body.enabled_languages,
    body.default_language,
    body.auto_translate,
    body.min_quality_score,
    params.orgId
  ]);
  
  return Response.json(updated);
}
```

### Add Custom Translation

```typescript
// POST /api/organizations/{orgId}/i18n/translations
export async function POST(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  const { namespace, key, locale, value, context } = await req.json();
  
  const translation = await db.query(`
    INSERT INTO custom_translations
    (organization_id, namespace, key, locale, value, context, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (organization_id, namespace, key, locale)
    DO UPDATE SET value = $5, context = $6, updated_at = NOW()
    RETURNING *
  `, [params.orgId, namespace, key, locale, value, context, req.user.id]);
  
  return Response.json(translation);
}
```

---

## 🎨 Admin UI Components

### Organization Settings Page

```typescript
// app/admin/organizations/[orgId]/i18n/page.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function OrganizationI18nSettings({ params }: { params: { orgId: string } }) {
  const { t } = useTranslation('admin');
  const [settings, setSettings] = useState<OrgI18nSettings | null>(null);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('i18n.settings.title')}</h1>
      
      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle>{t('i18n.languages.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSelector
            availableLanguages={AVAILABLE_LOCALES}
            enabledLanguages={settings?.enabled_languages}
            defaultLanguage={settings?.default_language}
            onChange={updateLanguages}
          />
        </CardContent>
      </Card>
      
      {/* Quality Standards */}
      <Card>
        <CardHeader>
          <CardTitle>{t('i18n.quality.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <QualitySettings
            minScore={settings?.min_quality_score}
            requireContext={settings?.require_context}
            requireAI={settings?.require_ai_instructions}
            onChange={updateQuality}
          />
        </CardContent>
      </Card>
      
      {/* Custom Glossary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('i18n.glossary.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <GlossaryManager organizationId={params.orgId} />
        </CardContent>
      </Card>
      
      {/* Custom Translations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('i18n.custom.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTranslationManager organizationId={params.orgId} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📋 Configuration Examples

### Example 1: Tech Startup (English Primary)

```json
{
  "organization_id": "org_123",
  "enabled_languages": ["en", "es"],
  "default_language": "en",
  "force_language": false,
  "auto_translate": true,
  "translation_provider": "ai",
  "require_human_review": false,
  "min_quality_score": 90,
  "require_context": true,
  "require_ai_instructions": true,
  "custom_translations": {},
  "terminology_overrides": {
    "project": {
      "en": "Project",
      "es": "Proyecto"
    }
  }
}
```

### Example 2: Global Corporation (Multi-Language)

```json
{
  "organization_id": "org_456",
  "enabled_languages": ["en", "es", "ar", "zh", "fr", "pt", "de"],
  "default_language": "en",
  "force_language": false,
  "auto_translate": true,
  "translation_provider": "ai",
  "require_human_review": true,
  "min_quality_score": 95,
  "require_context": true,
  "require_ai_instructions": true,
  "custom_translations": {
    "navigation.items.projects_v2": {
      "en": "Enterprise Projects",
      "es": "Proyectos Empresariales",
      "ar": "مشاريع المؤسسة"
    }
  },
  "terminology_overrides": {
    "dashboard": {
      "en": "Command Center",
      "es": "Centro de Comando",
      "ar": "مركز القيادة"
    }
  }
}
```

### Example 3: Regional Company (Spanish Primary)

```json
{
  "organization_id": "org_789",
  "enabled_languages": ["es", "en", "pt"],
  "default_language": "es",
  "force_language": false,
  "auto_translate": true,
  "translation_provider": "ai",
  "require_human_review": false,
  "min_quality_score": 85,
  "require_context": true,
  "require_ai_instructions": false,
  "custom_translations": {},
  "terminology_overrides": {}
}
```

---

## 🔄 Translation Override Hierarchy

**Priority (highest to lowest):**

1. **Custom Organization Translation** (highest priority)
   - Stored in `custom_translations` table
   - Specific to organization

2. **Glossary Term**
   - Stored in `organization_glossary` table
   - Organization-wide terminology

3. **Platform Translation**
   - Default translations in `translations/` folder
   - Global for all organizations

4. **Fallback Language**
   - English (or organization's fallback)
   - Last resort

**Example:**
```typescript
function getTranslation(key: string, locale: Locale, orgId: string): string {
  // 1. Check custom organization translation
  const customTranslation = await getCustomTranslation(orgId, key, locale);
  if (customTranslation) return customTranslation;
  
  // 2. Check glossary
  const glossaryTerm = await getGlossaryTerm(orgId, key, locale);
  if (glossaryTerm) return glossaryTerm;
  
  // 3. Check platform translation
  const platformTranslation = t(key, { locale });
  if (platformTranslation !== key) return platformTranslation;
  
  // 4. Fallback to English
  return t(key, { locale: 'en' });
}
```

---

## 🎯 Use Cases

### Use Case 1: Custom Brand Terminology

**Scenario:** Company wants "Projects" to be called "Initiatives"

**Solution:**
```typescript
// Add to custom_translations
await addCustomTranslation({
  organization_id: 'org_123',
  namespace: 'navigation',
  key: 'items.projects_v2',
  locale: 'en',
  value: 'Initiatives',
  context: {
    reason: 'Brand terminology preference',
    approved_by: 'CMO'
  }
});

// Result: Sidebar shows "Initiatives" instead of "Projects"
```

---

### Use Case 2: Industry-Specific Terms

**Scenario:** Healthcare company needs medical terminology

**Solution:**
```typescript
// Add to glossary
await addGlossaryTerm({
  organization_id: 'org_456',
  term: 'patient',
  translations: {
    en: 'Patient',
    es: 'Paciente',
    ar: 'مريض',
    zh: '患者',
    fr: 'Patient',
    pt: 'Paciente',
    de: 'Patient'
  },
  definition: 'Individual receiving medical care',
  usage_notes: 'Always capitalize in formal contexts'
});
```

---

### Use Case 3: Regional Variations

**Scenario:** Spanish company wants Latin American Spanish

**Solution:**
```typescript
// Configure organization
await updateOrgSettings({
  organization_id: 'org_789',
  enabled_languages: ['es', 'en'],
  default_language: 'es',
  custom_translations: {
    'common.computer': {
      es: 'computadora'  // Latin American
      // Instead of: 'ordenador' (Spain Spanish)
    }
  }
});
```

---

## 📊 Migration Guide

### Step 1: Assess Current State
```bash
# Audit existing translations
npm run audit:translations

# Generate migration plan
npm run plan:migration --org=org_123
```

### Step 2: Create Organization Settings
```typescript
// Create default settings for organization
const settings = await createOrgI18nSettings({
  organization_id: 'org_123',
  enabled_languages: ['en', 'es'],
  default_language: 'en',
  // ... other settings
});
```

### Step 3: Import Custom Translations
```bash
# Import from CSV/JSON
npm run import:translations --org=org_123 --file=custom.csv
```

### Step 4: Validate
```bash
# Validate all translations
npm run validate:org-translations --org=org_123
```

### Step 5: Deploy
```bash
# Deploy to production
npm run deploy:org-settings --org=org_123
```

---

## ✅ Best Practices

1. **Start with defaults** - Use platform translations as base
2. **Override selectively** - Only customize what's necessary
3. **Document changes** - Always add context to custom translations
4. **Test thoroughly** - Validate in all enabled languages
5. **Version control** - Track changes to custom translations
6. **Regular audits** - Review custom translations quarterly
7. **User feedback** - Collect feedback on terminology

---

## 🚫 Common Pitfalls

1. **Over-customization** - Too many custom translations = maintenance nightmare
2. **Inconsistent terminology** - Different terms for same concept
3. **Missing context** - Custom translations without explanation
4. **No fallbacks** - Not handling missing translations
5. **Ignoring quality** - Accepting low-quality custom translations
6. **No review process** - Anyone can add custom translations

---

## 📚 Future Enhancements

- [ ] Multi-tenant translation management UI
- [ ] Translation approval workflow
- [ ] Version history for custom translations
- [ ] A/B testing for terminology
- [ ] Translation analytics (which terms are used most)
- [ ] Automated quality scoring
- [ ] Integration with professional translation services
- [ ] Export/import tools for bulk management

---

**Last Updated:** 2025-12-23  
**Version:** 1.0.0  
**Status:** ✅ Reference Guide - Ready for Implementation
