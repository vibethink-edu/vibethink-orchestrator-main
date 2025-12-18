import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import { ActiveThemeProvider, DEFAULT_THEME } from "@vibethink/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pana - VibeThink Dashboard",
  description: "El amigo que orquesta tu empresa",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset: (cookieStore.get("vthink_theme_preset")?.value ?? DEFAULT_THEME.preset) as string,
    baseColor: (cookieStore.get("vthink_theme_base_color")?.value ?? DEFAULT_THEME.baseColor) as string,
    font: (cookieStore.get("vthink_theme_font")?.value ?? DEFAULT_THEME.font) as string,
    scale: (cookieStore.get("vthink_theme_scale")?.value ?? DEFAULT_THEME.scale) as string,
    radius: (cookieStore.get("vthink_theme_radius")?.value ?? DEFAULT_THEME.radius) as string,
    contentLayout: (cookieStore.get("vthink_theme_content_layout")?.value ??
      DEFAULT_THEME.contentLayout) as string,
    sidebarMode: (cookieStore.get("vthink_theme_sidebar_mode")?.value ?? DEFAULT_THEME.sidebarMode) as string
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
        className={cn("bg-background group/layout font-sans")}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <ActiveThemeProvider>
            {children}
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
