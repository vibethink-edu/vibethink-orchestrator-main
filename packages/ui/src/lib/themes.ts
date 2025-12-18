/**
 * VThink Theme Configuration
 * 
 * Estrategia: Shadcn UI First
 * - Base: Shadcn UI v4 (estándar oficial)
 * - Extensiones: Base Color, Font (Shadcn v4)
 * - UX Patterns: Scale, Content Layout (inspiración Bundui, implementado con Shadcn)
 * - VThink: Presets propios
 * 
 * Usa OKLCH para colores modernos y consistentes
 * 
 * @version 2.0.0
 * @updated 2024-12-17
 * @strategy Shadcn UI First
 */

export const DEFAULT_THEME = {
  preset: "default",
  baseColor: "neutral",
  font: "inter",
  radius: "default",
  scale: "none",
  contentLayout: "full",
  sidebarMode: "default"
} as const;

export type ThemeType = {
  preset: string;
  baseColor: string;
  font: string;
  radius: string;
  scale: string;
  contentLayout: string;
  sidebarMode: string;
};

export type ThemePreset = {
  name: string;
  value: string;
  colors: string[];
  category?: "vibethink" | "bundui" | "shadcn";
};

/**
 * Presets de temas disponibles
 * Organizados por categoría para fácil mantenimiento
 */
export const THEMES: ThemePreset[] = [
  // === VThink Propios ===
  {
    name: "VThink",
    value: "vibethink",
    colors: ["oklch(0.55 0.20 260)"],
    category: "vibethink"
  },
  {
    name: "VThink Dark",
    value: "vibethink-dark",
    colors: ["oklch(0.35 0.18 260)"],
    category: "vibethink"
  },
  
  // === De Bundui ===
  {
    name: "Default",
    value: "default",
    colors: ["oklch(0.33 0 0)"],
    category: "bundui"
  },
  {
    name: "Underground",
    value: "underground",
    colors: ["oklch(0.5315 0.0694 156.19)"],
    category: "bundui"
  },
  {
    name: "Rose Garden",
    value: "rose-garden",
    colors: ["oklch(0.5827 0.2418 12.23)"],
    category: "bundui"
  },
  {
    name: "Lake View",
    value: "lake-view",
    colors: ["oklch(0.765 0.177 163.22)"],
    category: "bundui"
  },
  {
    name: "Sunset Glow",
    value: "sunset-glow",
    colors: ["oklch(0.5827 0.2187 36.98)"],
    category: "bundui"
  },
  {
    name: "Forest Whisper",
    value: "forest-whisper",
    colors: ["oklch(0.5276 0.1072 182.22)"],
    category: "bundui"
  },
  {
    name: "Ocean Breeze",
    value: "ocean-breeze",
    colors: ["oklch(0.59 0.20 277.12)"],
    category: "bundui"
  },
  {
    name: "Lavender Dream",
    value: "lavender-dream",
    colors: ["oklch(0.71 0.16 293.54)"],
    category: "bundui"
  },
  
  // === De Shadcn (Adicionales) ===
  {
    name: "Zinc",
    value: "zinc",
    colors: ["oklch(0.27 0.005 286)"],
    category: "shadcn"
  },
  {
    name: "Slate",
    value: "slate",
    colors: ["oklch(0.28 0.02 265)"],
    category: "shadcn"
  },
  {
    name: "Blue",
    value: "blue",
    colors: ["oklch(0.55 0.25 255)"],
    category: "shadcn"
  },
  {
    name: "Violet",
    value: "violet",
    colors: ["oklch(0.55 0.25 293)"],
    category: "shadcn"
  }
];

/**
 * Base Colors (from Shadcn v4)
 * Define la paleta de grises base del tema
 */
export const BASE_COLORS = [
  { name: "Neutral", value: "neutral", hue: 0 },
  { name: "Slate", value: "slate", hue: 215 },
  { name: "Gray", value: "gray", hue: 220 },
  { name: "Zinc", value: "zinc", hue: 240 },
  { name: "Stone", value: "stone", hue: 25 }
] as const;

/**
 * Fonts disponibles (from Shadcn v4)
 */
export const FONTS = [
  { name: "Inter", value: "inter", className: "font-inter" },
  { name: "Geist", value: "geist", className: "font-geist" },
  { name: "Outfit", value: "outfit", className: "font-outfit" },
  { name: "Space Grotesk", value: "space-grotesk", className: "font-space" },
  { name: "System", value: "system", className: "font-sans" }
] as const;

/**
 * Opciones de radius disponibles
 */
export const RADIUS_OPTIONS = [
  { name: "None", value: "none", rem: "0" },
  { name: "SM", value: "sm", rem: "0.25rem" },
  { name: "Default", value: "default", rem: "0.5rem" },
  { name: "MD", value: "md", rem: "0.75rem" },
  { name: "LG", value: "lg", rem: "1rem" },
  { name: "XL", value: "xl", rem: "1.5rem" }
] as const;

/**
 * Opciones de escala de fuente
 */
export const SCALE_OPTIONS = [
  { name: "None", value: "none" },
  { name: "90%", value: "90" },
  { name: "95%", value: "95" },
  { name: "100%", value: "100" },
  { name: "105%", value: "105" },
  { name: "110%", value: "110" }
] as const;

/**
 * Opciones de layout de contenido (siguiendo Bundui/Shadcn)
 */
export const CONTENT_LAYOUT_OPTIONS = [
  { name: "Full", value: "full" },
  { name: "Centered", value: "centered" }
] as const;

/**
 * Opciones de modo sidebar
 */
export const SIDEBAR_MODE_OPTIONS = [
  { name: "Default", value: "default" },
  { name: "Compact", value: "compact" },
  { name: "Icon Only", value: "icon" }
] as const;

/**
 * Helpers para obtener temas por categoría
 */
export const getThemesByCategory = (category: ThemePreset["category"]) => 
  THEMES.filter(t => t.category === category);

export const getVThinkThemes = () => getThemesByCategory("vibethink");
export const getBunduiThemes = () => getThemesByCategory("bundui");
export const getShadcnThemes = () => getThemesByCategory("shadcn");

