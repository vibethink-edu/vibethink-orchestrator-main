# Validación i18n Durante Importación - Protocolo Obligatorio

**Fecha:** 2025-12-20  
**Estado:** ✅ OBLIGATORIO - Parte del protocolo de migración estándar  
**Propósito:** Validar y preparar i18n durante la importación para evitar trabajo masivo posterior

---

## 🚨 REGLA CRÍTICA

**NO importar módulos sin validación i18n completa. Esto incluye:**

- ✅ Validar menús y opciones principales
- ✅ Validar subcomponentes (footers, headers, bars, toolbars)
- ✅ Identificar todos los strings hardcoded
- ✅ Crear namespace i18n durante la importación
- ✅ Documentar strings pendientes de traducción

**Hacer esto masivamente después es ineficiente y genera deuda técnica.**

---

## 📋 Checklist de Validación i18n Durante Importación

### Fase 1: Análisis Pre-Importación

**Antes de copiar cualquier archivo:**

- [ ] **Identificar scope completo del módulo:**
  ```bash
  # Listar todos los archivos del módulo a importar
  find source/module -type f -name "*.tsx" -o -name "*.ts" | grep -v node_modules
  ```

- [ ] **Identificar componentes principales y subcomponentes:**
  - Componentes de página principal
  - Componentes compartidos
  - Subcomponentes (headers, footers, toolbars, sidebars)
  - Modales y diálogos
  - Formularios
  - Tablas y listas

- [ ] **Contar strings hardcoded aproximadamente:**
  ```bash
  # Buscar strings entre comillas (aproximado)
  grep -r "['\"].*[a-zA-Z]{3,}.*['\"]" source/module --include="*.tsx" | wc -l
  ```

### Fase 2: Auditar Strings Hardcoded

**Usar script automatizado o búsqueda manual:**

- [ ] **Ejecutar auditoría de strings:**
  ```bash
  node scripts/audit-hardcoded-text.js --module path/to/module --output i18n-audit.json
  ```

- [ ] **Categorizar strings encontrados:**
  - **Labels principales:** Títulos, headers, nombres de secciones
  - **Labels de navegación:** Menús, breadcrumbs, tabs
  - **Labels de UI:** Botones, placeholders, tooltips
  - **Mensajes:** Errors, success, info, warnings
  - **Formularios:** Labels, validaciones, ayuda
  - **Tablas:** Headers, acciones, estados
  - **Footers/Headers:** Texto de barras superior/inferior
  - **Toolbars:** Acciones, filtros, búsquedas

### Fase 3: Crear Namespace i18n

**Durante la importación, NO después:**

- [ ] **Crear archivos de namespace:**
  ```bash
  apps/dashboard/src/lib/i18n/translations/en/module-name.json
  apps/dashboard/src/lib/i18n/translations/es/module-name.json
  ```

- [ ] **Estructurar namespace por categorías:**
  ```json
  {
    "moduleName": {
      "title": "Module Title",
      "navigation": {
        "dashboard": "Dashboard",
        "settings": "Settings"
      },
      "components": {
        "header": {
          "title": "Header Title",
          "actions": {
            "save": "Save",
            "cancel": "Cancel"
          }
        },
        "footer": {
          "copyright": "Copyright",
          "links": {
            "privacy": "Privacy",
            "terms": "Terms"
          }
        },
        "toolbar": {
          "search": "Search",
          "filter": "Filter",
          "sort": "Sort"
        }
      },
      "forms": {
        "labels": {},
        "placeholders": {},
        "validation": {}
      },
      "messages": {
        "success": {},
        "error": {},
        "info": {}
      }
    }
  }
  ```

### Fase 4: Registrar Strings Identificados

**Documentar todos los strings encontrados:**

- [ ] **Crear lista completa de strings:**
  - [ ] Strings de componentes principales
  - [ ] Strings de subcomponentes (headers, footers, toolbars)
  - [ ] Strings de formularios
  - [ ] Strings de mensajes
  - [ ] Strings de validación
  - [ ] Strings de estados

- [ ] **Estimar cobertura i18n:**
  ```typescript
  // En module-registry.ts
  {
    // ...
    i18nNamespace: "module-name",
    i18nCoverage: 0, // 0-100, actualizar según progreso
    i18nStatus: {
      total: 150,        // Total de strings identificados
      translated: 0,     // Strings traducidos
      pending: 150,      // Strings pendientes
      categories: {
        navigation: 10,
        components: 50,
        forms: 30,
        messages: 40,
        validation: 20
      }
    }
  }
  ```

