
/**
 * UI/UX Guidelines for the Project
 * 
 * This file contains the standard practices that should be followed
 * throughout the entire project to ensure consistent user experience.
 */

export const UI_GUIDELINES = {
  // Tooltip Requirements
  TOOLTIPS: {
    // All interactive elements MUST have tooltips
    REQUIRED_ELEMENTS: [
      'buttons',
      'icons',
      'form_inputs',
      'badges',
      'status_indicators',
      'action_items',
      'navigation_items',
      'filter_controls',
      'settings_toggles'
    ],
    
    // Tooltip best practices
    BEST_PRACTICES: {
      DESCRIPTIVE: 'Tooltips should clearly describe what the element does',
      CONTEXTUAL: 'Include context about the current state when relevant',
      CONCISE: 'Keep messages short but informative',
      ACTIONABLE: 'Use action verbs for interactive elements'
    }
  },

  // Accessibility Standards
  ACCESSIBILITY: {
    KEYBOARD_NAVIGATION: 'All interactive elements must be keyboard accessible',
    ARIA_LABELS: 'Use proper ARIA labels for screen readers',
    COLOR_CONTRAST: 'Ensure sufficient color contrast for readability',
    FOCUS_INDICATORS: 'Visible focus indicators for all interactive elements'
  },

  // Component Standards
  COMPONENTS: {
    LOADING_STATES: 'All async operations must show loading states',
    ERROR_HANDLING: 'Proper error messages and recovery options',
    EMPTY_STATES: 'Meaningful empty state messages with clear actions',
    RESPONSIVE_DESIGN: 'All components must work on mobile and desktop'
  },

  // User Feedback
  FEEDBACK: {
    SUCCESS_MESSAGES: 'Clear confirmation of successful actions',
    ERROR_MESSAGES: 'Helpful error messages with next steps',
    PROGRESS_INDICATORS: 'Show progress for long-running operations',
    STATUS_UPDATES: 'Keep users informed of system status'
  }
};

/**
 * Standard tooltip messages for common UI elements
 */
export const STANDARD_TOOLTIPS = {
  // Common actions
  EDIT: 'Editar elemento',
  DELETE: 'Eliminar elemento',
  SAVE: 'Guardar cambios',
  CANCEL: 'Cancelar operación',
  CLOSE: 'Cerrar panel/modal',
  
  // Navigation
  BACK: 'Volver a la página anterior',
  NEXT: 'Ir a la siguiente página',
  HOME: 'Ir al inicio',
  
  // Views
  LIST_VIEW: 'Vista en lista',
  GRID_VIEW: 'Vista en cuadrícula',
  
  // Filters
  FILTER: 'Filtrar resultados',
  SEARCH: 'Buscar elementos',
  SORT: 'Ordenar elementos',
  
  // Settings
  TOGGLE_PANEL: 'Mostrar/ocultar panel',
  SETTINGS: 'Abrir configuración',
  
  // Status indicators
  ACTIVE: 'Estado activo',
  INACTIVE: 'Estado inactivo',
  PENDING: 'Operación pendiente'
};

/**
 * Helper function to ensure consistent tooltip implementation
 */
export const createTooltipConfig = (message: string, side: 'top' | 'bottom' | 'left' | 'right' = 'top') => ({
  message,
  side,
  className: 'z-50 bg-popover text-popover-foreground border border-border'
});
