#!/usr/bin/env node

/**
 * @file enforce-report-rules.js
 * @description Script de pre-commit para forzar reglas de reportes
 * @version 1.0.0
 * @author VThink 1.0 Team
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ReportRulesEnforcer {
  constructor() {
    this.root = process.cwd();
    this.reportsDir = path.join(this.root, 'docs', 'reports');
    this.violations = [];
    this.blockedFiles = [];
  }

  /**
   * Verificar archivos staged
   */
  getStagedFiles() {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return output.split('\n').filter(file => file.trim());
    } catch (error) {
      console.error('❌ Error al obtener archivos staged:', error.message);
      return [];
    }
  }

  /**
   * Verificar si archivo está en ubicación prohibida
   */
  isInProhibitedLocation(filePath) {
    const prohibitedPatterns = [
      /^reports\//,
      /^\/reports\//,
      /^dev-tools\/reports\//,
      /^\/dev-tools\/reports\//,
      /.*\/reports\//
    ];

    return prohibitedPatterns.some(pattern => pattern.test(filePath));
  }

  /**
   * Verificar si archivo está en ubicación correcta
   */
  isInCorrectLocation(filePath) {
    return filePath.startsWith('docs/reports/');
  }

  /**
   * Verificar nomenclatura de archivo
   */
  hasValidNaming(filePath) {
    if (!filePath.startsWith('docs/reports/')) return false;
    
    const fileName = path.basename(filePath);
    const datePattern = /^\d{4}-\d{2}-\d{2}/;
    
    // Excepciones permitidas
    const allowedFiles = ['README.md', 'REPORT_RULES.md'];
    if (allowedFiles.includes(fileName)) return true;
    
    return datePattern.test(fileName);
  }

  /**
   * Verificar contenido VThink 1.0
   */
  hasValidContent(filePath) {
    if (!filePath.endsWith('.md')) return true; // Solo verificar archivos .md
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar estructura básica
      const hasTitle = content.includes('# Reporte:');
      const hasSummary = content.includes('## 📊 Resumen Ejecutivo');
      const hasVThink = content.includes('## 📋 VThink 1.0 Compliance');
      
      return hasTitle && hasSummary && hasVThink;
    } catch (error) {
      return false;
    }
  }

  /**
   * Ejecutar validaciones
   */
  validate() {
    console.log('🔍 Validando reglas de reportes...');
    
    const stagedFiles = this.getStagedFiles();
    let hasViolations = false;
    
    for (const file of stagedFiles) {
      // Verificar ubicación prohibida
      if (this.isInProhibitedLocation(file)) {
        this.violations.push(`❌ VIOLACIÓN CRÍTICA: ${file} está en ubicación prohibida`);
        this.blockedFiles.push(file);
        hasViolations = true;
        continue;
      }
      
      // Verificar ubicación correcta para reportes
      if (file.includes('report') || file.includes('analysis') || file.includes('migration')) {
        if (!this.isInCorrectLocation(file)) {
          this.violations.push(`❌ ERROR: ${file} debe estar en docs/reports/`);
          this.blockedFiles.push(file);
          hasViolations = true;
          continue;
        }
        
        // Verificar nomenclatura
        if (!this.hasValidNaming(file)) {
          this.violations.push(`❌ ERROR: ${file} debe tener fecha en formato YYYY-MM-DD`);
          this.blockedFiles.push(file);
          hasViolations = true;
          continue;
        }
        
        // Verificar contenido
        if (!this.hasValidContent(file)) {
          this.violations.push(`❌ ERROR: ${file} debe seguir estructura VThink 1.0`);
          this.blockedFiles.push(file);
          hasViolations = true;
          continue;
        }
      }
    }
    
    return !hasViolations;
  }

  /**
   * Mostrar reporte de validación
   */
  showReport() {
    console.log('\n📊 REPORTE DE VALIDACIÓN DE REPORTES');
    console.log('=====================================');
    
    if (this.violations.length === 0) {
      console.log('✅ Todas las reglas de reportes cumplidas');
      return;
    }
    
    console.log('\n❌ VIOLACIONES ENCONTRADAS:');
    this.violations.forEach(violation => {
      console.log(`  ${violation}`);
    });
    
    console.log('\n📋 REGLAS DE REPORTES - VThink 1.0:');
    console.log('  ✅ Ubicación: docs/reports/');
    console.log('  ✅ Nomenclatura: YYYY-MM-DD-tipo-titulo.md');
    console.log('  ✅ Estructura: VThink 1.0 obligatoria');
    console.log('  ❌ Prohibido: /reports/, dev-tools/reports/');
    
    console.log('\n🔧 SOLUCIONES:');
    console.log('  1. Mover archivos a docs/reports/<tipo>/');
    console.log('  2. Renombrar con fecha: YYYY-MM-DD-...');
    console.log('  3. Seguir estructura VThink 1.0');
    console.log('  4. Usar: node dev-tools/scripts/create-report.js');
  }

  /**
   * Ejecutar script
   */
  run() {
    const isValid = this.validate();
    
    if (!isValid) {
      this.showReport();
      console.log('\n🚫 COMMIT BLOQUEADO - Violaciones de reglas de reportes');
      process.exit(1);
    }
    
    console.log('✅ Validación de reportes exitosa');
  }
}

// Ejecutar validación
const enforcer = new ReportRulesEnforcer();
enforcer.run(); 