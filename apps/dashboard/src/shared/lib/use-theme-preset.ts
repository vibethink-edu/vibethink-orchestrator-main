"use client";

import { useEffect, useState, useCallback } from "react";
import { THEME_PRESETS, type ThemePreset } from "./themes";

/**
 * Hook para manejar el preset del tema
 * Persiste la selección en cookies y actualiza el atributo data-theme-preset en el body
 * 
 * @param dashboardPrefix - Prefijo para aislar cookies por dashboard (ej: "bundui", "vibethink")
 */
export function useThemePreset(dashboardPrefix?: string) {
  const [preset, setPresetState] = useState<ThemePreset>("default");
  const [mounted, setMounted] = useState(false);

  // Función para leer el preset desde cookies o localStorage
  const getSavedPreset = useCallback((): ThemePreset => {
    if (typeof window === "undefined") return "default";

    const prefix = dashboardPrefix ? `${dashboardPrefix}_` : '';
    const prefixedCookieName = `${prefix}theme_preset`;

    // Intentar leer desde cookie con prefijo primero
    let cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${prefixedCookieName}=`))
      ?.split("=")[1];

    // Si no hay valor con prefijo y tenemos prefijo, intentar migrar desde cookie global
    if (!cookieValue && dashboardPrefix) {
      const globalValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("theme_preset="))
        ?.split("=")[1];
      
      if (globalValue) {
        try {
          const decoded = decodeURIComponent(globalValue).trim();
          if (THEME_PRESETS?.some(t => t.value === decoded)) {
            // Migrar cookie global a prefijada
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            const encodedValue = encodeURIComponent(decoded);
            document.cookie = `${prefixedCookieName}=${encodedValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
            cookieValue = globalValue;
          }
        } catch (e) {
          console.warn("Error migrating theme preset cookie:", e);
        }
      }
    }

    // Si aún no hay valor, usar cookie global (compatibilidad hacia atrás)
    if (!cookieValue) {
      cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("theme_preset="))
        ?.split("=")[1];
    }

    if (cookieValue) {
      try {
        // Decodificar el valor de la cookie (puede tener espacios o caracteres especiales)
        const decoded = decodeURIComponent(cookieValue).trim();
        // Validar que sea un preset válido
        if (THEME_PRESETS?.some(t => t.value === decoded)) {
          return decoded as ThemePreset;
        }
      } catch (e) {
        console.warn("Error decoding theme preset cookie:", e);
      }
    }

    // Fallback a localStorage (con prefijo si existe)
    const localStorageKey = dashboardPrefix ? `${dashboardPrefix}_theme_preset` : "theme_preset";
    const stored = localStorage.getItem(localStorageKey);
    if (stored && THEME_PRESETS?.some(t => t.value === stored)) {
      return stored as ThemePreset;
    }
    
    // Fallback a localStorage global (compatibilidad hacia atrás)
    if (dashboardPrefix) {
      const globalStored = localStorage.getItem("theme_preset");
      if (globalStored && THEME_PRESETS?.some(t => t.value === globalStored)) {
        // Migrar a localStorage con prefijo
        localStorage.setItem(localStorageKey, globalStored);
        return globalStored as ThemePreset;
      }
    }

    // Verificar si el body ya tiene un preset aplicado (desde SSR)
    const bodyPreset = document.body.getAttribute("data-theme-preset");
    if (bodyPreset && THEME_PRESETS?.some(t => t.value === bodyPreset)) {
      return bodyPreset as ThemePreset;
    }

    return "default";
  }, []);

  // Función para aplicar el preset al body
  const applyPreset = useCallback((newPreset: ThemePreset) => {
    if (typeof window === "undefined") return;

    const body = document.body;
    const html = document.documentElement;

    // Remover todos los presets anteriores del body
    body.removeAttribute("data-theme-preset");
    html.removeAttribute("data-theme-preset");

    // Aplicar el nuevo preset (excepto "default" que no necesita atributo)
    if (newPreset && newPreset !== "default") {
      // Aplicar tanto en body como en html para mayor especificidad
      body.setAttribute("data-theme-preset", newPreset);
      html.setAttribute("data-theme-preset", newPreset);

      // Forzar reflow para que los estilos se apliquen inmediatamente
      void body.offsetHeight;
    } else {
      // Si es default, asegurarse de que no haya atributo
      body.removeAttribute("data-theme-preset");
      html.removeAttribute("data-theme-preset");
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Leer el preset guardado
    const savedPreset = getSavedPreset();
    setPresetState(savedPreset);

    // Aplicar el preset si no está ya aplicado
    const currentBodyPreset = document.body.getAttribute("data-theme-preset");
    if (currentBodyPreset !== savedPreset) {
      applyPreset(savedPreset);
    }
  }, [getSavedPreset, applyPreset, dashboardPrefix]);

  const setPreset = useCallback(async (newPreset: ThemePreset) => {
    if (!newPreset || !THEME_PRESETS?.some(t => t.value === newPreset)) {
      console.warn(`Invalid theme preset: ${newPreset}`);
      return;
    }

    console.log(`[ThemePreset] Setting preset to: ${newPreset}`);

    setPresetState(newPreset);
    applyPreset(newPreset);

    // Verificar que se aplicó correctamente
    const appliedPreset = document.body.getAttribute("data-theme-preset");
    const appliedPresetHtml = document.documentElement.getAttribute("data-theme-preset");
    console.log(`[ThemePreset] Applied to body: ${appliedPreset}, html: ${appliedPresetHtml}`);

    // Forzar actualización de estilos
    if (typeof window !== "undefined") {
      // Disparar un evento de resize para forzar re-render
      window.dispatchEvent(new Event("resize"));
    }

    // Guardar en cookies (compatible con Next.js server-side)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    // Codificar el valor para evitar problemas con caracteres especiales
    const encodedValue = encodeURIComponent(newPreset);
    const prefix = dashboardPrefix ? `${dashboardPrefix}_` : '';
    const cookieName = `${prefix}theme_preset`;
    document.cookie = `${cookieName}=${encodedValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    // También guardar en localStorage como fallback (con prefijo si existe)
    const localStorageKey = dashboardPrefix ? `${dashboardPrefix}_theme_preset` : "theme_preset";
    localStorage.setItem(localStorageKey, newPreset);

    // El cambio se aplica inmediatamente al body, no necesitamos recargar
    // El layout del servidor leerá la cookie en la próxima navegación

    // Disparar evento personalizado para que otros componentes puedan reaccionar
    window.dispatchEvent(new CustomEvent("theme-preset-changed", { detail: { preset: newPreset, dashboardPrefix } }));
  }, [applyPreset, dashboardPrefix]);

  return {
    preset,
    setPreset,
    mounted,
    currentTheme: THEME_PRESETS?.find((t) => t.value === preset) || THEME_PRESETS?.[0]
  };
}

