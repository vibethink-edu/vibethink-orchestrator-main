# 🌍 Protocolo i18n Multi-Workspace - VibeThink

**Versión:** 1.0.0
**Fecha:** 2025-12-27
**Autor:** Claude Sonnet 4.5 + Marcelo (Product Owner)

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura de Namespaces](#arquitectura-de-namespaces)
3. [Protocolo para Agregar Nueva Frase](#protocolo-para-agregar-nueva-frase)
4. [Protocolo para Nuevo Workspace](#protocolo-para-nuevo-workspace)
5. [Glossary de Términos](#glossary-de-términos)
6. [Validación y Calidad](#validación-y-calidad)
7. [Casos de Uso por Industria](#casos-de-uso-por-industria)

---

## 🎯 Introducción

VibeThink es un sistema **multi-tenant, multi-workspace, multi-idioma** que soporta:

- **9 idiomas:** en, es, ar, zh, fr, pt, de, it, ko
- **11+ workspaces:** Restaurant, Marketing, CRM, HR, Accounting, etc.
- **5+ industrias:** Hotel, Cowork, Coliving, Studio, Legal Firms, etc.

### Principios Fundamentales

1. **English es el baseline:** Todas las traducciones parten del inglés
2. **Consistencia terminológica:** Mismo concepto = misma traducción
3. **Context-aware:** "Guest" en hotel ≠ "Guest" en cowork
4. **Fallback automático:** Si falta traducción → inglés → conceptId
5. **RTL support:** Árabe (y futuros: hebreo, persa) con layout invertido

---

## 🏗️ Arquitectura de Namespaces

### Capa 1: Transversales (Todos los workspaces)

```
apps/dashboard/src/lib/i18n/translations/{locale}/

common.json           # Botones, acciones generales ("Save", "Cancel", "Delete")
navigation.json       # Menú, sidebar, breadcrumbs
validation.json       # Errores de validación ("Required field", "Invalid email")
errors.json          # Mensajes de error del sistema
tasks.json           # Sistema de tareas (transversal a todo)
calendar.json        # Citas y calendario (transversal)
accounting.json      # Contabilidad (transversal)
notifications.json   # Sistema de notificaciones
theme.json           # UI/UX ("Light mode", "Dark mode")
```

**Cuándo usar:**
- Si el término se usa en **3 o más workspaces** → transversal
- Botones y acciones básicas → `common.json`
- Navegación global → `navigation.json`

### Capa 2: Por Workspace

```
workspace-restaurant.json      # F&B operations
workspace-marketing.json       # Marketing & Content
workspace-procurement.json     # Proveedores/Compras
workspace-crm.json            # Customer Service
workspace-hr.json             # Recursos Humanos
workspace-maintenance.json    # Mantenimiento
workspace-inventory.json      # Inventario/Stock
workspace-sales.json          # Ventas
workspace-analytics.json      # Reportes/BI
workspace-legal.json          # Legal/Compliance
workspace-it.json             # IT/Soporte Técnico
```

**Cuándo usar:**
- Terminología específica de un departamento
- Estados, procesos, workflows del workspace
- KPIs y métricas específicas

### Capa 3: Por Industria (Concept)

```
concept-hotel.json            # Hospitality
concept-restaurant.json       # F&B
concept-cowork.json          # Coworking
concept-coliving.json        # Shared Living
concept-studio.json          # Creative Studios
concept-retail.json          # Retail/Commerce
concept-legal-firm.json      # Law Firms
concept-healthcare.json      # Healthcare
concept-education.json       # Education
```

**Cuándo usar:**
- Contexto semántico de la industria
- Términos que cambian de significado según industria
- Ejemplo: "guest" = "huésped" (hotel) vs "miembro" (cowork)

---

## 📝 Protocolo para Agregar Nueva Frase

### Paso 1: Identificar el Namespace Correcto

**Diagrama de Decisión:**

```
¿La frase es un botón/acción básica? (Save, Cancel, Delete)
  └─ YES → common.json

¿La frase es de navegación? (Menu, Sidebar, Breadcrumbs)
  └─ YES → navigation.json

¿La frase es específica de un workspace? (ej: "Purchase Order")
  └─ YES → workspace-{nombre}.json

¿La frase cambia de significado según industria? (ej: "Guest")
  └─ YES → concept-{industria}.json

¿Es un error de validación? (Required, Invalid)
  └─ YES → validation.json
```

**Ejemplos:**

| Frase | Namespace | Razón |
|-------|-----------|-------|
| "Save Changes" | common.json | Botón usado en todos lados |
| "Dashboard" | navigation.json | Elemento de menú global |
| "Purchase Order" | workspace-procurement.json | Específico de Proveedores |
| "Guest" (hotel) | concept-hotel.json | Contexto de hospitalidad |
| "Required field" | validation.json | Error de validación |

### Paso 2: Agregar en Baseline (Inglés)

```bash
# Editar archivo correspondiente
apps/dashboard/src/lib/i18n/translations/en/{namespace}.json
```

**Ejemplo - workspace-restaurant.json:**

```json
{
  "menu": {
    "items": "Menu Items",
    "categories": "Categories",
    "allergens": "Allergens"
  },
  "orders": {
    "status": {
      "pending": "Pending",
      "preparing": "Preparing",     // ← NUEVA
      "ready": "Ready",
      "delivered": "Delivered"
    }
  }
}
```

**Reglas:**
- ✅ Usar estructura anidada (máx 3 niveles)
- ✅ Keys en camelCase
- ✅ Valores en inglés profesional
- ❌ NO usar abreviaciones ("Mgr" → "Manager")
- ❌ NO usar slang ("OK" → "Confirm")

### Paso 3: Traducir a 8 Idiomas

**Opción A - Script Automático (Recomendado):**

```bash
# Traducir workspace completo a todos los idiomas
node scripts/translate-namespace.js workspace-restaurant es
node scripts/translate-namespace.js workspace-restaurant ar
node scripts/translate-namespace.js workspace-restaurant zh
node scripts/translate-namespace.js workspace-restaurant fr
node scripts/translate-namespace.js workspace-restaurant pt
node scripts/translate-namespace.js workspace-restaurant de
node scripts/translate-namespace.js workspace-restaurant it
node scripts/translate-namespace.js workspace-restaurant ko
```

**Opción B - Manual (Solo si necesitas control fino):**

Editar cada archivo:
```
apps/dashboard/src/lib/i18n/translations/es/workspace-restaurant.json
apps/dashboard/src/lib/i18n/translations/ar/workspace-restaurant.json
...etc
```

### Paso 4: Validar

```bash
# Ejecutar audit para verificar que no falten traducciones
node scripts/audit-missing-translations-projects-v2.js

# Resultado esperado:
# ✅ workspace-restaurant: COMPLETE (100%)
```

### Paso 5: Verificar Consistencia con Glossary

```bash
# Verificar que términos coincidan con glossary oficial
node scripts/validate-glossary-consistency.js workspace-restaurant

# Ejemplo de alerta:
# ⚠️  "guest" traducido como "invitado" en workspace-restaurant
# 📖 Glossary dice: "huésped" (context: hospitality)
# 💡 Sugerencia: Actualizar traducción para consistencia
```

### Paso 6: Usar en Código

```tsx
import { useTranslation } from '@/lib/i18n';

function OrderStatus() {
  const { t } = useTranslation('workspace-restaurant');

  return (
    <Badge>
      {t('orders.status.preparing')}
      {/* Renderiza:
          en: "Preparing"
          es: "Preparando"
          ar: "جاري التحضير"
          zh: "准备中"
      */}
    </Badge>
  );
}
```

### Paso 7: Commit

```bash
git add apps/dashboard/src/lib/i18n/translations/
git commit -m "feat(i18n): Add 'preparing' status to restaurant workspace

- Add orders.status.preparing key
- Translate to 8 languages (es, ar, zh, fr, pt, de, it, ko)
- Validate against glossary

Context: Restaurant POS needs intermediate order state"
```

---

## 🏢 Protocolo para Nuevo Workspace

### Paso 1: Planificación

**Template de Análisis:**

```markdown
# Workspace: {Nombre}

## Propósito
[Descripción del workspace y usuarios objetivo]

## Términos Clave (50-100 keys)
- Estados/Status
- Acciones principales
- Entidades del dominio
- KPIs/Métricas
- Reportes

## Dependencias
- Transversales: [tasks, calendar, accounting, etc]
- Otros workspaces: [crm, inventory, etc]

## Multilingüe Crítico
[Keys que DEBEN estar traducidas para funcionar]
```

**Ejemplo - Workspace Restaurant:**

```markdown
# Workspace: Restaurant

## Propósito
Gestión de operaciones F&B: menús, órdenes, mesas, POS

## Términos Clave
- Status: pending, preparing, ready, delivered
- Actions: openCheck, closeCheck, splitBill
- Entities: menu, table, order, customer
- Metrics: coverCount, avgTicket, turnoverRate

## Dependencias
- Transversales: tasks (para kitchen tasks), calendar (reservations)
- Otros: inventory (stock), accounting (revenue)

## Multilingüe Crítico
- Menu items (carta en múltiples idiomas)
- Allergens (alergenos en idioma del cliente)
- Order status (para display en cocina)
```

### Paso 2: Crear Estructura Base

```bash
# Crear archivo en inglés con estructura completa
touch apps/dashboard/src/lib/i18n/translations/en/workspace-restaurant.json
```

**Template inicial:**

```json
{
  "workspace": {
    "name": "Restaurant",
    "description": "F&B Operations"
  },
  "entities": {
    "menu": "Menu",
    "table": "Table",
    "order": "Order",
    "customer": "Customer"
  },
  "actions": {
    "create": "Create {entity}",
    "edit": "Edit {entity}",
    "delete": "Delete {entity}",
    "view": "View {entity}"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "pending": "Pending"
  },
  "metrics": {
    "total": "Total {entity}",
    "today": "Today",
    "thisWeek": "This Week",
    "thisMonth": "This Month"
  }
}
```

### Paso 3: Poblar con Términos Específicos

Agregar las 50-100 keys identificadas en el análisis.

### Paso 4: Traducir Automáticamente

```bash
# Traducir a todos los idiomas
for lang in es ar zh fr pt de it ko; do
  node scripts/translate-namespace.js workspace-restaurant $lang
done
```

### Paso 5: Agregar a Preload

```tsx
// apps/dashboard/app/layout.tsx
<I18nProvider
  initialLocale={initialLocale}
  preloadNamespaces={[
    'common',
    'navigation',
    // ... otros
    'workspace-restaurant',  // ← AGREGAR
  ]}>
```

### Paso 6: Crear Glossary Específico

```json
// docs/i18n/glossaries/workspace-restaurant.json
{
  "guest": {
    "en": "guest",
    "es": "comensal",
    "ar": "زائر",
    "context": "restaurant patron",
    "note": "Use 'comensal' not 'cliente' for dining context"
  },
  "table": {
    "en": "table",
    "es": "mesa",
    "ar": "طاولة",
    "context": "dining table",
    "note": "Physical table, not data table"
  }
}
```

### Paso 7: Documentar

```markdown
// docs/workspaces/WORKSPACE_RESTAURANT.md

# Restaurant Workspace - i18n Guide

## Namespace
`workspace-restaurant`

## Usage
```tsx
const { t } = useTranslation('workspace-restaurant');
t('orders.status.preparing');
```

## Key Entities
- Menu
- Table
- Order
- Customer

## Critical Translations
Menu items and allergens MUST be translated for legal compliance.
```

### Paso 8: Testing

```bash
# 1. Start dev server
npm run dev -- --port 3005

# 2. Navigate to workspace
http://localhost:3005/dashboard/restaurant

# 3. Test all 9 languages
# 4. Verify RTL for Arabic
# 5. Screenshot each language
```

---

## 📖 Glossary de Términos

### Estructura del Glossary

```json
// docs/i18n/glossary.json
{
  "version": "1.0.0",
  "lastUpdated": "2025-12-27",
  "terms": {
    "guest": {
      "contexts": {
        "hotel": {
          "en": "guest",
          "es": "huésped",
          "ar": "ضيف",
          "zh": "客人",
          "note": "Person staying at hotel"
        },
        "restaurant": {
          "en": "guest",
          "es": "comensal",
          "ar": "زائر",
          "note": "Person dining at restaurant"
        },
        "cowork": {
          "en": "member",
          "es": "miembro",
          "ar": "عضو",
          "note": "Coworking member, not 'guest'"
        }
      }
    },
    "booking": {
      "en": "booking",
      "es": "reserva",
      "ar": "حجز",
      "zh": "预订",
      "contexts": "hotel, restaurant",
      "alternatives": ["reservation"],
      "note": "Prefer 'booking' over 'reservation' for consistency"
    }
  }
}
```

### Términos Prohibidos

```json
{
  "forbidden": {
    "OK": {
      "reason": "Informal",
      "use_instead": "Confirm"
    },
    "Mgr": {
      "reason": "Abbreviation",
      "use_instead": "Manager"
    },
    "ASAP": {
      "reason": "Slang",
      "use_instead": "Urgent"
    }
  }
}
```

---

## ✅ Validación y Calidad

### Validadores Disponibles

#### 1. Audit de Completitud

```bash
node scripts/audit-missing-translations-projects-v2.js

# Verifica:
✅ Todas las keys en 'en' existen en es, ar, zh, fr, pt, de, it, ko
✅ No hay keys huérfanas
✅ Estructura JSON válida
```

#### 2. Validador de Glossary (Próximo)

```bash
node scripts/validate-glossary-consistency.js

# Verifica:
✅ Términos coinciden con glossary oficial
✅ No hay terminología inconsistente
✅ Contexto correcto (hotel vs restaurant)
```

#### 3. Validador de Placeholders (Próximo)

```bash
node scripts/validate-placeholders.js

# Verifica:
✅ Placeholders {{count}} son iguales en todos los idiomas
✅ No hay {percentage} vs {porcentaje}
```

### Checklist de Calidad

**Antes de Commit:**

- [ ] Keys agregadas en `en/{namespace}.json` (baseline)
- [ ] Traducido a 8 idiomas (es, ar, zh, fr, pt, de, it, ko)
- [ ] Audit ejecutado: `Total Missing Keys: 0`
- [ ] Glossary verificado (términos consistentes)
- [ ] Testing manual en 3 idiomas mínimo (en, es, ar)
- [ ] RTL verificado si afecta layout
- [ ] Commit message descriptivo

---

## 🌍 Casos de Uso por Industria

### Hotel (concept-hotel.json)

**Términos clave:**
- guest, room, booking, checkout, housekeeping
- Multilingüe crítico: Check-in instructions, emergency info

### Restaurant (concept-restaurant.json)

**Términos clave:**
- menu, table, order, allergens, dietary
- Multilingüe crítico: Menu items, allergen warnings (legal)

### Cowork (concept-cowork.json)

**Términos clave:**
- member, desk, meeting room, community
- Multilingüe crítico: Access instructions, wifi credentials

### Coliving (concept-coliving.json)

**Términos clave:**
- resident, shared space, utilities, community
- Multilingüe crítico: House rules, emergency contacts

### Legal Firm (concept-legal-firm.json)

**Términos clave:**
- client, case, hearing, billing, document
- Multilingüe crítico: Legal disclaimers, client communications

---

## 🚀 Roadmap

### Fase 1 (Completada - 81%)
- ✅ Arquitectura 3 capas
- ✅ 9 idiomas base
- ✅ RTL support (Arabic)
- ✅ Scripts de traducción automática
- ✅ Audit de completitud

### Fase 2 (En Progreso)
- 🟡 Completar 484 keys faltantes (Z.AI)
- 🟡 Documentar protocolo (este archivo)
- 🟡 Crear glossary base

### Fase 3 (Próximo)
- ⚪ Validador de glossary consistency
- ⚪ Validador de placeholders
- ⚪ Script interactivo `add-i18n-key.js`
- ⚪ Workspaces: restaurant, legal-firm

### Fase 4 (Futuro)
- ⚪ Git hooks de validación
- ⚪ CI/CD checks
- ⚪ Auto-detect terminología inconsistente
- ⚪ Dashboard de cobertura i18n

---

## 📞 Soporte

**Documentación:**
- Arquitectura: `docs/architecture/I18N_MULTI_DEPARTMENT_ARCHITECTURE.md`
- Usage Guide: `docs/architecture/I18N_USAGE_GUIDE.md`
- Template Guide: `docs/architecture/I18N_TEMPLATE_GUIDE.md`

**Scripts:**
- Traducción: `scripts/translate-namespace.js`
- Audit: `scripts/audit-missing-translations-projects-v2.js`

**Contacts:**
- Arquitecto: Claude Sonnet 4.5
- Product Owner: Marcelo

---

**Versión:** 1.0.0
**Última actualización:** 2025-12-27
**Estado:** 🟡 En desarrollo (81% completado)
