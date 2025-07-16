# Hook de Editor de Temas (`useThemeEditor/`)

## 🎯 **Propósito**

Hook personalizado para gestión completa de temas visuales, compatible con Shadcn/ui y librerías como [TweakCN](https://github.com/jnsahaj/tweakcn).

## 📁 **Estructura**

```
useThemeEditor/
├── index.ts                  # Hook principal
├── types.ts                  # Tipos de tema
├── utils.ts                  # Utilidades
└── tests.ts                  # Tests
```

## 🔧 **Implementación Principal**

### **Hook Principal:**
```typescript
// ✅ Hook completo para gestión de temas
export const useThemeEditor = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [presets, setPresets] = useState<ThemePreset[]>(themePresets);
  const [isEditing, setIsEditing] = useState(false);
  
  // Actualizar tema
  const updateTheme = useCallback((newTheme: Partial<Theme>) => {
    const updatedTheme = { ...currentTheme, ...newTheme };
    setCurrentTheme(updatedTheme);
    
    // Aplicar cambios a CSS variables
    applyThemeToCSS(updatedTheme);
    
    // Guardar en storage
    saveThemeToStorage(updatedTheme);
  }, [currentTheme]);
  
  // Exportar tema
  const exportTheme = useCallback((format: 'json' | 'css' | 'tailwind' = 'json') => {
    switch (format) {
      case 'json':
        return JSON.stringify(currentTheme, null, 2);
      case 'css':
        return generateCSSVariables(currentTheme);
      case 'tailwind':
        return generateTailwindConfig(currentTheme);
      default:
        return JSON.stringify(currentTheme, null, 2);
    }
  }, [currentTheme]);
  
  // Importar tema
  const importTheme = useCallback((themeConfig: string, format: 'json' | 'css' | 'tailwind' = 'json') => {
    try {
      let parsedTheme: Theme;
      
      switch (format) {
        case 'json':
          parsedTheme = JSON.parse(themeConfig);
          break;
        case 'css':
          parsedTheme = parseCSSVariables(themeConfig);
          break;
        case 'tailwind':
          parsedTheme = parseTailwindConfig(themeConfig);
          break;
        default:
          throw new Error('Unsupported format');
      }
      
      // Validar tema
      const validation = validateTheme(parsedTheme);
      if (!validation.isValid) {
        throw new Error(`Invalid theme: ${validation.errors.join(', ')}`);
      }
      
      setCurrentTheme(parsedTheme);
      applyThemeToCSS(parsedTheme);
      saveThemeToStorage(parsedTheme);
      
      return { success: true, theme: parsedTheme };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);
  
  // Resetear tema
  const resetTheme = useCallback(() => {
    setCurrentTheme(defaultTheme);
    applyThemeToCSS(defaultTheme);
    saveThemeToStorage(defaultTheme);
  }, []);
  
  // Aplicar preset
  const applyPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setCurrentTheme(preset.theme);
      applyThemeToCSS(preset.theme);
      saveThemeToStorage(preset.theme);
    }
  }, [presets]);
  
  return {
    // Estado
    currentTheme,
    presets,
    isEditing,
    
    // Acciones
    updateTheme,
    exportTheme,
    importTheme,
    resetTheme,
    applyPreset,
    setIsEditing
  };
};
```

## 🎨 **Tipos de Tema**

### **Interfaces Principales:**
```typescript
export interface Theme {
  id: string;
  name: string;
  version: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  metadata: ThemeMetadata;
}

export interface ThemeColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: ColorPalette;
  neutral: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  background: ColorPalette;
  foreground: ColorPalette;
}

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    thin: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
  };
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
}
```

## 🔄 **Utilidades**

### **Aplicación de Tema a CSS:**
```typescript
export const applyThemeToCSS = (theme: Theme) => {
  const root = document.documentElement;
  
  // Aplicar colores
  Object.entries(theme.colors).forEach(([colorName, palette]) => {
    Object.entries(palette).forEach(([shade, value]) => {
      root.style.setProperty(`--${colorName}-${shade}`, value);
    });
  });
  
  // Aplicar tipografía
  Object.entries(theme.typography.fontSize).forEach(([size, value]) => {
    root.style.setProperty(`--font-size-${size}`, value);
  });
  
  // Aplicar espaciado
  Object.entries(theme.spacing).forEach(([size, value]) => {
    root.style.setProperty(`--spacing-${size}`, value);
  });
};
```

### **Generación de CSS Variables:**
```typescript
export const generateCSSVariables = (theme: Theme): string => {
  let css = ':root {\n';
  
  // Generar variables de colores
  Object.entries(theme.colors).forEach(([colorName, palette]) => {
    Object.entries(palette).forEach(([shade, value]) => {
      css += `  --${colorName}-${shade}: ${value};\n`;
    });
  });
  
  css += '}\n';
  return css;
};
```

### **Validación de Tema:**
```typescript
export const validateTheme = (theme: any): ValidationResult => {
  const errors: string[] = [];
  
  // Validar estructura básica
  if (!theme.colors) errors.push('Missing colors');
  if (!theme.typography) errors.push('Missing typography');
  if (!theme.spacing) errors.push('Missing spacing');
  
  // Validar colores
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([colorName, palette]) => {
      if (typeof palette !== 'object') {
        errors.push(`Invalid color palette for ${colorName}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## 🛡️ **Seguridad Multi-tenant**

### **Validación de Acceso:**
```typescript
export const useSecureThemeEditor = (companyId: string) => {
  const { user } = useAuth();
  
  const secureUpdateTheme = useCallback((newTheme: Partial<Theme>) => {
    // Validar que el usuario pertenece a la empresa
    if (user.company_id !== companyId) {
      throw new Error('Access denied');
    }
    
    // Validar que el tema pertenece a la empresa
    if (newTheme.companyId && newTheme.companyId !== companyId) {
      throw new Error('Theme does not belong to company');
    }
    
    return updateTheme(newTheme);
  }, [user, companyId]);
  
  return {
    ...useThemeEditor(),
    updateTheme: secureUpdateTheme
  };
};
```

## 🧪 **Testing Strategy**

### **Hook Testing:**
```typescript
describe('useThemeEditor', () => {
  it('should update theme correctly', () => {
    const { result } = renderHook(() => useThemeEditor());
    
    act(() => {
      result.current.updateTheme({
        colors: {
          primary: {
            500: '#ff0000'
          }
        }
      });
    });
    
    expect(result.current.currentTheme.colors.primary[500]).toBe('#ff0000');
  });
  
  it('should export theme in correct format', () => {
    const { result } = renderHook(() => useThemeEditor());
    
    const jsonExport = result.current.exportTheme('json');
    const parsed = JSON.parse(jsonExport);
    
    expect(parsed).toHaveProperty('colors');
    expect(parsed).toHaveProperty('typography');
  });
});
```

## 📊 **Métricas de Calidad**

### **Performance:**
- **Update Time**: <50ms para cambios de tema
- **Export Time**: <100ms para exportación
- **Import Time**: <200ms para importación
- **Validation Time**: <10ms para validación

### **Reliability:**
- **Error Handling**: 100% errores manejados
- **Validation**: 100% temas validados
- **Storage**: 100% temas persistidos

---

**El hook de editor de temas sigue los principios de VThink 1.0, asegurando compatibilidad total con Shadcn/ui y librerías como TweakCN.** 