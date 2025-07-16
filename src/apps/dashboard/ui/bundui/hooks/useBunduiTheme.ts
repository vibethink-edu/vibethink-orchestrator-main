import { useState, useEffect } from 'react';

interface BunduiTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

const defaultThemes: BunduiTheme[] = [
  {
    name: 'vthink-default',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937'
  },
  {
    name: 'bundui-light',
    primaryColor: '#10b981',
    secondaryColor: '#6b7280',
    backgroundColor: '#f9fafb',
    textColor: '#111827'
  },
  {
    name: 'enterprise-blue',
    primaryColor: '#1e40af',
    secondaryColor: '#475569',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a'
  },
  {
    name: 'modern-dark',
    primaryColor: '#8b5cf6',
    secondaryColor: '#94a3b8',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9'
  }
];

export const useBunduiTheme = (initialTheme: string = 'vthink-default') => {
  const [currentTheme, setCurrentTheme] = useState<BunduiTheme>(
    defaultThemes.find(theme => theme.name === initialTheme) || defaultThemes[0]
  );
  const [availableThemes] = useState<BunduiTheme[]>(defaultThemes);

  const changeTheme = (themeName: string) => {
    const newTheme = defaultThemes.find(theme => theme.name === themeName);
    if (newTheme) {
      setCurrentTheme(newTheme);
      // Aquí se aplicaría el tema al CSS
      applyThemeToCSS(newTheme);
    }
  };

  const applyThemeToCSS = (theme: BunduiTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
  };

  useEffect(() => {
    applyThemeToCSS(currentTheme);
  }, [currentTheme]);

  return {
    currentTheme,
    availableThemes,
    changeTheme
  };
}; 