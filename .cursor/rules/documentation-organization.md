# Documentation Organization Rules - XTP v4.6

## 📚 **Reglas de Organización de Documentación**

### **PRINCIPIO FUNDAMENTAL: Separación Metodología vs Proyecto**

---

## 🚫 **ANTI-PATTERN: Documentación en Raíz de /docs**

### **❌ NUNCA hagas esto:**
```bash
docs/
├── CURSOR_DEVELOPER_GUIDE.md    # ❌ NO en raíz
├── DEVELOPER_FAQ.md             # ❌ NO en raíz
├── CURSOR_QUICK_REFERENCE.md    # ❌ NO en raíz
├── XTP_METHODOLOGY/            # ✅ Metodología
└── PROJECT/                    # ✅ Proyecto
```

### **✅ SIEMPRE haz esto:**
```bash
docs/
├── README.md                   # ✅ Solo índice principal
├── XTP_METHODOLOGY/           # ✅ Metodología universal
│   ├── 01_PRINCIPLES/         # ✅ Principios XTP
│   ├── 02_TEMPLATES/          # ✅ Templates reutilizables
│   └── 03_PROCESSES/          # ✅ Procesos metodológicos
├── PROJECT/                   # ✅ Proyecto específico
│   ├── 01_FOUNDATION/         # ✅ Fundamentos
│   ├── 08_TOOLCHAIN_AND_SETUP/ # ✅ Herramientas
│   │   └── cursor-documentation/ # ✅ Documentación de Cursor
│   └── 09_DEVELOPMENT_GUIDES/ # ✅ Guías de desarrollo
└── archives/                  # ✅ Contenido archivado
```

---

## 🎯 **Matriz de Decisión para Ubicación**

### **Pregunta 1: ¿Es metodología universal?**
```typescript
const isUniversal = {
  appliesToAnyProject: true,
  isXTPMethodology: true,
  isReusable: true,
  isTechnologyAgnostic: true
};

// ✅ Si es universal → XTP_METHODOLOGY/
```

### **Pregunta 2: ¿Es específico del proyecto?**
```typescript
const isProjectSpecific = {
  appliesToThisProjectOnly: true,
  isToolchainRelated: true,
  isConfigurationSpecific: true,
  isDevelopmentGuide: true
};

// ✅ Si es específico → PROJECT/
```

### **Pregunta 3: ¿Es herramienta o toolchain?**
```typescript
const isToolchain = {
  isDevelopmentTool: true,
  isConfigurationGuide: true,
  isSetupInstructions: true,
  isUsageGuide: true
};

// ✅ Si es toolchain → PROJECT/08_TOOLCHAIN_AND_SETUP/
```

---

## 📋 **Checklist Obligatorio Antes de Crear Documentación**

### **1. Validar Tipo de Documentación**
```typescript
const documentType = {
  isUniversal: "¿Es aplicable a cualquier proyecto?",
  isMethodology: "¿Es parte de la metodología XTP?",
  isProjectSpecific: "¿Es específico de este proyecto?",
  isToolchain: "¿Es parte del toolchain del proyecto?",
  isDevelopmentGuide: "¿Es guía de desarrollo específica?"
};
```

### **2. Revisar Estructura Existente**
```bash
# ✅ SIEMPRE revisar antes de crear:
ls docs/
ls docs/XTP_METHODOLOGY/
ls docs/PROJECT/
ls docs/PROJECT/08_TOOLCHAIN_AND_SETUP/
```

### **3. Aplicar Reglas de Organización**
```typescript
const organizationRules = {
  universal: "XTP_METHODOLOGY/",
  projectSpecific: "PROJECT/",
  toolchain: "PROJECT/08_TOOLCHAIN_AND_SETUP/",
  developmentGuides: "PROJECT/09_DEVELOPMENT_GUIDES/",
  methodology: "XTP_METHODOLOGY/01_PRINCIPLES/"
};
```

### **4. Validar Separación**
```typescript
const validateSeparation = {
  methodologyUniversal: "¿Está en XTP_METHODOLOGY/?",
  projectSpecific: "¿Está en PROJECT/?",
  noRootFiles: "¿No está en raíz de /docs/?",
  correctSubfolder: "¿Está en la subcarpeta correcta?"
};
```

---

## 🏗️ **Estructura Obligatoria XTP v4.6**

