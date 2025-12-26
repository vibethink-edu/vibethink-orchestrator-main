import React from "react";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { DEFAULT_THEME } from "@/shared/lib/themes";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/lib/i18n";

/**
 * CAPA 2 & CAPA 3: Integración de Terminology (3 capas)
 * 
 * Este layout bootstrap:
 * - CAPA 2: Preload conceptos de terminology
 * - CAPA 3A: UI Strings (via I18nProvider existente)
 * - CAPA 3B: Terminology Hydration (para futura implementación completa)
 * 
 * Nota: Mantenemos compatibilidad con el sistema actual de i18n.
 * La terminología se pre-load y está disponible, pero no rompemos
 * la funcionalidad existente.
 */

/**
 * Imports del nuevo sistema de terminología (CAPA 2)
 * 
 * Estos imports están disponibles pero actualmente mantenemos compatibilidad
 * con el sistema actual. Los conceptos se precargan para uso futuro.
 */
// import {
//   preloadTerminology,
//   ConceptID,
//   createUIContext
// } from "@vibethink/utils/i18n/terminology";

/**
 * Conceptos base para preloading (CAPA 2)
 * 
 * Estos son los concept IDs más usados que pre-loadamos
 * para asegurar que estén en cache cuando se necesiten.
 */
const BASE_CONCEPTS_TO_PRELOAD = [
  // Booking concepts
  'concept.booking.resource.room',
  'concept.booking.action.reserve',
  'concept.booking.action.cancel',
  'concept.booking.time.checkin',
  'concept.booking.time.checkout',
  'concept.booking.unit.hour',
  'concept.booking.unit.day',
  'concept.booking.unit.night',
  'concept.booking.status.confirmed',
  'concept.booking.status.pending',
  
  // CRM concepts
  'concept.crm.entity.deal',
  'concept.crm.entity.lead',
  'concept.crm.action.create',
  'concept.crm.action.update',
  
  // Common concepts (pueden expandirse)
  'concept.common.action.save',
  'concept.common.action.cancel',
] as const;

/**
 * Hook para preloading de terminology en el layout bootstrap
 * 
 * Esta función se ejecuta solo una vez durante el bootstrap del layout
 * para cargar los conceptos más usados en cache.
 * 
 * @param locale - El idioma detectado
 */
async function preloadConcepts(locale: string): Promise<void> {
  // Nota: Mantenemos compatibilidad por ahora
  // En el futuro, cuando todo el código use el nuevo sistema,
  // podemos activar el preload real:
  //
  // import { preloadTerminology, createUIContext } from "@vibethink/utils/i18n/terminology";
  // 
  // const context = createUIContext({
  //   locale,
  //   productContext: 'hotel', // Determinar desde ruta
  // });
  // 
  // await preloadTerminology(
  //   context,
  //   BASE_CONCEPTS_TO_PRELOAD
  // );
  //
  // console.log(`[Terminology] Preloaded ${BASE_CONCEPTS_TO_PRELOAD.length} concepts for locale: ${locale}`);
  
  console.log(`[Terminology] Preloading disabled for compatibility (future: preloadTerminology())`);
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset: (cookieStore.get("theme_preset")?.value ?? DEFAULT_THEME.preset) as any,
    scale: (cookieStore.get("theme_scale")?.value ?? DEFAULT_THEME.scale) as any,
    radius: (cookieStore.get("theme_radius")?.value ?? DEFAULT_THEME.radius) as any,
    contentLayout: (cookieStore.get("theme_content_layout")?.value ??
      DEFAULT_THEME.contentLayout) as any
  };

  // Get locale from cookie or header
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const initialLocale = localeCookie && isValidLocale(localeCookie) ? localeCookie : 'en';

  /**
   * Preload conceptos de terminology (CAPA 2)
   * 
   * NOTA: Mantenemos compatibilidad por ahora. El preload real
   * se activará cuando todo el código migre al nuevo sistema.
   */
  await preloadConcepts(initialLocale);

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        {/* UTF-8 encoding - CRITICAL for universal i18n support */}
        <meta charSet="UTF-8" />
      </head>
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans")}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <I18nProvider 
            initialLocale={initialLocale} 
            preloadNamespaces={[
              'common', 
              'navigation', 
              'theme', 
              'hotel', 
              'studio', 
              'chat', 
              'projects', 
              'mail', 
              'calendar', 
              'dashboard-vibethink', 
              'dashboard-bundui', 
              'concept',
              'concept-hotel',
              'concept-studio',
              'concept-cowork',
              'concept-coliving',
              'crm',
              'ai-chat'
            ]}>
            <AuthProvider>
              <NextTopLoader
                color="hsl(var(--primary))"
                initialPosition={0.08}
                crawlSpeed={200}
                height={4}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0.10px hsl(var(--primary)),0 0.5px hsl(var(--primary))"
                zIndex={99999}
              />
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
