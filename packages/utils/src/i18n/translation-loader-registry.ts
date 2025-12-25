/**
 * Translation Loader Registry
 * 
 * Registry pattern para inyectar el TranslationLoader
 * desde apps/dashboard sin crear dependencias circulares.
 */

import { TranslationLoader } from './translation-loader.interface';

/**
 * Instancia global del loader
 */
let loaderInstance: TranslationLoader | null = null;

/**
 * Registra el TranslationLoader
 * Debe llamarse desde apps/dashboard durante inicialización
 * 
 * @param loader - Instancia del loader
 */
export function registerTranslationLoader(loader: TranslationLoader): void {
  loaderInstance = loader;
}

/**
 * Obtiene el TranslationLoader registrado
 * 
 * @throws Error si no está registrado
 */
export function getTranslationLoader(): TranslationLoader {
  if (!loaderInstance) {
    throw new Error(
      'TranslationLoader not registered. ' +
      'Call registerTranslationLoader() from apps/dashboard during initialization. ' +
      'This should happen in app/layout.tsx or I18nProvider initialization.'
    );
  }
  return loaderInstance;
}

/**
 * Verifica si el loader está registrado
 */
export function isTranslationLoaderRegistered(): boolean {
  return loaderInstance !== null;
}




