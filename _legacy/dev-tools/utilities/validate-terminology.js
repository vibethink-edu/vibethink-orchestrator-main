#!/usr/bin/env node

/**
 * Script de Validación de Terminología - VThink 1.0
 * 
 * Este script valida que la terminología sea correcta:
 * - VThink 1.0 = METODOLOGÍA
 * - VibeThink Orchestrator = PRODUCTO
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patrones de búsqueda problemáticos
const PROBLEMATIC_PATTERNS = [
  {
    pattern: /Equipo VThink/gi,
    message: '❌ ERROR: "Equipo VThink" - VThink 1.0 es metodología, no equipo'
  },
  {
    pattern: /Producto VThink/gi,
    message: '❌ ERROR: "Producto VThink" - VThink 1.0 es metodología, no producto'
  },
  {
    pattern: /VThink SaaS/gi,
    message: '❌ ERROR: "VThink SaaS" - VibeThink Orchestrator es el SaaS'
  },
  {
    pattern: /VThink como plataforma/gi,
    message: '❌ ERROR: "VThink como plataforma" - VibeThink Orchestrator es la plataforma'
  },
  {
    pattern: /VibeThink Orchestrator/gi,
    message: '❌ ERROR: "VibeThink Orchestrator" - Debe ser "VibeThink Orchestrator"'
  }
];

// Patrones correctos para validar
const CORRECT_PATTERNS = [
  {
    pattern: /metodología VThink 1\.0/gi,
    message: '✅ CORRECTO: "metodología VThink 1.0"'
  },
  {
    pattern: /VibeThink Orchestrator/gi,
    message: '✅ CORRECTO: "VibeThink Orchestrator"'
  },
  {
    pattern: /Equipo VibeThink/gi,
    message: '✅ CORRECTO: "Equipo VibeThink Orchestrator"'
  }
];

// Archivos a excluir
const EXCLUDE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  '.next/**',
  'dist/**',
  'build/**',
  '*.log',
  '*.lock',
  '*.zip',
  '*.tar.gz'
];

// Extensiones a incluir
const INCLUDE_EXTENSIONS = [
  '*.md',
  '*.js',
  '*.ts',
  '*.tsx',
  '*.json',
  '*.yml',
  '*.yaml',
  '*.txt'
];

/**
 * Valida un archivo específico
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const corrects = [];

  // Buscar patrones problemáticos
  PROBLEMATIC_PATTERNS.forEach(({ pattern, message }) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        file: filePath,
        message,
        matches: matches.length
      });
    }
  });

  // Buscar patrones correctos
  CORRECT_PATTERNS.forEach(({ pattern, message }) => {
    const matches = content.match(pattern);
    if (matches) {
      corrects.push({
        file: filePath,
        message,
        matches: matches.length
      });
    }
  });

  return { issues, corrects };
}

/**
 * Función principal de validación
 */
function validateTerminology() {
  console.log('🔍 Validando terminología VThink 1.0...\n');

  // Construir patrón de búsqueda
  const includePattern = INCLUDE_EXTENSIONS.map(ext => `**/${ext}`).join(',');
  const excludePattern = EXCLUDE_PATTERNS.join(',');
  
  const files = glob.sync(includePattern, {
    ignore: EXCLUDE_PATTERNS,
    cwd: process.cwd()
  });

  let totalIssues = 0;
  let totalCorrects = 0;
  const allIssues = [];
  const allCorrects = [];

  // Validar cada archivo
  files.forEach(file => {
    const { issues, corrects } = validateFile(file);
    
    if (issues.length > 0) {
      allIssues.push(...issues);
      totalIssues += issues.length;
    }
    
    if (corrects.length > 0) {
      allCorrects.push(...corrects);
      totalCorrects += corrects.length;
    }
  });

  // Mostrar resultados
  console.log(`📊 Resultados de Validación:`);
  console.log(`- Archivos analizados: ${files.length}`);
  console.log(`- Problemas encontrados: ${totalIssues}`);
  console.log(`- Usos correctos: ${totalCorrects}\n`);

  // Mostrar problemas
  if (allIssues.length > 0) {
    console.log('❌ PROBLEMAS ENCONTRADOS:');
    allIssues.forEach(issue => {
      console.log(`  ${issue.file}: ${issue.message} (${issue.matches} ocurrencias)`);
    });
    console.log('');
  }

  // Mostrar usos correctos
  if (allCorrects.length > 0) {
    console.log('✅ USOS CORRECTOS:');
    allCorrects.forEach(correct => {
      console.log(`  ${correct.file}: ${correct.message} (${correct.matches} ocurrencias)`);
    });
    console.log('');
  }

  // Resumen final
  if (totalIssues === 0) {
    console.log('🎉 ¡Excelente! No se encontraron problemas de terminología.');
    process.exit(0);
  } else {
    console.log(`⚠️  Se encontraron ${totalIssues} problemas de terminología.`);
    console.log('📚 Revisa la guía de terminología en docs/methodologies/VThink-1.0/TERMINOLOGY_GUIDE.md');
    process.exit(1);
  }
}

// Ejecutar validación
if (require.main === module) {
  validateTerminology();
}

module.exports = { validateTerminology }; 