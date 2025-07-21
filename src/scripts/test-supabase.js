#!/usr/bin/env node

/**
 * @file test-supabase.js
 * @description Script de prueba para verificar conectividad con Supabase
 * @usage node src/scripts/test-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// TODO: log '🚀 Iniciando pruebas de Supabase...\n'

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// TODO: log '📋 Variables de entorno:'
// TODO: log '  - NEXT_PUBLIC_SUPABASE_URL:' supabaseUrl ? '✅ Configurado' : '❌ No configurado'
// TODO: log '  - NEXT_PUBLIC_SUPABASE_ANON_KEY:' supabaseKey ? '✅ Configurado' : '❌ No configurado'

if (!supabaseUrl || !supabaseKey) {
  // TODO: log '❌ Variables de entorno de Supabase no configuradas'
  // TODO: log '\n🔧 Para configurar:'
  // TODO: log '1. Copiar src/config/env.development.example a .env.local'
  // TODO: log '2. Editar .env.local con tus credenciales reales'
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  // TODO: log '\n🔄 Probando conexión básica...'
  
  try {
    const { data, error } = await supabase.from('companies').select('count').limit(1);
    
    if (error) {
      // TODO: log '⚠️  Error de conexión:' error.message
      
      if (error.code === 'PGRST116') {
        // TODO: log '🔐 Error de autenticación - Verificar clave anónima'
      } else if (error.code === 'PGRST301') {
        // TODO: log '🌐 Error de red - Verificar URL de Supabase'
      }
      
      return false;
    }
    
    // TODO: log '✅ Conexión exitosa con Supabase'
    // TODO: log '📊 Datos recibidos:' data
    return true;
    
  } catch (error) {
    // TODO: log '❌ Error en prueba de conexión:' error.message
    return false;
  }
}

async function testAuth() {
  // TODO: log '\n🔐 Probando autenticación...'
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (error) {
      // TODO: log '⚠️  Error de autenticación:' error.message
      return false;
    }
    
    // TODO: log '✅ Configuración de autenticación correcta'
    return true;
    
  } catch (error) {
    // TODO: log '❌ Error en prueba de autenticación:' error.message
    return false;
  }
}

async function runTests() {
  const connectionTest = await testConnection();
  const authTest = await testAuth();
  
  // TODO: log '\n' + '='.repeat(50)
  // TODO: log '📊 Resumen de pruebas:'
  // TODO: log '  - Conexión:' connectionTest ? '✅' : '❌'
  // TODO: log '  - Autenticación:' authTest ? '✅' : '❌'
  
  if (connectionTest && authTest) {
    // TODO: log '\n🎉 Todas las pruebas pasaron exitosamente!'
    // TODO: log '✅ Supabase está configurado correctamente'
    // TODO: log '\n🚀 Puedes proceder con el desarrollo'
  } else {
    // TODO: log '\n⚠️  Algunas pruebas fallaron'
    // TODO: log '🔧 Revisar configuración de variables de entorno'
    // TODO: log '\n📚 Ver src/config/README.md para más información'
  }
  
  return {
    connection: connectionTest,
    auth: authTest,
    allPassed: connectionTest && authTest
  };
}

// Ejecutar pruebas
runTests().catch(console.error); 