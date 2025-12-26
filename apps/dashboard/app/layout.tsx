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
 * CAPA 2 & CAPA 3: Integración de Terminología (3 capas)
 * 
 * IMPORTANTE: Usar la implementación de CAPA 1 desde @vibethink/utils
 * que incluye los 9 idiomas oficiales (en, es, fr, pt, de, it, ko, ar, zh)
 * y los concept IDs canónicos inmutables.
 */

/**
 * Importar isValidLocale desde la implementación CAPA 1 (terminology)
 * 
 * NOTA: Usar @vibethink/utils/i18n/terminology en lugar de @/lib/i18n/config
 * porque terminology/types.ts tiene la implementación completa con:
 * - 9 idiomas oficiales (en, es, fr, pt, de, it, ko, ar, zh)
 * - Concept IDs canónicos inmutables
 * - Contextos multi-nivel
 * - Validadores robustos
 */
import {
  isValidLocale,
  Locale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from "@vibethink/utils/i18n/terminology/types";

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

  // Get locale from cookie or header with proper validation
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const initialLocale: Locale = localeCookie && isValidLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;

  /**
   * CAPA 2: Preload conceptos de terminology (CAPA 2)
   * 
   * Preload de conceptos base para uso en UI components.
   * NOTA: En esta fase, mantenemos compatibilidad con el sistema existente
   * y NO rompemos nada. El preload real se activará cuando todo el código use
   * el sistema de 3 capas completo.
   * 
   * Futuro: Activar `preloadTerminology()` cuando estemos listos.
   */
  async function preloadConcepts(locale: Locale): Promise<void> {
    // NOTA: Mantenemos compatibilidad por ahora.
    // En el futuro, podemos activar el preload real desde @vibethink/utils
    // 
    // import { preloadTerminology } from "@vibethink/utils/i18n/terminology/engine";
    // const context = createUIContext({ locale, productContext: 'hotel' });
    // await preloadTerminology(context, [
    //   'concept.booking.resource.room',
    //   'concept.booking.action.reserve',
    //   // ... más conceptos
    // ]);
    //
    console.log(`[Terminology] Preload disabled for compatibility (future: enable full preload)`);
  }

  // Preload conceptos para el idioma actual
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
              'cowork', 
              'coliving', 
              'chat', 
              'projects', 
              'mail', 
              'calendar', 
              'dashboard-vibethink', 
              'dashboard-bundui', 
              'crm',
              'ai-chat',
              'concept',
              'concept-hotel',
              'concept-studio',
              'concept-cowork',
              'concept-coliving'
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
                shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
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
