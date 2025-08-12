import React from "react";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import { fontVariables } from "@/shared/components/bundui-premium/lib/fonts";

import "./globals.css";

import { ActiveThemeProvider } from "@/shared/components/bundui-premium/components/active-theme";
import { DEFAULT_THEME } from "@/shared/lib/themes";
import { Toaster } from "@/shared/components/bundui-premium/components/ui/sonner";

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

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans", fontVariables)}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <ActiveThemeProvider initialTheme={themeSettings}>
            {children}
            <Toaster position="top-center" richColors />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 