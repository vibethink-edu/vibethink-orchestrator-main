# ESTADO ACTUAL Y REGLAS PERMANENTES - VibeThink Orchestrator

## 🚨 **PROBLEMAS CRÍTICOS ENCONTRADOS**

### **1. CONFLICTO DE VERSIONES CRÍTICO**
```json
// ❌ PROBLEMA: Versiones incompatibles entre root y dashboard
// Root package.json:
"next": "15.3.4"
"react": "^18"

// Dashboard package.json:
"next": "^15.4.6"  // ❌ VERSIÓN DIFERENTE
"react": "^19.1.1" // ❌ VERSIÓN DIFERENTE
```

### **2. DEPENDENCIAS DUPLICADAS**
```json
// ❌ PROBLEMA: Mismas dependencias en root y apps
// Root tiene:
"@radix-ui/react-icons": "^1.3.2"
"clsx": "^2.1.1"
"tailwind-merge": "^2.6.0"

// Dashboard tiene:
"@radix-ui/react-icons": "^1.3.2"  // ❌ DUPLICADO
"clsx": "^2.1.1"                   // ❌ DUPLICADO
"tailwind-merge": "^3.3.1"          // ❌ VERSIÓN DIFERENTE
```

### **3. ESTRUCTURA MONOREPO INCORRECTA**
```bash
# ❌ PROBLEMA: Dependencias instaladas en apps individuales
apps/dashboard/node_modules/  # ❌ NO DEBE EXISTIR
apps/admin/node_modules/      # ❌ NO DEBE EXISTIR
apps/login/node_modules/      # ❌ NO DEBE EXISTIR
```

## ✅ **CÓMO DEBE QUEDAR CORRECTAMENTE**

### **1. ESTRUCTURA MONOREPO PERFECTA**
```bash
vibethink-orchestrator/
├── package.json              # ✅ TODAS las dependencias aquí
├── node_modules/            # ✅ ÚNICO node_modules
├── apps/
│   ├── dashboard/
│   │   ├── package.json     # ✅ SOLO scripts y config
│   │   └── src/
│   ├── admin/
│   │   ├── package.json     # ✅ SOLO scripts y config
│   │   └── src/
│   ├── login/
│   │   ├── package.json     # ✅ SOLO scripts y config
│   │   └── src/
│   └── helpdesk/
│       ├── package.json     # ✅ SOLO scripts y config
│       └── src/
└── src/
    └── shared/              # ✅ Componentes compartidos
```

### **2. PACKAGE.JSON ROOT CORRECTO**
```json
{
  "name": "vibethink-orchestrator",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "src/*"
  ],
  "dependencies": {
    // ✅ TODAS las dependencias aquí
    "next": "15.3.4",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@radix-ui/react-icons": "1.3.2",
    "clsx": "2.1.1",
    "tailwind-merge": "2.6.0",
    // ... todas las demás
  },
  "devDependencies": {
    // ✅ TODAS las devDependencies aquí
    "@types/node": "20.0.0",
    "@types/react": "18.3.12",
    "@types/react-dom": "18.3.1",
    "typescript": "5.9.2",
    // ... todas las demás
  }
}
```

### **3. PACKAGE.JSON APPS CORRECTO**
```json
// apps/dashboard/package.json
{
  "name": "vibethink-orchestrator-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
  // ✅ NO dependencies, NO devDependencies
}
```

## 🛡️ **REGLAS PERMANENTES - NUNCA VIOLAR**

### **REGLA 1: VERSIONES EXACTAS**
```json
// ✅ CORRECTO: Usar versiones exactas
"next": "15.3.4"
"react": "18.3.1"

// ❌ NUNCA: Usar versiones con ^ o ~
"next": "^15.3.4"
"react": "^18.3.1"
```

### **REGLA 2: DEPENDENCIAS SOLO EN ROOT**
```bash
# ✅ CORRECTO: Solo root tiene node_modules
npm install --workspace-root

# ❌ NUNCA: Instalar en apps individuales
cd apps/dashboard && npm install  # ❌ PROHIBIDO
```

### **REGLA 3: WORKSPACES CONFIGURADO**
```json
// ✅ CORRECTO: Workspaces en root package.json
{
  "workspaces": [
    "apps/*",
    "src/*"
  ]
}
```

