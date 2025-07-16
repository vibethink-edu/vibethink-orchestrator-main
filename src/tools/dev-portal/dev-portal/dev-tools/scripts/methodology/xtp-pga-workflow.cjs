#!/usr/bin/env node

/**
 * XTP-PGA Workflow Automation Script
 * Versión CommonJS para compatibilidad
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuración
const CONFIG = {
  businessCasesPath: 'docs/PROJECT/6_EVIDENCE/BUSINESS_CASES',
  requirementsPath: 'docs/PROJECT/2_PLANNING/REQUIREMENTS.md',
  decisionLogPath: 'docs/PROJECT/2_PLANNING/DECISION_LOG.md'
};

class XTPPGAWorkflow {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async showStatistics() {
    console.log('\n📊 Estadísticas del Flujo de Trabajo XTP-PGA:');
    console.log('=============================================');
    
    const states = ['ACTIVE', 'APPROVED', 'REJECTED', 'ARCHIVE'];
    let total = 0;
    
    states.forEach(state => {
      const statePath = path.join(CONFIG.businessCasesPath, state);
      let count = 0;
      
      if (fs.existsSync(statePath)) {
        const files = fs.readdirSync(statePath).filter(file => file.endsWith('.md'));
        count = files.length;
        total += count;
      }
      
      console.log(`${state}: ${count} casos`);
    });
    
    console.log(`\n📈 Total de casos: ${total}`);
    
    if (total > 0) {
      const activePath = path.join(CONFIG.businessCasesPath, 'ACTIVE');
      const approvedPath = path.join(CONFIG.businessCasesPath, 'APPROVED');
      
      let activeCount = 0;
      let approvedCount = 0;
      
      if (fs.existsSync(activePath)) {
        activeCount = fs.readdirSync(activePath).filter(file => file.endsWith('.md')).length;
      }
      
      if (fs.existsSync(approvedPath)) {
        approvedCount = fs.readdirSync(approvedPath).filter(file => file.endsWith('.md')).length;
      }
      
      const conversionRate = ((approvedCount / total) * 100).toFixed(1);
      console.log(`Tasa de conversión: ${conversionRate}%`);
    }
  }

  async interactiveMode() {
    console.log('\n🚀 XTP-PGA Workflow Automation');
    console.log('==============================\n');

    while (true) {
      console.log('\nOpciones disponibles:');
      console.log('1. Mostrar estadísticas');
      console.log('2. Ver casos activos');
      console.log('3. Crear Business Case de prueba');
      console.log('4. Salir');

      const choice = await this.question('\nSeleccione una opción (1-4): ');

      switch (choice) {
        case '1':
          await this.showStatistics();
          break;
        case '2':
          await this.showActiveCases();
          break;
        case '3':
          await this.createTestBusinessCase();
          break;
        case '4':
          console.log('👋 ¡Hasta luego!');
          this.rl.close();
          return;
        default:
          console.log('❌ Opción inválida');
      }
    }
  }

  async showActiveCases() {
    console.log('\n📁 Casos Activos:');
    console.log('=================');
    
    const activePath = path.join(CONFIG.businessCasesPath, 'ACTIVE');
    
    if (!fs.existsSync(activePath)) {
      console.log('❌ No hay casos activos');
      return;
    }

    const files = fs.readdirSync(activePath).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.log('❌ No hay casos activos');
      return;
    }

    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
  }

  async createTestBusinessCase() {
    console.log('\n📝 Crear Business Case de Prueba');
    console.log('================================');
    
    const testData = {
      clientName: 'ClienteTest',
      industry: 'Tecnología',
      budget: '$25,000 - $50,000',
      compliance: '85',
      gaps: '15',
      recommendation: 'Aprobar',
      analyst: 'Marcelo Escallón'
    };

    try {
      const fileName = await this.createBusinessCase(testData);
      console.log(`✅ Business Case de prueba creado: ${fileName}`);
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  async createBusinessCase(analysisData) {
    try {
      const {
        clientName,
        industry,
        budget,
        compliance,
        gaps,
        recommendation,
        analyst
      } = analysisData;

      // Generar nombre de archivo
      const date = new Date().toISOString().split('T')[0];
      const fileName = `PGA_ANALYSIS_Cliente-${clientName}_${date}.md`;
      const filePath = path.join(CONFIG.businessCasesPath, 'ACTIVE', fileName);

      // Crear contenido del Business Case
      const content = this.generateBusinessCaseContent(analysisData, fileName);

      // Asegurar que la carpeta existe
      const activePath = path.join(CONFIG.businessCasesPath, 'ACTIVE');
      if (!fs.existsSync(activePath)) {
        fs.mkdirSync(activePath, { recursive: true });
      }

      // Escribir archivo
      fs.writeFileSync(filePath, content);

      return fileName;

    } catch (error) {
      console.error('❌ Error creando Business Case:', error.message);
      throw error;
    }
  }

  generateBusinessCaseContent(data, fileName) {
    return `# Análisis de Cumplimiento Comercial - XTP-PGA Engine

**Cliente:** ${data.clientName}  
**Fecha de Análisis:** ${new Date().toISOString().split('T')[0]}  
**Analista:** ${data.analyst}  
**Versión del PGA Engine:** v1.0  

---

## 📋 Resumen Ejecutivo

### Información del Cliente
- **Industria:** ${data.industry}
- **Tamaño:** Mediana Empresa
- **Presupuesto Estimado:** ${data.budget}
- **Timeline:** Mediano Plazo (3-6 meses)

### Resultado del Análisis
- **Cumplimiento Actual:** ${data.compliance}%
- **GAP Identificado:** ${data.gaps}%
- **Recomendación:** ${data.recommendation}

---

## 🎯 Necesidades Identificadas

### Requerimientos Principales
1. **Gestión de Proyectos**
   - **Descripción:** Sistema de gestión de proyectos con seguimiento de tareas
   - **Prioridad:** Alta
   - **Estado:** Cumplido

2. **Reportes Automáticos**
   - **Descripción:** Generación automática de reportes de progreso
   - **Prioridad:** Media
   - **Estado:** Parcial

### Requerimientos Secundarios
- Dashboard ejecutivo
- Integración con herramientas externas
- Notificaciones automáticas

---

## ✅ Análisis de Cumplimiento

### Funcionalidades Cumplidas (${data.compliance}%)
| Funcionalidad | Estado | Observaciones |
|---------------|--------|---------------|
| Gestión de Proyectos | ✅ Cumplido | Módulo completo disponible |
| Dashboard Ejecutivo | ✅ Cumplido | Interfaz moderna implementada |
| Reportes Básicos | ✅ Cumplido | Sistema robusto |

### GAPs Identificados (${data.gaps}%)
| GAP | Impacto | Solución Propuesta | Esfuerzo |
|-----|---------|-------------------|----------|
| Reportes Avanzados | Medio | Desarrollo de templates personalizados | 1 sprint |
| Integración API | Bajo | Conector estándar disponible | 0.5 sprint |

---

## 💰 Propuesta Comercial

### Plan de Implementación
1. **Fase 1 (Mes 1):** Configuración inicial y reportes avanzados
2. **Fase 2 (Mes 2):** Integración API y testing

### Inversión Estimada
- **Desarrollo de GAPs:** $15,000
- **Implementación:** $10,000
- **Mantenimiento:** $3,000/mes
- **Total:** $25,000 + $3,000/mes

### ROI Estimado
- **Tiempo de Recuperación:** 6 meses
- **Beneficio Anual:** $40,000
- **ROI:** 160%

---

## 🚀 Plan de Acción

### Próximos Pasos
1. [x] Análisis PGA completado
2. [ ] Presentar propuesta al cliente
3. [ ] Negociar términos y condiciones
4. [ ] Definir timeline de implementación

### Riesgos Identificados
- **Riesgo 1:** Cambios en requerimientos - Mitigación: Flexibilidad en desarrollo
- **Riesgo 2:** Timeline apretado - Mitigación: Priorización de features

---

## 📊 Métricas de Seguimiento

### KPIs del Cliente
- Reducción de tiempo de reportes: 60%
- Mejora en visibilidad de proyectos: 80%
- Cumplimiento de deadlines: 95%

### Métricas de Éxito
- Tiempo de implementación: < 2 meses
- ROI positivo: < 8 meses
- Satisfacción del cliente: > 90%

---

## 🔗 Enlaces Relacionados

- **Requirements Generados:** [Pendiente - se generarán si se aprueba]
- **Decision Log:** [Pendiente - se registrará la decisión]
- **Cliente en CRM:** ${data.clientName.toUpperCase()}-001

---

## 📝 Notas Adicionales

- Cliente interesado en automatización de procesos
- Presupuesto confirmado por director de operaciones
- Timeline flexible según necesidades del cliente

---

**Estado del Documento:** DRAFT  
**Última Actualización:** ${new Date().toISOString().split('T')[0]}  
**Próxima Revisión:** ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
`;
  }

  question(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Función principal
async function main() {
  const workflow = new XTPPGAWorkflow();
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    await workflow.interactiveMode();
  } else if (args[0] === 'stats') {
    await workflow.showStatistics();
  } else {
    console.log('Uso: node xtp-pga-workflow.cjs [stats]');
  }
}

// Ejecutar
if (require.main === module) {
  main().catch(console.error);
}

module.exports = XTPPGAWorkflow; 