# Estrategia i18n: Bundui vs VibeThink

## 🎯 Principio Fundamental

**Bundui es referencia en inglés. VibeThink implementa multidioma desde el inicio.**

---

## 📊 Comparación: Bundui vs VibeThink

### `/dashboard-bundui` - Referencia Original

| Característica | Estado |
|---------------|--------|
| **Idioma** | 🇺🇸 Solo Inglés (hardcoded) |
| **Propósito** | Espejo fiel de Bundui Premium original |
| **Modificación** | ❌ NO (o mínimo necesario) |
| **i18n** | ❌ No implementado |
| **Uso** | Referencia, comparación, debugging |
| **Mantenimiento** | Mínimo (solo para mantener espejo) |

**Regla:** Bundui permanece en inglés como referencia. No se implementa i18n aquí.

### `/dashboard-vibethink` - Mejoras con Multidioma

| Característica | Estado |
|---------------|--------|
| **Idioma** | 🌍 Multidioma (Inglés + Español + extensible) |
| **Propósito** | Mejoras, extensiones, nuevas features |
| **Modificación** | ✅ SÍ (total libertad) |
| **i18n** | ✅ Implementado y obligatorio |
| **Uso** | Producción, mejoras, nuevas plantillas |
| **Mantenimiento** | Activo con soporte multidioma |

**Regla:** Todas las mejoras y nuevas plantillas en VibeThink DEBEN usar i18n desde el inicio.

---

## 🚨 Reglas Críticas

### 1. **Nunca Implementar i18n en Bundui**

```tsx
// ❌ INCORRECTO - No hacer esto en dashboard-bundui
import { useTranslation } from '@/lib/i18n';
const { t } = useTranslation('crm');
<h1>{t('header.title')}</h1>

// ✅ CORRECTO - Bundui mantiene inglés hardcoded
<h1>CRM Dashboard</h1>
```

**Razón:** Bundui es referencia. Mantenerlo simple y fiel al original.

### 2. **Siempre Usar i18n en VibeThink**

```tsx
// ❌ INCORRECTO - No hardcodear texto en dashboard-vibethink
<h1>CRM Dashboard</h1>
<p>Manage your customers...</p>

// ✅ CORRECTO - Usar i18n siempre
import { useTranslation } from '@/lib/i18n';
const { t } = useTranslation('crm');
<h1>{t('header.title')}</h1>
<p>{t('header.subtitle')}</p>
```

**Razón:** VibeThink es para producción multidioma. Todo debe ser traducible.

### 3. **Nuevas Plantillas = i18n desde el Inicio**

Cualquier nueva plantilla o componente en `dashboard-vibethink` DEBE:
- ✅ Usar `useTranslation()` desde el primer commit
- ✅ Tener namespace definido en `types.ts`
- ✅ Tener archivos de traducción (en, es) creados
- ✅ Nunca hardcodear texto en inglés

---

## 📋 Workflow para Nuevas Plantillas

### Paso 1: Definir Namespace

**Antes de escribir código**, agregar el namespace:

```typescript
// src/lib/i18n/types.ts
export type TranslationNamespace =
  | 'common'
  | 'crm'
  | 'sales'
  | 'new-module'; // ← Agregar aquí
```

### Paso 2: Crear Archivos de Traducción

```bash
# Crear archivos base
src/lib/i18n/translations/en/new-module.json
src/lib/i18n/translations/es/new-module.json
```

**Estructura inicial:**

