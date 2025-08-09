import { supabase } from '../lib/supabase';

/**
 * @file testSupabaseConnection.ts
 * @description Prueba de conectividad con Supabase
 * @usage npm run test:supabase
 */

export async function testSupabaseConnection() {
  // TODO: log Probando conexión con Supabase en desarrollo
  try {
    // Verificar variables de entorno
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    // TODO: log Variables de entorno en desarrollo
    // TODO: log VITE_SUPABASE_URL en desarrollo
    // TODO: log VITE_SUPABASE_ANON_KEY en desarrollo
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('❌ Variables de entorno de Supabase no configuradas');
    }
    // TODO: log Probando conexión básica en desarrollo
    const mockCompanyId = 'dev-company';
    const { data, error } = await supabase
      .from('companies')
      .select('count')
      .eq('id', mockCompanyId)
      .limit(1);
    if (error) {
      // TODO: log Error de conexión en desarrollo
      // Verificar si es un error de autenticación
      if (error.code === 'PGRST116') {
        // TODO: log Error de autenticación en desarrollo
      } else if (error.code === 'PGRST301') {
        // TODO: log Error de red en desarrollo
      }
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
    // TODO: log Conexión exitosa con Supabase en desarrollo
    // TODO: log Datos recibidos en desarrollo
    return {
      success: true,
      data: data,
      message: 'Conexión exitosa'
    };
  } catch (error) {
    // TODO: log Error en prueba de conexión en desarrollo
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función para probar autenticación
export async function testSupabaseAuth() {
  // TODO: log Probando autenticación con Supabase...
  
  try {
    // Probar signup (solo para verificar configuración)
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (error) {
      // TODO: log Error de autenticación: error.message
      return {
        success: false,
        error: error.message
      };
    }
    
    // TODO: log Configuración de autenticación correcta
    return {
      success: true,
      message: 'Autenticación configurada correctamente'
    };
    
  } catch (error) {
    // TODO: log Error en prueba de autenticación: error
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función principal de prueba
export async function runSupabaseTests() {
  // TODO: log Iniciando pruebas de Supabase...
  
  const connectionTest = await testSupabaseConnection();
  // TODO: log resumen de pruebas y resultados
  
  const authTest = await testSupabaseAuth();
  // TODO: log resumen de pruebas y resultados
  
  // TODO: log Resumen de pruebas:
  // TODO: log  - Conexión: connectionTest.success ? '✅' : '❌'
  // TODO: log  - Autenticación: authTest.success ? '✅' : '❌'
  
  if (connectionTest.success && authTest.success) {
    // TODO: log 🎉 Todas las pruebas pasaron exitosamente!
    // TODO: log ✅ Supabase está configurado correctamente
  } else {
    // TODO: log ⚠️  Algunas pruebas fallaron
    // TODO: log 🔧 Revisar configuración de variables de entorno
  }
  
  return {
    connection: connectionTest,
    auth: authTest,
    allPassed: connectionTest.success && authTest.success
  };
}

// Ejecutar si se llama directamente
if (import.meta.env.DEV) {
  runSupabaseTests();
} 