# i18n Lazy Loading Strategy: 9 Idiomas Eficientes

**Fecha:** 2025-12-25
**Estado:** 🎯 ESTRATEGIA APROBADA
**Objetivo:** 9 idiomas base con carga selectiva por usuario/workspace

---

## 🎯 Concepto Central

**Base universal de 9 idiomas:**
- en, es, ar, zh, fr, pt, de, **it**, **ja**

**Pero solo cargamos en memoria:**
- Idioma preferido del usuario
- Idioma del workspace (si difiere)
- Fallback (inglés)

**Máximo en memoria:** 1-3 idiomas simultáneos (~50-150KB vs 450KB de cargar todo)

---

## 📊 Los 9 Idiomas Oficiales

### Idiomas Actuales (7)
| Código | Idioma | Hablantes | Script | Dirección | Estado |
|--------|--------|-----------|--------|-----------|--------|
| `en` | English | 1.5B | Latin | LTR | ✅ Base |
| `es` | Spanish | 500M | Latin | LTR | ✅ Completo |
| `ar` | Arabic | 420M | Arabic | **RTL** | ⚠️ 40% |
| `zh` | Chinese | 1.3B | Han | LTR | ⚠️ 40% |
| `fr` | French | 280M | Latin | LTR | ⚠️ 40% |
| `pt` | Portuguese | 260M | Latin | LTR | ⚠️ 40% |
| `de` | German | 135M | Latin | LTR | ⚠️ 40% |

### Nuevos Idiomas (2)
| Código | Idioma | Hablantes | Script | Dirección | Prioridad |
|--------|--------|-----------|--------|-----------|-----------|
| `it` | Italian | 85M | Latin | LTR | P2 |
| `ja` | Japanese | 125M | Japanese | LTR | P2 |

**Total:** 9 idiomas, ~4.6B hablantes

---

## 🚀 Arquitectura de Carga Selectiva

### 1. Estructura de Archivos (Sin Cambios)

```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   ├── common.json
│   ├── analytics.json
│   └── ...
├── es/
├── ar/
├── zh/
├── fr/
├── pt/
├── de/
├── it/          ← NUEVO
└── ja/          ← NUEVO
```

**Nota:** Todos los idiomas en filesystem, pero **NO todos en bundle**

### 2. Sistema de Carga Dinámica

#### 2.1 Configuración Actualizada

**Archivo:** `apps/dashboard/src/lib/i18n/locale-config.ts`

```typescript
// Expandir a 9 idiomas
export type SupportedLocale =
  | 'en' | 'es' | 'ar' | 'zh'
  | 'fr' | 'pt' | 'de'
  | 'it' | 'ja';  // ← NUEVOS

export const LOCALE_CONFIGS: Record<SupportedLocale, LocaleConfig> = {
  // ... existing 7 configs

  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    currency: { code: 'EUR', symbol: '€', position: 'after', decimals: 2 },
    numbers: { decimalSeparator: ',', thousandsSeparator: '.' },
    voice: { language: 'it-IT', region: 'IT' },
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  },

  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    currency: { code: 'JPY', symbol: '¥', position: 'before', decimals: 0 },
    numbers: { decimalSeparator: '.', thousandsSeparator: ',' },
    voice: { language: 'ja-JP', region: 'JP' },
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h'
  }
};
```

#### 2.2 Loader Dinámico (NUEVO)

**Archivo:** `apps/dashboard/src/lib/i18n/dynamic-loader.ts` (CREAR)