### **REGLA 4: IMPORTS DESDE SHARED**
```typescript
// ✅ CORRECTO: Importar desde shared
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';

// ❌ NUNCA: Importar desde node_modules en apps
import { Button } from 'some-package';  // ❌ PROHIBIDO
```

### **REGLA 5: SCRIPTS UNIFICADOS**
```json
// ✅ CORRECTO: Scripts en root que manejan todas las apps
{
  "scripts": {
    "dev": "npm run dev:dashboard",
    "dev:dashboard": "cd apps/dashboard && npm run dev",
    "build": "npm run build:all",
    "build:all": "npm run build:dashboard && npm run build:admin"
  }
}
```

## 🔧 **PROCEDIMIENTO DE CORRECCIÓN**

### **PASO 1: LIMPIAR TODO**
```bash
# ✅ Limpiar node_modules de apps
rm -rf apps/*/node_modules
rm -rf apps/*/package-lock.json

# ✅ Limpiar root
rm -rf node_modules
rm -rf package-lock.json
```

### **PASO 2: UNIFICAR DEPENDENCIAS**
```bash
# ✅ Instalar solo en root
npm install

# ✅ Verificar que funciona
npm run dev:dashboard
```

### **PASO 3: VALIDAR ESTRUCTURA**
```bash
# ✅ Validar que no hay node_modules en apps
find apps -name "node_modules" -type d

# ✅ Validar que imports funcionan
npm run validate:universal
```

## 📋 **CHECKLIST DE VALIDACIÓN**

### **ANTES DE CADA COMMIT:**
- [ ] No hay node_modules en apps/
- [ ] Todas las dependencias están en root package.json
- [ ] Versiones exactas (sin ^ o ~)
- [ ] Workspaces configurado correctamente
- [ ] npm run validate:universal pasa
- [ ] npm run dev:dashboard funciona

### **ANTES DE CADA INSTALACIÓN:**
- [ ] Verificar que estoy en root del proyecto
- [ ] No instalar en apps individuales
- [ ] Usar npm install --workspace-root
- [ ] Verificar que las versiones son exactas

## 🚨 **ERRORES QUE NUNCA DEBEN REPETIRSE**

### **ERROR 1: VERSIONES DIFERENTES**
```json
// ❌ NUNCA MÁS:
"next": "15.3.4"  // en root
"next": "^15.4.6" // en dashboard
```

### **ERROR 2: DEPENDENCIAS DUPLICADAS**
```json
// ❌ NUNCA MÁS:
// Tener la misma dependencia en root y apps
```

### **ERROR 3: NODE_MODULES EN APPS**
```bash
# ❌ NUNCA MÁS:
apps/dashboard/node_modules/  # NO DEBE EXISTIR
```

### **ERROR 4: INSTALAR EN APPS**
```bash
# ❌ NUNCA MÁS:
cd apps/dashboard && npm install  # PROHIBIDO
```

## 🎯 **ESTADO IDEAL FINAL**

### **ESTRUCTURA PERFECTA:**
```
vibethink-orchestrator/
├── package.json              # ✅ Todas las dependencias
├── node_modules/            # ✅ Único node_modules
├── apps/
│   ├── dashboard/
│   │   ├── package.json     # ✅ Solo scripts
│   │   └── src/
│   ├── admin/
│   │   ├── package.json     # ✅ Solo scripts
│   │   └── src/
│   ├── login/
│   │   ├── package.json     # ✅ Solo scripts
│   │   └── src/
│   └── helpdesk/
│       ├── package.json     # ✅ Solo scripts
│       └── src/
└── src/
    └── shared/              # ✅ Componentes compartidos
```

### **FUNCIONAMIENTO PERFECTO:**
```bash
# ✅ Todo funciona desde root
npm run dev:dashboard    # ✅ Funciona
npm run dev:admin       # ✅ Funciona
npm run build:all       # ✅ Funciona
npm run validate:universal  # ✅ Pasa
```

## 📚 **DOCUMENTACIÓN VIVA**

Este documento debe actualizarse cada vez que se encuentre un nuevo problema o se implemente una nueva regla. Es la fuente de verdad para mantener el proyecto estable y funcional.

---

**ÚLTIMA ACTUALIZACIÓN:** $(date)
**RESPONSABLE:** VITA - VibeThink Orchestrator AI Assistant
**ESTADO:** ✅ REGLAS ESTABLECIDAS - IMPLEMENTAR INMEDIATAMENTE
