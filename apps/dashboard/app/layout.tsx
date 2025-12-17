import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { DEFAULT_THEME } from "@/shared/lib/themes";

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
    preset: (cookieStore.get("theme_preset")?.value ?? DEFAULT_THEME.preset) as string,
    scale: (cookieStore.get("theme_scale")?.value ?? DEFAULT_THEME.scale) as string,
    radius: (cookieStore.get("theme_radius")?.value ?? DEFAULT_THEME.radius) as string,
    contentLayout: (cookieStore.get("theme_content_layout")?.value ??
      DEFAULT_THEME.contentLayout) as string
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 
