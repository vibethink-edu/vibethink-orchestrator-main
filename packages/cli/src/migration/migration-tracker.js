#!/usr/bin/env node

/**
 * Migration Tracker - Tracking de migración en tiempo real
 * Uso: node scripts/migration-tracker.js
 */

const fs = require('fs');
const path = require('path');

class MigrationTracker {
  constructor() {
    this.trackingFile = path.join(__dirname, '../docs/migration-status.json');
    this.status = this.loadStatus();
  }

  loadStatus() {
    if (fs.existsSync(this.trackingFile)) {
      return JSON.parse(fs.readFileSync(this.trackingFile, 'utf8'));
    }
    
    return {
      lastUpdated: new Date().toISOString(),
      migrations: [],
      metrics: {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        coverage: 0
      },
      timeline: {
        startDate: new Date().toISOString(),
        estimatedCompletion: null,
        milestones: []
      }
    };
  }

  trackMigration(file, action, details = {}) {
    const migration = {
      file,
      action,
      timestamp: new Date().toISOString(),
      details,
      status: this.getStatusFromAction(action)
    };

    this.status.migrations.push(migration);
    this.updateMetrics();
    this.saveStatus();
    
    console.log(`📝 Tracking: ${action} - ${file}`);
    
    return migration;
  }

  getStatusFromAction(action) {
    const statusMap = {
      'STARTED_MIGRATION': 'IN_PROGRESS',
      'COMPLETED_MIGRATION': 'COMPLETED',
      'VALIDATED_MIGRATION': 'COMPLETED',
      'FAILED_MIGRATION': 'FAILED',
      'REVERTED_MIGRATION': 'PENDING'
    };
    
    return statusMap[action] || 'UNKNOWN';
  }

  updateMetrics() {
    const migrations = this.status.migrations;
    
    this.status.metrics = {
      total: migrations.length,
      completed: migrations.filter(m => m.status === 'COMPLETED').length,
      inProgress: migrations.filter(m => m.status === 'IN_PROGRESS').length,
      pending: migrations.filter(m => m.status === 'PENDING').length,
      failed: migrations.filter(m => m.status === 'FAILED').length,
      coverage: Math.round((migrations.filter(m => m.status === 'COMPLETED').length / migrations.length) * 100) || 0
    };
  }

