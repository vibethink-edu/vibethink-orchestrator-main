import { createClient } from '@supabase/supabase-js';

/**
 * @file supabase.ts
 * @description Inicializa el cliente de Supabase para la integración con la plataforma VThink 1.0.
 * @see https://supabase.com/docs/reference/javascript/initializing
 */

// Declaración de tipos para Vite env
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Comentario: Esto ayuda a detectar errores de configuración en desarrollo.
  // En producción, podrías lanzar un error o registrar en un sistema de monitoreo.
  // eslint-disable-next-line no-console
  console.warn('Supabase: Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
}

/**
 * Cliente global de Supabase.
 * @type {ReturnType<typeof createClient>}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 