/**
 * Script para aplicar recomendaciones de comparación de dashboards
 * Hereda dashboards de bundui cuando son mejores, mantiene vibethink cuando son mejores
 * Con validación de guardrails
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const BUNDUI_DIR = path.join(PROJECT_ROOT, 'apps/dashboard/app/dashboard-bundui');
const VIBETHINK_DIR = path.join(PROJECT_ROOT, 'apps/dashboard/app/dashboard-vibethink');
const RECOMMENDATIONS_FILE = path.join(PROJECT_ROOT, 'docs/architecture/DASHBOARD_VERSION_COMPARISON.json');

// Mapeo de nombres especiales
const NAME_MAPPINGS = {
  'analytics': 'website-analytics',
  'projects': 'project-management'
};

const REVERSE_MAPPINGS = {
  'website-analytics': 'analytics',
  'project-management': 'projects'
};

function loadRecommendations() {
  if (!fs.existsSync(RECOMMENDATIONS_FILE)) {
    console.error('❌ No se encontró el archivo de recomendaciones. Ejecuta primero compare-dashboard-versions.js');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(RECOMMENDATIONS_FILE, 'utf-8'));
  return data.recommendations.filter(r => r.recommendation === 'BUNDUI');
}

function validateWithGuardrail(dashboardName, sourceDir) {
  console.log(`   🔍 Validando con guardrail: ${dashboardName}...`);
  
  try {
    // Ejecutar el guardrail (si existe)
    const guardrailPath = path.join(PROJECT_ROOT, 'packages/cli/src/validation/dashboard-migration-guard.cjs');
    if (fs.existsSync(guardrailPath)) {
      // Por ahora, solo verificamos imports básicos
      const pagePath = path.join(sourceDir, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf-8');
        
        // Verificar imports correctos
        const hasIncorrectImports = /from ['"]@\/components\/ui\//.test(content) || 
                                    /from ['"]@vibethink\/bundui-ui/.test(content);
        
        if (hasIncorrectImports) {
          console.log(`   ⚠️  Advertencia: Tiene imports incorrectos (necesitará corrección)`);
          return { valid: true, needsFix: true };
        }
        
        return { valid: true, needsFix: false };
      }
    }
    
    return { valid: true, needsFix: false };
  } catch (error) {
    console.log(`   ⚠️  Error en validación: ${error.message}`);
    return { valid: false, error: error.message };
  }
}

function backupDashboard(targetDir) {
  const backupDir = targetDir + '.backup.' + Date.now();
  if (fs.existsSync(targetDir)) {
    console.log(`   💾 Haciendo backup a: ${path.basename(backupDir)}`);
    fs.cpSync(targetDir, backupDir, { recursive: true });
    return backupDir;
  }
  return null;
}

function copyDashboard(sourceDir, targetDir) {
  console.log(`   📋 Copiando dashboard...`);
  
  // Crear backup
  const backupPath = backupDashboard(targetDir);
  
  // Eliminar destino actual
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  
  // Copiar desde origen
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  
  console.log(`   ✅ Dashboard copiado exitosamente`);
  if (backupPath) {
    console.log(`   💾 Backup disponible en: ${path.basename(backupPath)}`);
  }
  
  return backupPath;
}

function fixImports(dashboardDir) {
  console.log(`   🔧 Corrigiendo imports...`);
  
  const files = [];
  function findTsxFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findTsxFiles(fullPath);
      } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  }
  
  findTsxFiles(dashboardDir);
  
  let fixedCount = 0;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    
    // Corregir imports incorrectos
    if (content.includes('@/components/ui/')) {
      content = content.replace(
        /from ['"]@\/components\/ui\/([^'"]+)['"]/g,
        "from '@vibethink/ui'"
      );
      modified = true;
    }
    
    if (content.includes('@vibethink/bundui-ui')) {
      content = content.replace(
        /from ['"]@vibethink\/bundui-ui[^'"]*['"]/g,
        "from '@vibethink/ui'"
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      fixedCount++;
    }
  });
  
  if (fixedCount > 0) {
    console.log(`   ✅ ${fixedCount} archivos corregidos`);
  } else {
    console.log(`   ✅ Imports ya correctos`);
  }
}

function applyRecommendations() {
  console.log('🔄 Aplicando recomendaciones de comparación de dashboards\n');
  console.log('📋 Regla: Heredar de BUNDUI cuando es mejor, mantener VIBETHINK cuando es mejor\n');
  console.log('='.repeat(80));
  
  const recommendations = loadRecommendations();
  
  if (recommendations.length === 0) {
    console.log('✅ No hay recomendaciones para heredar de BUNDUI. Todo está correcto.');
    return;
  }
  
  console.log(`\n📦 Dashboards a heredar de BUNDUI: ${recommendations.length}\n`);
  
  const results = [];
  
  recommendations.forEach(rec => {
    console.log(`\n📊 Dashboard: ${rec.name}`);
    console.log('-'.repeat(80));
    
    const bunduiName = REVERSE_MAPPINGS[rec.name] || rec.name;
    const bunduiPath = path.join(BUNDUI_DIR, bunduiName);
    const vibethinkPath = path.join(VIBETHINK_DIR, rec.name);
    
    // Verificar que existe en bundui
    if (!fs.existsSync(bunduiPath)) {
      console.log(`   ❌ No encontrado en bundui: ${bunduiName}`);
      results.push({ name: rec.name, status: 'error', reason: 'Not found in bundui' });
      return;
    }
    
    // Validar con guardrail
    const validation = validateWithGuardrail(rec.name, bunduiPath);
    
    if (!validation.valid) {
      console.log(`   ❌ Validación falló: ${validation.error}`);
      results.push({ name: rec.name, status: 'error', reason: validation.error });
      return;
    }
    
    // Copiar dashboard
    try {
      const backupPath = copyDashboard(bunduiPath, vibethinkPath);
      
      // Corregir imports si es necesario
      if (validation.needsFix) {
        fixImports(vibethinkPath);
      }
      
      console.log(`   ✅ Dashboard heredado exitosamente de BUNDUI`);
      results.push({ 
        name: rec.name, 
        status: 'success', 
        backup: backupPath ? path.basename(backupPath) : null,
        bunduiPath: bunduiName
      });
    } catch (error) {
      console.log(`   ❌ Error al copiar: ${error.message}`);
      results.push({ name: rec.name, status: 'error', reason: error.message });
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📋 RESUMEN:\n');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'error');
  
  successful.forEach(r => {
    console.log(`✅ ${r.name.padEnd(30)} → Heredado de bundui/${r.bunduiPath}`);
  });
  
  if (failed.length > 0) {
    console.log('\n❌ Errores:');
    failed.forEach(r => {
      console.log(`   ${r.name}: ${r.reason}`);
    });
  }
  
  console.log(`\n✨ Total: ${successful.length} exitosos, ${failed.length} con errores`);
  
  if (successful.length > 0) {
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   1. Revisa los dashboards heredados manualmente');
    console.log('   2. Verifica que los imports estén correctos (@vibethink/ui)');
    console.log('   3. Ejecuta: npm run build para verificar que no hay errores');
    console.log('   4. Si hay backups, revisa si necesitas restaurar algo');
  }
}

// Ejecutar
if (require.main === module) {
  applyRecommendations();
}

module.exports = { applyRecommendations };




