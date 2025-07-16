// Authentication Hooks
export { useAuth, AuthProvider } from './useAuth';

// Company Management Hooks
export { useCompanyLimits, usePlanDefinitions, useConfigureCompanyPlan } from './useCompanyLimits';
export { useCompanyQualityStandards } from './useCompanyQualityStandards';

// Framework Hooks
export { useSwissArmyDecision } from './useSwissArmyDecision';

// UI and Theme Hooks
export { useDaylightTheme } from './useDaylightTheme';
export { useBreakpoint } from './use-breakpoint';
export { useCookies } from './useCookies';
export { useRoleContext } from './useRoleContext';
export { useSuperAdmin } from './useSuperAdmin';

// Email and Language Hooks
export { useEmail } from './useEmail';
export { useLanguage } from './useLanguage';

// Operational Hooks
export { useOperationalRepositories } from './useOperationalRepositories';

// Mock hooks for missing functionality
export const useDepartmentStandards = () => ({
  standards: [],
  isLoading: false,
  error: null,
  updateStandards: async () => {},
  getStandards: async () => {}
});

export const useDepartmentalPermissions = () => ({
  permissions: [],
  isLoading: false,
  error: null,
  updatePermissions: async () => {},
  getPermissions: async () => {}
});

export const usePlatformConfigurations = () => ({
  configurations: [],
  isLoading: false,
  error: null,
  updateConfiguration: async () => {},
  getConfigurations: async () => {}
});

export const useUsers = () => ({
  users: [],
  isLoading: false,
  error: null,
  updateUser: async () => {},
  getUsers: async () => {}
});

export const useAIProvider = () => ({
  providers: [],
  isLoading: false,
  error: null,
  updateProvider: async () => {},
  getProviders: async () => {}
});

export const useAgno = () => ({
  agnoData: null,
  isLoading: false,
  error: null,
  updateAgno: async () => {},
  getAgno: async () => {}
});

export const useMultiCountryConfiguration = () => ({
  configurations: [],
  isLoading: false,
  error: null,
  updateConfiguration: async () => {},
  getConfigurations: async () => {}
});

export const useToast = () => ({
  toast: (message: string) => {
    // TODO: log toast genérico (message) para auditoría
  },
  error: (message: string) => {
    // TODO: log toast de error (message) para auditoría
  },
  success: (message: string) => {
    // TODO: log toast de éxito (message) para auditoría
  }
}); 