#!/usr/bin/env node

/**
 * Script para comparar dashboards comunes entre dashboard-vibethink y dashboard-bundui
 * Determina cuál versión es más nueva o actualizada
 */

const fs = require('fs');
const path = require('path');

const VIBETHINK_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-vibethink');
const BUNDUI_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui');

function getDirectories(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && !dirent.name.includes('backup'))
    .map(dirent => dirent.name)
    .sort();
}

function getLastModifiedTime(dir) {
  if (!fs.existsSync(dir)) return null;
  
  let maxTime = 0;
  
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory() && !file.startsWith('.') && !file.includes('backup')) {
        walkDir(filePath);
      } else if (stats.isFile()) {
        const mtime = stats.mtime.getTime();
        if (mtime > maxTime) {
          maxTime = mtime;
        }
      }
    }
  }
  
  walkDir(dir);
  return maxTime > 0 ? new Date(maxTime) : null;
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return { files: 0, components: 0, hooks: 0, types: 0 };
  
  let count = { files: 0, components: 0, hooks: 0, types: 0 };
  
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory() && !file.startsWith('.') && !file.includes('backup')) {
        if (file === 'components') count.components++;
        if (file === 'hooks') count.hooks++;
        walkDir(filePath);
      } else if (stats.isFile() && file.endsWith('.tsx') || file.endsWith('.ts')) {
        count.files++;
        if (file.includes('types') || file === 'types.ts') count.types++;
      }
    }
  }
  
  walkDir(dir);
  return count;
}

function compareDashboards() {
  const vibethinkDirs = getDirectories(VIBETHINK_DIR);
  const bunduiDirs = getDirectories(BUNDUI_DIR);
  
  const common = vibethinkDirs.filter(d => bunduiDirs.includes(d));
  const onlyVibethink = vibethinkDirs.filter(d => !bunduiDirs.includes(d));
  const onlyBundui = bunduiDirs.filter(d => !vibethinkDirs.includes(d));
  
  console.log('='.repeat(80));
  console.log('COMPARACIÓN DE DASHBOARDS');
  console.log('='.repeat(80));
  console.log();
  
  console.log(`📊 Dashboards en dashboard-vibethink: ${vibethinkDirs.length}`);
  console.log(`📊 Dashboards en dashboard-bundui: ${bunduiDirs.length}`);
  console.log(`🔄 Dashboards comunes: ${common.length}`);
  console.log();
  
  let comparison = [];
  
  if (common.length > 0) {
    console.log('='.repeat(80));
    console.log('DASHBOARDS COMUNES - ANÁLISIS DE VERSIONES');
    console.log('='.repeat(80));
    console.log();
    
    for (const dashboard of common) {
      const vibethinkPath = path.join(VIBETHINK_DIR, dashboard);
      const bunduiPath = path.join(BUNDUI_DIR, dashboard);
      
      const vibethinkTime = getLastModifiedTime(vibethinkPath);
      const bunduiTime = getLastModifiedTime(bunduiPath);
      
      const vibethinkCount = countFiles(vibethinkPath);
      const bunduiCount = countFiles(bunduiPath);
      
      let newer = 'igual';
      let timeDiff = 0;
      
      if (vibethinkTime && bunduiTime) {
        timeDiff = vibethinkTime.getTime() - bunduiTime.getTime();
        if (timeDiff > 86400000) { // Más de 1 día
          newer = 'vibethink';
        } else if (timeDiff < -86400000) {
          newer = 'bundui';
        }
      } else if (vibethinkTime && !bunduiTime) {
        newer = 'vibethink';
      } else if (!vibethinkTime && bunduiTime) {
        newer = 'bundui';
      }
      
      comparison.push({
        name: dashboard,
        vibethinkTime,
        bunduiTime,
        newer,
        timeDiff,
        vibethinkCount,
        bunduiCount
      });
    }
    
    // Ordenar por diferencia de tiempo (más reciente primero)
    comparison.sort((a, b) => {
      const aTime = a.vibethinkTime ? a.vibethinkTime.getTime() : 0;
      const bTime = b.vibethinkTime ? b.vibethinkTime.getTime() : 0;
      return bTime - aTime;
    });
    
    for (const comp of comparison) {
      console.log(`📁 ${comp.name.toUpperCase()}`);
      console.log(`   Vibethink: ${comp.vibethinkTime ? comp.vibethinkTime.toISOString().split('T')[0] : 'N/A'} (${comp.vibethinkCount.files} archivos, ${comp.vibethinkCount.components} components, ${comp.vibethinkCount.hooks} hooks)`);
      console.log(`   Bundui:    ${comp.bunduiTime ? comp.bunduiTime.toISOString().split('T')[0] : 'N/A'} (${comp.bunduiCount.files} archivos, ${comp.bunduiCount.components} components, ${comp.bunduiCount.hooks} hooks)`);
      
      if (comp.newer === 'vibethink') {
        const daysDiff = Math.floor(comp.timeDiff / 86400000);
        console.log(`   ⚡ MÁS RECIENTE: Vibethink (${daysDiff} días más nuevo)`);
      } else if (comp.newer === 'bundui') {
        const daysDiff = Math.floor(Math.abs(comp.timeDiff) / 86400000);
        console.log(`   ⚡ MÁS RECIENTE: Bundui (${daysDiff} días más nuevo)`);
      } else {
        console.log(`   ⚖️  SIMILAR (diferencia < 1 día)`);
      }
      
      // Comparar complejidad
      const vibethinkTotal = comp.vibethinkCount.files + comp.vibethinkCount.components + comp.vibethinkCount.hooks;
      const bunduiTotal = comp.bunduiCount.files + comp.bunduiCount.components + comp.bunduiCount.hooks;
      
      if (vibethinkTotal > bunduiTotal * 1.2) {
        console.log(`   📈 Vibethink tiene más contenido (${vibethinkTotal} vs ${bunduiTotal} elementos)`);
      } else if (bunduiTotal > vibethinkTotal * 1.2) {
        console.log(`   📈 Bundui tiene más contenido (${bunduiTotal} vs ${vibethinkTotal} elementos)`);
      }
      
      console.log();
    }
  }
  
  if (onlyVibethink.length > 0) {
    console.log('='.repeat(80));
    console.log('SOLO EN DASHBOARD-VIBETHINK');
    console.log('='.repeat(80));
    onlyVibethink.forEach(d => console.log(`  ✅ ${d}`));
    console.log();
  }
  
  if (onlyBundui.length > 0) {
    console.log('='.repeat(80));
    console.log('SOLO EN DASHBOARD-BUNDUI');
    console.log('='.repeat(80));
    onlyBundui.forEach(d => console.log(`  📦 ${d}`));
    console.log();
  }
  
  // Resumen
  if (common.length > 0) {
    console.log('='.repeat(80));
    console.log('RESUMEN');
    console.log('='.repeat(80));
    
    const vibethinkNewer = comparison.filter(c => c.newer === 'vibethink').length;
    const bunduiNewer = comparison.filter(c => c.newer === 'bundui').length;
    const similar = comparison.filter(c => c.newer === 'igual').length;
    
    console.log(`Vibethink más reciente: ${vibethinkNewer}`);
    console.log(`Bundui más reciente: ${bunduiNewer}`);
    console.log(`Similares: ${similar}`);
    console.log();
  }
}

compareDashboards();