```typescript
/**
 * Dynamic i18n Loader - Load only needed languages
 *
 * Strategy:
 * 1. Load user's preferred language
 * 2. Load workspace default language (if different)
 * 3. Always have 'en' as fallback
 *
 * Result: Max 1-3 languages in memory at once
 */

import { SupportedLocale } from './locale-config';

interface LoadedTranslations {
  locale: SupportedLocale;
  namespaces: Record<string, any>;
  loadedAt: number;
}

class I18nDynamicLoader {
  private loaded: Map<SupportedLocale, LoadedTranslations> = new Map();
  private maxCached = 3; // Keep max 3 languages in memory

  /**
   * Load language on-demand
   * Uses Next.js dynamic import for code splitting
   */
  async loadLanguage(locale: SupportedLocale): Promise<LoadedTranslations> {
    // Check cache first
    if (this.loaded.has(locale)) {
      return this.loaded.get(locale)!;
    }

    console.log(`[i18n] Loading language: ${locale}`);

    try {
      // Dynamic import - only loads this language's bundle
      const translations = await import(
        `./translations/${locale}/index.ts`
      );

      const loaded: LoadedTranslations = {
        locale,
        namespaces: translations.default,
        loadedAt: Date.now()
      };

      // Add to cache
      this.loaded.set(locale, loaded);

      // Cleanup old entries if exceeding limit
      this.cleanupCache();

      return loaded;
    } catch (error) {
      console.error(`[i18n] Failed to load ${locale}:`, error);

      // Fallback to English
      if (locale !== 'en') {
        return this.loadLanguage('en');
      }

      throw error;
    }
  }

  /**
   * Preload languages for user
   * Called on login/workspace switch
   */
  async preloadForUser(
    userLocale: SupportedLocale,
    workspaceLocale?: SupportedLocale
  ): Promise<void> {
    const toLoad = new Set<SupportedLocale>([
      'en',  // Always have fallback
      userLocale
    ]);

    if (workspaceLocale && workspaceLocale !== userLocale) {
      toLoad.add(workspaceLocale);
    }

    await Promise.all(
      Array.from(toLoad).map(locale => this.loadLanguage(locale))
    );

    console.log(`[i18n] Preloaded languages:`, Array.from(toLoad));
  }

  /**
   * Cleanup cache - keep only most recently used
   */
  private cleanupCache(): void {
    if (this.loaded.size <= this.maxCached) return;

    const entries = Array.from(this.loaded.entries());

    // Sort by loadedAt (oldest first)
    entries.sort((a, b) => a[1].loadedAt - b[1].loadedAt);

    // Remove oldest, but NEVER remove 'en'
    for (let i = 0; i < entries.length - this.maxCached; i++) {
      const [locale] = entries[i];
      if (locale !== 'en') {
        console.log(`[i18n] Evicting from cache: ${locale}`);
        this.loaded.delete(locale);
      }
    }
  }

  /**
   * Get loaded language (sync)
   * Returns undefined if not loaded yet
   */
  getLoaded(locale: SupportedLocale): LoadedTranslations | undefined {
    return this.loaded.get(locale);
  }

  /**
   * Clear all cache (useful for logout)
   */
  clearCache(): void {
    console.log('[i18n] Clearing translation cache');
    this.loaded.clear();
  }

  /**
   * Get cache stats (for debugging)
   */
  getCacheStats() {
    return {
      loaded: Array.from(this.loaded.keys()),
      count: this.loaded.size,
      maxCached: this.maxCached,
      memoryEstimate: `~${this.loaded.size * 50}KB`
    };
  }
}

// Singleton instance
export const i18nLoader = new I18nDynamicLoader();
```

#### 2.3 Translation Index per Language

**Crear:** `apps/dashboard/src/lib/i18n/translations/[locale]/index.ts`

**Ejemplo para `en/index.ts`:**

```typescript
/**
 * English Translation Bundle
 *
 * This file is lazy-loaded via dynamic import
 * Only loaded when user/workspace needs English
 */

export default {
  common: () => import('./common.json').then(m => m.default),
  analytics: () => import('./analytics.json').then(m => m.default),
  'api-keys': () => import('./api-keys.json').then(m => m.default),
  // ... all other namespaces
};
```

**Beneficio:** Cada idioma es un chunk separado en el bundle

### 3. Integración con Context

