# Integración TweakCN (`tweakcn/`)

## 🎯 **Propósito**

Integración directa con [TweakCN](https://github.com/jnsahaj/tweakcn), el editor visual de temas para Shadcn/ui. Permite importar y exportar temas desde la plataforma TweakCN.

## 📁 **Estructura**

```
tweakcn/
├── client.ts                 # Cliente TweakCN
├── api.ts                    # API endpoints
├── types.ts                  # Tipos de TweakCN
├── converters.ts             # Convertidores de formato
├── validators.ts             # Validadores
└── config.ts                 # Configuración
```

## 🔧 **Implementación**

### **Cliente TweakCN:**
```typescript
// ✅ Cliente para integración con TweakCN
export class TweakCNClient {
  private baseUrl: string;
  private apiKey: string;
  
  constructor(config: TweakCNConfig) {
    this.baseUrl = config.baseUrl || 'https://tweakcn.com/api';
    this.apiKey = config.apiKey;
  }
  
  // Obtener tema de TweakCN
  async getTheme(themeId: string): Promise<TweakCNTheme> {
    const response = await fetch(`${this.baseUrl}/themes/${themeId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch theme: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Exportar tema a TweakCN
  async exportTheme(theme: Theme): Promise<TweakCNExportResult> {
    const tweakcnTheme = convertToTweakCNFormat(theme);
    
    const response = await fetch(`${this.baseUrl}/themes/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tweakcnTheme)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to export theme: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Importar tema desde TweakCN
  async importTheme(themeId: string): Promise<Theme> {
    const tweakcnTheme = await this.getTheme(themeId);
    return convertFromTweakCNFormat(tweakcnTheme);
  }
  
  // Buscar temas en TweakCN
  async searchThemes(query: string): Promise<TweakCNTheme[]> {
    const response = await fetch(`${this.baseUrl}/themes/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search themes: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Obtener temas populares
  async getPopularThemes(): Promise<TweakCNTheme[]> {
    const response = await fetch(`${this.baseUrl}/themes/popular`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch popular themes: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

### **Convertidores de Formato:**
```typescript
// ✅ Convertir de nuestro formato a TweakCN
export const convertToTweakCNFormat = (theme: Theme): TweakCNTheme => {
  return {
    id: theme.id,
    name: theme.name,
    description: theme.metadata.description,
    version: theme.version,
    colors: {
      primary: theme.colors.primary[500],
      secondary: theme.colors.secondary[500],
      accent: theme.colors.accent[500],
      background: theme.colors.background[500],
      foreground: theme.colors.foreground[500],
      muted: theme.colors.neutral[200],
      mutedForeground: theme.colors.neutral[700],
      border: theme.colors.neutral[300],
      input: theme.colors.neutral[200],
      ring: theme.colors.primary[500],
      destructive: theme.colors.error[500],
      destructiveForeground: theme.colors.error[50],
      success: theme.colors.success[500],
      warning: theme.colors.warning[500]
    },
    typography: {
      fontFamily: theme.typography.fontFamily.sans.join(', '),
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      lineHeight: theme.typography.lineHeight
    },
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
    metadata: {
      author: theme.metadata.author,
      tags: theme.metadata.tags,
      category: theme.metadata.category,
      license: theme.metadata.license
    }
  };
};

// ✅ Convertir de TweakCN a nuestro formato
export const convertFromTweakCNFormat = (tweakcnTheme: TweakCNTheme): Theme => {
  return {
    id: tweakcnTheme.id,
    name: tweakcnTheme.name,
    version: tweakcnTheme.version,
    colors: {
      primary: generateColorPalette(tweakcnTheme.colors.primary),
      secondary: generateColorPalette(tweakcnTheme.colors.secondary),
      accent: generateColorPalette(tweakcnTheme.colors.accent),
      neutral: generateColorPalette(tweakcnTheme.colors.muted),
      success: generateColorPalette(tweakcnTheme.colors.success),
      warning: generateColorPalette(tweakcnTheme.colors.warning),
      error: generateColorPalette(tweakcnTheme.colors.destructive),
      background: generateColorPalette(tweakcnTheme.colors.background),
      foreground: generateColorPalette(tweakcnTheme.colors.foreground)
    },
    typography: {
      fontFamily: {
        sans: tweakcnTheme.typography.fontFamily.split(', '),
        serif: ['Georgia', 'serif'],
        mono: ['Monaco', 'Consolas', 'monospace']
      },
      fontSize: tweakcnTheme.typography.fontSize,
      fontWeight: tweakcnTheme.typography.fontWeight,
      lineHeight: tweakcnTheme.typography.lineHeight
    },
    spacing: tweakcnTheme.spacing,
    borderRadius: tweakcnTheme.borderRadius,
    shadows: tweakcnTheme.shadows,
    animations: defaultAnimations,
    metadata: {
      description: tweakcnTheme.description,
      author: tweakcnTheme.metadata.author,
      tags: tweakcnTheme.metadata.tags,
      category: tweakcnTheme.metadata.category,
      license: tweakcnTheme.metadata.license,
      source: 'tweakcn',
      importedAt: new Date().toISOString()
    }
  };
};
```

### **Hook de Integración:**
```typescript
// ✅ Hook para usar TweakCN
export const useTweakCNIntegration = () => {
  const tweakcnClient = useMemo(() => new TweakCNClient({
    baseUrl: process.env.TWEAKCN_API_URL,
    apiKey: process.env.TWEAKCN_API_KEY
  }), []);
  
  const importTheme = useCallback(async (themeId: string) => {
    try {
      const tweakcnTheme = await tweakcnClient.getTheme(themeId);
      const theme = convertFromTweakCNFormat(tweakcnTheme);
      
      return { success: true, theme };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [tweakcnClient]);
  
  const exportTheme = useCallback(async (theme: Theme) => {
    try {
      const result = await tweakcnClient.exportTheme(theme);
      
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [tweakcnClient]);
  
  const searchThemes = useCallback(async (query: string) => {
    try {
      const themes = await tweakcnClient.searchThemes(query);
      
      return { success: true, themes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [tweakcnClient]);
  
  const getPopularThemes = useCallback(async () => {
    try {
      const themes = await tweakcnClient.getPopularThemes();
      
      return { success: true, themes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [tweakcnClient]);
  
  return {
    importTheme,
    exportTheme,
    searchThemes,
    getPopularThemes
  };
};
```

## 🎯 **Tipos de TweakCN**

### **Interfaces Principales:**
```typescript
export interface TweakCNTheme {
  id: string;
  name: string;
  description: string;
  version: string;
  colors: TweakCNColors;
  typography: TweakCNTypography;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  metadata: TweakCNMetadata;
}

export interface TweakCNColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  warning: string;
}

export interface TweakCNTypography {
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
}

export interface TweakCNMetadata {
  author: string;
  tags: string[];
  category: string;
  license: string;
}

export interface TweakCNExportResult {
  id: string;
  url: string;
  shareUrl: string;
}
```

## 🔄 **Flujo de Integración**

### **1. Importar Tema desde TweakCN:**
```typescript
const { importTheme } = useTweakCNIntegration();

const handleImportTheme = async (themeId: string) => {
  const result = await importTheme(themeId);
  
  if (result.success) {
    setCurrentTheme(result.theme);
    applyThemeToCSS(result.theme);
    showNotification('Theme imported successfully');
  } else {
    showError(`Failed to import theme: ${result.error}`);
  }
};
```

### **2. Exportar Tema a TweakCN:**
```typescript
const { exportTheme } = useTweakCNIntegration();

const handleExportTheme = async (theme: Theme) => {
  const result = await exportTheme(theme);
  
  if (result.success) {
    showNotification('Theme exported to TweakCN');
    openUrl(result.result.shareUrl);
  } else {
    showError(`Failed to export theme: ${result.error}`);
  }
};
```

### **3. Buscar Temas en TweakCN:**
```typescript
const { searchThemes } = useTweakCNIntegration();

const handleSearchThemes = async (query: string) => {
  const result = await searchThemes(query);
  
  if (result.success) {
    setSearchResults(result.themes);
  } else {
    showError(`Failed to search themes: ${result.error}`);
  }
};
```

## 🛡️ **Seguridad**

### **Validación de Temas:**
```typescript
export const validateTweakCNTheme = (theme: any): ValidationResult => {
  const errors: string[] = [];
  
  // Validar estructura básica
  if (!theme.colors) errors.push('Missing colors');
  if (!theme.typography) errors.push('Missing typography');
  
  // Validar colores
  if (theme.colors) {
    const requiredColors = ['primary', 'secondary', 'background', 'foreground'];
    requiredColors.forEach(color => {
      if (!theme.colors[color]) {
        errors.push(`Missing required color: ${color}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## 🧪 **Testing Strategy**

### **Integración Testing:**
```typescript
describe('TweakCN Integration', () => {
  it('should import theme correctly', async () => {
    const { importTheme } = useTweakCNIntegration();
    
    const result = await importTheme('test-theme-id');
    
    expect(result.success).toBe(true);
    expect(result.theme).toHaveProperty('colors');
    expect(result.theme).toHaveProperty('typography');
  });
  
  it('should export theme correctly', async () => {
    const { exportTheme } = useTweakCNIntegration();
    
    const testTheme = createTestTheme();
    const result = await exportTheme(testTheme);
    
    expect(result.success).toBe(true);
    expect(result.result).toHaveProperty('id');
    expect(result.result).toHaveProperty('shareUrl');
  });
});
```

## 📊 **Métricas de Calidad**

### **Performance:**
- **Import Time**: <500ms para importación
- **Export Time**: <1s para exportación
- **Search Time**: <300ms para búsqueda
- **Validation Time**: <50ms para validación

### **Reliability:**
- **API Uptime**: >99.9% availability
- **Error Handling**: 100% errores manejados
- **Data Integrity**: 100% validación de datos

---

**La integración con TweakCN sigue los principios de VThink 1.0, asegurando compatibilidad total con el ecosistema Shadcn/ui.** 