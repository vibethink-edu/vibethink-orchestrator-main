#!/usr/bin/env node

/**
 * Procesador Automático de Requerimientos - AI Pair Orchestrator Pro
 * Versión: 1.0
 * Fecha: 27 de Enero, 2025
 * Responsable: Marcelo/AI
 * 
 * Uso:
 * node scripts/requirement-processor.js "Necesito cambiar de React a Vue"
 * node scripts/requirement-processor.js --file requirements.txt
 * node scripts/requirement-processor.js --validate
 */

const fs = require('fs');
const path = require('path');

class RequirementProcessor {
  constructor() {
    this.classificationRules = {
      technical: {
        keywords: ['react', 'vue', 'angular', 'typescript', 'javascript', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes', 'vite', 'webpack', 'tailwind', 'bootstrap', 'material-ui', 'antd', 'supabase', 'firebase', 'aws', 'azure', 'gcp'],
        targetFile: 'docs/STACK_TECHNOLOGY.md',
        category: 'TECHNICAL'
      },
      architecture: {
        keywords: ['microservicios', 'monolito', 'cqrs', 'event-driven', 'ddd', 'clean architecture', 'hexagonal', 'layered', 'componentes', 'patrones', 'cache', 'load balancer', 'api gateway'],
        targetFile: 'docs/ARCHITECTURE.md',
        category: 'ARCHITECTURE'
      },
      development: {
        keywords: ['testing', 'unit test', 'integration test', 'e2e', 'ci/cd', 'deployment', 'devops', 'code review', 'linting', 'formatting', 'documentation', 'api docs', 'swagger'],
        targetFile: 'docs/DEVELOPMENT.md',
        category: 'DEVELOPMENT'
      },
      business: {
        keywords: ['facturación', 'crm', 'analytics', 'reportes', 'multi-tenant', 'permisos', 'roles', 'usuarios', 'empresas', 'clientes', 'ventas', 'marketing', 'finanzas'],
        targetFile: 'docs/BUSINESS.md',
        category: 'BUSINESS'
      },
      features: {
        keywords: ['dashboard', 'chat', 'notificaciones', 'redes sociales', 'ia', 'machine learning', 'workflow', 'formularios', 'tablas', 'gráficos', 'mapas', 'calendario'],
        targetFile: 'docs/FEATURES.md',
        category: 'FEATURES'
      }
    };
    
    this.priorityKeywords = {
      critical: ['crítico', 'urgente', 'bloqueante', 'error', 'falla'],
      high: ['alto', 'importante', 'prioritario', 'necesito'],
      medium: ['medio', 'normal', 'estándar'],
      low: ['bajo', 'opcional', 'mejora', 'nice to have']
    };
  }

  /**
   * Procesa un requerimiento y determina su ubicación
   */
  processRequirement(requirement) {
    console.log(`🔍 Procesando requerimiento: "${requirement}"`);
    
    const classification = this.classifyRequirement(requirement);
    const targetLocation = this.determineTargetLocation(classification);
    const priority = this.determinePriority(requirement);
    const effort = this.estimateEffort(classification, priority);
    
    const result = {
      requirement,
      classification,
      targetLocation,
      priority,
      effort,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    
    console.log(`✅ Clasificado como: ${classification.category}`);
    console.log(`📍 Ubicación: ${targetLocation}`);
    console.log(`🎯 Prioridad: ${priority}`);
    console.log(`⏱️ Esfuerzo estimado: ${effort} horas`);
    
    return result;
  }

  /**
   * Clasifica el requerimiento basado en palabras clave
   */
  classifyRequirement(requirement) {
    const lowerRequirement = requirement.toLowerCase();
    
    for (const [category, rules] of Object.entries(this.classificationRules)) {
      const matchCount = rules.keywords.filter(keyword => 
        lowerRequirement.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        return {
          category: rules.category,
          subcategory: category,
          confidence: matchCount / rules.keywords.length,
          matchedKeywords: rules.keywords.filter(keyword => 
            lowerRequirement.includes(keyword.toLowerCase())
          )
        };
      }
    }
    
    // Default classification
    return {
      category: 'FEATURES',
      subcategory: 'general',
      confidence: 0.1,
      matchedKeywords: []
    };
  }

  /**
   * Determina la ubicación específica en la estructura consolidada
   */
  determineTargetLocation(classification) {
    const baseFile = this.classificationRules[classification.subcategory]?.targetFile || 'docs/FEATURES.md';
    
    // Determinar sección específica basada en keywords
    const section = this.determineSection(classification);
    
    return {
      file: baseFile,
      section,
      subsection: this.determineSubsection(classification)
    };
  }

  /**
   * Determina la sección específica dentro del archivo
   */
  determineSection(classification) {
    const { category, matchedKeywords } = classification;
    
    switch (category) {
      case 'TECHNICAL':
        if (matchedKeywords.some(k => ['react', 'vue', 'angular'].includes(k))) {
          return 'frontend.framework';
        }
        if (matchedKeywords.some(k => ['postgresql', 'mongodb', 'redis'].includes(k))) {
          return 'backend.database';
        }
        return 'general';
        
      case 'ARCHITECTURE':
        if (matchedKeywords.some(k => ['microservicios', 'monolito'].includes(k))) {
          return 'patterns.microservices';
        }
        if (matchedKeywords.some(k => ['cqrs', 'event-driven'].includes(k))) {
          return 'patterns.cqrs';
        }
        return 'general';
        
      case 'BUSINESS':
        if (matchedKeywords.some(k => ['facturación', 'billing'].includes(k))) {
          return 'modules.billing';
        }
        if (matchedKeywords.some(k => ['crm', 'clientes'].includes(k))) {
          return 'modules.crm';
        }
        return 'general';
        
      default:
        return 'general';
    }
  }

  /**
   * Determina la subsección específica
   */
  determineSubsection(classification) {
    // Implementar lógica específica para subsecciones
    return 'implementation';
  }

  /**
   * Determina la prioridad basada en palabras clave
   */
  determinePriority(requirement) {
    const lowerRequirement = requirement.toLowerCase();
    
    for (const [priority, keywords] of Object.entries(this.priorityKeywords)) {
      if (keywords.some(keyword => lowerRequirement.includes(keyword))) {
        return priority.toUpperCase();
      }
    }
    
    return 'MEDIUM';
  }

  /**
   * Estima el esfuerzo basado en la categoría y prioridad
   */
  estimateEffort(classification, priority) {
    const baseEffort = {
      TECHNICAL: 20,
      ARCHITECTURE: 40,
      DEVELOPMENT: 15,
      BUSINESS: 25,
      FEATURES: 30
    };
    
    const priorityMultiplier = {
      CRITICAL: 1.5,
      HIGH: 1.2,
      MEDIUM: 1.0,
      LOW: 0.8
    };
    
    const base = baseEffort[classification.category] || 20;
    const multiplier = priorityMultiplier[priority] || 1.0;
    
    return Math.round(base * multiplier);
  }

  /**
   * Genera el cambio seguro para aplicar
   */
  generateSafeChange(requirement, classification, targetLocation) {
    const change = {
      type: 'UPDATE',
      file: targetLocation.file,
      section: targetLocation.section,
      subsection: targetLocation.subsection,
      oldValue: null,
      newValue: null,
      description: requirement,
      timestamp: new Date().toISOString()
    };
    
    // Determinar el cambio específico basado en la clasificación
    switch (classification.category) {
      case 'TECHNICAL':
        change.type = 'STACK_UPDATE';
        change.newValue = this.determineTechnicalChange(requirement, classification);
        break;
        
      case 'FEATURES':
        change.type = 'FEATURE_ADD';
        change.newValue = true;
        break;
        
      case 'BUSINESS':
        change.type = 'MODULE_ADD';
        change.newValue = true;
        break;
        
      default:
        change.type = 'DOCUMENTATION_UPDATE';
        change.newValue = requirement;
    }
    
    return change;
  }

  /**
   * Determina el cambio técnico específico
   */
  determineTechnicalChange(requirement, classification) {
    const lowerRequirement = requirement.toLowerCase();
    
    // Mapeo de cambios técnicos comunes
    const technicalChanges = {
      'react': 'React 18 + TypeScript',
      'vue': 'Vue 3 + TypeScript',
      'angular': 'Angular 17 + TypeScript',
      'postgresql': 'PostgreSQL 15+',
      'mongodb': 'MongoDB 6+',
      'redis': 'Redis 7+',
      'docker': 'Docker + Docker Compose',
      'kubernetes': 'Kubernetes 1.28+'
    };
    
    for (const [keyword, value] of Object.entries(technicalChanges)) {
      if (lowerRequirement.includes(keyword)) {
        return value;
      }
    }
    
    return 'Custom Technical Change';
  }

  /**
   * Valida que el cambio sea seguro
   */
  async validateChange(change) {
    console.log(`🔍 Validando cambio en ${change.file}...`);
    
    const validations = [
      this.validateFileExists(change.file),
      this.validateSectionExists(change.file, change.section),
      this.validateNoConflicts(change),
      this.validateDependencies(change)
    ];
    
    const results = await Promise.all(validations);
    const isValid = results.every(result => result.valid);
    
    if (!isValid) {
      console.log(`❌ Validación fallida:`);
      results.forEach(result => {
        if (!result.valid) {
          console.log(`   - ${result.message}`);
        }
      });
    } else {
      console.log(`✅ Validación exitosa`);
    }
    
    return isValid;
  }

  /**
   * Valida que el archivo existe
   */
  async validateFileExists(filePath) {
    try {
      await fs.promises.access(filePath);
      return { valid: true };
    } catch {
      return { 
        valid: false, 
        message: `Archivo ${filePath} no existe` 
      };
    }
  }

  /**
   * Valida que la sección existe
   */
  async validateSectionExists(filePath, section) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const sectionExists = content.includes(section);
      return { 
        valid: sectionExists, 
        message: sectionExists ? null : `Sección ${section} no encontrada en ${filePath}` 
      };
    } catch {
      return { 
        valid: false, 
        message: `No se pudo leer ${filePath}` 
      };
    }
  }

