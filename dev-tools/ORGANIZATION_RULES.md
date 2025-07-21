# 🏗️ REGLAS DE ORGANIZACIÓN - VThink 1.0

## 🎯 **REGLAS OBLIGATORIAS**

### **1. ESTRUCTURA DE RAÍZ - LIMPIA**
```
✅ PERMITIDO EN RAÍZ:
├── package.json
├── README.md
├── .gitignore
├── .cursorrules
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── lerna.json
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── components.json
├── next-env.d.ts
├── playwright.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .eslintrc.js
├── postcss.config.js
├── .editorconfig
├── .gitattributes
├── .dartai.config.json
├── env.example
├── tsconfig.node.json
├── tsconfig.app.json
├── ViveThink-Orchestrator-main.code-workspace
├── src/
├── apps/
├── docs/
├── public/
├── tests/
├── node_modules/
├── .next/
├── .git/
├── .github/
├── .husky/
├── .vscode/
├── .cursor/
├── supabase/
├── external/
├── projects/
├── traefik/
├── bundui/
├── dev-tools/
├── docusaurus-*/
└── dev-portal/

❌ PROHIBIDO EN RAÍZ:
├── /reports/
├── /scripts/
├── /tools/
├── /utilities/
├── /automation/
├── /deployment/
├── /validation/
├── /monitoring/
├── /setup/
├── /documentation/
├── /security/
├── /testing/
├── /migration/
├── /kpi/
├── /lib/
└── Cualquier carpeta de desarrollo
```

### **2. ORGANIZACIÓN DE DEV-TOOLS**
```
dev-tools/
├── README.md                    # Documentación principal
├── ORGANIZATION_RULES.md        # Este archivo - reglas
├── master-orchestrator.ps1      # Orquestador principal
├── scripts/                     # Scripts de desarrollo
│   ├── create-report.cjs       # Crear reportes
│   ├── validate-reports.js     # Validar reportes
│   ├── enforce-report-rules.js # Pre-commit hook
│   └── create-report.js        # Versión ES modules
├── automation/                  # Scripts de automatización
│   ├── start-dev.ps1          # Iniciar desarrollo
│   ├── create-docusaurus-sites.ps1
│   ├── start-all-sites.ps1
│   └── master-orchestrator.ps1
├── validation/                  # Scripts de validación
│   ├── lint-report.txt        # Reportes de linting
│   ├── validate-root-clean.js
│   └── enforce-report-rules.js
├── monitoring/                  # Monitoreo y métricas
├── utilities/                   # Utilidades generales
├── setup/                       # Configuración inicial
├── documentation/               # Documentación técnica
├── deployment/                  # Scripts de despliegue
├── security/                    # Auditorías de seguridad
├── testing/                     # Scripts de testing
├── docusaurus/                  # Configuración Docusaurus
├── migration/                   # Scripts de migración
├── kpi/                         # Métricas KPI
└── lib/                         # Librerías compartidas
```

### **3. REGLAS DE REPORTES**
```
✅ UBICACIÓN CORRECTA: docs/reports/
├── migration/                   # Reportes de migración
├── analysis/                    # Análisis de código
├── performance/                 # Métricas de rendimiento
├── security/                    # Auditorías de seguridad
├── quality/                     # Control de calidad
├── deployment/                  # Reportes de despliegue
└── archives/                    # Reportes históricos

❌ UBICACIONES PROHIBIDAS:
├── /reports/
├── dev-tools/reports/
├── Cualquier otra ubicación
```

### **4. NOMENCLATURA OBLIGATORIA**

#### **Scripts de Desarrollo:**
```
✅ CORRECTO:
├── create-report.cjs
├── validate-reports.js
├── enforce-report-rules.js
├── start-dev.ps1
├── create-docusaurus-sites.ps1

❌ INCORRECTO:
├── report.js
├── validate.js
├── start.ps1
├── create.ps1
```

#### **Reportes:**
```
✅ CORRECTO:
├── 2024-01-15-migration-status.md
├── 2024-01-15-performance-analysis.md
├── 2024-01-15-security-audit.md

❌ INCORRECTO:
├── migration-status.md
├── performance-analysis.md
├── security-audit.md
```

