# Estrategia de Namespaces i18n por Componente (SubWorkspace)

**Fecha:** 2025-12-20  
**Estado:** ✅ OBLIGATORIO - Parte del protocolo de migración estándar  
**Propósito:** Organizar traducciones por componente dentro del módulo para facilitar mantenimiento y validación

---

## 🎯 Objetivo

Crear un sistema organizado de namespaces i18n que:
- ✅ Organice traducciones por componente (subWorkspace)
- ✅ Facilite la detección de strings hardcoded
- ✅ Permita validación sistemática
- ✅ Evite que strings se queden sin traducir

---

## 📊 Estructura de Namespaces por Componente

### Organización Jerárquica

```
hotel (namespace principal del módulo)
├── components (subWorkspace de componentes)
│   ├── header
│   ├── statCards
│   ├── bookingList
│   ├── bookingsCard
│   ├── campaignOverview
│   ├── reservationsCard
│   ├── revenueStat
│   ├── bookingForm
│   └── meetingRoomSchedule
├── navigation
├── sidebar
├── status
├── roomTypes
├── formatters
└── messages
```

### Ejemplo de Estructura JSON

```json
{
  "hotel": {
    "title": "Hotel Management",
    
    "components": {
      "header": {
        "title": "Hotel Management",
        "actions": {
          "addNew": "Add New",
          "reports": "Reports"
        }
      },
      "statCards": {
        "titles": {
          "todayCheckIn": "Today's check-in",
          "todayCheckOut": "Today check-out"
        },
        "unitNumber": "Unit Number: {{number}}",
        "actions": {
          "viewDetails": "View Details",
          "export": "Export"
        }
      },
      "bookingList": {
        "title": "Bookings",
        "search": {
          "placeholder": "Search bookings..."
        },
        "table": {
          "headers": {
            "bookingId": "Booking ID",
            "guestName": "Guest Name"
          }
        }
      },
      "bookingsCard": {
        "title": "Bookings",
        "totalBookings": "Total Bookings"
      },
      "campaignOverview": {
        "title": "Campaign Overview",
        "booked": "Booked",
        "visited": "Visited"
      },
      "reservationsCard": {
        "title": "Reservations",
        "totalLabel": "Reservations"
      },
      "revenueStat": {
        "title": "Revenue Stat",
        "fromLastMonth": "from last month",
        "periods": {
          "weekly": "Weekly",
          "monthly": "Monthly",
          "yearly": "Yearly"
        },
        "chart": {
          "revenue": "Revenue",
          "projected": "Projected"
        }
      }
    },
    
    "formatters": {
      "roomNumber": "Room {{number}}",
      "nights": "{{count}} night",
      "nightsPlural": "{{count}} nights"
    },
    
    "status": {
      "checkedIn": "Checked-In",
      "pending": "Pending"
    }
  }
}
```

---

## 🔍 Estrategia de Detección Sistemática

### Fase 1: Identificación de Componentes

**Proceso:**
1. Listar TODOS los archivos `.tsx` del módulo
2. Identificar componente principal de cada archivo
3. Mapear archivo → componente → namespace

**Ejemplo:**
```
apps/dashboard/app/dashboard-bundui/hotel/
├── components/
│   ├── booking-list.tsx          → components.bookingList
│   ├── bookings-card.tsx         → components.bookingsCard
│   ├── campaign-overview.tsx     → components.campaignOverview
│   ├── reservations-card.tsx     → components.reservationsCard
│   ├── revenue-stat.tsx          → components.revenueStat
│   ├── stat-cards.tsx            → components.statCards
│   └── ...
└── bookings/
    └── components/
        ├── booking-form-sheet.tsx → components.bookingForm
        └── meeting-room-schedule.tsx → components.meetingRoomSchedule
```

### Fase 2: Detección de Strings Hardcoded

**Script mejorado:** `scripts/detect-hardcoded-strings-by-component.js`

**Características:**
- ✅ Detecta strings hardcoded por componente
- ✅ Sugiere namespace basado en nombre del archivo
- ✅ Reporta qué componente necesita traducción
- ✅ Genera estructura JSON sugerida

**Ejemplo de output:**
```json
{
  "component": "revenue-stat.tsx",
  "namespace": "components.revenueStat",
  "hardcodedStrings": [
    {
      "line": 137,
      "text": "Revenue Stat",
      "suggestedKey": "components.revenueStat.title"
    },
    {
      "line": 145,
      "text": "Weekly",
      "suggestedKey": "components.revenueStat.periods.weekly"
    },
    {
      "line": 160,
      "text": "from last month",
      "suggestedKey": "components.revenueStat.fromLastMonth"
    }
  ]
}
```

### Fase 3: Validación por Componente

**Checklist por componente:**
- [ ] ¿El componente usa `useTranslation()`?
- [ ] ¿Todos los strings visibles están traducidos?
- [ ] ¿El namespace del componente existe en JSON?
- [ ] ¿Todas las claves están en AMBOS idiomas (EN/ES)?

