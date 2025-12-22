# 📋 Plan Pendiente: Aplicación AI-First i18n/l10n en Bundui Monorepo

**Fecha:** 2025-12-21  
**Estado:** En progreso  
**Objetivo:** Aplicar metodología AI-First con contexto para AI Agents y namespaces/sub-namespaces para UI en todos los módulos

---

## 🎯 Objetivo General

Aplicar la metodología **AI-First i18n/l10n** a todos los módulos del Bundui Monorepo, asegurando:

1. **Contexto para AI Agents:** ConceptIDs estructurados en `concept.json`
2. **Namespaces/Sub-namespaces para UI:** Traducciones organizadas en `{module}.json`
3. **Reemplazo de strings hardcoded:** Todos los componentes usando `useTranslation()`

---

## 📚 Documentación de Referencia

**LEER PRIMERO antes de comenzar:**

1. **Guía Completa:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`
   - Arquitectura en 3 capas
   - Patrones de implementación
   - Ejemplos prácticos

2. **Quick Reference:** `docs/architecture/I18N_AI_FIRST_QUICK_REFERENCE.md`
   - Checklist rápido
   - Comandos útiles
   - Estructura de sub-namespaces

3. **Scripts Disponibles:**
   - `scripts/extract-hardcoded-strings.js` - Extrae strings de componentes
   - `scripts/clean-translation-keys.js` - Limpia keys inútiles
   - `scripts/generate-i18n-for-all-modules.js` - Genera archivos base

---

## ✅ Estado Actual del Trabajo

### Módulos con Traducciones Generadas (archivos `.json` creados)

Los siguientes módulos **YA TIENEN** archivos de traducción generados:

- ✅ `tasks` - **COMPLETO** (ya usa `useTranslation()`)
- ✅ `calendar` - **COMPLETO** (8 componentes con `useTranslation()`, strings extraídos)
- ✅ `crm-v2` - **COMPLETO** (9 componentes con `useTranslation()`: page.tsx + 8 componentes)
- ✅ `hotel` - **COMPLETO** (ya usa `useTranslation()`)
- ✅ `default` - **COMPLETO** (8 componentes: page.tsx + 7 componentes del dashboard principal)
- ✅ `ecommerce` - **COMPLETO** (13 componentes: page.tsx + 12 componentes incluyendo subopciones)
- ✅ `analytics` - Archivo generado
- ✅ `crm-v2-ai` - Archivo generado
- ✅ `projects` - Archivo generado
- ✅ `mail` - Archivo generado
- ✅ `notes` - Archivo generado
- ✅ `payment` - Archivo generado
- ✅ `crypto` - Archivo generado
- ✅ `finance` - Archivo generado
- ✅ `ecommerce` - Archivo generado
- ✅ `sales` - Archivo generado
- ✅ `chat` - Archivo generado
- ✅ `ai-chat` - Archivo generado
- ✅ `ai-chat-v2` - Archivo generado
- ✅ `ai-image-generator` - Archivo generado
- ✅ `api-keys` - Archivo generado
- ✅ `file-manager` - Archivo generado
- ✅ `widgets` - Archivo generado
- ✅ `todo-list-app` - Archivo generado
- ✅ `social-media` - Archivo generado
- ✅ `project-management` - Archivo generado
- ✅ `project-list` - Archivo generado
- ✅ `pos-system` - Archivo generado
- ✅ `hospital-management` - Archivo generado
- ✅ `finance-v2` - Archivo generado
- ✅ `crypto-v2` - Archivo generado
- ✅ `default` - Archivo generado
- ✅ `academy` - Archivo generado
- ✅ `kanban` - Archivo generado

### Módulos que YA usan `useTranslation()` (ejemplos de referencia)

Estos módulos ya tienen componentes migrados y pueden usarse como referencia:

- ✅ `tasks` - `components/columns.tsx`, `components/data-table-toolbar.tsx`
- ✅ `hotel` - `components/booking-list.tsx`, `components/campaign-overview.tsx`, etc.
- ✅ `calendar` - `components/day-view.tsx`, `components/week-view.tsx`, `components/event-calendar.tsx`, etc. (8 componentes)
- ✅ `crm-v2` - **COMPLETO**: `page.tsx` + 8 componentes (`target-card.tsx`, `leads.tsx`, `total-customers.tsx`, `total-deals.tsx`, `total-revenue.tsx`, `leads-by-source.tsx`, `recent-tasks.tsx`, `sales-pipeline.tsx`)
- ✅ `crm-v2-ai` - `lead/[id]/components/contextual-timeline.tsx`
- ✅ `default` - **COMPLETO**: `page.tsx` + 7 componentes (`total-revenue.tsx`, `subscriptions.tsx`, `exercise-minutes.tsx`, `latest-payments.tsx`, `theme-members.tsx`, `chat-widget.tsx`, `payment-method.tsx`)
- ✅ `ecommerce` - **COMPLETO**: `page.tsx` + 12 componentes (`welcome.tsx`, `revenue.tsx`, `sales.tsx`, `new-customers.tsx`, `total-revenue.tsx`, `return-rate.tsx`, `recent-orders.tsx`, `best-selling-products.tsx`, `customer-reviews.tsx`, `sales-by-location.tsx`, `visit-by-source.tsx`)

---

## 📝 Plan de Trabajo Pendiente

### Fase 1: Extracción y Limpieza de Strings (PARA CADA MÓDULO)

**Para cada módulo que tenga archivo `.json` pero NO use `useTranslation()`:**

1. **Extraer strings hardcoded:**
   ```bash
   node scripts/extract-hardcoded-strings.js <module-name>
   ```
   Ejemplo: `node scripts/extract-hardcoded-strings.js calendar`

2. **Limpiar keys inútiles:**
   ```bash
   node scripts/clean-translation-keys.js <module-name>
   ```
   Ejemplo: `node scripts/clean-translation-keys.js calendar`

3. **Revisar y organizar** los archivos `en/{module}.json` y `es/{module}.json`:
   - Agrupar por sub-namespaces (`table`, `toolbar`, `form`, `status`, etc.)
   - Eliminar duplicados
   - Verificar que las traducciones en español sean correctas

### Fase 2: Aplicar `useTranslation()` en Componentes

**Para cada componente del módulo:**

1. **Importar el hook:**
   ```typescript
   import { useTranslation } from '@/lib/i18n';
   ```

2. **Usar en el componente:**
   ```typescript
   const { t } = useTranslation('module-name');
   ```

3. **Reemplazar strings hardcoded:**
   ```typescript
   // ❌ ANTES
   <button>Select all</button>
   
   // ✅ DESPUÉS
   <button>{t('table.selectAll')}</button>
   ```

4. **Seguir estructura de sub-namespaces:**
   - `table.*` - Elementos de tabla
   - `toolbar.*` - Barra de herramientas
   - `form.*` - Formularios
   - `status.*` - Estados
   - `actions.*` - Acciones
   - `messages.*` - Mensajes
   - `labels.*` - Labels genéricos

### Fase 3: Validación y Commits

**Después de cada módulo:**

1. **Validar que compila:**
   ```bash
   npm run build:dashboard
   ```

2. **Verificar en navegador:**
   - Abrir `http://localhost:3005/dashboard-bundui/<module>`
   - Cambiar idioma y verificar traducciones

