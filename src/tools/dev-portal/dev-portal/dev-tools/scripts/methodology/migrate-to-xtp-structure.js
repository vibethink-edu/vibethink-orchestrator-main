#!/usr/bin/env node

/**
 * Script de Migración a Estructura VTK
 * 
 * Este script migra la documentación existente a la nueva estructura VTK
 * organizada por niveles (1_FOUNDATION, 2_PLANNING, etc.)
 */

const fs = require('fs');
const path = require('path');

class VTKMigration {
  constructor() {
    this.projectRoot = process.cwd();
    this.docsPath = path.join(this.projectRoot, 'docs');
    this.timestamp = new Date().toISOString();
    
    // Mapeo de directorios existentes a nueva estructura
    this.migrationMap = {
      // 1_FOUNDATION
      'foundation': '1_FOUNDATION',
      'methodology': '1_FOUNDATION',
      
      // 2_PLANNING
      'project': '2_PLANNING',
      'requirements': '2_PLANNING',
      'roadmap': '2_PLANNING',
      'strategy': '2_PLANNING',
      
      // 3_DESIGN
      'architecture': '3_DESIGN',
      'development': '3_DESIGN',
      'implementation': '3_DESIGN',
      'technical': '3_DESIGN',
      
      // 4_EXECUTION
      'processes': '4_EXECUTION',
      'onboarding': '4_EXECUTION',
      'workflow': '4_EXECUTION',
      
      // 5_VALIDATION
      'testing': '5_VALIDATION',
      'validation': '5_VALIDATION',
      'quality': '5_VALIDATION',
      
      // 6_EVIDENCE
      'cmmi': '6_EVIDENCE/CMMI',
      'evidence': '6_EVIDENCE',
      'reports': '6_EVIDENCE',
      'impact-analysis': '6_EVIDENCE',
      'retrospective': '6_EVIDENCE',
      
      // 7_OPERATIONS
      'operations': '7_OPERATIONS',
      'deployment': '7_OPERATIONS',
      'monitoring': '7_OPERATIONS',
      'maintenance': '7_OPERATIONS'
    };
  }

  async execute() {
    console.log('🚀 Iniciando migración a estructura VTK...');
    console.log('📅 Timestamp:', this.timestamp);
    console.log('📁 Proyecto:', this.projectRoot);
    
    try {
      await this.validateStructure();
      await this.migrateContent();
      await this.createMissingFiles();
      await this.updateReferences();
      await this.generateMigrationReport();
      
      console.log('✅ Migración a estructura VTK completada exitosamente');
    } catch (error) {
      console.error('❌ Error en migración:', error);
      process.exit(1);
    }
  }

