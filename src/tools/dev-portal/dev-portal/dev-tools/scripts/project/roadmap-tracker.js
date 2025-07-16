#!/usr/bin/env node

/**
 * 🚀 Roadmap Tracker - AI Pair Orchestrator Pro
 * 
 * Script automatizado para el seguimiento y actualización del Roadmap Universal
 * Monitorea el progreso de las 6 fases y 48 sprints del proyecto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del roadmap
const ROADMAP_CONFIG = {
  totalPhases: 6,
  totalSprints: 48,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2025-06-30'),
  phases: [
    {
      id: 1,
      name: 'Fundación',
      duration: '3 meses',
      sprints: 12,
      companies: 8,
      regions: 1,
      targetClients: 50,
      targetROI: 250,
      team: 8,
      budget: 500000
    },
    {
      id: 2,
      name: 'Expansión Sectorial',
      duration: '3 meses',
      sprints: 12,
      companies: 16,
      regions: 1,
      targetClients: 200,
      targetROI: 280,
      team: 12,
      budget: 1000000
    },
    {
      id: 3,
      name: 'Escalabilidad Regional',
      duration: '3 meses',
      sprints: 12,
      companies: 16,
      regions: 4,
      targetClients: 500,
      targetROI: 300,
      team: 20,
      budget: 2000000
    },
    {
      id: 4,
      name: 'Sectores Especializados',
      duration: '3 meses',
      sprints: 12,
      companies: 24,
      regions: 4,
      targetClients: 1000,
      targetROI: 320,
      team: 25,
      budget: 3000000
    },
    {
      id: 5,
      name: 'Inteligencia Avanzada',
      duration: '3 meses',
      sprints: 12,
      companies: 24,
      regions: 4,
      targetClients: 2000,
      targetROI: 350,
      team: 30,
      budget: 4000000
    },
    {
      id: 6,
      name: 'Universalización',
      duration: '3 meses',
      sprints: 12,
      companies: 'Universal',
      regions: 'Global',
      targetClients: 1000000,
      targetROI: 400,
      team: 40,
      budget: 5000000
    }
  ]
};

// Tipos de empresa por fase
const COMPANY_TYPES = {
  phase1: [
    'Tecnología (SaaS/Software)',
    'Servicios Financieros',
    'Manufactura/Industrial',
    'Salud/Hospitales',
    'Retail/E-commerce',
    'Agencia de Marketing',
    'Agencia de Desarrollo de Software',
    'Agencia de Inteligencia Artificial'
  ],
  phase2: [
    'Despacho de Abogados',
    'Constructora (Edificios)',
    'Empresa del Estado Colombiano',
    'Restaurante (Múltiples Sedes)',
    'Sector Petróleo y Gas',
    'Bancos y Aseguradoras',
    'Hospitales y Clínicas',
    'Universidades'
  ],
  phase3: [
    'Latinoamérica (Colombia, México, Argentina, Brasil, Chile)',
    'Norteamérica (Estados Unidos, Canadá)',
    'Europa (España, Reino Unido, Alemania, Francia)',
    'Asia Pacífico (Singapur, Australia, Japón)'
  ],
  phase4: [
    'Sector Petróleo y Gas Avanzado',
    'Minería',
    'Automotriz',
    'Farmacéuticas',
    'Telecomunicaciones',
    'Energía',
    'Logística y Transporte',
    'Hotelería y Turismo'
  ],
  phase5: [
    'Machine Learning por Departamento',
    'Predicción de Necesidades',
    'Optimización Automática',
    'Toma de Decisiones Autónoma',
    'Innovación Continua',
    'Analytics Predictivos',
    'Automatización Completa',
    'Ecosistema de Agentes'
  ],
  phase6: [
    'Cualquier tipo de empresa',
    'Cualquier tamaño',
    'Cualquier región',
    'Cualquier industria',
    'Cualquier idioma',
    'Cualquier regulación',
    'Cualquier integración',
    'Cualquier necesidad'
  ]
};

class RoadmapTracker {
  constructor() {
    this.currentDate = new Date();
    this.progressFile = path.join(__dirname, '../docs/roadmap-progress.json');
    this.loadProgress();
  }

  /**
   * Carga el progreso actual del roadmap
   */
  loadProgress() {
    try {
      if (fs.existsSync(this.progressFile)) {
        this.progress = JSON.parse(fs.readFileSync(this.progressFile, 'utf8'));
      } else {
        this.progress = this.initializeProgress();
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      this.progress = this.initializeProgress();
    }
  }

  /**
   * Inicializa el progreso del roadmap
   */
  initializeProgress() {
    const progress = {
      currentPhase: 1,
      currentSprint: 1,
      startDate: ROADMAP_CONFIG.startDate.toISOString(),
      lastUpdate: new Date().toISOString(),
      phases: {},
      metrics: {
        totalClients: 0,
        averageROI: 0,
        teamSize: 0,
        totalBudget: 0,
        completion: 0
      }
    };

    // Inicializar progreso por fase
    ROADMAP_CONFIG.phases.forEach(phase => {
      progress.phases[`phase${phase.id}`] = {
        status: phase.id === 1 ? 'in-progress' : 'pending',
        startDate: null,
        endDate: null,
        completedSprints: 0,
        completedCompanies: 0,
        activeClients: 0,
        currentROI: 0,
        teamSize: 0,
        budgetSpent: 0,
        deliverables: [],
        metrics: {
          testingCoverage: 0,
          performance: 0,
          satisfaction: 0,
          adoption: 0
        }
      };
    });

    return progress;
  }

  /**
   * Calcula el progreso actual basado en la fecha
   */
  calculateProgress() {
    const totalDays = (ROADMAP_CONFIG.endDate - ROADMAP_CONFIG.startDate) / (1000 * 60 * 60 * 24);
    const elapsedDays = (this.currentDate - ROADMAP_CONFIG.startDate) / (1000 * 60 * 60 * 24);
    
    if (elapsedDays < 0) {
      return 0;
    }
    
    return Math.min((elapsedDays / totalDays) * 100, 100);
  }

  /**
   * Determina la fase y sprint actual
   */
  determineCurrentPhaseAndSprint() {
    const totalDuration = ROADMAP_CONFIG.endDate - ROADMAP_CONFIG.startDate;
    const elapsed = this.currentDate - ROADMAP_CONFIG.startDate;
    const progressPercentage = elapsed / totalDuration;

    let currentPhase = 1;
    let currentSprint = 1;
    let accumulatedSprints = 0;

    for (let i = 0; i < ROADMAP_CONFIG.phases.length; i++) {
      const phase = ROADMAP_CONFIG.phases[i];
      const phaseSprints = phase.sprints;
      
      if (accumulatedSprints + phaseSprints >= progressPercentage * ROADMAP_CONFIG.totalSprints) {
        currentPhase = i + 1;
        currentSprint = Math.floor((progressPercentage * ROADMAP_CONFIG.totalSprints) - accumulatedSprints) + 1;
        break;
      }
      
      accumulatedSprints += phaseSprints;
    }

    return { currentPhase, currentSprint };
  }

  /**
   * Actualiza el progreso del roadmap
   */
  updateProgress() {
    const { currentPhase, currentSprint } = this.determineCurrentPhaseAndSprint();
    const overallProgress = this.calculateProgress();

    this.progress.currentPhase = currentPhase;
    this.progress.currentSprint = currentSprint;
    this.progress.lastUpdate = new Date().toISOString();
    this.progress.metrics.completion = overallProgress;

    // Actualizar métricas globales
    this.updateGlobalMetrics();

    // Guardar progreso
    this.saveProgress();

    return {
      currentPhase,
      currentSprint,
      overallProgress
    };
  }

  /**
   * Actualiza las métricas globales
   */
  updateGlobalMetrics() {
    let totalClients = 0;
    let totalROI = 0;
    let totalTeam = 0;
    let totalBudget = 0;
    let completedPhases = 0;

    Object.keys(this.progress.phases).forEach(phaseKey => {
      const phase = this.progress.phases[phaseKey];
      if (phase.status === 'completed') {
        totalClients += phase.activeClients;
        totalROI += phase.currentROI;
        totalTeam += phase.teamSize;
        totalBudget += phase.budgetSpent;
        completedPhases++;
      } else if (phase.status === 'in-progress') {
        totalClients += phase.activeClients;
        totalROI += phase.currentROI;
        totalTeam += phase.teamSize;
        totalBudget += phase.budgetSpent;
      }
    });

    this.progress.metrics.totalClients = totalClients;
    this.progress.metrics.averageROI = completedPhases > 0 ? totalROI / completedPhases : 0;
    this.progress.metrics.teamSize = totalTeam;
    this.progress.metrics.totalBudget = totalBudget;
  }

  /**
   * Guarda el progreso en archivo
   */
  saveProgress() {
    try {
      fs.writeFileSync(this.progressFile, JSON.stringify(this.progress, null, 2));
      console.log('✅ Progreso del roadmap actualizado');
    } catch (error) {
      console.error('❌ Error guardando progreso:', error);
    }
  }

  /**
   * Genera reporte de progreso
   */
  generateReport() {
    const { currentPhase, currentSprint, overallProgress } = this.updateProgress();
    const currentPhaseData = ROADMAP_CONFIG.phases[currentPhase - 1];
    const phaseProgress = this.progress.phases[`phase${currentPhase}`];

    console.log('\n🚀 ROADMAP TRACKER - AI Pair Orchestrator Pro');
    console.log('=' .repeat(60));
    
    console.log(`\n📅 Fecha Actual: ${this.currentDate.toLocaleDateString()}`);
    console.log(`📊 Progreso General: ${overallProgress.toFixed(1)}%`);
    console.log(`🎯 Fase Actual: ${currentPhase} - ${currentPhaseData.name}`);
    console.log(`⚡ Sprint Actual: ${currentSprint}/${currentPhaseData.sprints}`);
    
    console.log('\n📈 MÉTRICAS GLOBALES:');
    console.log(`   👥 Clientes Totales: ${this.progress.metrics.totalClients}`);
    console.log(`   💰 ROI Promedio: ${this.progress.metrics.averageROI.toFixed(1)}%`);
    console.log(`   👨‍💼 Tamaño del Equipo: ${this.progress.metrics.teamSize} personas`);
    console.log(`   💵 Presupuesto Gastado: $${(this.progress.metrics.totalBudget / 1000000).toFixed(1)}M`);
    
    console.log('\n🎯 OBJETIVOS DE LA FASE ACTUAL:');
    console.log(`   🏢 Tipos de Empresa: ${currentPhaseData.companies}`);
    console.log(`   🌍 Regiones: ${currentPhaseData.regions}`);
    console.log(`   👥 Clientes Objetivo: ${currentPhaseData.targetClients}`);
    console.log(`   💰 ROI Objetivo: ${currentPhaseData.targetROI}%`);
    console.log(`   👨‍💼 Equipo Objetivo: ${currentPhaseData.team} personas`);
    console.log(`   💵 Presupuesto: $${(currentPhaseData.budget / 1000000).toFixed(1)}M`);

    if (phaseProgress) {
      console.log('\n📊 PROGRESO DE LA FASE ACTUAL:');
      console.log(`   ✅ Sprints Completados: ${phaseProgress.completedSprints}/${currentPhaseData.sprints}`);
      console.log(`   🏢 Empresas Implementadas: ${phaseProgress.completedCompanies}`);
      console.log(`   👥 Clientes Activos: ${phaseProgress.activeClients}`);
      console.log(`   💰 ROI Actual: ${phaseProgress.currentROI}%`);
      console.log(`   👨‍💼 Equipo Actual: ${phaseProgress.teamSize} personas`);
      console.log(`   💵 Presupuesto Gastado: $${(phaseProgress.budgetSpent / 1000000).toFixed(1)}M`);
    }

    console.log('\n📋 TIPOS DE EMPRESA DE LA FASE ACTUAL:');
    const companyTypes = COMPANY_TYPES[`phase${currentPhase}`];
    if (companyTypes) {
      companyTypes.forEach((type, index) => {
        console.log(`   ${index + 1}. ${type}`);
      });
    }

    console.log('\n⏰ PRÓXIMOS PASOS:');
    this.generateNextSteps(currentPhase, currentSprint);

    console.log('\n' + '=' .repeat(60));
  }

  /**
   * Genera los próximos pasos
   */
  generateNextSteps(phase, sprint) {
    const phaseData = ROADMAP_CONFIG.phases[phase - 1];
    
    if (sprint < phaseData.sprints) {
      console.log(`   🔄 Completar Sprint ${sprint + 1}/${phaseData.sprints}`);
    } else if (phase < ROADMAP_CONFIG.totalPhases) {
      console.log(`   🚀 Iniciar Fase ${phase + 1}: ${ROADMAP_CONFIG.phases[phase].name}`);
    } else {
      console.log(`   🎉 ¡Roadmap completado! Plataforma universal lista.`);
    }

    // Próximos hitos
    const nextMilestones = this.getNextMilestones(phase, sprint);
    nextMilestones.forEach(milestone => {
      console.log(`   📅 ${milestone.date}: ${milestone.description}`);
    });
  }

  /**
   * Obtiene los próximos hitos
   */
  getNextMilestones(phase, sprint) {
    const milestones = [];
    const currentDate = new Date();
    
    // Próximo sprint
    if (sprint < ROADMAP_CONFIG.phases[phase - 1].sprints) {
      const nextSprintDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 semanas
      milestones.push({
        date: nextSprintDate.toLocaleDateString(),
        description: `Sprint ${sprint + 1} completado`
      });
    }

    // Próxima fase
    if (phase < ROADMAP_CONFIG.totalPhases) {
      const phaseStartDate = new Date(ROADMAP_CONFIG.startDate.getTime() + (phase * 3 * 30 * 24 * 60 * 60 * 1000));
      if (phaseStartDate > currentDate) {
        milestones.push({
          date: phaseStartDate.toLocaleDateString(),
          description: `Inicio Fase ${phase + 1}: ${ROADMAP_CONFIG.phases[phase].name}`
        });
      }
    }

    return milestones;
  }

  /**
   * Actualiza métricas específicas de una fase
   */
  updatePhaseMetrics(phaseId, metrics) {
    const phaseKey = `phase${phaseId}`;
    if (this.progress.phases[phaseKey]) {
      Object.assign(this.progress.phases[phaseKey], metrics);
      this.progress.phases[phaseKey].lastUpdate = new Date().toISOString();
      this.saveProgress();
      console.log(`✅ Métricas de Fase ${phaseId} actualizadas`);
    } else {
      console.error(`❌ Fase ${phaseId} no encontrada`);
    }
  }

  /**
   * Marca una fase como completada
   */
  completePhase(phaseId) {
    const phaseKey = `phase${phaseId}`;
    if (this.progress.phases[phaseKey]) {
      this.progress.phases[phaseKey].status = 'completed';
      this.progress.phases[phaseKey].endDate = new Date().toISOString();
      
      // Iniciar siguiente fase
      if (phaseId < ROADMAP_CONFIG.totalPhases) {
        const neVTKhaseKey = `phase${phaseId + 1}`;
        if (this.progress.phases[neVTKhaseKey]) {
          this.progress.phases[neVTKhaseKey].status = 'in-progress';
          this.progress.phases[neVTKhaseKey].startDate = new Date().toISOString();
        }
      }
      
      this.saveProgress();
      console.log(`✅ Fase ${phaseId} marcada como completada`);
    } else {
      console.error(`❌ Fase ${phaseId} no encontrada`);
    }
  }

  /**
   * Exporta el progreso a diferentes formatos
   */
  exportProgress(format = 'json') {
    const exportPath = path.join(__dirname, '../docs/roadmap-export');
    
    switch (format.toLowerCase()) {
      case 'json':
        fs.writeFileSync(`${exportPath}.json`, JSON.stringify(this.progress, null, 2));
        break;
      case 'csv':
        const csv = this.generateCSV();
        fs.writeFileSync(`${exportPath}.csv`, csv);
        break;
      case 'markdown':
        const markdown = this.generateMarkdown();
        fs.writeFileSync(`${exportPath}.md`, markdown);
        break;
      default:
        console.error('❌ Formato no soportado');
        return;
    }
    
    console.log(`✅ Progreso exportado a ${exportPath}.${format}`);
  }

  /**
   * Genera CSV del progreso
   */
  generateCSV() {
    let csv = 'Phase,Status,StartDate,EndDate,CompletedSprints,ActiveClients,CurrentROI,TeamSize,BudgetSpent\n';
    
    Object.keys(this.progress.phases).forEach(phaseKey => {
      const phase = this.progress.phases[phaseKey];
      csv += `${phaseKey},${phase.status},${phase.startDate || ''},${phase.endDate || ''},${phase.completedSprints},${phase.activeClients},${phase.currentROI},${phase.teamSize},${phase.budgetSpent}\n`;
    });
    
    return csv;
  }

  /**
   * Genera Markdown del progreso
   */
  generateMarkdown() {
    let markdown = '# 🚀 Roadmap Progress Report\n\n';
    markdown += `**Fecha de Generación:** ${new Date().toLocaleDateString()}\n\n`;
    
    markdown += '## 📊 Progreso General\n\n';
    markdown += `- **Progreso Total:** ${this.progress.metrics.completion.toFixed(1)}%\n`;
    markdown += `- **Fase Actual:** ${this.progress.currentPhase}\n`;
    markdown += `- **Sprint Actual:** ${this.progress.currentSprint}\n\n`;
    
    markdown += '## 📈 Métricas Globales\n\n';
    markdown += `- **Clientes Totales:** ${this.progress.metrics.totalClients}\n`;
    markdown += `- **ROI Promedio:** ${this.progress.metrics.averageROI.toFixed(1)}%\n`;
    markdown += `- **Tamaño del Equipo:** ${this.progress.metrics.teamSize} personas\n`;
    markdown += `- **Presupuesto Gastado:** $${(this.progress.metrics.totalBudget / 1000000).toFixed(1)}M\n\n`;
    
    markdown += '## 🎯 Progreso por Fase\n\n';
    
    Object.keys(this.progress.phases).forEach(phaseKey => {
      const phase = this.progress.phases[phaseKey];
      const phaseNumber = phaseKey.replace('phase', '');
      const phaseData = ROADMAP_CONFIG.phases[parseInt(phaseNumber) - 1];
      
      markdown += `### Fase ${phaseNumber}: ${phaseData.name}\n\n`;
      markdown += `- **Estado:** ${phase.status}\n`;
      markdown += `- **Sprints Completados:** ${phase.completedSprints}/${phaseData.sprints}\n`;
      markdown += `- **Clientes Activos:** ${phase.activeClients}/${phaseData.targetClients}\n`;
      markdown += `- **ROI Actual:** ${phase.currentROI}% (Objetivo: ${phaseData.targetROI}%)\n`;
      markdown += `- **Equipo:** ${phase.teamSize}/${phaseData.team} personas\n`;
      markdown += `- **Presupuesto:** $${(phase.budgetSpent / 1000000).toFixed(1)}M/${(phaseData.budget / 1000000).toFixed(1)}M\n\n`;
    });
    
    return markdown;
  }
}

