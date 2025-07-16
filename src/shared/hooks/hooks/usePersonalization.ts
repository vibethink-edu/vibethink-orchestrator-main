/**
 * Personalization Hook
 * 
 * Centralized personalization management
 * - User preferences
 * - Company configuration
 * - Theme management
 * - Accessibility settings
 * - Branding customization
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/hooks/hooks/useAuth';
// import { useUserPreferences, useCompanyConfiguration } from '@/shared/hooks/base/useLocalStorage';

// User preferences interface
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'sm' | 'md' | 'lg';
  highContrast: boolean;
  reducedMotion: boolean;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  language: 'es' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  accessibility: {
    screenReader: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
  };
}

// Company configuration interface
interface CompanyConfiguration {
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    companyName: string;
    favicon: string;
  };
  modules: {
    helpdesk: boolean;
    crm: boolean;
    analytics: boolean;
    admin: boolean;
    ai: boolean;
  };
  features: {
    realTimeUpdates: boolean;
    advancedReporting: boolean;
    customWorkflows: boolean;
    integrations: boolean;
  };
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
}

// Personalization hook return type
interface PersonalizationReturn {
  // User preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  
  // Company configuration
  companyConfig: CompanyConfiguration;
  updateCompanyConfig: (updates: Partial<CompanyConfiguration>) => void;
  
  // Theme management
  currentTheme: 'light' | 'dark';
  setTheme: (theme: UserPreferences['theme']) => void;
  
  // Accessibility
  isHighContrast: boolean;
  isReducedMotion: boolean;
  fontSize: string;
  
  // Branding
  primaryColor: string;
  companyName: string;
  logo: string;
  
  // Module access
  hasModuleAccess: (module: keyof CompanyConfiguration['modules']) => boolean;
  hasFeatureAccess: (feature: keyof CompanyConfiguration['features']) => boolean;
  
  // Utilities
  resetToDefaults: () => void;
  exportConfiguration: () => string;
  importConfiguration: (config: string) => void;
}

// Default preferences
const defaultUserPreferences: UserPreferences = {
  theme: 'auto',
  fontSize: 'md',
  highContrast: false,
  reducedMotion: false,
  sidebarCollapsed: false,
  rightPanelCollapsed: true,
  language: 'es',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  accessibility: {
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true
  }
};

// Default company configuration
const defaultCompanyConfiguration: CompanyConfiguration = {
  branding: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    logo: '',
    companyName: 'Mi Empresa',
    favicon: ''
  },
  modules: {
    helpdesk: true,
    crm: true,
    analytics: true,
    admin: true,
    ai: true
  },
  features: {
    realTimeUpdates: true,
    advancedReporting: true,
    customWorkflows: false,
    integrations: true
  },
  settings: {
    timezone: 'America/Bogota',
    dateFormat: 'DD/MM/YYYY',
    currency: 'COP',
    language: 'es'
  }
};

// STUB TEMPORAL - usePersonalization
// export function usePersonalization() {
//   console.warn('usePersonalization (stub): implementar lógica real.');
//   return { preferences: {} };
// }

/**
 * Personalization Hook
 */
