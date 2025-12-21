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

## 📊 Niveles de Traducción (SIEMPRE VALIDAR)

**⚠️ IMPORTANTE:** El sistema de traducción tiene múltiples niveles que DEBEN validarse:

### Nivel 1: Dashboard General / Generalidades
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

### Nivel 2: Módulos Específicos
**Namespace:** `[module-name]` (ej: `hotel`, `crm`, `finance`)
- Strings específicos del módulo
- Componentes del módulo
- Formularios del módulo
- Mensajes del módulo

**Ejemplos:**
- `hotel.title`
- `hotel.components.statCards.titles.todayCheckIn`
- `crm.components.contactsTable.headers.name`

### Nivel 3: Locales y Regionales
**Sistema:** `@vibethink/utils` - Regional Configuration
- **Meses:** Enero, Febrero, Marzo... (formateo de fechas)
- **Días:** Lunes, Martes... (calendarios)
- **Formato de números:** Separadores, decimales (1,234.56 vs 1.234,56)
- **Monedas:** Símbolos y formato (USD: $1,234.56 vs EUR: 1.234,56 €)
- **Fechas:** Formato según locale (MM/dd/yyyy vs dd/MM/yyyy)
- **Horas:** Formato 12h/24h (3:45 PM vs 15:45)

**Documentación:** `docs/architecture/LOCALE.md`

---

## 🗂️ Estrategia de Namespaces por Componente (SubWorkspace)

**⚠️ IMPORTANTE:** Los strings deben organizarse por componente dentro del namespace del módulo.

### Organización por Componente

**Estructura:**
```
hotel (namespace principal)
├── components (subWorkspace de componentes)
│   ├── header
│   ├── statCards
│   ├── bookingList
│   ├── bookingsCard
│   ├── campaignOverview
│   ├── reservationsCard
│   ├── revenueStat
│   └── ...
├── formatters
├── status
└── ...
```

**Convención de nomenclatura:**
- Archivo: `revenue-stat.tsx` → Namespace: `components.revenueStat`
- Archivo: `booking-list.tsx` → Namespace: `components.bookingList`

### Validación Sistemática por Componente

**Protocolo:**
1. Listar TODOS los archivos `.tsx` del módulo
2. Para cada componente:
   - Identificar strings hardcoded
   - Crear namespace `components.{componentName}`
   - Agregar todas las claves a JSON (EN/ES)
   - Adaptar código a usar `t()`
3. Validar componente por componente

**Documentación completa:** `docs/architecture/I18N_COMPONENT_NAMESPACE_STRATEGY.md` ⭐

**⚠️ REGLA CRÍTICA:** 
- ✅ **Validar SIEMPRE los 3 niveles** durante importación
- ✅ **No asumir** que un nivel está completo sin validar
- ✅ **Documentar** qué nivel falta si se detecta