```json
// en/new-module.json
{
  "header": {
    "title": "New Module",
    "subtitle": "Module description"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

```json
// es/new-module.json
{
  "header": {
    "title": "Nuevo Módulo",
    "subtitle": "Descripción del módulo"
  },
  "actions": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

### Paso 3: Implementar Componente con i18n

```tsx
'use client';

import { useTranslation } from '@/lib/i18n';

export function NewModuleComponent() {
  const { t } = useTranslation('new-module');
  
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('header.subtitle')}</p>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

### Paso 4: Actualizar Loader (si es necesario)

Si el namespace no está en la lista de preload, agregarlo:

```typescript
// src/lib/i18n/loader.ts
export async function loadAllTranslations(locale: Locale) {
  const namespaces: TranslationNamespace[] = [
    'common',
    'navigation',
    'new-module', // ← Agregar aquí
    // ...
  ];
  // ...
}
```

---

## 🔄 Migración de Componentes Existentes

### Escenario 1: Mejorar Componente de Bundui

**Proceso:**

1. **Copiar componente** de `dashboard-bundui` a `dashboard-vibethink`
2. **Crear namespace** para el módulo
3. **Extraer todos los textos** hardcodeados
4. **Crear traducciones** (en, es)
5. **Reemplazar textos** con `t('key')`
6. **Probar** cambio de idioma

**Ejemplo:**

```tsx
// ANTES (Bundui - inglés hardcoded)
export function CrmHeader() {
  return (
    <div>
      <h1>CRM Dashboard</h1>
      <p>Manage your customers, leads, and sales pipeline</p>
      <Button>Add Customer</Button>
    </div>
  );
}

// DESPUÉS (VibeThink - multidioma)
import { useTranslation } from '@/lib/i18n';

export function CrmHeader() {
  const { t } = useTranslation('crm');
  
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('header.subtitle')}</p>
      <Button>{t('actions.addCustomer')}</Button>
    </div>
  );
}
```

### Escenario 2: Nueva Feature en VibeThink

**Proceso:**

1. **Crear namespace** ANTES de escribir código
2. **Definir estructura** de traducciones
3. **Implementar** con i18n desde el inicio
4. **Nunca** hardcodear texto

---

## 📐 Estructura de Traducciones por Módulo

### Convención de Nombres

```json
{
  "header": {
    "title": "...",
    "subtitle": "..."
  },
  "actions": {
    "save": "...",
    "cancel": "...",
    "delete": "..."
  },
  "table": {
    "columns": {
      "name": "...",
      "email": "..."
    },
    "empty": "..."
  },
  "messages": {
    "success": "...",
    "error": "..."
  },
  "filters": {
    "search": "...",
    "status": "..."
  }
}
```

### Reglas de Organización

1. **`header`**: Títulos y subtítulos
2. **`actions`**: Botones y acciones
3. **`table`**: Tablas y listas
4. **`messages`**: Mensajes de éxito/error
5. **`filters`**: Filtros y búsqueda
6. **`form`**: Formularios (labels, placeholders, validación)

---

## ✅ Checklist para Nuevas Plantillas

Antes de crear una nueva plantilla en `dashboard-vibethink`:

- [ ] Namespace agregado a `types.ts`
- [ ] Archivos de traducción creados (`en/` y `es/`)
- [ ] Estructura de traducciones definida
- [ ] Componente usa `useTranslation()` desde el inicio
- [ ] No hay texto hardcoded en inglés
- [ ] Probado cambio de idioma
- [ ] Formateo de fechas/monedas usa funciones de i18n

---

## 🎨 Mejores Prácticas

### 1. **Usar Common para Elementos Reutilizables**

```tsx
// ✅ CORRECTO - Usar common para botones genéricos
const { t: tCommon } = useTranslation('common');
<Button>{tCommon('buttons.save')}</Button>

// ✅ CORRECTO - Usar namespace específico para contenido del módulo
const { t } = useTranslation('crm');
<h1>{t('header.title')}</h1>
```

### 2. **Parámetros en Traducciones**

```json
// translations/en/crm.json
{
  "welcome": "Welcome, {name}!"
}
```

```tsx
// Componente
const { t } = useTranslation('crm');
<p>{t('welcome', { name: 'John' })}</p>
// Output: "Welcome, John!"
```

### 3. **Formateo de Datos**

```tsx
// ✅ CORRECTO - Usar funciones de formateo de i18n
const { formatCurrency, formatDate, formatNumber } = useI18n();

<p>{formatCurrency(1234.56)}</p>
<p>{formatDate(new Date())}</p>
<p>{formatNumber(1234567)}</p>
```

### 4. **Pluralización (Futuro)**

```json
{
  "items": {
    "one": "{count} item",
    "other": "{count} items"
  }
}
```

---

## 🔍 Debugging

### Verificar Traducciones

```tsx
// En desarrollo, verificar que las keys existen
const { t } = useTranslation('crm');
console.log(t('header.title')); // Debe mostrar traducción, no la key
```

### Fallback a Inglés

Si una traducción no existe en español, el sistema automáticamente:
1. Busca en español
2. Si no existe, busca en inglés
3. Si no existe, muestra la key

---

## 📚 Referencias

- [Arquitectura i18n Completa](./I18N_ARCHITECTURE.md)
- [AGENTS.md](../../AGENTS.md) - Reglas de arquitectura de dashboards
- [Guía de Uso i18n](./I18N_USAGE_GUIDE.md) - Guía práctica de uso

---

## 🚀 Resumen Ejecutivo

| Aspecto | Bundui | VibeThink |
|---------|--------|-----------|
| **Idioma** | Solo Inglés | Multidioma |
| **i18n** | ❌ No | ✅ Sí (obligatorio) |
| **Nuevas Features** | ❌ No | ✅ Sí |
| **Mejoras** | ❌ No | ✅ Sí |
| **Producción** | ❌ No | ✅ Sí |

**Regla de Oro:** 
- **Bundui** = Referencia en inglés (no tocar)
- **VibeThink** = Producción multidioma (siempre con i18n)

---

**Última actualización:** 2025-01-XX  
**Versión:** 1.0.0


