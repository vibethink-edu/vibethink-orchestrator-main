# 🛡️ VibeThink Orchestrator - AI Stability Rules

## ⚠️ CRITICAL: AI MUST READ BEFORE ANY CHANGES

**🚨 MANDATORY COMPLIANCE: This project has strict stability rules that AI MUST follow**

### 📋 NEW AI/AGENTS: Start Here

**If you are a new AI/agent working on this project:**

1. **FIRST:** Read `PROJECT_STATUS.md` - Complete project status and decisions
2. **SECOND:** Read `CHANGELOG.md` - Especially [Unreleased] section
3. **THIRD:** Read `SYSTEM_STATUS_2025-12-26.md` - Latest system state
4. **FOURTH:** Continue with stability rules below

**New? Read:** `docs/FOUNDATION/START_HERE.md`

**🚨 NEVER revert approved executive decisions** - Check PROJECT_STATUS.md before changing anything

---

## 🌍 CRITICAL: i18n Protocol (MANDATORY)

**⚠️ ALL modules, components, and third-party integrations MUST comply with VibeThink i18n requirements**

### 📋 Quick Reference

| Requirement | Status |
|-------------|--------|
| **Languages** | 9 mandatory: `en`, `es`, `fr`, `pt`, `de`, `it`, `ko`, `ar`, `zh` |
| **Base** | English + Spanish MUST be 100% complete |
| **Fallback** | Automatic fallback to English (`en`) |
| **RTL** | Full support required for Arabic (`ar`) |
| **Hardcoded Strings** | ❌ FORBIDDEN in UI |

### 📚 Full Documentation

- **🔴 Start Here**: [`/docs/i18n/I18N_MODULE_REQUIREMENTS.md`](./docs/i18n/I18N_MODULE_REQUIREMENTS.md)
- **✅ Checklist**: [`/docs/i18n/I18N_COMPLIANCE_CHECKLIST.md`](./docs/i18n/I18N_COMPLIANCE_CHECKLIST.md)
- **🛠️ Integration**: [`/packages/utils/I18N_INTEGRATION_GUIDE.md`](./packages/utils/I18N_INTEGRATION_GUIDE.md)
- **🤝 Contributing**: [`/CONTRIBUTING.md`](./CONTRIBUTING.md)

### ⚡ Validation

```bash
# Validate your module before PR
npm run i18n:validate

# Check for missing keys
npm run i18n:missing-keys

# Find hardcoded strings
npm run i18n:find-hardcoded
```

### 🚫 Module Rejection

Your PR will be **REJECTED** if:
1. Missing any of the 9 languages
2. English or Spanish incomplete
3. Hardcoded UI strings found
4. RTL broken for Arabic
5. Invalid JSON in translations

**No exceptions. This is enforced by CI/CD.**

---

## 🎯 LATEST UPDATE (2025-12-26): Sistema i18n 3 Capas

### ✅ COMPLETADO HOY

**Sistema de internacionalización (i18n) de 3 capas ahora 100% funcional:**

- ✅ **CAPA 1:** Semantic IDs (types.ts) - IDs inmutables para conceptos
- ✅ **CAPA 2:** Terminology Engine (engine.ts + cache.ts) - Resolución con cache
- ⚠️ **CAPA 3:** UI Strings (pendiente) - React Provider/Hook

**Archivos arreglados:**
- `packages/utils/src/i18n/terminology/engine.ts` (antes .disabled)
- `packages/utils/src/i18n/terminology/cache.ts` (antes .disabled)
- `packages/utils/src/i18n/terminology/index.ts` (antes .disabled)

**9 idiomas soportados:**
- 🇺🇸 EN + 🇪🇸 ES → Production Ready (100% y 95%)
- 🇫🇷 FR, 🇵🇹 PT, 🇩🇪 DE, 🇸🇦 AR, 🇨🇳 ZH → Beta (~90%)
- 🇮🇹 IT, 🇰🇷 KO → Pendientes (50% - necesitan traducción)

