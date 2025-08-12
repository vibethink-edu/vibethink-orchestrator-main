#!/usr/bin/env node

/**
 * Analyze Remaining Violations - Diagnostic Tool
 * Categoriza las 224 violaciones restantes para estrategia final
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  title: (msg) => console.log(`${colors.cyan}${colors.bold}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}📋 ${msg}${colors.reset}`)
};

class ViolationAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.violations = {
      methodology: [],      // VThink 1.0 - NO TOCAR
      software: [],         // Plataforma/software - CORREGIR
      types: [],           // Tipos/interfaces - CORREGIR
      comments: [],        // Comentarios sobre software - CORREGIR
      ui: [],              // Strings de UI - CORREGIR
      ambiguous: []        // Casos ambiguos - REVISAR MANUAL
    };
  }

  async analyze() {
    log.title('\n🔬 VIOLATION ANALYZER - Análisis Detallado');
    log.title('='.repeat(50));
    log.info('Categorizando las 224 violaciones restantes...\n');

    try {
      await this.categorizeViolations();
      this.printAnalysis();
      this.generateStrategy();
      
    } catch (error) {
      log.error(`Error durante análisis: ${error.message}`);
      process.exit(1);
    }
  }

  async categorizeViolations() {
    const codeFiles = this.getCodeFiles();
    
    for (const file of codeFiles) {
      if (this.isMethodologyFile(file)) continue;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          const matches = line.match(/VThink/g);
          if (!matches) return;
          
          const lineNum = index + 1;
          const relativePath = path.relative(this.projectRoot, file);
          
          matches.forEach(() => {
            const violation = {
              file: relativePath,
              line: lineNum,
              content: line.trim(),
              type: this.categorizeViolation(line)
            };
            
            this.violations[violation.type].push(violation);
          });
        });
        
      } catch (error) {
        // Ignorar archivos que no se pueden leer
      }
    }
  }

  categorizeViolation(line) {
    const lineNormalized = line.toLowerCase().trim();
    
    // 1. Metodología - NO TOCAR
    if (lineNormalized.includes('vthink 1.0') || 
        lineNormalized.includes('vthink methodology') ||
        lineNormalized.includes('vthink framework') ||
        lineNormalized.includes('vthink_methodology')) {
      return 'methodology';
    }
    
    // 2. Tipos/Interfaces - CORREGIR
    if (lineNormalized.includes('interface') || 
        lineNormalized.includes('type ') ||
        lineNormalized.includes('extends') ||
        /VThink[A-Z][a-zA-Z]*/.test(line)) {
      return 'types';
    }
    
    // 3. Comentarios sobre software - CORREGIR
    if ((lineNormalized.includes('*') || lineNormalized.includes('//')) &&
        !lineNormalized.includes('1.0') &&
        !lineNormalized.includes('methodology')) {
      return 'comments';
    }
    
    // 4. UI/String - CORREGIR  
    if (lineNormalized.includes('"') || lineNormalized.includes("'") ||
        lineNormalized.includes('title') || lineNormalized.includes('label')) {
      return 'ui';
    }
    
    // 5. Referencias a software/plataforma - CORREGIR
    if (lineNormalized.includes('platform') || 
        lineNormalized.includes('system') ||
        lineNormalized.includes('dashboard') ||
        lineNormalized.includes('app')) {
      return 'software';
    }
    
    // 6. Casos ambiguos - REVISAR
    return 'ambiguous';
  }

  getCodeFiles() {
    const files = [];
    const searchDirs = ['apps/', 'src/', 'dev-tools/'];
    
    for (const dir of searchDirs) {
      const fullPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(fullPath)) {
        this.traverseDirectory(fullPath, files);
      }
    }
    
    return files;
  }

  traverseDirectory(dir, files) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          this.traverseDirectory(fullPath, files);
        } else if (stat.isFile()) {
          const ext = path.extname(fullPath);
          if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Ignorar directorios sin permisos
    }
  }

  isMethodologyFile(file) {
    const methodologyPaths = [
      'VTHINK_METHODOLOGY_LAW.md',
      'AI_UNIVERSAL_STANDARDS.md',
      'CLAUDE.md', 
      'VThink-1.0/',
      'methodology/'
    ];
    
    return methodologyPaths.some(pattern => file.includes(pattern));
  }

  printAnalysis() {
    log.title('\n📊 ANÁLISIS DE VIOLACIONES RESTANTES');
    log.title('='.repeat(40));
    
    const total = Object.values(this.violations).reduce((sum, arr) => sum + arr.length, 0);
    log.info(`Total violaciones analizadas: ${total}\n`);
    
    // Mostrar categorías
    Object.entries(this.violations).forEach(([category, items]) => {
      if (items.length === 0) return;
      
      const categoryNames = {
        methodology: '🚫 METODOLOGÍA (NO TOCAR)',
        software: '🔧 SOFTWARE/PLATAFORMA',
        types: '📝 TIPOS/INTERFACES', 
        comments: '💭 COMENTARIOS',
        ui: '🎨 UI/STRINGS',
        ambiguous: '❓ CASOS AMBIGUOS'
      };
      
      const color = category === 'methodology' ? colors.red : 
                   category === 'ambiguous' ? colors.yellow : colors.green;
      
      console.log(`${color}${categoryNames[category]}: ${items.length} violaciones${colors.reset}`);
      
      // Mostrar algunos ejemplos
      items.slice(0, 3).forEach(violation => {
        console.log(`  ${colors.blue}${violation.file}:${violation.line}${colors.reset} ${violation.content.substring(0, 60)}...`);
      });
      
      if (items.length > 3) {
        console.log(`  ... y ${items.length - 3} más\n`);
      } else {
        console.log('');
      }
    });
  }

  generateStrategy() {
    log.title('\n🎯 ESTRATEGIA DE CORRECCIÓN FINAL');
    log.title('='.repeat(35));
    
    const correctableCount = this.violations.software.length + 
                           this.violations.types.length +
                           this.violations.comments.length + 
                           this.violations.ui.length;
    
    const methodologyCount = this.violations.methodology.length;
    const ambiguousCount = this.violations.ambiguous.length;
    
    log.success(`✅ Corregibles automáticamente: ${correctableCount}`);
    log.error(`🚫 Metodología (preservar): ${methodologyCount}`);
    log.warning(`❓ Requieren revisión manual: ${ambiguousCount}`);
    
    const potentialReduction = Math.round((correctableCount / 224) * 100);
    log.info(`\n🎯 Reducción potencial: ${potentialReduction}% de las 224 violaciones restantes`);
    
    if (correctableCount > 0) {
      log.info('\n💡 PRÓXIMOS PASOS RECOMENDADOS:');
      log.info('1. Crear script para tipos/interfaces (más seguros)');
      log.info('2. Corregir comentarios de software');
      log.info('3. Procesar strings de UI');
      log.info('4. Revisar casos ambiguos manualmente');
    }
    
    if (methodologyCount > 0) {
      log.warning(`\n⚠️ CRÍTICO: ${methodologyCount} referencias a metodología VThink 1.0 detectadas`);
      log.warning('   Estas NO deben modificarse bajo ninguna circunstancia');
    }
  }
}

// Ejecutar
if (require.main === module) {
  const analyzer = new ViolationAnalyzer();
  analyzer.analyze().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ViolationAnalyzer;