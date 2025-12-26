# i18n Selective Language Loading - Workspace & User Preferences

**Fecha:** 2025-12-26
**Estado:** 📋 POLÍTICA DEFINIDA - Requiere CAPA 3 completa
**Versión:** 1.0.0
**Dependencia:** CAPA 3 (TerminologyProvider + Snapshot pattern)

---

## 🎯 PROPÓSITO

Definir la política y arquitectura para cargar selectivamente idiomas según preferencias de usuario/workspace, evitando cargar los 9 idiomas completos cuando solo se necesitan 2-3.

**Beneficios:**
- ✅ Reducción de bundle size (60-70% menos datos)
- ✅ Mejora de performance (menos archivos JSON cargados)
- ✅ Flexibilidad por workspace (cada tenant define sus idiomas)
- ✅ Experiencia optimizada (usuario solo ve idiomas relevantes)

---

## 📊 PROBLEMA ACTUAL

### **Sin filtro (Sistema actual):**

```
Usuario en workspace "Restaurante La Pasta"
├─→ Workspace solo opera en: Español, Inglés, Italiano
├─→ Sistema carga: TODOS los 9 idiomas (405 archivos)
│   ├─→ en ✅ (necesario)
│   ├─→ es ✅ (necesario)
│   ├─→ it ✅ (necesario)
│   ├─→ fr ❌ (no necesario - 45 archivos cargados sin uso)
│   ├─→ pt ❌ (no necesario - 45 archivos cargados sin uso)
│   ├─→ de ❌ (no necesario - 45 archivos cargados sin uso)
│   ├─→ ko ❌ (no necesario - 45 archivos cargados sin uso)
│   ├─→ ar ❌ (no necesario - 45 archivos cargados sin uso)
│   └─→ zh ❌ (no necesario - 45 archivos cargados sin uso)
└─→ Resultado: 270 archivos cargados innecesariamente (67% desperdicio)
```

### **Con filtro (Propuesta):**

```
Usuario en workspace "Restaurante La Pasta"
├─→ Workspace configurado con: ['es', 'en', 'it']
├─→ Sistema carga: SOLO 3 idiomas (135 archivos)
│   ├─→ en ✅ (45 archivos)
│   ├─→ es ✅ (45 archivos)
│   └─→ it ✅ (45 archivos)
└─→ Resultado: 67% menos archivos cargados
```

---

## 🏗️ ARQUITECTURA DE SOLUCIÓN

### **Nivel 1: Configuración de Workspace (Base de Datos)**

```typescript
// Modelo de datos en BD
interface Workspace {
  id: string;                    // "workspace-123"
  name: string;                  // "Restaurante La Pasta"
  type: 'hotel' | 'restaurant' | 'studio' | 'cowork' | 'coliving';
  settings: {
    i18n: {
      allowedLocales: Locale[];  // ['es', 'en', 'it']
      defaultLocale: Locale;     // 'es'
      fallbackLocale: Locale;    // 'en'
    };
  };
}

// Ejemplo
const workspace = {
  id: 'workspace-123',
  name: 'Restaurante La Pasta',
  type: 'restaurant',
  settings: {
    i18n: {
      allowedLocales: ['es', 'en', 'it'],  // ✅ Solo 3 idiomas
      defaultLocale: 'es',                  // Español por defecto
      fallbackLocale: 'en'                  // Inglés si falla
    }
  }
};
```

### **Nivel 2: Preferencias de Usuario**

```typescript
interface User {
  id: string;
  email: string;
  workspaceId: string;
  preferences: {
    locale: Locale;  // 'es', 'en', 'it', etc.
  };
}

// Ejemplo
const user = {
  id: 'user-456',
  email: 'chef@lapasta.com',
  workspaceId: 'workspace-123',
  preferences: {
    locale: 'es'  // Prefiere español
  }
};
```

### **Nivel 3: Validación y Fallback**

