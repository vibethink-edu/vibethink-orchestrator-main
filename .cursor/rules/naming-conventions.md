# Naming Conventions Rules - VTK v4.6

## 📋 **Reglas de Naming Conventions para Cursor**

### **PRINCIPIO FUNDAMENTAL: Archivos en inglés, contenido en español**

---

## 🎯 **Reglas de Naming de Archivos**

### **Principio General**
**Todos los nombres de archivos deben estar en inglés**, independientemente del contenido interno.

### **Categorías de Archivos**

#### **📁 Documentación de Investigación**
```typescript
// ✅ CORRECTO - Formato: kebab-case.md
const researchFiles = [
  'saas-integration-validation-model.md',
  'ica-electronic-office-compliance-analysis.md',
  'government-api-integration-guide.md'
];

// ❌ INCORRECTO
const incorrectFiles = [
  'nueva-validacion-saas-integracion.md',
  'analisis-cumplimiento-sede-electronica.md'
];
```

#### **📁 Documentación de Desarrollo**
```typescript
// ✅ CORRECTO - Formato: kebab-case.md
const developmentFiles = [
  'naming-conventions-and-rules.md',
  'development-guidelines.md',
  'api-documentation-standards.md',
  'cursor-developer-guide.md',
  'cursor-quick-reference.md'
];

// ❌ INCORRECTO
const incorrectDevFiles = [
  'convenciones-naming-reglas.md',
  'guias-desarrollo.md'
];
```

#### **📁 Componentes React/TypeScript**
```typescript
// ✅ CORRECTO - Formato: PascalCase.tsx
const componentFiles = [
  'UserProfile.tsx',
  'ElectronicOfficeForm.tsx',
  'GovernmentIntegration.tsx',
  'CursorRulesManager.tsx'
];

// ❌ INCORRECTO
const incorrectComponents = [
  'user-profile.tsx',
  'perfil-usuario.tsx',
  'formulario-sede-electronica.tsx'
];
```

#### **📁 Hooks y Utilidades**
```typescript
// ✅ CORRECTO - Formato: camelCase.ts
const hookFiles = [
  'useAuth.ts',
  'useGovernmentAPI.ts',
  'electronicOfficeUtils.ts',
  'useCursorRules.ts',
  'namingConventionValidator.ts'
];

// ❌ INCORRECTO
const incorrectHooks = [
  'use-auth.ts',
  'hook-autenticacion.ts',
  'utilidades-sede-electronica.ts'
];
```

#### **📁 Servicios y APIs**
```typescript
// ✅ CORRECTO - Formato: camelCase.ts
const serviceFiles = [
  'governmentService.ts',
  'dianIntegration.ts',
  'psePaymentService.ts',
  'cursorRulesService.ts',
  'namingConventionService.ts'
];

// ❌ INCORRECTO
const incorrectServices = [
  'servicio-gobierno.ts',
  'integracion-dian.ts',
  'servicio-pago-pse.ts'
];
```

---

## 📄 **Reglas de Contenido de Documentos**

### **Principio General**
**El contenido interno de los documentos debe estar en español**, a menos que se solicite explícitamente lo contrario.

### **Estructura de Documentos**
```typescript
// ✅ CORRECTO - Estructura de documento
const documentStructure = {
  fileName: 'government-api-integration-guide.md', // Inglés
  content: {
    title: 'Guía de Integración APIs Gubernamentales', // Español
    version: '1.0 - Integración SAAS',
    date: '26 de Junio, 2025',
    responsible: 'Marcelo/AI',
    status: 'Guía Completa',
    applicability: 'Gobierno, APIs, Integración'
  }
};
```

### **Tablas y Matrices**
```typescript
// ✅ CORRECTO - Encabezados en español
const tableHeaders = [
  'Requerimiento',
  'Capacidad', 
  'Cumplimiento',
  'Implementación'
];

// ✅ CORRECTO - Contenido en español
const tableContent = [
  'Integración DIAN',
  'APIs REST/GraphQL',
  '100%',
  'Integración directa'
];
```

---

## 🔧 **Reglas de Código**

### **TypeScript/JavaScript**

#### **📁 Nombres de Variables y Funciones**
```typescript
// ✅ CORRECTO - camelCase, inglés
const userProfile = getUserProfile();
const governmentAPI = new GovernmentAPI();
const cursorRules = new CursorRulesManager();

function processElectronicDocument() {}
function validateNamingConvention() {}
function updateCursorRules() {}

// ❌ INCORRECTO - español
const perfilUsuario = getPerfilUsuario();
const apiGobierno = new APIGobierno();
const reglasCursor = new GestorReglasCursor();

function procesarDocumentoElectronico() {}
function validarConvencionNaming() {}
```

