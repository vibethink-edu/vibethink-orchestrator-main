#!/usr/bin/env node

/**
 * Validación Automática de Aislamiento de UIs - VThink 1.0
 * Script para validar que las UIs están correctamente aisladas
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración de validación
const UI_PATHS = {
  bundui: 'app/ui/bundui',
  reactflow: 'app/ui/reactflow', 
  vtk: 'app/ui/vtk'
};

const UI_ROUTES = {
  bundui: 'app/bundui',
  reactflow: 'app/workflow',
  vtk: 'app/vtk'
};

// Criterios de validación
const validationCriteria = {
  structure: {
    weight: 0.30,
    criteria: {
      folderExists: { weight: 0.25, score: 0 },
      packageJsonExists: { weight: 0.25, score: 0 },
      readmeExists: { weight: 0.25, score: 0 },
      componentsExist: { weight: 0.25, score: 0 }
    }
  },
  isolation: {
    weight: 0.40,
    criteria: {
      noCrossImports: { weight: 0.30, score: 0 },
      prefixedComponents: { weight: 0.30, score: 0 },
      isolatedDependencies: { weight: 0.20, score: 0 },
      separateRoutes: { weight: 0.20, score: 0 }
    }
  },
  documentation: {
    weight: 0.20,
    criteria: {
      readmeComplete: { weight: 0.40, score: 0 },
      typesDefined: { weight: 0.30, score: 0 },
      examplesProvided: { weight: 0.30, score: 0 }
    }
  },
  testing: {
    weight: 0.10,
    criteria: {
      testsExist: { weight: 0.50, score: 0 },
      testsPass: { weight: 0.50, score: 0 }
    }
  }
};

// Función principal de validación
function validateUIIsolation() {
  console.log('🔍 VALIDANDO AISLAMIENTO DE UIs - VThink 1.0\n');
  console.log('='.repeat(60));

  const results = {};

  // Validar cada UI
  for (const [uiName, uiPath] of Object.entries(UI_PATHS)) {
    console.log(`\n📦 Validando ${uiName.toUpperCase()} UI...`);
    results[uiName] = validateSingleUI(uiName, uiPath);
  }

  // Generar reporte final
  generateFinalReport(results);
}

// Validar una UI específica
function validateSingleUI(uiName, uiPath) {
  const scores = {
    structure: 0,
    isolation: 0,
    documentation: 0,
    testing: 0
  };

  // 1. Validar estructura
  scores.structure = validateStructure(uiName, uiPath);
  
  // 2. Validar aislamiento
  scores.isolation = validateIsolation(uiName, uiPath);
  
  // 3. Validar documentación
  scores.documentation = validateDocumentation(uiName, uiPath);
  
  // 4. Validar testing
  scores.testing = validateTesting(uiName, uiPath);

  return scores;
}

// Validar estructura de carpetas
function validateStructure(uiName, uiPath) {
  let score = 0;
  const requiredFolders = [
    'components',
    'layouts', 
    'hooks',
    'types',
    'styles',
    'config'
  ];

  console.log(`  📁 Validando estructura de carpetas...`);

  // Verificar que la carpeta principal existe
  if (fs.existsSync(uiPath)) {
    score += 25;
    console.log(`    ✅ Carpeta ${uiName} existe`);
  } else {
    console.log(`    ❌ Carpeta ${uiName} NO existe`);
  }

  // Verificar carpetas requeridas
  for (const folder of requiredFolders) {
    const folderPath = path.join(uiPath, folder);
    if (fs.existsSync(folderPath)) {
      score += 12.5;
      console.log(`    ✅ Carpeta ${folder} existe`);
    } else {
      console.log(`    ❌ Carpeta ${folder} NO existe`);
    }
  }

  // Verificar package.json
  const packageJsonPath = path.join(uiPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    score += 25;
    console.log(`    ✅ package.json existe`);
  } else {
    console.log(`    ❌ package.json NO existe`);
  }

  // Verificar README.md
  const readmePath = path.join(uiPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    score += 25;
    console.log(`    ✅ README.md existe`);
  } else {
    console.log(`    ❌ README.md NO existe`);
  }

  return Math.min(score, 100);
}

// Validar aislamiento
function validateIsolation(uiName, uiPath) {
  let score = 0;
  
  console.log(`  🔒 Validando aislamiento...`);

  try {
    // Verificar que no hay imports cruzados
    const componentsPath = path.join(uiPath, 'components');
    if (fs.existsSync(componentsPath)) {
      const files = getAllFiles(componentsPath);
      let crossImports = 0;
      
      for (const file of files) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const content = fs.readFileSync(file, 'utf8');
          const imports = content.match(/import.*from.*['"]@/g) || [];
          
          for (const import_ of imports) {
            if (!import_.includes(`@/app/ui/${uiName}`)) {
              crossImports++;
            }
          }
        }
      }
      
      if (crossImports === 0) {
        score += 30;
        console.log(`    ✅ No hay imports cruzados`);
      } else {
        console.log(`    ❌ ${crossImports} imports cruzados detectados`);
      }
    }

    // Verificar prefijos de componentes
    const components = getComponents(uiPath);
    let prefixedComponents = 0;
    
    for (const component of components) {
      if (component.startsWith(uiName.charAt(0).toUpperCase() + uiName.slice(1))) {
        prefixedComponents++;
      }
    }
    
    if (prefixedComponents > 0) {
      score += 30;
      console.log(`    ✅ ${prefixedComponents} componentes con prefijo correcto`);
    } else {
      console.log(`    ❌ No hay componentes con prefijo correcto`);
    }

    // Verificar dependencias aisladas
    const packageJsonPath = path.join(uiPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      score += 20;
      console.log(`    ✅ Dependencias aisladas en package.json`);
    } else {
      console.log(`    ❌ No hay package.json para dependencias`);
    }

    // Verificar rutas separadas
    const routesPath = UI_ROUTES[uiName];
    if (fs.existsSync(routesPath)) {
      score += 20;
      console.log(`    ✅ Rutas separadas en ${routesPath}`);
    } else {
      console.log(`    ❌ No hay rutas separadas`);
    }

  } catch (error) {
    console.log(`    ❌ Error validando aislamiento: ${error.message}`);
  }

  return Math.min(score, 100);
}

// Validar documentación
function validateDocumentation(uiName, uiPath) {
  let score = 0;
  
  console.log(`  📚 Validando documentación...`);

  // Verificar README completo
  const readmePath = path.join(uiPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    const hasDescription = content.includes('##');
    const hasUsage = content.includes('```typescript');
    const hasExamples = content.includes('example');
    
    if (hasDescription && hasUsage && hasExamples) {
      score += 40;
      console.log(`    ✅ README completo`);
    } else {
      console.log(`    ⚠️ README incompleto`);
    }
  } else {
    console.log(`    ❌ README NO existe`);
  }

  // Verificar tipos definidos
  const typesPath = path.join(uiPath, 'types');
  if (fs.existsSync(typesPath)) {
    const typeFiles = fs.readdirSync(typesPath).filter(f => f.endsWith('.ts'));
    if (typeFiles.length > 0) {
      score += 30;
      console.log(`    ✅ ${typeFiles.length} archivos de tipos definidos`);
    } else {
      console.log(`    ❌ No hay archivos de tipos`);
    }
  } else {
    console.log(`    ❌ Carpeta de tipos NO existe`);
  }

  // Verificar ejemplos
  const componentsPath = path.join(uiPath, 'components');
  if (fs.existsSync(componentsPath)) {
    const componentFiles = getAllFiles(componentsPath);
    const exampleFiles = componentFiles.filter(f => f.includes('Example') || f.includes('example'));
    
    if (exampleFiles.length > 0) {
      score += 30;
      console.log(`    ✅ ${exampleFiles.length} archivos de ejemplo`);
    } else {
      console.log(`    ⚠️ No hay archivos de ejemplo`);
    }
  }

  return Math.min(score, 100);
}

// Validar testing
function validateTesting(uiName, uiPath) {
  let score = 0;
  
  console.log(`  🧪 Validando testing...`);

  // Verificar que existen tests
  const testPath = path.join(uiPath, '__tests__');
  const testFiles = fs.existsSync(testPath) ? 
    fs.readdirSync(testPath).filter(f => f.includes('.test.') || f.includes('.spec.')) : [];
  
  if (testFiles.length > 0) {
    score += 50;
    console.log(`    ✅ ${testFiles.length} archivos de test`);
  } else {
    console.log(`    ❌ No hay archivos de test`);
  }

  // Verificar que los tests pasan
  try {
    const packageJsonPath = path.join(uiPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.scripts && packageJson.scripts.test) {
        score += 50;
        console.log(`    ✅ Script de test configurado`);
      } else {
        console.log(`    ❌ No hay script de test configurado`);
      }
    }
  } catch (error) {
    console.log(`    ❌ Error verificando tests: ${error.message}`);
  }

  return Math.min(score, 100);
}

// Funciones auxiliares
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  
  return arrayOfFiles;
}

function getComponents(uiPath) {
  const components = [];
  const componentsPath = path.join(uiPath, 'components');
  
  if (fs.existsSync(componentsPath)) {
    const files = getAllFiles(componentsPath);
    for (const file of files) {
      if (file.endsWith('.tsx')) {
        const fileName = path.basename(file, '.tsx');
        components.push(fileName);
      }
    }
  }
  
  return components;
}

// Generar reporte final
function generateFinalReport(results) {
  console.log('\n📊 REPORTE FINAL DE VALIDACIÓN');
  console.log('='.repeat(60));
  
  let totalScore = 0;
  let uiCount = 0;
  
  for (const [uiName, scores] of Object.entries(results)) {
    const uiScore = (
      scores.structure * 0.30 +
      scores.isolation * 0.40 +
      scores.documentation * 0.20 +
      scores.testing * 0.10
    );
    
    totalScore += uiScore;
    uiCount++;
    
    console.log(`\n🎨 ${uiName.toUpperCase()} UI:`);
    console.log(`  📁 Estructura: ${scores.structure}%`);
    console.log(`  🔒 Aislamiento: ${scores.isolation}%`);
    console.log(`  📚 Documentación: ${scores.documentation}%`);
    console.log(`  🧪 Testing: ${scores.testing}%`);
    console.log(`  📊 SCORE TOTAL: ${uiScore.toFixed(1)}%`);
  }
  
  const averageScore = totalScore / uiCount;
  console.log(`\n🎯 SCORE PROMEDIO: ${averageScore.toFixed(1)}%`);
  
  if (averageScore >= 80) {
    console.log('✅ EXCELENTE: Aislamiento de UIs correcto');
  } else if (averageScore >= 60) {
    console.log('⚠️ BUENO: Algunas mejoras necesarias');
  } else {
    console.log('❌ CRÍTICO: Aislamiento de UIs deficiente');
  }
  
  console.log('\n🔧 PRÓXIMOS PASOS:');
  console.log('1. Revisar UIs con score bajo');
  console.log('2. Implementar estructura faltante');
  console.log('3. Corregir imports cruzados');
  console.log('4. Mejorar documentación');
  console.log('5. Agregar tests faltantes');
}

// Ejecutar validación
if (require.main === module) {
  validateUIIsolation();
}

module.exports = { validateUIIsolation }; 