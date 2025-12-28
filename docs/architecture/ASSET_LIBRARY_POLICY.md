# 📦 Third-Party Asset Library - Policy (Consolidated)

**Version:** 2.0.0
**Status:** ✅ MANDATORY
**Effective Date:** 2025-12-27
**Authority:** CTO - Marcelo Escallón

**Consolidated from:**
- REFERENCE_RULES.md
- BUNDUI_REFERENCE_RULE.md
- THIRD_PARTY_COMPONENT_ADAPTATION.md
- ASSETS_REPOSITORY_POLICY.md
- REFERENCE_ARCHITECTURE.md
- VENDOR_STRUCTURE.md

---

## 🎯 Purpose

This policy defines the **mandatory standard** for managing all third-party UI components, libraries, templates, and assets used in VibeThink Orchestrator 1.0.

---

## 📐 Philosophy & Principles

### Core Architecture

```
All Third-Party Sources → vibethink-asset-library/ (READ-ONLY)
         ↓
    Centralized References
         ↓
    Selective Adaptation
         ↓
 vibethink-orchestrator-main/ (PRODUCTION - MODIFIABLE)
```

### Key Principles

1. **Single Source of Truth**
   ```
   ❌ NUNCA: Vendors dispersos en múltiples lugares
   ✅ SIEMPRE: Todos en vibethink-asset-library/
   ```

2. **Read-Only References**
   ```
   ❌ NUNCA: Modificar vibethink-asset-library/
   ✅ SIEMPRE: Solo lectura y consulta
   ```

3. **Selective Adaptation**
   ```
   ❌ NUNCA: Copiar todo automáticamente
   ✅ SIEMPRE: Elegir qué integrar
   ```

4. **i18n First**
   ```
   ❌ NUNCA: Componentes sin i18n
   ✅ SIEMPRE: 9 idiomas obligatorios
   ```

5. **Centralized Assets**
   ```
   ❌ NUNCA: Assets duplicados
   ✅ SIEMPRE: Un solo lugar (/assets/)
   ```

---

## 🏗️ Architecture & Structure

### Workspace Structure

```
C:\IA Marcelo Labs\
├── vibethink-orchestrator-main\        # 🏠 PRODUCCIÓN (MODIFICAR AQUÍ)
│   ├── apps/dashboard/                 # Main Next.js app
│   ├── packages/ui/                    # @vibethink/ui (components)
│   ├── packages/utils/                 # @vibethink/utils (utilities)
│   └── public/assets/                  # Centralized assets
│
├── vibethink-asset-library\            # 📦 TODOS LOS TERCEROS (READ-ONLY)
│   ├── bundui/                        # Bundui repositories
│   │   ├── shadcn-ui-kit-dashboard/   # Bundui Premium
│   │   ├── cosmic-main/               # Cosmic template
│   │   ├── neofolio-main/             # Neofolio template
│   │   └── soho-nextjs-main/          # Soho template
│   │
│   ├── shadcn-ui/                     # Official Shadcn UI
│   │   ├── ui/                        # Monorepo
│   │   └── apps/v4/                   # Docs + Registry
│   │
│   ├── xyflow/                        # XYFlow official
│   │   └── xyflow/                   # Node-based UIs
│   │
│   ├── bundui-premium/                # Bundui Premium (extracted)
│   ├── shadcn-ecosystem/             # Shadcn ecosystem
│   ├── xyflow-reference/              # XYFlow examples
│   ├── aceternity-ui/                # UI components
│   ├── magic-ui/                     # UI components
│   ├── framer-motion/                # Animation library
│   ├── recharts/                     # Chart library
│   ├── tiptap/                       # Rich text editor
│   ├── vercel-ai-sdk/                # AI SDK
│   └── shadcnblocks/                 # Shadcn blocks
│
└── _vibethink-dev-kit\                 # 📚 METODOLOGÍA
    └── knowledge/                     # Guides and standards
```

### Production vs. Reference

