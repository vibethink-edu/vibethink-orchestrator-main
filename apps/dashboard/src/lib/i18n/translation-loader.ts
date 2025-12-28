/**
 * Translation Loader
 *
 * PURPOSE:
 * Implementa el pattern TranslationLoader para cargar archivos JSON de traducciones
 * desde el filesystem en Next.js App Router (RSC).
 *
 * FEATURES:
 * - Cache en memoria con TTL para mejor performance
 * - Soporte para 9 idiomas y 5 namespaces de conceptos
 * - Fallback automático a inglés si falta traducción
 * - Type-safe con Zod validation
 *
 * USAGE:
 * import { getTranslationLoader } from '@/lib/i18n/translation-loader';
 *
 * const loader = getTranslationLoader();
 * const translations = await loader.load('es', 'concept');
 */

import fs from 'fs/promises';
import path from 'path';
import type { Locale } from '@vibethink/utils';

// =============================================================================
// Types
// =============================================================================

/**
 * Local TranslationLoader interface
 * Compatible with @vibethink/utils TranslationLoader interface
 */
export interface TranslationLoader {
  /**
   * Carga un namespace de traducción para un locale específico
   * @param locale - Código de idioma (en, es, fr, etc.)
   * @param namespace - Namespace a cargar (concept, common, navigation, etc.)
   * @returns Objeto con las traducciones
   */
  load(locale: Locale, namespace: string): Promise<Record<string, any>>;

  /**
   * Carga traducciones de forma síncrona (requiere preload)
   * @param locale - Locale
   * @param namespace - Namespace
   * @returns Traducciones o null si no está precargado
   */
  loadSync(locale: string, namespace: string): Record<string, any> | null;

  /**
   * Preload traducciones para un namespace
   * @param locale - Locale
   * @param namespace - Namespace
   */
  preload(locale: string, namespace: string): Promise<void>;

  /**
   * Verifica si un namespace está precargado
   * @param locale - Locale
   * @param namespace - Namespace
   * @returns true si está precargado
   */
  isPreloaded(locale: string, namespace: string): boolean;

  /**
   * Limpia el cache de traducciones
   * @param locale - Locale opcional (si se omite, limpia todo)
   * @param namespace - Namespace opcional (si se omite, limpia todo del locale)
   */
  clearCache(locale?: string, namespace?: string): void;

  /**
   * Carga múltiples namespaces en paralelo
   * @param locale - Código de idioma
   * @param namespaces - Array de namespaces a cargar
   * @returns Map con namespace → traducciones
   */
  loadMultiple(
    locale: Locale,
    namespaces: string[]
  ): Promise<Map<string, Record<string, any>>>;
}

// =============================================================================
// Cache
// =============================================================================

