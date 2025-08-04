export const DEFAULT_THEME = {
  preset: "default",
  radius: "reset", 
  scale: "reset",
  contentLayout: "full",
  sidebarMode: "default"
} as const;

export type ThemeType = typeof DEFAULT_THEME;

export const THEMES = [
  {
    name: "Default",
    value: "default",
    colors: ["hsl(210 40% 8%)"] // oklch(0.33 0 0) → hsl equivalent
  },
  {
    name: "Underground",
    value: "underground", 
    colors: ["hsl(156 19% 53%)"] // oklch(0.5315 0.0694 156.19) → hsl equivalent
  },
  {
    name: "Rose Garden",
    value: "rose-garden",
    colors: ["hsl(12 88% 59%)"] // oklch(0.5827 0.2418 12.23) → hsl equivalent
  },
  {
    name: "Lake View",
    value: "lake-view",
    colors: ["hsl(163 77% 65%)"] // oklch(0.765 0.177 163.22) → hsl equivalent
  },
  {
    name: "Sunset Glow",
    value: "sunset-glow",
    colors: ["hsl(37 87% 59%)"] // oklch(0.5827 0.2187 36.98) → hsl equivalent
  },
  {
    name: "Forest Whisper",
    value: "forest-whisper",
    colors: ["hsl(182 72% 35%)"] // oklch(0.5276 0.1072 182.22) → hsl equivalent
  },
  {
    name: "Ocean Breeze",
    value: "ocean-breeze",
    colors: ["hsl(277 65% 59%)"] // oklch(0.59 0.20 277.12) → hsl equivalent
  },
  {
    name: "Lavender Dream",
    value: "lavender-dream",
    colors: ["hsl(294 58% 71%)"] // oklch(0.71 0.16 293.54) → hsl equivalent
  }
];

export const RADIUS_OPTIONS = [
  { name: "RESET", value: "reset" },
  { name: "SM", value: "sm" },
  { name: "MD", value: "md" },
  { name: "LG", value: "lg" },
  { name: "XL", value: "xl" }
];

export const SCALE_OPTIONS = [
  { name: "RESET", value: "reset" },
  { name: "XS", value: "xs" },
  { name: "LG", value: "lg" }
];

export const LAYOUT_OPTIONS = [
  { name: "Full Width", value: "full" },
  { name: "Centered", value: "centered" }
];