**Checklist de Niveles:**
- [ ] **Nivel 1 (General):** ¿El módulo usa strings comunes? ¿Están traducidos?
- [ ] **Nivel 2 (Módulo):** ¿Todos los strings del módulo están en su namespace?
- [ ] **Nivel 3 (Locale):** ¿Fechas, números, monedas usan configuración regional?

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
  
  **🚨 REGLAS CRÍTICAS:**
  - ✅ **Namespace como clave raíz:** El JSON DEBE tener el namespace como clave raíz: `{ "moduleName": { ... } }`
  - ✅ **Formato de parámetros:** Usar SIEMPRE `{{param}}` (doble llave) para parámetros
  - ❌ **NO usar:** `{param}` (llave simple) - aunque funciona, `{{param}}` es el estándar obligatorio
  - ✅ **Ejemplo de parámetros:**
    ```json
    {
      "moduleName": {
        "components": {
          "statCards": {
            "unitNumber": "Unit Number: {{number}}",
            "pagination": "Page {{current}} of {{total}}"
          }
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

- [ ] **Validar componente por componente (OBLIGATORIO):**
  ```bash
  # Auditar todos los componentes
  node scripts/detect-hardcoded-strings-by-component.js \
    --module apps/dashboard/app/dashboard-bundui/[module-name] \
    --namespace [module-name] \
    --all-components
  ```
  - [ ] Listar TODOS los archivos `.tsx` del módulo
  - [ ] Identificar namespace por componente: `components.{componentName}`
  - [ ] Auditar cada componente individualmente
  - [ ] Crear namespace completo para cada componente

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

- [ ] **🚨 Validar subcomponentes (CRÍTICO - NO OLVIDAR):**
  - [ ] Footer: Copyright, links, texto legal
  - [ ] Header: Título, breadcrumbs, acciones
  - [ ] Toolbar: Filtros, búsqueda, ordenamiento
  - [ ] **Sidebar: Navegación, menús, títulos** (CRÍTICO - ver sección específica)
  - [ ] Modales: Títulos, botones, mensajes
  - [ ] Formularios: Labels, placeholders, validaciones
  - [ ] **Cards/Tarjetas:** Títulos, labels, mensajes (ej: BookingsCard, ReservationsCard)
  - [ ] **Subpáginas:** Páginas anidadas (ej: `/hotel/bookings`) - metadata y componentes
  - [ ] **⚠️ VALIDAR TODOS:** Listar TODOS los archivos `.tsx` y verificar que CADA UNO usa `useTranslation()` si tiene texto visible
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
  - [ ] **Ejecutar script de validación (OBLIGATORIO):**
    ```bash
    node scripts/validate-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/module-name --namespace module-name
    ```
    - ✅ El script debe pasar sin errores
    - ⚠️ Si hay claves dinámicas, validarlas manualmente
  
  - [ ] **Ejecutar script de detección de claves faltantes (OBLIGATORIO):**
    ```bash
    node scripts/detect-missing-i18n-keys.js --module apps/dashboard/app/dashboard-bundui/module-name --namespace module-name
    ```
    - ✅ Este script compara claves del código vs JSON y muestra las faltantes
    - ✅ Genera reporte con las claves que DEBEN agregarse
    - ✅ **Detecta valores en inglés dentro de traducciones en español** (ej: "3 nights" en ES)
    - ✅ Detecta valores idénticos en EN/ES (posiblemente no traducidos)
    - ✅ Ayuda a identificar claves que aparecen visibles en UI (ej: `hotel.roomTypes.deluxe`)
  
  - [ ] **🚨 Documentar y agregar claves faltantes INMEDIATAMENTE:**
    - Si falta alguna clave, NO dejar para después
    - Agregar a AMBOS JSON (EN/ES) antes de marcar como completo
    - **Regla crítica:** No dejar claves faltantes (causa que aparezcan visibles en la UI como `namespace.key.path`)
    - Si aparecen claves visibles (ej: `hotel.roomTypes.deluxe`), significa que la clave NO existe en el JSON
  
  - [ ] **🚨 VALIDAR QUE VALORES EN ES ESTÁN TRADUCIDOS (CRÍTICO):**
    - **NO copiar valores de EN a ES sin traducir**
    - **NO dejar palabras en inglés dentro de valores en español** (ej: "3 nights" debe ser "3 noches")
    - El script detecta automáticamente:
      - Palabras comunes en inglés: "nights", "check-in", "booking", "room", etc.
      - Patrones en inglés: "3 nights", "check-out", "total amount", etc.
    - **Si el script reporta valores en inglés en ES:**
      - Traducir INMEDIATAMENTE
      - Verificar que el valor tiene sentido en español
      - Probar en UI que se muestra correctamente

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

### Script de Detección de Claves Faltantes (RECOMENDADO)

**🚨 ÚTIL:** Este script detecta claves que aparecen visibles en la UI (no traducidas).

```bash
# Detectar claves faltantes (más detallado)
node scripts/detect-missing-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --namespace hotel
```

**Output esperado:**
```
✅ Todas las claves usadas en el código existen en ambos idiomas.
```

**Si hay claves faltantes:**
```
❌ 3 claves FALTANTES en EN:
   - hotel.roomTypes.deluxe
   - hotel.roomTypes.standard
   - hotel.roomTypes.suite

📝 Claves faltantes que DEBEN agregarse al JSON:
EN JSON:
  "roomTypes.deluxe": "Deluxe",
  "roomTypes.standard": "Standard",
  "roomTypes.suite": "Suite",
```

**Ventajas:**
- Muestra exactamente qué claves faltan
- Genera código listo para copiar/pegar en JSON
- Detecta claves no usadas (potencialmente sin usar)
- Más detallado que `validate-i18n-keys.js`

**Cuándo usar:**
- Si ves claves visibles en UI (ej: `hotel.roomTypes.deluxe`)
- Después de adaptar componentes a i18n
- Para verificar que todas las claves existen antes de commit

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

## 🐛 Troubleshooting: Problemas Comunes

### Problema 4: Componentes siguen en inglés después de cambiar idioma

**Síntomas:**
- Al cambiar a español, algunos componentes siguen mostrando texto en inglés
- Ejemplos: "Bookings", "Online Booking", "Unlock in-depth analysis with a premium subscription"

**Causas:**

1. **Componente NO usa `useTranslation()`:**
   ```typescript
   // ❌ INCORRECTO - Componente sin i18n
   export function BookingsCard() {
     return <CardTitle>Bookings</CardTitle>; // Hardcoded en inglés
   }
   
   // ✅ CORRECTO - Componente con i18n
   export function BookingsCard() {
     const { t } = useTranslation('hotel');
     return <CardTitle>{t('components.bookingsCard.title')}</CardTitle>;
   }
   ```

2. **Strings hardcoded en el código:**
   - Texto directamente en JSX sin usar `t()`
   - Metadata hardcoded en `generateMetadata()`
   - Mensajes de error/success hardcoded

3. **Componentes subordinados no validados:**
   - Se adaptaron los componentes principales pero se olvidaron los subordinados
   - Ejemplo: Se adaptó `booking-list.tsx` pero no `bookings-card.tsx`

**Detección:**

```bash
# Buscar componentes que NO usan useTranslation
grep -L "useTranslation" apps/dashboard/app/dashboard-bundui/module-name/**/*.tsx

