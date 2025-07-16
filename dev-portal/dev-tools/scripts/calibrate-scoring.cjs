#!/usr/bin/env node

/**
 * 🎯 Calibrador de Proceso con Caso Postiz
 * 
 * Este script ejecuta todo nuestro proceso de evaluación usando
 * Postiz como caso conocido para validar que nuestras reglas
 * y scoring producen resultados consistentes con la realidad.
 * 
 * Caso esperado:
 * - Score: 85-95 (PORTE recomendado)
 * - Timeline: 4-6 semanas
 * - Resultado real: 4 semanas exitosas
 * 
 * Uso: node scripts/calibrate-scoring.cjs
 * 
 * VThink 1.0 - Calibración de Proceso
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// 📊 CASO DE CALIBRACIÓN: POSTIZ
const POSTIZ_CASE = {
  name: 'postiz',
  repo_url: 'https://github.com/gitroomhq/postiz-app',
  expected_results: {
    score_range: [85, 95],
    decision: 'PORTE',
    timeline_weeks: [4, 6],
    risk_level: 'BAJO',
    actual_result: {
      timeline_weeks: 4,
      success_rate: 100,
      functionality_migrated: 100,
      satisfaction_score: 5
    }
  },
  known_characteristics: {
    license: 'Apache-2.0',
    framework: 'React',
    language: 'TypeScript',
    build_tool: 'Vite',
    ui_library: 'shadcn/ui',
    database: 'PostgreSQL',
    last_commit_days: 7, // Proyecto activo
    has_tests: true,
    documentation_quality: 'good'
  }
};

class ProcessCalibrator {
  constructor() {
    this.results = {
      calibration_date: new Date().toISOString(),
      case_analyzed: POSTIZ_CASE.name,
      expected_vs_actual: {},
      scoring_accuracy: {},
      recommendations: []
    };
  }

  async calibrateWithPostiz() {
    console.log('🎯 Iniciando calibración del proceso con caso Postiz...');
    console.log(`📍 Repositorio: ${POSTIZ_CASE.repo_url}`);
    
    try {
      // 1. Ejecutar verificación de blockers
      console.log('\n🚦 PASO 1: Verificando blockers...');
      const blockerResults = await this.runBlockerCheck();
      
      // 2. Ejecutar análisis completo
      console.log('\n🔍 PASO 2: Ejecutando análisis completo...');
      const analysisResults = await this.runFullAnalysis();
      
      // 3. Comparar con resultados esperados
      console.log('\n⚖️ PASO 3: Comparando con resultados esperados...');
      const comparison = this.compareResults(blockerResults, analysisResults);
      
      // 4. Generar recomendaciones de calibración
      console.log('\n🎯 PASO 4: Generando recomendaciones...');
      const recommendations = this.generateCalibrationRecommendations(comparison);
      
      // 5. Guardar reporte de calibración
      await this.saveCalibrationReport(comparison, recommendations);
      
      return {
        comparison,
        recommendations,
        needs_calibration: recommendations.length > 0
      };
      
    } catch (error) {
      console.error('❌ Error durante calibración:', error.message);
      throw error;
    }
  }

  async runBlockerCheck() {
    console.log('   Ejecutando check-blockers.cjs...');
    
    try {
      // Ejecutar script de blockers
      const output = execSync(
        `node scripts/check-blockers.cjs ${POSTIZ_CASE.repo_url}`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      return {
        passed: true,
        has_blockers: false,
        output: output
      };
      
    } catch (error) {
      // Si el script retorna exit code 1, hay blockers
      return {
        passed: error.status === 0,
        has_blockers: error.status === 1,
        output: error.stdout || error.message
      };
    }
  }

  async runFullAnalysis() {
    console.log('   Ejecutando analyze-candidate-stack.cjs...');
    
    try {
      // Ejecutar análisis completo
      const output = execSync(
        `node scripts/analyze-candidate-stack.cjs ${POSTIZ_CASE.name} ${POSTIZ_CASE.repo_url}`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      // Parsear output para extraer score y decisión
      const scoreMatch = output.match(/Score Final: (\d+)\/100/);
      const decisionMatch = output.match(/Decisión: (\w+)/);
      
      return {
        passed: true,
        score: scoreMatch ? parseInt(scoreMatch[1]) : null,
        decision: decisionMatch ? decisionMatch[1] : null,
        output: output
      };
      
    } catch (error) {
      return {
        passed: false,
        error: error.message,
        output: error.stdout || error.stderr || error.message
      };
    }
  }

  compareResults(blockerResults, analysisResults) {
    const comparison = {
      blocker_check: {},
      analysis_check: {},
      overall_accuracy: 0
    };
    
    // Comparar resultados de blockers
    comparison.blocker_check = {
      expected_no_blockers: true,
      actual_no_blockers: !blockerResults.has_blockers,
      accuracy: (!blockerResults.has_blockers) ? 100 : 0,
      status: (!blockerResults.has_blockers) ? 'CORRECTO' : 'INCORRECTO'
    };
    
    // Comparar resultados de análisis
    if (analysisResults.passed) {
      const expectedScore = POSTIZ_CASE.expected_results.score_range;
      const actualScore = analysisResults.score;
      const expectedDecision = POSTIZ_CASE.expected_results.decision;
      const actualDecision = analysisResults.decision;
      
      // Verificar score
      const scoreInRange = actualScore >= expectedScore[0] && actualScore <= expectedScore[1];
      const scoreAccuracy = scoreInRange ? 100 : 
        Math.max(0, 100 - Math.abs(actualScore - ((expectedScore[0] + expectedScore[1]) / 2)));
      
      // Verificar decisión
      const decisionCorrect = actualDecision === expectedDecision;
      const decisionAccuracy = decisionCorrect ? 100 : 0;
      
      comparison.analysis_check = {
        score: {
          expected_range: expectedScore,
          actual: actualScore,
          in_range: scoreInRange,
          accuracy: scoreAccuracy
        },
        decision: {
          expected: expectedDecision,
          actual: actualDecision,
          correct: decisionCorrect,
          accuracy: decisionAccuracy
        },
        overall_accuracy: (scoreAccuracy + decisionAccuracy) / 2
      };
    } else {
      comparison.analysis_check = {
        error: 'Análisis falló',
        accuracy: 0
      };
    }
    
    // Calcular precisión general
    comparison.overall_accuracy = (
      comparison.blocker_check.accuracy + 
      (comparison.analysis_check.overall_accuracy || 0)
    ) / 2;
    
    return comparison;
  }

  generateCalibrationRecommendations(comparison) {
    const recommendations = [];
    
    // Verificar blockers
    if (comparison.blocker_check.status !== 'CORRECTO') {
      recommendations.push({
        type: 'BLOCKER_CALIBRATION',
        priority: 'HIGH',
        issue: 'Verificación de blockers no coincide con caso conocido',
        action: 'Revisar reglas de blockers en COMPONENT_ACCEPTANCE_RULES.md',
        expected: 'Sin blockers para Postiz',
        actual: 'Blockers encontrados incorrectamente'
      });
    }
    
    // Verificar scoring
    if (comparison.analysis_check?.score && !comparison.analysis_check.score.in_range) {
      const deviation = Math.abs(
        comparison.analysis_check.score.actual - 
        ((POSTIZ_CASE.expected_results.score_range[0] + POSTIZ_CASE.expected_results.score_range[1]) / 2)
      );
      
      recommendations.push({
        type: 'SCORING_CALIBRATION',
        priority: deviation > 10 ? 'HIGH' : 'MEDIUM',
        issue: `Score fuera del rango esperado (desviación: ${deviation} puntos)`,
        action: 'Ajustar pesos en ACCEPTANCE_RULES.SCORING',
        expected: `${POSTIZ_CASE.expected_results.score_range[0]}-${POSTIZ_CASE.expected_results.score_range[1]}`,
        actual: comparison.analysis_check.score.actual
      });
    }
    
    // Verificar decisión
    if (comparison.analysis_check?.decision && !comparison.analysis_check.decision.correct) {
      recommendations.push({
        type: 'DECISION_CALIBRATION',
        priority: 'HIGH',
        issue: 'Decisión incorrecta para caso conocido',
        action: 'Revisar umbrales de decisión en scoring algorithm',
        expected: POSTIZ_CASE.expected_results.decision,
        actual: comparison.analysis_check.decision.actual
      });
    }
    
    // Verificar precisión general
    if (comparison.overall_accuracy < 85) {
      recommendations.push({
        type: 'GENERAL_CALIBRATION',
        priority: 'HIGH',
        issue: `Precisión general baja (${comparison.overall_accuracy.toFixed(1)}%)`,
        action: 'Revisión completa de reglas y algoritmo de scoring',
        target: '≥ 90% precisión',
        current: `${comparison.overall_accuracy.toFixed(1)}%`
      });
    }
    
    // Si todo está bien, felicitar
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'CALIBRATION_SUCCESS',
        priority: 'INFO',
        issue: 'Proceso calibrado correctamente',
        action: 'Mantener monitoreo con casos futuros',
        accuracy: `${comparison.overall_accuracy.toFixed(1)}%`
      });
    }
    
    return recommendations;
  }

  async saveCalibrationReport(comparison, recommendations) {
    const report = {
      calibration_info: {
        date: new Date().toISOString(),
        case_name: POSTIZ_CASE.name,
        repository: POSTIZ_CASE.repo_url,
        calibrator_version: 'VThink 1.0'
      },
      
      expected_results: POSTIZ_CASE.expected_results,
      known_characteristics: POSTIZ_CASE.known_characteristics,
      
      actual_results: comparison,
      
      calibration_accuracy: {
        blocker_check: comparison.blocker_check.accuracy,
        analysis_check: comparison.analysis_check?.overall_accuracy || 0,
        overall: comparison.overall_accuracy,
        status: comparison.overall_accuracy >= 90 ? 'EXCELENTE' :
               comparison.overall_accuracy >= 80 ? 'BUENO' :
               comparison.overall_accuracy >= 70 ? 'ACEPTABLE' : 'NECESITA_MEJORA'
      },
      
      recommendations: recommendations,
      
      next_steps: recommendations.length > 0 ? [
        'Implementar mejoras recomendadas',
        'Ejecutar calibración nuevamente',
        'Documentar cambios en metodología',
        'Actualizar casos de prueba'
      ] : [
        'Proceso calibrado correctamente',
        'Continuar con casos reales',
        'Mantener monitoreo de precisión',
        'Programar próxima calibración'
      ]
    };
    
    // Guardar reporte
    const reportsDir = path.join('docs', 'PROJECT', '02_ARCHITECTURE', 'STACK_MANAGEMENT', 'CALIBRATION_REPORTS');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const reportPath = path.join(reportsDir, `postiz_calibration_${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📊 Reporte de calibración guardado: ${reportPath}`);
    
    // Mostrar resumen
    console.log(`\n🎯 RESUMEN DE CALIBRACIÓN:`);
    console.log(`   Precisión General: ${comparison.overall_accuracy.toFixed(1)}%`);
    console.log(`   Estado: ${report.calibration_accuracy.status}`);
    console.log(`   Recomendaciones: ${recommendations.length}`);
    
    if (recommendations.length > 0) {
      console.log(`\n📋 RECOMENDACIONES:`);
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue}`);
        console.log(`      Acción: ${rec.action}`);
      });
    }
    
    return reportPath;
  }
}

// 🚀 EJECUTAR CALIBRACIÓN
async function main() {
  try {
    const calibrator = new ProcessCalibrator();
    const result = await calibrator.calibrateWithPostiz();
    
    console.log(`\n✅ Calibración completada.`);
    console.log(`   Necesita ajustes: ${result.needs_calibration ? 'SÍ' : 'NO'}`);
    
    // Exit code basado en si necesita calibración
    process.exit(result.needs_calibration ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Error durante calibración:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ProcessCalibrator, POSTIZ_CASE };