### Fase 5: Adaptar Código Durante Importación

**NO dejar para después - hacer durante la migración:**

- [ ] **Reemplazar strings hardcoded con `useTranslation()`:**
  ```typescript
  // ❌ ANTES (hardcoded)
  <h1>Hotel Management</h1>
  <Button>Save</Button>

  // ✅ DESPUÉS (i18n)
  const { t } = useTranslation('hotel');
  <h1>{t('title')}</h1>
  <Button>{t('components.header.actions.save')}</Button>
  ```

- [ ] **Validar subcomponentes:**
  - [ ] Footer: Copyright, links, texto legal
  - [ ] Header: Título, breadcrumbs, acciones
  - [ ] Toolbar: Filtros, búsqueda, ordenamiento
  - [ ] **Sidebar: Navegación, menús, títulos** (CRÍTICO - ver sección específica)
  - [ ] Modales: Títulos, botones, mensajes
  - [ ] Formularios: Labels, placeholders, validaciones
- [ ] **🚨 VALIDAR DESPLIEGUE EN SIDEBAR:**
  - [ ] Agregar módulo a `bundui-nav-items.ts` (si es dashboard-bundui)
  - [ ] Agregar módulo a `nav-main.tsx` (si es dashboard-bundui)
  - [ ] Verificar títulos del sidebar (deben ser traducibles)
  - [ ] Verificar subopciones/rutas del sidebar
  - [ ] Si el sidebar usa títulos hardcoded, documentar para migración futura
- [ ] **🚨 VALIDAR EXISTENCIA DE TRADUCCIONES (OBLIGATORIO):**
  - [ ] **Extraer TODAS las claves usadas en el código:**
    ```bash
    # Buscar todos los t('...') en el módulo
    grep -r "t\('.*'\)" apps/dashboard/app/dashboard-bundui/module-name/
    grep -r 't\(".*"\)' apps/dashboard/app/dashboard-bundui/module-name/
    grep -r 't\(`.*`\)' apps/dashboard/app/dashboard-bundui/module-name/
    ```
  - [ ] **Verificar que CADA clave existe en AMBOS JSON (EN/ES):**
    - [ ] Todas las claves usadas en `t('key')` deben existir en `en/module-name.json`
    - [ ] Todas las claves usadas en `t('key')` deben existir en `es/module-name.json`
    - [ ] Verificar claves dinámicas (ej: `t(\`key.${variable}\`)`)
    - [ ] Verificar parámetros (ej: `t('key', { param: value })`)
  - [ ] **Formato de validación:**
    - Clave en código: `t('components.statCards.titles.todayCheckIn')`
    - Debe existir en JSON: `hotel.components.statCards.titles.todayCheckIn` (el namespace se agrega automáticamente)
    - **IMPORTANTE:** `useTranslation('hotel')` agrega el prefijo `hotel.`, entonces:
      - Código: `t('components.statCards.titles.todayCheckIn')`
      - JSON debe tener: `hotel.components.statCards.titles.todayCheckIn` ✅
  - [ ] **🚨 VALIDAR FORMATO DE PARÁMETROS (CRÍTICO):**
    - **Formato correcto en JSON:** `{{param}}` (doble llave)
    - **Ejemplo:** `"unitNumber": "Unit Number: {{number}}"`
    - **Uso en código:** `t('components.statCards.unitNumber', { number: item.unitNumber })`
    - **⚠️ NO usar:** `{param}` (llave simple) - no funciona con el sistema actual
    - **Validar que:**
      - [ ] Todos los parámetros en JSON usan formato `{{param}}`
      - [ ] El código pasa los parámetros correctamente: `{ param: value }`
      - [ ] Probar que los parámetros se reemplazan correctamente en la UI
  - [ ] **Validar claves dinámicas:**
    - Si usas `t(\`key.${variable}\`)` o `t('key.' + variable)`:
      - [ ] Verificar que TODOS los valores posibles de `variable` existen en el JSON
      - [ ] Ejemplo: `t(\`components.statCards.titles.${item.key}\`)` donde `item.key` puede ser `todayCheckIn`, `todayCheckOut`, etc.
      - [ ] Validar que `hotel.components.statCards.titles.todayCheckIn`, `hotel.components.statCards.titles.todayCheckOut`, etc. existen
    - **Documentar** claves dinámicas en el reporte de validación
  - [ ] **Ejecutar script de validación:**
    ```bash
    node scripts/validate-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/module-name --namespace module-name
    ```
    - ✅ El script debe pasar sin errores
    - ⚠️ Si hay claves dinámicas, validarlas manualmente
  - [ ] **Documentar claves faltantes:**
    - Si falta alguna clave, documentarla y agregarla a ambos JSON antes de marcar como completo
    - No dejar claves faltantes (causa errores en runtime - las claves aparecen visibles en la UI)

