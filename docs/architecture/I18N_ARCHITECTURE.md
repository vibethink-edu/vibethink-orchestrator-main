# Arquitectura i18n - Sistema Multidioma

## 📋 Resumen Ejecutivo

Sistema de internacionalización (i18n) completo y escalable para `dashboard-vibethink` que soporta múltiples idiomas con estructura modular, type-safety, y carga incremental de traducciones.

**Idiomas soportados inicialmente:**
- 🇺🇸 Inglés (en) - Default
- 🇪🇸 Español (es)

**Extensible a:** Cualquier idioma siguiendo la misma estructura.

---

## 🏗️ Arquitectura General

### Estructura de Archivos

```
apps/dashboard/
├── src/lib/i18n/
│   ├── types.ts              # TypeScript types y interfaces
│   ├── config.ts              # Configuración central
│   ├── utils.ts               # Utilidades (formateo, parsing)
│   ├── loader.ts              # Cargador dinámico de traducciones
│   ├── context.tsx            # React Context y Provider
│   ├── index.ts               # Exportaciones principales
│   └── translations/
│       ├── en/                # Traducciones en inglés
│       │   ├── common.json
│       │   ├── navigation.json
│       │   ├── crm.json
│       │   ├── sales.json
│       │   └── ... (otros módulos)
│       └── es/                # Traducciones en español
│           ├── common.json
│           ├── navigation.json
│           ├── crm.json
│           ├── sales.json
│           └── ... (otros módulos)
├── middleware.ts              # Next.js middleware para detección de idioma
└── components/i18n/
    └── LocaleSelector.tsx     # Componente selector de idioma
```

---

## 🎯 Características Principales

### 1. **Type-Safe Translations**
- TypeScript types completos para todas las traducciones
- Autocompletado en IDE
- Validación en tiempo de compilación

### 2. **Namespaces Modulares**
- Cada módulo tiene su propio namespace
- Carga incremental (solo carga lo necesario)
- Organización clara y mantenible

### 3. **Detección Automática de Idioma**
- Middleware de Next.js detecta idioma del navegador
- Persistencia en cookies y localStorage
- Fallback inteligente a idioma por defecto

### 4. **Formateo Inteligente**
- Fechas según locale
- Monedas con símbolo correcto
- Números con separadores apropiados
- Porcentajes formateados

### 5. **Carga Dinámica**
- Code splitting por namespace
- Cache en memoria
- Preload de traducciones comunes

---

## 📦 Componentes del Sistema

### 1. Types (`types.ts`)

Define todos los tipos TypeScript para type-safety:

```typescript
type Locale = 'en' | 'es';
type TranslationNamespace = 'common' | 'crm' | 'sales' | ...;
```

### 2. Config (`config.ts`)

Configuración centralizada:
- Idiomas disponibles
- Metadata de cada idioma (bandera, formato de fecha, moneda)
- Configuración de almacenamiento

### 3. Utils (`utils.ts`)

Funciones utilitarias:
- `getNestedValue()` - Obtener valor de objeto anidado
- `replaceParams()` - Reemplazar placeholders `{name}`
- `formatDate()`, `formatCurrency()`, `formatNumber()` - Formateo

### 4. Loader (`loader.ts`)

Carga dinámica de traducciones:
- Import dinámico para code splitting
- Cache en memoria
- Fallback a inglés si falla

### 5. Context (`context.tsx`)

React Context Provider:
- `I18nProvider` - Provider principal
- `useI18n()` - Hook general
- `useTranslation(namespace)` - Hook por namespace

### 6. Middleware (`middleware.ts`)

Next.js middleware:
- Detecta idioma del navegador
- Establece cookie de locale
- Agrega header `x-locale` para server components

---

## 🚀 Uso en Componentes

### Ejemplo Básico

```tsx
'use client';

import { useTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useTranslation('crm');
  
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('header.subtitle')}</p>
    </div>
  );
}
```

### Con Parámetros

```tsx
const { t } = useTranslation('common');

// En JSON: "welcome": "Welcome, {name}!"
<p>{t('welcome', { name: 'John' })}</p>
// Output: "Welcome, John!"
```

### Múltiples Namespaces

```tsx
const { t: tCrm } = useTranslation('crm');
const { t: tCommon } = useTranslation('common');

<Button>{tCommon('buttons.save')}</Button>
<h1>{tCrm('header.title')}</h1>
```

### Formateo de Datos

```tsx
const { formatDate, formatCurrency, formatNumber } = useI18n();

<p>{formatDate(new Date())}</p>
<p>{formatCurrency(1234.56)}</p>
<p>{formatNumber(1234567)}</p>
```

---

## 📝 Estructura de Traducciones

### Namespace: `common`

Elementos comunes reutilizables:

```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    ...
  },
  "labels": {
    "name": "Name",
    "email": "Email",
    ...
  },
  "messages": {
    "saved": "Saved successfully",
    ...
  }
}
```

### Namespace: `crm`

Traducciones específicas del módulo CRM:

```json
{
  "header": {
    "title": "CRM Dashboard",
    "subtitle": "Manage your customers..."
  },
  "metrics": {
    "totalCustomers": "Total Customers",
    "revenue": "Revenue"
  }
}
```

