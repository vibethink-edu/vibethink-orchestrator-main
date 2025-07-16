#!/usr/bin/env node

/**
 * 🛡️ UI Component Validator - AI Pair Orchestrator Pro
 * 
 * Script de validación automática de componentes que garantiza
 * cumplimiento con estándares de gobernanza UI
 * 
 * @author AI Pair Platform - UI Team
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class UIComponentValidator {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
    
    this.standards = {
      typescript: {
        strict: true,
        noAny: true,
        exports: true
      },
      accessibility: {
        ariaLabels: true,
        keyboardNav: true,
        colorContrast: true
      },
      performance: {
        bundleSize: 50, // KB
        renderTime: 1, // ms
        memoryUsage: 1 // MB
      },
      testing: {
        coverage: 90,
        unitTests: true,
        integrationTests: true,
        accessibilityTests: true
      },
      documentation: {
        jsdoc: true,
        examples: true,
        props: true,
        changelog: true
      }
    };
  }

  /**
   * Validar estructura del componente
   */
  validateComponentStructure(componentPath) {
    console.log(`🔍 Validando estructura: ${componentPath}`);
    
    const checks = [
      this.checkFileExists(componentPath),
      this.checkTypeScript(componentPath),
      this.checkExports(componentPath),
      this.checkProps(componentPath),
      this.checkAccessibility(componentPath),
      this.checkDocumentation(componentPath),
      this.checkTests(componentPath)
    ];
    
    return this.runChecks(checks);
  }

  /**
   * Verificar que el archivo existe
   */
  checkFileExists(filePath) {
    try {
      const exists = fs.existsSync(filePath);
      return {
        name: 'File Exists',
        passed: exists,
        message: exists ? 'Archivo encontrado' : 'Archivo no encontrado'
      };
    } catch (error) {
      return {
        name: 'File Exists',
        passed: false,
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Validar TypeScript
   */
  checkTypeScript(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const checks = [
        {
          name: 'TypeScript Strict',
          passed: content.includes('interface') || content.includes('type'),
          message: 'Debe usar interfaces o types'
        },
        {
          name: 'No Any Types',
          passed: !content.includes(': any'),
          message: 'No debe usar tipos "any"'
        },
        {
          name: 'React Import',
          passed: content.includes('import React') || content.includes('import * as React'),
          message: 'Debe importar React'
        }
      ];
      
      return checks;
    } catch (error) {
      return [{
        name: 'TypeScript Check',
        passed: false,
        message: `Error: ${error.message}`
      }];
    }
  }

  /**
   * Verificar exports
   */
  checkExports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasDefaultExport = content.includes('export default');
      const hasNamedExports = content.includes('export {') || content.includes('export const');
      
      return {
        name: 'Exports',
        passed: hasDefaultExport || hasNamedExports,
        message: hasDefaultExport || hasNamedExports 
          ? 'Exports encontrados' 
          : 'Debe tener exports'
      };
    } catch (error) {
      return {
        name: 'Exports',
        passed: false,
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Verificar props
   */
  checkProps(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasProps = content.includes('Props') || content.includes('props');
      
      return {
        name: 'Props Definition',
        passed: hasProps,
        message: hasProps ? 'Props definidos' : 'Debe definir props'
      };
    } catch (error) {
      return {
        name: 'Props',
        passed: false,
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Verificar accesibilidad
   */
  checkAccessibility(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const checks = [
        {
          name: 'ARIA Labels',
          passed: content.includes('aria-label') || content.includes('aria-labelledby'),
          message: 'Debe incluir labels ARIA'
        },
        {
          name: 'Role Attribute',
          passed: content.includes('role='),
          message: 'Debe incluir atributo role'
        },
        {
          name: 'Keyboard Navigation',
          passed: content.includes('onKeyDown') || content.includes('tabIndex'),
          message: 'Debe soportar navegación por teclado'
        }
      ];
      
      return checks;
    } catch (error) {
      return [{
        name: 'Accessibility',
        passed: false,
        message: `Error: ${error.message}`
      }];
    }
  }

  /**
   * Verificar documentación
   */
  checkDocumentation(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const checks = [
        {
          name: 'JSDoc Comments',
          passed: content.includes('/**') && content.includes('*/'),
          message: 'Debe incluir comentarios JSDoc'
        },
        {
          name: 'Component Description',
          passed: content.includes('@description') || content.includes('@component'),
          message: 'Debe incluir descripción del componente'
        },
        {
          name: 'Props Documentation',
          passed: content.includes('@props') || content.includes('Props:'),
          message: 'Debe documentar props'
        }
      ];
      
      return checks;
    } catch (error) {
      return [{
        name: 'Documentation',
        passed: false,
        message: `Error: ${error.message}`
      }];
    }
  }

  /**
   * Verificar tests
   */
  checkTests(filePath) {
    try {
      const componentName = path.basename(filePath, path.extname(filePath));
      const testPath = filePath.replace('.tsx', '.test.tsx').replace('.ts', '.test.ts');
      const testExists = fs.existsSync(testPath);
      
      return {
        name: 'Test File',
        passed: testExists,
        message: testExists ? 'Archivo de test encontrado' : 'Debe tener archivo de test'
      };
    } catch (error) {
      return {
        name: 'Tests',
        passed: false,
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Ejecutar todas las validaciones
   */
  runChecks(checks) {
    const results = [];
    
    checks.forEach(check => {
      if (Array.isArray(check)) {
        results.push(...check);
      } else {
        results.push(check);
      }
    });
    
    return results;
  }

  /**
   * Generar reporte
   */
  generateReport(componentPath, results) {
    const passed = results.filter(r => r.passed);
    const failed = results.filter(r => !r.passed);
    const total = results.length;
    
    console.log('\n📊 REPORTE DE VALIDACIÓN');
    console.log('='.repeat(50));
    console.log(`Componente: ${componentPath}`);
    console.log(`Total de checks: ${total}`);
    console.log(`✅ Pasados: ${passed.length}`);
    console.log(`❌ Fallidos: ${failed.length}`);
    console.log(`📈 Score: ${Math.round((passed.length / total) * 100)}%`);
    
    if (failed.length > 0) {
      console.log('\n❌ CHECKS FALLIDOS:');
      failed.forEach(check => {
        console.log(`  - ${check.name}: ${check.message}`);
      });
    }
    
    if (passed.length > 0) {
      console.log('\n✅ CHECKS EXITOSOS:');
      passed.forEach(check => {
        console.log(`  - ${check.name}: ${check.message}`);
      });
    }
    
    return {
      component: componentPath,
      total,
      passed: passed.length,
      failed: failed.length,
      score: Math.round((passed.length / total) * 100),
      details: results
    };
  }

  /**
   * Validar compatibilidad con Shadcn
   */
  validateShadcnCompatibility(componentPath) {
    console.log(`🎨 Validando compatibilidad Shadcn: ${componentPath}`);
    
    try {
      const content = fs.readFileSync(componentPath, 'utf8');
      const checks = [
        {
          name: 'Radix UI Usage',
          passed: content.includes('@radix-ui/react'),
          message: 'Debe usar primitivos de Radix UI'
        },
        {
          name: 'Tailwind Classes',
          passed: content.includes('className='),
          message: 'Debe usar clases de Tailwind'
        },
        {
          name: 'CSS Variables',
          passed: content.includes('hsl(var(--'),
          message: 'Debe usar variables CSS de Shadcn'
        },
        {
          name: 'Class Variance Authority',
          passed: content.includes('class-variance-authority') || content.includes('cva'),
          message: 'Debe usar class-variance-authority'
        }
      ];
      
      return this.generateReport(componentPath, checks);
    } catch (error) {
      return {
        component: componentPath,
        error: error.message
      };
    }
  }

  /**
   * Validar performance
   */
  validatePerformance(componentPath) {
    console.log(`⚡ Validando performance: ${componentPath}`);
    
    try {
      const content = fs.readFileSync(componentPath, 'utf8');
      const fileSize = Buffer.byteLength(content, 'utf8') / 1024; // KB
      
      const checks = [
        {
          name: 'Bundle Size',
          passed: fileSize < this.standards.performance.bundleSize,
          message: `Bundle size: ${fileSize.toFixed(2)}KB (máx: ${this.standards.performance.bundleSize}KB)`
        },
        {
          name: 'No Heavy Dependencies',
          passed: !content.includes('lodash') && !content.includes('moment'),
          message: 'No debe usar dependencias pesadas'
        },
        {
          name: 'Optimized Imports',
          passed: !content.includes('import * from'),
          message: 'Debe usar imports específicos'
        }
      ];
      
      return this.generateReport(componentPath, checks);
    } catch (error) {
      return {
        component: componentPath,
        error: error.message
      };
    }
  }
}

// Ejecutar validación
const validator = new UIComponentValidator();

// Obtener componente desde argumentos
const componentPath = process.argv[2];

if (!componentPath) {
  console.error('❌ Error: Debe especificar la ruta del componente');
  console.log('Uso: node validate-component.js <ruta-del-componente>');
  process.exit(1);
}

// Ejecutar validaciones
console.log('🚀 Iniciando validación de componente...\n');

const structureResults = validator.validateComponentStructure(componentPath);
const shadcnResults = validator.validateShadcnCompatibility(componentPath);
const performanceResults = validator.validatePerformance(componentPath);

// Generar reportes
const structureReport = validator.generateReport(componentPath, structureResults);
const shadcnReport = validator.generateReport(componentPath, shadcnResults.details || []);
const performanceReport = validator.generateReport(componentPath, performanceResults.details || []);

// Reporte final
console.log('\n🏆 REPORTE FINAL');
console.log('='.repeat(50));
console.log(`Estructura: ${structureReport.score}%`);
console.log(`Shadcn: ${shadcnReport.score}%`);
console.log(`Performance: ${performanceReport.score}%`);

const overallScore = Math.round((structureReport.score + shadcnReport.score + performanceReport.score) / 3);
console.log(`\n🎯 SCORE GENERAL: ${overallScore}%`);

if (overallScore >= 90) {
  console.log('✅ COMPONENTE APROBADO');
  process.exit(0);
} else {
  console.log('❌ COMPONENTE RECHAZADO - Requiere mejoras');
  process.exit(1);
} 