---

## 🛠️ Protocolo de Validación por Componente

### Paso 1: Auditar Componente

```bash
# Auditar un componente específico
node scripts/detect-hardcoded-strings-by-component.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --component revenue-stat.tsx \
  --namespace hotel
```

### Paso 2: Crear/Estructurar Namespace

**Si el namespace no existe:**
1. Crear estructura en ambos JSON (EN/ES)
2. Agregar todas las claves identificadas
3. Traducir todas las claves al español

**Si el namespace existe:**
1. Verificar que todas las claves necesarias existen
2. Agregar claves faltantes
3. Traducir claves nuevas

### Paso 3: Adaptar Código

```typescript
// ❌ ANTES
<CardTitle>Revenue Stat</CardTitle>
<SelectItem value="weekly">Weekly</SelectItem>
<span>from last month</span>

// ✅ DESPUÉS
const { t } = useTranslation('hotel');
<CardTitle>{t('components.revenueStat.title')}</CardTitle>
<SelectItem value="weekly">{t('components.revenueStat.periods.weekly')}</SelectItem>
<span>{t('components.revenueStat.fromLastMonth')}</span>
```

### Paso 4: Validar

```bash
# Validar que todas las claves existen
node scripts/validate-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --namespace hotel

# Validar componente específico
node scripts/detect-missing-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --component revenue-stat.tsx \
  --namespace hotel
```

---

## 📋 Convenciones de Nomenclatura

### Nombre de Componente → Namespace

**Regla:**
- Nombre del archivo (kebab-case) → Nombre de namespace (camelCase)
- Componente principal del archivo → `components.{componentName}`

**Ejemplos:**
- `revenue-stat.tsx` → `components.revenueStat`
- `booking-list.tsx` → `components.bookingList`
- `bookings-card.tsx` → `components.bookingsCard`
- `campaign-overview.tsx` → `components.campaignOverview`
- `stat-cards.tsx` → `components.statCards`

### Estructura Interna del Namespace

**Estructura estándar:**
```typescript
components.{componentName}: {
  title: string;                    // Título del componente (si aplica)
  // ... otras propiedades específicas del componente
  chart?: {                         // Si tiene gráficos
    [key: string]: string;
  };
  periods?: {                       // Si tiene períodos/tabs
    [key: string]: string;
  };
  table?: {                         // Si tiene tablas
    headers: { [key: string]: string };
    actions: { [key: string]: string };
  };
}
```

---

## 🔄 Workflow de Validación Sistemática

### 1. Auditar Módulo Completo

```bash
# Auditar todos los componentes del módulo
node scripts/detect-hardcoded-strings-by-component.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --namespace hotel \
  --all-components
```

**Output:** Reporte completo con todos los componentes y sus strings hardcoded.

### 2. Priorizar Componentes

**Orden sugerido:**
1. Componentes principales (`page.tsx`)
2. Componentes visibles en primera vista
3. Componentes de formularios
4. Componentes de tablas
5. Componentes de gráficos
6. Componentes auxiliares

### 3. Validar Componente por Componente

```bash
# Para cada componente identificado:
# 1. Auditar
node scripts/detect-hardcoded-strings-by-component.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --component {component-name}.tsx \
  --namespace hotel

# 2. Adaptar código (manual)

# 3. Validar
node scripts/validate-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --component {component-name}.tsx \
  --namespace hotel
```

### 4. Validación Final

```bash
# Validar módulo completo
node scripts/detect-missing-i18n-keys.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --namespace hotel
```

---

## 📝 Checklist de Validación por Componente

### Pre-Validación
- [ ] Componente identificado
- [ ] Namespace sugerido (`components.{componentName}`)
- [ ] Archivo JSON existe para el módulo

### Auditar
- [ ] Strings hardcoded identificados
- [ ] Claves sugeridas generadas
- [ ] Prioridad asignada (si hay múltiples componentes)

### Crear Namespace
- [ ] Estructura creada en EN JSON
- [ ] Estructura creada en ES JSON
- [ ] Todas las claves agregadas
- [ ] Todas las claves traducidas

### Adaptar Código
- [ ] `useTranslation()` agregado al componente
- [ ] Strings hardcoded reemplazados con `t()`
- [ ] Imports actualizados

### Validar
- [ ] Componente compila sin errores
- [ ] Todas las claves existen en JSON
- [ ] Probar en ambos idiomas (EN/ES)
- [ ] No hay strings visibles en inglés cuando está en español

---

## 🚨 Reglas Críticas

### Regla 1: Un Componente = Un Namespace

**✅ CORRECTO:**
- `revenue-stat.tsx` → `components.revenueStat`
- Todos los strings del componente en este namespace

**❌ INCORRECTO:**
- Strings del componente mezclados en otros namespaces
- Múltiples namespaces para un mismo componente

