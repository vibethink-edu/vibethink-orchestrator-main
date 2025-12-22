/**
 * Script para comparar dashboards entre dashboard-bundui y dashboard-vibethink
 * Identifica duplicados y ayuda a decidir cuál versión mantener
 */

const fs = require('fs');
const path = require('path');

const BUNDUI_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');

function findDashboards(dir) {
  const dashboards = new Map();
  
  function scanDir(currentDir, basePath = '') {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir);
    
    entries.forEach(entry => {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      const relPath = basePath ? `${basePath}/${entry}` : entry;
      
      if (stat.isDirectory()) {
        const pagePath = path.join(fullPath, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          // Dashboard encontrado
          const pageContent = fs.readFileSync(pagePath, 'utf-8');
          const stats = fs.statSync(pagePath);
          
          dashboards.set(relPath, {
            path: relPath,
            fullPath: fullPath,
            pagePath: pagePath,
            modifiedTime: stats.mtime,
            size: stats.size,
            hasComponents: fs.existsSync(path.join(fullPath, 'components')),
            componentCount: countComponents(fullPath),
            lineCount: pageContent.split('\n').length
          });
        }
        // Continuar escaneando
        scanDir(fullPath, relPath);
      }
    });
  }
  
  scanDir(dir);
  return dashboards;
}

function countComponents(dashboardDir) {
  const componentsDir = path.join(dashboardDir, 'components');
  if (!fs.existsSync(componentsDir)) return 0;
  
  let count = 0;
  function countFiles(dir) {
    const entries = fs.readdirSync(dir);
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        countFiles(fullPath);
      } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
        count++;
      }
    });
  }
  countFiles(componentsDir);
  return count;
}

function analyzeQuality(dashboardInfo) {
  const metrics = {
    score: 0,
    reasons: []
  };
  
  // Puntos por tener componentes
  if (dashboardInfo.hasComponents) {
    metrics.score += 10;
    metrics.reasons.push(`✅ Tiene directorio components/`);
  }
  
  // Puntos por cantidad de componentes (más = mejor estructurado)
  if (dashboardInfo.componentCount > 0) {
    metrics.score += Math.min(dashboardInfo.componentCount * 2, 30);
    metrics.reasons.push(`✅ ${dashboardInfo.componentCount} componentes`);
  }
  
  // Puntos por tamaño del archivo principal (indicador de complejidad)
  if (dashboardInfo.size > 1000) {
    metrics.score += 5;
    metrics.reasons.push(`✅ Archivo principal sustancial (${Math.round(dashboardInfo.size / 1024)}KB)`);
  }
  
  // Puntos por fecha de modificación (más reciente = mejor)
  const daysSinceMod = (new Date() - dashboardInfo.modifiedTime) / (1000 * 60 * 60 * 24);
  if (daysSinceMod < 30) {
    metrics.score += 10;
    metrics.reasons.push(`✅ Modificado recientemente (${Math.round(daysSinceMod)} días)`);
  }
  
  return metrics;
}

