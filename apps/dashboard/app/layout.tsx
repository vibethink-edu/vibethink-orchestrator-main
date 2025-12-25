import React from "react";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { DEFAULT_THEME } from "@/shared/lib/themes";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/lib/i18n";
import { isValidLocale } from "@/lib/i18n/config";
// import { Toaster } from '@vibethink/ui'; // Commented - using Shadcn

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

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        {/* UTF-8 encoding - CRITICAL for universal i18n support */}
        {/* Ensures proper rendering of all Unicode characters (Chinese, Arabic, etc.) */}
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
          <I18nProvider initialLocale={initialLocale} preloadNamespaces={['common', 'navigation', 'theme', 'hotel', 'chat', 'projects', 'mail', 'calendar', 'dashboard-vibethink', 'dashboard-bundui']}>
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
              {/* <Toaster position="top-center" richColors /> */}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
