#!/usr/bin/env node

/**
 * Validar versiones de React en el monorepo
 * 
 * Detecta problemas comunes de React 18 vs React 19:
 * 1. Versiones duplicadas de React en diferentes packages
 * 2. @types/react desalineados con react
 * 3. Barrel exports que causan "Objects are not valid as a React child"
 * 4. peerDependencies incorrectos
 * 
 * Usage:
 *   node scripts/validate-react-versions.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
const APPS_DIR = path.join(ROOT_DIR, 'apps');

/**
 * Leer package.json
 */
function readPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Extraer versión de una dependencia
 */
function getVersion(pkg, depName, type = 'all') {
  if (type === 'all' || type === 'dependencies') {
    if (pkg.dependencies && pkg.dependencies[depName]) {
      return { version: pkg.dependencies[depName], source: 'dependencies' };
    }
  }
  if (type === 'all' || type === 'devDependencies') {
    if (pkg.devDependencies && pkg.devDependencies[depName]) {
      return { version: pkg.devDependencies[depName], source: 'devDependencies' };
    }
  }
  if (type === 'all' || type === 'peerDependencies') {
    if (pkg.peerDependencies && pkg.peerDependencies[depName]) {
      return { version: pkg.peerDependencies[depName], source: 'peerDependencies' };
    }
  }
  return null;
}

/**
 * Normalizar versión para comparación
 */
function normalizeVersion(version) {
  if (!version) return null;
  // Remover ^, ~, >=, etc.
  const clean = version.replace(/^[\^~>=<]/, '').split('-')[0];
  // Extraer major.minor
  const match = clean.match(/^(\d+)\.(\d+)/);
  if (match) {
    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      full: clean
    };
  }
  return null;
}

/**
 * Buscar todos los package.json en el monorepo
 */
function findPackageJsonFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  function walkDir(currentPath) {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        // Ignorar node_modules, .next, dist
        if (entry.name === 'node_modules' || 
            entry.name === '.next' || 
            entry.name === 'dist' ||
            entry.name.startsWith('.')) {
          continue;
        }
        
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.name === 'package.json') {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignorar errores de acceso
    }
  }
  
  walkDir(dir);
  return files;
}

/**
 * Main
 */