### **5. AUTOMATIZACIÓN OBLIGATORIA**

#### **Scripts de Validación:**
```bash
# ✅ Validar organización
npm run validate:organization

# ✅ Validar reportes
npm run validate:reports

# ✅ Validar raíz limpia
npm run validate:root

# ✅ Crear reportes
npm run create:report
```

#### **Pre-commit Hooks:**
```bash
# ✅ Validación automática
.husky/pre-commit:
  - npm run validate:reports
  - npm run validate:root
  - npm run validate:organization
```

### **6. CATEGORIZACIÓN DE ARCHIVOS**

#### **Configuración (Raíz):**
- `package.json`, `tsconfig.json`, `next.config.js`
- Archivos de configuración de herramientas
- Documentación principal del proyecto

#### **Desarrollo (dev-tools/):**
- Scripts de automatización
- Herramientas de desarrollo
- Validaciones y testing
- Monitoreo y métricas

#### **Documentación (docs/):**
- Documentación de usuario
- Reportes técnicos
- Guías y manuales
- API documentation

#### **Código Fuente (src/):**
- Aplicaciones principales
- Componentes compartidos
- Integraciones
- Lógica de negocio

### **7. VALIDACIÓN AUTOMÁTICA**

#### **Script de Validación:**
```javascript
// validate-organization.js
const rules = {
  rootClean: true,
  reportsLocation: 'docs/reports/',
  devToolsStructure: true,
  namingConventions: true,
  noProhibitedFolders: true
};
```

#### **Checklist de Validación:**
- [ ] No carpetas de desarrollo en raíz
- [ ] Reportes solo en docs/reports/
- [ ] Scripts organizados en dev-tools/
- [ ] Nomenclatura correcta
- [ ] Estructura de carpetas válida

### **8. MIGRACIÓN DE ARCHIVOS**

#### **Comandos de Migración:**
```bash
# ✅ Mover scripts a dev-tools/
Move-Item -Path "script.js" -Destination "dev-tools/scripts/"

# ✅ Mover reportes a docs/reports/
Move-Item -Path "report.md" -Destination "docs/reports/analysis/"

# ✅ Limpiar raíz
Remove-Item -Path "carpeta-prohibida" -Recurse -Force
```

#### **Validación Post-Migración:**
```bash
# ✅ Verificar organización
npm run validate:organization

# ✅ Verificar reportes
npm run validate:reports

# ✅ Verificar raíz limpia
npm run validate:root
```

### **9. DOCUMENTACIÓN OBLIGATORIA**

#### **README de Dev-Tools:**
```markdown
# Dev-Tools - VThink 1.0

## Estructura
- scripts/: Scripts de desarrollo
- automation/: Automatización
- validation/: Validaciones
- monitoring/: Monitoreo
- utilities/: Utilidades

## Uso
npm run validate:organization
npm run create:report
```

#### **Reglas de Organización:**
- Este archivo debe estar actualizado
- Documentar cambios en estructura
- Mantener consistencia en nomenclatura

### **10. VIOLACIONES CRÍTICAS**

#### **NUNCA PERMITIR:**
- Archivos de desarrollo en raíz
- Reportes fuera de docs/reports/
- Scripts sin categorizar
- Nomenclatura sin estándares
- Estructura inconsistente

#### **SIEMPRE VERIFICAR:**
- Ubicación correcta de archivos
- Nomenclatura estandarizada
- Estructura de carpetas
- Validación automática
- Documentación actualizada

---

## 📋 **CHECKLIST DE VALIDACIÓN**

Antes de cada commit:

- [ ] Raíz limpia (solo archivos permitidos)
- [ ] Reportes en docs/reports/
- [ ] Scripts en dev-tools/categoría/
- [ ] Nomenclatura correcta
- [ ] Estructura válida
- [ ] Documentación actualizada
- [ ] Validación automática pasada

---

**⚠️ IMPORTANTE: Estas reglas son OBLIGATORIAS y NO NEGOCIABLES** 