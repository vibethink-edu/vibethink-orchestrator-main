/**
 * Quick Start Script
 * 
 * Automatiza toda la configuración inicial para evitar
 * la configuración manual repetitiva
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function quickStart() {
  console.log('🚀 AI Pair Orchestrator Pro - Quick Start\n');
  console.log('='.repeat(60));
  
  // 1. Verificar dependencias
  console.log('\n📦 Verificando dependencias...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencias instaladas');
  } catch (error) {
    console.log('❌ Error instalando dependencias');
    console.log('💡 Intenta ejecutar: npm install');
    return;
  }
  
  // 2. Configurar variables de entorno
  console.log('\n🔧 Configurando variables de entorno...');
  try {
    execSync('node setup-env.js', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Variables configuradas');
  } catch (error) {
    console.log('❌ Error configurando variables');
    console.log('💡 Verifica que setup-env.js existe');
    return;
  }
  
  // 3. Verificar conexión a Supabase
  console.log('\n🔗 Verificando conexión a Supabase...');
  try {
    execSync('npm run test:supabase', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Conexión verificada');
  } catch (error) {
    console.log('❌ Error en conexión');
    console.log('💡 Verifica tu API key en .env.local');
    return;
  }
  
  // 4. Verificar estructura de BD
  console.log('\n📊 Verificando estructura de base de datos...');
  try {
    execSync('npm run db:check', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Estructura verificada');
  } catch (error) {
    console.log('❌ Error verificando estructura');
    console.log('💡 Verifica la conexión a la base de datos');
    return;
  }
  
  // 5. Verificar tipos TypeScript
  console.log('\n🔍 Verificando tipos TypeScript...');
  try {
    execSync('npm run type-check', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Tipos verificados');
  } catch (error) {
    console.log('⚠️  Advertencias de tipos (no crítico)');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ¡Configuración completada exitosamente!');
  console.log('='.repeat(60));
  
  console.log('\n🚀 Próximos pasos:');
  console.log('   1. Ejecuta: npm run dev');
  console.log('   2. Abre: http://localhost:8080');
  console.log('   3. ¡Disfruta desarrollando!');
  
  console.log('\n📚 Recursos útiles:');
  console.log('   - Documentación: /docs/');
  console.log('   - Guía de producción: PRODUCTION_DEPLOYMENT_GUIDE.md');
  console.log('   - Soporte: support@VibeThink.co');
  
  console.log('\n🔧 Comandos útiles:');
  console.log('   - npm run dev (servidor de desarrollo)');
  console.log('   - npm run build (build de producción)');
  console.log('   - npm run test (ejecutar tests)');
  console.log('   - npm run lint (verificar código)');
  
  console.log('\n✨ ¡Todo listo para empezar!');
}

// Manejar errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('💥 Error no manejado:', error);
  process.exit(1);
});

quickStart().catch((error) => {
  console.error('💥 Error en quick start:', error);
  process.exit(1);
}); 