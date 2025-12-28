# 📦 Third-Party Asset Library Policy

**Version:** 2.0.0
**Status:** ✅ MANDATORY
**Effective Date:** 2025-12-27
**Authority:** CTO - Marcelo Escallón

---

## 🎯 Purpose

This policy defines the **mandatory standard** for managing third-party UI components, libraries, and assets across all VibeThink Orchestrator workspaces. It consolidates all reference rules, adaptation protocols, and asset management into a unified standard.

---

## 📐 Philosophy

### Core Principles

```
Third-Party Assets (External & Updatable)    VibeThink Orchestrator (Stable)
───────────────────────────────────────     ─────────────────────────────────
vibethink-asset-library/ (READ-ONLY)    →   vibethink-orchestrator-main/ (MODIFIABLE)
bundui/ (external reference)              →   apps/dashboard/ (production)
shadcn-ui/ (external reference)          →   packages/ui/ (centralized)
xyflow/ (external reference)             →   apps/dashboard/ (adapted)
```

**Key Principles:**

1. **Separation of Concerns**: Reference ≠ Production
2. **Read-Only Reference**: Never modify third-party sources
3. **Selective Adaptation**: Choose what to import, not everything
4. **i18n First**: All adapted components support 9 languages
5. **Centralized Assets**: Single source of truth for all media

---

## 📁 Architecture

### Workspace Structure

```
C:\IA Marcelo Labs\
├── vibethink-orchestrator-main\        # 🏠 PRODUCTION MONOREPO
│   ├── apps/
│   │   └── dashboard/                  # Main Next.js app
│   ├── packages/
│   │   ├── ui/                        # @vibethink/ui (components)
│   │   └── utils/                     # @vibethink/utils (utilities)
│   └── public/
│       └── assets/                     # Centralized assets
│
├── vibethink-asset-library\            # 📦 ALL THIRD-PARTY SOURCES (READ-ONLY)
│   ├── bundui/                        # Bundui repositories
│   │   ├── shadcn-ui-kit-dashboard/   # Bundui Premium Dashboard Kit
│   │   ├── cosmic-main/               # Cosmic template
│   │   ├── neofolio-main/             # Neofolio template
│   │   └── soho-nextjs-main/          # Soho template
│   │
│   ├── shadcn-ui/                     # Official Shadcn UI
│   │   ├── ui/                        # Official monorepo
│   │   └── apps/v4/                   # Docs + Registry
│   │
│   ├── xyflow/                        # XYFlow official
│   │   └── xyflow/                   # Node-based UIs
│   │
│   ├── bundui-premium/                # Bundui Premium (purchased, extracted)
│   ├── shadcn-ecosystem/             # Shadcn components/blocks/templates
│   ├── xyflow-reference/              # React Flow examples
│   ├── aceternity-ui/                # UI components
│   ├── magic-ui/                     # UI components
│   ├── framer-motion/                # Animation library
│   ├── recharts/                     # Chart library
│   ├── tiptap/                       # Rich text editor
│   └── vercel-ai-sdk/                # AI SDK
│
└── _vibethink-dev-kit\                 # 📚 METHODOLOGY
    └── knowledge/                     # Guides and standards
```

---

## 📋 Asset Library Inventory

### 🚨 REORGANIZATION NEEDED

