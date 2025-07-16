#!/usr/bin/env node

/**
 * Script para ejecutar la demo de Bundui UI
 * VibeThink Orchestrator - VThink 1.0
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Colores para console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para log con colores
const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Función para verificar archivos de demo
const checkDemoFiles = () => {
  log(colors.blue, '🔍 Verificando archivos de demo Bundui...');
  
  const demoFiles = [
    'app/ui/bundui/pages/BunduiLoginPage.tsx',
    'app/ui/bundui/pages/BunduiDashboardPage.tsx',
    'app/ui/bundui/pages/BunduiDemoPage.tsx'
  ];

  let allFilesExist = true;
  
  demoFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(colors.green, `✅ ${file}`);
    } else {
      log(colors.red, `❌ ${file} - NO EXISTE`);
      allFilesExist = false;
    }
  });

  return allFilesExist;
};

// Función para iniciar servidor de desarrollo
const startDevServer = () => {
  log(colors.blue, '\n🚀 Iniciando servidor de desarrollo...');
  
  try {
    log(colors.yellow, 'Ejecutando: npm run dev');
    log(colors.blue, 'La demo estará disponible en: http://localhost:3000');
    log(colors.blue, 'Páginas disponibles:');
    log(colors.green, '  • /bundui-demo - Página principal de demo');
    log(colors.green, '  • /bundui-login - Página de login');
    log(colors.green, '  • /bundui-dashboard - Dashboard general');
    log(colors.green, '  • /bundui-test - Página de test de componentes');
    
    execSync('npm run dev', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
  } catch (error) {
    log(colors.red, '❌ Error iniciando servidor de desarrollo');
    log(colors.red, error.message);
    return false;
  }
};

// Función principal
const runBunduiDemo = () => {
  log(colors.bold + colors.blue, '\n🎨 BUNDUI UI DEMO - VibeThink Orchestrator');
  log(colors.blue, '=' .repeat(60));
  
  const startTime = Date.now();
  
  // Verificar archivos de demo
  const demoFilesExist = checkDemoFiles();
  
  if (!demoFilesExist) {
    log(colors.red, '\n❌ Algunos archivos de demo no existen');
    log(colors.red, '❌ Ejecuta primero: npm run bundui:setup');
    process.exit(1);
  }
  
  log(colors.bold + colors.green, '\n✅ Demo Bundui UI lista para ejecutar');
  log(colors.green, '✅ Login page implementada');
  log(colors.green, '✅ Dashboard general implementado');
  log(colors.green, '✅ Página de demo principal creada');
  log(colors.green, '✅ Componentes Bundui integrados');
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  log(colors.blue, `⏱️ Tiempo de verificación: ${duration}ms`);
  
  // Iniciar servidor
  log(colors.bold + colors.blue, '\n🚀 Iniciando servidor de desarrollo...');
  startDevServer();
};

// Ejecutar demo
runBunduiDemo(); 