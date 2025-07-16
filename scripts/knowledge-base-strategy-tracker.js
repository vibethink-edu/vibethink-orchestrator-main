#!/usr/bin/env node

/**
 * Knowledge Base Strategy Tracker
 * Script para seguimiento automatizado de la implementación del modelo híbrido
 * ADR-005: Estrategia de Bases de Conocimiento vs Agentes Personales
 * 
 * @author Marcelo Escallón
 * @date 2024-12-19
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del proyecto
const PROJECT_ROOT = path.join(__dirname, '..');
const TRACKING_FILE = path.join(PROJECT_ROOT, 'docs/knowledge-base-implementation-tracking.json');

// Fases de implementación según ADR-005
const IMPLEMENTATION_PHASES = {
  phase1: {
    name: 'Mantener Enfoque Actual',
    duration: 'Meses 1-2',
    focus: 'Agentes personales como interfaz principal',
    activities: [
      'Continuar desarrollo de agentes especializados',
      'Mejorar experiencia personalizada',
      'Optimizar respuestas y eficiencia',
      'Recopilar métricas de satisfacción'
    ],
    successCriteria: 'Mantener satisfacción >4.7/5 y adopción >90%'
  },
  phase2: {
    name: 'Desarrollar Base de Conocimiento Inteligente',
    duration: 'Meses 3-4',
    focus: 'Base de conocimiento como respaldo inteligente',
    activities: [
      'Desarrollar sistema de generación automática de contenido',
      'Implementar categorización inteligente por sector',
      'Crear integración transparente con agentes',
      'Diseñar sistema de auditoría y transparencia'
    ],
    successCriteria: 'KB funcional con integración transparente'
  },
  phase3: {
    name: 'Integración y Optimización',
    duration: 'Meses 5-6',
    focus: 'Ecosistema híbrido completo',
    activities: [
      'Integrar KB con agentes de forma transparente',
      'Optimizar decisiones de cuándo usar cada interfaz',
      'Implementar aprendizaje colectivo',
      'Validar con clientes piloto'
    ],
    successCriteria: 'Experiencia híbrida superior validada'
  }
};

// Métricas objetivo según ADR-005
const TARGET_METRICS = {
  experience: {
    satisfaction: { target: 4.8, current: null, unit: '/5' },
    efficiency: { target: 2, current: null, unit: 'minutos' },
    adoption: { target: 95, current: null, unit: '%' },
    transparency: { target: 90, current: null, unit: '%' }
  },
  business: {
    roi: { target: 350, current: null, unit: '%' },
    retention: { target: 95, current: null, unit: '%' },
    expansion: { target: 200, current: null, unit: '%' }
  },
  technical: {
    accuracy: { target: 95, current: null, unit: '%' },
    coverage: { target: 100, current: null, unit: '%' },
    scalability: { target: 1000000, current: null, unit: 'empresas' }
  }
};

class KnowledgeBaseStrategyTracker {
  constructor() {
    this.trackingData = this.loadTrackingData();
  }

  loadTrackingData() {
    try {
      if (fs.existsSync(TRACKING_FILE)) {
        const data = fs.readFileSync(TRACKING_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('⚠️  No se pudo cargar archivo de tracking existente:', error.message);
    }

    // Datos iniciales
    return {
      adrId: 'ADR-005',
      title: 'Estrategia de Bases de Conocimiento vs Agentes Personales',
      decision: 'Modelo Híbrido (Agentes Personales + Base de Conocimiento Inteligente)',
      startDate: '2024-12-19',
      lastUpdate: new Date().toISOString(),
      currentPhase: 'phase1',
      phases: IMPLEMENTATION_PHASES,
      metrics: TARGET_METRICS,
      progress: {
        phase1: { status: 'not_started', completion: 0, notes: [] },
        phase2: { status: 'not_started', completion: 0, notes: [] },
        phase3: { status: 'not_started', completion: 0, notes: [] }
      },
      milestones: [],
      risks: [],
      nextActions: []
    };
  }

  saveTrackingData() {
    try {
      this.trackingData.lastUpdate = new Date().toISOString();
      fs.writeFileSync(TRACKING_FILE, JSON.stringify(this.trackingData, null, 2));
      console.log('✅ Datos de tracking guardados exitosamente');
    } catch (error) {
      console.error('❌ Error al guardar datos de tracking:', error.message);
    }
  }

  updatePhaseProgress(phase, completion, status, notes = []) {
    if (!this.trackingData.progress[phase]) {
      console.error(`❌ Fase ${phase} no encontrada`);
      return;
    }

    this.trackingData.progress[phase] = {
      status,
      completion: Math.max(0, Math.min(100, completion)),
      notes: Array.isArray(notes) ? notes : [notes]
    };

    // Actualizar fase actual si es necesario
    if (status === 'completed' && phase === this.trackingData.currentPhase) {
      const phases = Object.keys(IMPLEMENTATION_PHASES);
      const currentIndex = phases.indexOf(phase);
      if (currentIndex < phases.length - 1) {
        this.trackingData.currentPhase = phases[currentIndex + 1];
      }
    }

    this.saveTrackingData();
    console.log(`✅ Progreso de ${phase} actualizado: ${completion}% - ${status}`);
  }

  updateMetric(category, metric, value) {
    if (!this.trackingData.metrics[category] || !this.trackingData.metrics[category][metric]) {
      console.error(`❌ Métrica ${category}.${metric} no encontrada`);
      return;
    }

    this.trackingData.metrics[category][metric].current = value;
    this.saveTrackingData();
    console.log(`✅ Métrica ${category}.${metric} actualizada: ${value}`);
  }

  addMilestone(description, date, milestoneStatus = 'pending') {
    this.trackingData.milestones.push({
      id: Date.now(),
      description,
      date,
      status: milestoneStatus,
      createdAt: new Date().toISOString()
    });
    this.saveTrackingData();
    console.log(`✅ Milestone agregado: ${description}`);
  }

  addRisk(description, probability = 'medium', impact = 'medium', mitigation = '') {
    this.trackingData.risks.push({
      id: Date.now(),
      description,
      probability,
      impact,
      mitigation,
      status: 'active',
      createdAt: new Date().toISOString()
    });
    this.saveTrackingData();
    console.log(`⚠️  Riesgo agregado: ${description}`);
  }

  addNextAction(description, assignee = '', dueDate = '', priority = 'medium') {
    this.trackingData.nextActions.push({
      id: Date.now(),
      description,
      assignee,
      dueDate,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    this.saveTrackingData();
    console.log(`📋 Acción agregada: ${description}`);
  }

  generateReport() {
    const report = {
      summary: this.generateSummary(),
      phases: this.generatePhasesReport(),
      metrics: this.generateMetricsReport(),
      milestones: this.generateMilestonesReport(),
      risks: this.generateRisksReport(),
      nextActions: this.generateNextActionsReport()
    };

    return report;
  }

  generateSummary() {
    const totalPhases = Object.keys(IMPLEMENTATION_PHASES).length;
    const completedPhases = Object.values(this.trackingData.progress)
      .filter(p => p.status === 'completed').length;
    const overallProgress = Math.round((completedPhases / totalPhases) * 100);

    const currentPhase = IMPLEMENTATION_PHASES[this.trackingData.currentPhase];
    const phaseProgress = this.trackingData.progress[this.trackingData.currentPhase];

    return {
      overallProgress: `${overallProgress}%`,
      currentPhase: currentPhase.name,
      phaseProgress: `${phaseProgress.completion}%`,
      daysSinceStart: Math.floor((new Date() - new Date(this.trackingData.startDate)) / (1000 * 60 * 60 * 24)),
      status: this.getOverallStatus()
    };
  }

  generatePhasesReport() {
    return Object.entries(this.trackingData.progress).map(([phase, progress]) => {
      const phaseInfo = IMPLEMENTATION_PHASES[phase];
      return {
        phase: phaseInfo.name,
        duration: phaseInfo.duration,
        status: progress.status,
        completion: `${progress.completion}%`,
        focus: phaseInfo.focus,
        activities: phaseInfo.activities,
        notes: progress.notes
      };
    });
  }

  generateMetricsReport() {
    const report = {};
    
    Object.entries(this.trackingData.metrics).forEach(([category, metrics]) => {
      report[category] = {};
      Object.entries(metrics).forEach(([metric, data]) => {
        const status = data.current === null ? 'not_measured' : 
                      data.current >= data.target ? 'on_target' : 'below_target';
        report[category][metric] = {
          current: data.current,
          target: data.target,
          unit: data.unit,
          status,
          gap: data.current !== null ? data.target - data.current : null
        };
      });
    });

    return report;
  }

  generateMilestonesReport() {
    return this.trackingData.milestones
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(milestone => ({
        description: milestone.description,
        date: milestone.date,
        status: milestone.status,
        daysUntil: Math.ceil((new Date(milestone.date) - new Date()) / (1000 * 60 * 60 * 24))
      }));
  }

  generateRisksReport() {
    return this.trackingData.risks
      .filter(risk => risk.status === 'active')
      .map(risk => ({
        description: risk.description,
        probability: risk.probability,
        impact: risk.impact,
        mitigation: risk.mitigation
      }));
  }

  generateNextActionsReport() {
    return this.trackingData.nextActions
      .filter(action => action.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(action => ({
        description: action.description,
        assignee: action.assignee,
        dueDate: action.dueDate,
        priority: action.priority,
        daysUntilDue: action.dueDate ? 
          Math.ceil((new Date(action.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
      }));
  }

  getOverallStatus() {
    const completedPhases = Object.values(this.trackingData.progress)
      .filter(p => p.status === 'completed').length;
    const totalPhases = Object.keys(IMPLEMENTATION_PHASES).length;
    
    if (completedPhases === totalPhases) return 'completed';
    if (completedPhases > 0) return 'in_progress';
    return 'not_started';
  }

  printReport() {
    const report = this.generateReport();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 REPORTE DE SEGUIMIENTO - ADR-005: ESTRATEGIA DE BASES DE CONOCIMIENTO');
    console.log('='.repeat(80));
    
    // Resumen
    console.log('\n📋 RESUMEN EJECUTIVO');
    console.log('-'.repeat(40));
    console.log(`Progreso General: ${report.summary.overallProgress}`);
    console.log(`Fase Actual: ${report.summary.currentPhase} (${report.summary.phaseProgress})`);
    console.log(`Días desde inicio: ${report.summary.daysSinceStart}`);
    console.log(`Estado: ${report.summary.status}`);
    
    // Fases
    console.log('\n🚀 FASES DE IMPLEMENTACIÓN');
    console.log('-'.repeat(40));
    report.phases.forEach(phase => {
      console.log(`\n${phase.phase} (${phase.duration})`);
      console.log(`  Estado: ${phase.status} - ${phase.completion}`);
      console.log(`  Enfoque: ${phase.focus}`);
      if (phase.notes.length > 0) {
        console.log(`  Notas: ${phase.notes.join(', ')}`);
      }
    });
    
    // Métricas
    console.log('\n📈 MÉTRICAS DE ÉXITO');
    console.log('-'.repeat(40));
    Object.entries(report.metrics).forEach(([category, metrics]) => {
      console.log(`\n${category.toUpperCase()}:`);
      Object.entries(metrics).forEach(([metric, data]) => {
        const current = data.current !== null ? data.current : 'N/A';
        const status = data.status === 'on_target' ? '✅' : 
                      data.status === 'below_target' ? '⚠️' : '❓';
        console.log(`  ${status} ${metric}: ${current}${data.unit} (objetivo: ${data.target}${data.unit})`);
      });
    });
    
    // Milestones
    if (report.milestones.length > 0) {
      console.log('\n🎯 MILESTONES');
      console.log('-'.repeat(40));
      report.milestones.forEach(milestone => {
        const daysUntil = milestone.daysUntil > 0 ? `en ${milestone.daysUntil} días` : 
                         milestone.daysUntil < 0 ? `hace ${Math.abs(milestone.daysUntil)} días` : 'hoy';
        const status = milestone.status === 'completed' ? '✅' : 
                      milestone.daysUntil < 0 ? '⚠️' : '⏳';
        console.log(`${status} ${milestone.description} - ${milestone.date} (${daysUntil})`);
      });
    }
    
    // Riesgos
    if (report.risks.length > 0) {
      console.log('\n⚠️ RIESGOS ACTIVOS');
      console.log('-'.repeat(40));
      report.risks.forEach(risk => {
        console.log(`• ${risk.description} (${risk.probability}/${risk.impact})`);
        if (risk.mitigation) {
          console.log(`  Mitigación: ${risk.mitigation}`);
        }
      });
    }
    
    // Próximas acciones
    if (report.nextActions.length > 0) {
      console.log('\n📋 PRÓXIMAS ACCIONES');
      console.log('-'.repeat(40));
      report.nextActions.forEach(action => {
        const priority = action.priority === 'high' ? '🔴' : 
                        action.priority === 'medium' ? '🟡' : '🟢';
        const dueInfo = action.daysUntilDue !== null ? 
                       (action.daysUntilDue > 0 ? `en ${action.daysUntilDue} días` : 
                        action.daysUntilDue < 0 ? `atrasado ${Math.abs(action.daysUntilDue)} días` : 'hoy') : '';
        console.log(`${priority} ${action.description} ${action.assignee ? `(${action.assignee})` : ''} ${dueInfo}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
  }

  // Métodos de utilidad para actualizaciones rápidas
  markPhaseComplete(phase) {
    this.updatePhaseProgress(phase, 100, 'completed', 'Fase completada exitosamente');
  }

  markPhaseInProgress(phase, completion = 50) {
    this.updatePhaseProgress(phase, completion, 'in_progress', 'Trabajo en progreso');
  }

  markPhaseBlocked(phase, reason) {
    this.updatePhaseProgress(phase, 0, 'blocked', `Bloqueado: ${reason}`);
  }
}

// Función principal
function main() {
  const tracker = new KnowledgeBaseStrategyTracker();
  
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  switch (command) {
    case 'report':
      tracker.printReport();
      break;
      
    case 'update-phase':
      if (args.length < 3) {
        console.log('Uso: node knowledge-base-strategy-tracker.js update-phase <phase> <completion> <status> [notes...]');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js update-phase phase1 75 in_progress "Desarrollo en progreso"');
        return;
      }
      const [phase, completion, status, ...notes] = args;
      tracker.updatePhaseProgress(phase, parseInt(completion), status, notes);
      break;
      
    case 'update-metric':
      if (args.length < 4) {
        console.log('Uso: node knowledge-base-strategy-tracker.js update-metric <category> <metric> <value>');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js update-metric experience satisfaction 4.5');
        return;
      }
      const [category, metric, value] = args;
      tracker.updateMetric(category, metric, parseFloat(value));
      break;
      
    case 'add-milestone':
      if (args.length < 2) {
        console.log('Uso: node knowledge-base-strategy-tracker.js add-milestone <description> <date> [status]');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js add-milestone "POC completado" 2025-01-15');
        return;
      }
      const [description, date, milestoneStatus = 'pending'] = args;
      tracker.addMilestone(description, date, milestoneStatus);
      break;
      
    case 'add-risk':
      if (args.length < 1) {
        console.log('Uso: node knowledge-base-strategy-tracker.js add-risk <description> [probability] [impact] [mitigation]');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js add-risk "Retraso en desarrollo" high medium "Añadir recursos"');
        return;
      }
      const [riskDesc, probability = 'medium', impact = 'medium', mitigation = ''] = args;
      tracker.addRisk(riskDesc, probability, impact, mitigation);
      break;
      
    case 'add-action':
      if (args.length < 1) {
        console.log('Uso: node knowledge-base-strategy-tracker.js add-action <description> [assignee] [dueDate] [priority]');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js add-action "Implementar POC" "Marcelo" 2025-01-20 high');
        return;
      }
      const [actionDesc, assignee = '', dueDate = '', priority = 'medium'] = args;
      tracker.addNextAction(actionDesc, assignee, dueDate, priority);
      break;
      
    case 'complete-phase':
      if (args.length < 1) {
        console.log('Uso: node knowledge-base-strategy-tracker.js complete-phase <phase>');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js complete-phase phase1');
        return;
      }
      tracker.markPhaseComplete(args[0]);
      break;
      
    case 'start-phase':
      if (args.length < 1) {
        console.log('Uso: node knowledge-base-strategy-tracker.js start-phase <phase>');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js start-phase phase2');
        return;
      }
      tracker.markPhaseInProgress(args[0]);
      break;
      
    case 'block-phase':
      if (args.length < 2) {
        console.log('Uso: node knowledge-base-strategy-tracker.js block-phase <phase> <reason>');
        console.log('Ejemplo: node knowledge-base-strategy-tracker.js block-phase phase1 "Esperando aprobación"');
        return;
      }
      const [blockPhase, reason] = args;
      tracker.markPhaseBlocked(blockPhase, reason);
      break;
      
    default:
      console.log('📊 Knowledge Base Strategy Tracker - ADR-005');
      console.log('\nComandos disponibles:');
      console.log('  report                    - Generar reporte completo');
      console.log('  update-phase <phase> <completion> <status> [notes...] - Actualizar progreso de fase');
      console.log('  update-metric <category> <metric> <value> - Actualizar métrica');
      console.log('  add-milestone <description> <date> [status] - Agregar milestone');
      console.log('  add-risk <description> [probability] [impact] [mitigation] - Agregar riesgo');
      console.log('  add-action <description> [assignee] [dueDate] [priority] - Agregar acción');
      console.log('  complete-phase <phase> - Marcar fase como completada');
      console.log('  start-phase <phase> - Marcar fase como en progreso');
      console.log('  block-phase <phase> <reason> - Bloquear fase');
      console.log('\nEjemplos:');
      console.log('  node knowledge-base-strategy-tracker.js report');
      console.log('  node knowledge-base-strategy-tracker.js update-phase phase1 75 in_progress "Desarrollo en progreso"');
      console.log('  node knowledge-base-strategy-tracker.js update-metric experience satisfaction 4.5');
      console.log('  node knowledge-base-strategy-tracker.js add-milestone "POC completado" 2025-01-15');
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default KnowledgeBaseStrategyTracker; 