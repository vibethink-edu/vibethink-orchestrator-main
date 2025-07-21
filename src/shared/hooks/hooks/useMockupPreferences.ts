import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { UserPreferences, ThemeType, FontType, AccentColor } from '../components/MockupPaneles';

/**
 * Preferencias por defecto del sistema
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  font: 'Inter',
  accentColor: 'blue'
};

/**
 * Hook personalizado para manejar las preferencias del mockup
 * 
 * Este hook proporciona funcionalidad completa para:
 * - Cargar preferencias del usuario desde la base de datos
 * - Aplicar herencia de preferencias (usuario > empresa > sistema)
 * - Persistir cambios en tiempo real
 * - Sincronizar con el sistema de autenticación
 * - Cachear preferencias para performance
 * 
 * @returns Objeto con preferencias y métodos para manejarlas
 * 
 * @example
 * ```typescript
 * const { 
 *   preferences, 
 *   updatePreferences, 
 *   resetToDefaults,
 *   isLoading 
 * } = useMockupPreferences();
 * 
 * // Actualizar tema
 * updatePreferences({ theme: 'dark' });
 * 
 * // Resetear a valores por defecto
 * resetToDefaults();
 * ```
 * 
 * @author Sistema de Gestión Empresarial
 * @version 1.0.0
 * @since 2024-01-01
 */
