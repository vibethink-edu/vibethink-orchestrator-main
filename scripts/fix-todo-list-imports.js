#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TODO_APP_PATH = 'C:\\IA Marcelo Labs\\vibethink-orchestrator-main\\apps\\dashboard\\app\\dashboard-bundui\\todo-list-app';

const fixes = [
  // Components que importan desde nivel superior
  {
    file: 'components/add-todo-sheet.tsx',
    replacements: [
      { from: 'from "./store"', to: 'from "../store"' },
      { from: 'from "./schemas"', to: 'from "../schemas"' },
      { from: 'from "@/app/dashboard/(auth)/apps/todo-list-app/enum"', to: 'from "../enum"' }
    ]
  },
  {
    file: 'components/todo-detail-sheet.tsx',
    replacements: [
      { from: 'from "./store"', to: 'from "../store"' },
      { from: 'from "./enum"', to: 'from "../enum"' }
    ]
  },
  {
    file: 'components/todo-item.tsx',
    replacements: [
      { from: 'from "./store"', to: 'from "../store"' },
      { from: 'from "./enum"', to: 'from "../enum"' },
      { from: 'from "@/app/dashboard/(auth)/apps/todo-list-app/enum"', to: 'from "../enum"' }
    ]
  },
  {
    file: 'components/todo-list.tsx',
    replacements: [
      { from: 'from "./components/todo-item"', to: 'from "./todo-item"' },
      { from: 'from "./store"', to: 'from "../store"' },
      { from: 'from "./components/status-tabs"', to: 'from "./status-tabs"' },
      { from: 'from "@/app/dashboard/(auth)/apps/todo-list-app/enum"', to: 'from "../enum"' }
    ]
  },
  {
    file: 'components/status-tabs.tsx',
    replacements: [
      { from: 'from "./store"', to: 'from "../store"' },
      { from: 'from "@/app/dashboard/(auth)/apps/todo-list-app/enum"', to: 'from "../enum"' }
    ]
  },
  // Archivo tasks.tsx en raíz
  {
    file: 'tasks.tsx',
    replacements: [
      { from: 'from "@/app/dashboard/(auth)/apps/todo-list-app/enum"', to: 'from "./enum"' },
      { from: 'from "./store"', to: 'from "./store"' }
    ]
  }
];

console.log('🔧 Arreglando imports de Todo-List...\n');

let fixed = 0;

fixes.forEach(({ file, replacements }) => {
  const filePath = path.join(TODO_APP_PATH, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  No encontrado: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  replacements.forEach(({ from, to }) => {
    // Escapar caracteres especiales para regex
    const fromEscaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(fromEscaped, 'g');
    content = content.replace(regex, to);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
    fixed++;
  } else {
    console.log(`⏭️  ${file} (sin cambios)`);
  }
});

console.log(`\n📊 Resumen:`);
console.log(`   ✅ Archivos arreglados: ${fixed}/${fixes.length}\n`);

if (fixed > 0) {
  console.log('✨ Reinicia el navegador para aplicar cambios\n');
}