**Current Status:**
- ❌ `C:\IA Marcelo Labs\bundui\` - Should be IN vibethink-asset-library
- ❌ `C:\IA Marcelo Labs\shadcn-ui\` - Should be IN vibethink-asset-library
- ❌ `C:\IA Marcelo Labs\xyflow\` - Should be IN vibethink-asset-library

**Target Status:**
- ✅ All third-party sources inside `vibethink-asset-library/`

### Bundui Repositories

| Repository | Location | Purpose | Status |
|------------|----------|---------|--------|
| **shadcn-ui-kit-dashboard** | `bundui/shadcn-ui-kit-dashboard/` | Bundui Premium Dashboard Kit | 🟢 Active reference |
| **cosmic-main** | `bundui/cosmic-main/` | Cosmic template | 🟢 Available |
| **neofolio-main** | `bundui/neofolio-main/` | Neofolio template | 🟢 Available |
| **soho-nextjs-main** | `bundui/soho-nextjs-main/` | Soho template | 🟢 Available |
| **bundui-premium** | `bundui-premium/` | Extracted Bundui Premium | 🟢 Active reference |

**Sync Status:** `bundui-premium/SYNC_STATUS.md`
**Adaptation Location:** `apps/dashboard/app/dashboard-bundui/`

### Shadcn UI Official

| Repository | Location | Purpose | Status |
|------------|----------|---------|--------|
| **Official Monorepo** | `shadcn-ui/ui/` | Official Shadcn UI | 🟢 Active reference |
| **Docs & Registry** | `shadcn-ui/ui/apps/v4/` | Documentation + Component Registry | 🟢 Active reference |

**Source:** https://github.com/shadcn-ui/ui
**Adaptation Location:** `packages/ui/`

### XYFlow Official

| Attribute | Details |
|-----------|---------|
| **Location** | `xyflow/xyflow/` |
| **Purpose** | Node-based UIs, workflows, diagrams |
| **Source** | https://github.com/xyflow/xyflow |
| **Documentation** | https://reactflow.dev |
| **Status** | 🟢 Active reference |
| **Adaptation Location:** `apps/dashboard/...` (adapted examples) |

### Additional Libraries

| Library | Purpose | Location | Status |
|---------|---------|----------|--------|
| **Aceternity UI** | Modern UI components | `aceternity-ui/` | 🟡 To be acquired |
| **Magic UI** | UI components | `magic-ui/` | 🟡 To be acquired |
| **Framer Motion** | Animations | `framer-motion/` | 🟢 Reference |
| **Recharts** | Charts | `recharts/` | 🟢 Reference |
| **Tiptap** | Rich text editor | `tiptap/` | 🟢 Reference |
| **Vercel AI SDK** | AI integration | `vercel-ai-sdk/` | 🟢 Reference |

---

## 🚨 Critical Rules

### ❌ NEVER Do

1. **NEVER modify third-party sources directly**
   ```
   ❌ Edit: vibethink-asset-library/bundui-premium/components/*
   ❌ Edit: vibethink-asset-library/xyflow-reference/*
   ✅ Copy & Adapt: apps/dashboard/app/dashboard-bundui/*
   ```

2. **NEVER use components without i18n adaptation**
   ```
   ❌ <ThirdPartyButton>Submit</ThirdPartyButton>
   ✅ <AdaptedButton labelKey="actions.submit" />
   ```

3. **NEVER duplicate assets across locations**
   ```
   ❌ vibethink-asset-library/bundui-premium/public/image.png
   ❌ apps/dashboard/public/image.png
   ✅ apps/dashboard/public/assets/images/bundui/image.png (centralized)
   ```

4. **NEVER commit modified third-party code**
   - Only commit adapted versions to production monorepo
   - Never push changes to asset library

### ✅ ALWAYS Do

1. **ALWAYS create i18n wrappers**
   ```typescript
   // ✅ CORRECT
   export function CalendarI18n(props: CalendarProps) {
     const { t } = useTranslation('calendar');
     return <OriginalCalendar {...props} locale={t('locale')} />;
   }
   ```

2. **ALWAYS use centralized assets**
   ```typescript
   // ✅ CORRECT
   <Image src="/assets/images/avatars/user-default.png" />
   
   // ❌ INCORRECT
   <Image src="../../public/avatar.png" />
   ```

3. **ALWAYS document source origin**
   ```typescript
   /**
    * Adapted from Bundui Premium v2.0
    * Source: vibethink-asset-library/bundui-premium/components/button.tsx
    * Adapted: 2025-12-27
    * Changes: Added i18n support, removed hardcoded text
    */
   ```

4. **ALWAYS validate before import**
   ```bash
   # Run validation scripts
   node scripts/validate-9-language-compliance.js --namespace [module-name]
   node scripts/validate-concepts-coherence.js
   ```

---

## 🔄 Adaptation Workflow

### Phase 1: Assessment

**Before integrating any third-party component:**

1. **Identify all hardcoded strings**
   ```bash
   # Scan for hardcoded text
   grep -r "\"[A-Za-z]" vibethink-asset-library/[component]/
   ```

2. **Document all text elements**
   - Button labels
   - Placeholder text
   - Error messages
   - Tooltips
   - Aria labels
   - Alt text

3. **Check for locale dependencies**
   - Date formatting
   - Number formatting
   - Currency display
   - Time zones

4. **Assess RTL compatibility**
   - CSS properties (left/right vs inline-start/end)
   - Layout direction
   - Icon positioning

### Phase 2: Translation Extraction

**Create translation files for ALL 9 languages:**

```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   └── component-name.json     ⭐ MASTER (100% complete)
├── es/
│   └── component-name.json     ⭐ OBLIGATORY (100% complete)
├── fr/
│   └── component-name.json     (fallback to en if incomplete)
├── pt/
│   └── component-name.json     (fallback to en if incomplete)
├── de/
│   └── component-name.json     (fallback to en if incomplete)
├── it/
│   └── component-name.json     (fallback to en if incomplete)
├── ko/
│   └── component-name.json     (fallback to en if incomplete)
├── ar/
│   └── component-name.json     (fallback to en if incomplete)
└── zh/
    └── component-name.json     (fallback to en if incomplete)
