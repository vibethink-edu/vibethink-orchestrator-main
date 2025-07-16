#!/usr/bin/env node

/**
 * @file test-supabase.js
 * @description Script de prueba para verificar conectividad con Supabase
 * @usage node src/scripts/test-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Iniciando pruebas de Supabase...\n');

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📋 Variables de entorno:');
console.log('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurado' : '❌ No configurado');
console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configurado' : '❌ No configurado');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  console.log('\n🔧 Para configurar:');
  console.log('1. Copiar src/config/env.development.example a .env.local');
  console.log('2. Editar .env.local con tus credenciales reales');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('\n🔄 Probando conexión básica...');
  
  try {
    const { data, error } = await supabase.from('companies').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Error de conexión:', error.message);
      
      if (error.code === 'PGRST116') {
        console.log('🔐 Error de autenticación - Verificar clave anónima');
      } else if (error.code === 'PGRST301') {
        console.log('🌐 Error de red - Verificar URL de Supabase');
      }
      
      return false;
    }
    
    console.log('✅ Conexión exitosa con Supabase');
    console.log('📊 Datos recibidos:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Error en prueba de conexión:', error.message);
    return false;
  }
}

async function testAuth() {
  console.log('\n🔐 Probando autenticación...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (error) {
      console.log('⚠️  Error de autenticación:', error.message);
      return false;
    }
    
    console.log('✅ Configuración de autenticación correcta');
    return true;
    
  } catch (error) {
    console.error('❌ Error en prueba de autenticación:', error.message);
    return false;
  }
}

async function runTests() {
  const connectionTest = await testConnection();
  const authTest = await testAuth();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumen de pruebas:');
  console.log('  - Conexión:', connectionTest ? '✅' : '❌');
  console.log('  - Autenticación:', authTest ? '✅' : '❌');
  
  if (connectionTest && authTest) {
    console.log('\n🎉 Todas las pruebas pasaron exitosamente!');
    console.log('✅ Supabase está configurado correctamente');
    console.log('\n🚀 Puedes proceder con el desarrollo');
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron');
    console.log('🔧 Revisar configuración de variables de entorno');
    console.log('\n📚 Ver src/config/README.md para más información');
  }
  
  return {
    connection: connectionTest,
    auth: authTest,
    allPassed: connectionTest && authTest
  };
}

// Ejecutar pruebas
runTests().catch(console.error); 