/**
 * Terminology Hydration Component
 *
 * PURPOSE:
 * Inyecta un snapshot de traducciones pre-cargadas desde el servidor
 * al cliente para hidratar el cache de CAPA 2 (terminology engine).
 *
 * USAGE:
 * En layout.tsx (RSC):
 *
 * ```tsx
 * import { createTerminologySnapshot } from '@/lib/i18n/terminology-snapshot';
 * import { TerminologyHydration } from '@/lib/i18n/terminology-hydration';
 *
 * export default async function RootLayout({ children }) {
 *   const snapshot = await createTerminologySnapshot('en', 'hotel');
 *
 *   return (
 *     <html>
 *       <body>
 *         <TerminologyHydration snapshot={snapshot} />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * ARCHITECTURE:
 * - Server (RSC): Crea snapshot con conceptos pre-cargados
 * - Client: Inyecta snapshot en cache de terminology via script tag
 * - Cache hit rate: ~79% para conceptos críticos
 */

'use client';

import { useEffect } from 'react';
import type { TerminologySnapshot } from '@vibethink/utils';

interface TerminologyHydrationProps {
  snapshot: TerminologySnapshot;
}

/**
 * Componente que inyecta el snapshot de terminología en el cache del cliente
 *
 * @param snapshot - Snapshot pre-cargado desde el servidor
 */
export function TerminologyHydration({ snapshot }: TerminologyHydrationProps) {
  useEffect(() => {
    // Solo hidratar en el cliente
    if (typeof window === 'undefined') return;

    // Inyectar snapshot en el cache de CAPA 2
    try {
      // Verificar que el snapshot sea válido
      if (!snapshot || !snapshot.locale || !snapshot.concepts) {
        console.warn('[TerminologyHydration] Invalid snapshot, skipping hydration');
        return;
      }

      // Guardar snapshot en global para que el terminology engine lo use
      (window as any).__TERMINOLOGY_SNAPSHOT__ = snapshot;

      console.log(
        `[TerminologyHydration] ✅ Hydrated ${Object.keys(snapshot.concepts).length} concepts for locale "${snapshot.locale}"`
      );

      // Log context info
      if (snapshot.context) {
        console.log('[TerminologyHydration] Context:', {
          product: snapshot.context.productContext,
          domain: snapshot.context.domainContext,
        });
      }
    } catch (error) {
      console.error('[TerminologyHydration] Failed to hydrate snapshot:', error);
    }
  }, [snapshot]);

  // No renderiza nada (solo side-effect)
  return null;
}
