/**
 * Compare dashboard-bundui vs dashboard-vibethink
 * 
 * Purpose: Identificar dashboards disponibles en cada sistema y sus diferencias
 */

const fs = require('fs');
const path = require('path');

// Rutas
const BUNDUI_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');
const VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');

// Obtener directorios (dashboards)
function getDashboards(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => !dirent.name.includes('.backup'))
    .map(dirent => dirent.name)
    .sort();
}

// Main
console.log('\n🔍 COMPARACIÓN: dashboard-bundui vs dashboard-vibethink\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const bunduiDashboards = getDashboards(BUNDUI_DIR);
const vibethinkDashboards = getDashboards(VIBETHINK_DIR);

console.log(`📊 Estadísticas:\n`);
console.log(`   dashboard-bundui:    ${bunduiDashboards.length} dashboards`);
console.log(`   dashboard-vibethink: ${vibethinkDashboards.length} dashboards\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Dashboards solo en Bundui
const onlyInBundui = bunduiDashboards.filter(d => !vibethinkDashboards.includes(d));
console.log(`✅ Solo en dashboard-bundui (${onlyInBundui.length}):\n`);
if (onlyInBundui.length > 0) {
  onlyInBundui.forEach(d => {
    console.log(`   - ${d}`);
    console.log(`     URL: http://localhost:3005/dashboard-bundui/${d}`);
  });
} else {
  console.log('   (ninguno)');
}
console.log('');

// Dashboards solo en VibeThink
const onlyInVibeThink = vibethinkDashboards.filter(d => !bunduiDashboards.includes(d));
console.log(`✅ Solo en dashboard-vibethink (${onlyInVibeThink.length}):\n`);
if (onlyInVibeThink.length > 0) {
  onlyInVibeThink.forEach(d => {
    console.log(`   - ${d}`);
    console.log(`     URL: http://localhost:3005/dashboard-vibethink/${d}`);
  });
} else {
  console.log('   (ninguno)');
}
console.log('');

// Dashboards en ambos
const inBoth = bunduiDashboards.filter(d => vibethinkDashboards.includes(d));
console.log(`✅ En ambos sistemas (${inBoth.length}):\n`);
if (inBoth.length > 0) {
  inBoth.forEach(d => {
    console.log(`   - ${d}`);
    console.log(`     Bundui:    http://localhost:3005/dashboard-bundui/${d}`);
    console.log(`     VibeThink: http://localhost:3005/dashboard-vibethink/${d}`);
  });
} else {
  console.log('   (ninguno)');
}
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Generar checklist de pruebas
console.log('📋 CHECKLIST DE PRUEBAS:\n');
console.log('1. Índices principales:');
console.log('   [ ] http://localhost:3005/dashboard-bundui');
console.log('   [ ] http://localhost:3005/dashboard-vibethink\n');

console.log('2. Dashboards únicos en Bundui:');
if (onlyInBundui.length > 0) {
  onlyInBundui.forEach(d => {
    console.log(`   [ ] http://localhost:3005/dashboard-bundui/${d}`);
  });
} else {
  console.log('   (ninguno)');
}
console.log('');

console.log('3. Dashboards únicos en VibeThink:');
if (onlyInVibeThink.length > 0) {
  onlyInVibeThink.forEach(d => {
    console.log(`   [ ] http://localhost:3005/dashboard-vibethink/${d}`);
  });
} else {
  console.log('   (ninguno)');
}
console.log('');

console.log('4. Dashboards en ambos (comparar visuales):');
if (inBoth.length > 0) {
  inBoth.forEach(d => {
    console.log(`   [ ] ${d} - Comparar ambas versiones`);
  });
} else {
  console.log('   (ninguno)');
}
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Resumen
console.log('📊 RESUMEN:\n');
if (onlyInBundui.length === 0 && onlyInVibeThink.length === 0 && inBoth.length > 0) {
  console.log('   ✅ Ambos sistemas tienen EXACTAMENTE los mismos dashboards');
  console.log('   📝 Próximo paso: Comparar visualmente para verificar que se vean igual\n');
} else if (onlyInBundui.length === 0 && onlyInVibeThink.length === 0) {
  console.log('   ⚠️ Ambos sistemas están VACÍOS');
  console.log('   📝 Considera agregar dashboards\n');
} else {
  console.log('   ⚠️ Los sistemas tienen dashboards DIFERENTES');
  console.log(`   📝 Bundui tiene ${onlyInBundui.length} exclusivos`);
  console.log(`   📝 VibeThink tiene ${onlyInVibeThink.length} exclusivos`);
  console.log(`   📝 Comparten ${inBoth.length} dashboards\n`);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');












