#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Analiza los cambios en dependencias y genera un reporte de impacto
 * Uso: node scripts/analyze-dependencies.js [commit-hash]
 */

// Dependencias críticas que requieren atención especial
const CRITICAL_DEPENDENCIES = [
  'react', 'react-dom', 'typescript', '@supabase/supabase-js',
  '@tanstack/react-query', 'react-router-dom', 'vite'
];

// Dependencias importantes
const IMPORTANT_DEPENDENCIES = [
  '@radix-ui/react-*', 'tailwindcss', 'eslint', 'vitest',
  'react-hook-form', 'zod', 'date-fns', 'lucide-react'
];

// Dependencias menores (utilidades)
const MINOR_DEPENDENCIES = [
  'clsx', 'tailwind-merge', 'class-variance-authority',
  'sonner', '@hookform/resolvers'
];

class DependencyAnalyzer {
  constructor() {
    this.packageJsonPath = path.join(process.cwd(), 'package.json');
    this.packageLockPath = path.join(process.cwd(), 'package-lock.json');
    this.changes = { added: [], updated: [], removed: [] };
    this.impact = { critical: [], important: [], minor: [] };
  }

  /**
   * Analiza los cambios en dependencias desde un commit específico
   */
  async analyzeChanges(commitHash = 'HEAD~1') {
    try {
      console.log(`🔍 Analizando cambios desde commit: ${commitHash}`);
      
      // Obtener cambios en package.json
      const diff = this.getPackageJsonDiff(commitHash);
      this.parseDependencyChanges(diff);
      
      // Analizar impacto
      this.analyzeImpact();
      
      // Generar reporte
      this.generateReport();
      
      console.log('✅ Análisis completado');
      
    } catch (error) {
      console.error('❌ Error en análisis:', error.message);
      process.exit(1);
    }
  }

  /**
   * Obtiene el diff de package.json desde un commit
   */
  getPackageJsonDiff(commitHash) {
    try {
      return execSync(`git diff ${commitHash} package.json`, { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (error) {
      // Si no hay cambios, retornar string vacío
      return '';
    }
  }

  /**
   * Parsea los cambios en dependencias del diff
   */
  parseDependencyChanges(diff) {
    if (!diff) {
      console.log('📝 No se encontraron cambios en dependencias');
      return;
    }

    const lines = diff.split('\n');
    let currentSection = null;
    let currentDependency = null;

    for (const line of lines) {
      // Detectar sección (dependencies, devDependencies)
      if (line.includes('"dependencies"')) {
        currentSection = 'dependencies';
      } else if (line.includes('"devDependencies"')) {
        currentSection = 'devDependencies';
      }

      // Detectar cambios en dependencias
      if (line.includes('"') && line.includes('":')) {
        const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
        if (match) {
          const [, name, version] = match;
          currentDependency = { name, version, section: currentSection };
          
          if (line.startsWith('+')) {
            this.changes.added.push(currentDependency);
          } else if (line.startsWith('-')) {
            this.changes.removed.push(currentDependency);
          } else {
            // Cambio de versión
            const prevVersion = this.getPreviousVersion(name, lines);
            if (prevVersion && prevVersion !== version) {
              this.changes.updated.push({
                ...currentDependency,
                previousVersion: prevVersion
              });
            }
          }
        }
      }
    }

    console.log(`📊 Cambios detectados:`);
    console.log(`  - Agregadas: ${this.changes.added.length}`);
    console.log(`  - Actualizadas: ${this.changes.updated.length}`);
    console.log(`  - Removidas: ${this.changes.removed.length}`);
  }

  /**
   * Obtiene la versión anterior de una dependencia
   */
  getPreviousVersion(dependencyName, diffLines) {
    for (const line of diffLines) {
      if (line.includes(`"${dependencyName}"`) && line.startsWith('-')) {
        const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
        return match ? match[2] : null;
      }
    }
    return null;
  }

  /**
   * Analiza el impacto de los cambios
   */
  analyzeImpact() {
    // Analizar dependencias actualizadas
    this.changes.updated.forEach(dep => {
      if (this.isCriticalDependency(dep.name)) {
        this.impact.critical.push(dep);
      } else if (this.isImportantDependency(dep.name)) {
        this.impact.important.push(dep);
      } else {
        this.impact.minor.push(dep);
      }
    });

    // Analizar dependencias agregadas
    this.changes.added.forEach(dep => {
      if (this.isCriticalDependency(dep.name)) {
        this.impact.critical.push({ ...dep, type: 'added' });
      } else if (this.isImportantDependency(dep.name)) {
        this.impact.important.push({ ...dep, type: 'added' });
      } else {
        this.impact.minor.push({ ...dep, type: 'added' });
      }
    });

    console.log(`🎯 Impacto analizado:`);
    console.log(`  - Crítico: ${this.impact.critical.length}`);
    console.log(`  - Importante: ${this.impact.important.length}`);
    console.log(`  - Menor: ${this.impact.minor.length}`);
  }

  /**
   * Verifica si una dependencia es crítica
   */
  isCriticalDependency(name) {
    return CRITICAL_DEPENDENCIES.includes(name);
  }

  /**
   * Verifica si una dependencia es importante
   */
  isImportantDependency(name) {
    return IMPORTANT_DEPENDENCIES.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(name);
      }
      return pattern === name;
    });
  }

