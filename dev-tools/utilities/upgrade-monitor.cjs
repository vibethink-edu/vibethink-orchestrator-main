#!/usr/bin/env node

/**
 * Script de Monitoreo de Upgrades - VThink 1.0
 * Fecha: 05/07/2025
 * 
 * Este script monitorea las dependencias del proyecto y genera alertas
 * automáticas para upgrades de seguridad y mejoras de rendimiento.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración del sistema de monitoreo
const CONFIG = {
  projectName: 'VibeThink-Orchestrator',
  criticalPackages: [
    'react',
    'react-dom',
    '@supabase/supabase-js',
    'reactflow',
    '@radix-ui/react-slot'
  ],
  securityPackages: [
    '@hookform/resolvers',
    'react-hook-form',
    'zod',
    'axios'
  ],
  uiPackages: [
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge'
  ],
  testingPackages: [
    'vitest',
    '@testing-library/react',
    '@playwright/test'
  ]
};

// Tipos de alertas
const AlertType = {
  SECURITY_CRITICAL: 'security_critical',
  MAJOR_UPDATE: 'major_update',
  MINOR_UPDATE: 'minor_update',
  PATCH_UPDATE: 'patch_update',
  DEPRECATION_WARNING: 'deprecation_warning',
  COMPATIBILITY_ISSUE: 'compatibility_issue'
};

// Prioridades de upgrade
const UpgradePriority = {
  IMMEDIATE: 'immediate',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  MONITOR: 'monitor'
};

/**
 * Clase principal para el monitoreo de upgrades
 */
class UpgradeMonitor {
  constructor() {
    this.packageJson = this.loadPackageJson();
    this.outdatedPackages = [];
    this.securityIssues = [];
    this.recommendations = [];
  }