```

**Validation Rule:**
- ✅ **English (en):** 100% complete - OBLIGATORY (fallback universal)
- ✅ **Español (es):** 100% complete - OBLIGATORY
- ⚠️ **Others (fr, pt, de, it, ko, ar, zh):** Structure complete, translations optional

### Phase 3: Component Wrapping

**Create a multilingual wrapper:**

```typescript
// apps/dashboard/src/shared/components/component-i18n.tsx
'use client';

import { OriginalComponent } from 'third-party-lib';
import { useTranslation } from '@/lib/i18n';
import type { ComponentProps } from 'third-party-lib';

/**
 * Adapted from Third-Party Library v1.0
 * Source: vibethink-asset-library/[library]/component.tsx
 * Adapted: 2025-12-27
 * Changes: Added i18n support, 9-language compliance
 */
export function ComponentI18n(props: ComponentProps) {
  const { t } = useTranslation('component-namespace');
  
  return (
    <OriginalComponent
      {...props}
      labels={{
        submit: t('actions.submit'),
        cancel: t('actions.cancel'),
        // ... all labels
      }}
      locale={getLocaleForCurrentLanguage()}
    />
  );
}
```

### Phase 4: Asset Migration

**Migrate images and media to centralized repository:**

```bash
# 1. Copy to centralized location
cp vibethink-asset-library/bundui-premium/public/images/* \
   apps/dashboard/public/assets/images/bundui/

# 2. Update references to use absolute paths
# Before: src="../../public/image.png"
# After: src="/assets/images/bundui/image.png"

# 3. Validate no duplicates
node scripts/validate-assets-duplicates.js
```

### Phase 5: Testing

**Mandatory tests for each component:**

1. **Visual test in all 9 languages**
2. **RTL layout test (Arabic)**
3. **Locale formatting test (dates, numbers)**
4. **Asset reference test**
5. **Component integration test**

**Run validation:**
```bash
# Validate i18n compliance
node scripts/validate-9-language-compliance.js --namespace [component-name]

# Validate assets
node scripts/validate-assets-in-repo.js

# Validate all imports
node scripts/validate-import-boundaries.js
```

---

## 📝 Documentation Requirements

### For Each Adapted Component

**Create adaptation guide:**

```markdown
# ComponentName - i18n Adaptation

## Original Source
- **Library**: [Library Name]
- **Version**: [X.Y.Z]
- **Location**: `vibethink-asset-library/[library]/component.tsx`
- **Documentation**: [URL to docs]

## Changes Made
- Created wrapper: `apps/dashboard/src/shared/components/component-i18n.tsx`
- Added translations: `translations/*/component-name.json`
- Migrated assets: `public/assets/images/component/`
- Tested in: All 9 languages

## Usage
```tsx
import { ComponentI18n } from '@/shared/components/component-i18n';

