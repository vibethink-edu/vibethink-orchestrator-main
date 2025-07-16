/**
 * Sistema de Temas Bundui - VThink 1.0
 * Configuración simple y efectiva para multi-tenant
 */

export interface CompanyTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    border: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  branding: {
    logo: string;
    favicon: string;
    companyName: string;
  };
  features: {
    darkMode: boolean;
    animations: boolean;
    customCSS: string;
  };
}

// Temas predefinidos
export const predefinedThemes: Record<string, CompanyTheme> = {
  'vthink-default': {
    id: 'vthink-default',
    name: 'VThink Default',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#1F2937',
      border: '#E5E7EB',
      muted: '#6B7280'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    branding: {
      logo: '/logo-vthink.png',
      favicon: '/favicon-vthink.ico',
      companyName: 'VThink 1.0'
    },
    features: {
      darkMode: true,
      animations: true,
      customCSS: ''
    }
  },
  'bundui-light': {
    id: 'bundui-light',
    name: 'Bundui Light',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#1F2937',
      border: '#E5E7EB',
      muted: '#6B7280'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    branding: {
      logo: '/logo-bundui.png',
      favicon: '/favicon-bundui.ico',
      companyName: 'Bundui Dashboard'
    },
    features: {
      darkMode: true,
      animations: true,
      customCSS: ''
    }
  },
  'enterprise-blue': {
    id: 'enterprise-blue',
    name: 'Enterprise Blue',
    colors: {
      primary: '#1E40AF',
      secondary: '#059669',
      accent: '#DC2626',
      background: '#FFFFFF',
      foreground: '#1F2937',
      border: '#E5E7EB',
      muted: '#6B7280'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    branding: {
      logo: '/logo-enterprise.png',
      favicon: '/favicon-enterprise.ico',
      companyName: 'Enterprise'
    },
    features: {
      darkMode: true,
      animations: false,
      customCSS: ''
    }
  }
};

// Hook para gestión de temas
export function useCompanyTheme(companyId: string) {
  const [theme, setTheme] = useState<CompanyTheme>(predefinedThemes['vthink-default']);
  
  // Cargar tema de la empresa
  useEffect(() => {
    loadCompanyTheme(companyId);
  }, [companyId]);
  
  // Aplicar tema
  const applyTheme = (themeConfig: CompanyTheme) => {
    // Aplicar CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', themeConfig.colors.primary);
    root.style.setProperty('--secondary', themeConfig.colors.secondary);
    root.style.setProperty('--accent', themeConfig.colors.accent);
    root.style.setProperty('--background', themeConfig.colors.background);
    root.style.setProperty('--foreground', themeConfig.colors.foreground);
    root.style.setProperty('--border', themeConfig.colors.border);
    root.style.setProperty('--muted', themeConfig.colors.muted);
    
    // Aplicar fuentes
    root.style.setProperty('--font-heading', themeConfig.fonts.heading);
    root.style.setProperty('--font-body', themeConfig.fonts.body);
    
    setTheme(themeConfig);
  };
  
  // Guardar tema
  const saveTheme = async (themeConfig: CompanyTheme) => {
    await saveCompanyTheme(companyId, themeConfig);
    applyTheme(themeConfig);
  };
  
  return { theme, applyTheme, saveTheme };
}

// Componente selector de temas
export function ThemeSelector({ companyId }: { companyId: string }) {
  const { theme, saveTheme } = useCompanyTheme(companyId);
  
  return (
    <div className="theme-selector">
      <h3>Seleccionar Tema</h3>
      <div className="theme-grid">
        {Object.entries(predefinedThemes).map(([key, themeOption]) => (
          <ThemeCard
            key={key}
            theme={themeOption}
            isSelected={theme.id === themeOption.id}
            onSelect={() => saveTheme(themeOption)}
          />
        ))}
      </div>
    </div>
  );
}

// Componente de tarjeta de tema
export function ThemeCard({ 
  theme, 
  isSelected, 
  onSelect 
}: { 
  theme: CompanyTheme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div 
      className={`theme-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div 
        className="theme-preview"
        style={{
          backgroundColor: theme.colors.background,
          border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.border}`
        }}
      >
        <div 
          className="preview-header"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div 
          className="preview-sidebar"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div 
          className="preview-content"
          style={{ backgroundColor: theme.colors.background }}
        />
      </div>
      <div className="theme-info">
        <h4>{theme.name}</h4>
        <div className="theme-colors">
          <div 
            className="color-swatch"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div 
            className="color-swatch"
            style={{ backgroundColor: theme.colors.secondary }}
          />
          <div 
            className="color-swatch"
            style={{ backgroundColor: theme.colors.accent }}
          />
        </div>
      </div>
    </div>
  );
}

// Estilos CSS para el selector de temas
export const themeStyles = `
.theme-selector {
  padding: 1rem;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.theme-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.theme-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary);
}

.theme-preview {
  height: 120px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.preview-header {
  height: 20px;
  width: 100%;
}

.preview-sidebar {
  position: absolute;
  left: 0;
  top: 20px;
  width: 30px;
  height: 100px;
}

.preview-content {
  position: absolute;
  left: 30px;
  top: 20px;
  right: 0;
  height: 100px;
}

.theme-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.theme-colors {
  display: flex;
  gap: 0.25rem;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid var(--border);
}
`; 