# Buscar strings hardcoded (aproximado)
grep -r "['\"]Bookings['\"]" apps/dashboard/app/dashboard-bundui/module-name/ --include="*.tsx"
```

**Solución:**

1. **Identificar todos los componentes del módulo:**
   ```bash
   find apps/dashboard/app/dashboard-bundui/module-name -name "*.tsx" -type f
   ```

2. **Verificar que CADA componente usa `useTranslation()`:**
   - Si el componente tiene texto visible, DEBE usar `useTranslation()`
   - Excepciones: Componentes puramente visuales sin texto

3. **Adaptar TODOS los componentes:**
   - No dejar componentes "para después"
   - Incluir subcomponentes (cards, forms, tables, etc.)
   - Incluir metadata (`generateMetadata()`)

4. **Validar en ambos idiomas:**
   - Cambiar idioma en la UI
   - Verificar que TODOS los textos cambian
   - Si algún texto sigue en inglés, buscar el componente y adaptarlo

**Regla crítica:**
- ✅ **TODOS los componentes con texto visible DEBEN usar `useTranslation()`**
- ❌ **NO dejar componentes "para después"** - hacerlo durante la importación
- ✅ **Validar TODOS los componentes del módulo, no solo los principales**

**Checklist de validación:**
- [ ] Listar TODOS los archivos `.tsx` del módulo
- [ ] Verificar que cada componente con texto usa `useTranslation()`
- [ ] Verificar metadata (`generateMetadata()`) usa i18n
- [ ] Probar en ambos idiomas y verificar que TODO cambia
- [ ] Si algún texto sigue en inglés, adaptar el componente inmediatamente

**Para más problemas comunes:** Ver secciones anteriores (Problema 1, 2, 3) en este mismo documento.

### Problema 5: Datos Mock con Strings Hardcoded

**Síntomas:**
- Strings visibles en inglés en la UI (ej: "Room 101", "3 nights", "June 19, 2028")
- Datos mock con valores hardcoded que se muestran directamente
- Fechas, números, y otros valores no traducidos

**Causas:**

1. **Datos mock con strings hardcoded:**
   ```typescript
   // ❌ INCORRECTO - Datos mock con strings hardcoded
   const bookings = [
     {
       roomNumber: "Room 101",
       duration: "3 nights",
       checkIn: "June 19, 2028"
     }
   ];
   
   // Se muestra directamente
   <span>{row.getValue("roomNumber")}</span> // "Room 101" en inglés
   ```

2. **Formateo directo sin i18n:**
   - Números, fechas, y otros valores formateados sin considerar locale
   - Valores que deberían traducirse mostrados directamente

**Solución:**

1. **Formatear datos mock en el componente:**
   ```typescript
   // ✅ CORRECTO - Formatear usando i18n
   cell: ({ row }) => {
     const roomNumber = row.getValue("roomNumber") as string;
     const roomMatch = roomNumber.match(/\d+/);
     if (roomMatch) {
       return (
         <span>{t('formatters.roomNumber', { number: roomMatch[0] })}</span>
       );
     }
     return <span>{roomNumber}</span>;
   }
   ```

2. **Crear helpers de formateo:**
   ```typescript
   // ✅ CORRECTO - Helper para formatear duración
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

3. **Usar formateo regional para fechas y números:**
   ```typescript
   // ✅ CORRECTO - Usar formateo regional
   import { formatDateRegional, formatNumberRegional } from '@vibethink/utils';
   
   // En producción, los datos vendrían como Date objects
   const formattedDate = formatDateRegional(row.original.checkIn, {
     dateStyle: 'medium'
   });
   ```

4. **Agregar formatters al namespace:**
   ```json
   {
     "hotel": {
       "formatters": {
         "roomNumber": "Room {{number}}",
         "nights": "{{count}} night",
         "nightsPlural": "{{count}} nights"
       }
     }
   }
   ```

**Regla crítica:**
- ✅ **Validar datos mock** durante importación
- ✅ **Formatear valores** usando i18n cuando sea posible
- ✅ **Documentar** que datos mock deberían ser reemplazados por datos reales en producción
- ✅ **Usar helpers** de formateo para valores comunes (roomNumber, duration, etc.)

**Checklist de validación para datos mock:**
- [ ] ¿Hay strings hardcoded en datos mock? → Formatear en componente
- [ ] ¿Hay fechas hardcoded? → Usar formateo regional cuando sea posible
- [ ] ¿Hay números hardcoded? → Usar formateo regional
- [ ] ¿Hay valores que deberían traducirse? → Agregar formatters al namespace

**Nota:** En producción, los datos vendrían desde una API y ya estarían en el formato correcto. Los datos mock son temporales, pero aún así deben formatearse correctamente para evitar confusión durante desarrollo y pruebas.

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