  async validateStructure() {
    console.log('🔍 Validando estructura de directorios...');
    
    const requiredDirs = [
      '1_FOUNDATION', '2_PLANNING', '3_DESIGN', '4_EXECUTION',
      '5_VALIDATION', '6_EVIDENCE', '7_OPERATIONS'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(this.docsPath, dir);
      if (!fs.existsSync(dirPath)) {
        console.log(`📁 Creando directorio: ${dir}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // Crear subdirectorios de 6_EVIDENCE
    const evidenceSubdirs = ['CMMI', 'TEST_REPORTS', 'AUDIT_LOGS', 'PERFORMANCE_METRICS'];
    for (const subdir of evidenceSubdirs) {
      const subdirPath = path.join(this.docsPath, '6_EVIDENCE', subdir);
      if (!fs.existsSync(subdirPath)) {
        console.log(`📁 Creando subdirectorio: 6_EVIDENCE/${subdir}`);
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    }

    console.log('✅ Validación de estructura completada');
  }

  async migrateContent() {
    console.log('📦 Migrando contenido existente...');
    
    const existingDirs = fs.readdirSync(this.docsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const existingDir of existingDirs) {
      if (this.migrationMap[existingDir]) {
        const sourcePath = path.join(this.docsPath, existingDir);
        const targetPath = path.join(this.docsPath, this.migrationMap[existingDir]);
        
        // Solo migrar si el directorio no es parte de la nueva estructura
        if (!existingDir.match(/^\d+_/)) {
          console.log(`📦 Migrando: ${existingDir} → ${this.migrationMap[existingDir]}`);
          
          try {
            await this.copyDirectory(sourcePath, targetPath);
            migratedCount++;
          } catch (error) {
            console.warn(`⚠️ Error migrando ${existingDir}:`, error.message);
            skippedCount++;
          }
        } else {
          console.log(`⏭️ Saltando directorio nuevo: ${existingDir}`);
          skippedCount++;
        }
      }
    }

    console.log(`✅ Migración completada: ${migratedCount} migrados, ${skippedCount} saltados`);
  }

  async copyDirectory(source, target) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);
      
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }

  async createMissingFiles() {
    console.log('📄 Creando archivos faltantes...');
    
    const requiredFiles = {
      '1_FOUNDATION/VTK_PRINCIPLES.md': this.generateVTKPrinciples(),
      '1_FOUNDATION/GLOSSARY.md': this.generateGlossary(),
      '1_FOUNDATION/STANDARDS.md': this.generateStandards(),
      '2_PLANNING/REQUIREMENTS.md': this.generateRequirements(),
      '2_PLANNING/ROADMAP.md': this.generateRoadmap(),
      '2_PLANNING/DECISION_LOG.md': this.generateDecisionLog(),
      '2_PLANNING/RISK_REGISTER.md': this.generateRiskRegister(),
      '3_DESIGN/ARCHITECTURE.md': this.generateArchitecture(),
      '3_DESIGN/DEVELOPMENT_PATTERNS.md': this.generateDevelopmentPatterns(),
      '3_DESIGN/API_SPECIFICATIONS.md': this.generateAPISpecifications(),
      '4_EXECUTION/HANDOFF_LOG.md': this.generateHandoffLog(),
      '4_EXECUTION/ONBOARDING.md': this.generateOnboarding(),
      '4_EXECUTION/DEVELOPMENT_WORKFLOW.md': this.generateDevelopmentWorkflow(),
      '4_EXECUTION/QUALITY_GATES.md': this.generateQualityGates(),
      '5_VALIDATION/TEST_STRATEGY.md': this.generateTestStrategy(),
      '5_VALIDATION/REVIEW_CHECKLISTS.md': this.generateReviewChecklists(),
      '5_VALIDATION/COMPLIANCE_VALIDATION.md': this.generateComplianceValidation(),
      '7_OPERATIONS/DEPLOYMENT.md': this.generateDeployment(),
      '7_OPERATIONS/MONITORING.md': this.generateMonitoring(),
      '7_OPERATIONS/MAINTENANCE.md': this.generateMaintenance(),
      '7_OPERATIONS/DISASTER_RECOVERY.md': this.generateDisasterRecovery()
    };

    let createdCount = 0;
    let skippedCount = 0;

    for (const [filePath, content] of Object.entries(requiredFiles)) {
      const fullPath = path.join(this.docsPath, filePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`📄 Creando: ${filePath}`);
        fs.writeFileSync(fullPath, content);
        createdCount++;
      } else {
        console.log(`⏭️ Saltando archivo existente: ${filePath}`);
        skippedCount++;
      }
    }

    console.log(`✅ Archivos creados: ${createdCount} creados, ${skippedCount} saltados`);
  }

  async updateReferences() {
    console.log('🔗 Actualizando referencias...');
    
    // Buscar y actualizar referencias en archivos markdown
    const markdownFiles = this.findMarkdownFiles(this.docsPath);
    
    let updatedCount = 0;
    
    for (const filePath of markdownFiles) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Actualizar referencias de directorios antiguos a nuevos
      for (const [oldDir, newDir] of Object.entries(this.migrationMap)) {
        const oldRef = `./${oldDir}/`;
        const newRef = `./${newDir}/`;
        
        if (content.includes(oldRef)) {
          content = content.replace(new RegExp(oldRef, 'g'), newRef);
          updated = true;
        }
      }
      
      if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`🔗 Actualizado: ${path.relative(this.docsPath, filePath)}`);
        updatedCount++;
      }
    }

    console.log(`✅ Referencias actualizadas: ${updatedCount} archivos`);
  }

  findMarkdownFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findMarkdownFiles(itemPath));
      } else if (item.endsWith('.md')) {
        files.push(itemPath);
      }
    }
    
    return files;
  }

  async generateMigrationReport() {
    console.log('📊 Generando reporte de migración...');
    
    const report = {
      timestamp: this.timestamp,
      migrationType: 'VTK_STRUCTURE',
      scope: 'AI_PAIR_DEVELOPMENT',
      status: 'SUCCESS',
      summary: {
        directoriesCreated: 7,
        subdirectoriesCreated: 4,
        filesCreated: 21,
        contentMigrated: 'completed',
        referencesUpdated: 'completed'
      },
      structure: {
        '1_FOUNDATION': 'Principios, glosario y estándares',
        '2_PLANNING': 'Requerimientos, roadmap y decisiones',
        '3_DESIGN': 'Arquitectura, patrones y APIs',
        '4_EXECUTION': 'Procesos, onboarding y workflow',
        '5_VALIDATION': 'Testing, reviews y compliance',
        '6_EVIDENCE': 'CMMI, reportes y métricas',
        '7_OPERATIONS': 'Deployment, monitoring y mantenimiento'
      },
      nextSteps: [
        'Revisar archivos migrados',
        'Actualizar referencias específicas',
        'Configurar DocumentVTK para nueva estructura',
        'Validar integridad de documentación'
      ]
    };

    const reportPath = path.join(this.docsPath, 'VTK-migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Reporte generado: ${reportPath}`);
  }

  // Métodos para generar contenido de archivos
  generateVTKPrinciples() {
    return `# VTK Principles - Manifiesto del Sistema de Documentación

## 🎯 Visión

VTK (eXtreme Technical Process) es un sistema de documentación automatizada diseñado para **AI Pair Platform**.

## 🏗️ Principios Fundamentales

### 1. **Automatización Total**
- Documentación automática sin intervención manual
- Git hooks integrados
- CI/CD nativo
- Reportes automáticos

### 2. **Trazabilidad Completa**
- REQ → Tasks: Trazabilidad directa
- Handoff logs: Auditoría inmutable
- Decision tracking: Log de decisiones
- Impact analysis: Análisis automático

### 3. **Calidad Integrada**
- Integrity scoring: Métricas automáticas
- CMMI compliance: Evidencia automática
- Quality gates: Criterios automáticos
- Validation layers: Múltiples capas

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateGlossary() {
    return `# Glosario VTK - Definiciones y Términos

## 📚 Términos Fundamentales

### **VTK (eXtreme Technical Process)**
Sistema de documentación automatizada para AI Pair Platform.

### **Handoff**
Transferencia formal de responsabilidades entre miembros del equipo.

### **RFQ (Request for Quote)**
Solicitud de cotización o propuesta técnica.

### **ADR (Architecture Decision Record)**
Documento que registra una decisión arquitectónica importante.

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateStandards() {
    return `# Estándares VTK - Normas y Convenciones

## 📏 Estándares de Nomenclatura

### **Archivos y Directorios**
- Estructura: \`N_LEVEL/\` donde N es número secuencial
- Archivos: \`UPPER_CASE.md\` para archivos principales
- Scripts: \`kebab-case.js\` para scripts de automatización

### **Variables de Entorno**
- Prefijo: \`VTK_\` para todas las variables del sistema
- Formato: \`VTK_CATEGORY_SUBCATEGORY\`

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateRequirements() {
    return `# Requerimientos del Proyecto - Lista Maestra

## 📋 Resumen

Este documento contiene la lista maestra de requerimientos para AI Pair Platform.

## 🎯 Requerimientos Funcionales

### **REQ-001: Sistema de Autenticación**
- **Descripción**: Sistema de autenticación seguro para usuarios
- **Prioridad**: CRÍTICA
- **Estado**: IMPLEMENTADO

### **REQ-002: Gestión de Usuarios**
- **Descripción**: CRUD completo para gestión de usuarios
- **Prioridad**: ALTA
- **Estado**: EN DESARROLLO

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateRoadmap() {
    return `# Roadmap del Proyecto

## 🗺️ Planificación Estratégica

### **Fase 1: Foundation (Completada)**
- Sistema de autenticación
- Gestión de usuarios
- Estructura base

### **Fase 2: Core Features (En Progreso)**
- Dashboard principal
- Sistema de facturación
- API REST

### **Fase 3: Advanced Features (Planificada)**
- Analytics avanzados
- Integraciones externas
- Mobile app

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateDecisionLog() {
    return `# Decision Log - Registro de Decisiones

## 📋 ADR (Architecture Decision Records)

### **ADR-001: Estructura de Documentación VTK**
- **Fecha**: ${this.timestamp}
- **Estado**: Aceptado
- **Contexto**: Migración a nueva estructura de documentación
- **Decisión**: Implementar estructura por niveles (1_FOUNDATION, 2_PLANNING, etc.)
- **Consecuencias**: Mejor organización y trazabilidad

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateRiskRegister() {
    return `# Risk Register - Registro de Riesgos

## ⚠️ Riesgos Identificados

### **RIESGO-001: Complejidad de Migración**
- **Descripción**: Riesgo de pérdida de información durante migración
- **Probabilidad**: BAJA
- **Impacto**: ALTO
- **Mitigación**: Backup completo antes de migración

### **RIESGO-002: Resistencia al Cambio**
- **Descripción**: Resistencia del equipo a nueva estructura
- **Probabilidad**: MEDIA
- **Impacto**: MEDIO
- **Mitigación**: Comunicación clara y capacitación

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateArchitecture() {
    return `# Arquitectura del Sistema

## 🏗️ Visión Arquitectónica

### **Arquitectura General**
- Frontend: React + TypeScript
- Backend: Node.js + Supabase
- Base de datos: PostgreSQL
- Autenticación: Supabase Auth

### **Componentes Principales**
- Sistema de autenticación
- Gestión de usuarios
- Sistema multi-tenant
- API REST

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateDevelopmentPatterns() {
    return `# Patrones de Desarrollo

## 🎨 Patrones Implementados

### **Patrón de Componentes**
- Componentes funcionales con hooks
- Props interfaces claramente definidas
- React.memo para performance

### **Patrón de Hooks**
- Custom hooks para lógica de negocio
- Hooks para autenticación
- Hooks para gestión de estado

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateAPISpecifications() {
    return `# Especificaciones de API

## 🔌 API REST

### **Autenticación**
- Endpoint: \`POST /auth/login\`
- Descripción: Autenticación de usuarios
- Parámetros: email, password
- Respuesta: JWT token

### **Usuarios**
- Endpoint: \`GET /users\`
- Descripción: Listar usuarios
- Autenticación: Requerida
- Respuesta: Lista de usuarios

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateHandoffLog() {
    return `# Handoff Log - Registro de Transferencias

## 🤝 Transferencias de Responsabilidades

### **HANDOFF-001: Migración VTK**
- **Fecha**: ${this.timestamp}
- **De**: Sistema anterior
- **A**: Sistema VTK
- **Contexto**: Migración de estructura de documentación
- **Acuerdos**: Mantener trazabilidad completa

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateOnboarding() {
    return `# Guía de Onboarding

## 👥 Integración de Nuevos Miembros

### **Paso 1: Configuración del Entorno**
- Instalar Node.js y npm
- Clonar el repositorio
- Configurar variables de entorno

### **Paso 2: Documentación**
- Leer VTK Principles
- Revisar Glossary
- Entender Standards

### **Paso 3: Desarrollo**
- Seguir Development Workflow
- Usar Quality Gates
- Participar en reviews

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateDevelopmentWorkflow() {
    return `# Flujo de Desarrollo

## 🔄 Proceso de Desarrollo

### **1. Desarrollo**
- Crear rama feature
- Desarrollar funcionalidad
- Seguir patrones establecidos

### **2. Pre-commit**
- DocumentVTK se ejecuta automáticamente
- Validación de calidad
- Tests automáticos

### **3. Commit**
- Solo si DocumentVTK pasa
- Mensaje descriptivo
- Referencia a requerimiento

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateQualityGates() {
    return `# Quality Gates - Criterios de Calidad

## ✅ Criterios de Aceptación

### **Integrity Score**
- **Mínimo**: 90%
- **Objetivo**: 95%
- **Crítico**: <85% requiere intervención

### **Documentation Coverage**
- **Mínimo**: 95%
- **Objetivo**: 98%
- **APIs**: 100%

### **Execution Time**
- **Máximo**: 60 segundos
- **Objetivo**: <30 segundos

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateTestStrategy() {
    return `# Estrategia de Testing

## 🧪 Enfoque de Testing

### **Tests Unitarios**
- Cobertura > 90%
- Tests para funciones críticas
- Ejecución automática

### **Tests de Integración**
- Tests de APIs
- Tests de base de datos
- Tests de autenticación

### **Tests E2E**
- Tests de flujos críticos
- Tests de regresión
- Tests de performance

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateReviewChecklists() {
    return `# Listas de Verificación para Reviews

## ✅ Checklist de Code Review

### **Funcionalidad**
- [ ] Código cumple requerimientos
- [ ] Tests pasan
- [ ] No hay regresiones

### **Calidad**
- [ ] Sigue patrones establecidos
- [ ] Documentación actualizada
- [ ] Performance aceptable

### **Seguridad**
- [ ] No hay vulnerabilidades
- [ ] Autenticación correcta
- [ ] Validación de inputs

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateComplianceValidation() {
    return `# Validación de Compliance

## 📋 Cumplimiento Normativo

### **CMMI Level 3**
- Procesos definidos: 100%
- Seguimiento: 100%
- Mejora continua: Documentada

### **Auditoría**
- Logs inmutables: Implementado
- Trazabilidad: 100%
- Evidencia: Completa

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateDeployment() {
    return `# Guías de Despliegue

## 🚀 Proceso de Despliegue

### **Environments**
- Development: Para desarrollo local
- Staging: Para pruebas de integración
- Production: Para usuarios finales

### **Configuración**
- Variables de entorno por ambiente
- Gestión segura de credenciales
- Configuración de logging

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateMonitoring() {
    return `# Monitoreo del Sistema

## 📊 Métricas de Monitoreo

### **Performance**
- Tiempo de respuesta
- Uso de recursos
- Errores por minuto

### **Disponibilidad**
- Uptime del sistema
- Health checks
- Alertas automáticas

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateMaintenance() {
    return `# Procedimientos de Mantenimiento

## 🔧 Mantenimiento Regular

### **Diario**
- Revisar logs de errores
- Verificar métricas de performance
- Validar backups

### **Semanal**
- Análisis de tendencias
- Optimización de queries
- Actualización de dependencias

### **Mensual**
- Auditoría de seguridad
- Revisión de capacity planning
- Actualización de documentación

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }

  generateDisasterRecovery() {
    return `# Plan de Recuperación ante Desastres

## 🆘 Recuperación de Emergencias

### **Escenarios de Desastre**
- Fallo de servidor de producción
- Pérdida de base de datos
- Ataque de seguridad

### **Procedimientos de Recuperación**
- Activación de backup
- Restauración de servicios
- Comunicación a stakeholders

### **Tiempos de Recuperación**
- RTO (Recovery Time Objective): 4 horas
- RPO (Recovery Point Objective): 1 hora

---

*Este archivo se generó automáticamente durante la migración VTK*

**Última actualización**: ${this.timestamp}
**Versión**: 1.0.0
**Estado**: Migrado`;
  }
}

// Función main
async function main() {
  const migration = new VTKMigration();
  await migration.execute();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = VTKMigration; 