# 📚 **GUÍA DE CONFIGURACIÓN DOCUSAURUS - VibeThink**

## 🎯 **RESUMEN EJECUTIVO**

**Fecha:** 19/7/2025  
**Estado:** ✅ **FUNCIONANDO**  
**URL:** http://localhost:3000/  
**Problemas Resueltos:** 3 errores críticos

## 🚨 **ERRORES ENCONTRADOS Y SOLUCIONES**

### **❌ Error 1: Archivos faltantes en sidebar**
**Problema:**
```
[ERROR] Error: Invalid sidebar file at "sidebars.ts".
These sidebar document ids do not exist:
- company-admin/users
- contact
- faq
- onboarding/setup
- troubleshooting/common-issues
- user-guides/dashboard-manual
- user-guides/project-overview
```

**✅ Solución:**
```powershell
# Copiar archivos a la ubicación correcta
Copy-Item -Path "src\i18n\es\docusaurus-plugin-content-docs\current\*" -Destination "docs\" -Recurse -Force
```

**📝 Lección:** Docusaurus busca archivos en `docs/`, no en `src/i18n/`

### **❌ Error 2: Comando incorrecto en PowerShell**
**Problema:**
```bash
# ❌ Comando de Linux/Mac
cp -r src/i18n/es/docusaurus-plugin-content-docs/current/* docs/
```

**✅ Solución:**
```powershell
# ✅ Comando de PowerShell
Copy-Item -Path "src\i18n\es\docusaurus-plugin-content-docs\current\*" -Destination "docs\" -Recurse -Force
```

**📝 Lección:** Usar comandos nativos de PowerShell

### **❌ Error 3: Configuración de i18n incorrecta**
**Problema:** Archivos en `src/i18n/` no se detectan automáticamente

**✅ Solución:**
```typescript
// ✅ Configuración correcta en docusaurus.config.ts
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  localeConfigs: {
    es: {
      htmlLang: 'es',
      label: 'Español',
    },
    en: {
      htmlLang: 'en',
      label: 'English',
    },
  },
},
```

**📝 Lección:** Configurar i18n antes de crear archivos

## 🏗️ **PROCESO CORRECTO DE CONFIGURACIÓN**

### **Paso 1: Crear Docusaurus**
```powershell
# ✅ Comando correcto
npx create-docusaurus@latest docusaurus-docs --typescript
```

### **Paso 2: Configurar docusaurus.config.ts**
```typescript
// ✅ Configuración completa
const config: Config = {
  title: 'VibeThink - Documentación',
  tagline: 'Plataforma SaaS Multi-tenant',
  url: 'https://docs.vibethink.ai',
  baseUrl: '/',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeConfigs: {
      es: { htmlLang: 'es', label: 'Español' },
      en: { htmlLang: 'en', label: 'English' }
    },
  },
  // ... resto de configuración
};
```

### **Paso 3: Crear estructura de archivos**
```bash
# ✅ Estructura correcta
docusaurus-docs/
├── docs/                           # ✅ Ubicación principal
│   ├── intro.md                    # ✅ Página principal
│   ├── onboarding/
│   │   └── setup.md
│   ├── user-guides/
│   │   ├── dashboard-manual.md
│   │   └── project-overview.md
│   ├── company-admin/
│   │   ├── users.md
│   │   ├── settings.md
│   │   └── billing.md
│   ├── troubleshooting/
│   │   └── common-issues.md
│   ├── faq.md
│   └── contact.md
└── sidebars.ts                     # ✅ Configurar después
```

### **Paso 4: Configurar sidebar**
```typescript
// ✅ Sidebar después de crear archivos
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Onboarding',
      items: ['onboarding/setup'],
    },
    {
      type: 'category',
      label: '📖 Guías de Usuario',
      items: [
        'user-guides/project-overview',
        'user-guides/dashboard-manual',
      ],
    },
    // ... resto de categorías
  ],
};
```

### **Paso 5: Copiar archivos (PowerShell)**
```powershell
# ✅ Comando correcto para PowerShell
Copy-Item -Path "src\i18n\es\docusaurus-plugin-content-docs\current\*" -Destination "docs\" -Recurse -Force
```

### **Paso 6: Verificar funcionamiento**
```powershell
# ✅ Iniciar servidor
npm start
```

## 📋 **CHECKLIST DE VERIFICACIÓN**

### **✅ Antes de iniciar servidor:**
- [ ] **Archivos en docs/** - No en src/i18n/
- [ ] **Sidebar configurado** - IDs coinciden con archivos
- [ ] **Configuración i18n** - Completada
- [ ] **Dependencias instaladas** - npm install completado

### **✅ Después de iniciar servidor:**
- [ ] **Compilación exitosa** - Sin errores
- [ ] **URLs accesibles** - http://localhost:3000
- [ ] **Navegación funcional** - Sidebar funciona
- [ ] **Contenido visible** - Archivos se muestran

## 🚀 **COMANDOS ÚTILES**

### **PowerShell (Windows):**
```powershell
# Crear Docusaurus
npx create-docusaurus@latest docusaurus-docs --typescript

# Copiar archivos
Copy-Item -Path "origen\*" -Destination "destino\" -Recurse -Force

# Iniciar servidor
npm start

# Verificar archivos
Get-ChildItem -Path "docs\" -Recurse
```

### **Verificación de errores:**
```powershell
# Verificar estructura
tree /f docs\

# Verificar sidebar
npm run build

# Verificar i18n
npm run write-translations
```

## 📚 **ESTRUCTURA FINAL FUNCIONANDO**

### **✅ URLs Disponibles:**
- 🌐 **Default**: http://localhost:3000
- 🇪🇸 **Español**: http://localhost:3000/es
- 🇺🇸 **English**: http://localhost:3000/en

### **✅ Contenido Migrado:**
- ✅ **VIBETHINK_PROJECT_DOCUMENTATION.md** → project-overview.md
- ✅ **USER_MANUALS.md** → dashboard-manual.md
- ✅ **Estructura bilingüe** completa
- ✅ **Navegación** configurada

## 🎯 **PRÓXIMOS DOCUSAURUS**

### **Para docusaurus-dev/ (dev.vibethink.ai):**
1. **Seguir checklist** completo
2. **Usar PowerShell** para comandos
3. **Crear archivos** en docs/ directamente
4. **Configurar sidebar** después de archivos
5. **Verificar funcionamiento** antes de continuar

### **Para docusaurus-api/ (api.vibethink.ai):**
1. **Migrar SWAGGER_DOCUMENTATION.md**
2. **Configurar autenticación**
3. **Agregar ejemplos de código**
4. **Configurar playground**

### **Para docusaurus-vthink/ (vthink.vibethink.ai):**
1. **Migrar VIBE_CODING_METHODOLOGY.md**
2. **Configurar metodología**
3. **Agregar templates**
4. **Configurar frameworks**

---

**📌 NOTA: Esta guía evita los 3 errores principales encontrados en la configuración inicial.** 