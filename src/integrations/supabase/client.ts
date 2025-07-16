/**
 * @file client.ts
 * @description Inicializa el cliente de Supabase para la integración con la plataforma.
 * @see https://supabase.com/docs/reference/javascript/initializing
 */

import { createClient } from '@supabase/supabase-js';

// Configuración temporal para desarrollo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pikywaoqlekupfynnclg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'test-key';

/**
 * Cliente global de Supabase.
 * @type {ReturnType<typeof createClient>}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 