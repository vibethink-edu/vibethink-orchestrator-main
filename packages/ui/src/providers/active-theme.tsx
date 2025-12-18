"use client";

/**
 * Active Theme Provider - @vibethink/ui
 * 
 * Provider de contexto para gestión de temas
 * Híbrido Shadcn v4 + Bundui
 * 
 * @version 2.0.0
 * @updated 2024-12-17
 */

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_THEME, ThemeType, FONTS } from "../lib/themes";

const COOKIE_PREFIX = "vthink_theme_";

/**
 * Guarda valor en cookie (para SSR)
 */
function setThemeCookie(key: string, value: string | null) {
  if (typeof window === "undefined") return;

  const fullKey = `${COOKIE_PREFIX}${key}`;
  if (!value) {
    document.cookie = `${fullKey}=; path=/; max-age=0; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
  } else {
    document.cookie = `${fullKey}=${value}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
  }
}

/**
 * Lee valor de cookie
 */
function getThemeCookie(key: string): string | null {
  if (typeof window === "undefined") return null;
  
  const fullKey = `${COOKIE_PREFIX}${key}`;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.trim().split("=");
    if (cookieKey === fullKey) {
      return cookieValue;
    }
  }
  return null;
}

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ActiveThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<ThemeType>;
  /**
   * Si es true, guarda el tema en cookies para persistencia
   * @default true
   */
  persistTheme?: boolean;
}

export function ActiveThemeProvider({
  children,
  initialTheme,
  persistTheme = true
}: ActiveThemeProviderProps) {
  // Inicializar tema desde cookies o props
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const base = { ...DEFAULT_THEME, ...initialTheme };
    
    // Intentar leer de cookies en cliente
    if (typeof window !== "undefined" && persistTheme) {
      return {
        preset: getThemeCookie("preset") || base.preset,
        baseColor: getThemeCookie("base_color") || base.baseColor,
        font: getThemeCookie("font") || base.font,
        radius: getThemeCookie("radius") || base.radius,
        scale: getThemeCookie("scale") || base.scale,
        contentLayout: getThemeCookie("content_layout") || base.contentLayout,
        sidebarMode: getThemeCookie("sidebar_mode") || base.sidebarMode
      };
    }
    
    return base;
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const resetTheme = () => {
    setThemeState({ ...DEFAULT_THEME });
  };

  // Aplicar tema al DOM y guardar en cookies (siguiendo estándar Shadcn + Bundui)
  useEffect(() => {
    const body = document.body;

    // === Radius (siempre aplicar atributo) ===
    if (persistTheme) setThemeCookie("radius", theme.radius);
    body.setAttribute("data-theme-radius", theme.radius);

    // === Preset ===
    if (theme.preset !== "default") {
      if (persistTheme) setThemeCookie("preset", theme.preset);
      body.setAttribute("data-theme-preset", theme.preset);
    } else {
      if (persistTheme) setThemeCookie("preset", null);
      body.removeAttribute("data-theme-preset");
    }

    // === Base Color (Shadcn v4 extension) ===
    if (theme.baseColor !== "neutral") {
      if (persistTheme) setThemeCookie("base_color", theme.baseColor);
      body.setAttribute("data-theme-base-color", theme.baseColor);
    } else {
      if (persistTheme) setThemeCookie("base_color", null);
      body.removeAttribute("data-theme-base-color");
    }

    // === Font (Shadcn v4 extension) ===
    if (persistTheme) setThemeCookie("font", theme.font);
    if (theme.font !== "inter") {
      body.setAttribute("data-theme-font", theme.font);
      const fontConfig = FONTS.find(f => f.value === theme.font);
      if (fontConfig) {
        FONTS.forEach(f => body.classList.remove(f.className));
        body.classList.add(fontConfig.className);
      }
    } else {
      body.removeAttribute("data-theme-font");
      FONTS.forEach(f => body.classList.remove(f.className));
    }

    // === Scale ===
    if (theme.scale !== "none") {
      if (persistTheme) setThemeCookie("scale", theme.scale);
      body.setAttribute("data-theme-scale", theme.scale);
    } else {
      if (persistTheme) setThemeCookie("scale", null);
      body.removeAttribute("data-theme-scale");
    }

    // === Content Layout (siempre aplicar) ===
    if (persistTheme) setThemeCookie("content_layout", theme.contentLayout);
    body.setAttribute("data-theme-content-layout", theme.contentLayout);

    // === Sidebar Mode ===
    // Nota: En Bundui esto solo toggle, no persiste como atributo
    // Lo mantenemos por compatibilidad pero no afecta el sidebar directamente

  }, [
    theme.preset, 
    theme.baseColor, 
    theme.font,
    theme.radius, 
    theme.scale, 
    theme.contentLayout, 
    theme.sidebarMode,
    persistTheme
  ]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de tema
 * @throws Error si se usa fuera de ActiveThemeProvider
 */
export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider");
  }
  return context;
}

/**
 * Hook para verificar si el provider está disponible
 */
export function useThemeConfigSafe() {
  return useContext(ThemeContext);
}

