/**
 * Dashboard Translation Loader Implementation
 * 
 * Implementación real del TranslationLoader para apps/dashboard
 * Se registra en el registry de packages/utils
 */

'use client';

import { TranslationLoader } from '@vibethink/utils';
import { loadTranslation } from './loader';
import {
  getCachedTranslation,
  setCachedTranslation,
  isCached,
  clearTerminologyCache,
} from '@vibethink/utils';

/**
 * Cache síncrono para traducciones precargadas
 */
const syncCache = new Map<string, Record<string, any>>();

/**
 * Implementación del TranslationLoader para dashboard
 */
class DashboardTranslationLoader implements TranslationLoader {
  async load(locale: string, namespace: string): Promise<Record<string, any>> {
    // Usar loader existente
    const translation = await loadTranslation(locale as any, namespace as any);

    // Cachear también en cache síncrono para termSync()
    const cacheKey = `${locale}:${namespace}`;
    syncCache.set(cacheKey, translation);

    return translation;
  }

  loadSync(locale: string, namespace: string): Record<string, any> | null {
    // Cargar desde cache síncrono (requiere preload previo)
    const cacheKey = `${locale}:${namespace}`;
    return syncCache.get(cacheKey) || null;
  }

  async preload(locale: string, namespace: string): Promise<void> {
    // Preload = load + cache
    await this.load(locale, namespace);
  }

  isPreloaded(locale: string, namespace: string): boolean {
    const cacheKey = `${locale}:${namespace}`;
    return syncCache.has(cacheKey);
  }

  clearCache(locale?: string, namespace?: string): void {
    if (locale && namespace) {
      // Limpiar específico
      const cacheKey = `${locale}:${namespace}`;
      syncCache.delete(cacheKey);
    } else if (locale) {
      // Limpiar todo del locale
      for (const key of syncCache.keys()) {
        if (key.startsWith(`${locale}:`)) {
          syncCache.delete(key);
        }
      }
    } else {
      // Limpiar todo
      syncCache.clear();
    }

    // También limpiar cache de terminología
    clearTerminologyCache();
  }
}

/**
 * Instancia singleton
 */
let loaderInstance: DashboardTranslationLoader | null = null;

/**
 * Obtiene o crea la instancia del loader
 */
export function getDashboardTranslationLoader(): DashboardTranslationLoader {
  if (!loaderInstance) {
    loaderInstance = new DashboardTranslationLoader();
  }
  return loaderInstance;
}

/**
 * Registra el loader en el registry global
 * Debe llamarse durante inicialización (layout.tsx o I18nProvider)
 */
export function registerDashboardTranslationLoader(): void {
  const loader = getDashboardTranslationLoader();
  const { registerTranslationLoader } = require('@vibethink/utils');
  registerTranslationLoader(loader);
}




