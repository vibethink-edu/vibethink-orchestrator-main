# Estándares de Personalización y Localización

## Principios Fundamentales

### 1. Personalización por Usuario

**Regla de Oro:** Cada usuario puede personalizar su experiencia. Las preferencias se almacenan en la base de datos y se aplican globalmente.

#### Tipos de Preferencias de Usuario
```tsx
// src/types/userPreferences.ts
export interface UserPreferences {
  // Tema y apariencia
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  
  // Idioma y localización
  language: string;
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  
  // Notificaciones
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: {
      helpdesk: boolean;
      crm: boolean;
      billing: boolean;
      security: boolean;
    };
  };
  
  // Layout y navegación
  layout: {
    sidebarCollapsed: boolean;
    rightPanelCollapsed: boolean;
    compactMode: boolean;
    showBreadcrumbs: boolean;
  };
  
  // Accesibilidad
  accessibility: {
    screenReader: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
    colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  };
  
  // Productividad
  productivity: {
    autoSave: boolean;
    keyboardShortcuts: boolean;
    quickActions: boolean;
    dashboardWidgets: string[];
  };
}
```

#### Hook de Preferencias de Usuario
```tsx
// src/hooks/useUserPreferences.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserPreferences } from '@/types/userPreferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  language: 'es',
  timezone: 'America/Bogota',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  notifications: {
    email: true,
    push: true,
    frequency: 'immediate',
    types: {
      helpdesk: true,
      crm: true,
      billing: true,
      security: true,
    },
  },
  layout: {
    sidebarCollapsed: false,
    rightPanelCollapsed: true,
    compactMode: false,
    showBreadcrumbs: true,
  },
  accessibility: {
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindness: 'none',
  },
  productivity: {
    autoSave: true,
    keyboardShortcuts: true,
    quickActions: true,
    dashboardWidgets: ['overview', 'recent-activity', 'quick-actions'],
  },
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar preferencias desde la base de datos
  const loadPreferences = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...data.preferences });
      } else {
        // Crear preferencias por defecto
        await createDefaultPreferences(user.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading preferences');
      console.error('Error loading user preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Crear preferencias por defecto
  const createDefaultPreferences = async (userId: string) => {
    try {
      await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          preferences: DEFAULT_PREFERENCES,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.error('Error creating default preferences:', err);
    }
  };

  // Actualizar preferencia específica
  const updatePreference = useCallback(async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    if (!user?.id) return;

    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);

      // Actualizar en base de datos
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: newPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Aplicar cambios inmediatamente
      applyPreferenceChanges(key, value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating preference');
      console.error('Error updating user preference:', err);
    }
  }, [user?.id, preferences]);

  // Aplicar cambios de preferencias
  const applyPreferenceChanges = useCallback((key: keyof UserPreferences, value: any) => {
    switch (key) {
      case 'theme':
        applyTheme(value);
        break;
      case 'fontSize':
        applyFontSize(value);
        break;
      case 'highContrast':
        applyHighContrast(value);
        break;
      case 'reducedMotion':
        applyReducedMotion(value);
        break;
      case 'language':
        applyLanguage(value);
        break;
      case 'accessibility':
        applyAccessibility(value);
        break;
      // ... otros casos
    }
  }, []);

  // Aplicar tema
  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
      root.classList.add(`theme-${theme}`);
    }
  };

  // Aplicar tamaño de fuente
  const applyFontSize = (fontSize: string) => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-base', getFontSizeValue(fontSize));
  };

  // Aplicar alto contraste
  const applyHighContrast = (highContrast: boolean) => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  // Aplicar movimiento reducido
  const applyReducedMotion = (reducedMotion: boolean) => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  // Aplicar idioma
  const applyLanguage = (language: string) => {
    // Cambiar idioma de la aplicación
    i18n.changeLanguage(language);
  };

  // Aplicar configuración de accesibilidad
  const applyAccessibility = (accessibility: UserPreferences['accessibility']) => {
    const root = document.documentElement;
    
    if (accessibility.focusIndicators) {
      root.classList.add('focus-indicators');
    } else {
      root.classList.remove('focus-indicators');
    }

    if (accessibility.colorBlindness !== 'none') {
      root.classList.add(`colorblind-${accessibility.colorBlindness}`);
    } else {
      root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    updatePreference,
    loading,
    error,
    resetToDefaults: () => updatePreference('theme', DEFAULT_PREFERENCES.theme),
  };
};
```

