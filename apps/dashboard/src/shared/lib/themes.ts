export const DEFAULT_THEME = {
  preset: "default",
  radius: "default",
  scale: "none",
  contentLayout: "full"
} as const;

export type ThemeType = typeof DEFAULT_THEME;

export type ThemePreset = 
  | "default"
  | "underground"
  | "rose-garden"
  | "lake-view"
  | "sunset-glow"
  | "forest-whisper"
  | "ocean-breeze"
  | "lavender-dream";

export const THEME_PRESETS: Array<{
  name: string;
  value: ThemePreset;
  colors: string[];
  description?: string;
}> = [
  {
    name: "Default",
    value: "default",
    colors: ["oklch(0.33 0 0)"],
    description: "Tema neutro por defecto"
  },
  {
    name: "Underground",
    value: "underground",
    colors: ["oklch(0.5315 0.0694 156.19)"],
    description: "Tema verde esmeralda"
  },
  {
    name: "Rose Garden",
    value: "rose-garden",
    colors: ["oklch(0.5827 0.2418 12.23)"],
    description: "Tema rosa elegante"
  },
  {
    name: "Lake View",
    value: "lake-view",
    colors: ["oklch(0.765 0.177 163.22)"],
    description: "Tema azul turquesa"
  },
  {
    name: "Sunset Glow",
    value: "sunset-glow",
    colors: ["oklch(0.5827 0.2187 36.98)"],
    description: "Tema naranja cálido"
  },
  {
    name: "Forest Whisper",
    value: "forest-whisper",
    colors: ["oklch(0.5276 0.1072 182.22)"],
    description: "Tema verde bosque"
  },
  {
    name: "Ocean Breeze",
    value: "ocean-breeze",
    colors: ["oklch(0.59 0.20 277.12)"],
    description: "Tema azul océano"
  },
  {
    name: "Lavender Dream",
    value: "lavender-dream",
    colors: ["oklch(0.71 0.16 293.54)"],
    description: "Tema púrpura suave"
  }
];

export const THEMES = THEME_PRESETS;