<ComponentI18n labelKey="actions.submit" />
```

## Translation Keys
- `actions.submit` - Submit button label
- `actions.cancel` - Cancel button label
- [List all keys]

## Assets Migrated
- `public/assets/images/component/icon.png` - Component icon
- [List all assets]

## Maintenance
- Update wrapper when upgrading [Library Name]
- Re-test all languages after updates
- Check `vibethink-asset-library/[library]` for new versions
```

### Sync Status Files

**Maintain `SYNC_STATUS.md` for each library:**

```markdown
# [Library Name] - Sync Status

**Version in Library:** [X.Y.Z]
**Last Updated:** [YYYY-MM-DD]

## Integration Matrix

| Component | Status | VibeThink Version | Notes |
|-----------|--------|-------------------|-------|
| Component1 | ✅ Integrated | v1.0 | Added i18n support |
| Component2 | ✅ Integrated | v1.2 | Customized props |
| Component3 | ⚠️ Partial | v0.5 | Only basic features |

## Pending Updates
- [ ] Review new components from v[X.Y.Z]
- [ ] Update Component2 to latest version
- [ ] Test new features

## Migration Notes
- [List any breaking changes]
- [List manual adjustments needed]
```

---

## 🔧 Maintenance Scripts

### Validation Scripts

```bash
# 1. Validate i18n compliance (9 languages)
node scripts/validate-9-language-compliance.js --namespace [module-name]

# 2. Validate concept coherence
node scripts/validate-concepts-coherence.js

# 3. Validate assets (no duplicates)
node scripts/validate-assets-duplicates.js

# 4. Validate import boundaries
node scripts/validate-import-boundaries.js

# 5. Audit all hardcoded text
node scripts/audit-hardcoded-text.js [path]
```

### Migration Scripts

```bash
# 1. Migrate assets to central repository
node scripts/migrate-assets-to-central.js

# 2. Complete missing translation files
node scripts/complete-missing-translations.js

# 3. Sync translation structure
node scripts/sync-translations-structure.js

# 4. Fix common import issues
node scripts/fix-dashboard-imports.js
```

### Comparison Scripts

```bash
# 1. Compare asset library vs monorepo
node scripts/compare-bundui-reference-vs-monorepo.js

# 2. Check vendor versions
node scripts/check-vendor-versions.ps1

# 3. Detect missing translation files
node scripts/detect-missing-i18n-keys.js
```

---

## 🚀 Deployment Protocol

### When Asset Library Receives Updates

**Scenario:**
- Bundui Premium releases v2.1
- Shadcn Ecosystem updates components
- XYFlow adds new features

**Response Protocol:**

1. **Detect Update**
   ```bash
   cd vibethink-asset-library/[library]
   git log --oneline -5  # Check recent changes
   ```

2. **Review Changes**
   - Read changelog
   - Identify new components/features
   - Assess breaking changes

3. **Decision Tree**
   ```
   Update Critical for Production?
   ├── Yes → Update SYNC_STATUS.md
   │        ├── Create adaptation tasks
   │        └── Schedule migration
   │
   └── No → Document as "Available for Future"
        └── Update library version note
   ```

4. **If Updating Production:**
   ```bash
   # 1. Update translation files
   node scripts/complete-missing-translations.js
   
   # 2. Migrate new assets
   node scripts/migrate-assets-to-central.js
   
   # 3. Update component wrappers
   # [Manual adaptation]
   
   # 4. Test all 9 languages
   node scripts/validate-9-language-compliance.js
   
   # 5. Commit changes
   git add .
   git commit -m "feat: [Library] v[X.Y.Z] - [description]"
   ```

5. **Document Sync**
   - Update `SYNC_STATUS.md`
   - Create adaptation guide if needed
   - Update changelog in monorepo

---

## 📊 Compliance Checklist

### Before Marking Component as "Adapted"