### 2. Personalización por Empresa

**Regla de Oro:** Cada empresa puede personalizar branding, reglas de negocio y configuración. Se aplica globalmente para todos los usuarios de la empresa.

#### Configuración de Empresa
```tsx
// src/types/companyConfiguration.ts
export interface CompanyConfiguration {
  // Branding y apariencia
  branding: {
    logo: string;
    logoDark: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    companyName: string;
    tagline?: string;
  };
  
  // Localización
  localization: {
    defaultLanguage: string;
    supportedLanguages: string[];
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    currencySymbol: string;
    numberFormat: string;
  };
  
  // Reglas de negocio
  businessRules: {
    maxUsers: number;
    maxStorage: number;
    allowedModules: string[];
    customFields: Record<string, any>;
    workflows: Record<string, any>;
    automations: Record<string, any>;
  };
  
  // Cumplimiento y seguridad
  compliance: {
    gdprEnabled: boolean;
    dataRetentionDays: number;
    auditLogging: boolean;
    dataEncryption: boolean;
    backupFrequency: string;
  };
  
  // Integraciones
  integrations: {
    emailProvider: string;
    analyticsProvider: string;
    paymentProvider: string;
    customIntegrations: Record<string, any>;
  };
  
  // Configuración de módulos
  modules: {
    helpdesk: {
      enabled: boolean;
      customFields: string[];
      slaRules: Record<string, any>;
      autoAssignment: boolean;
    };
    crm: {
      enabled: boolean;
      customFields: string[];
      pipelineStages: string[];
      leadScoring: boolean;
    };
    pqrs: {
      enabled: boolean;
      categories: string[];
      responseTime: number;
      escalationRules: Record<string, any>;
    };
  };
}
```