**Scripts creados:**
- `scripts/validate-concepts-coherence.js` - Valida coherencia
- `scripts/fix-concepts-coherence.js` - Arregla automáticamente
- `scripts/copy-missing-translation-files.js` - Copia archivos faltantes
- `scripts/sync-translations-structure.js` - Sincroniza estructura
- `scripts/check-missing-files.js` - Detecta archivos faltantes

**Documentación creada:**
- `GUIA_MANTENIMIENTO_CONCEPTOS.md` - Cómo mantener conceptos
- `ARCHIVOS_DISABLED_ARREGLADOS.md` - Detalles técnicos de fixes
- `VALIDACION_FINAL_3_CAPAS.md` - Estado y próximos pasos
- `REPORTE_PRODUCT_OWNER_2025-12-26.md` - Reporte ejecutivo
- `EXPLICACION_PARA_ADOLESCENTE.md` - Versión simple
- `INSTRUCCIONES_Z_AI.md` - Instrucciones para Z.Ai

### 📁 Estructura de Traducciones

```
apps/dashboard/src/lib/i18n/translations/
├── en/  (45 archivos) ✅ Master
├── es/  (45 archivos) ✅ 95% completo
├── fr/  (45 archivos) ⚠️ 90% completo
├── pt/  (45 archivos) ⚠️ 90% completo
├── de/  (45 archivos) ⚠️ 90% completo
├── it/  (45 archivos) ⚠️ 50% completo (50 en inglés)
├── ko/  (45 archivos) ⚠️ 50% completo (50 en inglés)
├── ar/  (45 archivos) ⚠️ 90% completo
└── zh/  (45 archivos) ⚠️ 90% completo

Conceptos por idioma (5 archivos cada uno):
- concept.json              (BASE - compartido)
- concept-hotel.json        (Overrides Hotel)
- concept-studio.json       (Overrides Studio)
- concept-cowork.json       (Overrides Cowork)
- concept-coliving.json     (Overrides Coliving)
```

### 🔧 Comandos de Validación i18n

```bash
# Validar coherencia de conceptos
node scripts/validate-concepts-coherence.js

# Arreglar coherencia automáticamente
node scripts/fix-concepts-coherence.js

# Verificar archivos faltantes
node scripts/check-missing-files.js

# Copiar archivos faltantes desde EN
node scripts/copy-missing-translation-files.js

# Sincronizar estructura de archivo
node scripts/sync-translations-structure.js
```

### 📚 Documentación Sistema i18n

**Para desarrolladores:**
- `GUIA_MANTENIMIENTO_CONCEPTOS.md` - Workflow completo
- `ARCHIVOS_DISABLED_ARREGLADOS.md` - Detalles técnicos

**Para Product Owner:**
- `REPORTE_PRODUCT_OWNER_2025-12-26.md` - Resumen ejecutivo

**Para aprender:**
- `EXPLICACION_PARA_ADOLESCENTE.md` - Explicación simple

**Para Z.Ai:**
- `INSTRUCCIONES_Z_AI.md` - Tareas y contexto

---

## 🎯 Quick AI Commands

```bash
# ✅ BEFORE making any changes
npm run ai:before-changes

# ✅ AFTER making changes
npm run ai:after-changes

# ✅ Test changes safely
npm run ai:test-changes

# ✅ Safe commit with validation
npm run ai:safe-commit "your commit message"

# ✅ Recovery procedure
npm run ai:recovery

# ✅ Check stability
npm run ai:stability-check

# ✅ Validate i18n concepts coherence
node scripts/validate-concepts-coherence.js
```

## 🛡️ AI STABILITY RULES - MANDATORY

### 1. HYDRATION SAFETY RULES
```typescript
// ✅ MANDATORY: Always use mounted state for client-side hooks
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// ✅ MANDATORY: Conditional rendering for client-only components
{mounted && <ClientOnlyComponent />}

// ❌ FORBIDDEN: Direct use of client-side hooks without mounted check
const { theme } = useTheme(); // ❌ NO - causes hydration issues
const isMobile = useIsMobile(); // ❌ NO - causes hydration issues
```