### Regla 2: Validar TODOS los Componentes

**✅ CORRECTO:**
- Validar componente por componente sistemáticamente
- No dejar componentes "para después"

**❌ INCORRECTO:**
- Validar solo componentes principales
- Dejar subcomponentes sin validar

### Regla 3: Namespace Completo desde el Inicio

**✅ CORRECTO:**
- Crear namespace completo con todas las claves necesarias
- Agregar todas las traducciones (EN/ES) juntas

**❌ INCORRECTO:**
- Crear namespace parcial
- Agregar traducciones incrementalmente

### Regla 4: Preloading de Namespaces Críticos (Initial View)

**✅ CORRECTO:**
- Agregar namespaces de componentes de "primera vista" (ej: Sidebar, Header, Dashboard Home) a `preloadNamespaces` en `I18nProvider`.
- Garantiza carga instantánea sin "flash" de claves crudas.

**❌ INCORRECTO:**
- Dejar namespaces críticos como lazy-loading.
- Usuario ve `projects.sections.projectsOverview` por milisegundos antes de cargar.

---

## 🎓 Ejemplos Prácticos

### Ejemplo 1: Revenue Stat Component

**Archivo:** `revenue-stat.tsx`  
**Namespace:** `components.revenueStat`

**Strings identificados:**
- "Revenue Stat" → `components.revenueStat.title`
- "Weekly" → `components.revenueStat.periods.weekly`
- "from last month" → `components.revenueStat.fromLastMonth`
- "Revenue" (chart) → `components.revenueStat.chart.revenue`
- "Projected" → `components.revenueStat.chart.projected`

**Estructura JSON:**
```json
{
  "hotel": {
    "components": {
      "revenueStat": {
        "title": "Revenue Stat",
        "fromLastMonth": "from last month",
        "periods": {
          "placeholder": "Select period",
          "weekly": "Weekly",
          "monthly": "Monthly",
          "yearly": "Yearly"
        },
        "chart": {
          "revenue": "Revenue",
          "projected": "Projected"
        }
      }
    }
  }
}
```

### Ejemplo 2: Campaign Overview Component

**Archivo:** `campaign-overview.tsx`  
**Namespace:** `components.campaignOverview`

**Strings identificados:**
- "Campaign Overview" → `components.campaignOverview.title`
- "Booked" → `components.campaignOverview.booked`
- "Visited" → `components.campaignOverview.visited`
- "This Week" → `components.campaignOverview.dateRanges.thisWeek`

---

## 🔧 Mejoras al Script de Detección

### Script Actual: `detect-missing-i18n-keys.js`

**Limitaciones:**
- No identifica por componente
- No sugiere namespace basado en archivo
- No agrupa resultados por componente

### Script Mejorado: `detect-hardcoded-strings-by-component.js`

**Características:**
- ✅ Detecta por componente (archivo)
- ✅ Sugiere namespace automáticamente
- ✅ Genera estructura JSON sugerida
- ✅ Prioriza componentes por criticidad
- ✅ Reporta progreso por componente

**Uso:**
```bash
# Un componente específico
node scripts/detect-hardcoded-strings-by-component.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --component revenue-stat.tsx \
  --namespace hotel

# Todos los componentes
node scripts/detect-hardcoded-strings-by-component.js \
  --module apps/dashboard/app/dashboard-bundui/hotel \
  --namespace hotel \
  --all-components
```

---

## 🔄 Módulos Reutilizables (Context-Aware)

**⚠️ IMPORTANTE:** Si un componente se usa en múltiples contextos (ej: Booking en Hotel y Studio), usar estrategia de context-aware translations.

**Ejemplo:**
- Hotel: "Reserva habitación", tipos "Premium", "De Lujo"
- Studio: "Reserva Sala 10", tipos "Tipo A", "Sin instrumentos"

**Estrategia:** Namespaces específicos por contexto
- `hotel.booking.*` para contexto Hotel
- `studio.booking.*` para contexto Studio

**Documentación completa:** `docs/architecture/I18N_CONTEXT_AWARE_TRANSLATIONS.md` ⭐

---

## 📚 Referencias

- **Protocolo i18n:** `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md`
- **Context-Aware Translations:** `docs/architecture/I18N_CONTEXT_AWARE_TRANSLATIONS.md` ⭐
- **Protocolo maestro:** `docs/architecture/MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md`
- **Scripts de validación:** `scripts/detect-missing-i18n-keys.js`

---

## ✅ Estado del Protocolo

**Versión:** 1.0.0  
**Fecha:** 2025-12-20  
**Estado:** ✅ OBLIGATORIO  

**Última actualización:** 2025-12-20  
**Aplicable a:** Todos los módulos importados

---

**Este protocolo establece la estrategia para organizar y validar traducciones por componente, facilitando la detección sistemática de strings hardcoded.**