#### Hook de Configuración de Empresa
```tsx
// src/hooks/useCompanyConfiguration.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CompanyConfiguration } from '@/types/companyConfiguration';

const DEFAULT_COMPANY_CONFIG: CompanyConfiguration = {
  branding: {
    logo: '/default-logo.png',
    logoDark: '/default-logo-dark.png',
    favicon: '/favicon.ico',
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    accentColor: '#10B981',
    companyName: 'Mi Empresa',
  },
  localization: {
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    timezone: 'America/Bogota',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'COP',
    currencySymbol: '$',
    numberFormat: 'es-CO',
  },
  businessRules: {
    maxUsers: 10,
    maxStorage: 1024, // MB
    allowedModules: ['helpdesk', 'crm', 'pqrs'],
    customFields: {},
    workflows: {},
    automations: {},
  },
  compliance: {
    gdprEnabled: true,
    dataRetentionDays: 2555, // 7 años
    auditLogging: true,
    dataEncryption: true,
    backupFrequency: 'daily',
  },
  integrations: {
    emailProvider: 'default',
    analyticsProvider: 'google',
    paymentProvider: 'stripe',
    customIntegrations: {},
  },
  modules: {
    helpdesk: {
      enabled: true,
      customFields: [],
      slaRules: {},
      autoAssignment: false,
    },
    crm: {
      enabled: true,
      customFields: [],
      pipelineStages: ['Lead', 'Contacto', 'Oportunidad', 'Cliente'],
      leadScoring: false,
    },
    pqrs: {
      enabled: true,
      categories: ['Petición', 'Queja', 'Reclamo', 'Sugerencia'],
      responseTime: 24, // horas
      escalationRules: {},
    },
  },
};

export const useCompanyConfiguration = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<CompanyConfiguration>(DEFAULT_COMPANY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración de empresa
  const loadConfiguration = useCallback(async () => {
    if (!user?.company_id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_configurations')
        .select('*')
        .eq('company_id', user.company_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig({ ...DEFAULT_COMPANY_CONFIG, ...data.configuration });
      } else {
        // Crear configuración por defecto
        await createDefaultConfiguration(user.company_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading company configuration');
      console.error('Error loading company configuration:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.company_id]);

  // Crear configuración por defecto
  const createDefaultConfiguration = async (companyId: string) => {
    try {
      await supabase
        .from('company_configurations')
        .insert({
          company_id: companyId,
          configuration: DEFAULT_COMPANY_CONFIG,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.error('Error creating default company configuration:', err);
    }
  };

  // Aplicar configuración de empresa
  const applyCompanyConfiguration = useCallback((configuration: CompanyConfiguration) => {
    // Aplicar branding
    applyBranding(configuration.branding);
    
    // Aplicar localización
    applyLocalization(configuration.localization);
    
    // Aplicar reglas de negocio
    applyBusinessRules(configuration.businessRules);
    
    // Aplicar configuración de módulos
    applyModuleConfiguration(configuration.modules);
  }, []);

  // Aplicar branding
  const applyBranding = (branding: CompanyConfiguration['branding']) => {
    const root = document.documentElement;
    
    // Variables CSS para colores
    root.style.setProperty('--company-primary-color', branding.primaryColor);
    root.style.setProperty('--company-secondary-color', branding.secondaryColor);
    root.style.setProperty('--company-accent-color', branding.accentColor);
    
    // Favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = branding.favicon;
    }
    
    // Logo (se aplica en componentes específicos)
    window.companyBranding = branding;
  };

  // Aplicar localización
  const applyLocalization = (localization: CompanyConfiguration['localization']) => {
    // Configurar formato de fecha/hora
    window.companyLocalization = localization;
    
    // Configurar formato de moneda
    window.companyCurrency = {
      code: localization.currency,
      symbol: localization.currencySymbol,
      format: localization.numberFormat,
    };
  };

  // Aplicar reglas de negocio
  const applyBusinessRules = (businessRules: CompanyConfiguration['businessRules']) => {
    window.companyBusinessRules = businessRules;
  };

  // Aplicar configuración de módulos
  const applyModuleConfiguration = (modules: CompanyConfiguration['modules']) => {
    window.companyModules = modules;
  };

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  useEffect(() => {
    if (config) {
      applyCompanyConfiguration(config);
    }
  }, [config, applyCompanyConfiguration]);

  return {
    config,
    loading,
    error,
    updateConfiguration: async (updates: Partial<CompanyConfiguration>) => {
      if (!user?.company_id) return;
      
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      
      try {
        await supabase
          .from('company_configurations')
          .upsert({
            company_id: user.company_id,
            configuration: newConfig,
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.error('Error updating company configuration:', err);
      }
    },
  };
};
```

### 3. Componente de Configuración de Preferencias

```tsx
// src/components/preferences/UserPreferencesPanel.tsx
const UserPreferencesPanel = () => {
  const { preferences, updatePreference, loading } = useUserPreferences();
  const { t } = useTranslation();

  if (loading) {
    return <div>Cargando preferencias...</div>;
  }

  return (
    <div className="user-preferences-panel">
      <h2>{t('preferences.title', 'Preferencias de Usuario')}</h2>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList>
          <TabsTrigger value="appearance">
            {t('preferences.tabs.appearance', 'Apariencia')}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {t('preferences.tabs.notifications', 'Notificaciones')}
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            {t('preferences.tabs.accessibility', 'Accesibilidad')}
          </TabsTrigger>
          <TabsTrigger value="productivity">
            {t('preferences.tabs.productivity', 'Productividad')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <div className="space-y-4">
            <div className="preference-group">
              <label>{t('preferences.theme', 'Tema')}</label>
              <Select
                value={preferences.theme}
                onValueChange={(value) => updatePreference('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('preferences.theme.light', 'Claro')}</SelectItem>
                  <SelectItem value="dark">{t('preferences.theme.dark', 'Oscuro')}</SelectItem>
                  <SelectItem value="auto">{t('preferences.theme.auto', 'Automático')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="preference-group">
              <label>{t('preferences.fontSize', 'Tamaño de fuente')}</label>
              <Select
                value={preferences.fontSize}
                onValueChange={(value) => updatePreference('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t('preferences.fontSize.small', 'Pequeño')}</SelectItem>
                  <SelectItem value="medium">{t('preferences.fontSize.medium', 'Mediano')}</SelectItem>
                  <SelectItem value="large">{t('preferences.fontSize.large', 'Grande')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="preference-group">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="highContrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference('highContrast', checked)}
                />
                <label htmlFor="highContrast">
                  {t('preferences.highContrast', 'Alto contraste')}
                </label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Otros tabs... */}
      </Tabs>
    </div>
  );
};
```