```typescript
// apps/dashboard/lib/i18n/locale-validator.ts

export function getValidLocale(
  userLocale: Locale | undefined,
  workspace: Workspace
): Locale {
  // 1. Obtener idiomas permitidos por workspace
  const allowedLocales = workspace.settings.i18n.allowedLocales;
  const defaultLocale = workspace.settings.i18n.defaultLocale;

  // 2. Si usuario no tiene preferencia, usar default del workspace
  if (!userLocale) {
    return defaultLocale;
  }

  // 3. Validar que el idioma del usuario está permitido
  if (!allowedLocales.includes(userLocale)) {
    console.warn(
      `User locale "${userLocale}" not allowed for workspace. Using default "${defaultLocale}"`
    );
    return defaultLocale;
  }

  // 4. Retornar idioma válido
  return userLocale;
}
```

---

## 🔧 IMPLEMENTACIÓN (CAPA 3 Requerida)

### **Paso 1: Server-Side Snapshot Loading**

```typescript
// apps/dashboard/app/layout.tsx

import { getValidLocale } from '@/lib/i18n/locale-validator';
import { getSnapshot } from '@vibethink/utils/i18n/terminology';
import { TerminologyProvider } from '@vibethink/utils/i18n/terminology';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // 1. Obtener usuario y workspace
  const user = await getCurrentUser();
  const workspace = await getWorkspace(user.workspaceId);

  // 2. Validar y obtener locale actual
  const currentLocale = getValidLocale(user.preferences.locale, workspace);

  // 3. Obtener conceptos usados en esta ruta
  const conceptIds = [
    'concept.booking.action.reserve',
    'concept.booking.action.cancel',
    'concept.restaurant.item.menu',
    'concept.restaurant.action.order',
    // ... solo conceptos usados en este layout
  ];

  // 4. Crear snapshot SOLO para el locale actual
  const snapshot = await getSnapshot(conceptIds, {
    locale: currentLocale,              // ✅ SOLO 1 idioma
    productContext: workspace.type,     // 'restaurant'
    tenantId: workspace.id
  });

  // 5. Hidratar cliente con SOLO ese idioma
  return (
    <html lang={currentLocale}>
      <body>
        <TerminologyProvider snapshot={snapshot}>
          <LanguageSwitcher
            currentLocale={currentLocale}
            allowedLocales={workspace.settings.i18n.allowedLocales}
          />
          {children}
        </TerminologyProvider>
      </body>
    </html>
  );
}
```

### **Paso 2: Client-Side Language Switcher**

```typescript
// apps/dashboard/components/language-switcher.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Locale } from '@vibethink/utils';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  allowedLocales: Locale[];
}

export function LanguageSwitcher({
  currentLocale,
  allowedLocales
}: LanguageSwitcherProps) {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (newLocale: Locale) => {
    // 1. Validar que el idioma está permitido
    if (!allowedLocales.includes(newLocale)) {
      console.warn(`Locale ${newLocale} not allowed for this workspace`);
      return;
    }

    // 2. Mostrar loading
    setIsChanging(true);

    try {
      // 3. Hacer request al servidor para cambiar idioma
      const response = await fetch('/api/i18n/change-locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: newLocale })
      });

      if (!response.ok) {
        throw new Error('Failed to change locale');
      }

      // 4. Recargar página con nuevo idioma
      router.refresh();
    } catch (error) {
      console.error('Error changing language:', error);
      setIsChanging(false);
    }
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => handleLanguageChange(e.target.value as Locale)}
      disabled={isChanging}
      className="px-3 py-2 border rounded-md"
    >
      {allowedLocales.map((locale) => (
        <option key={locale} value={locale}>
          {getLanguageName(locale)}
        </option>
      ))}
    </select>
  );
}

// Helper para mostrar nombre del idioma
function getLanguageName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    pt: 'Português',
    de: 'Deutsch',
    it: 'Italiano',
    ko: '한국어',
    ar: 'العربية',
    zh: '中文'
  };
  return names[locale] || locale;
}
```

### **Paso 3: API Endpoint para Cambio de Idioma**