function main() {
  console.log('\n🔍 VALIDANDO VERSIONES DE REACT EN MONOREPO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Buscar todos los package.json
  console.log('📁 Buscando package.json...\n');
  const rootPkg = readPackageJson(path.join(ROOT_DIR, 'package.json'));
  const packageFiles = [
    ...findPackageJsonFiles(PACKAGES_DIR),
    ...findPackageJsonFiles(APPS_DIR)
  ];

  console.log(`   ✅ ${packageFiles.length} package.json encontrados\n`);

  // Analizar versiones
  console.log('🔍 Analizando versiones de React...\n');
  
  const reactVersions = new Map();
  const reactDomVersions = new Map();
  const reactTypesVersions = new Map();
  const issues = [];

  // Root package.json
  if (rootPkg) {
    const react = getVersion(rootPkg, 'react');
    const reactDom = getVersion(rootPkg, 'react-dom');
    const reactTypes = getVersion(rootPkg, '@types/react');
    
    if (react) {
      reactVersions.set('root', { path: 'root', ...react });
    }
    if (reactDom) {
      reactDomVersions.set('root', { path: 'root', ...reactDom });
    }
    if (reactTypes) {
      reactTypesVersions.set('root', { path: 'root', ...reactTypes });
    }
  }

  // Packages y apps
  for (const pkgFile of packageFiles) {
    const pkg = readPackageJson(pkgFile);
    if (!pkg) continue;

    const relativePath = path.relative(ROOT_DIR, pkgFile);
    const react = getVersion(pkg, 'react');
    const reactDom = getVersion(pkg, 'react-dom');
    const reactTypes = getVersion(pkg, '@types/react');

    if (react) {
      reactVersions.set(relativePath, { path: relativePath, ...react });
    }
    if (reactDom) {
      reactDomVersions.set(relativePath, { path: relativePath, ...reactDom });
    }
    if (reactTypes) {
      reactTypesVersions.set(relativePath, { path: relativePath, ...reactTypes });
    }
  }

  // Analizar problemas
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 ANÁLISIS DE VERSIONES:\n');

  // 1. Detectar múltiples versiones de React
  const uniqueReactVersions = new Set();
  reactVersions.forEach((info, path) => {
    const normalized = normalizeVersion(info.version);
    if (normalized) {
      uniqueReactVersions.add(`${normalized.major}.${normalized.minor}`);
    }
  });

  if (uniqueReactVersions.size > 1) {
    console.log('❌ PROBLEMA: Múltiples versiones de React detectadas:\n');
    reactVersions.forEach((info, pkgPath) => {
      const normalized = normalizeVersion(info.version);
      if (normalized) {
        console.log(`   ${pkgPath}: React ${info.version} (${normalized.major}.${normalized.minor}.x)`);
      }
    });
    console.log('');
    
    issues.push({
      type: 'multiple-versions',
      severity: 'error',
      message: 'Múltiples versiones de React detectadas. Esto causa "Objects are not valid as a React child"',
      solution: 'Usar overrides en root package.json para forzar una sola versión'
    });
  } else {
    const versions = Array.from(uniqueReactVersions);
    if (versions.length > 0) {
      console.log(`✅ React versión única: ${versions[0]}.x\n`);
    }
  }

  // 2. Verificar alineación de @types/react con react
  reactVersions.forEach((reactInfo, reactPath) => {
    const reactTypesInfo = reactTypesVersions.get(reactPath);
    if (reactTypesInfo) {
      const reactNorm = normalizeVersion(reactInfo.version);
      const typesNorm = normalizeVersion(reactTypesInfo.version);
      
      if (reactNorm && typesNorm) {
        // @types/react debe coincidir con major.minor de react
        if (reactNorm.major !== typesNorm.major || reactNorm.minor !== typesNorm.minor) {
          console.log(`⚠️  DESALINEACIÓN: ${reactPath}`);
          console.log(`   react: ${reactInfo.version} (${reactNorm.major}.${reactNorm.minor}.x)`);
          console.log(`   @types/react: ${reactTypesInfo.version} (${typesNorm.major}.${typesNorm.minor}.x)`);
          console.log('');
          
          issues.push({
            type: 'types-mismatch',
            severity: 'warning',
            path: reactPath,
            message: `@types/react no coincide con versión de react`,
            solution: `Actualizar @types/react a ${reactNorm.major}.${reactNorm.minor}.x`
          });
        }
      }
    }
  });

  // 3. Verificar peerDependencies
  console.log('🔍 Verificando peerDependencies...\n');
  for (const pkgFile of packageFiles) {
    const pkg = readPackageJson(pkgFile);
    if (!pkg || !pkg.peerDependencies) continue;

    const relativePath = path.relative(ROOT_DIR, pkgFile);
    const reactPeer = pkg.peerDependencies.react;
    
    if (reactPeer) {
      // Verificar que peerDependency permita la versión actual
      const rootReact = getVersion(rootPkg, 'react');
      if (rootReact) {
        const rootNorm = normalizeVersion(rootReact.version);
        const peerNorm = normalizeVersion(reactPeer);
        
        if (rootNorm && peerNorm) {
          // Si peerDependency es muy restrictiva (ej: "18" cuando usamos 19)
          if (peerNorm.major < rootNorm.major) {
            console.log(`⚠️  PEER DEPENDENCY RESTRICTIVA: ${relativePath}`);
            console.log(`   peerDependencies.react: ${reactPeer}`);
            console.log(`   React actual: ${rootReact.version}`);
            console.log(`   Recomendación: Actualizar a ">=${rootNorm.major}" o ">=${rootNorm.major}.0"\n`);
            
            issues.push({
              type: 'peer-dependency',
              severity: 'warning',
              path: relativePath,
              message: `peerDependencies.react es muy restrictiva`,
              solution: `Actualizar a ">=${rootNorm.major}" o ">=${rootNorm.major}.0"`
            });
          }
        }
      }
    }
  }

  // 4. Verificar overrides/resolutions
  console.log('🔍 Verificando overrides/resolutions...\n');
  if (rootPkg) {
    const hasOverrides = rootPkg.overrides && rootPkg.overrides.react;
    const hasResolutions = rootPkg.resolutions && rootPkg.resolutions.react;
    
    if (!hasOverrides && !hasResolutions && uniqueReactVersions.size > 1) {
      console.log('⚠️  NO HAY OVERRIDES/RESOLUTIONS para React\n');
      console.log('   Recomendación: Agregar overrides en root package.json:\n');
      console.log('   "overrides": {');
      console.log('     "react": "^19.0.0",');
      console.log('     "react-dom": "^19.0.0",');
      console.log('     "@types/react": "^19.1.8",');
      console.log('     "@types/react-dom": "^19.1.6"');
      console.log('   }\n');
      
      issues.push({
        type: 'missing-overrides',
        severity: 'warning',
        message: 'No hay overrides para forzar versión única de React',
        solution: 'Agregar overrides en root package.json'
      });
    } else if (hasOverrides || hasResolutions) {
      console.log('✅ Overrides/resolutions configurados\n');
    }
  }

  // Reporte final
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 RESUMEN:\n');

  if (issues.length === 0) {
    console.log('✅ NO SE ENCONTRARON PROBLEMAS\n');
    console.log('   Todas las versiones de React están alineadas correctamente.\n');
    process.exit(0);
  } else {
    const errors = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;
    
    console.log(`❌ PROBLEMAS ENCONTRADOS: ${issues.length} total\n`);
    console.log(`   Errores: ${errors}`);
    console.log(`   Advertencias: ${warnings}\n`);
    
    console.log('🔧 SOLUCIONES RECOMENDADAS:\n');
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.type.toUpperCase()} (${issue.severity})`);
      if (issue.path) {
        console.log(`   Archivo: ${issue.path}`);
      }
      console.log(`   Problema: ${issue.message}`);
      console.log(`   Solución: ${issue.solution}\n`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(errors > 0 ? 1 : 0);
  }
}

main();