#### 3.1 Actualizar I18nContext

**Archivo:** `apps/dashboard/src/lib/i18n/context.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLocale } from './locale-config';
import { i18nLoader } from './dynamic-loader';

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  isLoading: boolean;
  availableLocales: SupportedLocale[];
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  children,
  userLocale,
  workspaceLocale
}: {
  children: React.ReactNode;
  userLocale?: SupportedLocale;
  workspaceLocale?: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    userLocale || workspaceLocale || 'en'
  );
  const [isLoading, setIsLoading] = useState(true);

  // Preload languages on mount
  useEffect(() => {
    async function preload() {
      setIsLoading(true);
      await i18nLoader.preloadForUser(
        userLocale || 'en',
        workspaceLocale
      );
      setIsLoading(false);

      console.log('[i18n] Cache stats:', i18nLoader.getCacheStats());
    }

    preload();
  }, [userLocale, workspaceLocale]);

  const setLocale = async (newLocale: SupportedLocale) => {
    setIsLoading(true);

    // Load new language if not cached
    await i18nLoader.loadLanguage(newLocale);

    setLocaleState(newLocale);
    setIsLoading(false);

    // Persist preference
    localStorage.setItem('user-locale', newLocale);
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        isLoading,
        availableLocales: ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ja']
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
```

### 4. Detección de Usuario/Workspace

#### 4.1 User Preferences

**Fuentes (en orden de prioridad):**

1. **User Profile DB:**
   ```typescript
   interface UserProfile {
     id: string;
     preferredLocale: SupportedLocale;
     // ...
   }
   ```

2. **Workspace Settings:**
   ```typescript
   interface Workspace {
     id: string;
     defaultLocale: SupportedLocale;
     allowedLocales: SupportedLocale[]; // Subset de los 9
     // ...
   }
   ```

3. **Browser Preference:**
   ```typescript
   const browserLocale = navigator.language.split('-')[0] as SupportedLocale;
   ```

4. **Fallback:**
   ```typescript
   const fallback = 'en';
   ```

#### 4.2 Lógica de Detección

**Archivo:** `apps/dashboard/src/lib/i18n/detection.ts` (CREAR)

```typescript
import { SupportedLocale } from './locale-config';

interface LocalePreferences {
  userLocale: SupportedLocale;
  workspaceLocale?: SupportedLocale;
  browserLocale: SupportedLocale;
}

/**
 * Detect user's locale preferences
 * Priority: User Profile > Workspace > Browser > Fallback
 */
export async function detectLocalePreferences(
  userId?: string,
  workspaceId?: string
): Promise<LocalePreferences> {

  // 1. Get user preference from DB
  const userLocale = userId
    ? await getUserPreferredLocale(userId)
    : undefined;

  // 2. Get workspace default
  const workspaceLocale = workspaceId
    ? await getWorkspaceDefaultLocale(workspaceId)
    : undefined;

  // 3. Get browser preference
  const browserLocale = getBrowserLocale();

  // 4. Determine final locale
  const finalLocale = userLocale || workspaceLocale || browserLocale || 'en';

  return {
    userLocale: finalLocale,
    workspaceLocale,
    browserLocale
  };
}

async function getUserPreferredLocale(userId: string): Promise<SupportedLocale | undefined> {
  try {
    const response = await fetch(`/api/users/${userId}/preferences`);
    const data = await response.json();
    return data.preferredLocale;
  } catch (error) {
    console.error('[i18n] Failed to fetch user locale:', error);
    return undefined;
  }
}

async function getWorkspaceDefaultLocale(workspaceId: string): Promise<SupportedLocale | undefined> {
  try {
    const response = await fetch(`/api/workspaces/${workspaceId}/settings`);
    const data = await response.json();
    return data.defaultLocale;
  } catch (error) {
    console.error('[i18n] Failed to fetch workspace locale:', error);
    return undefined;
  }
}

function getBrowserLocale(): SupportedLocale {
  const supported: SupportedLocale[] = ['en', 'es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ja'];

  const browserLang = navigator.language.split('-')[0].toLowerCase();

  if (supported.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }

  return 'en';
}
```

