# 🚀 Instrucciones para Antigravity - Continuación i18n/l10n

**Fecha:** 2025-12-21  
**Contexto:** Continuar aplicación de metodología AI-First i18n/l10n en módulos Bundui  
**Estado Actual:** 6 módulos completos, ~24 pendientes

---

## 📖 Contexto del Trabajo

Estamos aplicando la metodología **AI-First i18n/l10n** a todos los módulos del Bundui Monorepo. El objetivo es:

1. **Contexto para AI Agents:** ConceptIDs en `concept.json`
2. **Namespaces/Sub-namespaces para UI:** Traducciones en `{module}.json`
3. **Reemplazo de strings hardcoded:** Componentes usando `useTranslation()`

---

## ✅ Estado Actual (Actualizado 2025-12-21)

### Módulos Completos (6 módulos)
- ✅ `tasks` - Referencia completa
- ✅ `hotel` - Referencia completa
- ✅ `calendar` - 8 componentes migrados
- ✅ `crm-v2` - 9 componentes migrados
- ✅ `default` - 8 componentes migrados (dashboard principal)
- ✅ `ecommerce` - 13 componentes migrados (incluye subopciones)

### Módulos Pendientes (~24 módulos)

**Prioridad Alta:**
- `analytics` - Archivo generado, falta extraer y aplicar
- `projects` - Archivo generado, falta extraer y aplicar
- `mail` - Archivo generado, falta extraer y aplicar

**Prioridad Media:**
- `payment`, `finance`, `sales`, `crypto`, etc.

**Ver lista completa en:** `PLAN_I18N_PENDIENTE.md`

---

## 📚 Documentación Esencial (LEER PRIMERO)

1. **Guía Completa:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`
2. **Quick Reference:** `docs/architecture/I18N_AI_FIRST_QUICK_REFERENCE.md`
3. **Plan Pendiente:** `PLAN_I18N_PENDIENTE.md` ⭐ **LEER ESTE PRIMERO**
4. **Instrucciones Rápidas:** `INSTRUCCIONES_NUEVO_CHAT_I18N.md`

---

## 🎯 Workflow por Módulo

### Paso 1: Extraer Strings Hardcoded

```bash
node scripts/extract-hardcoded-strings.js <module-name>
```

Ejemplo:
```bash
node scripts/extract-hardcoded-strings.js analytics
```

### Paso 2: Limpiar Keys Inútiles

```bash
node scripts/clean-translation-keys.js <module-name>
```

### Paso 3: Organizar Traducciones

Revisar y organizar los archivos:
- `apps/dashboard/src/lib/i18n/translations/en/<module>.json`
- `apps/dashboard/src/lib/i18n/translations/es/<module>.json`

**Estructura recomendada de sub-namespaces:**
- `header.*` - Títulos y botones del header
- `cards.*` - Tarjetas de métricas
- `table.*` - Elementos de tabla
- `toolbar.*` - Barra de herramientas
- `form.*` - Formularios
- `status.*` - Estados
- `actions.*` - Acciones
- `messages.*` - Mensajes
- `labels.*` - Labels genéricos

### Paso 4: Aplicar `useTranslation()` en Componentes

**Patrón estándar:**

```typescript
// 1. Importar hook
import { useTranslation } from '@/lib/i18n';

// 2. Usar en componente
export function MyComponent() {
  const { t } = useTranslation('module-name');
  
  // 3. Reemplazar strings
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

**Para componentes con columnas de tabla:**

```typescript
const columns: ColumnDef<Type>[] = React.useMemo(() => [
  {
    accessorKey: "id",
    header: t('table.columns.id'),
    // ...
  }
], [t]);
```

### Paso 5: Validar

```bash
npm run build:dashboard
```

Verificar:
- ✅ Compila sin errores
- ✅ No hay errores de linting
- ✅ Traducciones funcionan en navegador

### Paso 6: Commit

```bash
git add apps/dashboard/src/lib/i18n/translations/**/<module>.json
git add apps/dashboard/app/dashboard-bundui/<module>/**/*.tsx
git commit -m "i18n: Aplicar AI-First a módulo <module>"
```

---

## 🎓 Ejemplos de Referencia

### Ejemplo 1: Dashboard Principal (default)

**Archivo:** `apps/dashboard/app/dashboard-bundui/default/page.tsx`

```typescript
"use client";

import { useTranslation } from "@/lib/i18n";

export default function DefaultDashboardPage() {
  const { t } = useTranslation('default');
  
  return (
    <div>
      <h1>{t('header.dashboardTitle')}</h1>
      <Button>{t('header.download')}</Button>
    </div>
  );
}
```

### Ejemplo 2: E-Commerce con Subopciones

**Archivo:** `apps/dashboard/app/dashboard-bundui/ecommerce/components/recent-orders.tsx`

```typescript
"use client";

import { useTranslation } from "@/lib/i18n";

export function EcommerceRecentOrdersCard() {
  const { t } = useTranslation('ecommerce');
  
  const columns: ColumnDef<Order>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: t('orders.columns.id'),
      // ...
    }
  ], [t]);
  
  return (
    <Card>
      <CardTitle>{t('orders.title')}</CardTitle>
      <Input placeholder={t('orders.filterPlaceholder')} />
      {/* ... */}
    </Card>
  );
}
```

### Ejemplo 3: Componente con Estados

```typescript
const statusMap = {
  success: t('status.success'),
  processing: t('status.processing'),
  paid: t('status.paid'),
  failed: t('status.failed')
};
```

---

## ⚠️ Reglas Críticas

1. **NO modificar módulos completos** (tasks, hotel, calendar, crm-v2, default, ecommerce) - son referencia
2. **Seguir estructura de sub-namespaces** estándar
3. **Hacer commits frecuentes** - uno por módulo completado
4. **Validar siempre** antes de commitear
5. **Documentar problemas** en `PLAN_I18N_PENDIENTE.md`

---

## 🔧 Scripts Disponibles

```bash
# Extraer strings hardcoded
node scripts/extract-hardcoded-strings.js <module-name>

# Limpiar keys inútiles
node scripts/clean-translation-keys.js <module-name>

# Generar archivos base (ya hecho para todos)
node scripts/generate-i18n-for-all-modules.js
```

---

## 📋 Checklist por Módulo

Para cada módulo, verificar:

- [ ] Archivo `en/{module}.json` existe y está organizado
- [ ] Archivo `es/{module}.json` existe y está traducido
- [ ] Strings hardcoded extraídos con script
- [ ] Keys inútiles limpiadas
- [ ] Componentes usan `useTranslation('module-name')`
- [ ] Strings hardcoded reemplazados con `t('subNamespace.key')`
- [ ] Estructura de sub-namespaces respetada
- [ ] Compila sin errores (`npm run build:dashboard`)
- [ ] Traducciones funcionan en navegador
- [ ] Commit realizado con mensaje descriptivo

---

## 🚀 Comenzar

1. Leer `PLAN_I18N_PENDIENTE.md` para contexto completo
2. Elegir módulo siguiente (sugerido: `analytics`, `projects`, o `mail`)
3. Seguir workflow por módulo (6 pasos arriba)
4. Hacer commit después de cada módulo completado
5. Actualizar `PLAN_I18N_PENDIENTE.md` con progreso

---

## 📊 Progreso General

- **Total de módulos:** ~30
- **Módulos completos:** 6
- **Módulos pendientes:** ~24
- **Última sesión:** `default` + `ecommerce` completados

---

**Última actualización:** 2025-12-21  
**Próximo módulo sugerido:** `analytics` (archivo generado, falta extraer y aplicar)