3. **Hacer commit:**
   ```bash
   git add apps/dashboard/src/lib/i18n/translations/**/<module>.json
   git add apps/dashboard/app/dashboard-bundui/<module>/**/*.tsx
   git commit -m "i18n: Aplicar AI-First a módulo <module>"
   ```

---

## 🎯 Módulos Prioritarios (Orden Sugerido)

### Prioridad Alta (Módulos Core)

1. **analytics** - Archivo generado, falta extraer y aplicar
4. **projects** - Archivo generado, falta extraer y aplicar
5. **mail** - Archivo generado, falta extraer y aplicar

### Prioridad Media (Módulos de Negocio)

6. **payment** - Archivo generado, falta extraer y aplicar
7. **finance** - Archivo generado, falta extraer y aplicar
8. **ecommerce** - **COMPLETO** (13 componentes migrados)
9. **sales** - Archivo generado, falta extraer y aplicar
10. **crypto** - Archivo generado, falta extraer y aplicar

### Prioridad Baja (Módulos Complementarios)

11. **notes** - Archivo generado, falta extraer y aplicar
12. **chat** - Archivo generado, falta extraer y aplicar
13. **ai-chat** - Archivo generado, falta extraer y aplicar
14. **ai-chat-v2** - Archivo generado, falta extraer y aplicar
15. **ai-image-generator** - Archivo generado, falta extraer y aplicar
16. **file-manager** - Archivo generado, falta extraer y aplicar
17. **widgets** - Archivo generado, falta extraer y aplicar
18. **todo-list-app** - Archivo generado, falta extraer y aplicar
19. **social-media** - Archivo generado, falta extraer y aplicar
20. **project-management** - Archivo generado, falta extraer y aplicar
21. **project-list** - Archivo generado, falta extraer y aplicar
22. **pos-system** - Archivo generado, falta extraer y aplicar
23. **hospital-management** - Archivo generado, falta extraer y aplicar
24. **finance-v2** - Archivo generado, falta extraer y aplicar
25. **crypto-v2** - Archivo generado, falta extraer y aplicar
26. **default** - Archivo generado, falta extraer y aplicar
27. **academy** - Archivo generado, falta extraer y aplicar
28. **kanban** - Archivo generado, falta extraer y aplicar
29. **api-keys** - Archivo generado, falta extraer y aplicar
30. **crm-v2-ai** - Archivo generado, falta extraer y aplicar

