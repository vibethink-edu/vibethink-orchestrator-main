// src/lib/themes.ts
// Helpers y constantes para el sistema de temas Bundui/Shadcn

/**
 * Tema por defecto del sistema
 */
export const DEFAULT_THEME = 'light';

/**
 * Temas disponibles en la plataforma
 */
export const THEMES = [
  'light',
  'dark',
  'system',
  'blue',
  'green',
  'purple',
  'orange',
  'red',
  'yellow',
  'pink',
  'gray',
];

/**
 * Paleta de colores base (puedes expandir según tu branding)
 */
export const THEME_COLORS = {
  light: {
    background: '#fff',
    foreground: '#111',
    primary: '#2563eb',
    secondary: '#64748b',
  },
  dark: {
    background: '#18181b',
    foreground: '#fff',
    primary: '#6366f1',
    secondary: '#a1a1aa',
  },
  // ...otros temas
};

/**
 * Helper para obtener el tema activo
 */
export function getActiveTheme(theme: string = DEFAULT_THEME) {
  return THEME_COLORS[theme] || THEME_COLORS[DEFAULT_THEME];
} 