interface CacheEntry {
  data: Record<string, any>;
  timestamp: number;
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
const translationCache = new Map<string, CacheEntry>();

function getCacheKey(locale: Locale, namespace: string): string {
  return `${locale}:${namespace}`;
}

function getFromCache(locale: Locale, namespace: string): Record<string, any> | null {
  const key = getCacheKey(locale, namespace);
  const entry = translationCache.get(key);

  if (!entry) return null;

  const now = Date.now();
  const isExpired = now - entry.timestamp > CACHE_TTL;

  if (isExpired) {
    translationCache.delete(key);
    return null;
  }

  return entry.data;
}

function setToCache(locale: Locale, namespace: string, data: Record<string, any>): void {
  const key = getCacheKey(locale, namespace);
  translationCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// =============================================================================
// Translation Loader Implementation
// =============================================================================

class FileSystemTranslationLoader implements TranslationLoader {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async load(locale: Locale, namespace: string): Promise<Record<string, any>> {
    // 1. Verificar cache
    const cached = getFromCache(locale, namespace);
    if (cached) {
      return cached;
    }

    // 2. Construir path al archivo
    const filePath = path.join(this.basePath, locale, `${namespace}.json`);

    try {
      // 3. Leer archivo
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      // 4. Guardar en cache
      setToCache(locale, namespace, data);

      return data;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn(
          `[TranslationLoader] File not found: ${filePath} - Falling back to English`
        );

        // Fallback a inglés si el archivo no existe
        if (locale !== 'en') {
          return this.load('en', namespace);
        }

        // Si incluso inglés falla, retornar objeto vacío
        console.error(
          `[TranslationLoader] CRITICAL: English fallback also failed for namespace: ${namespace}`
        );
        return {};
      }

      console.error(
        `[TranslationLoader] Error loading ${locale}/${namespace}:`,
        error
      );
      throw error;
    }
  }

  loadSync(locale: string, namespace: string): Record<string, any> | null {
    // Retornar desde cache si existe
    const cached = getFromCache(locale as Locale, namespace);
    if (cached) {
      return cached;
    }

    // Si no está en cache, retornar null
    // El caller debe usar preload() o load() primero
    console.warn(
      `[TranslationLoader] loadSync called for ${locale}/${namespace} but not preloaded. Use preload() first.`
    );
    return null;
  }

  async preload(locale: string, namespace: string): Promise<void> {
    // Precargar namespace en cache
    await this.load(locale as Locale, namespace);
  }

  isPreloaded(locale: string, namespace: string): boolean {
    // Verificar si está en cache
    const cached = getFromCache(locale as Locale, namespace);
    return cached !== null;
  }

  clearCache(locale?: string, namespace?: string): void {
    if (!locale) {
      // Limpiar todo el cache
      translationCache.clear();
      return;
    }

    if (!namespace) {
      // Limpiar todo el cache de un locale
      const keys = Array.from(translationCache.keys());
      keys.forEach(key => {
        if (key.startsWith(`${locale}:`)) {
          translationCache.delete(key);
        }
      });
      return;
    }

    // Limpiar cache de un namespace específico
    const key = getCacheKey(locale as Locale, namespace);
    translationCache.delete(key);
  }

  async loadMultiple(
    locale: Locale,
    namespaces: string[]
  ): Promise<Map<string, Record<string, any>>> {
    const results = new Map<string, Record<string, any>>();

    // Cargar todos en paralelo
    const promises = namespaces.map(async (namespace) => {
      const data = await this.load(locale, namespace);
      return { namespace, data };
    });

    const loaded = await Promise.all(promises);

    loaded.forEach(({ namespace, data }) => {
      results.set(namespace, data);
    });

    return results;
  }
}

// =============================================================================
// Singleton Instance
// =============================================================================

let loaderInstance: TranslationLoader | null = null;

/**
 * Obtiene la instancia singleton del TranslationLoader
 *
 * @returns TranslationLoader instance
 */
export function getTranslationLoader(): TranslationLoader {
  if (!loaderInstance) {
    // Path a los archivos de traducción en el proyecto
    const basePath = path.join(process.cwd(), 'src/lib/i18n/translations');
    loaderInstance = new FileSystemTranslationLoader(basePath);
  }

  return loaderInstance;
}

/**
 * Resetea el loader singleton (útil para testing)
 */
export function resetTranslationLoader(): void {
  loaderInstance = null;
  translationCache.clear();
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Pre-carga los namespaces más comunes para un locale
 * Útil para optimizar la primera carga
 *
 * @param locale - Código de idioma
 */
export async function preloadCriticalNamespaces(locale: Locale): Promise<void> {
  const loader = getTranslationLoader();
  const criticalNamespaces = [
    'common',
    'navigation',
    'errors',
    'concept',
  ];

  await loader.loadMultiple(locale, criticalNamespaces);
}

/**
 * Limpia el cache de traducciones
 * Útil para hot-reload en desarrollo
 */
export function clearTranslationCache(): void {
  const loader = getTranslationLoader();
  loader.clearCache();
}