#### **📁 Interfaces y Types**
```typescript
// ✅ CORRECTO - PascalCase, inglés
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface GovernmentDocument {
  id: string;
  title: string;
  status: DocumentStatus;
}

interface CursorRules {
  id: string;
  name: string;
  content: string;
  category: RuleCategory;
}

type ElectronicOfficeStatus = 'pending' | 'approved' | 'rejected';
type NamingConventionType = 'file' | 'folder' | 'component' | 'variable';

// ❌ INCORRECTO - español
interface PerfilUsuario {
  id: string;
  nombre: string;
  correo: string;
}

interface DocumentoGobierno {
  id: string;
  titulo: string;
  estado: EstadoDocumento;
}
```

#### **📁 Constantes**
```typescript
// ✅ CORRECTO - UPPER_SNAKE_CASE, inglés
const API_BASE_URL = 'https://api.ica.gov.co';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const GOVERNMENT_ROLES = ['ADMIN', 'USER', 'VIEWER'];
const CURSOR_RULES_PATH = '.cursor/rules/';
const NAMING_CONVENTIONS_FILE = 'naming-conventions-and-rules.md';

// ❌ INCORRECTO - español
const URL_BASE_API = 'https://api.ica.gov.co';
const TAMANO_MAXIMO_ARCHIVO = 10 * 1024 * 1024;
const ROLES_GUBERNAMENTALES = ['ADMIN', 'USER', 'VIEWER'];
```

### **CSS/Tailwind**
```typescript
// ✅ CORRECTO - kebab-case, inglés
const cssClasses = [
  'user-profile-container',
  'government-document-form',
  'electronic-office-status',
  'cursor-rules-manager',
  'naming-convention-validator'
];

// ❌ INCORRECTO - español
const incorrectClasses = [
  'contenedor-perfil-usuario',
  'formulario-documento-gobierno',
  'estado-sede-electronica'
];
```

---

## 📁 **Estructura de Carpetas**

### **Principio General**
**Nombres de carpetas en inglés**, siguiendo convenciones establecidas.

### **Estructura Estándar**
```typescript
// ✅ CORRECTO - Estructura de carpetas
const folderStructure = {
  src: {
    components: {
      ui: 'shadcn/ui components',
      admin: 'Admin panels',
      layout: 'Layout components',
      cursor: 'Cursor-specific components'
    },
    hooks: 'Custom hooks',
    pages: 'Page components',
    utils: 'Utilities and helpers',
    types: 'Type definitions',
    services: 'API services'
  },
  docs: {
    research: 'Research documents',
    development: 'Development guides',
    architecture: 'Architecture decisions',
    userDocumentation: 'User guides',
    cursorDocumentation: 'Cursor-specific guides'
  }
};
```

### **Ejemplos Correctos**
```typescript
// ✅ CORRECTO
const correctFolders = [
  'docs/research/sede-electronica/',
  'docs/development/naming-conventions/',
  'src/components/electronic-office/',
  'src/services/government-integration/',
  'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/cursor-documentation/'
];

// ❌ INCORRECTO
const incorrectFolders = [
  'docs/investigacion/sede-electronica/',
  'docs/desarrollo/convenciones-naming/',
  'src/componentes/sede-electronica/',
  'src/servicios/integracion-gobierno/'
];
```

---

## 🚫 **Anti-Patterns a Evitar**

### **❌ Nombres de Archivos**
```typescript
// ❌ INCORRECTO - Archivos en español
const incorrectFiles = [
  'nueva-validacion-saas-integracion.md',
  'analisis-cumplimiento-sede-electronica.md',
  'guia-desarrollo.md',
  'convenciones-naming.md',
  'reglas-cursor.md',
  'guias-desarrollador.md'
];
```

### **❌ Nombres de Variables**
```typescript
// ❌ INCORRECTO - Variables en español
const incorrectVariables = {
  perfilUsuario: {},
  apiGobierno: new APIGobierno(),
  reglasCursor: new ReglasCursor(),
  convencionesNaming: new ConvencionesNaming()
};

function procesarDocumentoElectronico() {}
function validarConvencionNaming() {}
function actualizarReglasCursor() {}
```

### **❌ Nombres de Carpetas**
```typescript
// ❌ INCORRECTO - Carpetas en español
const incorrectFolders = [
  'docs/investigacion/',
  'src/componentes/',
  'src/servicios/',
  'docs/desarrollo/',
  'docs/documentacion-cursor/'
];
```

---

## ✅ **Ejemplos de Aplicación Correcta**

### **📁 Estructura de Archivos**
```typescript
// ✅ CORRECTO - Estructura completa
const correctFileStructure = {
  docs: {
    research: {
      'sede-electronica': [
        'saas-integration-validation-model.md',
        'ica-electronic-office-compliance-analysis.md',
        'government-api-integration-guide.md'
      ]
    },
    development: [
      'naming-conventions-and-rules.md',
      'development-guidelines.md',
      'testing-strategies.md',
      'cursor-developer-guide.md'
    ],
    PROJECT: {
      '08_TOOLCHAIN_AND_SETUP': {
        'cursor-documentation': [
          'cursor-developer-guide.md',
          'cursor-quick-reference.md',
          'cursor-refactoring-guide.md',
          'cursor-rules-explanation.md',
          'developer-faq.md'
        ]
      }
    }
  },
  src: {
    components: {
      'UserProfile.tsx': 'User profile component',
      'ElectronicOfficeForm.tsx': 'Electronic office form',
      'CursorRulesManager.tsx': 'Cursor rules manager'
    },
    hooks: {
      'useAuth.ts': 'Authentication hook',
      'useGovernmentAPI.ts': 'Government API hook',
      'useCursorRules.ts': 'Cursor rules hook'
    },
    services: {
      'governmentService.ts': 'Government service',
      'cursorRulesService.ts': 'Cursor rules service',
      'namingConventionService.ts': 'Naming convention service'
    }
  }
};
```