export function usePersonalization(): PersonalizationReturn {
  const { user, hasPermission } = useAuth();
  
  // User preferences with defaults - implementación simple
  const [preferences, setPreferences] = useState<UserPreferences>(defaultUserPreferences);
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Company configuration with defaults - implementación simple
  const [companyConfig, setCompanyConfig] = useState<CompanyConfiguration>({
    ...defaultCompanyConfiguration,
    modules: {
      ...defaultCompanyConfiguration.modules,
      admin: hasPermission('ADMIN')
    }
  });
  const updateCompanyConfig = useCallback((updates: Partial<CompanyConfiguration>) => {
    setCompanyConfig(prev => ({ ...prev, ...updates }));
  }, [hasPermission]);

  // Current theme state
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Apply theme changes
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (preferences.theme === 'auto') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const isDark = mediaQuery.matches;
        
        root.classList.toggle('dark', isDark);
        setCurrentTheme(isDark ? 'dark' : 'light');
        
        // Listen for system theme changes
        const handleChange = (e: MediaQueryListEvent) => {
          root.classList.toggle('dark', e.matches);
          setCurrentTheme(e.matches ? 'dark' : 'light');
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        const isDark = preferences.theme === 'dark';
        root.classList.toggle('dark', isDark);
        setCurrentTheme(preferences.theme);
      }
    };

    applyTheme();
  }, [preferences.theme]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    const fontSizeMap = {
      sm: '14px',
      md: '16px',
      lg: '18px'
    };
    
    root.style.fontSize = fontSizeMap[preferences.fontSize];
  }, [preferences.fontSize]);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    root.classList.toggle('high-contrast', preferences.highContrast);
    
    // Reduced motion
    root.classList.toggle('reduce-motion', preferences.reducedMotion);
    
    // Focus indicators
    root.classList.toggle('focus-visible', preferences.accessibility.focusIndicators);
  }, [preferences.highContrast, preferences.reducedMotion, preferences.accessibility.focusIndicators]);

  // Apply company branding
  useEffect(() => {
    const root = document.documentElement;
    
    if (companyConfig.branding.primaryColor) {
      root.style.setProperty('--company-primary-color', companyConfig.branding.primaryColor);
    }
    
    if (companyConfig.branding.secondaryColor) {
      root.style.setProperty('--company-secondary-color', companyConfig.branding.secondaryColor);
    }
  }, [companyConfig.branding.primaryColor, companyConfig.branding.secondaryColor]);

  // Set theme function
  const setTheme = useCallback((theme: UserPreferences['theme']) => {
    updatePreferences({ theme });
  }, [updatePreferences]);

  // Check module access
  const hasModuleAccess = useCallback((module: keyof CompanyConfiguration['modules']): boolean => {
    if (!companyConfig.modules[module]) return false;
    
    // Check permissions for admin module
    if (module === 'admin' && !hasPermission('ADMIN')) return false;
    
    return true;
  }, [companyConfig.modules, hasPermission]);

  // Check feature access
  const hasFeatureAccess = useCallback((feature: keyof CompanyConfiguration['features']): boolean => {
    if (!companyConfig.features[feature]) return false;
    
    // Check permissions for advanced features
    if (feature === 'advancedReporting' && !hasPermission('ADMIN')) return false;
    if (feature === 'customWorkflows' && !hasPermission('ADMIN')) return false;
    
    return true;
  }, [companyConfig.features, hasPermission]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setPreferences(defaultUserPreferences);
    setCompanyConfig(defaultCompanyConfiguration);
  }, [setPreferences, setCompanyConfig]);

  // Export configuration
  const exportConfiguration = useCallback((): string => {
    const config = {
      user: user?.id,
      company: user?.company_id,
      preferences,
      companyConfig,
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(config, null, 2);
  }, [user, preferences, companyConfig]);

  // Import configuration
  const importConfiguration = useCallback((configString: string) => {
    try {
      const config = JSON.parse(configString);
      
      if (config.preferences) {
        updatePreferences(config.preferences);
      }
      
      if (config.companyConfig) {
        updateCompanyConfig(config.companyConfig);
      }
    } catch (error) {
      console.error('Error importing configuration:', error);
      throw new Error('Invalid configuration format');
    }
  }, [updatePreferences, updateCompanyConfig]);

  return {
    // User preferences
    preferences,
    updatePreferences,
    
    // Company configuration
    companyConfig,
    updateCompanyConfig,
    
    // Theme management
    currentTheme,
    setTheme,
    
    // Accessibility
    isHighContrast: preferences.highContrast,
    isReducedMotion: preferences.reducedMotion,
    fontSize: preferences.fontSize === 'sm' ? '14px' : preferences.fontSize === 'lg' ? '18px' : '16px',
    
    // Branding
    primaryColor: companyConfig.branding.primaryColor,
    companyName: companyConfig.branding.companyName,
    logo: companyConfig.branding.logo,
    
    // Module access
    hasModuleAccess,
    hasFeatureAccess,
    
    // Utilities
    resetToDefaults,
    exportConfiguration,
    importConfiguration
  };
}

// Export types
export type { UserPreferences, CompanyConfiguration, PersonalizationReturn };

// Implementación simple de useUserPreferences
function useUserPreferences<T>(defaultValue: T): [T, (updates: Partial<T>) => void] {
  const [preferences, setPreferences] = useState<T>(defaultValue);
  
  const updatePreferences = useCallback((updates: Partial<T>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);
  
  return [preferences, updatePreferences];
}

// Implementación simple de useCompanyConfiguration
function useCompanyConfiguration<T>(defaultValue: T): [T, (updates: Partial<T>) => void] {
  const [config, setConfig] = useState<T>(defaultValue);
  
  const updateConfig = useCallback((updates: Partial<T>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);
  
  return [config, updateConfig];
} 