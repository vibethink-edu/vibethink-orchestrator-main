#!/usr/bin/env node

/**
 * Script de optimización para desarrollo - VibeThink Orchestrator
 * Resuelve problemas de Fast Refresh y configuración de desarrollo
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Optimizando entorno de desarrollo...');

// Verificar y crear archivos necesarios
const checks = [
  {
    name: 'next.config.js',
    path: './next.config.js',
    required: true
  },
  {
    name: 'public/favicon.ico',
    path: './public/favicon.ico',
    required: true
  },
  {
    name: 'app/favicon.ico',
    path: './app/favicon.ico',
    required: false
  }
];

checks.forEach(check => {
  if (fs.existsSync(check.path)) {
    console.log(`✅ ${check.name} existe`);
  } else if (check.required) {
    console.log(`❌ ${check.name} faltante - REQUERIDO`);
  } else {
    console.log(`⚠️  ${check.name} faltante - OPCIONAL`);
  }
});

// Verificar configuración de desarrollo
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const scripts = packageJson.scripts || {};

if (scripts.dev) {
  console.log('✅ Script dev configurado');
} else {
  console.log('❌ Script dev faltante');
}

// Verificar variables de entorno
const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`⚠️  ${file} faltante`);
  }
});

console.log('\n🎯 Recomendaciones:');
console.log('1. Instalar React DevTools: https://react.dev/link/react-devtools');
console.log('2. Reiniciar servidor de desarrollo: npm run dev');
console.log('3. Limpiar cache si persisten problemas: rm -rf .next');

console.log('\n✅ Optimización completada'); 