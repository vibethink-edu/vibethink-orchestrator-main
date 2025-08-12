#!/usr/bin/env node

/**
 * Integration Validator - VibeThink Orchestrator
 * AI-agnostic validator for VibeThink Orchestrator - ensures proper integration between components
 */

const fs = require('fs');
const path = require('path');

class IntegrationValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  async validate() {
    console.log('🔗 UNIVERSAL AI INTEGRATION VALIDATOR');
    console.log('======================================\n');
    
    try {
      await this.checkVThinkLawCompliance();
      await this.checkEcosystemIntegration();
      await this.checkDocumentationIntegration();
      await this.checkAutomationIntegration();
      await this.checkValidationIntegration();
      await this.checkCursorIntegration();
      await this.generateReport();
      
      this.printResults();
      return this.errors.length === 0;
    } catch (error) {
      console.error('❌ Error durante validación:', error.message);
      return false;
    }
  }

  async checkVThinkLawCompliance() {
    console.log('📋 Verificando cumplimiento de la Ley VThink...');
    
    const vthinkLawDoc = path.join(this.projectRoot, 'VTHINK_METHODOLOGY_LAW.md');
    if (fs.existsSync(vthinkLawDoc)) {
      this.success.push('✅ Ley VThink documentada correctamente');
      
      // Verificar que no hay confusión entre VThink y VibeThink
      const content = fs.readFileSync(vthinkLawDoc, 'utf8');
      if (content.includes('VThink = METHODOLOGY') && content.includes('VibeThink = SOFTWARE')) {
        this.success.push('✅ Distinción VThink/VibeThink clara');
      } else {
        this.warnings.push('⚠️ Distinción VThink/VibeThink no clara en documentación');
      }
    } else {
      this.warnings.push('⚠️ Ley VThink no documentada');
    }

    // Verificar consistencia en package.json
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.name && packageJson.name.includes('vibethink')) {
        this.success.push('✅ Nombre del proyecto sigue convención VibeThink');
      } else {
        this.warnings.push('⚠️ Nombre del proyecto no sigue convención VibeThink');
      }
    }
  }

  async checkEcosystemIntegration() {
    console.log('🏗️ Verificando integración del ecosistema...');
    
    // Verificar que los comandos npm usan el sistema existente
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const scripts = packageJson.scripts || {};
      
      const ecosystemCommands = [
        'validate:ecosystem',
        'validate:cross-app-compatibility',
        'validate:shared-component-impact',
        'validate:external-update'
      ];

      ecosystemCommands.forEach(cmd => {
        if (scripts[cmd]) {
          this.success.push(`✅ Comando ecosistema: ${cmd}`);
        } else {
          this.warnings.push(`⚠️ Comando ecosistema faltante: ${cmd}`);
        }
      });
    }

    // Verificar que no hay scripts duplicados
    const duplicateScripts = this.findDuplicateScripts();
    if (duplicateScripts.length > 0) {
      this.errors.push(`❌ Scripts duplicados encontrados: ${duplicateScripts.join(', ')}`);
    } else {
      this.success.push('✅ No se encontraron scripts duplicados');
    }
  }

  findDuplicateScripts() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return [];

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    const scriptNames = Object.keys(scripts);
    const duplicates = [];

    for (let i = 0; i < scriptNames.length; i++) {
      for (let j = i + 1; j < scriptNames.length; j++) {
        if (this.calculateSimilarity(scriptNames[i], scriptNames[j]) > 0.8) {
          duplicates.push(`${scriptNames[i]} / ${scriptNames[j]}`);
        }
      }
    }

    return duplicates;
  }

  async checkDocumentationIntegration() {
    console.log('📚 Verificando integración de documentación...');
    
    const criticalDocs = [
      'CLAUDE.md',
      'docs/methodologies/VThink-1.0/05_BEST_PRACTICES/AI_INTEGRATION_STANDARDS.md',
      'docs/ai-coordination/AI_COORDINATION_PROTOCOL.md',
      'AI_MANDATORY_REVIEW_SYSTEM.md'
    ];

    criticalDocs.forEach(doc => {
      const docPath = path.join(this.projectRoot, doc);
      if (fs.existsSync(docPath)) {
        this.success.push(`✅ Documentación crítica integrada: ${doc}`);
      } else {
        this.warnings.push(`⚠️ Documentación crítica faltante: ${doc}`);
      }
    });

    // Verificar que la documentación es coherente
    await this.checkDocumentationConsistency();
  }

  async checkDocumentationConsistency() {
    const docsToCheck = [
      'README.md',
      'CLAUDE.md',
      'AI_MANDATORY_REVIEW_SYSTEM.md'
    ];

    let consistentBranding = true;
    let consistentTerminology = true;

    docsToCheck.forEach(doc => {
      const docPath = path.join(this.projectRoot, doc);
      if (fs.existsSync(docPath)) {
        const content = fs.readFileSync(docPath, 'utf8');
        
        // Verificar branding consistente
        if (content.includes('VThink') && !content.includes('VibeThink')) {
          this.warnings.push(`⚠️ Posible confusión VThink/VibeThink en ${doc}`);
          consistentBranding = false;
        }
        
        // Verificar terminología consistente
        if (content.includes('AI-Friendly') && !content.includes('VThink')) {
          this.warnings.push(`⚠️ Terminología inconsistente en ${doc}`);
          consistentTerminology = false;
        }
      }
    });

    if (consistentBranding && consistentTerminology) {
      this.success.push('✅ Documentación coherente y consistente');
    }
  }

  async checkAutomationIntegration() {
    console.log('🤖 Verificando integración de automatización...');
    
    const automationPath = path.join(this.projectRoot, 'dev-tools/automation');
    if (fs.existsSync(automationPath)) {
      const files = fs.readdirSync(automationPath);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      
      if (jsFiles.length > 0) {
        this.success.push(`✅ ${jsFiles.length} scripts de automatización integrados`);
        
        // Verificar que los scripts siguen estándares VThink
        jsFiles.forEach(file => {
          const filePath = path.join(automationPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (content.includes('VThink') || content.includes('vibethink')) {
            this.success.push(`✅ Script ${file} sigue estándares VThink`);
          } else {
            this.warnings.push(`⚠️ Script ${file} no sigue estándares VThink`);
          }
        });
      } else {
        this.warnings.push('⚠️ No se encontraron scripts de automatización');
      }
    } else {
      this.warnings.push('⚠️ Directorio de automatización no encontrado');
    }
  }

  async checkValidationIntegration() {
    console.log('🔍 Verificando integración de validación...');
    
    const validationPath = path.join(this.projectRoot, 'dev-tools/validation');
    if (fs.existsSync(validationPath)) {
      const files = fs.readdirSync(validationPath);
      const validatorFiles = files.filter(file => file.endsWith('.cjs') || file.endsWith('.js'));
      
      if (validatorFiles.length > 0) {
        this.success.push(`✅ ${validatorFiles.length} validadores integrados`);
        
        // Verificar que los validadores son universales
        validatorFiles.forEach(file => {
          const filePath = path.join(validationPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (content.includes('Universal') || content.includes('VThink')) {
            this.success.push(`✅ Validador ${file} es universal`);
          } else {
            this.warnings.push(`⚠️ Validador ${file} no especifica universalidad`);
          }
        });
      } else {
        this.warnings.push('⚠️ No se encontraron validadores');
      }
    } else {
      this.warnings.push('⚠️ Directorio de validación no encontrado');
    }
  }

  async checkCursorIntegration() {
    console.log('🖱️ Verificando integración con Cursor...');
    
    // Verificar archivos de configuración de Cursor
    const cursorFiles = [
      '.cursorrules',
      '.cursor/rules.md'
    ];

    cursorFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        this.success.push(`✅ Configuración Cursor: ${file}`);
        
        // Verificar que la configuración es coherente
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('VThink') || content.includes('AI-Friendly')) {
          this.success.push(`✅ Configuración Cursor coherente con VThink`);
        } else {
          this.warnings.push(`⚠️ Configuración Cursor no coherente con VThink`);
        }
      } else {
        this.warnings.push(`⚠️ Configuración Cursor faltante: ${file}`);
      }
    });

    // Verificar pre-commit hook universal
    const preCommitPath = path.join(this.projectRoot, '.git/hooks/pre-commit');
    if (fs.existsSync(preCommitPath)) {
      const content = fs.readFileSync(preCommitPath, 'utf8');
      if (content.includes('UNIVERSAL AI') || content.includes('VThink')) {
        this.success.push('✅ Pre-commit hook universal configurado');
      } else {
        this.warnings.push('⚠️ Pre-commit hook no es universal');
      }
    } else {
      this.warnings.push('⚠️ Pre-commit hook no encontrado');
    }
  }

  calculateSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/[-_\s]/);
    const words2 = str2.toLowerCase().split(/[-_\s]/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  async generateReport() {
    console.log('\n📊 REPORTE DE INTEGRACIÓN');
    console.log('==========================');
    
    if (this.success.length > 0) {
      console.log(`\n✅ Integraciones exitosas: ${this.success.length}`);
      this.success.forEach(success => console.log(`   ${success}`));
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️ Advertencias de integración: ${this.warnings.length}`);
      this.warnings.forEach(warning => console.log(`   ${warning}`));
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Errores de integración: ${this.errors.length}`);
      this.errors.forEach(error => console.log(`   ${error}`));
    }
  }

  printResults() {
    console.log('\n🎯 RESULTADO FINAL');
    console.log('==================');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ INTEGRATION VALIDATION: PASSED');
      console.log('✅ Sistema completamente integrado');
      console.log('✅ Coherente con todas las IAs y Cursor');
    } else if (this.errors.length === 0) {
      console.log('⚠️ INTEGRATION VALIDATION: WARNING');
      console.log('⚠️ Sistema integrado con advertencias menores');
    } else {
      console.log('❌ INTEGRATION VALIDATION: FAILED');
      console.log('❌ Errores críticos de integración encontrados');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const validator = new IntegrationValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = IntegrationValidator; 