### 2. DEPENDENCY MANAGEMENT RULES
```json
// ✅ MANDATORY: Use exact versions only
"next": "15.3.4"  // ✅ YES - exact version
"@radix-ui/react-tooltip": "1.0.7"  // ✅ YES - exact version

// ❌ FORBIDDEN: Never use caret versions
"next": "^15.3.4"  // ❌ NO - causes instability
"@radix-ui/react-tooltip": "^1.0.7"  // ❌ NO - causes instability
```

### 3. PROVIDER CONFIGURATION RULES
```typescript
// ✅ MANDATORY: Always include VThinkThemeProvider in layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextThemeProvider>
          <VThinkThemeProvider>  {/* ✅ MANDATORY */}
            {children}
          </VThinkThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
```

### 4. i18n CONCEPTOS RULES (NEW)
```bash
# ✅ MANDATORY: Validate concepts before committing
node scripts/validate-concepts-coherence.js

# ✅ MANDATORY: Fix coherence if validation fails
node scripts/fix-concepts-coherence.js

# ✅ MANDATORY: Always use English (EN) as master
# Other languages copy from EN and then translate

# ❌ FORBIDDEN: Creating concept files in only some languages
# ❌ FORBIDDEN: Different keys between languages
# ❌ FORBIDDEN: Duplicating concepts between base and product files
```

### 5. TESTING RULES
```bash
# ✅ MANDATORY: Always test after changes
npm run dev  # ✅ MUST test server startup
curl http://localhost:3001  # ✅ MUST test server response
# ✅ MUST open browser and verify functionality

# ✅ NEW: Test i18n changes
# 1. Open http://localhost:3005/dashboard-bundui/projects-v2
# 2. Test all 9 languages
# 3. Verify no English text in other languages (except IT/KO)
```

## 🚨 AI COMPLIANCE VERIFICATION

### BEFORE ANY CODE CHANGE, AI MUST:
1. ✅ Check if changes affect hydration-sensitive components
2. ✅ Verify dependency versions are exact (no ^)
3. ✅ Confirm VThinkThemeProvider is in layout
4. ✅ **NEW:** Validate i18n concepts coherence if touching translation files
5. ✅ Test server startup after changes
6. ✅ Verify theme customizer functionality

### IF ANY RULE IS VIOLATED:
- ❌ **STOP IMMEDIATELY**
- ❌ **DO NOT PROCEED**
- ❌ **REVERT CHANGES**
- ❌ **FOLLOW RECOVERY PROCEDURE**

## 🔧 Recovery Procedure

### If Hydration Issues Occur:
```typescript
// ✅ IMMEDIATE FIX: Add mounted state
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// ✅ IMMEDIATE FIX: Conditional rendering
{mounted && <ProblematicComponent />}
```

### If Dependencies Break:
```bash
# ✅ IMMEDIATE FIX: Clean install with exact versions
npm cache clean --force
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run dev
```

### If Theme Customizer Breaks:
```typescript
// ✅ IMMEDIATE FIX: Verify VThinkThemeProvider
import { VThinkThemeProvider } from '@/shared/components/bundui-premium/components/theme-customizer';

// ✅ IMMEDIATE FIX: Add to layout
<VThinkThemeProvider>
  {children}
</VThinkThemeProvider>
```

### If i18n Concepts Break (NEW):
```bash
# ✅ IMMEDIATE FIX: Run coherence validator
node scripts/validate-concepts-coherence.js

# ✅ IMMEDIATE FIX: Auto-fix issues
node scripts/fix-concepts-coherence.js

# ✅ IMMEDIATE FIX: Validate again
node scripts/validate-concepts-coherence.js
```

## 📊 Stability Metrics

### ✅ Success Indicators:
- Header loads in < 2 seconds
- No layout shifts during hydration
- Theme customizer opens and works
- Server starts without errors
- All dependencies use exact versions
- **NEW:** i18n concepts validation passes
- **NEW:** All 9 languages have all files
- **NEW:** No duplicated concepts between base and product

