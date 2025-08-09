/**
 * @file client.ts  
 * @description VTHINK OPTIMIZED - Cliente universal compatible mock/real DB
 * Mantiene rendimiento optimal y facilita transición
 */

import { createClient } from '@supabase/supabase-js';
import { createDatabaseClient } from '@/shared/lib/database-adapter';

// ✅ MODO DESARROLLO - Mock para rendimiento
const USE_MOCK_DB = process.env.NODE_ENV !== 'production' || process.env.VTHINK_USE_MOCK === 'true';

// ✅ CONFIGURACIÓN REAL SUPABASE (para cuando esté listo)
// En Next.js usamos process.env en lugar de import.meta.env (no Vite)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pikywaoqlekupfynnclg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-key';

/**
 * ✅ CLIENTE OPTIMIZADO - Auto-selecciona mock vs real
 * - Desarrollo: Mock rápido para UI development
 * - Producción: Real Supabase cuando esté configurado
 */
export const supabase = USE_MOCK_DB 
  ? createDatabaseClient() 
  : createClient(supabaseUrl, supabaseAnonKey);

// ✅ COMPATIBILITY EXPORT - Para transición fácil
export { supabase as default };

console.log(`🔧 Database Mode: ${USE_MOCK_DB ? 'MOCK (Fast Development)' : 'REAL (Production)'}`); 