| Aspecto | Producción (Orchestrator) | Referencia (Asset Library) |
|---------|---------------------------|---------------------------|
| **Modificable** | ✅ SÍ (controlamos 100%) | ❌ NO (solo por autores) |
| **Se actualiza** | ❌ NO (solo nosotros) | ✅ SÍ (autores pueden) |
| **Nos afecta** | ✅ SÍ (es producción) | ❌ NO (independiente) |
| **Sincronización** | N/A | Manual y opcional |
| **Propósito** | Producción estable | Referencia e inspiración |

---

## 🚨 Critical Rules

### Reference Rules (Consolidated from REFERENCE_RULES.md)

#### 🎯 Principle Fundamental

**TODO LO QUE SEA REFERENCIA NUNCA DEBE SER MODIFICADO**

#### Definition of "Reference"

Un elemento es considerado "referencia" si:
- Está fuera del monorepo `vibethink-orchestrator-main/`
- Tiene `-reference` en su nombre o propósito
- Está documentado como "reference" en scripts o documentación
- Es código original que debe mantenerse intacto para comparación

#### Universal Rule

**NO importa si está dentro o fuera del monorepo**
**NO importa el tipo de referencia (Bundui, Shadcn, ReactFlow, etc.)**
**Si tiene `-reference` en nombre/path o está documentado como "reference" → ❌ NO MODIFICAR**

#### Identified References

##### 1. Bundui (Outside Monorepo)
- **Ruta**: `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard`
- **Propósito**: Código original de Bundui Premium para referencia
- **Puerto**: 3050 (default)
- **Script**: `scripts/start-bundui-reference.ps1`
- **Espejo modificable**: `apps/dashboard/app/dashboard-bundui/`

##### 2. Bundui Reference (Inside Monorepo)
- **Ruta**: `apps/bundui-reference/`
- **Propósito**: Referencia de Bundui Premium dentro del monorepo
- **Puerto**: 3004 (default)
- **⚠️ CRÍTICO**: Aunque está dentro del monorepo, es REFERENCIA
- **Espejo modificable**: `apps/dashboard/app/dashboard-bundui/`

##### 3. Shadcn UI Reference
- **Ruta**: `C:\IA Marcelo Labs\shadcn-ui\ui\apps\v4`
- **Propósito**: Código original oficial de Shadcn UI para referencia
- **Script de inicio**: `scripts/start-shadcn-reference.ps1`
- **Puerto**: 3051 (default)
- **Estado**: ❌ NUNCA MODIFICAR (referencia externa)

##### 4. ReactFlow Reference
- **Ruta**: `C:\IA Marcelo Labs\xyflow\xyflow\examples\react`
- **Propósito**: Código original de ReactFlow/XYFlow para referencia
- **Script de inicio**: `scripts/start-reactflow-reference.ps1`
- **Puerto**: 3052 (default)
- **Estado**: ❌ NUNCA MODIFICAR (referencia externa)

#### Allowed Uses (Referencias)

**Usos permitidos:**
- ✅ Consulta y lectura
- ✅ Comparación con implementaciones
- ✅ Visualización en servidores de referencia
- ✅ Debugging y validación
- ✅ Copia de código para adaptar en el monorepo

**Usos prohibidos:**
- ❌ Modificación directa
- ❌ Edición de archivos
- ❌ Cambio de configuración
- ❌ Actualización de dependencias (sin aprobación explícita)

---

## 📦 Asset Library Inventory

### Bundui Premium (Integrado)

| Attribute | Details |
|-----------|---------|
| **Location** | `vibethink-asset-library/bundui-premium/` |
| **Purpose** | Premium dashboard templates and components |
| **License** | Purchased/Commercial |
| **Version** | 2.0 |
| **Status** | 🟢 **ACCEPTED** |
| **Production Status** | ✅ **INTEGRATED** (`apps/dashboard/app/dashboard-bundui/`) |
| **Priority** | 🔴 **HIGH** |

