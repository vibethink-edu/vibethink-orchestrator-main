#!/usr/bin/env node

/**
 * Script para calcular coverage de documentación
 * Uso: node scripts/doc-coverage.js
 */

const fs = require('fs');
const path = require('path');

// Configuración de áreas y archivos esperados
const DOCUMENTATION_AREAS = {
  'architecture': {
    files: ['overview.md', 'decisions.md', 'patterns.md', 'security.md'],
    weight: 25
  },
  'roadmap': {
    files: ['overview.md', 'backend.md', 'frontend.md', 'devops.md', 'testing.md'],
    weight: 30
  },
  'tools': {
    files: ['setup.md', 'workflow.md', 'debugging.md', 'performance.md'],
    weight: 20
  },
  'testing': {
    files: ['strategy.md', 'unit.md', 'integration.md', 'e2e.md'],
    weight: 15
  },
  'deployment': {
    files: ['ci-cd.md', 'environments.md', 'monitoring.md'],
    weight: 10
  }
};

function calculateCoverage() {
  const docsPath = path.join(__dirname, '../docs');
  const results = {};
  let totalCoverage = 0;
  let totalWeight = 0;

  console.log('📊 Calculando Coverage de Documentación...\n');

  for (const [area, config] of Object.entries(DOCUMENTATION_AREAS)) {
    const areaPath = path.join(docsPath, area);
    const expectedFiles = config.files;
    const existingFiles = [];

    // Verificar archivos existentes
    if (fs.existsSync(areaPath)) {
      const files = fs.readdirSync(areaPath);
      for (const file of files) {
        if (file.endsWith('.md')) {
          existingFiles.push(file);
        }
      }
    }

    // Calcular coverage del área
    const coverage = (existingFiles.length / expectedFiles.length) * 100;
    const missingFiles = expectedFiles.filter(file => !existingFiles.includes(file));

    results[area] = {
      coverage: Math.round(coverage),
      existing: existingFiles.length,
      expected: expectedFiles.length,
      missing: missingFiles,
      weight: config.weight
    };

    totalCoverage += coverage * config.weight;
    totalWeight += config.weight;

    // Mostrar resultados del área
    console.log(`🏷️  ${area.toUpperCase()}:`);
    console.log(`   Coverage: ${Math.round(coverage)}% (${existingFiles.length}/${expectedFiles.length})`);
    
    if (missingFiles.length > 0) {
      console.log(`   ❌ Faltantes: ${missingFiles.join(', ')}`);
    } else {
      console.log(`   ✅ Completo`);
    }
    console.log('');
  }

  // Coverage general
  const generalCoverage = Math.round(totalCoverage / totalWeight);
  
  console.log('📈 RESUMEN:');
  console.log(`   Coverage General: ${generalCoverage}%`);
  console.log(`   Áreas Completas: ${Object.values(results).filter(r => r.coverage === 100).length}/${Object.keys(results).length}`);
  console.log(`   Archivos Faltantes: ${Object.values(results).reduce((sum, r) => sum + r.missing.length, 0)}`);

  // Generar reporte JSON
  const report = {
    timestamp: new Date().toISOString(),
    generalCoverage,
    areas: results,
    recommendations: generateRecommendations(results)
  };

  fs.writeFileSync(
    path.join(__dirname, '../docs-coverage-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n📄 Reporte guardado en: docs-coverage-report.json');
}

function generateRecommendations(results) {
  const recommendations = [];

  // Priorizar áreas con menor coverage
  const sortedAreas = Object.entries(results)
    .sort((a, b) => a[1].coverage - b[1].coverage);

  for (const [area, data] of sortedAreas) {
    if (data.coverage < 100) {
      recommendations.push({
        area,
        priority: data.coverage < 50 ? '🔥 CRITICAL' : data.coverage < 80 ? '⚡ HIGH' : '📝 MEDIUM',
        missingFiles: data.missing,
        impact: `Aumentaría coverage general en ${Math.round((data.missing.length / data.expected) * data.weight)}%`
      });
    }
  }

  return recommendations;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  calculateCoverage();
}

module.exports = { calculateCoverage }; 