### **📄 Contenido de Documento**
```typescript
// ✅ CORRECTO - Estructura de documento
const documentExample = {
  fileName: 'government-api-integration-guide.md',
  content: `
# Government API Integration Guide

## 📋 **Información del Documento**

| Campo | Valor |
|-------|-------|
| **Título** | Guía de Integración APIs Gubernamentales |
| **Versión** | 1.0 - Integración SAAS |
| **Fecha** | 26 de Junio, 2025 |
| **Responsable** | Marcelo/AI |
| **Estado** | Guía Completa |
| **Aplicabilidad** | Gobierno, APIs, Integración |

## 🎯 **Resumen Ejecutivo**

Esta guía describe los procesos de integración con APIs gubernamentales...
  `
};
```

### **🔧 Código TypeScript**
```typescript
// ✅ CORRECTO - Código TypeScript
interface GovernmentDocument {
  id: string;
  title: string;
  status: DocumentStatus;
  createdAt: Date;
}

interface CursorRules {
  id: string;
  name: string;
  content: string;
  category: RuleCategory;
  isActive: boolean;
}

const processGovernmentDocument = (document: GovernmentDocument) => {
  // Lógica de procesamiento
};

const validateNamingConvention = (fileName: string): boolean => {
  // Validación de naming convention
  return /^[a-z0-9-]+\.(md|ts|tsx|js|jsx)$/.test(fileName);
};

const updateCursorRules = (rules: CursorRules[]) => {
  // Actualización de reglas de Cursor
};
```

---

## 📋 **Checklist de Validación**

### **Antes de Crear un Archivo**
```typescript
const fileValidationChecklist = {
  isEnglish: '¿El nombre del archivo está en inglés?',
  isKebabCase: '¿Sigue el formato kebab-case?',
  isDescriptive: '¿Es descriptivo y claro?',
  noSpecialChars: '¿No contiene caracteres especiales?',
  correctExtension: '¿Tiene la extensión correcta?'
};
```

### **Antes de Escribir Contenido**
```typescript
const contentValidationChecklist = {
  englishTitle: '¿El título del documento está en inglés?',
  spanishContent: '¿El contenido interno está en español?',
  spanishTables: '¿Las tablas y métricas están en español?',
  codeConventions: '¿Los ejemplos de código siguen las convenciones?'
};
```

### **Antes de Escribir Código**
```typescript
const codeValidationChecklist = {
  englishVariables: '¿Las variables y funciones están en inglés?',
  correctCase: '¿Siguen camelCase/PascalCase según corresponda?',
  pascalCaseInterfaces: '¿Las interfaces y types están en PascalCase?',
  upperSnakeConstants: '¿Las constantes están en UPPER_SNAKE_CASE?'
};
```

---

## 🔄 **Proceso de Corrección**

### **Cuando se Detecta un Error**
```typescript
const correctionProcess = {
  step1: 'Identificar el archivo con naming incorrecto',
  step2: 'Renombrar siguiendo las convenciones',
  step3: 'Actualizar referencias en otros archivos',
  step4: 'Verificar que no se rompa la funcionalidad',
  step5: 'Documentar el cambio si es necesario'
};
```

### **Ejemplo de Corrección**
```typescript
// ❌ ANTES
const beforeCorrection = {
  file: 'docs/research/sede-electronica/nueva-validacion-saas-integracion.md',
  variable: 'const perfilUsuario = {};',
  function: 'function procesarDocumentoElectronico() {}'
};

// ✅ DESPUÉS
const afterCorrection = {
  file: 'docs/research/sede-electronica/saas-integration-validation-model.md',
  variable: 'const userProfile = {};',
  function: 'function processElectronicDocument() {}'
};
```

---

## 📚 **Referencias y Recursos**

### **Documentos Relacionados**
```typescript
const relatedDocuments = [
  './development-guidelines.md',
  './coding-standards.md',
  './testing-strategies.md',
  '../cursor-developer-guide.md',
  '../cursor-quick-reference.md'
];
```

### **Herramientas de Validación**
```typescript
const validationTools = [
  'ESLint rules for naming conventions',
  'Prettier configuration',
  'Git hooks for pre-commit validation',
  'Cursor IDE rules integration',
  'VS Code extensions for naming conventions'
];
```

---

*Reglas de naming conventions integradas con Cursor - VTK v4.6* 
