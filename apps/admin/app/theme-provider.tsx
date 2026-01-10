/**
 * Copied from: apps/dashboard/app/theme-provider.tsx
 * Last synced: 2026-01-10
 * Adaptations: Changed storageKey to 'admin-theme'
 */
"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface NextThemeProviderProps {
    children: ReactNode;
}

export function NextThemeProvider({ children }: NextThemeProviderProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="admin-theme"
        >
            {children}
        </ThemeProvider>
    );
}