---

## 📦 Impacto en Bundle Size

### Antes (Cargar todo)

```
Todos los idiomas cargados al inicio:
- en: 50KB
- es: 50KB
- ar: 50KB
- zh: 50KB
- fr: 50KB
- pt: 50KB
- de: 50KB
- it: 50KB
- ja: 50KB
--------------
Total: 450KB en memoria
```

### Después (Carga selectiva)

```
Escenario típico (usuario español, workspace inglés):
- en: 50KB (fallback)
- es: 50KB (usuario)
--------------
Total: 100KB en memoria (~78% reducción)

Escenario máximo (3 idiomas):
- en: 50KB (fallback)
- es: 50KB (usuario)
- fr: 50KB (workspace)
--------------
Total: 150KB en memoria (~67% reducción)
```

**Ahorro:** 67-78% de memoria

---

## 🎯 Plan de Implementación

### Fase 1: Agregar Italiano y Japonés (Semana 1)

**Tasks:**
1. ✅ Actualizar `locale-config.ts` con `it` y `ja`
2. ✅ Crear directorios `translations/it/` y `translations/ja/`
3. ✅ Copiar estructura JSON de `en/` como base
4. ⚠️ Generar traducciones (AI-assisted)
5. ✅ Actualizar tipos TypeScript

**Tiempo:** 2-3 días (sin traducciones), 2 semanas (con traducciones)

### Fase 2: Implementar Lazy Loading (Semana 2)

**Tasks:**
1. ✅ Crear `dynamic-loader.ts`
2. ✅ Crear `index.ts` por cada idioma
3. ✅ Actualizar `I18nContext` para usar loader
4. ✅ Implementar `detection.ts`
5. ✅ Testing de carga dinámica

**Tiempo:** 3-4 días

### Fase 3: Integración con User/Workspace (Semana 3)

**Tasks:**
1. ✅ API endpoints para user preferences
2. ✅ API endpoints para workspace settings
3. ✅ DB schema para locale preferences
4. ✅ UI para selector de idioma
5. ✅ Persistencia de preferencias

**Tiempo:** 4-5 días

### Fase 4: Optimización y Testing (Semana 4)

**Tasks:**
1. ✅ Bundle analysis
2. ✅ Performance testing
3. ✅ Cache invalidation strategy
4. ✅ Documentación de uso
5. ✅ Rollout gradual

**Tiempo:** 3-4 días

---

## 🔧 Configuración de Build

### Next.js Config

**Archivo:** `next.config.js`

```javascript
module.exports = {
  // Habilitar code splitting por idioma
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,

        // Crear chunk separado por idioma
        translations: {
          test: /translations\/(en|es|ar|zh|fr|pt|de|it|ja)\//,
          name(module) {
            const match = module.context.match(/translations\/([^/]+)\//);
            return match ? `translations-${match[1]}` : 'translations';
          },
          chunks: 'async',
          priority: 10
        }
      };
    }
    return config;
  }
};
```

**Resultado:** Bundles separados por idioma

```
_next/static/chunks/
├── translations-en.js  (50KB)
├── translations-es.js  (50KB)
├── translations-ar.js  (50KB)
├── translations-zh.js  (50KB)
├── translations-fr.js  (50KB)
├── translations-pt.js  (50KB)
├── translations-de.js  (50KB)
├── translations-it.js  (50KB) ← NUEVO
└── translations-ja.js  (50KB) ← NUEVO
```

Solo se descarga el chunk del idioma que el usuario necesita.

---

## 📊 Métricas de Éxito

### Performance

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Initial Bundle | 450KB | 100-150KB | 67-78% |
| Page Load | +800ms | +200ms | 75% |
| Memory Usage | 450KB | 100-150KB | 67-78% |
| Network Transfer | 450KB | 100-150KB | 67-78% |