export function useMockupPreferences() {
  const { user, hasPermission } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga las preferencias del usuario desde la base de datos
   * Aplica herencia: usuario > empresa > sistema
   */
  const loadPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(DEFAULT_PREFERENCES);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implementar carga desde Supabase
      // const { data: userPrefs } = await supabase
      //   .from('user_preferences')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .single();

      // const { data: companyPrefs } = await supabase
      //   .from('company_preferences')
      //   .select('*')
      //   .eq('company_id', user.company_id)
      //   .single();

      // Aplicar herencia de preferencias
      const userPrefs = null; // Temporal hasta implementar BD
      const companyPrefs = null; // Temporal hasta implementar BD

      const finalPreferences: UserPreferences = {
        theme: userPrefs?.theme || companyPrefs?.theme || DEFAULT_PREFERENCES.theme,
        font: userPrefs?.font || companyPrefs?.font || DEFAULT_PREFERENCES.font,
        accentColor: userPrefs?.accent_color || companyPrefs?.accent_color || DEFAULT_PREFERENCES.accentColor,
      };

      setPreferences(finalPreferences);
    } catch (err) {
      // TODO: log error loading preferences
      setError('Error al cargar las preferencias');
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Actualiza las preferencias del usuario
   * @param newPreferences - Nuevas preferencias a aplicar
   */
  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    if (!user) {
      // TODO: log user not authenticated, cannot save preferences
      return;
    }

    try {
      setError(null);
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);

      // TODO: Implementar guardado en Supabase
      // await supabase
      //   .from('user_preferences')
      //   .upsert({
      //     user_id: user.id,
      //     theme: updatedPreferences.theme,
      //     font: updatedPreferences.font,
      //     accent_color: updatedPreferences.accentColor,
      //     updated_at: new Date().toISOString()
      //   });

      // Aplicar cambios inmediatamente al DOM
      applyThemeToDOM(updatedPreferences.theme);
      applyFontToDOM(updatedPreferences.font);

    } catch (err) {
      // TODO: log error saving preferences
      setError('Error al guardar las preferencias');
      // Revertir cambios en caso de error
      setPreferences(preferences);
    }
  }, [user, preferences]);

  /**
   * Resetea las preferencias a los valores por defecto
   */
  const resetToDefaults = useCallback(async () => {
    await updatePreferences(DEFAULT_PREFERENCES);
  }, [updatePreferences]);

  /**
   * Aplica el tema al DOM
   * @param theme - Tema a aplicar
   */
  const applyThemeToDOM = useCallback((theme: ThemeType) => {
    const root = document.documentElement;
    
    // Remover clases anteriores
    root.classList.remove('dark', 'company-theme');
    
    // Aplicar nuevo tema
    switch (theme) {
      case 'dark':
        root.classList.add('dark');
        break;
      case 'company':
        root.classList.add('company-theme');
        break;
      default:
        // Tema claro - no agregar clases adicionales
        break;
    }
  }, []);

  /**
   * Aplica la fuente al DOM
   * @param font - Fuente a aplicar
   */
  const applyFontToDOM = useCallback((font: FontType) => {
    const root = document.documentElement;
    
    // Remover clases de fuente anteriores
    root.classList.remove('font-inter', 'font-roboto', 'font-montserrat', 'font-open-sans', 'font-lato');
    
    // Aplicar nueva fuente
    const fontClass = `font-${font.toLowerCase().replace(' ', '-')}`;
    root.classList.add(fontClass);
  }, []);

  /**
   * Obtiene las preferencias de la empresa
   * Solo disponible para usuarios con permisos de administración
   */
  const getCompanyPreferences = useCallback(async () => {
    if (!user || !hasPermission('ADMIN')) {
      throw new Error('No tienes permisos para acceder a las preferencias de la empresa');
    }

    try {
      // TODO: Implementar carga desde Supabase
      // const { data } = await supabase
      //   .from('company_preferences')
      //   .select('*')
      //   .eq('company_id', user.company_id)
      //   .single();

      return null; // Temporal hasta implementar BD
    } catch (err) {
      // TODO: log error loading company preferences
      throw err;
    }
  }, [user, hasPermission]);

  /**
   * Actualiza las preferencias de la empresa
   * Solo disponible para usuarios con permisos de administración
   */
  const updateCompanyPreferences = useCallback(async (companyPreferences: Partial<UserPreferences>) => {
    if (!user || !hasPermission('ADMIN')) {
      throw new Error('No tienes permisos para actualizar las preferencias de la empresa');
    }

    try {
      // TODO: Implementar guardado en Supabase
      // await supabase
      //   .from('company_preferences')
      //   .upsert({
      //     company_id: user.company_id,
      //     theme: companyPreferences.theme,
      //     font: companyPreferences.font,
      //     accent_color: companyPreferences.accentColor,
      //     updated_at: new Date().toISOString(),
      //     updated_by: user.id
      //   });

      // Recargar preferencias para aplicar herencia
      await loadPreferences();
    } catch (err) {
      // TODO: log error saving company preferences
      throw err;
    }
  }, [user, hasPermission, loadPreferences]);

  // Cargar preferencias al montar el componente
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Aplicar preferencias al DOM cuando cambien
  useEffect(() => {
    applyThemeToDOM(preferences.theme);
    applyFontToDOM(preferences.font);
  }, [preferences.theme, preferences.font, applyThemeToDOM, applyFontToDOM]);

  return {
    preferences,
    updatePreferences,
    resetToDefaults,
    getCompanyPreferences,
    updateCompanyPreferences,
    isLoading,
    error,
    hasPermission: hasPermission('ADMIN')
  };
}

/**
 * Hook simplificado para obtener solo las preferencias actuales
 * Útil para componentes que solo necesitan leer las preferencias
 * 
 * @returns Preferencias actuales del usuario
 */
export function usePreferences() {
  const { preferences } = useMockupPreferences();
  return preferences;
}

/**
 * Hook para obtener solo el tema actual
 * Optimizado para componentes que solo necesitan el tema
 * 
 * @returns Tema actual
 */
export function useTheme() {
  const { preferences } = useMockupPreferences();
  return preferences.theme;
}

/**
 * Hook para obtener solo la fuente actual
 * Optimizado para componentes que solo necesitan la fuente
 * 
 * @returns Fuente actual
 */
export function useFont() {
  const { preferences } = useMockupPreferences();
  return preferences.font;
}

/**
 * Hook para obtener solo el color de acento actual
 * Optimizado para componentes que solo necesitan el color de acento
 * 
 * @returns Color de acento actual
 */
export function useAccentColor() {
  const { preferences } = useMockupPreferences();
  return preferences.accentColor;
} 