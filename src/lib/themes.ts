// src/lib/themes.ts
// Helpers y constantes para el sistema de temas Bundui/Shadcn

export type ThemeType = {
  preset: string;
  radius: string;
  contentLayout: string;
  scale: string;
};

/**
 * Tema por defecto del sistema
 */
export const DEFAULT_THEME: ThemeType = {
  preset: 'default',
  radius: '0.5rem',
  contentLayout: 'default',
  scale: 'none'
};

/**
 * Temas disponibles en la plataforma
 */
export const THEMES = [
  {
    name: 'Default',
    value: 'default',
    colors: ['#0f172a', '#f1f5f9', '#3b82f6', '#64748b']
  },
  {
    name: 'Blue',
    value: 'blue',
    colors: ['#1e40af', '#dbeafe', '#3b82f6', '#93c5fd']
  },
  {
    name: 'Green',
    value: 'green',
    colors: ['#166534', '#dcfce7', '#22c55e', '#86efac']
  },
  {
    name: 'Purple',
    value: 'purple',
    colors: ['#7c3aed', '#f3e8ff', '#a855f7', '#c4b5fd']
  },
  {
    name: 'Orange',
    value: 'orange',
    colors: ['#ea580c', '#fed7aa', '#f97316', '#fdba74']
  },
  {
    name: 'Red',
    value: 'red',
    colors: ['#dc2626', '#fecaca', '#ef4444', '#f87171']
  },
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