### **Organización Principal:**
```
docs/
├── README.md                    # Índice principal (solo este archivo en raíz)
├── XTP_METHODOLOGY/            # Metodología universal
│   ├── 01_PRINCIPLES/          # Principios fundamentales
│   ├── 02_TEMPLATES/           # Templates reutilizables
│   ├── 03_PROCESSES/           # Procesos metodológicos
│   ├── 04_TOOLS/              # Herramientas universales
│   └── 05_BEST_PRACTICES/     # Mejores prácticas
├── PROJECT/                    # Proyecto específico
│   ├── 01_FOUNDATION/         # Fundamentos del proyecto
│   ├── 02_ARCHITECTURE/       # Arquitectura técnica
│   ├── 03_DESIGN/            # Diseño UX/UI
│   ├── 04_EXECUTION/         # Desarrollo e implementación
│   ├── 05_VALIDATION/        # Testing y validación
│   ├── 06_EVIDENCE/          # Evidencias
│   ├── 07_OPERATIONS/        # Operaciones
│   ├── 08_TOOLCHAIN_AND_SETUP/ # Herramientas y configuración
│   └── 09_DEVELOPMENT_GUIDES/ # Guías de desarrollo específicas
└── archives/                  # Contenido archivado
```

### **Reglas de Ubicación Específicas:**
```typescript
const specificLocationRules = {
  // Metodología Universal
  xtpPrinciples: "XTP_METHODOLOGY/01_PRINCIPLES/",
  xtpTemplates: "XTP_METHODOLOGY/02_TEMPLATES/",
  xtpProcesses: "XTP_METHODOLOGY/03_PROCESSES/",
  xtpTools: "XTP_METHODOLOGY/04_TOOLS/",
  xtpBestPractices: "XTP_METHODOLOGY/05_BEST_PRACTICES/",
  
  // Proyecto Específico
  projectFoundation: "PROJECT/01_FOUNDATION/",
  projectArchitecture: "PROJECT/02_ARCHITECTURE/",
  projectDesign: "PROJECT/03_DESIGN/",
  projectExecution: "PROJECT/04_EXECUTION/",
  projectValidation: "PROJECT/05_VALIDATION/",
  projectEvidence: "PROJECT/06_EVIDENCE/",
  projectOperations: "PROJECT/07_OPERATIONS/",
  projectToolchain: "PROJECT/08_TOOLCHAIN_AND_SETUP/",
  projectDevelopmentGuides: "PROJECT/09_DEVELOPMENT_GUIDES/"
};
```

---

## 🛡️ **Validación Automática**

### **Script de Validación:**
```javascript
// scripts/validate-documentation-organization.js
const validateDocumentationOrganization = {
  checkRootFiles: () => {
    const rootFiles = fs.readdirSync('docs/').filter(file => 
      file.endsWith('.md') && !file.startsWith('README')
    );
    
    if (rootFiles.length > 0) {
      console.error('❌ Archivos en raíz de /docs/ detectados:', rootFiles);
      console.error('💡 Mover a carpeta apropiada según estructura XTP v4.6');
      return false;
    }
    return true;
  },
  
  checkStructure: () => {
    const requiredFolders = [
      'docs/XTP_METHODOLOGY/',
      'docs/PROJECT/',
      'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/',
      'docs/PROJECT/09_DEVELOPMENT_GUIDES/'
    ];
    
    requiredFolders.forEach(folder => {
      if (!fs.existsSync(folder)) {
        console.error(`❌ Carpeta requerida no existe: ${folder}`);
        return false;
      }
    });
    return true;
  },
  
  validateSeparation: () => {
    // Verificar que no haya mezcla entre metodología y proyecto
    const methodologyFiles = fs.readdirSync('docs/XTP_METHODOLOGY/');
    const projectFiles = fs.readdirSync('docs/PROJECT/');
    
    // Validar que metodología sea universal
    // Validar que proyecto sea específico
    return true;
  }
};
```

### **Pre-commit Hook:**
```bash
#!/bin/bash
# .git/hooks/pre-commit-documentation

echo "🔍 Validando organización de documentación..."

# Verificar archivos en raíz de /docs/
ROOT_FILES=$(find docs/ -maxdepth 1 -name "*.md" ! -name "README.md")

if [ ! -z "$ROOT_FILES" ]; then
  echo "❌ ERROR: Archivos en raíz de /docs/ detectados:"
  echo "$ROOT_FILES"
  echo "💡 Mover a carpeta apropiada según estructura XTP v4.6"
  echo "📚 Consultar: docs/PROJECT/08_TOOLCHAIN_AND_SETUP/cursor-documentation/ORGANIZATION_MISTAKE_ANALYSIS.md"
  exit 1
fi

echo "✅ Organización de documentación válida"
```