### Fase 6: Validación Completa

**Antes de marcar el módulo como "complete":**

- [ ] **Ejecutar validación automatizada:**
  ```bash
  node scripts/audit-hardcoded-text.js --module path/to/module --strict
  ```

- [ ] **Verificar que no quedan strings hardcoded críticos:**
  - [ ] Navegación
  - [ ] Labels principales
  - [ ] Acciones (botones)
  - [ ] Mensajes de error/success
  - [ ] Headers/Footers visibles

- [ ] **🚨 VALIDAR EXISTENCIA DE TODAS LAS TRADUCCIONES (ANTES DE PROBAR):**
  - [ ] **Ejecutar script de validación (OBLIGATORIO):**
    ```bash
    node scripts/validate-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/module-name --namespace module-name
    ```
  - [ ] **El script debe pasar sin errores:**
    - ✅ "Validación exitosa: Todas las claves existen en ambos idiomas"
    - ❌ Si hay errores: Agregar claves faltantes a ambos JSON y ejecutar nuevamente
  - [ ] **Validar claves dinámicas manualmente:**
    - Si el script reporta claves dinámicas (ej: `components.statCards.titles.*`):
      - [ ] Identificar todos los valores posibles de la variable
      - [ ] Verificar que cada valor existe en el JSON
      - [ ] Ejemplo: Si `item.key` puede ser `todayCheckIn`, `todayCheckOut`, `totalGuests`, `totalAmount`:
        - [ ] Verificar `hotel.components.statCards.titles.todayCheckIn` existe ✅
        - [ ] Verificar `hotel.components.statCards.titles.todayCheckOut` existe ✅
        - [ ] Verificar `hotel.components.statCards.titles.totalGuests` existe ✅
        - [ ] Verificar `hotel.components.statCards.titles.totalAmount` existe ✅
  - [ ] **Formato correcto:**
    - ✅ `useTranslation('hotel')` → `t('components.statCards.titles.todayCheckIn')` → busca `hotel.components.statCards.titles.todayCheckIn` en JSON
    - ❌ Clave faltante → La clave aparece visible en la UI (ej: `hotel.components.statCards.titles.missingKey`) → Agregar al JSON
  - [ ] **Regla crítica:**
    - **TODAS las claves usadas en `t('...')` DEBEN existir en AMBOS JSON (EN/ES)**
    - **Ninguna clave puede estar faltante** - esto causa que las claves aparezcan visibles en la UI en lugar del texto traducido
- [ ] **🚨 PROBAR EN AMBOS IDIOMAS (EN/ES):**
  - [ ] Cambiar idioma en la UI (usar LocaleSelector)
  - [ ] Verificar que todos los strings cambian en la página principal
  - [ ] Verificar que todos los strings cambian en subcomponentes
  - [ ] **Verificar que NO aparecen claves de traducción** (ej: `hotel.components.statCards.titles.todayCheckIn` visible)
  - [ ] **Verificar sidebar en ambos idiomas:**
    - [ ] Título del módulo en sidebar cambia según idioma
    - [ ] Subopciones del sidebar cambian según idioma
    - [ ] Tooltips (si aplica) cambian según idioma
  - [ ] Verificar navegación (breadcrumbs, tabs) en ambos idiomas
  - [ ] Verificar que no quedan strings en inglés cuando está en español
  - [ ] Verificar que no quedan strings en español cuando está en inglés

---

## 📊 Estructura de Validación por Tipo de Componente

### Componentes Principales

```typescript
// ✅ VALIDAR:
- Título de la página
- Descripción/secciones principales
- Navegación principal
- Breadcrumbs
- Tab navigation
```

### Subcomponentes (CRÍTICO - No olvidar)

