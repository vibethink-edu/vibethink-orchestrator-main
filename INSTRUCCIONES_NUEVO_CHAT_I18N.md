# 🚀 Instrucciones para Nuevo Chat - Aplicación AI-First i18n/l10n

**Fecha:** 2025-12-21  
**Contexto:** Continuar aplicación de metodología AI-First en módulos Bundui

---

## 📖 Contexto del Trabajo

Estamos aplicando la metodología **AI-First i18n/l10n** a todos los módulos del Bundui Monorepo. El objetivo es:

1. **Contexto para AI Agents:** ConceptIDs en `concept.json`
2. **Namespaces/Sub-namespaces para UI:** Traducciones en `{module}.json`
3. **Reemplazo de strings hardcoded:** Componentes usando `useTranslation()`

---

## 📚 Documentación Esencial (LEER PRIMERO)

1. **Guía Completa:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`
2. **Quick Reference:** `docs/architecture/I18N_AI_FIRST_QUICK_REFERENCE.md`
3. **Plan Pendiente:** `PLAN_I18N_PENDIENTE.md` ⭐ **LEER ESTE PRIMERO**

---

## ✅ Estado Actual

### Módulos Completos (ya usan `useTranslation()`)
- ✅ `tasks` - Referencia completa
- ✅ `hotel` - Referencia completa
- ✅ `calendar` - COMPLETO (8 componentes migrados)
- ✅ `crm-v2` - COMPLETO (9 componentes migrados)
- ✅ `default` - COMPLETO (8 componentes migrados - dashboard principal)
- ✅ `ecommerce` - COMPLETO (13 componentes migrados - incluye subopciones)

### Módulos con Strings Extraídos (falta aplicar `useTranslation()`)
- ⚠️ Ninguno pendiente con strings extraídos

### Módulos con Archivos Generados (falta todo)
- ~26 módulos más con archivos `.json` generados pero sin aplicar

---

## 🎯 Tarea Inmediata

**Continuar aplicando `useTranslation()` a los módulos pendientes.**

### Workflow por Módulo:

```bash
# 1. Extraer strings (si no se ha hecho)
node scripts/extract-hardcoded-strings.js <module-name>

# 2. Limpiar keys inútiles
node scripts/clean-translation-keys.js <module-name>

# 3. Aplicar useTranslation() en componentes
# - Buscar en: apps/dashboard/app/dashboard-bundui/<module>/
# - Reemplazar strings hardcoded con t()

# 4. Validar
npm run build:dashboard

# 5. Commit
git add apps/dashboard/src/lib/i18n/translations/**/<module>.json
git add apps/dashboard/app/dashboard-bundui/<module>/**/*.tsx
git commit -m "i18n: Aplicar AI-First a módulo <module>"
```

---

## 📋 Orden Sugerido

1. **calendar** ⚠️ (strings ya extraídos)
2. **crm-v2** ⚠️ (strings ya extraídos)
3. **analytics**
4. **projects**
5. **mail**
6. ... (ver `PLAN_I18N_PENDIENTE.md` para lista completa)

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

## 📝 Patrón de Implementación

### 1. Importar hook
```typescript
import { useTranslation } from '@/lib/i18n';
```

### 2. Usar en componente
```typescript
const { t } = useTranslation('module-name');
```

### 3. Reemplazar strings
```typescript
// ❌ ANTES
<button>Select all</button>

// ✅ DESPUÉS
<button>{t('table.selectAll')}</button>
```

### 4. Sub-namespaces estándar
- `table.*` - Elementos de tabla
- `toolbar.*` - Barra de herramientas
- `form.*` - Formularios
- `status.*` - Estados
- `actions.*` - Acciones
- `messages.*` - Mensajes
- `labels.*` - Labels genéricos

---

## 🎓 Ejemplos de Referencia

Ver componentes ya migrados:
- `apps/dashboard/app/dashboard-bundui/tasks/components/columns.tsx`
- `apps/dashboard/app/dashboard-bundui/tasks/components/data-table-toolbar.tsx`
- `apps/dashboard/app/dashboard-bundui/hotel/components/booking-list.tsx`

---

## ⚠️ Reglas Importantes

1. **NO modificar** módulos que ya usan `useTranslation()` (tasks, hotel)
2. **Seguir estructura** de sub-namespaces estándar
3. **Hacer commits frecuentes** - uno por módulo
4. **Validar siempre** antes de commitear (`npm run build:dashboard`)
5. **Documentar problemas** en `PLAN_I18N_PENDIENTE.md`

---

## 🚀 Comenzar

1. Leer `PLAN_I18N_PENDIENTE.md` para contexto completo
2. Elegir módulo siguiente (sugerido: `calendar` o `crm-v2`)
3. Seguir workflow por módulo
4. Hacer commit después de cada módulo completado

---

**Última actualización:** 2025-12-21  
**Última sesión completada:** 
- ✅ `default` - Dashboard principal (8 componentes)
- ✅ `ecommerce` - E-Commerce completo (13 componentes con subopciones)

**Próximo módulo sugerido:** `analytics`, `projects`, o `mail` (archivos generados, falta extraer y aplicar)