### ❌ Failure Indicators:
- Header loads slowly or with blur effect
- Tooltips appear far from triggers
- Theme customizer doesn't open
- Server fails to start
- Dependencies use caret versions
- **NEW:** i18n validation fails
- **NEW:** Missing translation files
- **NEW:** Different keys between languages

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/mescallo-edu/vibethink-orchestrator-main.git
cd vibethink-orchestrator-main

# Install dependencies
npm install

# Validate stability rules
npm run validate:stability

# Validate i18n concepts (NEW)
node scripts/validate-concepts-coherence.js

# Start development server
npm run dev
```

### AI Development Workflow
```bash
# 1. Before making changes
npm run ai:before-changes

# 2. Make your changes

# 3. If touching i18n files, validate
node scripts/validate-concepts-coherence.js

# 4. After making changes
npm run ai:after-changes

# 5. Test changes
npm run ai:test-changes

# 6. Safe commit
npm run ai:safe-commit "feat: your feature description"
```

## 📁 Project Structure

```
vibethink-orchestrator-main/
├── apps/
│   └── dashboard/                    # Main dashboard application
│       └── src/lib/i18n/translations/ # 9 languages × 45 files
├── packages/
│   └── utils/
│       └── src/i18n/terminology/     # 3-layer i18n system
│           ├── types.ts              # CAPA 1: Semantic IDs
│           ├── cache.ts              # CAPA 2: Cache
│           ├── engine.ts             # CAPA 2: Resolution engine
│           └── index.ts              # Barrel export
├── scripts/
│   ├── validate-concepts-coherence.js  # i18n validator
│   ├── fix-concepts-coherence.js      # i18n auto-fixer
│   ├── copy-missing-translation-files.js
│   ├── sync-translations-structure.js
│   └── check-missing-files.js
├── docs/
│   ├── architecture/                 # Architecture docs
│   └── sessions/                     # Session logs
├── AI_STABILITY_RULES.md            # ⚠️ CRITICAL: AI must read
├── VTHINK_METHODOLOGY_LAW.md        # 🛡️ VThink Law
├── GUIA_MANTENIMIENTO_CONCEPTOS.md  # NEW: i18n maintenance guide
├── ARCHIVOS_DISABLED_ARREGLADOS.md  # NEW: Technical fixes report
├── VALIDACION_FINAL_3_CAPAS.md      # NEW: Final validation
├── REPORTE_PRODUCT_OWNER_2025-12-26.md  # NEW: PO report
├── EXPLICACION_PARA_ADOLESCENTE.md  # NEW: Simple explanation
├── INSTRUCCIONES_Z_AI.md            # NEW: Z.Ai instructions
└── package.json                     # AI-friendly scripts
```

## 🛡️ VTHINK METHODOLOGY LAW - INQUEBRANTABLE

### 📋 VThink = METHODOLOGY, VibeThink = SOFTWARE

**⚠️ CRITICAL: This project follows the VThink Methodology Law:**

- **VThink 1.0** = Development methodology (CMMI-ML3 compliant)
- **VibeThink Orchestrator** = Software platform name
- **VThink** = Process, standards, workflow, methodology
- **VibeThink** = Application, platform, brand, software

**🚨 NEVER CONFUSE: VThink is methodology, VibeThink is software**

## 🛡️ AI Safety Features

### Automatic Validation
- **Pre-commit hooks**: Automatically validate stability rules
- **AI scripts**: Safe commands for AI development
- **Recovery procedures**: Automatic recovery from issues
- **NEW: i18n validation**: Automatic coherence checking

### Validation Commands
```bash
npm run validate:stability         # Full stability check
npm run validate:vtk               # VThink-specific validation
npm run ai:stability-check         # Quick stability check
node scripts/validate-concepts-coherence.js  # i18n concepts check
```

## 🚨 Emergency Contacts

### If AI Cannot Follow These Rules:
1. **STOP** all development
2. **REVERT** to last working commit
3. **ANALYZE** what caused the violation
4. **DOCUMENT** the failure
5. **IMPLEMENT** the fix following these rules

---

**⚠️ CRITICAL: AI MUST READ AND FOLLOW THESE RULES BEFORE ANY CODE CHANGE ⚠️**
**🚨 VIOLATION OF THESE RULES WILL CAUSE SYSTEM INSTABILITY 🚨**

## 🤖 AI Build & Execution Policy (Claude, Gemini, OpenAI)
- NPM-only: no pnpm/yarn/bun
- Dashboard build: ejecutar desde root con `npm run build:dashboard` (internamente: `cd apps/dashboard && npx --no-install next build`)
- No ejecutar `next build` directamente dentro de apps
- Dependencias solo en root; apps sin node_modules
- Versiones exactas (sin ^ ni ~ ni latest)

---

## 📦 **DEPENDENCY MANAGEMENT - MONOREPO NPM RULES**

### 🚨 **CRITICAL: NPM Monorepo Management**

**📋 SINGLE SOURCE OF TRUTH**: All dependency management rules are documented in:
- **[NPM_MONOREPO_RULES.md](./NPM_MONOREPO_RULES.md)** - Complete reference guide
- **[CLAUDE.md](./CLAUDE.md)** - Quick reference for AI assistants

### **⚡ Quick Commands**
```bash
# Validate dependency state
npm run validate:npm-install

