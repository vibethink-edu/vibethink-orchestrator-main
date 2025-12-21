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
  - [ ] Sidebar: Navegación, menús
  - [ ] Modales: Títulos, botones, mensajes
  - [ ] Formularios: Labels, placeholders, validaciones

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

- [ ] **Probar en ambos idiomas:**
  - [ ] Cambiar idioma en la UI
  - [ ] Verificar que todos los strings cambian
  - [ ] Verificar que no quedan strings en inglés cuando está en español

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

#### Sidebar Component
```typescript
// ✅ VALIDAR:
- Título de secciones
- Items de navegación
- Badges y contadores
- Tooltips en collapsed mode
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
- [ ] **Prueba en ambos idiomas** exitosa
- [ ] **Module Registry actualizado:**
  ```typescript
  {
    i18nNamespace: "module-name",
    i18nCoverage: 100, // o porcentaje actual
    adaptations: {
      i18n: [
        "Todos los strings principales traducidos",
        "Subcomponentes (header, footer, toolbar) validados",
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

