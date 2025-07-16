# 🎨 Sistema de Temas - AI Pair Orchestrator Pro

## 📋 **Resumen Ejecutivo**

El sistema de temas de AI Pair Orchestrator Pro proporciona una experiencia visual consistente y personalizable, con soporte para temas claro/oscuro, colores corporativos y accesibilidad completa.

---

## 🎯 **Características Principales**

### **1. Temas Claro/Oscuro**
- **Cambio automático** basado en preferencias del sistema
- **Toggle manual** con persistencia de preferencias
- **Transiciones suaves** entre temas
- **Consistencia visual** en toda la aplicación

### **2. Colores Corporativos**
- **Paletas personalizables** por empresa
- **Contraste optimizado** para accesibilidad
- **Variables CSS** centralizadas
- **Soporte para múltiples** esquemas de color

### **3. Accesibilidad**
- **Contraste WCAG AA** cumplido
- **Soporte para lectores** de pantalla
- **Navegación por teclado** completa
- **Indicadores visuales** claros

---

## 🏗️ **Arquitectura del Sistema**

### **1. Hook Principal**
```typescript
// Hook para gestión de temas
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Detectar preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Persistir preferencia
  const updateTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  return {
    theme,
    resolvedTheme,
    updateTheme
  };
};
```

### **2. Componente de Toggle**
```typescript
// Componente para cambiar tema
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'default'
}) => {
  const { theme, updateTheme } = useTheme();

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'theme-toggle',
        'inline-flex items-center justify-center',
        'rounded-md text-sm font-medium',
        'transition-colors focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring',
        'focus-visible:ring-offset-2 disabled:pointer-events-none',
        'disabled:opacity-50',
        size === 'sm' && 'h-8 w-8',
        size === 'default' && 'h-10 w-10',
        size === 'lg' && 'h-12 w-12',
        className
      )}
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
};
```

### **3. Variables CSS**
```css
/* Variables de tema en :root */
:root {
  /* Colores base */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

/* Variables para tema oscuro */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

---

## 🎨 **Paletas de Colores**

### **1. Colores Primarios**
```typescript
// Configuración de colores primarios
export const primaryColors = {
  blue: {
    light: 'hsl(221.2 83.2% 53.3%)',
    dark: 'hsl(217.2 91.2% 59.8%)'
  },
  green: {
    light: 'hsl(142.1 76.2% 36.3%)',
    dark: 'hsl(142.1 70.6% 45.3%)'
  },
  purple: {
    light: 'hsl(262.1 83.3% 57.8%)',
    dark: 'hsl(263.4 70% 50.4%)'
  },
  orange: {
    light: 'hsl(24.6 95% 53.1%)',
    dark: 'hsl(20.5 90.2% 48.2%)'
  }
};

