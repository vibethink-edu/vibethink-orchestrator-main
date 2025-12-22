"use client";

import { useEffect, useState, useCallback } from "react";

export type ThemeScale = "none" | "sm" | "lg";
export type ThemeRadius = "none" | "sm" | "md" | "lg" | "xl";
export type ContentLayout = "full" | "centered";
export type SidebarMode = "default" | "icon";
export type BaseColor = "neutral" | "slate" | "gray" | "zinc" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
export type MenuColor = "default" | "muted" | "accent";
export type MenuAccent = "subtle" | "moderate" | "bold";
export type ThemeFont = "inter" | "noto-sans" | "nunito-sans" | "figtree" | "geist" | "roboto" | "poppins" | "montserrat" | "pt-sans" | "system";

interface ThemeSettings {
  scale: ThemeScale;
  radius: ThemeRadius;
  contentLayout: ContentLayout;
  sidebarMode: SidebarMode;
  baseColor: BaseColor;
  menuColor: MenuColor;
  menuAccent: MenuAccent;
  font: ThemeFont;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  scale: "none",
  radius: "md", // "default" se mapea a "md" en el layout
  contentLayout: "full",
  sidebarMode: "default",
  baseColor: "neutral",
  menuColor: "default",
  menuAccent: "subtle",
  font: "geist" // Fuente por defecto
};

/**
 * Hook para manejar todas las configuraciones de tema
 * (Scale, Radius, Content Layout, Sidebar Mode)
 */
export function useThemeSettings() {
  const [settings, setSettingsState] = useState<ThemeSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Función para leer settings desde cookies
  const getSavedSettings = useCallback((): ThemeSettings => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;

    const getCookie = (name: string): string | null => {
      const value = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
      return value ? decodeURIComponent(value).trim() : null;
    };

    // Leer radius y mapear "default" a "md"
    const radiusValue = getCookie("theme_radius");
    const radius = radiusValue === "default" ? "md" : ((radiusValue as ThemeRadius) || DEFAULT_SETTINGS.radius);
    
    // Verificar si el body ya tiene valores aplicados (desde SSR)
    const bodyRadius = document.body.getAttribute("data-theme-radius");
    const bodyScale = document.body.getAttribute("data-theme-scale");
    const bodyContentLayout = document.body.getAttribute("data-theme-content-layout");
    const bodySidebarMode = document.body.getAttribute("data-theme-sidebar-mode");
    const bodyBaseColor = document.body.getAttribute("data-theme-base-color");
    const bodyMenuColor = document.body.getAttribute("data-theme-menu-color");
    const bodyMenuAccent = document.body.getAttribute("data-theme-menu-accent");
    const bodyFont = document.body.getAttribute("data-theme-font");
    
    return {
      scale: (bodyScale as ThemeScale) || (getCookie("theme_scale") as ThemeScale) || DEFAULT_SETTINGS.scale,
      radius: (bodyRadius === "default" ? "md" : (bodyRadius as ThemeRadius)) || radius,
      contentLayout: (bodyContentLayout as ContentLayout) || (getCookie("theme_content_layout") as ContentLayout) || DEFAULT_SETTINGS.contentLayout,
      sidebarMode: (bodySidebarMode as SidebarMode) || (getCookie("theme_sidebar_mode") as SidebarMode) || DEFAULT_SETTINGS.sidebarMode,
      baseColor: (bodyBaseColor as BaseColor) || (getCookie("theme_base_color") as BaseColor) || DEFAULT_SETTINGS.baseColor,
      menuColor: (bodyMenuColor as MenuColor) || (getCookie("theme_menu_color") as MenuColor) || DEFAULT_SETTINGS.menuColor,
      menuAccent: (bodyMenuAccent as MenuAccent) || (getCookie("theme_menu_accent") as MenuAccent) || DEFAULT_SETTINGS.menuAccent,
      font: (bodyFont as ThemeFont) || (getCookie("theme_font") as ThemeFont) || DEFAULT_SETTINGS.font
    };
  }, []);

  // Función para aplicar settings al body
  const applySettings = useCallback((newSettings: ThemeSettings) => {
    if (typeof window === "undefined") return;

    const body = document.body;

    // Aplicar cada setting
    Object.entries(newSettings).forEach(([key, value]) => {
      const attrName = `data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      
      // Para baseColor, menuColor, menuAccent y font, siempre aplicar (incluso si es "default")
      if (key === "baseColor" || key === "menuColor" || key === "menuAccent" || key === "font") {
        if (value) {
          body.setAttribute(attrName, value);
          document.documentElement.setAttribute(attrName, value);
        }
      } 
      // Para radius, "none" también debe aplicarse (para establecer --radius: 0rem)
      else if (key === "radius" && value === "none") {
        body.setAttribute(attrName, value);
        document.documentElement.setAttribute(attrName, value);
      }
      // Para otros settings, aplicar si tiene valor y no es "default"
      else if (value && value !== "default" && value !== "none") {
        body.setAttribute(attrName, value);
        document.documentElement.setAttribute(attrName, value);
      } else {
        body.removeAttribute(attrName);
        document.documentElement.removeAttribute(attrName);
      }
    });
    
    // Forzar reflow para aplicar estilos inmediatamente
    void body.offsetHeight;
  }, []);

  // Función para guardar en cookies
  const saveToCookies = useCallback((newSettings: ThemeSettings) => {
    if (typeof window === "undefined") return;

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    Object.entries(newSettings).forEach(([key, value]) => {
      const cookieName = `theme_${key.replace(/([A-Z])/g, "_$1").toLowerCase()}`;
      const encodedValue = encodeURIComponent(value);
      document.cookie = `${cookieName}=${encodedValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedSettings = getSavedSettings();
    setSettingsState(savedSettings);
    applySettings(savedSettings);
  }, [getSavedSettings, applySettings]);

  const updateSetting = useCallback(<K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettingsState(newSettings);
    applySettings(newSettings);
    saveToCookies(newSettings);
    
    // Disparar evento para notificar cambios
    window.dispatchEvent(new CustomEvent("theme-settings-changed", { 
      detail: { key, value, settings: newSettings } 
    }));
  }, [settings, applySettings, saveToCookies]);

  return {
    settings,
    updateSetting,
    mounted,
    setScale: (scale: ThemeScale) => updateSetting("scale", scale),
    setRadius: (radius: ThemeRadius) => updateSetting("radius", radius),
    setContentLayout: (layout: ContentLayout) => updateSetting("contentLayout", layout),
    setSidebarMode: (mode: SidebarMode) => updateSetting("sidebarMode", mode),
    setBaseColor: (color: BaseColor) => updateSetting("baseColor", color),
    setMenuColor: (color: MenuColor) => updateSetting("menuColor", color),
    setMenuAccent: (accent: MenuAccent) => updateSetting("menuAccent", accent),
    setFont: (font: ThemeFont) => updateSetting("font", font),
  };
}

