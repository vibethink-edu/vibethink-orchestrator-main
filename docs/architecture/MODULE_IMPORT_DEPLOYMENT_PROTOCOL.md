# Protocolo Completo de Importación y Despliegue de Módulos/Componentes

**Fecha de creación:** 2025-12-20  
**Estado:** ✅ OBLIGATORIO - Protocolo maestro para todas las importaciones  
**Versión:** 1.0.0

---

## 🚨 REGLA FUNDAMENTAL

**Este protocolo consolida TODAS las lecciones aprendidas de importaciones anteriores. Es OBLIGATORIO seguirlo para cualquier módulo/componente importado al monorepo.**

**ANTES de importar cualquier módulo/componente:**
1. ✅ Leer este protocolo completo
2. ✅ Consultar `module-registry.ts` para verificar si ya existe
3. ✅ Seguir TODAS las fases en orden
4. ✅ Validar cada fase antes de continuar

---

## 📋 Tabla de Contenidos

1. [Fase 0: Pre-Importación](#fase-0-pre-importación)
2. [Fase 1: Análisis y Preparación](#fase-1-análisis-y-preparación)
3. [Fase 2: Validación de Compatibilidad](#fase-2-validación-de-compatibilidad)
4. [Fase 3: Importación de Archivos](#fase-3-importación-de-archivos)
5. [Fase 4: Adaptación de Código](#fase-4-adaptación-de-código)
6. [Fase 5: Validación i18n (OBLIGATORIO)](#fase-5-validación-i18n-obligatorio)
7. [Fase 6: Registro y Documentación](#fase-6-registro-y-documentación)
8. [Fase 7: Validación Final](#fase-7-validación-final)
9. [Lecciones Aprendidas](#lecciones-aprendidas)

---

## 🔍 Fase 0: Pre-Importación

### 0.1. Consultar Module Registry

**🚨 CRÍTICO:** Verificar si el módulo ya está migrado.

```typescript
// Consultar apps/dashboard/src/shared/data/module-registry.ts
import { getModuleById, getModuleByPath } from '@/shared/data/module-registry';

// Verificar por ID
const existing = getModuleById('hotel-dashboard');
if (existing) {
  console.log('Módulo ya existe:', existing);
  // Evaluar si necesitas actualizar o es duplicado
}

// Verificar por path
const byPath = getModuleByPath('/dashboard-bundui/hotel');
if (byPath) {
  console.log('Ruta ya registrada:', byPath);
}
```

**Si el módulo ya existe:**
- ✅ Evaluar si necesitas actualizar versión
- ✅ Verificar si hay cambios nuevos en la fuente
- ❌ NO duplicar - usar el existente o actualizar

### 0.2. Identificar Fuente

**Fuentes soportadas:**
- `bundui-premium` - Bundui Premium Dashboard Templates
- `bundui-original` - Bundui Original Source Code (`C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard`)
- `shadcn-ui-kit` - shadcnuikit.com/components/
- `react-flow` - reactflow.dev / @xyflow/react
- `tiptap` - github.com/ueberdosis/tiptap
- `shadcn-ui` - ui.shadcn.com (base components)
- `custom` - Componentes desarrollados internamente
- `other` - Otras fuentes externas

**Documentar:**
- URL o ruta de la fuente
- Versión de la fuente
- Fecha de importación

### 0.3. Verificar Stack Compatibility

**Usar función de validación:**
```typescript
import { validateStackCompatibility } from '@/shared/data/module-registry';

const validation = validateStackCompatibility({
  // Metadata del módulo a importar
});

if (!validation.compatible) {
  console.warn('Problemas de compatibilidad:', validation.issues);
  // Resolver antes de continuar
}
```

**Stack requerido:**
- React 19.0.0
- Next.js 15.3.4
- TypeScript 5.9.2
- Tailwind CSS 4.1.10

---

## 📊 Fase 1: Análisis y Preparación

### 1.1. Identificar Scope Completo

**Listar todos los archivos del módulo:**
```bash
# Ejemplo para Bundui Original
find "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard\app\dashboard\(auth)\hotel" \
  -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.ts" \) \
  ! -path "*/node_modules/*"
```

**Categorizar archivos:**
- Componentes principales (`page.tsx`, componentes de página)
- Subcomponentes (cards, forms, tables, modals)
- Utilidades (`utils.ts`, `data.ts`, `types.ts`)
- Assets (imágenes, íconos) - **NO copiar, usar repositorio central**

### 1.2. Identificar Dependencias

**Verificar dependencias del módulo:**
```bash
# Buscar imports externos
grep -r "import.*from" source/module --include="*.tsx" --include="*.ts" | \
  grep -v "node_modules" | \
  grep -v "@/components" | \
  grep -v "@/lib"
```

**Dependencias comunes:**
- `@vibethink/ui` - ✅ Usar (nuestro package)
- `@tanstack/react-table` - ✅ Permitido
- `date-fns` - ✅ Permitido
- `zod` - ✅ Permitido
- `lottie-react` - ✅ Permitido (con `--legacy-peer-deps` si es necesario)

**Dependencias prohibidas:**
- `next` en packages (solo en apps)
- `vite` (este es Next.js, no Vite)
- Express 5 (usar 4.21.2)

### 1.3. Identificar Assets

**🚨 CRÍTICO:** NO copiar assets directamente.

**Proceso:**
1. Identificar assets usados en el módulo
2. Verificar si ya existen en `/assets/images/`
3. Si no existen, copiar a repositorio central
4. Actualizar referencias a usar rutas absolutas `/assets/...`

**Rutas de assets:**
```typescript
// ❌ INCORRECTO - Ruta relativa
src="../images/avatar.png"
src="./image.jpg"

// ✅ CORRECTO - Ruta absoluta desde /assets/
src="/assets/images/avatars/user-default.png"
src="/assets/images/products/product-placeholder.jpg"
```

**Validar assets:**
```bash
node scripts/validate-assets-duplicates.js
node scripts/validate-assets-in-repo.js
```

---

## ✅ Fase 2: Validación de Compatibilidad

### 2.1. Validar React Versions

**🚨 CRÍTICO:** Este paso previene el problema repetitivo de React 18 vs 19.

```bash
# Ejecutar script de validación
node scripts/validate-react-versions.js
```

**El script verifica:**
- ✅ Múltiples versiones de React en el monorepo
- ✅ Desalineación entre `react` y `@types/react`
- ✅ `peerDependencies` muy restrictivas
- ✅ Falta de `overrides` en root package.json

**Si hay problemas:**
1. Verificar `package.json` root tiene `overrides`:
   ```json
   {
     "overrides": {
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "@types/react": "^19.1.8",
       "@types/react-dom": "^19.1.6"
     }
   }
   ```
2. Verificar `packages/ui/package.json` tiene:
   ```json
   {
     "peerDependencies": {
       "react": "^18.0.0 || ^19.0.0",
       "react-dom": "^18.0.0 || ^19.0.0"
     }
   }
   ```
3. Limpiar y reinstalar:
   ```bash
   rm -rf node_modules apps/*/node_modules packages/*/node_modules
   npm install
   ```

### 2.2. Validar Stack Compatibility

**Verificar compatibilidad con nuestro stack:**
- React 19.0.0
- Next.js 15.3.4
- TypeScript 5.9.2
- Tailwind CSS 4.1.10

**Si el módulo requiere versiones diferentes:**
- ⚠️ Documentar en `module-registry.ts`
- ⚠️ Evaluar si es viable adaptar
- ❌ NO cambiar stack global por un módulo

---

## 📁 Fase 3: Importación de Archivos

### 3.1. Estructura de Directorios

**Ubicación estándar:**
```
apps/dashboard/app/dashboard-bundui/[module-name]/
├── page.tsx                    # Página principal
├── components/                 # Componentes del módulo
│   ├── stat-cards.tsx
│   ├── booking-list.tsx
│   └── ...
├── [sub-route]/                # Subopciones (si aplica)
│   ├── page.tsx
│   └── components/
└── data.ts                     # Datos mock (si aplica)
```

**Reglas:**
- ✅ Usar `dashboard-bundui` para módulos de Bundui
- ✅ Usar `dashboard-vibethink` para módulos personalizados
- ✅ Mantener estructura similar a la fuente original
- ❌ NO crear estructura completamente nueva

### 3.2. Copiar Archivos

**Proceso:**
1. Copiar archivos `.tsx` y `.ts`
2. **NO copiar** `node_modules`, `.next`, archivos de build
3. **NO copiar** assets (usar repositorio central)
4. Mantener estructura de carpetas original

**Verificar después de copiar:**
```bash
# Verificar que no se copiaron archivos innecesarios
find apps/dashboard/app/dashboard-bundui/[module-name] \
  -name "node_modules" -o \
  -name ".next" -o \
  -name "*.log" -o \
  -name "*.cache"
```

---

## 🔧 Fase 4: Adaptación de Código

### 4.1. Corregir Imports

**Cambios obligatorios:**

#### Imports de UI Components
```typescript
// ❌ INCORRECTO - Import desde fuente original
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ✅ CORRECTO - Import desde @vibethink/ui
import { Button, Card } from "@vibethink/ui";
```

#### Imports de Utilidades
```typescript
// ❌ INCORRECTO - Ruta relativa o absoluta de fuente
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

// ✅ CORRECTO - Import desde shared
import { cn } from "@/shared/lib/utils";
import { generateMeta } from "@/shared/lib/utils";
```

#### Imports de Assets
```typescript
// ❌ INCORRECTO - Ruta relativa
src="../images/avatar.png"
src="./image.jpg"

// ✅ CORRECTO - Ruta absoluta desde /assets/
src="/assets/images/avatars/user-default.png"
```

**Script de corrección automática:**
```bash
node scripts/fix-dashboard-imports.js --module apps/dashboard/app/dashboard-bundui/[module-name]
```

### 4.2. Decidir "use client" vs Server Component

**🚨 CRÍTICO:** Ver protocolo completo en `BUNDUI_MIGRATION_USE_CLIENT_PROTOCOL.md`

**Regla rápida (95% de casos):**
- ✅ Si el módulo tiene componentes interactivos → Agregar `"use client"` al `page.tsx`
- ✅ Si hay error `Class extends value undefined` → Agregar `"use client"`
- ⚠️ Si necesitas SEO crítico → Considerar patrón híbrido

**Checklist:**
- [ ] ¿El `page.tsx` importa componentes con hooks? → `"use client"`
- [ ] ¿El `page.tsx` importa desde `@vibethink/ui`? → `"use client"`
- [ ] ¿Tiene `generateMetadata()`? → Evaluar si es crítico para SEO
- [ ] ¿Hay error `Class extends value undefined`? → `"use client"`

**Ejemplo:**
```tsx
// ✅ CORRECTO - Client Component (caso común)
"use client";

import { StatCards } from "./components/stat-cards";
import { Button } from "@vibethink/ui";

export default function Page() {
  return (
    <div>
      <StatCards />
      <Button>Click me</Button>
    </div>
  );
}
```

### 4.3. Corregir Rutas de Assets

**Buscar y reemplazar:**
```bash
# Buscar rutas relativas de assets
grep -r "src=[\"']\.\.\/.*\.(png|jpg|jpeg|svg|webp)" apps/dashboard/app/dashboard-bundui/[module-name]/

# Reemplazar manualmente o con script
# ../images/avatar.png → /assets/images/avatars/avatar.png
```

**Validar después:**
```bash
node scripts/validate-assets-references.js --module apps/dashboard/app/dashboard-bundui/[module-name]
```

### 4.4. Verificar React 19 Compatibility

**Problemas comunes:**
- `asChild` prop faltante en `SidebarMenuButton`
- `element.ref` warnings
- Componentes que requieren `"use client"`

**Validar:**
```bash
# Buscar usos de SidebarMenuButton sin asChild
grep -r "SidebarMenuButton" apps/dashboard/app/dashboard-bundui/[module-name]/ \
  --include="*.tsx" | grep -v "asChild"

# Buscar hooks que requieren "use client"
grep -r "useState\|useEffect\|useRef" apps/dashboard/app/dashboard-bundui/[module-name]/ \
  --include="*.tsx" | grep -v "use client"
```

**Fix para `asChild`:**
```tsx
// ❌ INCORRECTO - Sin asChild
<SidebarMenuButton>
  <Link href="/dashboard">Dashboard</Link>
</SidebarMenuButton>

// ✅ CORRECTO - Con asChild
<SidebarMenuButton asChild>
  <Link href="/dashboard">Dashboard</Link>
</SidebarMenuButton>
```

---

## 🌍 Fase 5: Validación i18n (OBLIGATORIO)

**🚨 CRÍTICO:** Esta fase es OBLIGATORIA. NO importar módulos sin validación i18n completa.

**Documento completo:** `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md`

### 5.0. Entender los Niveles de Traducción

**⚠️ IMPORTANTE:** El sistema de traducción tiene múltiples niveles que DEBEN validarse:

#### Nivel 1: Dashboard General / Generalidades
**Namespace:** `common`, `navigation`, `errors`, `validation`
- Strings compartidos por todos los módulos
- Navegación general (sidebar, breadcrumbs)
- Mensajes de error comunes
- Validaciones de formularios comunes
- Botones y acciones comunes (Save, Cancel, Delete, etc.)

**Ejemplos:**
- `common.buttons.save`
- `navigation.sidebar.dashboard`
- `errors.notFound`

#### Nivel 2: Módulos Específicos
**Namespace:** `[module-name]` (ej: `hotel`, `crm`, `finance`)
- Strings específicos del módulo
- Componentes del módulo
- Formularios del módulo
- Mensajes del módulo

**Ejemplos:**
- `hotel.title`
- `hotel.components.statCards.titles.todayCheckIn`
- `crm.components.contactsTable.headers.name`

#### Nivel 3: Locales y Regionales
**Sistema:** `@vibethink/utils` - Regional Configuration
- **Meses:** Enero, Febrero, Marzo... (formateo de fechas)
- **Días:** Lunes, Martes... (calendarios)
- **Formato de números:** Separadores, decimales (1,234.56 vs 1.234,56)
- **Monedas:** Símbolos y formato (USD: $1,234.56 vs EUR: 1.234,56 €)
- **Fechas:** Formato según locale (MM/dd/yyyy vs dd/MM/yyyy)
- **Horas:** Formato 12h/24h (3:45 PM vs 15:45)

**Documentación:** `docs/architecture/LOCALE.md`

**⚠️ REGLA CRÍTICA:** 
- ✅ **Validar SIEMPRE los 3 niveles** durante importación
- ✅ **No asumir** que un nivel está completo sin validar
- ✅ **Documentar** qué nivel falta si se detecta

**Checklist de Niveles:**
- [ ] **Nivel 1 (General):** ¿El módulo usa strings comunes? ¿Están traducidos?
  - Navegación (sidebar, breadcrumbs)
  - Botones comunes (Save, Cancel, Delete)
  - Mensajes de error comunes
- [ ] **Nivel 2 (Módulo):** ¿Todos los strings del módulo están en su namespace?
  - Componentes principales
  - Subcomponentes (cards, forms, tables)
  - Mensajes específicos del módulo
- [ ] **Nivel 3 (Locale):** ¿Fechas, números, monedas usan configuración regional?
  - Formateo de fechas (meses, días)
  - Formateo de números (separadores, decimales)
  - Formateo de monedas (símbolos, formato)
  - Configuración regional (timezone, primer día de semana)

### 5.1. Auditar Strings Hardcoded

**Ejecutar auditoría:**
```bash
node scripts/audit-hardcoded-text.js \
  --module apps/dashboard/app/dashboard-bundui/[module-name] \
  --output docs/sessions/[MODULE]_I18N_AUDIT.json
```

**Categorizar strings:**
- Navigation (menús, breadcrumbs, tabs)
- Components (headers, footers, toolbars, cards)
- Forms (labels, placeholders, validations)
- Messages (errors, success, info)
- Tables (headers, actions, states)

### 5.2. Crear Namespace i18n

**Crear archivos:**
```
apps/dashboard/src/lib/i18n/translations/en/[module-name].json
apps/dashboard/src/lib/i18n/translations/es/[module-name].json
```

**Estructura obligatoria:**
```json
{
  "[moduleName]": {
    "title": "Module Title",
    "navigation": { ... },
    "sidebar": {
      "title": "Module Name",
      "subOptions": { ... }
    },
    "components": {
      "header": { ... },
      "footer": { ... },
      "toolbar": { ... }
    },
    "forms": { ... },
    "messages": { ... }
  }
}
```

**🚨 REGLAS CRÍTICAS:**
- ✅ Namespace como clave raíz: `{ "moduleName": { ... } }`
- ✅ Parámetros: `{{param}}` (doble llave) - OBLIGATORIO
- ❌ NO usar: `{param}` (llave simple)

### 5.3. Adaptar Código a i18n

**Reemplazar strings hardcoded:**
```typescript
// ❌ ANTES
<h1>Hotel Management</h1>
<Button>Save</Button>

// ✅ DESPUÉS
const { t } = useTranslation('hotel');
<h1>{t('title')}</h1>
<Button>{t('components.header.actions.save')}</Button>
```

**🚨 Validar TODOS los componentes:**
- [ ] Componentes principales (`page.tsx`)
- [ ] Subcomponentes (cards, forms, tables)
- [ ] Headers y footers
- [ ] Toolbars
- [ ] Modales y diálogos
- [ ] **Sidebar** (títulos y opciones)

### 5.4. Validar Existencia de Traducciones

**Ejecutar scripts de validación (OBLIGATORIO):**

```bash
# 1. Validar que todas las claves existen
node scripts/validate-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/[module-name] \
  --namespace [module-name]

# 2. Detectar claves faltantes y valores en inglés
node scripts/detect-missing-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/[module-name] \
  --namespace [module-name]
```

**El script debe pasar sin errores:**
```
✅ Validación exitosa: Todas las claves existen en ambos idiomas.
✅ No se detectaron valores en inglés dentro de traducciones en español.
```

**Si hay errores:**
- Agregar claves faltantes a AMBOS JSON (EN/ES)
- Traducir valores en inglés en ES
- Ejecutar nuevamente hasta que pase

### 5.5. Validar Sidebar Deployment

**🚨 CRÍTICO:** El sidebar debe estar configurado correctamente.

**Agregar a `bundui-nav-items.ts`:**
```typescript
{
  title: "Module Name",  // Debe ser traducible
  href: "/dashboard-bundui/[module-name]",
  icon: IconComponent,
  items: [  // Subopciones (si aplica)
    { title: "Dashboard", href: "/dashboard-bundui/[module-name]" },
    { title: "Suboption", href: "/dashboard-bundui/[module-name]/suboption" }
  ]
}
```

**Agregar a `nav-main.tsx` (si es necesario):**
- Verificar que el módulo aparece en la navegación
- Verificar que títulos usan i18n (si aplica)

**Validar:**
- [ ] Módulo visible en sidebar
- [ ] Títulos traducidos (si aplica)
- [ ] Subopciones funcionan
- [ ] Rutas correctas (NO apuntar a `dashboard-vibethink`)

### 5.6. Probar en Ambos Idiomas

**Checklist de prueba:**
- [ ] Cambiar idioma a inglés (EN) - todos los strings visibles
- [ ] Cambiar idioma a español (ES) - todos los strings traducidos
- [ ] Verificar sidebar en ambos idiomas
- [ ] Verificar navegación en ambos idiomas
- [ ] Verificar que NO aparecen claves visibles (ej: `module.key.path`)
- [ ] Verificar que NO quedan strings en inglés cuando está en español
- [ ] Verificar que NO quedan strings en español cuando está en inglés

---

## 📝 Fase 6: Registro y Documentación

### 6.1. Registrar en Module Registry

**Actualizar `apps/dashboard/src/shared/data/module-registry.ts`:**

```typescript
{
  id: 'module-name',
  name: 'Module Name',
  path: '/dashboard-bundui/module-name',
  type: 'dashboard',
  
  // Origen
  source: 'bundui-premium',
  sourcePath: '/dashboard/(auth)/module-name',
  sourceVersion: '1.0.0',
  
  // Fechas
  migratedAt: '2025-12-20T00:00:00Z',
  updatedAt: '2025-12-20T00:00:00Z',
  
  // Estado
  status: 'complete',
  
  // Stack
  stackCompatibility: {
    react: '19.0.0',
    nextjs: '15.3.4',
    typescript: '5.9.2',
    compatible: true,
    issues: []
  },
  
  // Componentes
  components: [
    'page.tsx',
    'components/stat-cards.tsx',
    'components/booking-list.tsx',
    // ...
  ],
  
  subRoutes: [
    {
      title: 'Dashboard',
      href: '/dashboard-bundui/module-name'
    },
    {
      title: 'Suboption',
      href: '/dashboard-bundui/module-name/suboption'
    }
  ],
  
  // i18n
  i18nNamespace: 'module-name',
  i18nCoverage: 100,  // 0-100
  i18nStatus: {
    total: 150,
    translated: 150,
    pending: 0,
    categories: {
      navigation: 10,
      sidebar: 5,
      components: 50,
      forms: 30,
      messages: 40,
      validation: 20
    }
  },
  
  // Adaptaciones
  adaptations: {
    imports: [
      'Corregidos imports de @/components/ui/* a @vibethink/ui',
      'Corregidas rutas de assets a /assets/...'
    ],
    code: [
      'Agregado "use client" a page.tsx',
      'Adaptado a i18n con useTranslation()'
    ],
    i18n: [
      'Namespace creado (EN/ES)',
      'Todos los strings principales traducidos',
      'Subcomponentes validados',
      'Sidebar con títulos traducidos'
    ],
    assets: [
      'Assets movidos a repositorio central /assets/',
      'Rutas actualizadas a absolutas'
    ]
  },
  
  // Dependencias
  dependencies: [
    '@vibethink/ui',
    '@tanstack/react-table',
    'date-fns',
    'zod'
  ],
  
  // Notas
  notes: [
    'Módulo completamente migrado y validado',
    'i18n completo al 100%',
    'Listo para producción'
  ]
}
```

### 6.2. Documentar en Session Report

**Crear documento en `docs/sessions/`:**
```
docs/sessions/VALIDACION_[MODULE]_COMPLETA_2025-12-20.md
```

**Contenido:**
- Resumen ejecutivo
- Fases de validación
- Problemas encontrados y resueltos
- Estado final (cobertura i18n, componentes, etc.)
- Lecciones aprendidas

---

## ✅ Fase 7: Validación Final

### 7.1. Build y Compilación

**Ejecutar build:**
```bash
npm run build:dashboard
```

**Verificar:**
- ✅ Build exitoso sin errores
- ✅ Sin warnings críticos
- ✅ TypeScript compila correctamente

### 7.2. Validación de Rutas

**Verificar rutas:**
```bash
node scripts/validate-dashboard-routes.js
```

**Verificar:**
- ✅ Rutas del módulo funcionan
- ✅ Subopciones funcionan
- ✅ No hay rutas rotas
- ✅ Sidebar apunta a rutas correctas

### 7.3. Validación de Assets

**Verificar assets:**
```bash
node scripts/validate-assets-duplicates.js
node scripts/validate-assets-in-repo.js
```

**Verificar:**
- ✅ No hay assets duplicados
- ✅ Todos los assets están en repositorio central
- ✅ Rutas de assets son absolutas (`/assets/...`)

### 7.4. Validación i18n Final

**Ejecutar validaciones:**
```bash
# Validar claves
node scripts/validate-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/[module-name] \
  --namespace [module-name]

# Detectar problemas
node scripts/detect-missing-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/[module-name] \
  --namespace [module-name]
```

**Ambos scripts deben pasar sin errores.**

### 7.5. Prueba Funcional

**Checklist:**
- [ ] Página principal carga correctamente
- [ ] Componentes se renderizan
- [ ] Interactividad funciona (botones, formularios)
- [ ] Navegación funciona
- [ ] Sidebar muestra el módulo
- [ ] Subopciones funcionan
- [ ] Cambio de idioma funciona (EN/ES)
- [ ] No hay errores en consola
- [ ] No hay warnings críticos

---

## 🎓 Lecciones Aprendidas

### Lección 1: React 18 vs 19 (PROBLEMA REPETITIVO)

**Problema:**
- Error: `Objects are not valid as a React child`
- Causado por desalineación de versiones de React

**Prevención:**
- ✅ Ejecutar `validate-react-versions.js` ANTES de importar
- ✅ Verificar `overrides` en root `package.json`
- ✅ Verificar `peerDependencies` en `packages/ui/package.json`
- ✅ Limpiar y reinstalar si hay problemas

**Documentación:** `docs/TROUBLESHOOTING.md` (sección React 18 vs 19)

### Lección 2: `asChild` Prop (CRÍTICO)

**Problema:**
- Error: `Objects are not valid as a React child`
- Causado por falta de `asChild` en `SidebarMenuButton`

**Solución:**
```tsx
// ✅ SIEMPRE usar asChild cuando SidebarMenuButton contiene Link
<SidebarMenuButton asChild>
  <Link href="/dashboard">Dashboard</Link>
</SidebarMenuButton>
```

**Documentación:** `docs/TROUBLESHOOTING.md` (sección asChild)

### Lección 3: "use client" en page.tsx

**Problema:**
- Error: `Class extends value undefined is not a constructor or null`
- Causado por Server Component importando Client Components

**Solución:**
- ✅ Agregar `"use client"` al `page.tsx` si tiene componentes interactivos
- ✅ Eliminar `generateMetadata()` si usas `"use client"` (o usar patrón híbrido)

**Documentación:** `docs/architecture/BUNDUI_MIGRATION_USE_CLIENT_PROTOCOL.md`

### Lección 4: i18n Durante Importación (OBLIGATORIO)

**Problema:**
- Módulos importados con 0% i18n
- Trabajo masivo después de importar
- Claves visibles en UI

**Solución:**
- ✅ Validar i18n DURANTE la importación (no después)
- ✅ Crear namespace inmediatamente
- ✅ Adaptar código durante migración
- ✅ Validar con scripts antes de marcar como completo

**Documentación:** `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md`

### Lección 5: Assets Duplicados

**Problema:**
- Assets duplicados en múltiples ubicaciones
- Rutas relativas que se rompen
- Confusión sobre dónde están los assets

**Solución:**
- ✅ Usar repositorio central `/assets/`
- ✅ Rutas absolutas siempre (`/assets/images/...`)
- ✅ NO copiar assets durante importación
- ✅ Validar con scripts

**Documentación:** `docs/architecture/ASSETS_REPOSITORY_POLICY.md`

### Lección 6: Sidebar Confusión

**Problema:**
- Sidebar de `dashboard-bundui` contenía referencias a `dashboard-vibethink`
- Confusión sobre qué dashboard usar

**Solución:**
- ✅ Sidebar de `dashboard-bundui` solo apunta a `/dashboard-bundui/*`
- ✅ Sidebar de `dashboard-vibethink` solo apunta a `/dashboard-vibethink/*`
- ✅ NO mezclar referencias entre dashboards

### Lección 7: Valores en Inglés en Traducciones ES

**Problema:**
- Valores en español contenían palabras en inglés
- Ejemplo: `"deluxe": "Deluxe"` en ES (debería ser "De lujo")

**Solución:**
- ✅ NO copiar valores de EN a ES sin traducir
- ✅ Usar script `detect-missing-i18n-keys.js` para detectar
- ✅ Traducir INMEDIATAMENTE cuando se detecta

### Lección 8: Claves Faltantes en JSON

**Problema:**
- Claves usadas en código no existían en JSON
- Resultado: claves visibles en UI (ej: `hotel.roomTypes.deluxe`)

**Solución:**
- ✅ Validar con `validate-i18n-keys.js` ANTES de probar
- ✅ Agregar claves faltantes a AMBOS JSON (EN/ES)
- ✅ Verificar formato de parámetros (`{{param}}`)

### Lección 9: Namespace Structure

**Problema:**
- JSON estructurado como `{ "namespace": { ... } }` causaba búsqueda incorrecta
- Sistema buscaba `namespace.namespace.key` en lugar de `namespace.key`

**Solución:**
- ✅ JSON debe tener namespace como clave raíz
- ✅ Loader extrae contenido correctamente
- ✅ Verificar que estructura es correcta

### Lección 10: Subcomponentes No Validados

**Problema:**
- Componentes principales adaptados a i18n
- Subcomponentes (cards, forms) quedaron con strings hardcoded

**Solución:**
- ✅ Validar TODOS los componentes del módulo
- ✅ Incluir subcomponentes en validación
- ✅ Listar TODOS los archivos `.tsx` y verificar cada uno

### Lección 11: Datos Mock con Strings Hardcoded

**Problema:**
- Datos mock con valores hardcoded (ej: "Room 101", "3 nights", "June 19, 2028")
- Se muestran directamente sin formateo
- Aparecen en inglés incluso cuando el idioma está en español

**Solución:**
- ✅ Formatear datos mock usando i18n en el componente
- ✅ Crear helpers de formateo (roomNumber, duration, etc.)
- ✅ Usar formateo regional para fechas y números cuando sea posible
- ✅ Agregar `formatters` al namespace para valores comunes

**Ejemplo:**
```typescript
// ✅ Formatear roomNumber
cell: ({ row }) => {
  const roomNumber = row.getValue("roomNumber") as string;
  const roomMatch = roomNumber.match(/\d+/);
  if (roomMatch) {
    return <span>{t('formatters.roomNumber', { number: roomMatch[0] })}</span>;
  }
  return <span>{roomNumber}</span>;
}

// ✅ Formatear duration con pluralización
cell: ({ row }) => {
  const duration = row.getValue("duration") as string;
  const nightMatch = duration.match(/(\d+)\s*nights?/i);
  if (nightMatch) {
    const count = parseInt(nightMatch[1], 10);
    const key = count === 1 ? 'formatters.nights' : 'formatters.nightsPlural';
    return <span>{t(key, { count })}</span>;
  }
  return <span>{duration}</span>;
}
```

**Documentación:** `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md` (Problema 5)

### Lección 12: Validación Sistemática por Componente (SubWorkspace)

**Problema:**
- Strings hardcoded quedan sin detectar
- No hay sistema organizado para validar componente por componente
- Difícil identificar qué componente necesita traducción

**Solución:**
- ✅ Organizar namespaces por componente (`components.{componentName}`)
- ✅ Validar componente por componente sistemáticamente
- ✅ Usar scripts mejorados que detectan por componente
- ✅ Crear namespace completo desde el inicio

**Estrategia:**
1. **Identificar componentes:** Listar todos los `.tsx` y mapear a namespace
2. **Auditar por componente:** Detectar strings hardcoded por archivo
3. **Crear namespace:** Estructura completa en EN/ES
4. **Adaptar código:** Reemplazar strings con `t()`
5. **Validar:** Verificar que todas las claves existen

**Documentación:** `docs/architecture/I18N_COMPONENT_NAMESPACE_STRATEGY.md` ⭐

---

## 📋 Checklist Maestro de Importación

### Pre-Importación
- [ ] Consultar `module-registry.ts` (verificar si ya existe)
- [ ] Identificar fuente y versión
- [ ] Verificar stack compatibility

### Análisis
- [ ] Identificar scope completo del módulo
- [ ] Identificar dependencias
- [ ] Identificar assets (NO copiar, usar repositorio central)

### Validación
- [ ] Validar React versions (`validate-react-versions.js`)
- [ ] Validar stack compatibility

### Importación
- [ ] Copiar archivos (solo `.tsx`, `.ts`)
- [ ] NO copiar `node_modules`, `.next`, assets

### Adaptación
- [ ] Corregir imports (`@/components/ui/*` → `@vibethink/ui`)
- [ ] Corregir rutas de assets (`../images/` → `/assets/...`)
- [ ] Decidir "use client" vs Server Component
- [ ] Agregar `asChild` donde sea necesario

### i18n (OBLIGATORIO)
- [ ] Auditar strings hardcoded por componente (`detect-hardcoded-strings-by-component.js`)
- [ ] Crear namespaces por componente: `components.{componentName}` (EN/ES)
- [ ] Adaptar código a `useTranslation()` componente por componente
- [ ] Validar TODOS los componentes (incluyendo subcomponentes)
- [ ] Validar sidebar deployment
- [ ] Validar existencia de traducciones (`validate-i18n-keys.js`)
- [ ] Detectar claves faltantes (`detect-missing-i18n-keys.js`)
- [ ] Probar en ambos idiomas (EN/ES)

### Registro
- [ ] Registrar en `module-registry.ts`
- [ ] Documentar en session report

### Validación Final
- [ ] Build exitoso
- [ ] Validar rutas
- [ ] Validar assets
- [ ] Validar i18n final
- [ ] Prueba funcional completa

---

## 🚨 Errores Comunes y Soluciones

### Error 1: "Class extends value undefined"

**Causa:** Server Component importando Client Component

**Solución:**
```tsx
// Agregar "use client" al page.tsx
"use client";
```

### Error 2: "Objects are not valid as a React child"

**Causa 1:** React version mismatch
- **Solución:** Ejecutar `validate-react-versions.js` y corregir

**Causa 2:** Falta `asChild` prop
- **Solución:** Agregar `asChild` a `SidebarMenuButton`

### Error 3: Claves visibles en UI

**Causa:** Clave no existe en JSON

**Solución:**
1. Ejecutar `detect-missing-i18n-keys.js`
2. Agregar claves faltantes a AMBOS JSON (EN/ES)
3. Verificar formato de parámetros (`{{param}}`)

### Error 4: Strings en inglés cuando está en español

**Causa 1:** Componente no usa `useTranslation()`
- **Solución:** Adaptar componente a i18n

**Causa 2:** Valor en ES está en inglés
- **Solución:** Traducir valor en ES JSON

### Error 5: Assets no se cargan

**Causa:** Ruta relativa incorrecta

**Solución:**
```typescript
// Cambiar de relativa a absoluta
src="/assets/images/avatars/user-default.png"
```

---

## 📚 Referencias

### Documentos Relacionados

- **i18n Protocol:** `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md` ⭐
- **"use client" Protocol:** `docs/architecture/BUNDUI_MIGRATION_USE_CLIENT_PROTOCOL.md` ⭐
- **Module Registry:** `docs/architecture/MODULE_REGISTRY_PROTOCOL.md` ⭐
- **Assets Policy:** `docs/architecture/ASSETS_REPOSITORY_POLICY.md` ⭐
- **Component Namespace Strategy:** `docs/architecture/I18N_COMPONENT_NAMESPACE_STRATEGY.md` ⭐ **NUEVO** - Estrategia de namespaces por componente
- **Bundui Premium Migration:** `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING.md` ⭐
- **React Compatibility:** `docs/TROUBLESHOOTING.md` (sección React 18 vs 19)
- **Regional Configuration:** `docs/architecture/LOCALE.md`

### Scripts de Validación

- `scripts/validate-react-versions.js` - Validar React versions
- `scripts/validate-i18n-keys.js` - Validar claves i18n
- `scripts/detect-missing-i18n-keys.js` - Detectar claves faltantes
- `scripts/validate-assets-duplicates.js` - Validar assets duplicados
- `scripts/validate-assets-in-repo.js` - Validar assets en repositorio
- `scripts/validate-dashboard-routes.js` - Validar rutas
- `scripts/fix-dashboard-imports.js` - Corregir imports automáticamente

---

## ✅ Estado del Protocolo

**Versión:** 1.0.0  
**Fecha:** 2025-12-20  
**Estado:** ✅ OBLIGATORIO  
**Aplicable a:** Todas las importaciones de módulos/componentes

**Última actualización:** 2025-12-20  
**Próxima revisión:** Cuando se identifique una nueva lección aprendida

---

**Este protocolo consolida TODAS las lecciones aprendidas. Es la fuente única de verdad para importaciones.**

