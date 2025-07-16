#!/usr/bin/env node

/**
 * DocumentVTK Simple Dry Run
 * Prueba básica de la separación de DocumentVTK
 */

console.log('🚀 DocumentVTK Dry Run - Test de Separación');
console.log('='.repeat(50));

// Test 1: Verificar archivos
console.log('\n📋 Test 1: Verificación de Archivos');

import fs from 'fs';
import path from 'path';

const files = [
  'docs/VTK_METHODOLOGY/04_TOOLS/DocumentVTK-core.js',
  'docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK-VibeThink-config.js', 
  'src/scripts/DocumentVTK.js'
];

let allFilesExist = true;

for (const file of files) {
  try {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - NO EXISTE`);
      allFilesExist = false;
    }
  } catch (error) {
    console.log(`❌ ${file} - ERROR: ${error.message}`);
    allFilesExist = false;
  }
}

// Test 2: Verificar sintaxis
console.log('\n🔍 Test 2: Verificación de Sintaxis');

import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function checkSyntax() {
  for (const file of files) {
    if (fs.existsSync(file)) {
      try {
        await execAsync(`node --check "${file}"`);
        console.log(`✅ ${file} - sintaxis válida`);
      } catch (error) {
        console.log(`❌ ${file} - error de sintaxis: ${error.message}`);
        allFilesExist = false;
      }
    }
  }
}

// Test 3: Verificar imports
console.log('\n🔗 Test 3: Verificación de Imports');

function checkImports() {
  try {
    // Verificar wrapper
    const wrapperContent = fs.readFileSync('src/scripts/DocumentVTK.js', 'utf8');
    if (wrapperContent.includes('DocumentVTK-VibeThink-config.js')) {
      console.log('✅ Wrapper importa correctamente VibeThink config');
    } else {
      console.log('❌ Wrapper no tiene import correcto');
      allFilesExist = false;
    }
    
    // Verificar VibeThink config
    const VibeThinkContent = fs.readFileSync('docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK-VibeThink-config.js', 'utf8');
    if (VibeThinkContent.includes('DocumentVTK-core.js')) {
      console.log('✅ VibeThink config importa correctamente Core');
    } else {
      console.log('❌ VibeThink config no tiene import correcto');
      allFilesExist = false;
    }
    
  } catch (error) {
    console.log(`❌ Error verificando imports: ${error.message}`);
    allFilesExist = false;
  }
}

// Ejecutar tests
async function runTests() {
  await checkSyntax();
  checkImports();
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎯 RESULTADO FINAL: ${allFilesExist ? '✅ PASS' : '❌ FAIL'}`);
  
  if (allFilesExist) {
    console.log('🚀 La separación de DocumentVTK está LISTA para producción');
    console.log('💡 Recomendaciones:');
    console.log('   - Ejecutar pruebas de integración');
    console.log('   - Actualizar referencias en documentación');
    console.log('   - Validar en entorno de desarrollo');
  } else {
    console.log('⚠️ Hay problemas que deben resolverse antes de continuar');
  }
  
  return allFilesExist;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Error ejecutando dry run:', error);
  process.exit(1);
});
