/**
 * Translation Loader Interface
 * 
 * Interface para cargar traducciones.
 * Implementación real vive en apps/dashboard.
 * 
 * Este patrón permite que packages/utils use traducciones
 * sin importar JSON directamente desde apps/*
 */

/**
 * Interface para cargar traducciones
 */
export interface TranslationLoader {
  /**
   * Carga traducciones para un namespace y locale
   * @param locale - Locale (ej: 'en', 'es')
   * @param namespace - Namespace (ej: 'hotel', 'concept')
   * @returns Traducciones como objeto
   */
  load(locale: string, namespace: string): Promise<Record<string, any>>;
  
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
}