#### Header Component
```typescript
// ✅ VALIDAR:
- Título del header
- Breadcrumbs
- Botones de acción (Save, Cancel, etc.)
- Badges y status indicators
- Tooltips
```

#### Footer Component
```typescript
// ✅ VALIDAR:
- Copyright text
- Links (Privacy, Terms, etc.)
- Información de contacto
- Texto legal
- Links de redes sociales
```

#### Toolbar Component
```typescript
// ✅ VALIDAR:
- Placeholder de búsqueda
- Labels de filtros
- Botones de ordenamiento
- Labels de vista (Grid, List)
- Acciones en masa (Bulk actions)
```

#### Sidebar Component (CRÍTICO - Despliegue en Navegación)
```typescript
// ✅ VALIDAR:
- Título de secciones
- Items de navegación
- Badges y contadores
- Tooltips en collapsed mode

// 🚨 VALIDACIÓN ESPECÍFICA DEL SIDEBAR:
- [ ] Módulo agregado a bundui-nav-items.ts (si aplica)
- [ ] Módulo agregado a nav-main.tsx (si aplica)
- [ ] Título del módulo en sidebar (verificar si usa i18n o está hardcoded)
- [ ] Subopciones/rutas del sidebar traducidas
- [ ] Verificar en ambos idiomas (EN/ES) que el sidebar muestra correctamente
- [ ] Si el sidebar usa títulos hardcoded, documentar para migración futura
```

#### Modal/Dialog Components
```typescript
// ✅ VALIDAR:
- Título del modal
- Descripción/explicación
- Labels de formulario
- Botones (Confirm, Cancel, Close)
- Mensajes de validación
```

#### Form Components
```typescript
// ✅ VALIDAR:
- Labels de campos
- Placeholders
- Help text
- Mensajes de validación
- Botones de submit
- Labels de checkboxes/radios
```

#### Table Components
```typescript
// ✅ VALIDAR:
- Headers de columnas
- Acciones (Edit, Delete, etc.)
- Estados (Active, Inactive, etc.)
- Empty states
- Pagination labels
```

---

## 🔧 Scripts de Validación

### Script de Validación de Claves (OBLIGATORIO)

**🚨 CRÍTICO:** Este script valida que TODAS las claves usadas en el código existan en los JSON.

```bash
# Validar que todas las claves existen
node scripts/validate-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --namespace hotel
```

**Output esperado:**
```
✅ Validación exitosa: Todas las claves existen en ambos idiomas.
```

**Si hay errores:**
```
❌ Validación fallida: Hay claves faltantes o inválidas.
   - hotel.components.statCards.titles.missingKey
```

### Script Básico de Auditoría

```bash
# scripts/audit-module-i18n.js
node scripts/audit-module-i18n.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --output docs/sessions/HOTEL_I18N_AUDIT.json
```

### Output Esperado

```json
{
  "module": "hotel",
  "totalStrings": 150,
  "hardcoded": 150,
  "translated": 0,
  "coverage": 0,
  "categories": {
    "navigation": {
      "total": 10,
      "hardcoded": 10,
      "strings": ["Dashboard", "Bookings", ...]
    },
    "header": {
      "total": 8,
      "hardcoded": 8,
      "strings": ["Hotel Management", "Save", "Cancel", ...]
    },
    "footer": {
      "total": 5,
      "hardcoded": 5,
      "strings": ["Copyright", "Privacy", "Terms", ...]
    },
    "toolbar": {
      "total": 12,
      "hardcoded": 12,
      "strings": ["Search", "Filter", "Sort", ...]
    },
    "forms": {
      "total": 30,
      "hardcoded": 30,
      "strings": [...]
    },
    "messages": {
      "total": 40,
      "hardcoded": 40,
      "strings": [...]
    }
  }
}
```

---

## 📝 Template de Namespace i18n Estructurado

