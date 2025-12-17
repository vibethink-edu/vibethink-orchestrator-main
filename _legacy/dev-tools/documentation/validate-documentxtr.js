#!/usr/bin/env node

/**
 * Script de Validación: DocumentXTR
 * 
 * Valida que DocumentXTR esté funcionando correctamente
 * y genera un reporte de validación.
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DocumentXTRValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.validationResults = {
      timestamp: new Date().toISOString(),
      overallStatus: 'PENDING',
      checks: [],
      recommendations: [],
      errors: []
    };
  }

  /**
   * Ejecutar validación completa
   */
  async validate() {
    console.log('🔍 Iniciando validación de DocumentXTR...');
    console.log('📁 Proyecto:', this.projectRoot);
    
    try {
      // 1. Validar existencia de archivos
      await this.validateFileExistence();
      
      // 2. Validar estructura de directorios
      await this.validateDirectoryStructure();
      
      // 3. Validar configuración de git hooks
      await this.validateGitHooks();
      
      // 4. Validar ejecución de DocumentXTR
      await this.validateDocumentXTRExecution();
      
      // 5. Validar reportes generados
      await this.validateGeneratedReports();
      
      // 6. Validar compliance score
      await this.validateComplianceScore();
      
      // 7. Generar reporte de validación
      await this.generateValidationReport();
      
      // 8. Mostrar resumen
      this.showValidationSummary();
      
    } catch (error) {
      console.error('❌ Error en validación:', error);
      this.validationResults.errors.push(error.message);
      this.validationResults.overallStatus = 'FAILED';
      await this.generateValidationReport();
      process.exit(1);
    }
  }

  /**
   * Validar existencia de archivos críticos
   */
  async validateFileExistence() {
    console.log('📋 Validando existencia de archivos...');
    
    const requiredFiles = [
      'scripts/DocumentXTR.js',
      'package.json',
      'docs/',
      '.git/'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      const exists = fs.existsSync(filePath);
      
      this.validationResults.checks.push({
        type: 'FILE_EXISTENCE',
        file: file,
        status: exists ? 'PASS' : 'FAIL',
        message: exists ? 'Archivo encontrado' : 'Archivo no encontrado'
      });
      
      if (!exists) {
        this.validationResults.errors.push(`Archivo requerido no encontrado: ${file}`);
      }
    }
    
    console.log('✅ Validación de archivos completada');
  }

  /**
   * Validar estructura de directorios
   */
  async validateDirectoryStructure() {
    console.log('📁 Validando estructura de directorios...');
    
    const requiredDirs = [
      'src/',
      'src/components/',
      'src/pages/',
      'src/hooks/',
      'docs/',
      'scripts/'
    ];
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      const exists = fs.existsSync(dirPath);
      
      this.validationResults.checks.push({
        type: 'DIRECTORY_STRUCTURE',
        directory: dir,
        status: exists ? 'PASS' : 'FAIL',
        message: exists ? 'Directorio encontrado' : 'Directorio no encontrado'
      });
      
      if (!exists) {
        this.validationResults.errors.push(`Directorio requerido no encontrado: ${dir}`);
      }
    }
    
    console.log('✅ Validación de estructura completada');
  }

  /**
   * Validar configuración de git hooks
   */
  async validateGitHooks() {
    console.log('🔧 Validando configuración de git hooks...');
    
    const hooksDir = path.join(this.projectRoot, '.git', 'hooks');
    const requiredHooks = [
      'pre-commit',
      'post-merge',
      'post-checkout',
      'post-commit',
      'prepare-commit-msg'
    ];
    
    if (!fs.existsSync(hooksDir)) {
      this.validationResults.checks.push({
        type: 'GIT_HOOKS',
        hook: 'ALL',
        status: 'FAIL',
        message: 'Directorio .git/hooks no encontrado'
      });
      this.validationResults.errors.push('Git hooks no configurados');
      this.validationResults.recommendations.push('Ejecutar: ./scripts/setup-documentxtr-hooks.sh');
      return;
    }
    
    for (const hook of requiredHooks) {
      const hookPath = path.join(hooksDir, hook);
      const exists = fs.existsSync(hookPath);
      const isExecutable = exists ? this.isFileExecutable(hookPath) : false;
      
      this.validationResults.checks.push({
        type: 'GIT_HOOKS',
        hook: hook,
        status: exists && isExecutable ? 'PASS' : 'FAIL',
        message: exists && isExecutable ? 'Hook configurado y ejecutable' : 
                 exists ? 'Hook existe pero no es ejecutable' : 'Hook no encontrado'
      });
      
      if (!exists) {
        this.validationResults.errors.push(`Git hook no encontrado: ${hook}`);
      } else if (!isExecutable) {
        this.validationResults.errors.push(`Git hook no es ejecutable: ${hook}`);
      }
    }
    
    if (this.validationResults.errors.some(e => e.includes('Git hook'))) {
      this.validationResults.recommendations.push('Reconfigurar git hooks: ./scripts/setup-documentxtr-hooks.sh');
    }
    
    console.log('✅ Validación de git hooks completada');
  }

  /**
   * Validar ejecución de DocumentXTR
   */
  async validateDocumentXTRExecution() {
    console.log('🚀 Validando ejecución de DocumentXTR...');
    
    try {
      // Importar y ejecutar DocumentXTR
      const { default: DocumentXTR } = await import('./DocumentXTR.js');
      const documentXTR = new DocumentXTR();
      
      // Ejecutar DocumentXTR
      await documentXTR.execute();
      
      this.validationResults.checks.push({
        type: 'DOCUMENTXTR_EXECUTION',
        status: 'PASS',
        message: 'DocumentXTR se ejecutó exitosamente'
      });
      
      console.log('✅ DocumentXTR ejecutado correctamente');
      
    } catch (error) {
      this.validationResults.checks.push({
        type: 'DOCUMENTXTR_EXECUTION',
        status: 'FAIL',
        message: `Error al ejecutar DocumentXTR: ${error.message}`
      });
      
      this.validationResults.errors.push(`Error en DocumentXTR: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validar reportes generados
   */
  async validateGeneratedReports() {
    console.log('📊 Validando reportes generados...');
    
    const requiredReports = [
      'docs/xtr-report.json',
      'docs/xtr-report.md',
      'docs/methodology/methodology.json',
      'docs/methodology/methodology.md',
      'docs/processes/processes.json',
      'docs/processes/processes.md'
    ];
    
    for (const report of requiredReports) {
      const reportPath = path.join(this.projectRoot, report);
      const exists = fs.existsSync(reportPath);
      
      this.validationResults.checks.push({
        type: 'GENERATED_REPORTS',
        report: report,
        status: exists ? 'PASS' : 'FAIL',
        message: exists ? 'Reporte generado' : 'Reporte no generado'
      });
      
      if (!exists) {
        this.validationResults.errors.push(`Reporte no generado: ${report}`);
      }
    }
    
    console.log('✅ Validación de reportes completada');
  }

  /**
   * Validar compliance score
   */
  async validateComplianceScore() {
    console.log('📈 Validando compliance score...');
    
    const reportPath = path.join(this.projectRoot, 'docs', 'xtr-report.json');
    
    if (!fs.existsSync(reportPath)) {
      this.validationResults.checks.push({
        type: 'COMPLIANCE_SCORE',
        status: 'FAIL',
        message: 'Reporte principal no encontrado'
      });
      this.validationResults.errors.push('No se puede validar compliance score: reporte no encontrado');
      return;
    }
    
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const complianceScore = report.metrics?.complianceScore || 0;
      
      this.validationResults.checks.push({
        type: 'COMPLIANCE_SCORE',
        status: complianceScore >= 90 ? 'PASS' : 'WARNING',
        message: `Compliance score: ${complianceScore}%`,
        score: complianceScore
      });
      
      if (complianceScore < 90) {
        this.validationResults.recommendations.push(`Mejorar compliance score (actual: ${complianceScore}%, mínimo: 90%)`);
      }
      
      console.log(`✅ Compliance score validado: ${complianceScore}%`);
      
    } catch (error) {
      this.validationResults.checks.push({
        type: 'COMPLIANCE_SCORE',
        status: 'FAIL',
        message: `Error al leer compliance score: ${error.message}`
      });
      
      this.validationResults.errors.push(`Error al validar compliance score: ${error.message}`);
    }
  }

  /**
   * Generar reporte de validación
   */
  async generateValidationReport() {
    console.log('📋 Generando reporte de validación...');
    
    // Determinar estado general
    const failedChecks = this.validationResults.checks.filter(check => check.status === 'FAIL');
    const warningChecks = this.validationResults.checks.filter(check => check.status === 'WARNING');
    
    if (failedChecks.length > 0) {
      this.validationResults.overallStatus = 'FAILED';
    } else if (warningChecks.length > 0) {
      this.validationResults.overallStatus = 'WARNING';
    } else {
      this.validationResults.overallStatus = 'PASSED';
    }
    
    // Crear directorio de validación si no existe
    const validationDir = path.join(this.projectRoot, 'docs', 'validation');
    if (!fs.existsSync(validationDir)) {
      fs.mkdirSync(validationDir, { recursive: true });
    }
    
    // Guardar reporte JSON
    const reportPath = path.join(validationDir, `validation-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.validationResults, null, 2));
    
    // Generar reporte Markdown
    const markdownReport = this.generateMarkdownReport();
    const markdownPath = path.join(validationDir, 'validation-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    console.log('✅ Reporte de validación generado');
  }

  /**
   * Generar reporte Markdown
   */
  generateMarkdownReport() {
    const statusEmoji = {
      'PASSED': '✅',
      'WARNING': '⚠️',
      'FAILED': '❌',
      'PENDING': '⏳'
    };
    
    const checkEmoji = {
      'PASS': '✅',
      'WARNING': '⚠️',
      'FAIL': '❌'
    };
    
    return `# Reporte de Validación DocumentXTR

## Resumen
- **Estado General:** ${statusEmoji[this.validationResults.overallStatus]} ${this.validationResults.overallStatus}
- **Timestamp:** ${this.validationResults.timestamp}
- **Checks Totales:** ${this.validationResults.checks.length}
- **Errores:** ${this.validationResults.errors.length}
- **Recomendaciones:** ${this.validationResults.recommendations.length}

## Checks Realizados

${this.validationResults.checks.map(check => {
  const emoji = checkEmoji[check.status];
  return `### ${emoji} ${check.type}
- **Estado:** ${check.status}
- **Mensaje:** ${check.message}
${check.file ? `- **Archivo:** ${check.file}` : ''}
${check.directory ? `- **Directorio:** ${check.directory}` : ''}
${check.hook ? `- **Hook:** ${check.hook}` : ''}
${check.report ? `- **Reporte:** ${check.report}` : ''}
${check.score ? `- **Score:** ${check.score}%` : ''}
`;
}).join('\n')}

## Errores Encontrados

${this.validationResults.errors.length > 0 ? 
  this.validationResults.errors.map(error => `- ❌ ${error}`).join('\n') : 
  '- ✅ No se encontraron errores'
}

## Recomendaciones

${this.validationResults.recommendations.length > 0 ? 
  this.validationResults.recommendations.map(rec => `- 💡 ${rec}`).join('\n') : 
  '- ✅ No hay recomendaciones'
}

## Próximos Pasos

${this.validationResults.overallStatus === 'PASSED' ? 
  '🎉 DocumentXTR está funcionando correctamente. Puedes continuar con el desarrollo.' :
  this.validationResults.overallStatus === 'WARNING' ? 
  '⚠️ DocumentXTR funciona pero hay mejoras recomendadas. Revisa las recomendaciones.' :
  '❌ DocumentXTR tiene problemas que deben resolverse antes de continuar.'
}

---
*Generado automáticamente por DocumentXTR Validator*
`;
  }

  /**
   * Mostrar resumen de validación
   */
  showValidationSummary() {
    console.log('\n📊 Resumen de Validación DocumentXTR');
    console.log('=====================================');
    
    const totalChecks = this.validationResults.checks.length;
    const passedChecks = this.validationResults.checks.filter(c => c.status === 'PASS').length;
    const failedChecks = this.validationResults.checks.filter(c => c.status === 'FAIL').length;
    const warningChecks = this.validationResults.checks.filter(c => c.status === 'WARNING').length;
    
    console.log(`📋 Checks Totales: ${totalChecks}`);
    console.log(`✅ Exitosos: ${passedChecks}`);
    console.log(`⚠️ Advertencias: ${warningChecks}`);
    console.log(`❌ Fallidos: ${failedChecks}`);
    console.log(`🎯 Estado General: ${this.validationResults.overallStatus}`);
    
    if (this.validationResults.errors.length > 0) {
      console.log('\n❌ Errores Encontrados:');
      this.validationResults.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }
    
    if (this.validationResults.recommendations.length > 0) {
      console.log('\n💡 Recomendaciones:');
      this.validationResults.recommendations.forEach(rec => {
        console.log(`   - ${rec}`);
      });
    }
    
    console.log('\n📁 Reportes generados en: docs/validation/');
    
    if (this.validationResults.overallStatus === 'PASSED') {
      console.log('\n🎉 ¡DocumentXTR está funcionando correctamente!');
    } else if (this.validationResults.overallStatus === 'WARNING') {
      console.log('\n⚠️ DocumentXTR funciona pero hay mejoras recomendadas.');
    } else {
      console.log('\n❌ DocumentXTR tiene problemas que deben resolverse.');
      process.exit(1);
    }
  }

  /**
   * Verificar si un archivo es ejecutable
   */
  isFileExecutable(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return (stats.mode & fs.constants.S_IXUSR) !== 0;
    } catch (error) {
      return false;
    }
  }
}

// Función principal
async function main() {
  const validator = new DocumentXTRValidator();
  await validator.validate();
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default DocumentXTRValidator; 