**What's Included:**
- 📊 **Analytics Dashboard** - Website analytics, charts, metrics
- 👥 **CRM Dashboard** - Customer management, leads pipeline
- 💰 **Finance Dashboard** - Financial reports, transactions
- 🏥 **Hospital Management** - Patient records, appointments
- 🏨 **Hotel Management** - Room bookings, guest management
- 🛒 **E-commerce Dashboard** - Products, orders, inventory
- 🏢 **Project Management** - Tasks, milestones, team
- 💼 **Sales Dashboard** - Revenue tracking, performance
- 🏦 **Logistics Dashboard** - Shipping, tracking
- 💳 **Payment Dashboard** - Transactions, payment methods
- 📁 **File Manager** - File upload, management
- 🎓 **Academy Dashboard** - Courses, students, progress
- 💻 **Apps Dashboard** - Application showcase
- 📊 **Website Analytics** - Traffic, conversions
- 🛠️ **Widgets Dashboard** - Reusable widgets
- 🎨 **Theme Customizer** - Color, radius, scale options

**Components:**
- 📅 **Calendar & Date Picker**
- 📝 **Form Components**
- 📊 **Charts**
- 🔘 **Buttons & Actions**
- 📋 **Tables & Grids**
- 🗂️ **Modals & Dialogs**
- 📜 **Accordion & Collapse**
- 🔔 **Notifications**
- 🧭 **Dropdowns**
- 🎯 **Navigation**
- 🌓 **Theme System**

### Shadcn UI Ecosystem

#### Official Shadcn UI

| Attribute | Details |
|-----------|---------|
| **Location** | `vibethink-asset-library/shadcn-ui/` |
| **Source** | https://github.com/shadcn-ui/ui |
| **Version** | Latest (from Git) |
| **Status** | 🟢 **ACCEPTED** |
| **Production Status** | ✅ **INTEGRATED** (`packages/ui/`) |
| **Priority** | 🔴 **HIGH** |

**What's Included:**
- 🔘 **Form Components** - Input, Select, Checkbox, Radio, Switch
- 📋 **Layout Components** - Card, Separator, Aspect Ratio
- 📊 **Data Display** - Table, Avatar, Badge, Skeleton
- 🎯 **Navigation** - Tabs, Breadcrumb, Menubar, Navigation Menu
- 🗂️ **Feedback** - Dialog, Sheet, Drawer, Popover
- 🔔 **Notifications** - Toast, Sonner, Alert
- 📜 **Content** - Accordion, Collapsible, Scroll Area
- 🌓 **Typography** - Typography, Blockquote
- 🎨 **Styling** - Skeleton, Aspect Ratio, Resizable

### XYFlow

| Attribute | Details |
|-----------|---------|
| **Location** | `vibethink-asset-library/xyflow/` |
| **Source** | https://github.com/xyflow/xyflow |
| **Version** | Latest (from Git) |
| **Status** | 🟢 **ACCEPTED** |
| **Production Status** | ⚠️ **PARTIAL** (examples adapted) |
| **Priority** | 🟡 **MEDIUM** |

**What's Included:**
- `@xyflow/react` - React Flow library for node-based UIs
- `@xyflow/svelte` - Svelte Flow library
- `@xyflow/system` - Shared system utilities
- 🎯 **Workflow Examples** - Task automation workflows
- 🗺️ **Diagram Examples** - Flowcharts, organization charts
- 🔄 **Process Examples** - Business process flows
- 🧩 **Node Examples** - Custom node types
- 🔗 **Edge Examples** - Custom connection types

### Other Libraries (Pending Review)

| Library | Purpose | Status | Priority |
|---------|---------|--------|----------|
| **Framer Motion** | Animations | ⏳ **PENDING** | 🟡 Medium |
| **Recharts** | Charts | ⏳ **PENDING** | 🟡 Medium |
| **Tiptap** | Rich text editor | ⏳ **PENDING** | 🟡 Medium |
| **Vercel AI SDK** | AI integration | ⏳ **PENDING** | 🟢 High |
| **Magic UI** | UI components | ⏳ **PENDING** | 🟡 Medium |
| **Aceternity UI** | UI components | ⏳ **PENDING** | 🟡 Medium |

---

## 🔄 Adaptation Workflow (5 Phases)

### Phase 1: Assessment

**Before integrating any third-party component:**

