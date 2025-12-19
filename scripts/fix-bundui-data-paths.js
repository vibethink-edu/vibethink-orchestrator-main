#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const bundui = 'C:\\IA Marcelo Labs\\vibethink-orchestrator-main\\apps\\dashboard\\app\\dashboard-bundui';

// Apps que necesitan arreglo
const apps = [
  { name: 'tasks', file: 'page.tsx' },
  { name: 'api-keys', file: 'page.tsx' },
  { name: 'pos-system', file: 'page.tsx' }
];

console.log('🔧 Arreglando rutas de datos en Bundui apps...\n');

let fixed = 0;

apps.forEach(app => {
  const filePath = path.join(bundui, app.name, app.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  No encontrado: ${app.name}/${app.file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Pattern: @/app/dashboard/(auth)/apps/{app-name}/data/{file}
  // Replace con: ./data/{file}
  
  // Tasks: @/app/dashboard/(auth)/apps/tasks/data/tasks.json → ./data/tasks.json
  content = content.replace(
    /@\/app\/dashboard\/\(auth\)\/apps\/tasks\/data\/([^"']+)/g,
    './data/$1'
  );
  
  // API Keys: @/app/dashboard/(auth)/apps/api-keys/data.json → ./data.json
  content = content.replace(
    /@\/app\/dashboard\/\(auth\)\/apps\/api-keys\/data\.json/g,
    './data.json'
  );
  
  // POS System: @/app/dashboard/(auth)/apps/pos-system/data/* → ./data/*
  content = content.replace(
    /@\/app\/dashboard\/\(auth\)\/apps\/pos-system\/data\/([^"']+)/g,
    './data/$1'
  );
  
  // Generic pattern for any app
  const appNameEscaped = app.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `@/app/dashboard/\\(auth\\)/apps/${appNameEscaped}/data/([^"']+)`,
    'g'
  );
  content = content.replace(regex, './data/$1');
  
  // Also fix patterns without /data/ subdir
  const regexDirect = new RegExp(
    `@/app/dashboard/\\(auth\\)/apps/${appNameEscaped}/([^"']+\\.json)`,
    'g'
  );
  content = content.replace(regexDirect, './$1');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${app.name}/${app.file}`);
    fixed++;
  } else {
    console.log(`⏭️  ${app.name}/${app.file} (sin cambios)`);
  }
});

console.log(`\n📊 Resumen:`);
console.log(`   ✅ Archivos arreglados: ${fixed}/${apps.length}\n`);

if (fixed > 0) {
  console.log('✨ Reinicia el servidor para aplicar cambios\n');
}