---

## 🔧 Agregar Nuevo Idioma

### Paso 1: Agregar a Types

```typescript
// src/lib/i18n/types.ts
export type Locale = 'en' | 'es' | 'fr'; // Agregar 'fr'
```

### Paso 2: Agregar Configuración

```typescript
// src/lib/i18n/config.ts
export const localeMetadata: Record<Locale, LocaleMetadata> = {
  // ... existentes
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: new Intl.Locale('fr-FR'),
  },
};
```

### Paso 3: Crear Archivos de Traducción

```
src/lib/i18n/translations/fr/
├── common.json
├── navigation.json
├── crm.json
└── ... (otros módulos)
```

### Paso 4: Actualizar AVAILABLE_LOCALES

```typescript
export const AVAILABLE_LOCALES: Locale[] = ['en', 'es', 'fr'];
```

---

## 🔧 Agregar Nuevo Namespace

### Paso 1: Agregar a Types

```typescript
// src/lib/i18n/types.ts
export type TranslationNamespace =
  | 'common'
  | 'crm'
  | 'new-module'; // Agregar nuevo
```

### Paso 2: Crear Archivos de Traducción

```
src/lib/i18n/translations/en/new-module.json
src/lib/i18n/translations/es/new-module.json
```

### Paso 3: Usar en Componente

```tsx
const { t } = useTranslation('new-module');
```

---

## 🎨 Selector de Idioma

El componente `LocaleSelector` está integrado en el header:

```tsx
import { LocaleSelector } from '@/components/i18n/LocaleSelector';

<LocaleSelector />
```

Muestra:
- Bandera del idioma actual
- Dropdown con todos los idiomas disponibles
- Persistencia automática al cambiar

---

## 🔄 Flujo de Detección de Idioma

1. **Middleware** detecta idioma:
   - Cookie `NEXT_LOCALE`
   - Header `Accept-Language`
   - Fallback a `en`

2. **I18nProvider** inicializa:
   - Lee cookie/localStorage
   - Carga traducciones comunes
   - Establece locale en contexto

3. **Componentes** usan traducciones:
   - Hook `useTranslation()` obtiene traducciones
   - Carga lazy de namespaces no usados
   - Cache para evitar recargas

---

## 📊 Backend (Futuro)

### Estructura Propuesta

Si en el futuro se necesita backend para traducciones dinámicas:

```
server/
├── routes/
│   └── i18n.ts              # API routes para traducciones
├── services/
│   └── translation-service.ts # Servicio de traducciones
└── database/
    └── translations/         # Tabla de traducciones (opcional)
```

### API Endpoints Propuestos

```typescript
GET /api/i18n/translations/:locale/:namespace
POST /api/i18n/translations/:locale/:namespace (admin)
GET /api/i18n/locales
```

**Nota:** Actualmente las traducciones son estáticas (JSON files). El backend sería para:
- Traducciones dinámicas (CMS)
- Traducciones gestionadas por usuarios
- Traducciones A/B testing

---

## 🧪 Testing

### Ejemplo de Test

```typescript
import { renderHook } from '@testing-library/react';
import { I18nProvider } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n';

test('translates correctly', () => {
  const { result } = renderHook(() => useTranslation('crm'), {
    wrapper: I18nProvider,
  });

  expect(result.current.t('header.title')).toBe('CRM Dashboard');
});
```

---

## 📈 Performance

### Optimizaciones Implementadas

1. **Code Splitting**: Cada namespace se carga dinámicamente
2. **Cache en Memoria**: Traducciones cargadas se cachean
3. **Preload**: Traducciones comunes se precargan
4. **Lazy Loading**: Namespaces se cargan solo cuando se usan

### Métricas Esperadas

- Tiempo inicial: < 50ms (solo common + navigation)
- Carga de namespace: < 10ms (desde cache)
- Tamaño bundle: ~2KB por namespace (gzipped)

---

## 🐛 Troubleshooting

### Problema: Traducción no se muestra

**Solución:**
1. Verificar que el namespace existe en `types.ts`
2. Verificar que el archivo JSON existe
3. Verificar la key en el JSON
4. Revisar consola para warnings

### Problema: Formateo incorrecto

**Solución:**
1. Verificar `localeMetadata` en `config.ts`
2. Verificar que `Intl` está disponible
3. Verificar formato en `utils.ts`

### Problema: Idioma no persiste

**Solución:**
1. Verificar que `I18nProvider` está en el layout raíz
2. Verificar que middleware está configurado
3. Verificar cookies en DevTools

---

## 📚 Referencias

- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [TypeScript Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

---

## ✅ Checklist de Implementación

- [x] Estructura de archivos creada
- [x] Types TypeScript definidos
- [x] Configuración centralizada
- [x] Sistema de carga dinámica
- [x] React Context y hooks
- [x] Middleware de Next.js
- [x] Utilidades de formateo
- [x] Traducciones iniciales (en, es)
- [x] Componente selector de idioma
- [x] Integración en layout raíz
- [x] Documentación completa

---

**Última actualización:** 2025-01-XX
**Versión:** 1.0.0