// Función principal
function main() {
  const tracker = new RoadmapTracker();
  
  // Obtener argumentos de línea de comandos
  const args = process.argv.slice(2);
  const command = args[0] || 'report';
  
  switch (command) {
    case 'report':
      tracker.generateReport();
      break;
    case 'update':
      tracker.updateProgress();
      console.log('✅ Progreso actualizado');
      break;
    case 'export':
      const format = args[1] || 'json';
      tracker.exportProgress(format);
      break;
    case 'complete-phase':
      const phaseId = parseInt(args[1]);
      if (phaseId) {
        tracker.completePhase(phaseId);
      } else {
        console.error('❌ Debe especificar el ID de la fase');
      }
      break;
    case 'update-metrics':
      const phaseId2 = parseInt(args[1]);
      const metrics = JSON.parse(args[2] || '{}');
      if (phaseId2) {
        tracker.updatePhaseMetrics(phaseId2, metrics);
      } else {
        console.error('❌ Debe especificar el ID de la fase y las métricas');
      }
      break;
    default:
      console.log('Uso: node roadmap-tracker.js [comando] [opciones]');
      console.log('Comandos disponibles:');
      console.log('  report          - Genera reporte de progreso');
      console.log('  update          - Actualiza progreso');
      console.log('  export [formato] - Exporta progreso (json|csv|markdown)');
      console.log('  complete-phase [id] - Marca fase como completada');
      console.log('  update-metrics [id] [json] - Actualiza métricas de fase');
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default RoadmapTracker; 