### User Experience

- ✅ Idioma correcto al iniciar sesión
- ✅ Cambio de idioma < 500ms
- ✅ Persistencia de preferencia
- ✅ Sincronización con workspace

---

## 🎓 Ejemplos de Uso

### Ejemplo 1: Usuario Español en Workspace Inglés

```typescript
// Usuario Juan (España) en workspace internacional (inglés)

// 1. Login detecta preferencias
const prefs = await detectLocalePreferences('user-juan', 'workspace-acme');
// Result: { userLocale: 'es', workspaceLocale: 'en', browserLocale: 'es' }

// 2. Preload solo necesarios
await i18nLoader.preloadForUser('es', 'en');
// Carga: en (fallback), es (usuario)
// NO carga: ar, zh, fr, pt, de, it, ja

// 3. Juan trabaja en español
<I18nProvider userLocale="es" workspaceLocale="en">
  {/* Toda la UI en español */}
</I18nProvider>

// 4. Si Juan cambia a workspace francés
await setWorkspace('workspace-france');
// Auto-carga: fr (workspace nuevo)
// Mantiene: en, es
// Cache: [en, es, fr] (3 idiomas máximo)
```

### Ejemplo 2: Usuario Japonés en Workspace Japonés

```typescript
// Usuario Yuki (Japón) en workspace japonés

// 1. Detección
const prefs = await detectLocalePreferences('user-yuki', 'workspace-tokyo');
// Result: { userLocale: 'ja', workspaceLocale: 'ja', browserLocale: 'ja' }

// 2. Preload
await i18nLoader.preloadForUser('ja', 'ja');
// Carga: en (fallback), ja (usuario)
// Solo 2 idiomas en memoria

// 3. Bundle descargado
// - translations-en.js (50KB) - fallback
// - translations-ja.js (50KB) - usuario
// Total: 100KB (vs 450KB si cargara todo)
```

---

## ✅ Checklist de Implementación

### Setup Inicial
- [ ] Actualizar `SupportedLocale` type con `it` y `ja`
- [ ] Agregar configs de `it` y `ja` en `LOCALE_CONFIGS`
- [ ] Crear directorios `translations/it/` y `translations/ja/`
- [ ] Copiar estructura JSON base

### Lazy Loading
- [ ] Crear `dynamic-loader.ts`
- [ ] Crear `index.ts` en cada directorio de idioma
- [ ] Actualizar `I18nContext` para usar loader
- [ ] Implementar `detection.ts`
- [ ] Configurar Next.js webpack para code splitting

### Backend Integration
- [ ] API endpoint `/api/users/:id/preferences`
- [ ] API endpoint `/api/workspaces/:id/settings`
- [ ] DB migration para user locale preference
- [ ] DB migration para workspace default locale

### UI/UX
- [ ] Language selector component
- [ ] Loading state durante cambio de idioma
- [ ] Persistencia en localStorage
- [ ] Sincronización con server

### Testing
- [ ] Unit tests para `dynamic-loader`
- [ ] Integration tests para carga de idiomas
- [ ] E2E tests para cambio de idioma
- [ ] Performance benchmarks

### Documentación
- [ ] Actualizar `GLOBAL_MULTILINGUAL_STANDARD.md`
- [ ] Guía de uso para desarrolladores
- [ ] Guía de traducción para content team

---

## 📚 Referencias

- **Next.js Dynamic Imports:** https://nextjs.org/docs/advanced-features/dynamic-import
- **Code Splitting:** https://webpack.js.org/guides/code-splitting/
- **i18next Lazy Loading:** https://www.i18next.com/how-to/add-or-load-translations

---

**Documento creado:** 2025-12-25
**Estado:** ✅ Estrategia aprobada, listo para implementación
**Próximo paso:** Implementar Fase 1 (Agregar it + ja)
