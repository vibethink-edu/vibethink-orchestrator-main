#!/usr/bin/env node

/**
 * Version Status Checker
 * Script para verificar el estado de versiones del proyecto
 * 
 * @author Marcelo Escallón
 * @date 2024-12-19
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..');

class VersionStatusChecker {
  constructor() {
    this.packageJson = this.loadPackageJson();
    this.changelog = this.loadChangelog();
    this.analysis = this.analyzeVersions();
  }

  loadPackageJson() {
    try {
      const packagePath = path.join(PROJECT_ROOT, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('❌ Error al cargar package.json:', error.message);
      return null;
    }
  }

  loadChangelog() {
    try {
      const changelogPath = path.join(PROJECT_ROOT, 'CHANGELOG.md');
      const content = fs.readFileSync(changelogPath, 'utf8');
      
      // Extraer información del changelog
      const lines = content.split('\n');
      const unreleasedMatch = content.match(/## \[Unreleased\] - v(\d+\.\d+\.\d+)/);
      const latestVersionMatch = content.match(/## \[(\d+\.\d+\.\d+)\] - \d{4}-\d{2}-\d{2}/);
      
      return {
        content,
        unreleasedVersion: unreleasedMatch ? unreleasedMatch[1] : null,
        latestReleasedVersion: latestVersionMatch ? latestVersionMatch[1] : null,
        totalLines: lines.length
      };
    } catch (error) {
      console.error('❌ Error al cargar CHANGELOG.md:', error.message);
      return null;
    }
  }

  analyzeVersions() {
    const packageVersion = this.packageJson?.version || 'N/A';
    const unreleasedVersion = this.changelog?.unreleasedVersion || 'N/A';
    const latestReleasedVersion = this.changelog?.latestReleasedVersion || 'N/A';

    // Análisis de consistencia
    const isConsistent = packageVersion === latestReleasedVersion;
    const isDevelopment = unreleasedVersion !== 'N/A';
    const hasUnreleasedChanges = this.changelog?.content.includes('[Unreleased]');

    // Determinar estado del proyecto
    let projectStatus = 'unknown';
    let statusEmoji = '❓';
    
    if (isConsistent && isDevelopment) {
      projectStatus = 'development';
      statusEmoji = '🔄';
    } else if (isConsistent && !isDevelopment) {
      projectStatus = 'stable';
      statusEmoji = '✅';
    } else if (!isConsistent) {
      projectStatus = 'inconsistent';
      statusEmoji = '⚠️';
    }

    return {
      packageVersion,
      unreleasedVersion,
      latestReleasedVersion,
      isConsistent,
      isDevelopment,
      hasUnreleasedChanges,
      projectStatus,
      statusEmoji
    };
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 REPORTE DE ESTADO DE VERSIONES - AI Pair Orchestrator Pro');
    console.log('='.repeat(80));

    // Estado general
    console.log('\n🎯 ESTADO GENERAL DEL PROYECTO');
    console.log('-'.repeat(40));
    console.log(`${this.analysis.statusEmoji} Estado: ${this.analysis.projectStatus.toUpperCase()}`);
    console.log(`📦 Versión Package.json: ${this.analysis.packageVersion}`);
    console.log(`📝 Versión Changelog (última): ${this.analysis.latestReleasedVersion}`);
    console.log(`🚀 Versión en Desarrollo: ${this.analysis.unreleasedVersion}`);

    // Análisis de consistencia
    console.log('\n🔍 ANÁLISIS DE CONSISTENCIA');
    console.log('-'.repeat(40));
    console.log(`Consistencia: ${this.analysis.isConsistent ? '✅ ALINEADO' : '⚠️ DESALINEADO'}`);
    console.log(`En desarrollo: ${this.analysis.isDevelopment ? '✅ SÍ' : '❌ NO'}`);
    console.log(`Cambios pendientes: ${this.analysis.hasUnreleasedChanges ? '✅ SÍ' : '❌ NO'}`);

    // Recomendaciones
    console.log('\n💡 RECOMENDACIONES');
    console.log('-'.repeat(40));
    
    if (this.analysis.projectStatus === 'development') {
      console.log('✅ El proyecto está en desarrollo activo');
      console.log('✅ Las versiones están alineadas correctamente');
      console.log('📋 Próximo paso: Completar features de v1.2.0');
    } else if (this.analysis.projectStatus === 'stable') {
      console.log('✅ El proyecto está en versión estable');
      console.log('📋 Próximo paso: Iniciar desarrollo de nueva versión');
    } else if (this.analysis.projectStatus === 'inconsistent') {
      console.log('⚠️ Las versiones no están alineadas');
      console.log('🔧 Acción requerida: Actualizar versiones para consistencia');
    }

    // Información del proyecto
    console.log('\n📋 INFORMACIÓN DEL PROYECTO');
    console.log('-'.repeat(40));
    console.log(`Nombre: ${this.packageJson?.name || 'N/A'}`);
    console.log(`Tipo: ${this.packageJson?.private ? 'Privado' : 'Público'}`);
    console.log(`Módulo: ${this.packageJson?.type || 'CommonJS'}`);
    console.log(`Scripts disponibles: ${Object.keys(this.packageJson?.scripts || {}).length}`);

    // Dependencias
    if (this.packageJson) {
      const deps = Object.keys(this.packageJson.dependencies || {}).length;
      const devDeps = Object.keys(this.packageJson.devDependencies || {}).length;
      console.log(`Dependencias: ${deps} (prod) + ${devDeps} (dev) = ${deps + devDeps} total`);
    }

    // Timeline de versiones
    console.log('\n📅 TIMELINE DE VERSIONES');
    console.log('-'.repeat(40));
    console.log('v0.1.0 - Configuración inicial (2025-01-10)');
    console.log('v1.0.0 - Primera versión estable (2025-01-15)');
    console.log('v1.1.0 - Sistema de configuraciones (2025-06-16)');
    console.log('v1.2.0 - En desarrollo (Agentes IA + KB Híbrida)');
    console.log('v1.3.0 - Próximo (API pública + microservicios)');
    console.log('v2.0.0 - Futuro (Arquitectura completa SaaS)');

    // Próximos pasos
    console.log('\n🚀 PRÓXIMOS PASOS SUGERIDOS');
    console.log('-'.repeat(40));
    
    if (this.analysis.projectStatus === 'development') {
      console.log('1. Completar implementación de agentes IA');
      console.log('2. Implementar modelo híbrido de bases de conocimiento');
      console.log('3. Finalizar testing suite completo');
      console.log('4. Preparar release de v1.2.0');
    } else {
      console.log('1. Revisar estado actual del proyecto');
      console.log('2. Alinear versiones si es necesario');
      console.log('3. Planificar próximas features');
    }

    console.log('\n' + '='.repeat(80));
  }

  checkForIssues() {
    const issues = [];

    // Verificar inconsistencias
    if (!this.analysis.isConsistent) {
      issues.push({
        type: 'warning',
        message: 'Versiones no alineadas entre package.json y changelog',
        severity: 'medium'
      });
    }

    // Verificar si hay cambios sin documentar
    if (!this.analysis.hasUnreleasedChanges) {
      issues.push({
        type: 'info',
        message: 'No hay cambios pendientes documentados en changelog',
        severity: 'low'
      });
    }

    // Verificar si el proyecto está en desarrollo
    if (!this.analysis.isDevelopment) {
      issues.push({
        type: 'info',
        message: 'El proyecto no está en modo desarrollo activo',
        severity: 'low'
      });
    }

    return issues;
  }

  printIssues() {
    const issues = this.checkForIssues();
    
    if (issues.length > 0) {
      console.log('\n⚠️ ISSUES DETECTADOS');
      console.log('-'.repeat(40));
      
      issues.forEach((issue, index) => {
        const emoji = issue.type === 'warning' ? '⚠️' : 'ℹ️';
        const severity = issue.severity === 'high' ? '🔴' : 
                        issue.severity === 'medium' ? '🟡' : '🟢';
        console.log(`${index + 1}. ${emoji} ${severity} ${issue.message}`);
      });
    } else {
      console.log('\n✅ No se detectaron issues');
    }
  }

  suggestNextVersion() {
    const current = this.analysis.latestReleasedVersion;
    if (!current) return 'N/A';

    const [major, minor, patch] = current.split('.').map(Number);
    
    // Lógica para sugerir próxima versión
    if (this.analysis.hasUnreleasedChanges) {
      return `${major}.${minor + 1}.0`; // Minor version bump
    } else {
      return `${major}.${minor}.${patch + 1}`; // Patch version bump
    }
  }
}

// Función principal
function main() {
  const checker = new VersionStatusChecker();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'report':
      checker.generateReport();
      checker.printIssues();
      break;
      
    case 'next-version':
      const nextVersion = checker.suggestNextVersion();
      console.log(`\n🎯 Próxima versión sugerida: ${nextVersion}`);
      break;
      
    case 'issues':
      checker.printIssues();
      break;
      
    default:
      checker.generateReport();
      checker.printIssues();
      console.log('\n📋 Comandos disponibles:');
      console.log('  report        - Reporte completo de versiones');
      console.log('  next-version  - Sugerir próxima versión');
      console.log('  issues        - Solo mostrar issues detectados');
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default VersionStatusChecker; 