### 4. Integración en el Layout

```tsx
// src/components/layout/DashboardLayout.tsx
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { preferences } = useUserPreferences();
  const { config } = useCompanyConfiguration();
  
  return (
    <div 
      className={cn(
        'dashboard-layout',
        `theme-${preferences.theme}`,
        `font-size-${preferences.fontSize}`,
        preferences.highContrast && 'high-contrast',
        preferences.reducedMotion && 'reduced-motion',
        preferences.accessibility.focusIndicators && 'focus-indicators',
        preferences.accessibility.colorBlindness !== 'none' && `colorblind-${preferences.accessibility.colorBlindness}`
      )}
      style={{
        '--company-primary-color': config.branding.primaryColor,
        '--company-secondary-color': config.branding.secondaryColor,
        '--company-accent-color': config.branding.accentColor,
      } as React.CSSProperties}
    >
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          {children}
        </main>
        <Footer />
      </div>
      <RightPanel />
    </div>
  );
};
```

### 5. Checklist de Personalización

#### ✅ Antes de agregar nuevas preferencias:
- [ ] ¿Está definida en el tipo UserPreferences?
- [ ] ¿Se almacena en la base de datos?
- [ ] ¿Se aplica globalmente en el layout?
- [ ] ¿Está documentada en la wiki?
- [ ] ¿Incluye valores por defecto?
- [ ] ¿Se puede cambiar desde el panel de preferencias?

#### ✅ Antes de agregar configuración de empresa:
- [ ] ¿Está definida en el tipo CompanyConfiguration?
- [ ] ¿Se almacena en la base de datos?
- [ ] ¿Se aplica globalmente para todos los usuarios?
- [ ] ¿Está documentada en la wiki?
- [ ] ¿Incluye valores por defecto?
- [ ] ¿Se puede cambiar desde el panel de administración?

### 6. Variables CSS para Personalización

```css
/* src/styles/personalization.css */
:root {
  /* Colores de empresa */
  --company-primary-color: #3B82F6;
  --company-secondary-color: #6B7280;
  --company-accent-color: #10B981;
  
  /* Tamaños de fuente */
  --font-size-small: 0.875rem;
  --font-size-medium: 1rem;
  --font-size-large: 1.125rem;
  
  /* Espaciado */
  --spacing-compact: 0.5rem;
  --spacing-normal: 1rem;
  --spacing-relaxed: 1.5rem;
}

/* Temas */
.theme-light {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
  --border-color: #e5e7eb;
}

.theme-dark {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
  --border-color: #374151;
}

/* Alto contraste */
.high-contrast {
  --bg-primary: #000000;
  --text-primary: #ffffff;
  --border-color: #ffffff;
}

/* Movimiento reducido */
.reduced-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Indicadores de foco */
.focus-indicators *:focus {
  outline: 2px solid var(--company-primary-color);
  outline-offset: 2px;
}

/* Daltonismo */
.colorblind-protanopia {
  filter: url('#protanopia');
}

.colorblind-deuteranopia {
  filter: url('#deuteranopia');
}

.colorblind-tritanopia {
  filter: url('#tritanopia');
}
```

---

## Resumen de Leyes de Oro

1. **Personalización Centralizada:** Todas las preferencias se almacenan en la base de datos y se aplican globalmente.
2. **Configuración de Empresa:** Se aplica a todos los usuarios de la empresa.
3. **Valores por Defecto:** Siempre definir valores por defecto sensatos.
4. **Aplicación Inmediata:** Los cambios se aplican sin recargar la página.
5. **Documentación Completa:** Todo debe estar documentado en tipos, hooks y wiki.
6. **Accesibilidad:** Las preferencias de accesibilidad se aplican globalmente.

---

**Nota:** Esta documentación es obligatoria para todo el equipo. Cualquier personalización debe seguir estos estándares. 