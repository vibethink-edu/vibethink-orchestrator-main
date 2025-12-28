#!/usr/bin/env node

/**
 * Script para copiar archivos de datos desde Bundui Reference al monorepo
 * y arreglar las rutas en los archivos page.tsx
 */

const fs = require('fs');
const path = require('path');

const BUNDUI_REF = 'C:\\IA Marcelo Labs\\bundui\\shadcn-ui-kit-dashboard\\app\\dashboard\\(auth)\\apps';
const MONOREPO_APPS = 'C:\\IA Marcelo Labs\\vibethink-orchestrator-main\\apps\\dashboard\\app\\dashboard-bundui';

// Lista de apps que necesitan archivos de datos
const appsWithData = [
  { app: 'chat', files: ['data/chats.json', 'data/messages.json'] },
  { app: 'mail', files: ['data/mails.json'] },
  { app: 'todo-list-app', files: ['data/todos.json'] },
  { app: 'tasks', files: ['data/tasks.json'] },
  { app: 'calendar', files: ['data/events.json'] },
  { app: 'file-manager', files: ['data/files.json', 'data/folders.json'] },
  { app: 'pos-system', files: ['data/products.json', 'data/orders.json'] }
];

console.log('🔧 Arreglando archivos de datos de Bundui apps...\n');

let filesFixed = 0;
let routesFixed = 0;

appsWithData.forEach(({ app, files }) => {
  console.log(`📁 Procesando ${app}...`);
  
  files.forEach(file => {
    const refFile = path.join(BUNDUI_REF, app, file);
    const monorepoFile = path.join(MONOREPO_APPS, app, file);
    
    // Crear directorio si no existe
    const monorepoDir = path.dirname(monorepoFile);
    if (!fs.existsSync(monorepoDir)) {
      fs.mkdirSync(monorepoDir, { recursive: true });
      console.log(`  ✅ Directorio creado: ${monorepoDir}`);
    }
    
    // Copiar archivo si existe en reference y no en monorepo
    if (fs.existsSync(refFile)) {
      if (!fs.existsSync(monorepoFile)) {
        fs.copyFileSync(refFile, monorepoFile);
        console.log(`  ✅ Archivo copiado: ${file}`);
        filesFixed++;
      } else {
        console.log(`  ⏭️  Ya existe: ${file}`);
      }
    } else {
      console.log(`  ⚠️  No encontrado en reference: ${file}`);
    }
  });
  
  // Arreglar rutas en page.tsx
  const pageTsx = path.join(MONOREPO_APPS, app, 'page.tsx');
  if (fs.existsSync(pageTsx)) {
    let content = fs.readFileSync(pageTsx, 'utf8');
    let modified = false;
    
    // Reemplazar rutas incorrectas
    const badPattern1 = /apps\/dashboard\/app\/dashboard-bundui\/apps\//g;
    const badPattern2 = /apps\/dashboard\/apps\//g;
    
    if (badPattern1.test(content)) {
      content = content.replace(badPattern1, 'app/dashboard-bundui/');
      modified = true;
    }
    
    if (badPattern2.test(content)) {
      content = content.replace(badPattern2, 'app/dashboard-bundui/');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(pageTsx, content, 'utf8');
      console.log(`  ✅ Rutas arregladas en page.tsx`);
      routesFixed++;
    }
  }
  
  console.log('');
});

console.log('━'.repeat(50));
console.log(`✅ Completado!`);
console.log(`   Archivos copiados: ${filesFixed}`);
console.log(`   Rutas arregladas: ${routesFixed}`);
console.log('━'.repeat(50));















