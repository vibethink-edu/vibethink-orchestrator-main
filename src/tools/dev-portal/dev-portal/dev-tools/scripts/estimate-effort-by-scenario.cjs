#!/usr/bin/env node

/**
 * 🎯 Estimador de Esfuerzo Multi-Escenario
 * 
 * Este script calcula el esfuerzo estimado para TODOS los escenarios posibles
 * de adopción de un componente: PORTE, INTEGRACIÓN, INSPIRACIÓN, y
 * ACTUALIZACIÓN DE STACK requerida.
 * 
 * Principio: NUNCA decir "no se puede" - siempre estimar ESFUERZO
 * 
 * Uso: node scripts/estimate-effort-by-scenario.cjs [component] [apps-affected]
 * 
 * VThink 1.0 - Stack Receptor Principles
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

// 🎯 FACTORES DE ESFUERZO POR ESCENARIO
const EFFORT_FACTORS = {
  PORTE: {
    base_weeks: 2,
    complexity_multiplier: 1.5,
    factors: {
      ui_adaptation: { weight: 0.3, description: 'Adaptar UI a shadcn/ui y Tailwind' },
      auth_integration: { weight: 0.2, description: 'Integrar con FusionAuth' },
      database_migration: { weight: 0.2, description: 'Adaptar a Supabase PostgreSQL' },
      api_adaptation: { weight: 0.15, description: 'Adaptar APIs al gateway' },
      testing_implementation: { weight: 0.1, description: 'Implementar tests con Vitest' },
      deployment_setup: { weight: 0.05, description: 'Configurar Docker deployment' }
    }
  },
  
  INTEGRACIÓN: {
    base_weeks: 1,
    complexity_multiplier: 1.2,
    factors: {
      api_wrapper: { weight: 0.4, description: 'Desarrollar wrapper/adaptador API' },
      auth_bridge: { weight: 0.2, description: 'Puente de autenticación' },
      data_sync: { weight: 0.2, description: 'Sincronización de datos' },
      monitoring_setup: { weight: 0.1, description: 'Configurar monitoreo' },
      error_handling: { weight: 0.1, description: 'Manejo de errores y fallbacks' }
    }
  },
  
  INSPIRACIÓN: {
    base_weeks: 3,
    complexity_multiplier: 2.0,
    factors: {
      feature_analysis: { weight: 0.15, description: 'Análisis detallado de funcionalidades' },
      design_specs: { weight: 0.2, description: 'Especificaciones de diseño' },
      architecture_design: { weight: 0.2, description: 'Diseño arquitectural' },
      core_development: { weight: 0.35, description: 'Desarrollo core' },
      testing_qa: { weight: 0.1, description: 'Testing y QA' }
    }
  },
  
  STACK_UPDATE: {
    base_weeks: 0.5,
    complexity_multiplier: 1.1,
    factors: {
      dependency_analysis: { weight: 0.2, description: 'Análisis de dependencias afectadas' },
      compatibility_testing: { weight: 0.3, description: 'Testing de compatibilidad' },
      gradual_rollout: { weight: 0.3, description: 'Rollout gradual por aplicación' },
      rollback_preparation: { weight: 0.2, description: 'Preparación de rollback' }
    }
  }
};

// 🏗️ COMPLEJIDAD POR TIPO DE COMPONENTE
const COMPONENT_COMPLEXITY = {
  ui_library: { multiplier: 1.2, examples: ['shadcn/ui', 'material-ui', 'antd'] },
  framework: { multiplier: 2.5, examples: ['react', 'vue', 'angular'] },
  backend_service: { multiplier: 1.8, examples: ['auth service', 'database', 'api'] },
  build_tool: { multiplier: 1.5, examples: ['vite', 'webpack', 'rollup'] },
  utility_library: { multiplier: 0.8, examples: ['lodash', 'date-fns', 'axios'] },
  workflow_engine: { multiplier: 3.0, examples: ['n8n', 'zapier', 'microsoft-flow'] }
};

// 📱 APLICACIONES AFECTADAS
const AIPAIR_APPS = {
  'main-platform': { 
    stability_requirement: 'HIGH', 
    dependencies_count: 150,
    update_impact_multiplier: 1.3
  },
  'postiz-module': { 
    stability_requirement: 'MEDIUM', 
    dependencies_count: 80,
    update_impact_multiplier: 1.1
  },
  'admin-dashboard': { 
    stability_requirement: 'HIGH', 
    dependencies_count: 60,
    update_impact_multiplier: 1.2
  },
  'api-gateway': { 
    stability_requirement: 'CRITICAL', 
    dependencies_count: 40,
    update_impact_multiplier: 1.5
  }
};

class EffortEstimator {
  constructor(componentName, affectedApps = []) {
    this.componentName = componentName;
    this.affectedApps = affectedApps.length > 0 ? affectedApps : Object.keys(AIPAIR_APPS);
    this.timestamp = new Date().toISOString();
  }

  async estimateAllScenarios() {
    console.log(`🎯 Estimando esfuerzo multi-escenario para: ${this.componentName}`);
    console.log(`📱 Aplicaciones consideradas: ${this.affectedApps.join(', ')}`);
    
    try {
      // 1. Detectar tipo de componente y complejidad
      const componentType = await this.detectComponentType();
      const complexity = this.calculateComplexity(componentType);
      
      // 2. Calcular esfuerzo para cada escenario
      const scenarios = {
        PORTE: this.calculatePorteEffort(complexity),
        INTEGRACIÓN: this.calculateIntegrationEffort(complexity),
        INSPIRACIÓN: this.calculateInspirationEffort(complexity),
        STACK_UPDATE: this.calculateStackUpdateEffort(complexity)
      };
      
      // 3. Calcular impacto en aplicaciones
      const appImpact = this.calculateAppImpact(scenarios);
      
      // 4. Generar recomendaciones
      const recommendations = this.generateRecommendations(scenarios, appImpact);
      
      // 5. Crear reporte
      const report = await this.generateReport(scenarios, appImpact, recommendations, complexity);
      
      return report;
      
    } catch (error) {
      console.error('❌ Error calculando esfuerzo:', error.message);
      throw error;
    }
  }

  async detectComponentType() {
    // En implementación real, analizaría el componente
    // Por ahora, inferir del nombre o permitir especificación manual
    const typeInferences = {
      'ui': 'ui_library',
      'react': 'framework', 
      'vue': 'framework',
      'angular': 'framework',
      'auth': 'backend_service',
      'database': 'backend_service',
      'vite': 'build_tool',
      'webpack': 'build_tool',
      'n8n': 'workflow_engine',
      'zapier': 'workflow_engine'
    };
    
    const componentLower = this.componentName.toLowerCase();
    
    for (const [keyword, type] of Object.entries(typeInferences)) {
      if (componentLower.includes(keyword)) {
        return type;
      }
    }
    
    return 'utility_library'; // default
  }

  calculateComplexity(componentType) {
    const baseComplexity = COMPONENT_COMPLEXITY[componentType] || COMPONENT_COMPLEXITY.utility_library;
    
    // Factores adicionales de complejidad
    let complexityMultiplier = baseComplexity.multiplier;
    
    // Más aplicaciones afectadas = más complejidad
    if (this.affectedApps.length > 2) {
      complexityMultiplier *= 1.2;
    }
    
    // Aplicaciones críticas = más complejidad
    const hasCriticalApps = this.affectedApps.some(app => 
      AIPAIR_APPS[app]?.stability_requirement === 'CRITICAL'
    );
    
    if (hasCriticalApps) {
      complexityMultiplier *= 1.3;
    }
    
    return {
      type: componentType,
      base_multiplier: baseComplexity.multiplier,
      final_multiplier: complexityMultiplier,
      reasoning: [
        `Tipo de componente: ${componentType} (${baseComplexity.multiplier}x)`,
        ...(this.affectedApps.length > 2 ? ['Múltiples apps afectadas (+20%)'] : []),
        ...(hasCriticalApps ? ['Apps críticas afectadas (+30%)'] : [])
      ]
    };
  }

  calculatePorteEffort(complexity) {
    const factors = EFFORT_FACTORS.PORTE;
    const baseEffort = factors.base_weeks * complexity.final_multiplier;
    
    const detailedFactors = Object.entries(factors.factors).map(([key, factor]) => ({
      factor: key,
      description: factor.description,
      weight: factor.weight,
      estimated_days: Math.round(baseEffort * 5 * factor.weight * 10) / 10
    }));
    
    return {
      scenario: 'PORTE',
      total_weeks: Math.round(baseEffort * 10) / 10,
      total_days: Math.round(baseEffort * 5),
      confidence: 'MEDIUM',
      detailed_factors: detailedFactors,
      prerequisites: [
        'Componente debe ser compatible con React',
        'Licencia debe permitir modificaciones',
        'Código fuente debe estar disponible'
      ],
      deliverables: [
        'Código adaptado al stack AIPAIR',
        'Tests implementados',
        'Documentación actualizada',
        'Deployment configurado'
      ]
    };
  }

  calculateIntegrationEffort(complexity) {
    const factors = EFFORT_FACTORS.INTEGRACIÓN;
    const baseEffort = factors.base_weeks * complexity.final_multiplier;
    
    const detailedFactors = Object.entries(factors.factors).map(([key, factor]) => ({
      factor: key,
      description: factor.description,
      weight: factor.weight,
      estimated_days: Math.round(baseEffort * 5 * factor.weight * 10) / 10
    }));
    
    return {
      scenario: 'INTEGRACIÓN',
      total_weeks: Math.round(baseEffort * 10) / 10,
      total_days: Math.round(baseEffort * 5),
      confidence: 'HIGH',
      detailed_factors: detailedFactors,
      prerequisites: [
        'API estable y documentada',
        'SLA aceptable del servicio',
        'Autenticación compatible'
      ],
      deliverables: [
        'Adaptador/wrapper desarrollado',
        'Monitoreo configurado',
        'Manejo de errores implementado',
        'Documentación de integración'
      ]
    };
  }

  calculateInspirationEffort(complexity) {
    const factors = EFFORT_FACTORS.INSPIRACIÓN;
    const baseEffort = factors.base_weeks * complexity.final_multiplier;
    
    const detailedFactors = Object.entries(factors.factors).map(([key, factor]) => ({
      factor: key,
      description: factor.description,
      weight: factor.weight,
      estimated_days: Math.round(baseEffort * 5 * factor.weight * 10) / 10
    }));
    
    return {
      scenario: 'INSPIRACIÓN',
      total_weeks: Math.round(baseEffort * 10) / 10,
      total_days: Math.round(baseEffort * 5),
      confidence: 'LOW',
      detailed_factors: detailedFactors,
      prerequisites: [
        'Análisis detallado de funcionalidades',
        'Especificaciones técnicas claras',
        'Recursos de desarrollo disponibles'
      ],
      deliverables: [
        'Especificaciones funcionales',
        'Diseño arquitectural',
        'Implementación completa',
        'Testing y documentación'
      ]
    };
  }

  calculateStackUpdateEffort(complexity) {
    const factors = EFFORT_FACTORS.STACK_UPDATE;
    const baseEffort = factors.base_weeks * complexity.final_multiplier;
    
    // Multiplicar por número de apps afectadas
    const appMultiplier = this.affectedApps.length * 0.3 + 0.7;
    const totalEffort = baseEffort * appMultiplier;
    
    const detailedFactors = Object.entries(factors.factors).map(([key, factor]) => ({
      factor: key,
      description: factor.description,
      weight: factor.weight,
      estimated_days: Math.round(totalEffort * 5 * factor.weight * 10) / 10
    }));
    
    return {
      scenario: 'STACK_UPDATE',
      total_weeks: Math.round(totalEffort * 10) / 10,
      total_days: Math.round(totalEffort * 5),
      confidence: 'HIGH',
      detailed_factors: detailedFactors,
      apps_affected: this.affectedApps.length,
      prerequisites: [
        'Testing exhaustivo en entorno de desarrollo',
        'Plan de rollback documentado',
        'Ventana de mantenimiento coordinada'
      ],
      deliverables: [
        'Stack actualizado por aplicación',
        'Tests de regresión pasando',
        'Documentación actualizada',
        'Plan de rollback probado'
      ]
    };
  }

  calculateAppImpact(scenarios) {
    return this.affectedApps.map(appName => {
      const appConfig = AIPAIR_APPS[appName];
      const impactMultiplier = appConfig.update_impact_multiplier;
      
      return {
        app_name: appName,
        stability_requirement: appConfig.stability_requirement,
        dependencies_count: appConfig.dependencies_count,
        impact_by_scenario: {
          PORTE: {
            risk_level: this.calculateRiskLevel(appConfig.stability_requirement, 'PORTE'),
            testing_effort_days: Math.round(scenarios.PORTE.total_days * 0.3 * impactMultiplier),
            migration_effort_days: Math.round(scenarios.PORTE.total_days * 0.7 * impactMultiplier)
          },
          INTEGRACIÓN: {
            risk_level: this.calculateRiskLevel(appConfig.stability_requirement, 'INTEGRACIÓN'),
            testing_effort_days: Math.round(scenarios.INTEGRACIÓN.total_days * 0.2 * impactMultiplier),
            integration_effort_days: Math.round(scenarios.INTEGRACIÓN.total_days * 0.8 * impactMultiplier)
          },
          STACK_UPDATE: {
            risk_level: this.calculateRiskLevel(appConfig.stability_requirement, 'STACK_UPDATE'),
            testing_effort_days: Math.round(scenarios.STACK_UPDATE.total_days * 0.4 * impactMultiplier),
            update_effort_days: Math.round(scenarios.STACK_UPDATE.total_days * 0.6 * impactMultiplier)
          }
        }
      };
    });
  }

  calculateRiskLevel(stabilityReq, scenario) {
    const riskMatrix = {
      'CRITICAL': { 'PORTE': 'HIGH', 'INTEGRACIÓN': 'MEDIUM', 'STACK_UPDATE': 'HIGH' },
      'HIGH': { 'PORTE': 'MEDIUM', 'INTEGRACIÓN': 'LOW', 'STACK_UPDATE': 'MEDIUM' },
      'MEDIUM': { 'PORTE': 'LOW', 'INTEGRACIÓN': 'LOW', 'STACK_UPDATE': 'LOW' }
    };
    
    return riskMatrix[stabilityReq]?.[scenario] || 'MEDIUM';
  }

  generateRecommendations(scenarios, appImpact) {
    const recommendations = [];
    
    // Ordenar escenarios por esfuerzo
    const sortedScenarios = Object.entries(scenarios)
      .filter(([key]) => key !== 'STACK_UPDATE')
      .sort(([,a], [,b]) => a.total_weeks - b.total_weeks);
    
    const lowestEffort = sortedScenarios[0];
    
    recommendations.push({
      type: 'ESFUERZO_MÍNIMO',
      scenario: lowestEffort[0],
      effort: lowestEffort[1].total_weeks,
      reason: `Menor esfuerzo estimado (${lowestEffort[1].total_weeks} semanas)`
    });
    
    // Recomendación por riesgo
    const lowRiskScenarios = sortedScenarios.filter(([scenario]) => {
      const avgRisk = appImpact.reduce((sum, app) => {
        const risk = app.impact_by_scenario[scenario]?.risk_level;
        return sum + (['LOW', 'MEDIUM', 'HIGH'].indexOf(risk) + 1);
      }, 0) / appImpact.length;
      return avgRisk <= 2; // LOW o MEDIUM promedio
    });
    
    if (lowRiskScenarios.length > 0) {
      const safestOption = lowRiskScenarios[0];
      recommendations.push({
        type: 'MENOR_RIESGO',
        scenario: safestOption[0],
        effort: safestOption[1].total_weeks,
        reason: 'Menor riesgo para aplicaciones críticas'
      });
    }
    
    // Recomendación por valor
    const valueScenarios = {
      'PORTE': { value: 9, reason: 'Control total, sin dependencias externas' },
      'INTEGRACIÓN': { value: 6, reason: 'Rápido, pero dependencia externa' },
      'INSPIRACIÓN': { value: 8, reason: 'Solución personalizada, pero más esfuerzo' }
    };
    
    const bestValue = Object.entries(valueScenarios)
      .map(([scenario, info]) => ({
        scenario,
        value_score: info.value / scenarios[scenario].total_weeks,
        ...info
      }))
      .sort((a, b) => b.value_score - a.value_score)[0];
    
    recommendations.push({
      type: 'MEJOR_VALOR',
      scenario: bestValue.scenario,
      effort: scenarios[bestValue.scenario].total_weeks,
      reason: bestValue.reason,
      value_score: Math.round(bestValue.value_score * 100) / 100
    });
    
    return recommendations;
  }

  async generateReport(scenarios, appImpact, recommendations, complexity) {
    const report = {
      estimation_info: {
        component_name: this.componentName,
        analysis_date: this.timestamp,
        estimator_version: 'VThink 1.0',
        apps_considered: this.affectedApps
      },
      
      component_analysis: {
        detected_type: complexity.type,
        complexity_multiplier: complexity.final_multiplier,
        complexity_reasoning: complexity.reasoning
      },
      
      effort_scenarios: scenarios,
      
      app_impact_analysis: appImpact,
      
      recommendations: recommendations,
      
      executive_summary: {
        quickest_option: {
          scenario: recommendations.find(r => r.type === 'ESFUERZO_MÍNIMO')?.scenario,
          effort_weeks: recommendations.find(r => r.type === 'ESFUERZO_MÍNIMO')?.effort
        },
        safest_option: {
          scenario: recommendations.find(r => r.type === 'MENOR_RIESGO')?.scenario,
          effort_weeks: recommendations.find(r => r.type === 'MENOR_RIESGO')?.effort
        },
        best_value: {
          scenario: recommendations.find(r => r.type === 'MEJOR_VALOR')?.scenario,
          effort_weeks: recommendations.find(r => r.type === 'MEJOR_VALOR')?.effort
        }
      },
      
      next_steps: [
        'Revisar estimaciones con el equipo',
        'Seleccionar escenario según prioridades',
        'Crear plan detallado de implementación',
        'Asignar recursos y establecer timeline'
      ]
    };
    
    // Guardar reporte
    const reportsDir = path.join('docs', 'PROJECT', '02_ARCHITECTURE', 'STACK_MANAGEMENT', 'EFFORT_REPORTS');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const reportPath = path.join(reportsDir, `${this.componentName}_effort_estimation_${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Mostrar resumen en consola
    this.displaySummary(report);
    
    console.log(`\n📊 Reporte detallado guardado: ${reportPath}`);
    
    return report;
  }

  displaySummary(report) {
    console.log(`\n🎯 RESUMEN DE ESTIMACIONES PARA: ${this.componentName.toUpperCase()}`);
    console.log('=' .repeat(60));
    
    const scenarios = report.effort_scenarios;
    
    console.log('\n📊 ESFUERZO POR ESCENARIO:');
    Object.entries(scenarios).forEach(([scenario, data]) => {
      const icon = {
        'PORTE': '🟢',
        'INTEGRACIÓN': '🟡', 
        'INSPIRACIÓN': '🔵',
        'STACK_UPDATE': '🔧'
      }[scenario] || '📋';
      
      console.log(`   ${icon} ${scenario}: ${data.total_weeks} semanas (${data.total_days} días)`);
      console.log(`      Confianza: ${data.confidence}`);
    });
    
    console.log('\n🎯 RECOMENDACIONES:');
    report.recommendations.forEach(rec => {
      console.log(`   • ${rec.type}: ${rec.scenario} (${rec.effort} semanas)`);
      console.log(`     Razón: ${rec.reason}`);
    });
    
    console.log('\n📱 IMPACTO EN APLICACIONES:');
    report.app_impact_analysis.forEach(app => {
      console.log(`   • ${app.app_name} (${app.stability_requirement} stability)`);
    });
  }
}

// 🚀 EJECUTAR SI ES LLAMADO DIRECTAMENTE
async function main() {
  const componentName = process.argv[2];
  const affectedApps = process.argv.slice(3);
  
  if (!componentName) {
    console.error('❌ Uso: node scripts/estimate-effort-by-scenario.cjs [component] [apps...]');
    console.error('   Ejemplo: node scripts/estimate-effort-by-scenario.cjs "n8n" main-platform postiz-module');
    process.exit(1);
  }
  
  try {
    const estimator = new EffortEstimator(componentName, affectedApps);
    await estimator.estimateAllScenarios();
    
    console.log('\n✅ Estimación completada. Usa las estimaciones para tomar decisiones informadas.');
    
  } catch (error) {
    console.error('❌ Error durante estimación:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { EffortEstimator, EFFORT_FACTORS, COMPONENT_COMPLEXITY };