```typescript
// apps/dashboard/app/api/i18n/change-locale/route.ts

import { NextResponse } from 'next/server';
import type { Locale } from '@vibethink/utils';

export async function POST(request: Request) {
  try {
    // 1. Obtener locale del body
    const { locale } = await request.json() as { locale: Locale };

    // 2. Obtener usuario y workspace
    const user = await getCurrentUser();
    const workspace = await getWorkspace(user.workspaceId);

    // 3. Validar que el idioma está permitido
    if (!workspace.settings.i18n.allowedLocales.includes(locale)) {
      return NextResponse.json(
        {
          error: 'Locale not allowed for this workspace',
          allowedLocales: workspace.settings.i18n.allowedLocales
        },
        { status: 403 }
      );
    }

    // 4. Actualizar preferencia del usuario en BD
    await updateUserPreference(user.id, { locale });

    // 5. Retornar success
    return NextResponse.json({ success: true, locale });
  } catch (error) {
    console.error('Error changing locale:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **Paso 4: TranslationLoader con Filtro**

```typescript
// apps/dashboard/lib/i18n/translation-loader.ts

import type { TranslationLoader } from '@vibethink/utils';

// Cache interno
const cache = new Map<string, any>();

export const dashboardTranslationLoader: TranslationLoader = {
  load: async (locale: string, namespace: string) => {
    try {
      // 1. Obtener workspace actual
      const workspace = await getWorkspace();

      // 2. Validar que el idioma está permitido
      if (!workspace.settings.i18n.allowedLocales.includes(locale as Locale)) {
        console.warn(`Skipping load for non-allowed locale: ${locale}`);
        return null;  // ✅ No cargar si no está permitido
      }

      // 3. Cargar archivo JSON
      const data = await import(
        `@/lib/i18n/translations/${locale}/${namespace}.json`
      );
      return data.default;
    } catch (error) {
      console.error(`Failed to load ${locale}/${namespace}:`, error);
      return null;
    }
  },

  loadSync: (locale: string, namespace: string) => {
    const key = `${locale}:${namespace}`;
    return cache.get(key) || null;
  },

  preload: async (locale: string, namespace: string) => {
    const key = `${locale}:${namespace}`;
    const data = await dashboardTranslationLoader.load(locale, namespace);
    if (data) {
      cache.set(key, data);
    }
  },

  isPreloaded: (locale: string, namespace: string) => {
    const key = `${locale}:${namespace}`;
    return cache.has(key);
  },

  clearCache: (locale?: string, namespace?: string) => {
    if (locale && namespace) {
      const key = `${locale}:${namespace}`;
      cache.delete(key);
    } else if (locale) {
      for (const [key] of cache) {
        if (key.startsWith(`${locale}:`)) {
          cache.delete(key);
        }
      }
    } else {
      cache.clear();
    }
  }
};
```

---

## 📊 MÉTRICAS DE OPTIMIZACIÓN

### **Métrica 1: Reducción de Bundle Size**

**Workspace con 3 idiomas (en, es, it):**

```
Sin filtro:
- 9 idiomas × 45 archivos × ~2 KB/archivo = ~810 KB
- Cliente carga: 810 KB

Con filtro:
- 3 idiomas × 45 archivos × ~2 KB/archivo = ~270 KB
- Cliente carga: 270 KB

Reducción: 67% menos datos (540 KB ahorrados)
```

**Workspace con 2 idiomas (en, es):**

```
Sin filtro: 810 KB
Con filtro: 180 KB
Reducción: 78% menos datos (630 KB ahorrados)
```

### **Métrica 2: Performance (Tiempo de Carga)**

**Medición:**

```typescript
// Medir tiempo de carga de idiomas
console.time('locale-load');
await loadLocale(currentLocale);
console.timeEnd('locale-load');

// Sin filtro (9 idiomas): ~150-200ms
// Con filtro (3 idiomas): ~50-70ms
// Mejora: 65% más rápido
```

### **Métrica 3: Requests al Servidor**

```
Sin filtro:
- 9 idiomas × 45 archivos = 405 requests (lazy loading)

