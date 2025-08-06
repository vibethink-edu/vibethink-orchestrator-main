"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_THEME, ThemeType, THEMES } from "@/shared/lib/themes";

function setThemeCookie(key: string, value: string | null) {
  if (typeof window === "undefined") return;

  if (!value || value === "default" || value === "none") {
    document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
  } else {
    document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
  }
}

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function VThinkThemeProvider({
  children,
  initialTheme
}: {
  children: ReactNode;
  initialTheme?: ThemeType;
}) {
  const [theme, setTheme] = useState<ThemeType>(() => {
    console.log("🎨 VThinkThemeProvider: Initializing with theme:", initialTheme || DEFAULT_THEME);
    return initialTheme ? initialTheme : DEFAULT_THEME;
  });

  useEffect(() => {
    console.log("🎨 VThinkThemeProvider: Applying theme changes:", theme);
    
    const root = document.documentElement;
    const body = document.body;

    // Apply theme preset colors
    if (theme.preset !== "default") {
      console.log("🎨 VThinkThemeProvider: Applying preset:", theme.preset);
      setThemeCookie("theme_preset", theme.preset);
      body.setAttribute("data-theme-preset", theme.preset);
      
      // Find the theme colors and apply them
      const themeData = THEMES.find(t => t.value === theme.preset);
      if (themeData && themeData.colors[0]) {
        const colorHsl = themeData.colors[0].replace("hsl(", "").replace(")", "");
        root.style.setProperty("--primary", colorHsl);
        root.style.setProperty("--chart-1", colorHsl);
        console.log("🎨 VThinkThemeProvider: Applied color:", colorHsl);
      }
    } else {
      console.log("🎨 VThinkThemeProvider: Resetting to default theme");
      setThemeCookie("theme_preset", null);
      body.removeAttribute("data-theme-preset");
      // Reset to default primary color
      root.style.setProperty("--primary", "221.2 83.2% 53.3%");
      root.style.setProperty("--chart-1", "12 76% 61%");
    }

    // Apply border radius
    const radiusMap = {
      "reset": "0.5rem",
      "sm": "0.125rem", 
      "md": "0.375rem",
      "lg": "0.75rem",
      "xl": "1rem"
    };
    
    const radiusValue = radiusMap[theme.radius as keyof typeof radiusMap];
    if (radiusValue) {
      console.log("🎨 VThinkThemeProvider: Applying radius:", theme.radius, "=", radiusValue);
      setThemeCookie("theme_radius", theme.radius);
      body.setAttribute("data-theme-radius", theme.radius);
      root.style.setProperty("--radius", radiusValue);
    }

    // Apply scale
    const scaleMap = {
      "reset": "100%",
      "xs": "90%",
      "lg": "110%"
    };
    
    const scaleValue = scaleMap[theme.scale as keyof typeof scaleMap];
    if (scaleValue) {
      console.log("🎨 VThinkThemeProvider: Applying scale:", theme.scale, "=", scaleValue);
      setThemeCookie("theme_scale", theme.scale);
      body.setAttribute("data-theme-scale", theme.scale);
      root.style.setProperty("--scale", scaleValue);
      body.style.fontSize = scaleValue;
    }

    // Apply content layout
    console.log("🎨 VThinkThemeProvider: Applying content layout:", theme.contentLayout);
    setThemeCookie("theme_content_layout", theme.contentLayout);
    body.setAttribute("data-theme-content-layout", theme.contentLayout);

    // Apply sidebar mode
    if (theme.sidebarMode && theme.sidebarMode !== "default") {
      console.log("🎨 VThinkThemeProvider: Applying sidebar mode:", theme.sidebarMode);
      setThemeCookie("theme_sidebar_mode", theme.sidebarMode);
      body.setAttribute("data-sidebar-mode", theme.sidebarMode);
    } else {
      console.log("🎨 VThinkThemeProvider: Resetting sidebar mode to default");
      setThemeCookie("theme_sidebar_mode", null);
      body.removeAttribute("data-sidebar-mode");
    }

  }, [theme.preset, theme.radius, theme.scale, theme.contentLayout, theme.sidebarMode]);

  console.log("🎨 VThinkThemeProvider: Rendering with theme:", theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within a VThinkThemeProvider");
  }
  return context;
}