/**
 * Configuración global de la aplicación VibeThink Orchestrator
 * @author VibeThink Platform
 */

export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080'
} as const;

export const FEATURE_FLAGS = {
  ENABLE_AI_CHAT: true,
  ENABLE_WORKFLOWS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_COOKIES: true,
  ENABLE_PERSONALIZATION: true,
  ENABLE_SUPER_ADMIN: true,
  ENABLE_TESTING_MODE: import.meta.env.MODE === 'development'
} as const;

export const APP_CONFIG = {
  NAME: 'VibeThink Orchestrator',
  VERSION: '1.1.0',
  DESCRIPTION: 'Enterprise SaaS platform with AI integration',
  AUTHOR: 'VibeThink Platform Team',
  SUPPORT_EMAIL: 'support@VibeThink.co'
} as const;

export { ROLES, PERMISSIONS } from '@vibethink/utils'; 