  saveStatus() {
    this.status.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.trackingFile, JSON.stringify(this.status, null, 2));
  }

  displayDashboard() {
    console.log('📊 DASHBOARD DE MIGRACIÓN\n');
    
    const metrics = this.status.metrics;
    console.log('📈 MÉTRICAS:');
    console.log(`   Total de migraciones: ${metrics.total}`);
    console.log(`   Completadas: ${metrics.completed} (${metrics.coverage}%)`);
    console.log(`   En progreso: ${metrics.inProgress}`);
    console.log(`   Pendientes: ${metrics.pending}`);
    console.log(`   Fallidas: ${metrics.failed}\n`);
    
    // Progreso visual
    const progressBar = this.generateProgressBar(metrics.coverage);
    console.log('📊 PROGRESO:');
    console.log(`   [${progressBar}] ${metrics.coverage}%\n`);
    
    // Últimas migraciones
    console.log('🔄 ÚLTIMAS MIGRACIONES:');
    const recentMigrations = this.status.migrations
      .slice(-5)
      .reverse();
    
    for (const migration of recentMigrations) {
      const date = new Date(migration.timestamp).toLocaleDateString();
      const status = this.getStatusEmoji(migration.status);
      console.log(`   ${status} ${migration.file} (${date}) - ${migration.action}`);
    }
    
    console.log('\n📅 TIMELINE:');
    console.log(`   Inicio: ${new Date(this.status.timeline.startDate).toLocaleDateString()}`);
    if (this.status.timeline.estimatedCompletion) {
      console.log(`   Estimado: ${new Date(this.status.timeline.estimatedCompletion).toLocaleDateString()}`);
    }
  }

  generateProgressBar(percentage) {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  getStatusEmoji(status) {
    const emojis = {
      'COMPLETED': '✅',
      'IN_PROGRESS': '🔄',
      'PENDING': '⏳',
      'FAILED': '❌',
      'UNKNOWN': '❓'
    };
    
    return emojis[status] || '❓';
  }

  addMilestone(milestone) {
    this.status.timeline.milestones.push({
      ...milestone,
      timestamp: new Date().toISOString()
    });
    this.saveStatus();
    
    console.log(`🎯 Milestone agregado: ${milestone.title}`);
  }

  estimateCompletion() {
    const completed = this.status.metrics.completed;
    const total = this.status.metrics.total;
    const inProgress = this.status.metrics.inProgress;
    
    if (completed === 0) {
      return null;
    }
    
    const avgTimePerMigration = 2; // horas
    const remainingMigrations = total - completed;
    const estimatedHours = remainingMigrations * avgTimePerMigration;
    
    const completionDate = new Date();
    completionDate.setHours(completionDate.getHours() + estimatedHours);
    
    this.status.timeline.estimatedCompletion = completionDate.toISOString();
    this.saveStatus();
    
    return completionDate;
  }

  generateReport() {
    const reportPath = path.join(__dirname, '../docs/migration-progress-report.md');
    
    const report = `# 📊 Reporte de Progreso de Migración

## 📈 Métricas Generales

- **Total de migraciones:** ${this.status.metrics.total}
- **Completadas:** ${this.status.metrics.completed} (${this.status.metrics.coverage}%)
- **En progreso:** ${this.status.metrics.inProgress}
- **Pendientes:** ${this.status.metrics.pending}
- **Fallidas:** ${this.status.metrics.failed}

## 📅 Timeline

- **Fecha de inicio:** ${new Date(this.status.timeline.startDate).toLocaleDateString()}
- **Última actualización:** ${new Date(this.status.lastUpdated).toLocaleDateString()}
${this.status.timeline.estimatedCompletion ? `- **Estimado de finalización:** ${new Date(this.status.timeline.estimatedCompletion).toLocaleDateString()}` : ''}

## 🎯 Milestones

${this.status.timeline.milestones.map(m => `- **${m.title}:** ${m.description} (${new Date(m.timestamp).toLocaleDateString()})`).join('\n')}

## 🔄 Historial de Migraciones

${this.status.migrations.map(m => `- **${m.file}:** ${m.action} (${new Date(m.timestamp).toLocaleDateString()})`).join('\n')}

---

**🔄 Generado automáticamente el ${new Date().toLocaleDateString()}**
`;

    fs.writeFileSync(reportPath, report);
    console.log(`📄 Reporte guardado en: ${reportPath}`);
  }
}

// Función principal
function main() {
  const tracker = new MigrationTracker();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'dashboard':
      tracker.displayDashboard();
      break;
    case 'track':
      const file = process.argv[3];
      const action = process.argv[4];
      if (file && action) {
        tracker.trackMigration(file, action);
      } else {
        console.error('❌ Uso: node migration-tracker.js track <file> <action>');
      }
      break;
    case 'milestone':
      const title = process.argv[3];
      const description = process.argv[4];
      if (title && description) {
        tracker.addMilestone({ title, description });
      } else {
        console.error('❌ Uso: node migration-tracker.js milestone <title> <description>');
      }
      break;
    case 'estimate':
      const completion = tracker.estimateCompletion();
      if (completion) {
        console.log(`📅 Estimado de finalización: ${completion.toLocaleDateString()}`);
      } else {
        console.log('❓ No hay suficientes datos para estimar');
      }
      break;
    case 'report':
      tracker.generateReport();
      break;
    default:
      console.log('📋 Comandos disponibles:');
      console.log('  dashboard - Mostrar dashboard');
      console.log('  track <file> <action> - Trackear migración');
      console.log('  milestone <title> <description> - Agregar milestone');
      console.log('  estimate - Calcular estimado de finalización');
      console.log('  report - Generar reporte');
      break;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { MigrationTracker }; 