---

## 🔄 Workflow Recomendado

### Para cada módulo:

```bash
# 1. Extraer strings hardcoded
node scripts/extract-hardcoded-strings.js <module-name>

# 2. Limpiar keys inútiles
node scripts/clean-translation-keys.js <module-name>

# 3. Revisar archivos generados
# - apps/dashboard/src/lib/i18n/translations/en/<module>.json
# - apps/dashboard/src/lib/i18n/translations/es/<module>.json

# 4. Aplicar useTranslation() en componentes
# - Buscar componentes en: apps/dashboard/app/dashboard-bundui/<module>/
# - Reemplazar strings hardcoded con t()

# 5. Validar
npm run build:dashboard

# 6. Commit
git add apps/dashboard/src/lib/i18n/translations/**/<module>.json
git add apps/dashboard/app/dashboard-bundui/<module>/**/*.tsx
git commit -m "i18n: Aplicar AI-First a módulo <module>"
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

## 🚨 Notas Importantes

1. **NO modificar módulos que ya usan `useTranslation()`** (tasks, hotel) - son referencia
2. **Seguir estructura de sub-namespaces** estándar (ver Quick Reference)
3. **Hacer commits frecuentes** - uno por módulo completado
4. **Validar siempre** antes de commitear
5. **Documentar problemas** encontrados en este archivo

---

## 📊 Progreso General

- **Total de módulos:** ~30
- **Módulos completos:** 6 (tasks, hotel, calendar, crm-v2, default, ecommerce)
- **Módulos con strings extraídos:** 0 (todos los extraídos ya están aplicados)
- **Módulos con archivos generados:** ~24
- **Módulos pendientes de aplicar `useTranslation()`:** ~24

---

## 🎓 Ejemplos de Referencia

### Ejemplo 1: Componente con tabla (tasks)

```typescript
// apps/dashboard/app/dashboard-bundui/tasks/components/columns.tsx
import { useTranslation } from '@/lib/i18n';

export const columns = () => {
  const { t } = useTranslation('tasks');
  
  return [
    {
      header: t('table.task'),
      accessorKey: 'title',
    },
    {
      header: t('table.status'),
      accessorKey: 'status',
    },
  ];
};
```

### Ejemplo 2: Componente con toolbar (tasks)

```typescript
// apps/dashboard/app/dashboard-bundui/tasks/components/data-table-toolbar.tsx
import { useTranslation } from '@/lib/i18n';

export const DataTableToolbar = () => {
  const { t } = useTranslation('tasks');
  
  return (
    <Input
      placeholder={t('toolbar.filterTasks')}
    />
  );
};
```

---

**Última actualización:** 2025-12-21  
**Última sesión completada:**
- ✅ `default` - Dashboard principal (8 componentes migrados)
- ✅ `ecommerce` - E-Commerce completo (13 componentes migrados con subopciones)

**Próximo paso:** Continuar con módulos prioritarios: `analytics`, `projects`, o `mail` (extraer strings y aplicar `useTranslation()`)