  /**
   * Valida que no hay conflictos
   */
  async validateNoConflicts(change) {
    // Implementar validación de conflictos
    return { valid: true };
  }

  /**
   * Valida dependencias
   */
  async validateDependencies(change) {
    // Implementar validación de dependencias
    return { valid: true };
  }

  /**
   * Aplica el cambio de forma segura
   */
  async applyChange(change) {
    console.log(`🔧 Aplicando cambio en ${change.file}...`);
    
    try {
      // Crear backup antes del cambio
      await this.createBackup(change.file);
      
      // Aplicar el cambio
      await this.performChange(change);
      
      // Validar post-cambio
      const isValid = await this.validatePostChange(change);
      
      if (isValid) {
        console.log(`✅ Cambio aplicado exitosamente`);
        await this.documentChange(change);
        return true;
      } else {
        console.log(`❌ Validación post-cambio fallida, revirtiendo...`);
        await this.revertChange(change);
        return false;
      }
      
    } catch (error) {
      console.log(`❌ Error aplicando cambio: ${error.message}`);
      await this.revertChange(change);
      return false;
    }
  }

  /**
   * Crea backup antes del cambio
   */
  async createBackup(filePath) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    await fs.promises.copyFile(filePath, backupPath);
    console.log(`💾 Backup creado: ${backupPath}`);
  }

  /**
   * Realiza el cambio específico
   */
  async performChange(change) {
    const content = await fs.promises.readFile(change.file, 'utf8');
    let newContent = content;
    
    switch (change.type) {
      case 'STACK_UPDATE':
        newContent = this.updateStackContent(content, change);
        break;
      case 'FEATURE_ADD':
        newContent = this.addFeatureContent(content, change);
        break;
      case 'MODULE_ADD':
        newContent = this.addModuleContent(content, change);
        break;
      default:
        newContent = this.addDocumentationContent(content, change);
    }
    
    await fs.promises.writeFile(change.file, newContent, 'utf8');
  }

  /**
   * Actualiza contenido del stack
   */
  updateStackContent(content, change) {
    // Implementar lógica específica para actualizar stack
    const sectionPattern = new RegExp(`(${change.section}:\\s*['"])([^'"]*)(['"])`, 'g');
    return content.replace(sectionPattern, `$1${change.newValue}$3`);
  }

  /**
   * Agrega contenido de feature
   */
  addFeatureContent(content, change) {
    // Implementar lógica para agregar features
    const featureSection = `\n  ${change.subsection}: true, // ${change.description}`;
    return content.replace(/(features:\s*\{)/, `$1${featureSection}`);
  }

  /**
   * Agrega contenido de módulo
   */
  addModuleContent(content, change) {
    // Implementar lógica para agregar módulos
    const moduleSection = `\n  ${change.subsection}: true, // ${change.description}`;
    return content.replace(/(modules:\s*\{)/, `$1${moduleSection}`);
  }

  /**
   * Agrega contenido de documentación
   */
  addDocumentationContent(content, change) {
    // Implementar lógica para agregar documentación
    const docSection = `\n## ${change.description}\n\nImplementación pendiente.\n`;
    return content + docSection;
  }

  /**
   * Valida el cambio después de aplicarlo
   */
  async validatePostChange(change) {
    // Implementar validaciones post-cambio
    return true;
  }

  /**
   * Revierte el cambio si es necesario
   */
  async revertChange(change) {
    const backupPath = `${change.file}.backup.*`;
    const backupFiles = await fs.promises.readdir(path.dirname(change.file));
    const latestBackup = backupFiles
      .filter(f => f.startsWith(path.basename(change.file) + '.backup.'))
      .sort()
      .pop();
    
    if (latestBackup) {
      await fs.promises.copyFile(
        path.join(path.dirname(change.file), latestBackup),
        change.file
      );
      console.log(`🔄 Cambio revertido usando backup: ${latestBackup}`);
    }
  }

  /**
   * Documenta el cambio
   */
  async documentChange(change) {
    const changeLog = {
      timestamp: change.timestamp,
      type: change.type,
      file: change.file,
      section: change.section,
      description: change.description,
      oldValue: change.oldValue,
      newValue: change.newValue
    };
    
    const changeLogPath = 'docs/CHANGELOG_REQUIREMENTS.md';
    const changeLogEntry = `\n## ${change.timestamp}\n- **Tipo**: ${change.type}\n- **Archivo**: ${change.file}\n- **Descripción**: ${change.description}\n- **Cambio**: ${change.oldValue} → ${change.newValue}\n`;
    
    try {
      await fs.promises.appendFile(changeLogPath, changeLogEntry);
    } catch {
      // Si el archivo no existe, crearlo
      await fs.promises.writeFile(changeLogPath, `# Changelog de Requerimientos\n\n${changeLogEntry}`);
    }
  }

  /**
   * Procesa múltiples requerimientos desde un archivo
   */
  async processFile(filePath) {
    console.log(`📁 Procesando archivo: ${filePath}`);
    
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const requirements = content.split('\n').filter(line => line.trim());
      
      console.log(`📋 Encontrados ${requirements.length} requerimientos`);
      
      for (const requirement of requirements) {
        if (requirement.trim()) {
          await this.processSingleRequirement(requirement.trim());
        }
      }
      
    } catch (error) {
      console.error(`❌ Error procesando archivo: ${error.message}`);
    }
  }

  /**
   * Procesa un requerimiento individual
   */
  async processSingleRequirement(requirement) {
    try {
      const result = this.processRequirement(requirement);
      const change = this.generateSafeChange(requirement, result.classification, result.targetLocation);
      
      const isValid = await this.validateChange(change);
      if (isValid) {
        const success = await this.applyChange(change);
        if (success) {
          console.log(`✅ Requerimiento procesado exitosamente: "${requirement}"`);
        } else {
          console.log(`❌ Error aplicando requerimiento: "${requirement}"`);
        }
      } else {
        console.log(`❌ Validación fallida para: "${requirement}"`);
      }
      
    } catch (error) {
      console.error(`❌ Error procesando requerimiento: ${error.message}`);
    }
  }
}

// Función principal
async function main() {
  const processor = new RequirementProcessor();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🚀 Procesador de Requerimientos - AI Pair Orchestrator Pro

Uso:
  node scripts/requirement-processor.js "Necesito cambiar de React a Vue"
  node scripts/requirement-processor.js --file requirements.txt
  node scripts/requirement-processor.js --validate

Ejemplos:
  node scripts/requirement-processor.js "Quiero usar MongoDB en lugar de PostgreSQL"
  node scripts/requirement-processor.js "Necesito un sistema de chat en tiempo real"
  node scripts/requirement-processor.js "Quiero implementar microservicios"
    `);
    return;
  }
  
  if (args[0] === '--file') {
    if (args[1]) {
      await processor.processFile(args[1]);
    } else {
      console.log('❌ Error: Debe especificar un archivo');
    }
  } else if (args[0] === '--validate') {
    console.log('🔍 Modo validación - no se aplicarán cambios');
    // Implementar modo validación
  } else {
    const requirement = args.join(' ');
    await processor.processSingleRequirement(requirement);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = RequirementProcessor; 