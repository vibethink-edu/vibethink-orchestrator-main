#!/usr/bin/env node

/**
 * VTK 1.0 - Generador de Reportes de Pendientes
 * 
 * Genera reportes automáticos de pendientes VTK 1.0 en múltiples formatos
 * Incluye dashboards, métricas y análisis de progreso
 * 
 * @author VTK Framework v1.0
 * @version 1.0.0
 * @license MIT
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

class VTKReportGenerator {
  constructor() {
    this.rootPath = process.cwd();
    this.pendientesFile = path.join(this.rootPath, 'docs', 'vtk-pendientes.yaml');
    this.reportsDir = path.join(this.rootPath, 'reports');
    this.pendientes = null;
  }

  /**
   * Generar todos los reportes
   */
  async generateAllReports() {
    // TODO: log '📊 VTK 1.0 - Generador de Reportes'
    // TODO: log '==================================\n'

    try {
      // Cargar pendientes
      await this.loadPendientes();
      
      // Crear directorio de reportes
      if (!fs.existsSync(this.reportsDir)) {
        fs.mkdirSync(this.reportsDir, { recursive: true });
      }

      // Generar reportes
      await this.generateMarkdownReport();
      await this.generateJSONReport();
      await this.generateHTMLReport();
      await this.generateExecutiveSummary();
      
      // TODO: log '✅ Todos los reportes generados exitosamente'
      
    } catch (error) {
      // TODO: log '❌ Error generando reportes:' error.message
      process.exit(1);
    }
  }

  /**
   * Cargar archivo de pendientes
   */
  async loadPendientes() {
    if (!fs.existsSync(this.pendientesFile)) {
      throw new Error(`Archivo de pendientes no encontrado: ${this.pendientesFile}`);
    }

    const content = fs.readFileSync(this.pendientesFile, 'utf8');
    this.pendientes = yaml.load(content);
    
    // TODO: log '✅ Pendientes cargados correctamente'
  }

  /**
   * Generar reporte en Markdown
   */
  async generateMarkdownReport() {
    const reportPath = path.join(this.reportsDir, 'vtk-pendientes-report.md');
    const stats = this.calculateStats();
    const criticalDeadlines = this.getCriticalDeadlines();
    
    let markdown = `# VTK 1.0 - Reporte de Pendientes
*Generado automáticamente el ${new Date().toLocaleDateString('es-ES')}*

## 📊 Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Total Pendientes | ${stats.total} |
| Críticos | ${stats.criticos} |
| Altos | ${stats.altos} |
| Medios | ${stats.medios} |
| Bajos | ${stats.bajos} |
| En Progreso | ${stats.enProgreso} |
| Completados | ${stats.completados} |
| Bloqueados | ${stats.bloqueados} |

## 🚨 Pendientes Críticos

${this.generateCriticalSection()}

## 🚀 Pendientes en Progreso

${this.generateInProgressSection()}

## 📋 Pendientes por Prioridad

### Críticos (${stats.criticos})
${this.generatePrioritySection('critica')}

### Altos (${stats.altos})
${this.generatePrioritySection('alta')}

### Medios (${stats.medios})
${this.generatePrioritySection('media')}

### Bajos (${stats.bajos})
${this.generatePrioritySection('baja')}

## 📅 Próximos Deadlines

${this.generateDeadlinesSection()}

## 👥 Responsables

${this.generateResponsiblesSection()}

## 🏷️ Por Etiquetas

${this.generateTagsSection()}

## 📈 Métricas de Progreso

- **Progreso General**: ${this.calculateProgress()}%
- **Pendientes Críticos Completados**: ${this.calculateCriticalProgress()}%
- **Cumplimiento de Deadlines**: ${this.calculateDeadlineCompliance()}%

---
*Reporte generado automáticamente por VTK 1.0*
`;

    fs.writeFileSync(reportPath, markdown);
    // TODO: log '📄 Reporte Markdown generado'
  }

  /**
   * Generar reporte en JSON
   */
  async generateJSONReport() {
    const reportPath = path.join(this.reportsDir, 'vtk-pendientes-report.json');
    const stats = this.calculateStats();
    
    const report = {
      metadata: {
        version: '1.0.0',
        metodologia: 'VTK',
        fecha_generacion: new Date().toISOString(),
        total_pendientes: stats.total
      },
      estadisticas: stats,
      pendientes: this.pendientes.pendientes.map(p => ({
        id: p.id,
        titulo: p.titulo,
        descripcion: p.descripcion,
        responsable: p.responsable,
        prioridad: p.prioridad,
        estado: p.estado,
        fecha_creacion: p.fecha_creacion,
        fecha_limite: p.fecha_limite,
        etiquetas: p.etiquetas,
        esfuerzo_estimado: p.esfuerzo_estimado,
        dependencias: p.dependencias || []
      })),
      metricas: {
        progreso_general: this.calculateProgress(),
        progreso_criticos: this.calculateCriticalProgress(),
        cumplimiento_deadlines: this.calculateDeadlineCompliance(),
        proximos_deadlines: this.getCriticalDeadlines().map(p => ({
          id: p.id,
          titulo: p.titulo,
          fecha_limite: p.fecha_limite,
          dias_restantes: Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24))
        }))
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    // TODO: log '📄 Reporte JSON generado'
  }

  /**
   * Generar reporte en HTML
   */
  async generateHTMLReport() {
    const reportPath = path.join(this.reportsDir, 'vtk-pendientes-report.html');
    const stats = this.calculateStats();
    
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VTK 1.0 - Reporte de Pendientes</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .stat-label { color: #7f8c8d; margin-top: 5px; }
        .critical { border-left: 5px solid #e74c3c; }
        .high { border-left: 5px solid #f39c12; }
        .medium { border-left: 5px solid #f1c40f; }
        .low { border-left: 5px solid #27ae60; }
        .pendiente-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .pendiente-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .pendiente-id { font-weight: bold; color: #3498db; }
        .pendiente-priority { padding: 3px 8px; border-radius: 3px; color: white; font-size: 0.8em; }
        .priority-critica { background: #e74c3c; }
        .priority-alta { background: #f39c12; }
        .priority-media { background: #f1c40f; }
        .priority-baja { background: #27ae60; }
        .progress-bar { width: 100%; height: 20px; background: #ecf0f1; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #3498db, #2ecc71); transition: width 0.3s ease; }
        .deadline-warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 VTK 1.0 - Reporte de Pendientes</h1>
        <p><em>Generado automáticamente el ${new Date().toLocaleDateString('es-ES')}</em></p>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Pendientes</div>
            </div>
            <div class="stat-card critical">
                <div class="stat-number">${stats.criticos}</div>
                <div class="stat-label">Críticos</div>
            </div>
            <div class="stat-card high">
                <div class="stat-number">${stats.altos}</div>
                <div class="stat-label">Altos</div>
            </div>
            <div class="stat-card medium">
                <div class="stat-number">${stats.medios}</div>
                <div class="stat-label">Medios</div>
            </div>
            <div class="stat-card low">
                <div class="stat-number">${stats.bajos}</div>
                <div class="stat-label">Bajos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.enProgreso}</div>
                <div class="stat-label">En Progreso</div>
            </div>
        </div>

        <div class="progress-bar">
            <div class="progress-fill" style="width: ${this.calculateProgress()}%"></div>
        </div>
        <p><strong>Progreso General: ${this.calculateProgress()}%</strong></p>

        <h2>🚨 Pendientes Críticos</h2>
        ${this.generateCriticalHTML()}

        <h2>📅 Próximos Deadlines</h2>
        ${this.generateDeadlinesHTML()}

        <h2>👥 Por Responsable</h2>
        ${this.generateResponsiblesHTML()}

        <h2>📋 Todos los Pendientes</h2>
        ${this.generateAllPendientesHTML()}
    </div>
</body>
</html>`;

    fs.writeFileSync(reportPath, html);
    // TODO: log '📄 Reporte HTML generado'
  }

  /**
   * Generar resumen ejecutivo
   */
  async generateExecutiveSummary() {
    const reportPath = path.join(this.reportsDir, 'vtk-executive-summary.md');
    const stats = this.calculateStats();
    const criticalDeadlines = this.getCriticalDeadlines();
    
    let summary = `# VTK 1.0 - Resumen Ejecutivo
*${new Date().toLocaleDateString('es-ES')}*

## 🎯 Estado General

- **Total de Pendientes**: ${stats.total}
- **Progreso General**: ${this.calculateProgress()}%
- **Pendientes Críticos**: ${stats.criticos}
- **En Progreso**: ${stats.enProgreso}

## 🚨 Alertas Críticas

${criticalDeadlines.length > 0 ? 
  criticalDeadlines.map(p => `- **${p.id}**: ${p.titulo} (${Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24))} días)`).join('\n') :
  '- No hay deadlines críticos próximos'
}

## 📊 Distribución por Prioridad

- **Críticos**: ${stats.criticos} (${((stats.criticos/stats.total)*100).toFixed(1)}%)
- **Altos**: ${stats.altos} (${((stats.altos/stats.total)*100).toFixed(1)}%)
- **Medios**: ${stats.medios} (${((stats.medios/stats.total)*100).toFixed(1)}%)
- **Bajos**: ${stats.bajos} (${((stats.bajos/stats.total)*100).toFixed(1)}%)

## 🎯 Recomendaciones

${this.generateRecommendations()}

---
*Resumen generado automáticamente por VTK 1.0*
`;

    fs.writeFileSync(reportPath, summary);
    // TODO: log '📄 Resumen ejecutivo generado'
  }

  // Métodos auxiliares para generar secciones
  generateCriticalSection() {
    const criticals = this.pendientes.pendientes.filter(p => p.prioridad === 'critica');
    if (criticals.length === 0) return 'No hay pendientes críticos.';
    
    return criticals.map(p => {
      const days = p.fecha_limite ? Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24)) : 'Sin fecha';
      return `### ${p.id}: ${p.titulo}
- **Responsable**: ${p.responsable}
- **Estado**: ${p.estado}
- **Deadline**: ${p.fecha_limite || 'Sin fecha'} ${days !== 'Sin fecha' ? `(${days} días)` : ''}
- **Esfuerzo**: ${p.esfuerzo_estimado || 'No estimado'}`;
    }).join('\n\n');
  }

  generateInProgressSection() {
    const inProgress = this.pendientes.pendientes.filter(p => p.estado === 'en_progreso');
    if (inProgress.length === 0) return 'No hay pendientes en progreso.';
    
    return inProgress.map(p => {
      return `### ${p.id}: ${p.titulo}
- **Responsable**: ${p.responsable}
- **Prioridad**: ${p.prioridad}
- **Esfuerzo**: ${p.esfuerzo_estimado || 'No estimado'}`;
    }).join('\n\n');
  }

  generatePrioritySection(priority) {
    const items = this.pendientes.pendientes.filter(p => p.prioridad === priority);
    if (items.length === 0) return 'No hay pendientes en esta prioridad.';
    
    return items.map(p => {
      const days = p.fecha_limite ? Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24)) : 'Sin fecha';
      return `- **${p.id}**: ${p.titulo} (${p.responsable}) - ${p.estado} ${days !== 'Sin fecha' ? `- ${days} días` : ''}`;
    }).join('\n');
  }

  generateDeadlinesSection() {
    const withDeadlines = this.pendientes.pendientes.filter(p => p.fecha_limite).sort((a, b) => new Date(a.fecha_limite) - new Date(b.fecha_limite));
    if (withDeadlines.length === 0) return 'No hay deadlines definidos.';
    
    return withDeadlines.slice(0, 10).map(p => {
      const days = Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24));
      const status = days < 0 ? '❌ VENCIDO' : days <= 7 ? '🚨 CRÍTICO' : days <= 14 ? '⚠️ PRÓXIMO' : '✅ OK';
      return `- **${p.id}**: ${p.titulo} - ${p.fecha_limite} (${days} días) ${status}`;
    }).join('\n');
  }

  generateResponsiblesSection() {
    const responsibles = {};
    this.pendientes.pendientes.forEach(p => {
      if (!responsibles[p.responsable]) responsibles[p.responsable] = [];
      responsibles[p.responsable].push(p);
    });
    
    return Object.entries(responsibles).map(([responsible, items]) => {
      const critical = items.filter(p => p.prioridad === 'critica').length;
      const total = items.length;
      return `### ${responsible} (${total} pendientes, ${critical} críticos)
${items.map(p => `- ${p.id}: ${p.titulo} - ${p.estado}`).join('\n')}`;
    }).join('\n\n');
  }

  generateTagsSection() {
    const tags = {};
    this.pendientes.pendientes.forEach(p => {
      p.etiquetas.forEach(tag => {
        if (!tags[tag]) tags[tag] = [];
        tags[tag].push(p);
      });
    });
    
    return Object.entries(tags).map(([tag, items]) => {
      return `### ${tag} (${items.length} pendientes)
${items.map(p => `- ${p.id}: ${p.titulo}`).join('\n')}`;
    }).join('\n\n');
  }

  generateCriticalHTML() {
    const criticals = this.pendientes.pendientes.filter(p => p.prioridad === 'critica');
    if (criticals.length === 0) return '<p>No hay pendientes críticos.</p>';
    
    return criticals.map(p => {
      const days = p.fecha_limite ? Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24)) : 'Sin fecha';
      return `<div class="pendiente-item critical">
        <div class="pendiente-header">
            <span class="pendiente-id">${p.id}</span>
            <span class="pendiente-priority priority-critica">${p.prioridad}</span>
        </div>
        <h3>${p.titulo}</h3>
        <p><strong>Responsable:</strong> ${p.responsable} | <strong>Estado:</strong> ${p.estado}</p>
        <p><strong>Deadline:</strong> ${p.fecha_limite || 'Sin fecha'} ${days !== 'Sin fecha' ? `(${days} días)` : ''}</p>
    </div>`;
    }).join('');
  }

  generateDeadlinesHTML() {
    const withDeadlines = this.pendientes.pendientes.filter(p => p.fecha_limite).sort((a, b) => new Date(a.fecha_limite) - new Date(b.fecha_limite));
    if (withDeadlines.length === 0) return '<p>No hay deadlines definidos.</p>';
    
    return withDeadlines.slice(0, 10).map(p => {
      const days = Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24));
      const status = days < 0 ? '❌ VENCIDO' : days <= 7 ? '🚨 CRÍTICO' : days <= 14 ? '⚠️ PRÓXIMO' : '✅ OK';
      return `<div class="pendiente-item ${days <= 7 ? 'deadline-warning' : ''}">
        <div class="pendiente-header">
            <span class="pendiente-id">${p.id}</span>
            <span class="pendiente-priority priority-${p.prioridad}">${p.prioridad}</span>
        </div>
        <h3>${p.titulo}</h3>
        <p><strong>Deadline:</strong> ${p.fecha_limite} (${days} días) ${status}</p>
    </div>`;
    }).join('');
  }

  generateResponsiblesHTML() {
    const responsibles = {};
    this.pendientes.pendientes.forEach(p => {
      if (!responsibles[p.responsable]) responsibles[p.responsable] = [];
      responsibles[p.responsable].push(p);
    });
    
    return Object.entries(responsibles).map(([responsible, items]) => {
      const critical = items.filter(p => p.prioridad === 'critica').length;
      return `<h3>${responsible} (${items.length} pendientes, ${critical} críticos)</h3>
        ${items.map(p => `<div class="pendiente-item">
            <div class="pendiente-header">
                <span class="pendiente-id">${p.id}</span>
                <span class="pendiente-priority priority-${p.prioridad}">${p.prioridad}</span>
            </div>
            <h4>${p.titulo}</h4>
            <p><strong>Estado:</strong> ${p.estado}</p>
        </div>`).join('')}`;
    }).join('');
  }

  generateAllPendientesHTML() {
    return this.pendientes.pendientes.map(p => {
      const days = p.fecha_limite ? Math.ceil((new Date(p.fecha_limite) - new Date()) / (1000 * 60 * 60 * 24)) : 'Sin fecha';
      return `<div class="pendiente-item">
        <div class="pendiente-header">
            <span class="pendiente-id">${p.id}</span>
            <span class="pendiente-priority priority-${p.prioridad}">${p.prioridad}</span>
        </div>
        <h3>${p.titulo}</h3>
        <p><strong>Responsable:</strong> ${p.responsable} | <strong>Estado:</strong> ${p.estado}</p>
        <p><strong>Deadline:</strong> ${p.fecha_limite || 'Sin fecha'} ${days !== 'Sin fecha' ? `(${days} días)` : ''}</p>
        <p><strong>Etiquetas:</strong> ${p.etiquetas.join(', ')}</p>
    </div>`;
    }).join('');
  }

  generateRecommendations() {
    const stats = this.calculateStats();
    const recommendations = [];
    
    if (stats.criticos > 0) {
      recommendations.push('- **Priorizar pendientes críticos** antes de continuar con otros desarrollos');
    }
    
    if (stats.enProgreso < stats.total * 0.3) {
      recommendations.push('- **Aumentar velocidad de desarrollo** - solo el ' + ((stats.enProgreso/stats.total)*100).toFixed(1) + '% están en progreso');
    }
    
    const criticalDeadlines = this.getCriticalDeadlines();
    if (criticalDeadlines.length > 0) {
      recommendations.push('- **Revisar deadlines críticos** - ' + criticalDeadlines.length + ' pendientes con fechas próximas');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- **Mantener el ritmo actual** - el proyecto está bien balanceado');
    }
    
    return recommendations.join('\n');
  }

  // Métodos de cálculo
  calculateStats() {
    const stats = {
      total: this.pendientes.pendientes.length,
      criticos: 0,
      altos: 0,
      medios: 0,
      bajos: 0,
      enProgreso: 0,
      completados: 0,
      bloqueados: 0
    };

    this.pendientes.pendientes.forEach(pendiente => {
      switch (pendiente.prioridad) {
        case 'critica': stats.criticos++; break;
        case 'alta': stats.altos++; break;
        case 'media': stats.medios++; break;
        case 'baja': stats.bajos++; break;
      }

      switch (pendiente.estado) {
        case 'en_progreso': stats.enProgreso++; break;
        case 'completado': stats.completados++; break;
        case 'bloqueado': stats.bloqueados++; break;
      }
    });

    return stats;
  }

  calculateProgress() {
    const completados = this.pendientes.pendientes.filter(p => p.estado === 'completado').length;
    return Math.round((completados / this.pendientes.pendientes.length) * 100);
  }

  calculateCriticalProgress() {
    const criticos = this.pendientes.pendientes.filter(p => p.prioridad === 'critica');
    const criticosCompletados = criticos.filter(p => p.estado === 'completado').length;
    return criticos.length > 0 ? Math.round((criticosCompletados / criticos.length) * 100) : 100;
  }

  calculateDeadlineCompliance() {
    const withDeadlines = this.pendientes.pendientes.filter(p => p.fecha_limite);
    const onTime = withDeadlines.filter(p => {
      const deadline = new Date(p.fecha_limite);
      const today = new Date();
      return deadline >= today || p.estado === 'completado';
    }).length;
    return withDeadlines.length > 0 ? Math.round((onTime / withDeadlines.length) * 100) : 100;
  }

  getCriticalDeadlines() {
    const today = new Date();
    const criticalDeadlines = [];

    this.pendientes.pendientes.forEach(pendiente => {
      if (pendiente.fecha_limite && pendiente.prioridad === 'critica') {
        const deadline = new Date(pendiente.fecha_limite);
        const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDeadline <= 7 && daysUntilDeadline >= 0) {
          criticalDeadlines.push(pendiente);
        }
      }
    });

    return criticalDeadlines.sort((a, b) => new Date(a.fecha_limite) - new Date(b.fecha_limite));
  }
}

// Ejecutar generación de reportes
const generator = new VTKReportGenerator();
generator.generateAllReports(); 