```json
{
  "moduleName": {
    "title": "Module Title",
    "description": "Module description",
    
    "navigation": {
      "dashboard": "Dashboard",
      "settings": "Settings",
      "reports": "Reports"
    },
    
    "sidebar": {
      "title": "Module Name",  // Título que aparece en el sidebar
      "subOptions": {
        "dashboard": "Dashboard",
        "bookings": "Bookings",
        "settings": "Settings"
      },
      "tooltips": {
        "collapsed": "Module Name"  // Tooltip cuando sidebar está colapsado
      }
    },
    
    "components": {
      "header": {
        "title": "Header Title",
        "breadcrumbs": {
          "home": "Home",
          "module": "Module"
        },
        "actions": {
          "save": "Save",
          "cancel": "Cancel",
          "delete": "Delete",
          "edit": "Edit"
        }
      },
      
      "footer": {
        "copyright": "© 2025 Company. All rights reserved.",
        "links": {
          "privacy": "Privacy Policy",
          "terms": "Terms of Service",
          "support": "Support"
        }
      },
      
      "toolbar": {
        "search": {
          "placeholder": "Search...",
          "label": "Search"
        },
        "filter": {
          "label": "Filter",
          "clear": "Clear filters"
        },
        "sort": {
          "label": "Sort by",
          "asc": "Ascending",
          "desc": "Descending"
        },
        "view": {
          "grid": "Grid View",
          "list": "List View"
        }
      },
      
      "sidebar": {
        "sections": {
          "main": "Main",
          "settings": "Settings"
        },
        "items": {}
      }
    },
    
    "forms": {
      "labels": {},
      "placeholders": {},
      "validation": {},
      "help": {}
    },
    
    "tables": {
      "headers": {},
      "actions": {},
      "empty": "No data available",
      "pagination": {}
    },
    
    "messages": {
      "success": {},
      "error": {},
      "info": {},
      "warning": {}
    }
  }
}
```

---

## ✅ Checklist Final de Validación i18n

### Antes de Marcar Módulo como "Complete"

- [ ] **Namespace creado** (EN/ES)
- [ ] **Strings principales traducidos** (títulos, navegación)
- [ ] **Subcomponentes validados:**
  - [ ] Header
  - [ ] Footer
  - [ ] Toolbar
  - [ ] Sidebar (si aplica)
  - [ ] Modales
- [ ] **Formularios validados** (si aplica)
- [ ] **Mensajes críticos traducidos** (error, success)
- [ ] **Código adaptado** con `useTranslation()`
- [ ] **🚨 DESPLIEGUE EN SIDEBAR VALIDADO:**
  - [ ] Módulo agregado a `bundui-nav-items.ts` o `nav-main.tsx`
  - [ ] Títulos del sidebar traducidos (usar i18n si aplica)
  - [ ] Subopciones/rutas del sidebar traducidas
  - [ ] Verificado en ambos idiomas (EN/ES) en el sidebar
  - [ ] Tooltips del sidebar traducidos (si aplica)
- [ ] **🚨 VALIDACIÓN DE IDIOMAS:**
  - [ ] Probar en inglés (EN) - todos los strings visibles
  - [ ] Probar en español (ES) - todos los strings traducidos
  - [ ] Verificar que no quedan strings hardcoded en inglés cuando está en español
  - [ ] Verificar sidebar en ambos idiomas
  - [ ] Verificar navegación en ambos idiomas
- [ ] **Module Registry actualizado:**
  ```typescript
  {
    i18nNamespace: "module-name",
    i18nCoverage: 100, // o porcentaje actual
    i18nStatus: {
      total: 210,
      translated: 210,
      pending: 0,
      categories: {
        navigation: 10,
        sidebar: 5,  // Títulos y opciones del sidebar
        // ...
      }
    },
    adaptations: {
      i18n: [
        "Todos los strings principales traducidos",
        "Subcomponentes (header, footer, toolbar) validados",
        "Sidebar con títulos traducidos",
        "Namespace estructurado por categorías"
      ]
    }
  }
  ```

---

## 🎯 Beneficios de Validar Durante Importación

1. **Eficiencia:** No repetir trabajo masivamente después
2. **Calidad:** Módulos llegan completos desde el inicio
3. **Consistencia:** Mismo proceso para todos los módulos
4. **Documentación:** Strings identificados desde el principio
5. **Reducción de deuda técnica:** No acumular trabajo pendiente

---

## 📚 Referencias

- **Module Registry Protocol:** `docs/architecture/MODULE_REGISTRY_PROTOCOL.md`
- **Bundui Premium Migration:** `docs/architecture/BUNDUI_PREMIUM_MIGRATION.md`
- **i18n Strategy:** `docs/architecture/I18N_STRATEGY.md`
- **Script de Auditoría:** `scripts/audit-hardcoded-text.js`

---

**Última actualización:** 2025-12-20  
**Regla:** Este proceso es OBLIGATORIO durante toda importación de módulos