---

## 🚨 **Casos de Error Comunes**

### **Error 1: Documentación de Herramientas en Raíz**
```bash
# ❌ INCORRECTO
docs/
├── CURSOR_GUIDE.md           # ❌ NO en raíz
├── DOCKER_SETUP.md           # ❌ NO en raíz
└── DEPLOYMENT_GUIDE.md       # ❌ NO en raíz

# ✅ CORRECTO
docs/
├── PROJECT/
│   └── 08_TOOLCHAIN_AND_SETUP/
│       ├── cursor-documentation/    # ✅ Cursor guides
│       ├── docker-setup/            # ✅ Docker guides
│       └── deployment-guides/       # ✅ Deployment guides
```

### **Error 2: Mezclar Metodología con Proyecto**
```bash
# ❌ INCORRECTO
docs/XTP_METHODOLOGY/
├── cursor-setup.md           # ❌ Específico del proyecto

# ✅ CORRECTO
docs/PROJECT/08_TOOLCHAIN_AND_SETUP/
└── cursor-documentation/     # ✅ Específico del proyecto
```

### **Error 3: Documentación Universal en Proyecto**
```bash
# ❌ INCORRECTO
docs/PROJECT/
├── xtp-principles.md         # ❌ Es metodología universal

# ✅ CORRECTO
docs/XTP_METHODOLOGY/01_PRINCIPLES/
└── xtp-principles.md         # ✅ Metodología universal
```

---

## 📚 **Ejemplos de Organización Correcta**

### **Documentación de Cursor:**
```bash
# ✅ Ubicación correcta
docs/PROJECT/08_TOOLCHAIN_AND_SETUP/cursor-documentation/
├── CURSOR_DEVELOPER_GUIDE.md
├── CURSOR_QUICK_REFERENCE.md
├── CURSOR_REFACTORING_GUIDE.md
├── CURSOR_RULES_EXPLANATION.md
├── DEVELOPER_FAQ.md
└── README.md
```

### **Guías de Desarrollo:**
```bash
# ✅ Ubicación correcta
docs/PROJECT/09_DEVELOPMENT_GUIDES/
├── onboarding/
├── coding-standards/
├── testing-guides/
└── deployment-guides/
```

### **Metodología XTP:**
```bash
# ✅ Ubicación correcta
docs/XTP_METHODOLOGY/
├── 01_PRINCIPLES/
├── 02_TEMPLATES/
├── 03_PROCESSES/
├── 04_TOOLS/
└── 05_BEST_PRACTICES/
```

---

## 🎯 **Workflow de Creación de Documentación**

### **Paso 1: Identificar Tipo**
```typescript
const identifyType = (documentation) => {
  if (documentation.isUniversal) return "XTP_METHODOLOGY/";
  if (documentation.isToolchain) return "PROJECT/08_TOOLCHAIN_AND_SETUP/";
  if (documentation.isDevelopmentGuide) return "PROJECT/09_DEVELOPMENT_GUIDES/";
  return "PROJECT/";
};
```

### **Paso 2: Validar Ubicación**
```bash
# ✅ Validar antes de crear
npm run validate:documentation-organization
node scripts/validate-documentation-organization.js
```

### **Paso 3: Crear en Ubicación Correcta**
```bash
# ✅ Crear en carpeta apropiada
mkdir -p docs/PROJECT/08_TOOLCHAIN_AND_SETUP/new-tool-documentation/
touch docs/PROJECT/08_TOOLCHAIN_AND_SETUP/new-tool-documentation/README.md
```

### **Paso 4: Validar Post-Creación**
```bash
# ✅ Validar después de crear
npm run validate:documentation-organization
git add .
git commit -m "docs: agregar documentación en ubicación correcta"
```

---

## 📞 **Recursos de Referencia**

### **Documentación Relacionada:**
- `docs/PROJECT/08_TOOLCHAIN_AND_SETUP/cursor-documentation/ORGANIZATION_MISTAKE_ANALYSIS.md`
- `docs/XTP_METHODOLOGY/01_PRINCIPLES/`
- `docs/PROJECT/README.md`

### **Scripts de Validación:**
- `scripts/validate-documentation-organization.js`
- `.git/hooks/pre-commit-documentation`

### **Reglas Relacionadas:**
- `.cursor/rules/xtp-v4.6-methodology.md`
- `.cursor/rules/monorepo-management.md`

---

*Reglas de organización de documentación - XTP v4.6* 