# Fix duplications automatically
npm run fix:npm-duplications

# Complete validation
npm run validate:universal

# NEW: Validate i18n concepts
node scripts/validate-concepts-coherence.js
```

### **📊 Decision Table**
| Dependency Type | Install Location | Command Example |
|----------------|------------------|-----------------|
| **Core** (react, next, typescript) | **RAÍZ** | `npm install react next` |
| **Shared** (clsx, zod, supabase) | **RAÍZ** | `npm install clsx zod` |
| **App-specific** (fullcalendar, framer) | **APP** | `cd apps/dashboard && npm install` |

### **🔴 CRITICAL RULES**
1. **NEVER DUPLICATE**: Core dependencies must only exist in root
2. **EXACT VERSIONS**: No caret (^) versions for core apps
3. **MARKETING EXCEPTION**: Website can use React 19 and caret versions
4. **VALIDATION REQUIRED**: Always run `validate:npm-install` before commits
5. **NEW: i18n COHERENCE**: Always validate concepts before committing translation changes

### **❌ ANTI-PATTERNS**
```bash
# ❌ FORBIDDEN: Installing core deps in apps
cd apps/dashboard && npm install react typescript

# ❌ FORBIDDEN: Using caret versions (except website)
"react": "^18.3.1"

# ❌ FORBIDDEN: Bypassing validation
git commit -m "changes" # Without running validate:universal

# ❌ FORBIDDEN: Creating concept files in some languages only
touch apps/dashboard/src/lib/i18n/translations/es/concept-restaurant.json
# (Must create in all 9 languages)

# ❌ FORBIDDEN: Different keys between languages
# EN has "concept.booking.action.reserve" but ES doesn't
```

### **✅ CORRECT PATTERNS**
```bash
# ✅ CORRECT: Install shared dependency
npm install @supabase/supabase-js

# ✅ CORRECT: Install app-specific dependency
cd apps/dashboard && npm install @fullcalendar/react

# ✅ CORRECT: Validate before committing
npm run validate:universal && git commit

# ✅ CORRECT: Create concept file in all languages
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json
for locale in es fr pt de it ko ar zh; do
  cp apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json \
     apps/dashboard/src/lib/i18n/translations/$locale/
done
node scripts/validate-concepts-coherence.js
```

### **🔧 ERROR CORRECTION**
```bash
# 1. Detect issues
npm run validate:npm-install
node scripts/validate-concepts-coherence.js

# 2. Fix automatically (recommended)
npm run fix:npm-duplications
node scripts/fix-concepts-coherence.js

# 3. Verify fix
npm run validate:npm-install
node scripts/validate-concepts-coherence.js
```

**📖 For complete rules, examples, and troubleshooting**:
- [NPM_MONOREPO_RULES.md](./NPM_MONOREPO_RULES.md)
- [GUIA_MANTENIMIENTO_CONCEPTOS.md](./GUIA_MANTENIMIENTO_CONCEPTOS.md) (NEW)
