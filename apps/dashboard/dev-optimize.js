#!/usr/bin/env node

/**
 * Optimizador de Desarrollo - VThink 1.0
 * Script para acelerar el servidor de desarrollo
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 VThink Dev Optimizer - Iniciando optimización...\n');

// 1. Limpieza de caches
console.log('1️⃣ Limpiando caches...');
try {
  execSync('rmdir /s /q .next 2>nul || echo "Cache .next limpio"', { stdio: 'inherit' });
  execSync('rmdir /s /q node_modules\\.cache 2>nul || echo "Cache node_modules limpio"', { stdio: 'inherit' });
  console.log('✅ Caches limpiados\n');
} catch (e) {
  console.log('✅ Caches ya estaban limpios\n');
}

// 2. Optimización de memoria
console.log('2️⃣ Configurando optimizaciones de memoria...');
process.env.NODE_OPTIONS = '--max-old-space-size=4096 --optimize-for-size';
console.log('✅ Memoria optimizada (4GB heap size)\n');

// 3. Variables de entorno para desarrollo rápido
console.log('3️⃣ Configurando variables de desarrollo...');
process.env.NEXT_TELEMETRY_DISABLED = '1'; // Disable telemetry
process.env.WATCHPACK_POLLING = '1000'; // Faster file watching
console.log('✅ Variables configuradas\n');

// 4. Información del sistema
console.log('4️⃣ Estado del sistema:');
console.log(`   📁 Directorio: ${process.cwd()}`);
console.log(`   💾 Memoria asignada: ${process.env.NODE_OPTIONS}`);
console.log(`   ⚡ Puerto: 3001`);
console.log(`   🔄 Polling: ${process.env.WATCHPACK_POLLING}ms\n`);

console.log('🎯 Optimización completa! Iniciando servidor...\n');
console.log('💡 Tips adicionales:');
console.log('   - Cierra pestañas innecesarias del navegador');
console.log('   - Usa Chrome DevTools Network tab en "Disable cache"');
console.log('   - Considera usar --turbo flag para Next.js 13+');
console.log('\n' + '='.repeat(50));

// 5. Iniciar servidor optimizado
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error iniciando servidor:', error.message);
  process.exit(1);
}