function compareDashboards() {
  console.log('🔍 Analizando dashboards en ambos directorios...\n');
  
  const bunduiDashboards = findDashboards(BUNDUI_DIR);
  const vibethinkDashboards = findDashboards(VIBETHINK_DIR);
  
  console.log(`📦 Dashboard-bundui: ${bunduiDashboards.size} dashboards`);
  console.log(`📦 Dashboard-vibethink: ${vibethinkDashboards.size} dashboards\n`);
  
  // Normalizar nombres para comparación
  const bunduiNames = new Map();
  const vibethinkNames = new Map();
  
  // Mapeos especiales
  const nameMappings = {
    'projects': 'project-management',
    'analytics': 'website-analytics'
  };
  
  bunduiDashboards.forEach((info, key) => {
    const normalized = nameMappings[key] || key;
    bunduiNames.set(normalized, { ...info, originalKey: key });
  });
  
  vibethinkDashboards.forEach((info, key) => {
    vibethinkNames.set(key, info);
  });
  
  // Encontrar duplicados
  const duplicates = [];
  
  bunduiNames.forEach((bunduiInfo, normalizedKey) => {
    if (vibethinkNames.has(normalizedKey)) {
      const vibethinkInfo = vibethinkNames.get(normalizedKey);
      
      duplicates.push({
        name: normalizedKey,
        bundui: bunduiInfo,
        vibethink: vibethinkInfo
      });
    }
  });
  
  console.log(`🔄 Dashboards duplicados encontrados: ${duplicates.length}\n`);
  console.log('='.repeat(80));
  
  const recommendations = [];
  
  duplicates.forEach(dup => {
    console.log(`\n📊 Dashboard: ${dup.name}`);
    console.log('-'.repeat(80));
    
    const bunduiQuality = analyzeQuality(dup.bundui);
    const vibethinkQuality = analyzeQuality(dup.vibethink);
    
    console.log(`\n📦 BUNDUI (${dup.bundui.originalKey}):`);
    console.log(`   Modificado: ${dup.bundui.modifiedTime.toLocaleDateString()}`);
    console.log(`   Componentes: ${dup.bundui.componentCount}`);
    console.log(`   Líneas: ${dup.bundui.lineCount}`);
    console.log(`   Puntuación: ${bunduiQuality.score}/55`);
    bunduiQuality.reasons.forEach(r => console.log(`   ${r}`));
    
    console.log(`\n💎 VIBETHINK:`);
    console.log(`   Modificado: ${dup.vibethink.modifiedTime.toLocaleDateString()}`);
    console.log(`   Componentes: ${dup.vibethink.componentCount}`);
    console.log(`   Líneas: ${dup.vibethink.lineCount}`);
    console.log(`   Puntuación: ${vibethinkQuality.score}/55`);
    vibethinkQuality.reasons.forEach(r => console.log(`   ${r}`));
    
    // Recomendación
    let recommendation;
    if (bunduiQuality.score > vibethinkQuality.score) {
      recommendation = 'BUNDUI';
      console.log(`\n✅ RECOMENDACIÓN: Usar versión BUNDUI (mejor calidad)`);
    } else if (vibethinkQuality.score > bunduiQuality.score) {
      recommendation = 'VIBETHINK';
      console.log(`\n✅ RECOMENDACIÓN: Mantener versión VIBETHINK (mejor calidad)`);
    } else {
      // Empate - usar el más reciente
      if (dup.bundui.modifiedTime > dup.vibethink.modifiedTime) {
        recommendation = 'BUNDUI';
        console.log(`\n✅ RECOMENDACIÓN: Usar versión BUNDUI (más reciente)`);
      } else {
        recommendation = 'VIBETHINK';
        console.log(`\n✅ RECOMENDACIÓN: Mantener versión VIBETHINK (más reciente)`);
      }
    }
    
    recommendations.push({
      name: dup.name,
      recommendation,
      bunduiScore: bunduiQuality.score,
      vibethinkScore: vibethinkQuality.score,
      bunduiPath: dup.bundui.originalKey,
      vibethinkPath: dup.name
    });
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📋 RESUMEN DE RECOMENDACIONES:\n');
  
  recommendations.forEach(rec => {
    const icon = rec.recommendation === 'BUNDUI' ? '📦' : '💎';
    console.log(`${icon} ${rec.name.padEnd(30)} → ${rec.recommendation.padEnd(10)} (B:${rec.bunduiScore} vs V:${rec.vibethinkScore})`);
  });
  
  // Generar archivo JSON con recomendaciones
  const outputPath = path.join(__dirname, '../docs/architecture/DASHBOARD_VERSION_COMPARISON.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalDuplicates: duplicates.length,
    recommendations
  }, null, 2));
  
  console.log(`\n💾 Resultados guardados en: ${outputPath}`);
}

compareDashboards();