  /**
   * Genera el reporte de impacto
   */
  generateReport() {
    const report = this.createReportContent();
    const reportPath = path.join(process.cwd(), 'dependency-impact-report.md');
    
    fs.writeFileSync(reportPath, report);
    console.log(`📄 Reporte generado: ${reportPath}`);
  }

  /**
   * Crea el contenido del reporte
   */
  createReportContent() {
    const timestamp = new Date().toISOString();
    const totalChanges = this.changes.updated.length + this.changes.added.length + this.changes.removed.length;

    return `# Dependency Update Impact Report

**Generado**: ${timestamp}  
**Total de cambios**: ${totalChanges}  
**Commit analizado**: ${process.argv[2] || 'HEAD~1'}

## 📊 Resumen

- **Cambios críticos**: ${this.impact.critical.length}
- **Cambios importantes**: ${this.impact.important.length}
- **Cambios menores**: ${this.impact.minor.length}
- **Dependencias agregadas**: ${this.changes.added.length}
- **Dependencias removidas**: ${this.changes.removed.length}

## 🔴 Cambios Críticos

${this.impact.critical.length > 0 ? 
  this.impact.critical.map(dep => 
    `- **${dep.name}**: ${dep.previousVersion || 'N/A'} → ${dep.version} ${dep.type === 'added' ? '(NUEVA)' : ''}`
  ).join('\n') : 
  'No se detectaron cambios críticos.'
}

## 🟡 Cambios Importantes

${this.impact.important.length > 0 ? 
  this.impact.important.map(dep => 
    `- **${dep.name}**: ${dep.previousVersion || 'N/A'} → ${dep.version} ${dep.type === 'added' ? '(NUEVA)' : ''}`
  ).join('\n') : 
  'No se detectaron cambios importantes.'
}

## 🟢 Cambios Menores

${this.impact.minor.length > 0 ? 
  this.impact.minor.map(dep => 
    `- **${dep.name}**: ${dep.previousVersion || 'N/A'} → ${dep.version} ${dep.type === 'added' ? '(NUEVA)' : ''}`
  ).join('\n') : 
  'No se detectaron cambios menores.'
}

## 📋 Dependencias Removidas

${this.changes.removed.length > 0 ? 
  this.changes.removed.map(dep => 
    `- **${dep.name}**: ${dep.version} (${dep.section})`
  ).join('\n') : 
  'No se removieron dependencias.'
}

## 🚨 Recomendaciones

${this.generateRecommendations()}

## 🔧 Acciones Requeridas

${this.generateRequiredActions()}

## 📝 Notas

- Este reporte se genera automáticamente en el pipeline CI/CD
- Los cambios críticos requieren testing exhaustivo
- Los cambios importantes requieren testing de integración
- Los cambios menores pueden aplicarse automáticamente

---
*Reporte generado automáticamente por el sistema de análisis de dependencias*
`;
  }

  /**
   * Genera recomendaciones basadas en el impacto
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.impact.critical.length > 0) {
      recommendations.push(
        '🔴 **CRÍTICO**: Realizar testing exhaustivo antes de aplicar cambios',
        '🔴 **CRÍTICO**: Revisar changelog de cada dependencia crítica',
        '🔴 **CRÍTICO**: Probar en ambiente de staging antes de producción'
      );
    }

    if (this.impact.important.length > 0) {
      recommendations.push(
        '🟡 **IMPORTANTE**: Realizar testing de integración',
        '🟡 **IMPORTANTE**: Verificar compatibilidad con otras dependencias'
      );
    }

    if (this.impact.minor.length > 0) {
      recommendations.push(
        '🟢 **MENOR**: Aplicar automáticamente con testing básico'
      );
    }

    if (this.changes.removed.length > 0) {
      recommendations.push(
        '⚠️ **REMOCIÓN**: Verificar que no se esté usando código de dependencias removidas'
      );
    }

    return recommendations.length > 0 ? 
      recommendations.join('\n') : 
      '✅ No se requieren acciones especiales.';
  }

  /**
   * Genera acciones requeridas
   */
  generateRequiredActions() {
    const actions = [];

    if (this.impact.critical.length > 0) {
      actions.push(
        '1. **Testing Exhaustivo**: Ejecutar suite completa de tests',
        '2. **Testing Manual**: Probar funcionalidades críticas manualmente',
        '3. **Performance Testing**: Verificar impacto en rendimiento',
        '4. **Security Audit**: Ejecutar auditoría de seguridad',
        '5. **Staging Deployment**: Desplegar en staging para testing'
      );
    } else if (this.impact.important.length > 0) {
      actions.push(
        '1. **Integration Testing**: Ejecutar tests de integración',
        '2. **Build Testing**: Verificar que el build funcione correctamente',
        '3. **Smoke Testing**: Ejecutar tests básicos de funcionalidad'
      );
    } else {
      actions.push(
        '1. **Automated Testing**: Ejecutar tests automatizados',
        '2. **Build Verification**: Verificar build exitoso'
      );
    }

    return actions.join('\n');
  }
}

// Ejecutar análisis
async function main() {
  const analyzer = new DependencyAnalyzer();
  const commitHash = process.argv[2] || 'HEAD~1';
  
  await analyzer.analyzeChanges(commitHash);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = DependencyAnalyzer; 