- [ ] All hardcoded strings identified
- [ ] Translation files created for all 9 languages
- [ ] English (en) 100% complete - OBLIGATORY
- [ ] Spanish (es) 100% complete - OBLIGATORY
- [ ] Other 7 languages: Structure complete
- [ ] Wrapper or patch implemented
- [ ] Component tested in all 9 languages
- [ ] RTL layout tested (Arabic)
- [ ] Date/number formatting verified
- [ ] Assets migrated to central repository
- [ ] No asset duplicates found
- [ ] Documentation created
- [ ] Migration guide written
- [ ] Tests passing
- [ ] Code review completed
- [ ] SYNC_STATUS.md updated

### Pre-Commit Checklist

- [ ] Asset is in `/assets/` (not duplicated)
- [ ] Asset name is descriptive (not generic)
- [ ] Reference uses absolute path `/assets/...`
- [ ] Translation files in all 9 languages
- [ ] No hardcoded text visible
- [ ] i18n validation passes
- [ ] Asset validation passes
- [ ] SYNC_STATUS.md updated
- [ ] Documentation created

---

## 🌐 Port Assignments

| Service | Port | URL | Purpose |
|----------|--------|-----|---------|
| **Dashboard (Production)** | 3005 | http://localhost:3005 | Main dashboard |
| **Asset Library References** | N/A | N/A | Read-only (no server) |
| **Bundui External Ref** | 3006 | http://localhost:3006 | Legacy reference |
| **Shadcn External Ref** | 3007 | http://localhost:3007 | Legacy reference |
| **XYFlow External Ref** | 3008 | http://localhost:3008 | Legacy reference |

**Note:** `vibethink-asset-library` is a **read-only library**, not a running server. Components are adapted and tested in the production monorepo.

---

## 🎯 Best Practices

### ✅ Recommended

1. **Use wrapper pattern for most components**
   - Keeps original untouched
   - Centralizes i18n logic
   - Easy to update

2. **Prefer selective adaptation**
   - Only import what you need
   - Don't copy entire libraries
   - Reduce bundle size

3. **Document everything**
   - Source origin
   - Changes made
   - Translation keys
   - Migration notes

4. **Test early and often**
   - Test in all 9 languages
   - Test RTL layouts
   - Test asset references

### ❌ Avoid

1. **Don't modify third-party sources**
   - Never edit `vibethink-asset-library/`
   - Never edit external references
   - Always create wrappers

2. **Don't duplicate assets**
   - One location for each asset
   - Centralized in `/assets/`
   - No copies across dashboards

3. **Don't skip i18n**
   - Never use hardcoded text
   - Always support 9 languages
   - Use fallback to English

4. **Don't assume compatibility**
   - Test all imports
   - Validate before production
   - Check breaking changes

---

## 📚 Related Documents

### Core Documentation
- `docs/architecture/REFERENCE_RULES.md` - General reference rules
- `docs/architecture/BUNDUI_REFERENCE_RULE.md` - Bundui-specific rules
- `docs/architecture/ASSETS_REPOSITORY_POLICY.md` - Asset management
- `docs/architecture/REFERENCE_ARCHITECTURE.md` - Vendor architecture
- `docs/standards/THIRD_PARTY_COMPONENT_ADAPTATION.md` - i18n adaptation protocol
- `docs/standards/ABSOLUTE_I18N_RULE.md` - i18n absolute rule

### Scripts Reference
- `docs/SCRIPTS_REFERENCE.md` - All validation scripts

### Vendor Specific
- `vibethink-asset-library/bundui-premium/SYNC_STATUS.md` - Bundui sync status
- `docs/references/VENDOR_STRUCTURE.md` - Vendor directory structure
- `docs/references/VENDOR_VERSIONS.md` - Vendor versions

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2025-12-27 | Consolidated all asset library policies, added 9-language compliance |
| 1.0.0 | 2025-12-23 | Initial version (THIRD_PARTY_COMPONENT_ADAPTATION.md) |

---

## ✅ Approval

**Approved by:** Marcelo Escallón (CTO)
**Date:** 2025-12-27
**Status:** MANDATORY for all development
**Next Review:** 2026-01-27

---

**Questions or exceptions require CTO approval.**

---

## 📞 Support

For questions about:
- **Integration:** Check related documents first
- **Validation:** Run scripts and review output
- **Exceptions:** Contact CTO with justification
- **Updates:** Follow deployment protocol

---

**End of Policy Document**