// Función para aplicar color primario
export const applyPrimaryColor = (color: keyof typeof primaryColors) => {
  const root = document.documentElement;
  const colors = primaryColors[color];
  
  root.style.setProperty('--primary', colors.light);
  root.style.setProperty('--primary-foreground', 'hsl(210 40% 98%)');
  
  // Guardar preferencia
  localStorage.setItem('primary-color', color);
};
```

### **2. Colores Corporativos**
```typescript
// Sistema de colores corporativos
export const corporateColors = {
  // Colores de la empresa
  brand: {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#3b82f6'
  },
  
  // Estados del sistema
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  
  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
};
```

---

## 🔧 **Configuración y Personalización**

### **1. Configuración de Tema**
```typescript
// Configuración del sistema de temas
export const themeConfig = {
  // Temas disponibles
  themes: ['light', 'dark', 'system'] as const,
  
  // Colores primarios disponibles
  primaryColors: ['blue', 'green', 'purple', 'orange'] as const,
  
  // Configuración por defecto
  default: {
    theme: 'system' as const,
    primaryColor: 'blue' as const,
    radius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  
  // Configuración de transiciones
  transitions: {
    duration: '150ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Hook para configuración completa
export const useThemeConfig = () => {
  const { theme, updateTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(themeConfig.default.primaryColor);

  const updatePrimaryColor = useCallback((color: typeof primaryColors[number]) => {
    setPrimaryColor(color);
    applyPrimaryColor(color);
  }, []);

  return {
    theme,
    primaryColor,
    updateTheme,
    updatePrimaryColor,
    config: themeConfig
  };
};
```

### **2. Personalización por Empresa**
```typescript
// Sistema de temas corporativos
export const useCorporateTheme = (companyId: string) => {
  const [corporateTheme, setCorporateTheme] = useState<CorporateTheme | null>(null);

  // Cargar tema corporativo
  useEffect(() => {
    const loadCorporateTheme = async () => {
      try {
        const theme = await fetchCorporateTheme(companyId);
        setCorporateTheme(theme);
        applyCorporateTheme(theme);
      } catch (error) {
        console.warn('No se pudo cargar tema corporativo:', error);
      }
    };

    if (companyId) {
      loadCorporateTheme();
    }
  }, [companyId]);

  return { corporateTheme };
};

// Aplicar tema corporativo
const applyCorporateTheme = (theme: CorporateTheme) => {
  const root = document.documentElement;
  
  // Aplicar colores corporativos
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--accent', theme.colors.accent);
  
  // Aplicar logo si existe
  if (theme.logo) {
    document.documentElement.style.setProperty('--company-logo', `url(${theme.logo})`);
  }
};
```

---

## 🎯 **Accesibilidad**

### **1. Contraste y Legibilidad**
```typescript
// Verificación de contraste
export const checkContrast = (foreground: string, background: string): number => {
  // Implementación del algoritmo WCAG para cálculo de contraste
  const getLuminance = (color: string) => {
    const rgb = hexToRgb(color);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Validación de contraste WCAG AA
export const isValidContrast = (foreground: string, background: string): boolean => {
  const contrast = checkContrast(foreground, background);
  return contrast >= 4.5; // WCAG AA para texto normal
};
```

### **2. Soporte para Lectores de Pantalla**
```typescript
// Componente con soporte ARIA
export const AccessibleThemeToggle: React.FC = () => {
  const { theme, updateTheme } = useTheme();
  
  return (
    <button
      onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
      aria-pressed={theme === 'dark'}
      role="switch"
      className="theme-toggle"
    >
      <span className="sr-only">
        {theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      </span>
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
```

---

## 📱 **Responsive Design**

### **1. Adaptación a Dispositivos**
```typescript
// Hook para responsive design
export const useResponsiveTheme = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Ajustar tema según dispositivo
  useEffect(() => {
    const root = document.documentElement;
    
    if (isMobile) {
      root.style.setProperty('--font-size-base', '14px');
      root.style.setProperty('--spacing-base', '0.75rem');
    } else if (isTablet) {
      root.style.setProperty('--font-size-base', '16px');
      root.style.setProperty('--spacing-base', '1rem');
    } else {
      root.style.setProperty('--font-size-base', '16px');
      root.style.setProperty('--spacing-base', '1.25rem');
    }
  }, [isMobile, isTablet]);

  return { isMobile, isTablet };
};
```

### **2. Optimización para Touch**
```typescript
// Componente optimizado para touch
export const TouchOptimizedThemeToggle: React.FC = () => {
  const { isMobile } = useResponsiveTheme();
  const { theme, updateTheme } = useTheme();

  return (
    <button
      onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        'theme-toggle',
        isMobile && 'touch-optimized',
        'min-h-[44px] min-w-[44px]', // Tamaño mínimo para touch
        'active:scale-95 transition-transform'
      )}
      aria-label={`Cambiar tema a ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? <MoonIcon size={24} /> : <SunIcon size={24} />}
    </button>
  );
};
```

---

## 🚀 **Performance y Optimización**

### **1. Lazy Loading de Temas**
```typescript
// Carga diferida de temas pesados
export const useLazyTheme = () => {
  const [themeLoaded, setThemeLoaded] = useState(false);

  const loadTheme = useCallback(async (themeName: string) => {
    try {
      // Cargar CSS del tema dinámicamente
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/themes/${themeName}.css`;
      
      await new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
      
      setThemeLoaded(true);
    } catch (error) {
      console.error('Error cargando tema:', error);
    }
  }, []);

  return { themeLoaded, loadTheme };
};
```

### **2. Optimización de CSS**
```typescript
// Optimización de variables CSS
export const optimizeThemeVariables = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  // Cachear variables frecuentemente usadas
  const cachedVariables = {
    primary: computedStyle.getPropertyValue('--primary'),
    background: computedStyle.getPropertyValue('--background'),
    foreground: computedStyle.getPropertyValue('--foreground')
  };
  
  // Aplicar optimizaciones
  Object.entries(cachedVariables).forEach(([key, value]) => {
    root.style.setProperty(`--${key}-cached`, value);
  });
};
```

---

## 🧪 **Testing**

### **1. Testing de Componentes de Tema**
```typescript
// Test del toggle de tema
describe('ThemeToggle', () => {
  it('cambia entre temas claro y oscuro', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cambiar a tema claro');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Cambiar a tema oscuro');
  });

  it('persiste la preferencia en localStorage', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

### **2. Testing de Accesibilidad**
```typescript
// Test de accesibilidad
describe('ThemeToggle Accessibility', () => {
  it('cumple con estándares WCAG', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    
    // Verificar contraste
    const contrast = checkContrast(
      getComputedStyle(button).color,
      getComputedStyle(button).backgroundColor
    );
    
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  it('es navegable por teclado', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

---

## 📚 **Documentación para Desarrolladores**

### **1. Creación de Nuevos Temas**
```typescript
// Ejemplo de tema personalizado
export const createCustomTheme = (config: CustomThemeConfig) => {
  const theme = {
    name: config.name,
    colors: {
      primary: config.primaryColor,
      secondary: config.secondaryColor,
      accent: config.accentColor,
      background: config.backgroundColor,
      foreground: config.foregroundColor
    },
    fonts: {
      primary: config.fontFamily,
      sizes: config.fontSizes
    },
    spacing: config.spacing,
    borderRadius: config.borderRadius
  };

  return theme;
};

// Uso
const myTheme = createCustomTheme({
  name: 'Mi Tema',
  primaryColor: '#ff6b6b',
  secondaryColor: '#4ecdc4',
  accentColor: '#45b7d1',
  backgroundColor: '#f8f9fa',
  foregroundColor: '#212529',
  fontFamily: 'Roboto, sans-serif',
  fontSizes: { sm: '0.875rem', base: '1rem', lg: '1.125rem' },
  spacing: { sm: '0.5rem', base: '1rem', lg: '1.5rem' },
  borderRadius: '0.375rem'
});
```

### **2. Integración con Diseño System**
```typescript
// Integración con sistema de diseño
export const useDesignSystem = () => {
  const { theme, primaryColor } = useThemeConfig();
  
  const designTokens = {
    colors: {
      primary: primaryColors[primaryColor][theme],
      background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      text: theme === 'dark' ? '#ffffff' : '#000000'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: { sm: '0.875rem', base: '1rem', lg: '1.125rem' },
      fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', full: '9999px' }
  };

  return { designTokens };
};
```

---

**Última actualización**: 2025-01-20  
**Versión**: 1.0 - Sistema completo implementado  
**Responsable**: Equipo de Desarrollo 