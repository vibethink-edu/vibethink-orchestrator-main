const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../apps/dashboard/src/shared/components/bundui-premium/components/layout/sidebar-bundui/nav-main.tsx');

console.log('🧹 Limpiando rutas de vibethink del sidebar bundui...\n');

let content = fs.readFileSync(sidebarPath, 'utf8');

// Buscar líneas con /dashboard-vibethink/
const lines = content.split('\n');
let removedCount = 0;
let cleanedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Si la línea contiene /dashboard-vibethink/, comentarla
  if (line.includes('/dashboard-vibethink/') && !line.trim().startsWith('//')) {
    cleanedLines.push(line.replace(/^(\s*)(.*)$/, '$1// $2 // MOVIDO A VIBETHINK-SIDEBAR'));
    removedCount++;
    console.log(`❌ Comentado: ${line.trim().substring(0, 60)}...`);
  } else {
    cleanedLines.push(line);
  }
}

if (removedCount > 0) {
  content = cleanedLines.join('\n');
  fs.writeFileSync(sidebarPath, content, 'utf8');
  console.log(`\n✅ ${removedCount} rutas de vibethink comentadas en bundui sidebar`);
} else {
  console.log('✅ No se encontraron rutas de vibethink en bundui sidebar (ya está limpio)');
}