Con filtro:
- 3 idiomas × 45 archivos = 135 requests
- Reducción: 67% menos requests
```

---

## 🛡️ VALIDACIONES Y SEGURIDAD

### **Validación 1: Workspace Settings**

```typescript
// Validar configuración de workspace al crearlo
export const WorkspaceI18nSettingsSchema = z.object({
  allowedLocales: z.array(z.enum(SUPPORTED_LOCALES)).min(1).max(9),
  defaultLocale: z.enum(SUPPORTED_LOCALES),
  fallbackLocale: z.enum(SUPPORTED_LOCALES)
}).refine(
  (data) => data.allowedLocales.includes(data.defaultLocale),
  { message: 'defaultLocale must be in allowedLocales' }
).refine(
  (data) => data.allowedLocales.includes(data.fallbackLocale),
  { message: 'fallbackLocale must be in allowedLocales' }
);
```

### **Validación 2: User Locale Change**

```typescript
// API endpoint valida que usuario solo puede elegir idiomas permitidos
export async function POST(request: Request) {
  const { locale } = await request.json();
  const workspace = await getWorkspace();

  // ✅ VALIDACIÓN OBLIGATORIA
  if (!workspace.settings.i18n.allowedLocales.includes(locale)) {
    return NextResponse.json(
      { error: 'Locale not allowed' },
      { status: 403 }
    );
  }

  // Continuar...
}
```

### **Validación 3: Fallback Automático**

```typescript
// Si usuario tiene locale no permitido, usar default del workspace
export function getValidLocale(
  userLocale: Locale | undefined,
  workspace: Workspace
): Locale {
  if (!userLocale) {
    return workspace.settings.i18n.defaultLocale;
  }

  // ✅ Fallback automático si no está permitido
  if (!workspace.settings.i18n.allowedLocales.includes(userLocale)) {
    return workspace.settings.i18n.defaultLocale;
  }

  return userLocale;
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: CAPA 3 (Prerequisito)**

- [ ] Implementar `TerminologyProvider` (React Context)
- [ ] Implementar `TerminologyHydration` component
- [ ] Implementar `getSnapshot()` function
- [ ] Implementar `useTerm()` hook
- [ ] Validar que snapshot pattern funciona correctamente

### **Fase 2: Configuración de Workspace**

- [ ] Agregar campo `i18n` a modelo de Workspace en BD
- [ ] Crear migration para agregar campos
- [ ] Agregar validación Zod para `WorkspaceI18nSettings`
- [ ] Crear UI para configurar idiomas permitidos (admin panel)

### **Fase 3: Filtro de Carga**

- [ ] Implementar `locale-validator.ts`
- [ ] Actualizar `layout.tsx` para usar snapshot con filtro
- [ ] Implementar `LanguageSwitcher` component
- [ ] Crear API endpoint `/api/i18n/change-locale`
- [ ] Actualizar `TranslationLoader` para validar idiomas permitidos

### **Fase 4: Testing**

- [ ] Crear workspace de prueba con 2 idiomas (en, es)
- [ ] Verificar que solo se cargan 2 idiomas
- [ ] Probar cambio de idioma en UI
- [ ] Verificar que usuario no puede elegir idiomas no permitidos
- [ ] Medir reducción de bundle size

### **Fase 5: Documentación**

- [ ] Documentar configuración de workspace
- [ ] Documentar cómo agregar/quitar idiomas permitidos
- [ ] Crear guía para admins de workspace
- [ ] Actualizar README con feature de filtro de idiomas

---

## 🎯 BENEFICIOS ESPERADOS

1. **Performance:**
   - 65-78% reducción en bundle size
   - 65% más rápido en carga de idiomas
   - 67% menos requests al servidor

2. **Experiencia de usuario:**
   - Usuario solo ve idiomas relevantes
   - Cambio de idioma más rápido
   - Interfaz más limpia (menos opciones)

3. **Costo de infraestructura:**
   - Menos ancho de banda consumido
   - Menos procesamiento en servidor
   - Menor carga en CDN (si se usa)

4. **Flexibilidad:**
   - Cada workspace puede tener sus idiomas
   - Facil agregar/quitar idiomas por workspace
   - No afecta a otros workspaces

---

## 📚 REFERENCIAS

- `docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md` - Arquitectura completa
- `INSTRUCCIONES_Z_AI.md` - Tareas pendientes para implementar CAPA 3
- `docs/SCRIPTS_REFERENCE.md` - Scripts de validación

---

**CREADO POR:** Claude
**FECHA:** 2025-12-26
**VERSIÓN:** 1.0.0
**ESTADO:** 📋 Política definida - Requiere CAPA 3 completa
**DEPENDENCIA:** CAPA 3 (TerminologyProvider + Snapshot pattern)
