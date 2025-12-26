/**
 * Translation Loader - Client Registration
 *
 * PURPOSE:
 * Función cliente-safe para registrar el translation loader en el registry de @vibethink/utils.
 * Este archivo puede ser importado por componentes cliente sin causar errores de "fs/promises".
 *
 * ARCHITECTURE:
 * - Este archivo es CLIENT-SAFE (no usa Node.js APIs)
 * - Importa dinámicamente el loader solo en el lado del servidor
 * - Compatible con Next.js App Router
 */

'use client';

/**
 * Registra el translation loader en el registry global de @vibethink/utils
 * Esta función es segura para llamar desde componentes cliente.
 *
 * IMPORTANTE: Solo se ejecuta en el cliente. El loader real se crea en el servidor.
 */
export function registerDashboardTranslationLoaderForTerminology(): void {
  // En el cliente, no necesitamos registrar el loader porque
  // el loader solo se usa en el servidor (RSC)
  //
  // La terminología en el cliente viene del snapshot hydrated,
  // NO del translation loader directamente
  console.log('[TranslationLoader] Client-side registration skipped (uses snapshot instead)');
}