1. **Identify all hardcoded strings**
   ```bash
   # Scan component for hardcoded text
   grep -r "\"[A-Za-z]" component-directory/
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
- ⚠️ **Others 7 idiomas:** Structure complete, translations optional (fallback to en)

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

**Benefits:**
- ✅ Original component untouched (easy updates)
- ✅ Centralized i18n logic
- ✅ Type-safe
- ✅ Reusable

### Phase 4: Asset Migration

**Migrate images and media to centralized repository:**

```bash
# 1. Copy to centralized location
cp vibethink-asset-library/[library]/public/images/* \
   apps/dashboard/public/assets/images/[library]/

# 2. Update references to use absolute paths
# Before: src="../../public/image.png"
# After: src="/assets/images/library/image.png"

# 3. Validate no duplicates
node scripts/validate-assets-duplicates.js
```

### Phase 5: Testing

**Mandatory tests for each component:**

1. **Visual test in all 9 languages**
2. **RTL layout test (Arabic)**
3. **Locale formatting test**
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

## 📁 Asset Repository Policy (Consolidated)

### Core Principles

1. **Single Repository**
   ```
   ❌ NUNCA: Assets duplicados en múltiples ubicaciones
   ✅ SIEMPRE: Un solo lugar para todos los assets
   ```

2. **No Duplicates**
   ```
   ❌ NUNCA: Misma imagen en dos lugares diferentes
   ✅ SIEMPRE: Referencia única a cada asset
   ```

3. **Prepared for CDN**
   ```
   ✅ Estructura compatible con CDN futuro
   ✅ Nombres únicos y descriptivos
   ✅ Organización clara por categorías
   ```

4. **Dashboard Autonomy**
   ```
   ✅ dashboard-bundui y dashboard-vibethink comparten assets
   ✅ No duplicación entre sistemas
   ✅ Mismo repositorio para ambos
   ```

### Centralized Location

```
apps/dashboard/public/assets/
├── images/              # Imágenes (PNG, JPG, JPEG, WebP)
│   ├── avatars/        # Avatares de usuarios
│   ├── products/       # Imágenes de productos
│   ├── icons/          # Iconos de aplicación
│   ├── logos/          # Logos y branding
│   ├── backgrounds/    # Fondos y patterns
│   └── common/         # Imágenes comunes compartidas
│
├── media/              # Videos y animaciones
│   ├── videos/         # Archivos de video
│   └── animations/     # GIFs y animaciones
│
├── fonts/              # Fuentes personalizadas (si aplica)
│
└── docs/               # Documentación de assets
    └── ASSETS_CATALOG.md  # Catálogo de todos los assets
```

### Usage Rules

#### ✅ ALWAYS

1. **Use centralized location**
   ```typescript
   // ✅ CORRECTO
   <img src="/assets/images/avatars/01.png" />
   <Image src="/assets/images/products/01.jpeg" />
   ```

2. **Unique and descriptive names**
   ```typescript
   // ✅ CORRECTO
   user-avatar-default.png
   product-placeholder-image.jpg
   
   // ❌ INCORRECTO
   01.png
   img.jpg
   ```

3. **Organize by categories**
   ```
   ✅ images/avatars/user-avatar-default.png
   ✅ images/products/product-placeholder.jpg
   ✅ images/icons/icon-check.svg
   ```

4. **Absolute paths from root**
   ```typescript
   // ✅ CORRECTO - Desde /assets/
   src="/assets/images/avatars/01.png"
   
   // ❌ INCORRECTO - Relativas
   src="../assets/avatars/01.png"
   src="./images/01.png"
   ```

#### ❌ NEVER

1. **NO duplicate assets**
   ```
   ❌ assets/images/avatars/01.png
   ❌ components/user/assets/01.png  (DUPLICADO)
   ```

2. **NO use relative paths**
   ```typescript
   ❌ src="../assets/image.png"
   ❌ src="./image.png"
   ```

3. **NO store in components**
   ```
   ❌ components/user/avatar.png
   ❌ dashboard-bundui/images/...
   ```

4. **NO use generic names**
   ```
   ❌ 01.png, 02.png, img.jpg
   ✅ user-avatar-default.png, product-placeholder.jpg
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

## ✅ Approval

**Approved by:** Marcelo Escallón (CTO)
**Date:** 2025-12-27
**Status:** MANDATORY for all development
**Version:** 2.0.0

---

**Questions or exceptions require CTO approval.**

---

**End of Policy Document**