  /**
   * Carga el package.json del proyecto
   */
  loadPackageJson() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      return JSON.parse(packageContent);
    } catch (error) {
      console.error('❌ Error cargando package.json:', error.message);
      process.exit(1);
    }
  }

  /**
   * Ejecuta npm outdated y parsea los resultados
   */
  async checkOutdatedPackages() {
    try {
      console.log('🔍 Verificando dependencias desactualizadas...');
      
      const result = execSync('npm outdated --json', { encoding: 'utf8' });
      const outdated = JSON.parse(result);
      
      this.outdatedPackages = Object.entries(outdated).map(([name, info]) => ({
        name,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        location: info.location,
        priority: this.determinePriority(name, info.current, info.latest)
      }));

      console.log(`✅ Encontradas ${this.outdatedPackages.length} dependencias desactualizadas`);
      return this.outdatedPackages;
    } catch (error) {
      console.log('✅ Todas las dependencias están actualizadas');
      return [];
    }
  }

  /**
   * Determina la prioridad de upgrade basada en el paquete y las versiones
   */
  determinePriority(packageName, currentVersion, latestVersion) {
    // Paquetes críticos de seguridad
    if (CONFIG.securityPackages.includes(packageName)) {
      return UpgradePriority.IMMEDIATE;
    }

    // Paquetes críticos del core
    if (CONFIG.criticalPackages.includes(packageName)) {
      return UpgradePriority.HIGH;
    }

    // Paquetes de UI
    if (CONFIG.uiPackages.includes(packageName)) {
      return UpgradePriority.MEDIUM;
    }

    // Paquetes de testing
    if (CONFIG.testingPackages.includes(packageName)) {
      return UpgradePriority.LOW;
    }

    return UpgradePriority.MONITOR;
  }

  /**
   * Verifica vulnerabilidades de seguridad
   */
  async checkSecurityVulnerabilities() {
    try {
      console.log('🔒 Verificando vulnerabilidades de seguridad...');
      
      const result = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(result);
      
      this.securityIssues = audit.vulnerabilities ? Object.values(audit.vulnerabilities) : [];
      
      console.log(`✅ Encontradas ${this.securityIssues.length} vulnerabilidades`);
      return this.securityIssues;
    } catch (error) {
      console.log('✅ No se encontraron vulnerabilidades');
      return [];
    }
  }

  /**
   * Genera recomendaciones de upgrade
   */
  generateRecommendations() {
    this.recommendations = [];

    // Recomendaciones de seguridad
    this.securityIssues.forEach(issue => {
      this.recommendations.push({
        type: AlertType.SECURITY_CRITICAL,
        priority: UpgradePriority.IMMEDIATE,
        package: issue.name,
        description: `Vulnerabilidad de seguridad: ${issue.title}`,
        action: `Actualizar ${issue.name} a ${issue.fixAvailable || 'última versión'}`
      });
    });

    // Recomendaciones de upgrades
    this.outdatedPackages.forEach(pkg => {
      if (pkg.priority === UpgradePriority.IMMEDIATE || pkg.priority === UpgradePriority.HIGH) {
        this.recommendations.push({
          type: AlertType.MAJOR_UPDATE,
          priority: pkg.priority,
          package: pkg.name,
          description: `Actualización disponible: ${pkg.current} → ${pkg.latest}`,
          action: `npm install ${pkg.name}@latest`
        });
      }
    });

    return this.recommendations;
  }

  /**
   * Genera el reporte en formato JSON
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      project: CONFIG.projectName,
      summary: {
        totalOutdated: this.outdatedPackages.length,
        totalSecurityIssues: this.securityIssues.length,
        totalRecommendations: this.recommendations.length
      },
      outdatedPackages: this.outdatedPackages,
      securityIssues: this.securityIssues,
      recommendations: this.recommendations,
      criticalUpdates: this.recommendations.filter(r => r.priority === UpgradePriority.IMMEDIATE),
      highPriorityUpdates: this.recommendations.filter(r => r.priority === UpgradePriority.HIGH)
    };

    return report;
  }

  /**
   * Guarda el reporte en un archivo
   */
  saveReport(report) {
    const reportPath = path.join(process.cwd(), 'reports', 'upgrade-report.json');
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Reporte guardado en: ${reportPath}`);
  }

  /**
   * Muestra el resumen en consola
   */
  displaySummary(report) {
    console.log('\n📋 RESUMEN DE UPGRADES - VThink 1.0');
    console.log('=' .repeat(50));
    
    if (report.criticalUpdates.length > 0) {
      console.log('\n🚨 ACTUALIZACIONES CRÍTICAS:');
      report.criticalUpdates.forEach(update => {
        console.log(`  • ${update.package}: ${update.description}`);
        console.log(`    Acción: ${update.action}`);
      });
    }

    if (report.highPriorityUpdates.length > 0) {
      console.log('\n⚠️ ACTUALIZACIONES DE ALTA PRIORIDAD:');
      report.highPriorityUpdates.forEach(update => {
        console.log(`  • ${update.package}: ${update.description}`);
        console.log(`    Acción: ${update.action}`);
      });
    }

    if (report.outdatedPackages.length === 0 && report.securityIssues.length === 0) {
      console.log('\n✅ ¡Excelente! Todas las dependencias están actualizadas y seguras.');
    }

    console.log(`\n📊 Estadísticas:`);
    console.log(`  • Dependencias desactualizadas: ${report.summary.totalOutdated}`);
    console.log(`  • Vulnerabilidades: ${report.summary.totalSecurityIssues}`);
    console.log(`  • Recomendaciones: ${report.summary.totalRecommendations}`);
  }

  /**
   * Ejecuta el monitoreo completo
   */
  async run() {
    console.log('🚀 Iniciando monitoreo de upgrades - VThink 1.0');
    console.log('Fecha:', new Date().toLocaleDateString('es-ES'));
    console.log('=' .repeat(50));

    try {
      await this.checkOutdatedPackages();
      await this.checkSecurityVulnerabilities();
      this.generateRecommendations();
      
      const report = this.generateReport();
      this.saveReport(report);
      this.displaySummary(report);

      // Si hay actualizaciones críticas, salir con código de error
      if (report.criticalUpdates.length > 0) {
        console.log('\n❌ Se encontraron actualizaciones críticas que requieren atención inmediata.');
        process.exit(1);
      }

      console.log('\n✅ Monitoreo completado exitosamente.');
    } catch (error) {
      console.error('❌ Error durante el monitoreo:', error.message);
      process.exit(1);
    }
  }
}

// Ejecutar el monitoreo si el script se ejecuta directamente
if (require.main === module) {
  const monitor = new UpgradeMonitor();
  monitor.run();
}

module.exports = UpgradeMonitor; 