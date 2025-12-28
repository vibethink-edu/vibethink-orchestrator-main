# 🚀 Prompt Completo para Antigravity - Continuación i18n/l10n

**Fecha:** 2025-12-21  
**Objetivo:** Continuar aplicación de metodología AI-First i18n/l10n en módulos Bundui  
**Estado:** 6 módulos completos, ~24 pendientes

---

## 📋 CONTEXTO DEL TRABAJO

Estamos aplicando la metodología **AI-First i18n/l10n** a todos los módulos del Bundui Monorepo. El objetivo es:

1. **Contexto para AI Agents:** ConceptIDs en `concept.json`
2. **Namespaces/Sub-namespaces para UI:** Traducciones en `{module}.json`
3. **Reemplazo de strings hardcoded:** Componentes usando `useTranslation()`

---

## ✅ ESTADO ACTUAL

### Módulos Completos (6 módulos - NO MODIFICAR)
- ✅ `tasks` - Referencia completa
- ✅ `hotel` - Referencia completa
- ✅ `calendar` - 8 componentes migrados
- ✅ `crm-v2` - 9 componentes migrados
- ✅ `default` - 8 componentes migrados (dashboard principal)
- ✅ `ecommerce` - 13 componentes migrados (incluye subopciones)

### Módulos Pendientes (Prioridad Alta)
1. **`analytics`** - Archivo generado, falta extraer y aplicar
2. **`projects`** - Archivo generado, falta extraer y aplicar
3. **`mail`** - Archivo generado, falta extraer y aplicar

**Ver lista completa en:** `PLAN_I18N_PENDIENTE.md`

---

## 📚 DOCUMENTACIÓN ESENCIAL (LEER PRIMERO)

1. **Guía Completa:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`
2. **Quick Reference:** `docs/architecture/I18N_AI_FIRST_QUICK_REFERENCE.md`
3. **Plan Pendiente:** `PLAN_I18N_PENDIENTE.md` ⭐ **LEER ESTE PRIMERO**
4. **Instrucciones Detalladas:** `INSTRUCCIONES_ANTIGRAVITY_I18N.md`

---

## 🎯 WORKFLOW COMPLETO POR MÓDULO

### PASO 1: Extraer Strings Hardcoded

```bash
cd "C:\IA Marcelo Labs\vibethink-orchestrator-main"
node scripts/extract-hardcoded-strings.js <module-name>
```

**Ejemplo:**
```bash
node scripts/extract-hardcoded-strings.js analytics
```

**Qué hace:** Busca todos los strings hardcoded en los componentes del módulo y los agrega a los archivos de traducción.

---

### PASO 2: Limpiar Keys Inútiles

```bash
node scripts/clean-translation-keys.js <module-name>
```

**Ejemplo:**
```bash
node scripts/clean-translation-keys.js analytics
```

**Qué hace:** Elimina keys duplicadas o innecesarias de los archivos de traducción.

---

### PASO 3: Organizar Traducciones en Sub-namespaces

**Archivos a revisar:**
- `apps/dashboard/src/lib/i18n/translations/en/<module>.json`
- `apps/dashboard/src/lib/i18n/translations/es/<module>.json`

**Estructura recomendada de sub-namespaces:**

```json
{
  "title": "Module Title",
  "description": "Module description",
  "header": {
    "title": "Header Title",
    "download": "Download"
  },
  "cards": {
    "cardName": {
      "title": "Card Title",
      "description": "Card Description"
    }
  },
  "table": {
    "columns": {
      "id": "ID",
      "name": "Name"
    },
    "noResults": "No results.",
    "selectAll": "Select all"
  },
  "toolbar": {
    "filterPlaceholder": "Filter...",
    "search": "Search"
  },
  "form": {
    "name": "Name",
    "email": "Email",
    "save": "Save",
    "cancel": "Cancel"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive"
  },
  "actions": {
    "edit": "Edit",
    "delete": "Delete",
    "view": "View"
  },
  "messages": {
    "success": "Operation successful",
    "error": "An error occurred"
  }
}
```

**Reglas:**
- Agrupar por funcionalidad (table, toolbar, form, etc.)
- Usar nombres descriptivos y consistentes
- Traducir TODO al español en `es/<module>.json`

---

### PASO 4: Aplicar `useTranslation()` en Componentes

**Ubicación de componentes:**
```
apps/dashboard/app/dashboard-bundui/<module>/
├── page.tsx
└── components/
    ├── component1.tsx
    ├── component2.tsx
    └── ...
```

#### 4.1: Importar el hook

```typescript
import { useTranslation } from '@/lib/i18n';
```

#### 4.2: Usar en componente (Client Component)

```typescript
"use client";

import { useTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useTranslation('module-name');
  
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

#### 4.3: Para componentes con columnas de tabla

```typescript
"use client";

import * as React from "react";
import { useTranslation } from '@/lib/i18n';
import { ColumnDef } from "@tanstack/react-table";

export function MyTableComponent() {
  const { t } = useTranslation('module-name');
  
  // Columnas dentro del componente usando useMemo
  const columns: ColumnDef<Type>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: t('table.columns.id'),
      cell: ({ row }) => <div>{row.getValue("id")}</div>
    },
    {
      accessorKey: "name",
      header: t('table.columns.name'),
      cell: ({ row }) => <div>{row.getValue("name")}</div>
    }
  ], [t]);
  
  // ... resto del componente
}
```

#### 4.4: Para estados y badges

```typescript
const statusMap = {
  success: { 
    label: t('status.success'),
    variant: "default" 
  },
  processing: { 
    label: t('status.processing'),
    variant: "secondary" 
  }
};

// Uso
<Badge variant={statusMap[status].variant}>
  {statusMap[status].label}
</Badge>
```

#### 4.5: Para placeholders y mensajes

```typescript
<Input 
  placeholder={t('toolbar.filterPlaceholder')}
/>

{error && (
  <div>{t('messages.error')}: {error}</div>
)}
```

#### 4.6: Para page.tsx (Server Component)

Si `page.tsx` es Server Component, usar hardcoded strings para metadata (como en `calendar` y `default`):

```typescript
import { Metadata } from "next";
import { generateMeta } from "@/shared/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  // TODO: Use translations for metadata (requires async term() or getSnapshot)
  // For now, using hardcoded strings as fallback
  return generateMeta({
    title: "Module Title", // Hardcoded fallback
    description: "Module description", // Hardcoded fallback
    canonical: "/dashboard-bundui/module-name"
  });
}

export default function Page() {
  return <ModuleApp />;
}
```

---

### PASO 5: Validar Compilación

```bash
cd "C:\IA Marcelo Labs\vibethink-orchestrator-main"
npm run build:dashboard
```

**Verificar:**
- ✅ Compila sin errores relacionados al módulo
- ✅ No hay errores de linting en el módulo
- ✅ Los warnings de otros módulos no relacionados son aceptables

**Si hay errores:**
- Revisar imports de `useTranslation`
- Verificar que todos los componentes tengan `"use client"` si usan hooks
- Verificar que las keys de traducción existan en ambos archivos (en/es)

---

### PASO 6: Commit (OBLIGATORIO)

**IMPORTANTE:** Hacer commit después de cada módulo completado.

```bash
cd "C:\IA Marcelo Labs\vibethink-orchestrator-main"

# Agregar archivos modificados
git add apps/dashboard/src/lib/i18n/translations/en/<module>.json
git add apps/dashboard/src/lib/i18n/translations/es/<module>.json
git add apps/dashboard/app/dashboard-bundui/<module>/**/*.tsx

# Commit con mensaje descriptivo
git commit -m "i18n: Aplicar AI-First a módulo <module>"
```

**Ejemplo:**
```bash
git add apps/dashboard/src/lib/i18n/translations/en/analytics.json
git add apps/dashboard/src/lib/i18n/translations/es/analytics.json
git add apps/dashboard/app/dashboard-bundui/analytics/**/*.tsx
git commit -m "i18n: Aplicar AI-First a módulo analytics"
```

---

## 🎓 EJEMPLOS DE REFERENCIA

### Ejemplo 1: Dashboard Principal (default)

**Archivo:** `apps/dashboard/app/dashboard-bundui/default/page.tsx`

```typescript
"use client";

import { useTranslation } from "@/lib/i18n";
import { Button } from "@vibethink/ui/components/button";
import { Download } from "lucide-react";

export default function DefaultDashboardPage() {
  const { t } = useTranslation('default');
  
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          {t('header.dashboardTitle')}
        </h1>
        <div className="flex items-center space-x-2">
          <Button>
            <Download />
            <span className="hidden lg:inline">{t('header.download')}</span>
          </Button>
        </div>
      </div>
      {/* ... resto del componente */}
    </div>
  );
}
```

### Ejemplo 2: Tabla con Columnas (ecommerce)

**Archivo:** `apps/dashboard/app/dashboard-bundui/ecommerce/components/recent-orders.tsx`

```typescript
"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n";
import { ColumnDef } from "@tanstack/react-table";

export function EcommerceRecentOrdersCard() {
  const { t } = useTranslation('ecommerce');
  
  const columns: ColumnDef<Order>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: t('orders.columns.id'),
      cell: ({ row }) => (
        <Button variant="link">
          #{row.getValue("id")}
        </Button>
      )
    },
    {
      accessorKey: "customer",
      header: t('orders.columns.customer'),
      // ...
    }
  ], [t]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('orders.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder={t('orders.filterPlaceholder')} />
        {/* ... tabla */}
        {table.getRowModel().rows?.length ? (
          // ... filas
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {t('orders.noResults')}
            </TableCell>
          </TableRow>
        )}
      </CardContent>
    </Card>
  );
}
```

### Ejemplo 3: Tarjeta con Métricas (default)

**Archivo:** `apps/dashboard/app/dashboard-bundui/default/components/total-revenue.tsx`

```typescript
"use client";

import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";

export function TotalRevenue() {
  const { t } = useTranslation('default');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cards.totalRevenue.title')}</CardTitle>
        <CardDescription>{t('cards.totalRevenue.fromLastMonth')}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* ... contenido */}
      </CardContent>
    </Card>
  );
}
```

---

## ⚠️ REGLAS CRÍTICAS

1. **NO modificar módulos completos** (tasks, hotel, calendar, crm-v2, default, ecommerce)
2. **Siempre usar `"use client"`** en componentes que usan `useTranslation()`
3. **Columnas de tabla dentro del componente** usando `React.useMemo(() => [...], [t])`
4. **Organizar traducciones** en sub-namespaces lógicos
5. **Traducir TODO al español** en `es/<module>.json`
6. **Hacer commit después de cada módulo** completado
7. **Validar compilación** antes de commitear
8. **Actualizar `PLAN_I18N_PENDIENTE.md`** después de completar un módulo

---

## 📋 CHECKLIST POR MÓDULO

Antes de hacer commit, verificar:

- [ ] Archivo `en/{module}.json` existe y está organizado en sub-namespaces
- [ ] Archivo `es/{module}.json` existe y está completamente traducido
- [ ] Strings hardcoded extraídos con script (Paso 1)
- [ ] Keys inútiles limpiadas (Paso 2)
- [ ] Todos los componentes usan `useTranslation('module-name')`
- [ ] Todos los strings hardcoded reemplazados con `t('subNamespace.key')`
- [ ] Componentes con hooks tienen `"use client"` al inicio
- [ ] Columnas de tabla usan `React.useMemo(() => [...], [t])`
- [ ] Compila sin errores (`npm run build:dashboard`)
- [ ] No hay errores de linting en el módulo
- [ ] Commit realizado con mensaje descriptivo
- [ ] `PLAN_I18N_PENDIENTE.md` actualizado

---

## 🚀 COMENZAR TRABAJO

### Para el primer módulo (ejemplo: analytics)

1. **Leer documentación:**
   ```bash
   # Leer estos archivos primero
   cat PLAN_I18N_PENDIENTE.md
   cat INSTRUCCIONES_ANTIGRAVITY_I18N.md
   ```

2. **Extraer strings:**
   ```bash
   node scripts/extract-hardcoded-strings.js analytics
   ```

3. **Limpiar keys:**
   ```bash
   node scripts/clean-translation-keys.js analytics
   ```

4. **Revisar y organizar traducciones:**
   - Abrir: `apps/dashboard/src/lib/i18n/translations/en/analytics.json`
   - Abrir: `apps/dashboard/src/lib/i18n/translations/es/analytics.json`
   - Organizar en sub-namespaces
   - Traducir al español

5. **Aplicar useTranslation() en componentes:**
   - Buscar componentes en: `apps/dashboard/app/dashboard-bundui/analytics/`
   - Aplicar patrón de migración a cada componente

6. **Validar:**
   ```bash
   npm run build:dashboard
   ```

7. **Commit:**
   ```bash
   git add apps/dashboard/src/lib/i18n/translations/en/analytics.json
   git add apps/dashboard/src/lib/i18n/translations/es/analytics.json
   git add apps/dashboard/app/dashboard-bundui/analytics/**/*.tsx
   git commit -m "i18n: Aplicar AI-First a módulo analytics"
   ```

8. **Actualizar progreso:**
   - Editar `PLAN_I18N_PENDIENTE.md`
   - Marcar `analytics` como completado
   - Actualizar estadísticas

---

## 📊 PROGRESO GENERAL

- **Total de módulos:** ~30
- **Módulos completos:** 6 (tasks, hotel, calendar, crm-v2, default, ecommerce)
- **Módulos pendientes:** ~24
- **Progreso:** ~20% del total

---

## 🎯 PRÓXIMOS MÓDULOS SUGERIDOS

**Prioridad Alta:**
1. `analytics` - Archivo generado, falta extraer y aplicar
2. `projects` - Archivo generado, falta extraer y aplicar
3. `mail` - Archivo generado, falta extraer y aplicar

**Prioridad Media:**
- `payment`, `finance`, `sales`, `crypto`

**Ver lista completa en:** `PLAN_I18N_PENDIENTE.md`

---

## 💡 CONSEJOS

1. **Trabajar un módulo a la vez** - No intentar hacer múltiples módulos simultáneamente
2. **Usar ejemplos de referencia** - Los módulos completos son excelentes referencias
3. **Validar frecuentemente** - No esperar hasta el final para validar
4. **Hacer commits frecuentes** - Un commit por módulo completado
5. **Documentar problemas** - Si encuentras algo inusual, documentarlo en `PLAN_I18N_PENDIENTE.md`

---

**Última actualización:** 2025-12-21  
**Estado:** Listo para continuar  
**Próximo módulo sugerido:** `analytics`

---

## 🔗 ARCHIVOS DE REFERENCIA

- **Plan completo:** `PLAN_I18N_PENDIENTE.md`
- **Instrucciones detalladas:** `INSTRUCCIONES_ANTIGRAVITY_I18N.md`
- **Guía completa:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`
- **Quick reference:** `docs/architecture/I18N_AI_FIRST_QUICK_REFERENCE.md`

---

**¡Éxito con la migración! 🚀**








