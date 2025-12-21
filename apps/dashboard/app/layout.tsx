import React from "react";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
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
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans")}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <I18nProvider initialLocale={initialLocale} preloadNamespaces={['common', 'navigation', 'theme']}>
            <AuthProvider>
              {children}
              {/* <Toaster position="top-center" richColors /> */}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
