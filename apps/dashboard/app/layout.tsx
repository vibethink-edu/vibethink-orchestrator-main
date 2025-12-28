import React from "react";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { DEFAULT_THEME } from "@/shared/lib/themes";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/lib/i18n";
import { TerminologyHydration } from "@/lib/i18n/terminology-hydration";

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
 * NOTA: Usar @vibethink/utils (main export) en lugar de path directo
 * porque el package exporta desde dist/index.js
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
} from "@vibethink/utils";

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
   * CAPA 2: Registrar translation loader en @vibethink/utils
   *
   * Esto permite que el terminology engine pueda cargar traducciones.
   * Solo se ejecuta en el servidor (RSC).
   */
  const { getTranslationLoader } = await import('@/lib/i18n/translation-loader');
  const { registerTranslationLoader } = await import('@vibethink/utils');
  registerTranslationLoader(getTranslationLoader());

  /**
   * CAPA 2: Preload critical namespaces para el terminology engine
   *
   * Pre-carga los namespaces más comunes para el locale actual.
   * Esto mejora el cache hit rate (~79%) para las primeras requests.
   */
  const { preloadCriticalNamespaces, createTerminologySnapshot } = await import('@/lib/i18n/terminology-snapshot');
  await preloadCriticalNamespaces(initialLocale, 'hotel');

  /**
   * CAPA 2: Crear snapshot de terminología para hidratación en cliente
   *
   * El snapshot contiene los conceptos más usados pre-cargados,
   * lo que permite al cliente resolver términos sin round-trips adicionales.
   */
  const terminologySnapshot = await createTerminologySnapshot(initialLocale, 'hotel');

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  // RTL support for Arabic, Hebrew, Persian, and Urdu
  const isRTL = initialLocale === 'ar' || initialLocale === 'he' || initialLocale === 'fa' || initialLocale === 'ur';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <html lang={initialLocale} dir={direction} suppressHydrationWarning>
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
              'default',
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
            {/* CAPA 2: Hydrate terminology snapshot en cliente */}
            <TerminologyHydration snapshot={terminologySnapshot} />

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
